import React, { useState, useEffect } from "react";
import axios from "axios";

const AccommodationRoomRewrite = ({ lodging, onClose, onUpdated }) => {
    const [rooms, setRooms] = useState([]);
    const [newRoom, setNewRoom] = useState({ roomName: "", roomPrice: "", roomDesc: "" });

    useEffect(() => {
        fetchRooms();

        // ESC 키 눌렀을 때 닫기
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);

        // 스크롤 방지
        document.body.style.overflow = "hidden";

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "auto";
        };
    }, [lodging.id]);

    const fetchRooms = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/room/by-lodging/${lodging.id}`);
            setRooms(res.data);
        } catch (err) {
            console.error("객실 정보 불러오기 실패:", err);
        }
    };

    const handleRoomChange = (index, field, value) => {
        const updatedRooms = [...rooms];
        updatedRooms[index][field] = value;
        setRooms(updatedRooms);
    };

    const handleRoomUpdate = async (room) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/room/${room.id}`, room);
            alert("객실 정보가 수정되었습니다.");
            fetchRooms();
            onUpdated();
        } catch (err) {
            console.error("객실 수정 실패:", err);
            alert("수정 실패");
        }
    };

    const handleRoomDelete = async (roomId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/room/${roomId}`);
            setRooms(prev => prev.filter(r => r.id !== roomId));
            alert("객실이 삭제되었습니다.");
        } catch (err) {
            console.error("객실 삭제 실패:", err);
            alert("삭제 실패");
        }
    };

    const handleNewRoomChange = (e) => {
        const { name, value } = e.target;
        setNewRoom(prev => ({ ...prev, [name]: value }));
    };

    const handleAddRoom = async () => {
        if (!newRoom.roomName || !newRoom.roomPrice) {
            alert("객실 이름과 가격은 필수입니다.");
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/room`, {
                ...newRoom,
                lodgingId: lodging.id
            });
            setRooms(prev => [...prev, res.data]);
            setNewRoom({ roomName: "", roomPrice: "", roomDesc: "" });
            alert("객실이 추가되었습니다.");
        } catch (err) {
            console.error("객실 추가 실패:", err);
            alert("추가 실패");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <h2>객실 수정 - {lodging.lodName}</h2>

                {rooms.map((room, idx) => (
                    <div key={room.id} className="room-block">
                        <input
                            value={room.roomName}
                            onChange={e => handleRoomChange(idx, "roomName", e.target.value)}
                            placeholder="객실 이름"
                        />
                        <input
                            type="number"
                            value={room.roomPrice}
                            onChange={e => handleRoomChange(idx, "roomPrice", e.target.value)}
                            placeholder="가격"
                        />
                        <input
                            value={room.roomDesc}
                            onChange={e => handleRoomChange(idx, "roomDesc", e.target.value)}
                            placeholder="설명"
                        />
                        <div className="button-group">
                            <button onClick={() => handleRoomUpdate(room)} className="btn-save">수정</button>
                            <button onClick={() => handleRoomDelete(room.id)} className="btn-cancel">삭제</button>
                        </div>
                    </div>
                ))}

                <h3>새 객실 추가</h3>
                <input
                    name="roomName"
                    value={newRoom.roomName}
                    onChange={handleNewRoomChange}
                    placeholder="객실 이름"
                />
                <input
                    type="number"
                    name="roomPrice"
                    value={newRoom.roomPrice}
                    onChange={handleNewRoomChange}
                    placeholder="가격"
                />
                <input
                    name="roomDesc"
                    value={newRoom.roomDesc}
                    onChange={handleNewRoomChange}
                    placeholder="설명"
                />
                <button onClick={handleAddRoom} className="btn-save">추가</button>

                <div style={{ marginTop: "20px", textAlign: "right" }}>
                    <button onClick={onClose} className="btn-cancel">닫기</button>
                </div>

                <style>{`
                    .modal-overlay {
                        position: fixed;
                        top: 0; left: 0; right: 0; bottom: 0;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }
                    .modal {
                        background: #fff;
                        padding: 30px;
                        border-radius: 10px;
                        width: 90%;
                        max-width: 600px;
                        box-shadow: 0 0 20px rgba(0,0,0,0.3);
                        animation: fadeIn 0.3s ease-in-out;
                    }
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    input {
                        display: block;
                        margin: 10px 0;
                        padding: 10px;
                        width: 100%;
                        border: 1px solid #ccc;
                        border-radius: 6px;
                    }
                    .room-block {
                        margin-bottom: 20px;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 10px;
                    }
                    .button-group {
                        margin-top: 10px;
                    }
                    .btn-save {
                        background-color: #28a745;
                        color: white;
                        padding: 8px 14px;
                        margin-right: 10px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    .btn-cancel {
                        background-color: #ccc;
                        padding: 8px 14px;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default AccommodationRoomRewrite;
