package com.example.oneproject.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class S3Uploader {

    @Autowired
    private S3Client s3Client;

    private final String bucket = "hana-leeej-bucket"; // 버킷명을 상수로 관리

    public String uploadFile(String dir, MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String key = dir + "/" + fileName;

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        String fileUrl = "https://" + bucket + ".s3.ap-northeast-2.amazonaws.com/" + key;
        return fileUrl;
    }
    public void deleteFile(String key) {
        s3Client.deleteObject(builder -> builder
                .bucket(bucket)
                .key(key)
                .build());
    }
}
