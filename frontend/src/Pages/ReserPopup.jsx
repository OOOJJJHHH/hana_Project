import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserContext } from "../Session/UserContext";
import axios from "axios";

const ReserPopup = ({
                        rooms = [],
                        selectedRoomName,
                        roomInfo,
                        onClose,
                        onSubmitReservation,
                    }) => {
    const [currentRoomName, setCurrentRoomName] = useState(selectedRoomName || (rooms[0]?.roomName || ""));
    const { hotelName } = roomInfo || {};
    const [dateRange, setDateRange] = useState([null, null]);
    const [specialRequest, setSpecialRequest] = useState("");
    const [isPaid, setIsPaid] = useState(false);
    const [showConfirmButton, setShowConfirmButton] = useState(false);
    const [disabledRanges, setDisabledRanges] = useState();
    const userInfo = useContext(UserContext);

    const [startDate, endDate] = dateRange;
    const currentRoom = rooms.find((r) => r.roomName === currentRoomName) || {};

    useEffect(() => {
        if (!currentRoom.id) return;
        axios.get(`${process.env.REACT_APP_API_URL}/reservation/reserved-dates/${currentRoom.id}`)
            .then(res => {
                const ranges = res.data.map(r => ({
                    start: new Date(r.start),
                    end: new Date(r.end),
                }));
                setDisabledRanges(ranges);
            });
    }, [currentRoom.id]);

    const getNightCount = () => {
        if (!startDate || !endDate) return 0;
        const diffTime = endDate.getTime() - startDate.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const handlePayment = () => {
        if (!startDate || !endDate) {
            alert("시작일과 종료일을 모두 선택해주세요.");
            return;
        }

        const confirmed = window.confirm(
            `총 ${getNightCount()}박 숙박에 대한 결제를 진행할까요?\n총 결제 금액: ${(currentRoom.price * getNightCount()).toLocaleString()}원`
        );

        if (confirmed) {
            alert("✅ 결제가 완료되었습니다!");
            setIsPaid(true);
            setTimeout(() => {
                setShowConfirmButton(true);
            }, 500);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!startDate || !endDate) {
            alert("시작일과 종료일을 선택해주세요.");
            return;
        }

        if (!currentRoom.id) {
            alert("객실을 선택해주세요.");
            return;
        }

        const reservationData = {
            userId: userInfo.uId,
            clodContentId: roomInfo.hotelId,
            roomId: currentRoom.id,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            nights: getNightCount(),
            memo: specialRequest,
            paid: isPaid,
            status: "PENDING"
        };

        onSubmitReservation(reservationData);
        onClose();
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button style={styles.closeBtn} onClick={onClose}>×</button>
                <h2 style={styles.title}>📅 예약 날짜 선택</h2>

                {/* 객실 선택 */}
                <div style={styles.section}>
                    <label htmlFor="room-select-popup" style={styles.label}>🛏 방 종류 선택:</label>
                    <select
                        id="room-select-popup"
                        value={currentRoomName}
                        onChange={(e) => setCurrentRoomName(e.target.value)}
                        style={styles.select}
                    >
                        {rooms.map((room) => (
                            <option key={room.id} value={room.roomName}>
                                {room.roomName} - {room.price.toLocaleString()}원
                            </option>
                        ))}
                    </select>
                </div>

                {/* 캘린더 */}
                <div style={styles.calendarWrapper}>
                    <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            if (update[0] && update[1]) {
                                const selectedStart = update[0];
                                const selectedEnd = update[1];

                                const isOverlap = disabledRanges?.some(({ start, end }) => {
                                    return selectedStart <= end && selectedEnd >= start;
                                });

                                if (isOverlap) {
                                    alert("선택한 기간에 예약이 이미 되어 있습니다. 다른 날짜를 선택해주세요.");
                                    setDateRange([null, null]);
                                    return;
                                }
                            }
                            setDateRange(update);
                        }}
                        inline
                        minDate={new Date()}
                        excludeDateIntervals={disabledRanges}
                        dateFormat="yyyy-MM-dd"
                    />
                </div>

                {/* 예약 정보 */}
                <div style={styles.infoBox}>
                    <p>🏨 호텔명: <strong>{hotelName}</strong></p>
                    <p>🛏 방 종류: <strong>{currentRoomName}</strong></p>
                    <p>💰 가격 (1박): <strong>{(currentRoom.price || 0).toLocaleString()}원</strong></p>

                    {startDate && endDate && (
                        <p>
                            📅 예약기간: <strong>{startDate.toLocaleDateString()} ~ {endDate.toLocaleDateString()}</strong><br />
                            ⏱ 총 숙박일수: <strong>{getNightCount()}박</strong><br />
                            💵 총 결제 금액: <strong>{(currentRoom.price * getNightCount()).toLocaleString()}원</strong>
                        </p>
                    )}
                </div>

                {/* 요청사항 및 버튼 */}
                <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
                    <label htmlFor="special-request" style={styles.label}>📝 요구사항:</label>
                    <textarea
                        id="special-request"
                        value={specialRequest}
                        onChange={(e) => setSpecialRequest(e.target.value)}
                        rows={3}
                        style={styles.textarea}
                        placeholder="예: 창가 자리 원해요, 금연실 요청 등"
                    />

                    {!isPaid && (
                        <button type="button" onClick={handlePayment} style={{ ...styles.button, backgroundColor: "#007bff" }}>
                            💳 결제하기
                        </button>
                    )}

                    {isPaid && showConfirmButton && (
                        <button type="submit" style={{ ...styles.button, backgroundColor: "#28a745", marginTop: 10 }}>
                            예약 확정
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0, left: 0,
        width: "100vw", height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10000,
    },
    modal: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        padding: "30px 24px",
        borderRadius: "12px",
        width: "500px",
        maxWidth: "95%",
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        fontFamily: "'Segoe UI', sans-serif",
        position: "relative",
    },
    closeBtn: {
        position: "absolute",
        top: "14px", right: "20px",
        background: "none",
        border: "none",
        fontSize: "1.8rem",
        color: "#444",
        cursor: "pointer",
    },
    title: {
        textAlign: "center",
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#333",
        marginBottom: "20px",
    },
    section: {
        marginBottom: "1.2rem",
    },
    label: {
        display: "block",
        marginBottom: "0.5rem",
        fontWeight: 500,
        color: "#333",
    },
    select: {
        width: "100%",
        padding: "0.5rem",
        fontSize: "1rem",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    calendarWrapper: {
        marginBottom: "1.5rem",
        display: "flex",
        justifyContent: "center",
    },
    infoBox: {
        backgroundColor: "#f8f9fa",
        padding: "1rem",
        borderRadius: "8px",
        color: "#333",
        fontSize: "1rem",
        marginBottom: "1rem",
        lineHeight: "1.6",
    },
    textarea: {
        width: "100%",
        padding: "0.5rem",
        fontSize: "1rem",
        borderRadius: "8px",
        border: "1px solid #ccc",
        resize: "vertical",
        marginBottom: "1rem",
    },
    button: {
        width: "100%",
        padding: "0.75rem",
        fontSize: "1rem",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
};

export default ReserPopup;
