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

    private int price; // ✅ 숙박 가격 필드 추가

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonBackReference
    @JoinColumn(name = "clod_content_id")
    private ClodContent clodContent;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @BatchSize(size = 10)
    private List<RoomImages> roomImages = new ArrayList<>();

    // ✅ Getter / Setter
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

    public void setRoomImages(List<RoomImages> roomImages) {
        this.roomImages = roomImages;
    }

    public void updateRoomImages(List<RoomImages> newImages) {
        this.roomImages.clear();
        this.roomImages.addAll(newImages);
    }
}
