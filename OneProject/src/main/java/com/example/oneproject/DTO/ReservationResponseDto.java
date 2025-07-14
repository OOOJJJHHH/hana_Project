package com.example.oneproject.dto;

import java.time.LocalDateTime;

public class ReservationResponseDto {
    private Long reservationId;
    private String reservationCode;
    private String status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int nights;
    private boolean isPaid;

    // 생성자, getter, setter 생략 가능

    public ReservationResponseDto() {}

    public Long getReservationId() {
        return reservationId;
    }
    public void setReservationId(Long reservationId) {
        this.reservationId = reservationId;
    }

    public String getReservationCode() {
        return reservationCode;
    }
    public void setReservationCode(String reservationCode) {
        this.reservationCode = reservationCode;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
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

    public boolean isPaid() {
        return isPaid;
    }
    public void setPaid(boolean paid) {
        isPaid = paid;
    }
}
