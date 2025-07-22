package com.example.oneproject.DTO;


public class ReviewDTO {
    private String userId;
    private Long clodContentId;
    private Long roomId;
    private double rating;
    private String comment;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Long getClodContentId() {
        return clodContentId;
    }

    public void setClodContentId(Long clodContentId) {
        this.clodContentId = clodContentId;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
