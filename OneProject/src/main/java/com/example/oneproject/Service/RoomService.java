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
            List<RoomUpdateDto> roomUpdates,
            Map<String, List<MultipartFile>> roomImageMap
    ) throws IOException {

        // 1. 숙소 찾기
        ClodContent lod = lodRepository.findById(lodId)
                .orElseThrow(() -> new IllegalArgumentException("해당 숙소 없음: " + lodId));

        // 2. 삭제 처리
        for (Long roomId : deletedRoomIds) {
            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new IllegalArgumentException("Room not found: " + roomId));

            // S3 이미지 삭제
            List<RoomImages> roomImages = roomImagesRepository.findByRoomId(roomId);
            for (RoomImages image : roomImages) {
                s3Uploader.deleteFile(image.getImageKey());
            }

            roomRepository.delete(room); // cascade로 이미지도 삭제되게 설정돼 있으면 이걸로 충분
        }

        // 3. 수정 & 추가
        for (RoomUpdateDto dto : roomUpdates) {
            if (dto.isNew()) {
                // 신규 객실 추가
                Room room = new Room();
                room.setRoomName(dto.getRoomName());
                room.setPrice(dto.getPrice());
                room.setClodContent(lod); // 숙소와 연결

                // 이미지 처리
                String prefix = "roomImage_" + dto.getId(); // e.g., roomImage_new_0
                List<MultipartFile> files = roomImageMap.get(prefix);

                if (files != null && !files.isEmpty()) {
                    List<RoomImages> imageList = new ArrayList<>();
                    for (MultipartFile file : files) {
                        String key = s3Uploader.uploadFile("roomUploads", file);
                        RoomImages img = new RoomImages();
                        img.setImageKey(key);
                        img.setRoom(room);
                        imageList.add(img);
                    }
                    room.setRoomImages(imageList); // 양방향 연동
                }

                roomRepository.save(room);

            } else {
                // 기존 객실 수정
                Long roomId = dto.getParsedId();
                Room room = roomRepository.findById(roomId)
                        .orElseThrow(() -> new IllegalArgumentException("Room not found: " + roomId));

                room.setRoomName(dto.getRoomName());
                room.setPrice(dto.getPrice());

                // 기존 이미지 삭제
                List<RoomImages> oldImages = roomImagesRepository.findByRoomId(roomId);
                for (RoomImages image : oldImages) {
                    s3Uploader.deleteFile(image.getImageKey());
                }
                roomImagesRepository.deleteAll(oldImages); // DB 삭제

                // 새 이미지 업로드
                String prefix = "roomImage_" + roomId;
                List<MultipartFile> newImages = roomImageMap.get(prefix);
                if (newImages != null && !newImages.isEmpty()) {
                    List<RoomImages> newImageEntities = new ArrayList<>();
                    for (MultipartFile file : newImages) {
                        String key = s3Uploader.uploadFile("roomUploads", file);
                        RoomImages img = new RoomImages();
                        img.setImageKey(key);
                        img.setRoom(room);
                        newImageEntities.add(img);
                    }
                    room.setRoomImages(newImageEntities);
                }
                // 변경된 room은 save 생략 가능 (JPA 영속성 컨텍스트에서 자동 추적됨)
            }
        }
    }


    private int getNewRoomIndex(RoomUpdateDto dto) {
        // roomImage_new_0_X → new_0 부분의 숫자
        // 프론트에서 id: `new_0`, `new_1` 등으로 보냈으므로
        try {
            return Integer.parseInt(dto.getId().toString().split("_")[1]);
        } catch (Exception e) {
            return 0; // fallback
        }
    }


}
