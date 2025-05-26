package com.example.oneproject.DTO;

public class RoomAddPre {
    private Long id;
    private String roomName;
    private String roomImag;  // 프리사인드 URL
    private int price;

    public RoomAddPre(Long id, String roomName, String roomImag, int price) {
        this.id = id;
        this.roomName = roomName;
        this.roomImag = roomImag;
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
}