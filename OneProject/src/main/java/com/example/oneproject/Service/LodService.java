package com.example.oneproject.Service;

import com.example.oneproject.Entity.CityContent;
import com.example.oneproject.Entity.ClodContent;
import com.example.oneproject.Entity.Room;
import com.example.oneproject.Repository.CLodRepository;
import com.example.oneproject.Repository.CityReporesitory;
import com.example.oneproject.config.S3config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class LodService{

    private final CLodRepository clodRepository;
    private final S3Uploader s3Uploader;

    public LodService(CLodRepository clodRepository, S3Uploader s3Uploader) {
        this.clodRepository = clodRepository;
        this.s3Uploader = s3Uploader;
    }

    //숙소저장
    public void savelod(ClodContent clodContent) {
        clodRepository.save(clodContent);
    }


    //숙소정보 get
    public List<ClodContent> getAllLods() {
        return clodRepository.findAll();
    }

    //특정 도시이름으로 숙소정보 get
    public List<ClodContent> getCityByName(String city_name) {
        return clodRepository.findByLodCity(city_name);
    }

    public void saveLodWithImage(
            String lodOwner,
            String lodCity,
            String lodName,
            String lodLocation,
            String lodCallNum,
            MultipartFile lodImag,
            List<Room> roomList,
            MultipartFile roomImag0,
            MultipartFile roomImag1,
            MultipartFile roomImag2
    ) {
        try {
            // 숙소 정보 설정
            ClodContent content = new ClodContent();
            content.setLodOwner(lodOwner);
            content.setLodCity(lodCity);
            content.setLodName(lodName);
            content.setLodLocation(lodLocation);
            content.setLodCallNum(lodCallNum);
            content.setLodPrice(new BigDecimal("0"));

            // S3 업로드
            String lodImageUrl = s3Uploader.uploadFile("hana-leeej-bucket", "lodUploads", lodImag);
            content.setLodImag(lodImageUrl);

            // 객실 이미지들
            MultipartFile[] roomImgs = {roomImag0, roomImag1, roomImag2};
            for (int i = 0; i < roomList.size(); i++) {
                Room room = roomList.get(i);
                if (i < roomImgs.length && roomImgs[i] != null && !roomImgs[i].isEmpty()) {
                    String roomImageUrl = s3Uploader.uploadFile("hana-leeej-bucket", "roomUploads", roomImgs[i]);
                    room.setRoomImag(roomImageUrl);
                }
                room.setClodContent(content);
            }

            content.setRooms(roomList);
            clodRepository.save(content);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("이미지 업로드 및 숙소 저장에 실패했습니다.", e);
        }
    }
}
