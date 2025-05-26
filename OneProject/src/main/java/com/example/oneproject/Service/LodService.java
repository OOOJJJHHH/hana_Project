package com.example.oneproject.Service;

import com.example.oneproject.DTO.LodAddPre;
import com.example.oneproject.DTO.RoomAddPre;
import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Repository.CLodRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LodService {

    @Autowired
    private CLodRepository lodRepository; // ✅ CLodRepository로 정확하게 지정
    @Autowired
    private S3Service s3Service;

    // 숙소 저장
    @Autowired
    private S3Uploader s3Uploader;

    public void saveLodWithImages(
            String lodOwner,
            String lodCity,
            String lodName,
            String lodLocation,
            String lodCallNum,
            MultipartFile lodImag,
            List<Room> roomList,
            MultipartFile... roomImgs
    ) throws IOException {

        ClodContent content = new ClodContent();
        content.setLodOwner(lodOwner);
        content.setLodCity(lodCity);
        content.setLodName(lodName);
        content.setLodLocation(lodLocation);
        content.setLodCallNum(lodCallNum);

        // S3 업로드 (lodImag)
        String lodImageKey = s3Uploader.uploadFile("lodUploads", lodImag);
        content.setLodImag(lodImageKey);

        // 객실 이미지 업로드
        for (int i = 0; i < roomList.size(); i++) {
            Room room = roomList.get(i);
            if (i < roomImgs.length && roomImgs[i] != null && !roomImgs[i].isEmpty()) {
                String roomImageKey = s3Uploader.uploadFile("roomUploads", roomImgs[i]);
                room.setRoomImag(roomImageKey);
            }
            room.setClodContent(content);
        }

        content.setRooms(roomList);

        // DB 저장
        lodRepository.save(content);
    }




    // 모든 숙소 가져오기
    public List<ClodContent> getAllLods() {
        return lodRepository.findAll();
    }

    public List<ClodContent> getCityByName(String cityName) {
        return lodRepository.findByLodCity(cityName);
    }

    public List<ClodContent> findByLodCity(String cityName) {
        return lodRepository.findByLodCity(cityName);
    }





    /**
     * lodName으로 숙소 데이터 조회 후 DTO로 변환하여 반환
     * 숙소 및 객실 이미지 URL은 S3 프리사인드 URL로 변환
     */
    public LodAddPre getLodDtoByName(String lodName) {
        ClodContent content = lodRepository.findByLodName(lodName)
                .orElseThrow(() -> new RuntimeException("숙소 없음"));

        // 숙소 이미지 프리사인드 URL 변환
        String lodImageUrl = s3Service.generatePresignedUrl(content.getLodImag());

        // 객실 목록을 DTO로 변환 + 객실 이미지 프리사인드 URL 적용
        List<RoomAddPre> roomDtos = content.getRooms().stream()
                .map(room -> new RoomAddPre(
                        room.getId(),
                        room.getRoomName(),
                        s3Service.generatePresignedUrl(room.getRoomImag()),
                        room.getPrice()
                ))
                .collect(Collectors.toList());

        return new LodAddPre(
                content.getId(),
                content.getLodName(),
                content.getLodCity(),
                lodImageUrl,
                content.getLodLocation(),
                content.getLodOwner(),
                content.getLodCallNum(),
                roomDtos
        );
    }

}
