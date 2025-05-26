package com.example.oneproject.Service;

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





    // 특정 숙소 이름(lodName)으로 숙소 데이터를 가져오는 메서드
    public ClodContent getLodEntityByName(String lodName) {

        // lodName을 기반으로 숙소(ClodContent)를 데이터베이스에서 조회
        // 없으면 예외 발생 (RuntimeException)
        ClodContent content = lodRepository.findByLodName(lodName)
                .orElseThrow(() -> new RuntimeException("숙소 없음"));

        // lodImag에는 S3에 저장된 이미지의 '객체 키(key)'만 들어 있으므로
        // 이 키를 가지고 프리사인드 URL을 생성해서 클라이언트가 직접 접근 가능하게 변환
        content.setLodImag(s3Service.generatePresignedUrl(content.getLodImag())); // ✅ 숙소 이미지 프리사인드 URL 설정

        // 해당 숙소에 연결된 객실(Room) 리스트를 순회
        for (Room room : content.getRooms()) {
            // 각 객실 이미지도 마찬가지로 객체 키로 되어 있으므로 프리사인드 URL로 변환
            room.setRoomImag(s3Service.generatePresignedUrl(room.getRoomImag())); // ✅ 객실 이미지 프리사인드 URL 설정
        }

        // 숙소 엔티티(객실 포함)를 리턴 (React 등 클라이언트에 전달)
        return content;
    }

}
