package com.example.oneproject.Service;

import com.example.oneproject.DTO.*;
import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Entity.RoomImages;
import com.example.oneproject.Repository.CLodRepository;
import com.example.oneproject.Repository.RoomImagesRepository;
import com.example.oneproject.Repository.RoomRepository;
import com.example.oneproject.Repository.WishListRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Comparator;


@Service
@RequiredArgsConstructor
public class RoomService {

    @Autowired
    private CLodRepository lodRepository; // ✅ CLodRepository로 정확하게 지정

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomImagesRepository roomImagesRepository;

    @Autowired
    private S3Service s3Service;

    // 숙소 저장
    @Autowired
    private S3Uploader s3Uploader;

    @Autowired
    private WishListRepository wishListRepository;


    // 기존 saveLodWithImages 메서드는 숙소와 객실을 함께 추가할 때 사용됩니다.
    // 여기서는 기존 로직을 유지하고, 업데이트 로직을 추가합니다.
    public void saveLodWithImages(
            String lodOwner,
            String lodCity,
            String lodName,
            String lodLocation,
            String lodCallNum,
            List<MultipartFile> lodImages,
            List<Room> roomList,
            Map<Integer, List<MultipartFile>> roomImageMap
    ) throws IOException {
        ClodContent content = new ClodContent();
        content.setLodOwner(lodOwner);
        content.setLodCity(lodCity);
        content.setLodName(lodName);
        content.setLodLocation(lodLocation);
        content.setLodCallNum(lodCallNum);

        // 숙소 이미지 (여러 개 → 하나의 대표 이미지만 저장하는 경우)
        if (!lodImages.isEmpty()) {
            String lodImageKey = s3Uploader.uploadFile("lodUploads", lodImages.get(0));
            content.setLodImag(lodImageKey);
        }

        // 객실 이미지 매핑
        for (int i = 0; i < roomList.size(); i++) {
            Room room = roomList.get(i);
            room.setClodContent(content);

            List<MultipartFile> images = roomImageMap.get(i);
            if (images != null && !images.isEmpty()) {
                List<RoomImages> imageEntities = new ArrayList<>();
                for (MultipartFile image : images) {
                    String uploadedKey = s3Uploader.uploadFile("roomUploads", image);
                    RoomImages roomImage = new RoomImages();
                    roomImage.setImageKey(uploadedKey);
                    roomImage.setRoom(room); // 양방향 관계 설정
                    imageEntities.add(roomImage);
                }
                room.setRoomImages(imageEntities); // Room 엔티티의 setRoomImages는 사용하지 않는 것이 좋지만, 초기 생성 시에는 괜찮습니다.
                // 실제 컬렉션 변경은 add/remove 메서드를 사용해야 합니다.
            }
        }
        content.setRooms(roomList);
        lodRepository.save(content);
    }


