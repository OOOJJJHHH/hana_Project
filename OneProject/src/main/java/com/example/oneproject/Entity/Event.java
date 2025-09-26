package com.example.oneproject.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity // "이 클래스는 데이터베이스 테이블의 설계도입니다!" 라고 알려주는 딱지
@Getter @Setter // Lombok 라이브러리를 사용해서 getter/setter 메소드를 자동으로 만들어주는 마법
@NoArgsConstructor // 기본 생성자를 자동으로 만들어주는 마법
public class Event {

    @Id // 이 필드가 테이블의 대표 ID(기본 키)임을 나타냅니다.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // ID 값을 데이터베이스가 알아서 1씩 자동 증가시킵니다.
    private Long id;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false) // 긴 텍스트를 저장할 수 있는 칸
    private String description;

    @Column(nullable = false)
    private String startDate;

    @Column(nullable = false)
    private String endDate;

    @Column(nullable = false)
    private String imageUrl; // S3에 저장된 이미지의 주소(URL)를 저장할 칸

}