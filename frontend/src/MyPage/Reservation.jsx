import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../Session/UserContext";

const Reservation = () => {
    const [pendingReservations, setPendingReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userInfo = useContext(UserContext); // UserContext를 통해 로그인된 사용자 정보 가져오기

    // 로그인된 사용자 정보에서 숙소 주인(lodOwner) 아이디를 가져옵니다.
    const lodOwner = userInfo?.uId;

    useEffect(() => {
        if (!lodOwner) {
            setError("로그인이 필요합니다.");
            setLoading(false);
            return;
        }

        fetchPendingReservations();
    }, [lodOwner]);

    // 대기 중인(PENDING) 예약 목록을 불러오는 함수
    const fetchPendingReservations = async () => {
        try {
            setLoading(true);
            console.log("프론트엔드에서 서버로 전달한 lodOwner:", lodOwner); // 🔍 로그 추가

            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/reservations/landlord/${lodOwner}`);
            // PENDING 상태의 예약만 필터링
            const filteredReservations = response.data.filter(
                (reservation) => reservation.status === "PENDING"
            );
            setPendingReservations(filteredReservations);
            setLoading(false);
        } catch (err) {
            console.error("예약 목록을 불러오는 데 실패했습니다.", err);
            setError("예약 목록을 불러오는 중 오류가 발생했습니다.");
            setLoading(false);
        }
    };

    // 예약 수락 처리 함수
    const handleApprove = async (reservationId) => {
        if (window.confirm("정말로 이 예약을 수락하시겠습니까?")) {
            try {
                await axios.patch(`${process.env.REACT_APP_API_URL}/api/reservations/${reservationId}/approve`);
                alert("예약이 성공적으로 수락되었습니다.");
                fetchPendingReservations(); // 목록 새로고침
            } catch (err) {
                console.error("예약 수락에 실패했습니다.", err);
                alert("예약 수락에 실패했습니다.");
            }
        }
    };

    // 예약 거절 처리 함수
    const handleReject = async (reservationId) => {
        if (window.confirm("정말로 이 예약을 거절하시겠습니까?")) {
            try {
                await axios.patch(`${process.env.REACT_APP_API_URL}/api/reservations/${reservationId}/reject`);
                alert("예약이 성공적으로 거절되었습니다.");
                fetchPendingReservations(); // 목록 새로고침
            } catch (err) {
                console.error("예약 거절에 실패했습니다.", err);
                alert("예약 거절에 실패했습니다.");
            }
        }
    };

    const handleConsultation = (reservation) => {
        // '상담' 버튼 클릭 시 기능 (예: 채팅방으로 이동, 팝업 띄우기 등)
        alert(`[${reservation.clodName} - ${reservation.roomName}] 예약 건에 대해 상담을 시작합니다.`);
        // 실제 구현 시 채팅 페이지로 리다이렉션 등의 로직 추가
    };

    if (loading) {
        return <div style={styles.container}>로딩 중...</div>;
    }

    if (error) {
        return <div style={styles.container}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🏨 예약 요청 관리</h1>
            <p style={styles.description}>숙소로 들어온 예약 요청을 확인하고 처리하세요.</p>

            {pendingReservations.length === 0 ? (
                <div style={styles.noReservations}>
                    <p>현재 대기 중인 예약 요청이 없습니다.</p>
                </div>
            ) : (
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
                                    style={{...styles.actionButton, ...styles.approveButton}}
                                    onClick={() => handleApprove(reservation.reservationId)}
                                >
                                    ✅ 예약 수락
                                </button>
                                <button
                                    style={{...styles.actionButton, ...styles.rejectButton}}
                                    onClick={() => handleReject(reservation.reservationId)}
                                >
                                    ❌ 예약 거절
                                </button>
                                <button
                                    style={{...styles.actionButton, ...styles.consultButton}}
                                    onClick={() => handleConsultation(reservation)}
                                >
                                    💬 상담
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    title: {
        textAlign: "center",
        fontSize: "2rem",
        color: "#333",
        marginBottom: "10px",
    },
    description: {
        textAlign: "center",
        color: "#666",
        fontSize: "1rem",
        marginBottom: "30px",
    },
    noReservations: {
        textAlign: "center",
        color: "#999",
        marginTop: "50px",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
    },
    reservationList: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    reservationCard: {
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.3s ease-in-out",
    },
    cardInfo: {
        flexGrow: 1,
        lineHeight: "1.6",
    },
    cardActions: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginLeft: "20px",
    },
    actionButton: {
        padding: "10px 15px",
        border: "none",
        borderRadius: "5px",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
    approveButton: {
        backgroundColor: "#28a745",
        "&:hover": {
            backgroundColor: "#218838",
        },
    },
    rejectButton: {
        backgroundColor: "#dc3545",
        "&:hover": {
            backgroundColor: "#c82333",
        },
    },
    consultButton: {
        backgroundColor: "#6c757d",
        "&:hover": {
            backgroundColor: "#5a6268",
        },
    },
};

export default Reservation;