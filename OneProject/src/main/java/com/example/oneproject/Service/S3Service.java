package com.example.oneproject.Service;

import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.net.URL;
import java.time.Duration;

@Service
public class S3Service {

    private final String bucketName = "hana-leeej-bucket"; // 당신의 버킷 이름
    private final Region region = Region.AP_NORTHEAST_3;    // 오사카 리전

    public String generatePresignedUrl(String objectKey) {
        try (S3Presigner presigner = S3Presigner.builder()
                .region(region)
                .credentialsProvider(DefaultCredentialsProvider.create()) // EC2 인스턴스의 IAM Role 사용
                .build()) {

            System.out.println("🔍 Presigned URL 생성 대상 key: " + objectKey);

            // S3에서 접근하려는 객체 설정
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectKey) // 예: lodUploads/파일명.png
                    .build();

            // 프리사인드 URL 생성 요청
            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .getObjectRequest(getObjectRequest)
                    .signatureDuration(Duration.ofMinutes(15)) // URL 유효시간 (예: 15분)
                    .build();

            URL presignedUrl = presigner.presignGetObject(presignRequest).url();

            System.out.println("✅ 생성된 Presigned URL: " + presignedUrl);

            return presignedUrl.toString();
        }
    }
}