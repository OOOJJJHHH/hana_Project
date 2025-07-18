package com.example.oneproject.DTO;

import com.example.oneproject.Enum.ReservationStatus;
import java.time.LocalDateTime;

public class ReservationRequestDTO {
    private String userId;
    private Long clodContentId;
    private Long roomId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int nights;
    private String memo;
    private boolean isPaid;
    private ReservationStatus status;

    // Getter & Setter 생략 가능 (Lombok @Data 사용해도 됨)

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

    public ReservationStatus getStatus() {
        return status;
    }

    public void setStatus(ReservationStatus status) {
        this.status = status;
    }
}
