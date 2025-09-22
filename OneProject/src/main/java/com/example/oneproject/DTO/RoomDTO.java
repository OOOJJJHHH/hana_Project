package com.example.oneproject.DTO;

import java.util.List;

public class RoomDTO {
    private Long roomId;
    private String roomName;
    private List<RoomImageDto> roomImages;

    public RoomDTO() {}

    public RoomDTO(Long roomId, String roomName, List<RoomImageDto> roomImages) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.roomImages = roomImages;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public List<RoomImageDto> getRoomImages() {
        return roomImages;
    }

    public void setRoomImages(List<RoomImageDto> roomImages) {
        this.roomImages = roomImages;
    }
}