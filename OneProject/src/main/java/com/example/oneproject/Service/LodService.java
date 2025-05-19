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
    private final S3Client s3Client; // S3Client 주입

    // 생성자 주입 방식으로 리포지토리와 S3Client를 주입받음
    @Autowired
    public LodService(CLodRepository clodRepository, S3Client s3Client) {
        this.clodRepository = clodRepository;
        this.s3Client = s3Client;
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

            // 숙소 이미지 저장 + S3 업로드
            String lodFileName = UUID.randomUUID() + "_" + lodImag.getOriginalFilename();
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket("hana-leeej-bucket")
                    .key("lodUploads/" + lodFileName)
                    .acl("public-read")
                    .contentType(lodImag.getContentType())
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromInputStream(
                    lodImag.getInputStream(), lodImag.getSize()
            ));

            // S3 URL 저장
            String s3Url = "https://hana-leeej-bucket.s3.amazonaws.com/lodUploads/" + lodFileName;
            content.setLodImag(s3Url); // DB 등에 저장

            // 객실 이미지 저장 + S3 업로드
            MultipartFile[] roomImgs = {roomImag0, roomImag1, roomImag2};
            for (int i = 0; i < roomList.size(); i++) {
                Room room = roomList.get(i);
                if (i < roomImgs.length && roomImgs[i] != null && !roomImgs[i].isEmpty()) {
                    String roomFileName = UUID.randomUUID() + "_" + roomImgs[i].getOriginalFilename();
                    PutObjectRequest roomPutRequest = PutObjectRequest.builder()
                            .bucket("hana-leeej-bucket")
                            .key("roomUploads/" + roomFileName)
                            .acl("public-read")
                            // contentType을 지정하면 S3에서 파일을 열 때 MIME 타입이 정확하게 인식
                            .contentType(roomImgs[i].getContentType())
                            .build();

                    // RequestBody.fromInputStream(...)을 쓰는 방식은 MultipartFile을 직접 S3로 전송할 때 가장 많이 쓰
                    s3Client.putObject(roomPutRequest, RequestBody.fromInputStream(
                            roomImgs[i].getInputStream(), roomImgs[i].getSize()
                    ));

                    // S3 URL 저장
                    String roomS3Url = "https://hana-leeej-bucket.s3.amazonaws.com/roomUploads/" + roomFileName;
                    room.setRoomImag(roomS3Url);
                }
                room.setClodContent(content); // 객실에 숙소 정보 설정
            }

            content.setRooms(roomList); // 객실 리스트 설정
            clodRepository.save(content); // DB에 저장

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("이미지 업로드 및 숙소 저장에 실패했습니다.", e);
        }
    }
}
