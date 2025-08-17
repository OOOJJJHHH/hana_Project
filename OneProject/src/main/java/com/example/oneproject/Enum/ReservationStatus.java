package com.example.oneproject.Enum;

public enum ReservationStatus {
    PENDING,    // 예약 요청 대기 중
    APPROVED,   // 예약 승인됨
    REJECTED,   // 예약 거절됨
    RESERVED,   // 예약 확정됨 (필요에 따라 APPROVED와 구분)
    CANCELED,   // 예약 취소됨
    COMPLETED   // 예약 완료
}
