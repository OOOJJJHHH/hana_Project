package com.example.oneproject.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomName;
    private String roomImag;

    private int price; // ✅ 숙박 가격 필드 추가

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clod_content_id")
    @JsonBackReference
    private ClodContent clodContent;

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

    public String getRoomImag() {
        return roomImag;
    }

    public void setRoomImag(String roomImag) {
        this.roomImag = roomImag;
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
}