    @Transactional
    public void processBatchUpdate(Long lodId, List<Long> deletedRoomIds,
                                   List<RoomUpdateDto> updates,
                                   Map<String, List<MultipartFile>> roomImageMap) throws IOException {

        ClodContent clodContent = lodRepository.findById(lodId)
                .orElseThrow(() -> new IllegalArgumentException("숙소 ID가 유효하지 않습니다. lodId = " + lodId));

        System.out.println("🚀 [START] processBatchUpdate()");

        // ✅ 1. 객실 삭제
        for (Long roomId : deletedRoomIds) {
            System.out.println("🗑️ 삭제할 객실 ID: " + roomId);
            List<RoomImages> images = roomImagesRepository.findByRoomId(roomId);
            for (RoomImages img : images) {
                s3Uploader.deleteFile(img.getImageKey());
            }
            roomImagesRepository.deleteByRoomId(roomId);
            roomRepository.deleteById(roomId);
        }

        // ✅ 2. 객실 추가/수정
        for (RoomUpdateDto dto : updates) {
            if (dto.isNew()) {
                // --- 새로운 객실 추가 ---
                Room newRoom = new Room();
                newRoom.setRoomName(dto.getRoomName());
                newRoom.setPrice(dto.getPrice());
                newRoom.setClodContent(clodContent);
                roomRepository.save(newRoom);

                String key = "roomImage_" + dto.getId();
                saveRoomImages(newRoom, roomImageMap.get(key));

            } else {
                // --- 기존 객실 수정 ---
                Long roomId = dto.getParsedId();
                if (roomId == null) continue;

                Room existingRoom = roomRepository.findById(roomId)
                        .orElseThrow(() -> new IllegalArgumentException("Room not found: " + roomId));

                existingRoom.setRoomName(dto.getRoomName());
                existingRoom.setPrice(dto.getPrice());
                roomRepository.save(existingRoom);

                // ✅ 2-1. 전체 이미지 삭제
                if (Boolean.FALSE.equals(dto.getKeepExistingImages())) {
                    List<RoomImages> oldImages = roomImagesRepository.findByRoomId(roomId);
                    for (RoomImages img : oldImages) {
                        s3Uploader.deleteFile(img.getImageKey());
                    }
                    roomImagesRepository.deleteByRoomId(roomId);
                    System.out.println("🧨 전체 이미지 삭제: roomId = " + roomId);

                    // ✅ 2-2. 부분 이미지 삭제
                } else if (dto.getRemovedImageKeys() != null && !dto.getRemovedImageKeys().isEmpty()) {
                    for (String imageKey : dto.getRemovedImageKeys()) {
                        System.out.println("👉 삭제 요청된 이미지 키: " + imageKey);
                        Optional<RoomImages> imgOpt = roomImagesRepository.findByImageKey(imageKey);
                        if (imgOpt.isPresent()) {
                            s3Uploader.deleteFile(imageKey);
                            roomImagesRepository.delete(imgOpt.get());
                            System.out.println("❌ 개별 이미지 삭제됨: " + imageKey);
                        } else {
                            System.out.println("⚠️ DB에서 이미지 키 찾지 못함: " + imageKey);
                        }
                    }
                }

                // ✅ 2-3. 항상 새로운 이미지 저장 시도
                String key = "roomImage_" + roomId;
                saveRoomImages(existingRoom, roomImageMap.get(key));
            }
        }

        System.out.println("✅ [END] processBatchUpdate()");
    }

    // 검색해서 미리보기
    @Transactional(readOnly = true)
    public List<CityHotelDTO> searchHotelsByName(String keyword) {
        List<ClodContent> results = lodRepository.findByLodNameContainingIgnoreCase(keyword);

        // 도시별로 그룹화
        Map<String, List<ClodContent>> groupedByCity = results.stream()
                .collect(Collectors.groupingBy(ClodContent::getLodCity));

        return groupedByCity.entrySet().stream()
                .map(entry -> {
                    List<HotelDTO> hotels = entry.getValue().stream()
                            .map(hotel -> {
                                // 숙소 이미지 Presigned URL 생성
                                String presignedHotelImg = s3Service.generatePresignedUrl(hotel.getLodImag());

                                List<String> roomNames = hotel.getRooms().stream()
                                        .map(Room::getRoomName)
                                        .collect(Collectors.toList());

                                List<RoomDTO> roomDtos = hotel.getRooms().stream()
                                        .map(room -> {
                                            List<RoomImageDto> roomImageDtos = room.getRoomImages().stream()
                                                    .map(img -> {
                                                        RoomImageDto dto = new RoomImageDto();
                                                        dto.setRoomId(room.getId());
                                                        dto.setImageKey(s3Service.generatePresignedUrl(img.getImageKey()));
                                                        return dto;
                                                    })
                                                    .collect(Collectors.toList());
                                            return new RoomDTO(room.getId(), room.getRoomName(), roomImageDtos);
                                        })
                                        .collect(Collectors.toList());

                                return new HotelDTO(hotel.getLodName(), hotel.getLodCity(),
                                        presignedHotelImg, roomNames, roomDtos);
                            })
                            .collect(Collectors.toList());

                    return new CityHotelDTO(entry.getKey(), hotels);
                })
                .collect(Collectors.toList());
    }




    private void saveRoomImages(Room room, List<MultipartFile> files) throws IOException {
        if (files == null || files.isEmpty()) return;

        List<RoomImages> imageEntities = new ArrayList<>();
        for (MultipartFile file : files) {
            String key = s3Uploader.uploadFile("roomUploads", file);
            RoomImages img = new RoomImages();
            img.setRoom(room);
            img.setImageKey(key);
            imageEntities.add(img);
        }
        roomImagesRepository.saveAll(imageEntities);
    }



}
