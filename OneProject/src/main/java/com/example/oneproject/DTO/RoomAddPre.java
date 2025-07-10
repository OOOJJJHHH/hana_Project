package com.example.oneproject.DTO;

import java.util.List;

public class RoomAddPre {
    private Long id;
    private String roomName;
    private List<String> roomImages;  // 여러 이미지 URL
    private int price;

    public RoomAddPre(Long id, String roomName, List<String> roomImages, int price) {
        this.id = id;
        this.roomName = roomName;
        this.roomImages = roomImages;
        this.price = price;
    }

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

    public List<String> getRoomImages() {
        return roomImages;
    }

    public void setRoomImages(List<String> roomImages) {
        this.roomImages = roomImages;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }
}
