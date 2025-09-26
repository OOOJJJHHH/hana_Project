package com.example.oneproject.DTO;

import java.util.List;

public class CheapestRoomWithImagesDTO {
    private Long roomId;
    private String roomName;
    private int price;
    private Long clodContentId;
    private String clodName;
    private List<String> roomImages; // S3 Presigned URL 리스트

    public CheapestRoomWithImagesDTO(Long roomId, String roomName, int price, Long clodContentId, String clodName, List<String> roomImages) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.price = price;
        this.clodContentId = clodContentId;
        this.clodName = clodName;
        this.roomImages = roomImages;
    }

    // Getter / Setter
    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public int getPrice() { return price; }
    public void setPrice(int price) { this.price = price; }

    public Long getClodContentId() { return clodContentId; }
    public void setClodContentId(Long clodContentId) { this.clodContentId = clodContentId; }

    public String getClodName() { return clodName; }
    public void setClodName(String clodName) { this.clodName = clodName; }

    public List<String> getRoomImages() { return roomImages; }
    public void setRoomImages(List<String> roomImages) { this.roomImages = roomImages; }
}
