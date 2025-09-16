import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const statusMap = {
    PENDING: { label: "승인 대기 중", color: "#FFA500" },
    APPROVED: { label: "승인됨", color: "#007bff" },
    REJECTED: { label: "거절됨", color: "#dc3545" },
    RESERVED: { label: "확정됨", color: "#17a2b8" },
    CANCELED: { label: "취소됨", color: "#6c757d" },
    COMPLETED: { label: "완료됨", color: "#28a745" },
};

const Revation = () => {
    const [reservations, setReservations] = useState([]);
    const loginUser = JSON.parse(localStorage.getItem("loginUser"));
    const navigate = useNavigate();

    const fetchReservations = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/reservations/${loginUser.uId}`,
                { withCredentials: true }
            );
            setReservations(data);

            // ✅ 콘솔 출력 개선
            console.log("가져온 예약 내역:", data);
        } catch (err) {
            console.error("예약 내역 조회 실패", err);
        }
    };

    useEffect(() => {
        if (loginUser?.uId) fetchReservations();
    }, []);

    const updateStatus = async (reservationId, status) => {
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/reservations/${reservationId}/status`,
                { status },
                { withCredentials: true }
            );
            fetchReservations();
        } catch (err) {
            console.error("상태 변경 실패", err);
        }
    };

    const deleteReservation = async (reservationId) => {
        const confirmDelete = window.confirm("정말로 이 예약을 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/api/reservations/${reservationId}`,
                { withCredentials: true }
            );
            setReservations((prev) =>
                prev.filter((r) => r.reservationId !== reservationId)
            );
        } catch (err) {
            console.error("예약 삭제 실패", err);
        }
    };

    const goToHotelDetail = (lodName) => {
        navigate(`/hotel-detail?name=${encodeURIComponent(lodName)}`);
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>📅 나의 예약 내역</h2>

            {reservations.length === 0 ? (
                <p style={styles.noReservations}>예약 내역이 없습니다.</p>
            ) : (
                <div style={styles.scrollArea}>
                    {reservations.map((r) => {
                        const status = statusMap[r.status] || {
                            label: "알 수 없음",
                            color: "#999",
                        };

                        return (
                            <div
                                key={r.reservationId}
                                style={{
                                    ...styles.card,
                                    border: `2px solid ${status.color}`,
                                }}
                            >
                                <h3 style={styles.cardTitle}>{r.clodName || "이름 없음"}</h3>
                                <p style={styles.text}>
                                    <strong>예약 기간:</strong>{" "}
                                    {r.startDate ? r.startDate.slice(0, 10) : "-"} ~{" "}
                                    {r.endDate ? r.endDate.slice(0, 10) : "-"}
                                </p>
                                <div
                                    style={{
                                        ...styles.statusBadge,
                                        backgroundColor: status.color,
                                    }}
                                >
                                    {status.label}
                                </div>

                                <div style={styles.buttonGroup}>
                                    {["REJECTED", "RESERVED", "APPROVED"].includes(r.status) && (
                                        <button
                                            onClick={() =>
                                                updateStatus(r.reservationId, "COMPLETED")
                                            }
                                            style={styles.greenButton}
                                        >
                                            ✅ 완료 처리
                                        </button>
                                    )}

                                    {!["COMPLETED", "CANCELED"].includes(r.status) && (
                                        <button
                                            onClick={() =>
                                                updateStatus(r.reservationId, "CANCELED")
                                            }
                                            style={styles.redButton}
                                        >
                                            ❌ 예약 취소
                                        </button>
                                    )}

                                    <button
                                        onClick={() => goToHotelDetail(r.clodName)}
                                        style={styles.blueButton}
                                    >
                                        🔍 상세 보기
                                    </button>
                                </div>

                                {r.status === "CANCELED" && (
                                    <button
                                        onClick={() => deleteReservation(r.reservationId)}
                                        style={styles.deleteButton}
                                        title="예약 완전 삭제"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "1000px",
        margin: "2rem auto",
        padding: "1rem",
    },
    heading: {
        marginBottom: "1rem",
    },
    noReservations: {
        textAlign: "center",
        color: "#777",
    },
    scrollArea: {
        maxHeight: "800px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        paddingRight: "8px",
    },
    card: {
        borderRadius: "12px",
        padding: "1.2rem",
        backgroundColor: "#fff",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
        position: "relative",
    },
    cardTitle: {
        marginBottom: "0.5rem",
    },
    text: {
        margin: "4px 0",
    },
    statusBadge: {
        display: "inline-block",
        padding: "0.3rem 0.7rem",
        color: "#fff",
        borderRadius: "999px",
        fontSize: "0.85rem",
        marginTop: "0.5rem",
    },
    buttonGroup: {
        marginTop: "1rem",
    },
    greenButton: {
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        padding: "0.5rem 1rem",
        marginRight: "0.5rem",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.9rem",
    },
    redButton: {
        backgroundColor: "#dc3545",
        color: "#fff",
        border: "none",
        padding: "0.5rem 1rem",
        marginRight: "0.5rem",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.9rem",
    },
    blueButton: {
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        padding: "0.5rem 1rem",
        marginRight: "0.5rem",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.9rem",
    },
    deleteButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        background: "none",
        border: "none",
        fontSize: "20px",
        color: "#aaa",
        cursor: "pointer",
    },
};

export default Revation;
