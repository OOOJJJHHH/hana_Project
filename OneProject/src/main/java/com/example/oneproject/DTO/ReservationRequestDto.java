package com.example.oneproject.dto;

import java.time.LocalDateTime;

public class ReservationRequestDto {
    private Long userId;
    private Long lodgingId;
    private Long roomId;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private int nights;

    private String memo;
    private boolean isPaid;

    // 기본 생성자
    public ReservationRequestDto() {}

    // Getter / Setter
    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getLodgingId() {
        return lodgingId;
    }
    public void setLodgingId(Long lodgingId) {
        this.lodgingId = lodgingId;
    }

    public Long getRoomId() {
        return roomId;
    }
    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }
    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }
    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public int getNights() {
        return nights;
    }
    public void setNights(int nights) {
        this.nights = nights;
    }

    public String getMemo() {
        return memo;
    }
    public void setMemo(String memo) {
        this.memo = memo;
    }

    public boolean isPaid() {
        return isPaid;
    }
    public void setPaid(boolean paid) {
        isPaid = paid;
    }
}
