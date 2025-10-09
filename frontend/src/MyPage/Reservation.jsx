import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../Session/UserContext";
import ReservationList from "./PopUp/ReservationDetail/ReservationList";

const Reservation = () => {
    const [pendingReservations, setPendingReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userInfo = useContext(UserContext);

    const lodOwner = userInfo?.uId;

    useEffect(() => {
        if (!lodOwner) {
            setError("로그인이 필요합니다.");
            setLoading(false);
            return;
        }

        fetchPendingReservations();
    }, [lodOwner]);

    const fetchPendingReservations = async () => {
        try {
            setLoading(true);
            console.log("프론트엔드에서 서버로 전달한 lodOwner:", lodOwner);
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/reservations/landlord/${lodOwner}`
            );

            console.log(response.data);

            const filteredReservations = response.data.filter(
                (reservation) => reservation.status === "PENDING" || reservation.status === "COMPLETED"
            );

            setPendingReservations(filteredReservations);
            setLoading(false);
        } catch (err) {
            console.error("예약 목록을 불러오는 데 실패했습니다.", err);
            setError("예약 목록을 불러오는 중 오류가 발생했습니다.");
            setLoading(false);
        }
    };

    const handleApprove = async (reservationId) => {
        if (window.confirm("정말로 이 예약을 수락하시겠습니까?")) {
            try {
                await axios.patch(`${process.env.REACT_APP_API_URL}/api/reservations/${reservationId}/approve`);
                alert("예약이 성공적으로 수락되었습니다.");
                fetchPendingReservations();
            } catch (err) {
                console.error("예약 수락에 실패했습니다.", err);
                alert("예약 수락에 실패했습니다.");
            }
        }
    };

    const handleReject = async (reservationId) => {
        if (window.confirm("정말로 이 예약을 거절하시겠습니까?")) {
            try {
                await axios.patch(`${process.env.REACT_APP_API_URL}/api/reservations/${reservationId}/reject`);
                alert("예약이 성공적으로 거절되었습니다.");
                fetchPendingReservations();
            } catch (err) {
                console.error("예약 거절에 실패했습니다.", err);
                alert("예약 거절에 실패했습니다.");
            }
        }
    };

    const handleConsultation = (reservation) => {
        alert(`[${reservation.clodName} - ${reservation.roomName}] 예약 건에 대해 상담을 시작합니다.`);
    };

    if (loading) return <div style={styles.container}>로딩 중...</div>;
    if (error) return <div style={styles.container}>{error}</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🏨 예약 요청 관리</h1>
            <p style={styles.description}>숙소로 들어온 예약 요청을 확인하고 처리하세요.</p>

            {/* ✅ 예약 목록 렌더링 부분 분리 */}
            <ReservationList
                pendingReservations={pendingReservations}
                handleApprove={handleApprove}
                handleReject={handleReject}
                handleConsultation={handleConsultation}
                styles={styles}
            />
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
        maxHeight: "730px",
        overflowY: "auto",
        paddingRight: "8px",
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
    approveButton: { backgroundColor: "#28a745" },
    rejectButton: { backgroundColor: "#dc3545" },
    consultButton: { backgroundColor: "#6c757d" },
};

export default Reservation;
