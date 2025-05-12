package com.example.oneproject.Entity;

import jakarta.persistence.*;
import org.w3c.dom.Text;
import java.util.*;
import java.math.BigDecimal;

@Entity
public class ClodContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)    // 프로젝트에 연결된 DB의 numbering 전략을 따른다.
    private Long id;    // 시퀀스, auto_increment

    // 숙소 주인
    @Column(length = 1000, nullable = false)
    private String lodOwner;

    // 숙소가 위치한 도시
    @Column(length = 1000, nullable = false)
    private String lodCity;

    // 숙소 이름
    @Column(length = 1000, nullable = false)
    private String lodName;

    // 숙소 위치 (길이 제한 없이 TEXT 타입으로)
    @Column(nullable = false, columnDefinition = "TEXT")
    private String lodLocation;

    // 숙소 전화번호
    @Column(length = 100, nullable = false)
    private String lodCallNum;

    // 숙소 가격
    @Column(nullable = false)
    private BigDecimal lodPrice;

    // 숙소 이미지
    @Column(nullable = false, columnDefinition = "TEXT")
    private String lodImag;


    @OneToMany(mappedBy = "clodContent", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Room> rooms = new ArrayList<>();

    // Getter/Setter 추가
    public List<Room> getRooms() {
        return rooms;
    }

    public void setRooms(List<Room> rooms) {
        this.rooms = rooms;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLodOwner() {
        return lodOwner;
    }

    public void setLodOwner(String lodOwner) {
        this.lodOwner = lodOwner;
    }

    public String getLodCity() {
        return lodCity;
    }

    public void setLodCity(String lodCity) {
        this.lodCity = lodCity;
    }

    public String getLodName() {
        return lodName;
    }

    public void setLodName(String lodName) {
        this.lodName = lodName;
    }

    public String getLodLocation() {
        return lodLocation;
    }

    public void setLodLocation(String lodLocation) {
        this.lodLocation = lodLocation;
    }

    public String getLodCallNum() {
        return lodCallNum;
    }

    public void setLodCallNum(String lodCallNum) {
        this.lodCallNum = lodCallNum;
    }

    public BigDecimal getLodPrice() {
        return lodPrice;
    }

    public void setLodPrice(BigDecimal lodPrice) {
        this.lodPrice = lodPrice;
    }

    public String getLodImag() {
        return lodImag;
    }

    public void setLodImag(String lodImag) {
        this.lodImag = lodImag;
    }
}

