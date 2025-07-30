package com.example.oneproject.Service;

import com.example.oneproject.DTO.RoomUpdateDto;
import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Entity.RoomImages;
import com.example.oneproject.Repository.CLodRepository;
import com.example.oneproject.Repository.RoomImagesRepository;
import com.example.oneproject.Repository.RoomRepository;
import com.example.oneproject.Repository.WishListRepository;
import jakarta.transaction.Transactional;
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
    public void processBatchUpdate(
            Long lodId,
            List<Long> deletedRoomIds,
            List<RoomUpdateDto> updates,
            Map<String, MultipartFile> roomImages
    ) throws IOException {

        System.out.println("=== processBatchUpdate() 실행 ===");

        ClodContent clod = lodRepository.findById(lodId)
                .orElseThrow(() -> new IllegalArgumentException("숙소 없음: " + lodId));

        for (Long delId : deletedRoomIds) {
            roomRepository.findById(delId).ifPresent(room -> {
                System.out.println(">> 객실 삭제 처리: ID = " + delId);

                // 1. 관련 이미지 삭제
                for (RoomImages img : room.getRoomImages()) {
                    System.out.println("   - 이미지 삭제: " + img.getImageKey());
                    s3Uploader.deleteFile(img.getImageKey());
                }

                // 2. 관련 위시리스트 삭제
                wishListRepository.deleteByRoomId(delId);
                System.out.println("   - 관련 WishList 삭제 완료");

                // 3. 객실 삭제
                roomRepository.delete(room);
                System.out.println("   - 객실 삭제 완료");
            });
        }

        for (RoomUpdateDto dto : updates) {
            MultipartFile file = roomImages != null ? roomImages.get(dto.getId()) : null;

            if (dto.isNew()) {
                Room newRoom = Room.builder()
                        .roomName(dto.getRoomName())
                        .price(dto.getPrice())
                        .clodContent(clod)
                        .build();

                if (file != null && !file.isEmpty()) {
                    String key = s3Uploader.uploadFile("roomUploads", file);
                    newRoom.addRoomImage(RoomImages.builder().imageKey(key).build());
                }

                roomRepository.save(newRoom);
                System.out.println(">> 새 객실 추가 완료: " + newRoom.getRoomName());

            } else {
                Long rid = dto.getParsedId();
                roomRepository.findById(rid).ifPresent(room -> {
                    room.setRoomName(dto.getRoomName());
                    room.setPrice(dto.getPrice());

                    if (file != null && !file.isEmpty()) {
                        try {
                            for (RoomImages img : new ArrayList<>(room.getRoomImages())) {
                                s3Uploader.deleteFile(img.getImageKey());
                            }
                            room.clearRoomImages();

                            String key = s3Uploader.uploadFile("roomUploads", file);
                            room.addRoomImage(RoomImages.builder().imageKey(key).build());
                        } catch (IOException e) {
                            throw new RuntimeException("이미지 업로드 실패", e);
                        }
                    }

                    System.out.println(">> 기존 객실 수정 완료: ID=" + rid);
                });
            }
        }

        System.out.println("=== processBatchUpdate() 완료 ===");
    }


}
