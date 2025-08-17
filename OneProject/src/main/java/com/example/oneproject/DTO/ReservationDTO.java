package com.example.oneproject.DTO;

import com.example.oneproject.Enum.ReservationStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationDTO {
    private Long reservationId;
    private String reservationCode;
    private String userId; // 예약자 ID
    private String clodName; // 숙소 이름
    private String roomName; // 객실 이름
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private int nights;
    private String memo;
    private ReservationStatus status;
}