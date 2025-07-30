package com.example.oneproject.DTO;

import java.util.List;

public class RoomUpdateDto {
    private String id;          // "123" 또는 "new_0"
    private String roomName;
    private Integer price;

    public boolean isNew() {
        return id != null && id.startsWith("new_");
    }

    public Long getParsedId() {
        if (isNew()) return null;
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }
}
