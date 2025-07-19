import React, {useState, useEffect, useContext} from "react";
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
                console.log(ranges);
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

            // 예약 버튼은 0.5초 후에 보여주기
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
            clodContentId: roomInfo.hotelId,   // 숙소 id
            roomId: currentRoom.id,       // 객실 id
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            nights: getNightCount(),
            memo: specialRequest,
            paid: isPaid,
            status: "RESERVED"
        };

        onSubmitReservation(reservationData);
        onClose();
    };


    return (
        <div style={styles.overlay}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button style={styles.closeBtn} onClick={onClose}>×</button>
                <h2 style={styles.title}>📅 예약 날짜 선택</h2>

                {/* 방 종류 선택 */}
                <div style={{ marginBottom: "1rem", textAlign: "left" }}>
                    <label htmlFor="room-select-popup" style={{ display: "block", marginBottom: "0.5rem" }}>🛏 방 종류 선택:</label>
                    <select
                        id="room-select-popup"
                        value={currentRoomName}
                        onChange={(e) => setCurrentRoomName(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
                    >
                        {rooms.map((room) => (
                            <option key={room.id} value={room.roomName}>
                                {room.roomName} - {room.price.toLocaleString()}원
                            </option>
                        ))}
                    </select>
                </div>

                <div style={styles.calendarWrapper}>
                    <DatePicker
                        selectsRange
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                            // update는 [start, end] 배열
                            if (update[0] && update[1]) {
                                // 예약된 날짜 범위가 선택한 범위와 겹치는지 확인
                                const selectedStart = update[0];
                                const selectedEnd = update[1];

                                // disabledRanges 중 하나라도 선택 범위와 겹치는지 체크
                                const isOverlap = disabledRanges?.some(({ start, end }) => {
                                    // 겹치는 조건: 시작일이 예약된 기간 끝보다 작거나 같고, 종료일이 예약된 기간 시작보다 크거나 같으면 겹침
                                    return selectedStart <= end && selectedEnd >= start;
                                });

                                if (isOverlap) {
                                    alert("선택한 기간에 예약이 이미 되어 있습니다. 다른 날짜를 선택해주세요.");
                                    // 선택 초기화
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

                <div style={styles.infoWrapper}>
                    <div style={styles.infoSection}>
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

                        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
                            <div style={{ marginBottom: "1rem" }}>
                                <label htmlFor="special-request" style={{ display: "block", marginBottom: "0.5rem" }}>
                                    📝 요구사항:
                                </label>
                                <textarea
                                    id="special-request"
                                    value={specialRequest}
                                    onChange={(e) => setSpecialRequest(e.target.value)}
                                    rows={4}
                                    style={{
                                        width: "100%",
                                        padding: "0.5rem",
                                        fontSize: "1rem",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                        resize: "vertical"
                                    }}
                                    placeholder="예: 창가 자리 원해요, 금연실 요청 등"
                                />
                            </div>

                            {!isPaid && (
                                <button
                                    type="button"
                                    onClick={handlePayment}
                                    style={{ ...styles.submitBtn, backgroundColor: "#007bff" }}
                                >
                                    💳 결제하기
                                </button>
                            )}

                            {isPaid && showConfirmButton && (
                                <button
                                    type="submit"
                                    style={{ ...styles.submitBtn, backgroundColor: "#28a745", marginTop: "10px" }}
                                >
                                    예약 확정
                                </button>
                            )}
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex", justifyContent: "center", alignItems: "center",
        zIndex: 10000,
    },
    modal: {
        backgroundColor: "#fefefe",
        padding: "40px 30px",
        borderRadius: "15px",
        width: "500px",
        maxWidth: "95%",
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        position: "relative",
        fontFamily: "'Segoe UI', sans-serif",
    },
    closeBtn: {
        position: "absolute", top: "16px", right: "20px",
        background: "none",
        border: "none",
        fontSize: "1.8rem",
        fontWeight: "bold",
        color: "#444",
        cursor: "pointer",
    },
    title: {
        textAlign: "center",
        marginBottom: "1.5rem",
        fontSize: "1.6rem",
        color: "#333",
    },
    calendarWrapper: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "1.5rem",
    },
    infoWrapper: {
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        padding: "1rem",
        marginTop: "1rem",
        width: "100%",
    },
    infoSection: {
        textAlign: "left",
        fontSize: "1.1rem",
        color: "#333",
        lineHeight: "1.7",
    },
    submitBtn: {
        padding: "0.75rem 2rem",
        color: "#fff",
        fontSize: "1rem",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
    },
};

export default ReserPopup;
