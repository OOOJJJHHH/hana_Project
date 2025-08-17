package com.example.oneproject.DTO;

import com.example.oneproject.Entity.Reservation;
import com.example.oneproject.Enum.ReservationStatus;

import java.time.LocalDateTime;

public class ReservationResponseDTO {

    private Long reservationId;
    private String reservationCode;
    private Long userId;

    private String clodName;
    private String roomName;

    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String memo;
    private ReservationStatus status;

    // 생성자
    public ReservationResponseDTO(Reservation reservation) {
        this.reservationId = reservation.getId();
        this.reservationCode = reservation.getReservationCode();
        this.userId = reservation.getUser().getId();
        this.clodName = reservation.getClodContent().getLodName();
        this.roomName = reservation.getRoom().getRoomName();
        this.startDate = reservation.getStartDate();
        this.endDate = reservation.getEndDate();
        this.memo = reservation.getMemo();
        this.status = reservation.getStatus();
    }

    // Getters
    public Long getReservationId() {
        return reservationId;
    }

    public String getReservationCode() {
        return reservationCode;
    }

    public Long getUserId() {
        return userId;
    }

    public String getClodName() {
        return clodName;
    }

    public String getRoomName() {
        return roomName;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public String getMemo() {
        return memo;
    }

    public ReservationStatus getStatus() {
        return status;
    }
}
