package com.example.oneproject.Entity;

import jakarta.persistence.*;

@Entity
public class CityContent {

    @Id  // 기본 키를 나타내는 애너테이션
    @GeneratedValue(strategy= GenerationType.IDENTITY)    // 프로젝트에 연결된 DB의 numbering 전략을 따른다.
    private long id;    // 시퀀스, auto_increment

    @Column(length = 100, nullable = false)
    private String cityName;  // 제목

    @Column(nullable = true, columnDefinition = "TEXT")
    private String cityDetail;  // 내용

    @Column(nullable = true, columnDefinition = "TEXT")
    private String cityImag;  // 이미지 URL

    @Column(length = 5, nullable = true)
    private String cityState;  // 상태 (5글자 제한)

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getCityDetail() {
        return cityDetail;
    }

    public void setCityDetail(String cityDetail) {
        this.cityDetail = cityDetail;
    }

    public String getCityImag() {
        return cityImag;
    }

    public void setCityImag(String cityImag) {
        this.cityImag = cityImag;
    }

    public String getCityState() {
        return cityState;
    }

    public void setCityState(String cityState) {
        this.cityState = cityState;
    }
}
