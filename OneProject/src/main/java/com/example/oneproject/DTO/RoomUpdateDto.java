package com.example.oneproject.DTO;

import java.util.List;

public class RoomUpdateDto {
    private Long id;  // 수정할 객실 아이디, 신규는 null
    private String roomName;
    private int price;
    private List<String> roomImages;  // 이미지 S3 key 리스트

    // getter/setter

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

    public List<String> getRoomImages() {
        return roomImages;
    }

    public void setRoomImages(List<String> roomImages) {
        this.roomImages = roomImages;
    }
}