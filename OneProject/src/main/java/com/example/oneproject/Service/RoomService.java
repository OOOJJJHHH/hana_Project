package com.example.oneproject.Service;

import com.example.oneproject.DTO.RoomUpdateDto;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Entity.RoomImages;
import com.example.oneproject.Repository.RoomImagesRepository;
import com.example.oneproject.Repository.RoomRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class RoomService {
    private final RoomRepository roomRepo;
    private final RoomImagesRepository roomImagesRepo;
    private final S3Uploader uploader;



    @Transactional
    public Room updateRoom(Long roomId, RoomUpdateDto dto) {
        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("객실이 존재하지 않습니다."));

        room.setRoomName(dto.getRoomName());
        room.setPrice(dto.getPrice());

        // 이미지 교체
        roomImagesRepo.deleteAll(room.getRoomImages());
        room.getRoomImages().clear();

        for (String imgKey : dto.getRoomImages()) {
            RoomImages img = new RoomImages();
            img.setImageKey(imgKey);
            img.setRoom(room);
            room.getRoomImages().add(img);
        }

        return roomRepo.save(room);
    }

    @Transactional
    public void deleteRoom(Long roomId) {
        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("객실이 존재하지 않습니다."));
        roomRepo.delete(room);
    }

}
