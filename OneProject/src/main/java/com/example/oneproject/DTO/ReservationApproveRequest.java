package com.example.oneproject.DTO;

public class ReservationApproveRequest {
    private Long reservationId;

    public ReservationApproveRequest() {}

    public ReservationApproveRequest(Long reservationId) {
        this.reservationId = reservationId;
    }

    public Long getReservationId() { return reservationId; }
    public void setReservationId(Long reservationId) { this.reservationId = reservationId; }
}
