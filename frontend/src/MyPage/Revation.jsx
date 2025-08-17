//예약내역
import React, { useEffect, useState } from "react";
import axios from "axios";

const Revation = () => {
    const [reservations, setReservations] = useState([]);
    const loginUser = JSON.parse(localStorage.getItem("loginUser"));

    const fetchReservations = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/reservations/${loginUser.uId}`,
                { withCredentials: true }
            );
            setReservations(response.data);
        } catch (err) {
            console.error("예약 내역 조회 실패", err);
        }
    };

    useEffect(() => {
        if (loginUser?.uId) {
            fetchReservations();
        }
    }, []);

    const handleStatusUpdate = async (reservationId, status) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/reservations/${reservationId}/status`,
                { status },
                { withCredentials: true }
            );
            fetchReservations(); // 갱신
        } catch (err) {
            console.error("상태 변경 실패", err);
        }
    };

    const statusText = {
        PENDING: "승인 대기 중",
        APPROVED: "승인됨",
        REJECTED: "거절됨",
        RESERVED: "예약 확정됨",
        CANCELED: "예약 취소됨",
        COMPLETED: "예약 완료",
    };

    return (
        <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
            <h2>나의 예약 내역</h2>

            {reservations.length === 0 ? (
                <p>예약 내역이 없습니다.</p>
            ) : (
                reservations.map((reservation) => (
                    <div
                        key={reservation.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "10px",
                            padding: "1rem",
                            marginBottom: "1rem",
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        <p><strong>숙소명:</strong> {reservation.propertyName}</p>
                        <p><strong>예약일자:</strong> {reservation.date}</p>
                        <p><strong>상태:</strong> {statusText[reservation.status]}</p>

                        {reservation.status === "REJECTED" && (
                            <p style={{ color: "red" }}>예약이 거절되었습니다.</p>
                        )}

                        {reservation.status === "RESERVED" && (
                            <button
                                onClick={() =>
                                    handleStatusUpdate(reservation.id, "COMPLETED")
                                }
                                style={{
                                    marginTop: "0.5rem",
                                    backgroundColor: "#4CAF50",
                                    color: "#fff",
                                    border: "none",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                예약 완료 확인
                            </button>
                        )}

                        {reservation.status === "RESERVED" && (
                            <button
                                onClick={() =>
                                    handleStatusUpdate(reservation.id, "CANCELED")
                                }
                                style={{
                                    marginTop: "0.5rem",
                                    marginLeft: "0.5rem",
                                    backgroundColor: "#f44336",
                                    color: "#fff",
                                    border: "none",
                                    padding: "0.5rem 1rem",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                예약 취소
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Revation;
