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
    public void processBatchUpdate(Long lodId, List<Long> deletedRoomIds,
                                   List<RoomUpdateDto> updates,
                                   Map<String, List<MultipartFile>> roomImageMap) throws IOException {

        ClodContent clodContent = lodRepository.findById(lodId)
                .orElseThrow(() -> new IllegalArgumentException("숙소 ID가 유효하지 않습니다. lodId = " + lodId));

        System.out.println("🚀 [START] processBatchUpdate()");
        System.out.println("숙소 ID: " + lodId);
        System.out.println("삭제 대상 객실 수: " + (deletedRoomIds != null ? deletedRoomIds.size() : 0));
        System.out.println("업데이트 대상 객실 수: " + (updates != null ? updates.size() : 0));
        System.out.println("이미지 맵 수: " + (roomImageMap != null ? roomImageMap.size() : 0));

        // ✅ 삭제 처리
        if (deletedRoomIds != null) {
            for (Long roomId : deletedRoomIds) {
                System.out.println("🗑️ 삭제할 객실 ID: " + roomId);
                List<RoomImages> images = roomImagesRepository.findByRoomId(roomId);
                for (RoomImages img : images) {
                    System.out.println("🧼 삭제할 이미지 Key: " + img.getImageKey());
                    s3Uploader.deleteFile(img.getImageKey());
                }
                roomImagesRepository.deleteByRoomId(roomId);
                roomRepository.deleteById(roomId);
                System.out.println("✅ 객실 " + roomId + " 삭제 완료");
            }
        }

        // ✅ 추가 또는 수정 처리
        for (RoomUpdateDto dto : updates) {
            if (dto.isNew()) {
                // --- 새 객실 추가 ---
                System.out.println("🆕 새 객실 추가: " + dto.getRoomName());
                Room newRoom = new Room();
                newRoom.setRoomName(dto.getRoomName());
                newRoom.setPrice(dto.getPrice());
                newRoom.setClodContent(clodContent);
                roomRepository.save(newRoom);
                System.out.println("✅ 객실 저장 완료 (ID: " + newRoom.getId() + ")");

                String key = "roomImage_" + dto.getId(); // e.g., roomImage_new_0
                List<MultipartFile> files = roomImageMap.get(key);
                System.out.println("📦 첨부 이미지 수 (" + key + "): " + (files != null ? files.size() : 0));
                saveRoomImages(newRoom, files);
            } else {
                // --- 기존 객실 수정 ---
                Long roomId = dto.getParsedId();
                if (roomId == null) {
                    System.out.println("⚠️ 잘못된 roomId: " + dto.getId());
                    continue;
                }

                System.out.println("✏️ 기존 객실 수정: ID = " + roomId);
                Room existingRoom = roomRepository.findById(roomId)
                        .orElseThrow(() -> new IllegalArgumentException("Room not found: " + roomId));

                existingRoom.setRoomName(dto.getRoomName());
                existingRoom.setPrice(dto.getPrice());
                roomRepository.save(existingRoom);
                System.out.println("✅ 수정 저장 완료");

                // 기존 이미지 삭제
                List<RoomImages> oldImages = roomImagesRepository.findByRoomId(roomId);
                for (RoomImages img : oldImages) {
                    System.out.println("🧼 기존 이미지 삭제: " + img.getImageKey());
                    s3Uploader.deleteFile(img.getImageKey());
                }
                roomImagesRepository.deleteByRoomId(roomId);

                // 새 이미지 저장
                String key = "roomImage_" + roomId;
                List<MultipartFile> files = roomImageMap.get(key);
                System.out.println("📤 새 이미지 수 (" + key + "): " + (files != null ? files.size() : 0));
                saveRoomImages(existingRoom, files);
            }
        }

        System.out.println("✅ [END] processBatchUpdate()");
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
