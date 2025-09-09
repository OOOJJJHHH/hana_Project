import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ 상세보기 이동용

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
    const navigate = useNavigate(); // ✅ 페이지 이동 함수

    const fetchReservations = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/reservations/${loginUser.uId}`,
                { withCredentials: true }
            );
            setReservations(data);
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
        const confirm = window.confirm("정말로 이 예약을 삭제하시겠습니까?");
        if (!confirm) return;

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

    // ✅ 상세 보기 페이지로 이동
    const goToHotelDetail = (lodName) => {
        navigate(`/hotel-detail?name=${encodeURIComponent(lodName)}`);
    };

    return (
        <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "1rem" }}>
            <h2 style={{ marginBottom: "1rem" }}>📅 나의 예약 내역</h2>

            {reservations.length === 0 ? (
                <p style={{ textAlign: "center", color: "#777" }}>
                    예약 내역이 없습니다.
                </p>
            ) : (
                reservations.map((r) => {
                    const status = statusMap[r.status];
                    return (
                        <div
                            key={r.reservationId}
                            style={{
                                position: "relative",
                                border: `2px solid ${status.color}`,
                                borderRadius: "12px",
                                padding: "1.2rem",
                                marginBottom: "1.2rem",
                                backgroundColor: "#fff",
                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
                                transition: "all 0.3s ease",
                            }}
                        >
                            <h3 style={{ marginBottom: "0.5rem" }}>{r.clodName}</h3>
                            <p style={{ margin: "4px 0" }}>
                                <strong>예약 기간:</strong>{" "}
                                {r.startDate.slice(0, 10)} ~ {r.endDate.slice(0, 10)}
                            </p>
                            <div
                                style={{
                                    display: "inline-block",
                                    padding: "0.3rem 0.7rem",
                                    backgroundColor: status.color,
                                    color: "#fff",
                                    borderRadius: "999px",
                                    fontSize: "0.85rem",
                                    marginTop: "0.5rem",
                                }}
                            >
                                {status.label}
                            </div>

                            <div style={{ marginTop: "1rem" }}>
                                {/* ✅ 상태 버튼들 */}
                                {["REJECTED", "RESERVED", "APPROVED"].includes(r.status) && (
                                    <button
                                        onClick={() =>
                                            updateStatus(r.reservationId, "COMPLETED")
                                        }
                                        style={buttonStyle("green")}
                                    >
                                        ✅ 완료 처리
                                    </button>
                                )}

                                {!["COMPLETED", "CANCELED"].includes(r.status) && (
                                    <button
                                        onClick={() =>
                                            updateStatus(r.reservationId, "CANCELED")
                                        }
                                        style={buttonStyle("red")}
                                    >
                                        ❌ 예약 취소
                                    </button>
                                )}

                                {/* ✅ 상세 보기 버튼 */}
                                <button
                                    onClick={() => goToHotelDetail(r.clodName)}
                                    style={buttonStyle("blue")}
                                >
                                    🔍 상세 보기
                                </button>
                            </div>

                            {/* 삭제 버튼 (취소 상태일 때만 노출) */}
                            {r.status === "CANCELED" && (
                                <button
                                    onClick={() => deleteReservation(r.reservationId)}
                                    style={{
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        background: "none",
                                        border: "none",
                                        fontSize: "20px",
                                        color: "#aaa",
                                        cursor: "pointer",
                                    }}
                                    title="예약 완전 삭제"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

const buttonStyle = (type) => {
    const colors = {
        green: "#28a745",
        red: "#dc3545",
        blue: "#007bff",
    };

    return {
        backgroundColor: colors[type] || "#007bff",
        color: "#fff",
        border: "none",
        padding: "0.5rem 1rem",
        marginRight: "0.5rem",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.9rem",
        transition: "background-color 0.2s ease",
    };
};

export default Revation;
