package com.example.oneproject.Entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClodContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String lodOwner;
    private String lodCity;
    private String lodName;
    private String lodLocation;
    private String lodCallNum;
    private String lodImag;

    @OneToMany(mappedBy = "clodContent", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @BatchSize(size = 10)
    private List<Room> rooms;

    // ✅ 추가: 예약과의 양방향 관계 설정
    @OneToMany(mappedBy = "clodContent", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Reservation> reservations;

    // ✅ 추가: 리뷰와의 양방향 관계 설정
    @OneToMany(mappedBy = "clodContent", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Review> reviews;

    // ✅ 추가: 찜 목록과의 양방향 관계 설정 (이미 있는 WishList 엔티티 활용)
    @OneToMany(mappedBy = "clodContent", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<WishList> wishLists;


    // ✅ Getter / Setter
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


    public String getLodImag() {
        return lodImag;
    }

    public void setLodImag(String lodImag) {
        this.lodImag = lodImag;
    }

    public List<Room> getRooms() {
        return rooms;
    }

    public void setRooms(List<Room> rooms) {
        this.rooms = rooms;
    }
}
