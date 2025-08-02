package com.example.oneproject.DTO;

import java.util.List;

public class RoomUpdateDto {
    private String id;
    private String roomName;
    private Integer price;
    private Boolean keepExistingImages;
    private List<String> removedImageKeys; // ✅ 변경됨

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

    // --- Getters & Setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }

    public Boolean getKeepExistingImages() { return keepExistingImages; }
    public void setKeepExistingImages(Boolean keepExistingImages) { this.keepExistingImages = keepExistingImages; }

    public List<String> getRemovedImageKeys() { return removedImageKeys; }
    public void setRemovedImageKeys(List<String> removedImageKeys) { this.removedImageKeys = removedImageKeys; }
}
