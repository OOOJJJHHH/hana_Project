package com.example.oneproject.DTO;

import java.util.List;

public class RoomReviewSummaryDTO {
    private Long roomId;
    private String roomName;
    private String clodName; // 숙소 이름
    private double averageRating;
    private long reviewCount;
    private List<String> roomImages; // S3 Presigned URL 포함

    public RoomReviewSummaryDTO(Long roomId, String roomName, String clodName,
                                double averageRating, long reviewCount, List<String> roomImages) {
        this.roomId = roomId;
        this.roomName = roomName;
        this.clodName = clodName;
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
        this.roomImages = roomImages;
    }

    // Getter / Setter
    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public String getClodName() { return clodName; }
    public void setClodName(String clodName) { this.clodName = clodName; }

    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }

    public long getReviewCount() { return reviewCount; }
    public void setReviewCount(long reviewCount) { this.reviewCount = reviewCount; }

    public List<String> getRoomImages() { return roomImages; }
    public void setRoomImages(List<String> roomImages) { this.roomImages = roomImages; }
}
