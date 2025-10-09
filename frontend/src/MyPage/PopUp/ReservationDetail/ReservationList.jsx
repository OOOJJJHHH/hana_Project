// 📁 src/components/ReservationList.jsx
import React from "react";

const ReservationList = ({
                             pendingReservations,
                             handleApprove,
                             handleReject,
                             handleConsultation,
                             styles,
                         }) => {
    if (pendingReservations.length === 0) {
        return (
            <div style={styles.noReservations}>
                <p>현재 대기 중인 예약 요청이 없습니다.</p>
            </div>
        );
    }

    return (
        <div style={styles.reservationList}>
            {pendingReservations.map((reservation) => (
                <div key={reservation.reservationId} style={styles.reservationCard}>
                    <div style={styles.cardInfo}>
                        <p><strong>예약 번호:</strong> {reservation.reservationCode}</p>
                        <p><strong>예약자 ID:</strong> {reservation.userId}</p>
                        <p><strong>숙소명:</strong> {reservation.clodName}</p>
                        <p><strong>객실명:</strong> {reservation.roomName}</p>
                        <p><strong>체크인:</strong> {new Date(reservation.startDate).toLocaleDateString()}</p>
                        <p><strong>체크아웃:</strong> {new Date(reservation.endDate).toLocaleDateString()}</p>
                        <p><strong>요청사항:</strong> {reservation.memo || "없음"}</p>
                    </div>

                    <div style={styles.cardActions}>
                        <button
                            style={{ ...styles.actionButton, ...styles.approveButton }}
                            onClick={() => handleApprove(reservation.reservationId)}
                        >
                            ✅ 예약 수락
                        </button>
                        <button
                            style={{ ...styles.actionButton, ...styles.rejectButton }}
                            onClick={() => handleReject(reservation.reservationId)}
                        >
                            ❌ 예약 거절
                        </button>
                        <button
                            style={{ ...styles.actionButton, ...styles.consultButton }}
                            onClick={() => handleConsultation(reservation)}
                        >
                            💬 상담
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReservationList;
