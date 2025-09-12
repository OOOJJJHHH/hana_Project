package com.example.oneproject.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.BatchSize;

import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomName;

    private int price; // 숙박 가격 필드

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "clod_content_id")
    private ClodContent clodContent;

    // orphanRemoval = true 설정 시, 이 컬렉션의 요소를 추가/제거하는 방식으로 관계 관리해야 함
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @BatchSize(size = 10)
    private List<RoomImages> roomImages = new ArrayList<>();

    // ✅ 추가: 예약과의 양방향 관계
    @OneToMany(mappedBy = "room", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();

    // ✅ 추가: 리뷰와의 양방향 관계
    @OneToMany(mappedBy = "room", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();

    // ✅ 추가: 찜 목록과의 양방향 관계
    @OneToMany(mappedBy = "room", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<WishList> wishLists = new ArrayList<>();

    // --- Getter / Setter (변경 없음) ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }

    public ClodContent getClodContent() {
        return clodContent;
    }

    public void setClodContent(ClodContent clodContent) {
        this.clodContent = clodContent;
    }

    public List<RoomImages> getRoomImages() {
        return roomImages;
    }

    // --- 이 setRoomImages 메서드는 직접 사용하지 않는 것을 권장합니다. ---
    // Hibernate의 컬렉션 관리에 문제를 일으킬 수 있으므로,
    // 컬렉션 객체 자체를 교체하는 대신 addRoomImage/removeRoomImage/clearRoomImages를 사용하세요.
    public void setRoomImages(List<RoomImages> roomImages) {
        this.roomImages = roomImages;
    }


    // --- 🚨 중요 수정: 컬렉션 내용 변경 메서드 🚨 ---

    // 1. 객실 이미지 추가 메서드 (양방향 관계 설정 포함)
    public void addRoomImage(RoomImages roomImage) {
        // 이미 추가되어 있다면 다시 추가하지 않음
        if (!this.roomImages.contains(roomImage)) {
            this.roomImages.add(roomImage);
            roomImage.setRoom(this); // 양방향 관계 설정
        }
    }

    // 2. 객실 이미지 제거 메서드 (양방향 관계 해제 포함)
    public void removeRoomImage(RoomImages roomImage) {
        if (this.roomImages.contains(roomImage)) {
            this.roomImages.remove(roomImage);
            roomImage.setRoom(null); // 양방향 관계 해제 (고아 객체로 만들어져 orphanRemoval=true에 의해 삭제)
        }
    }

    // 3. 기존 updateRoomImages 메서드를 안전하게 수정
    // 이 메서드를 통해 기존 이미지를 모두 제거하고 새로운 이미지를 추가합니다.
    // @PreRemove 어노테이션 제거! 이 메서드는 생명주기 콜백이 아닌 비즈니스 로직에서 호출됩니다.
    public void updateRoomImages(List<RoomImages> newImages) {
        // 기존 이미지들을 임시 리스트에 복사하여 안전하게 제거
        List<RoomImages> imagesToRemove = new ArrayList<>(this.roomImages);
        for (RoomImages img : imagesToRemove) {
            removeRoomImage(img); // removeRoomImage를 통해 개별적으로 제거
        }

        // 새로운 이미지들 추가
        for (RoomImages img : newImages) {
            addRoomImage(img); // addRoomImage를 통해 개별적으로 추가
        }
    }

    // (선택 사항) 모든 이미지를 명시적으로 비우는 메서드
    public void clearRoomImages() {
        List<RoomImages> imagesToClear = new ArrayList<>(this.roomImages);
        for (RoomImages img : imagesToClear) {
            removeRoomImage(img);
        }
    }
}