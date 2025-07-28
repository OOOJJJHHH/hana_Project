import React, { useEffect, useState } from "react";
import axios from "axios";

const AccommodationRoomRewrite = ({ lodName, onClose, onUpdate }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);

    // 숙소명으로 객실 데이터 조회
    const fetchRooms = async () => {
        setLoading(true);
        try {
            // Lodging name을 인코딩해서 URL에 전달
            const encodedLodName = encodeURIComponent(lodName);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/getlodUseN/${encodedLodName}`);
            if (res.data && res.data.rooms) {
                // rooms 데이터에 preview, imageFile (업로드용) 초기값 세팅
                const preparedRooms = res.data.rooms.map(room => ({
                    ...room,
                    imageFile: null,
                    preview: null,
                }));
                setRooms(preparedRooms);
            } else {
                setRooms([]);
            }
        } catch (err) {
            console.error("객실 조회 실패", err);
            alert("객실 정보를 불러오는데 실패했습니다.");
        }
        setLoading(false);
    };

    useEffect(() => {
        if (lodName) {
            fetchRooms();
        }
    }, [lodName]);

    const handleRoomChange = (index, field, value) => {
        const updatedRooms = [...rooms];
        updatedRooms[index][field] = value;
        setRooms(updatedRooms);
    };

    const handleImageChange = (index, file) => {
        const updatedRooms = [...rooms];
        updatedRooms[index].imageFile = file;
        updatedRooms[index].preview = URL.createObjectURL(file);
        setRooms(updatedRooms);
    };

    // 객실 삭제
    const handleDeleteRoom = async (roomId) => {
        if (!window.confirm("객실을 삭제하시겠습니까?")) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/room/${roomId}`);
            alert("객실이 삭제되었습니다.");
            fetchRooms();
            onUpdate();
        } catch (err) {
            console.error("객실 삭제 실패", err);
            alert("객실 삭제 실패");
        }
    };

    // 저장 (수정)
    const handleSubmit = async () => {
        try {
            for (const room of rooms) {
                const form = new FormData();

                const roomData = {
                    roomName: room.roomName,
                    price: Number(room.price),
                    // capacity, description 같은 필드가 있으면 추가
                    capacity: room.capacity,
                    description: room.description,
                };

                const json = new Blob([JSON.stringify(roomData)], { type: "application/json" });
                form.append("data", json);

                if (room.imageFile) {
                    form.append("roomImage", room.imageFile);
                }

                await axios.put(
                    `${process.env.REACT_APP_API_URL}/room/${room.id}`,
                    form,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
            }
            alert("객실 정보가 수정되었습니다.");
            onUpdate();
            onClose();
        } catch (err) {
            console.error("객실 수정 실패:", err);
            alert("객실 수정 실패");
        }
    };

    if (loading) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-container" onClick={e => e.stopPropagation()}>
                    <h2>객실 수정</h2>
                    <p>로딩중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
                <h2>객실 수정 - 숙소명: {lodName}</h2>

                {rooms.length === 0 && <p>등록된 객실이 없습니다.</p>}

                {rooms.map((room, index) => (
                    <div
                        key={room.id}
                        style={{ marginBottom: "30px", borderBottom: "1px solid #ccc", paddingBottom: "20px" }}
                    >
                        <input
                            type="text"
                            value={room.roomName}
                            onChange={(e) => handleRoomChange(index, "roomName", e.target.value)}
                            placeholder="객실 이름"
                        />
                        <input
                            type="number"
                            value={room.price}
                            onChange={(e) => handleRoomChange(index, "price", e.target.value)}
                            placeholder="가격"
                        />
                        <input
                            type="number"
                            value={room.capacity || ""}
                            onChange={(e) => handleRoomChange(index, "capacity", e.target.value)}
                            placeholder="수용 인원"
                        />
                        <input
                            type="text"
                            value={room.description || ""}
                            onChange={(e) => handleRoomChange(index, "description", e.target.value)}
                            placeholder="설명"
                        />

                        <label style={{ display: "block", marginTop: "10px" }}>이미지 업로드</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(index, e.target.files[0])}
                        />

                        {(room.preview || (room.roomImages && room.roomImages[0])) && (
                            <img
                                src={room.preview || room.roomImages[0]}
                                alt="객실 이미지"
                                style={{
                                    width: "100%",
                                    marginTop: "10px",
                                    borderRadius: "10px",
                                    maxHeight: "200px",
                                    objectFit: "cover",
                                }}
                            />
                        )}

                        <button
                            style={{ marginTop: "10px", backgroundColor: "red", color: "white", padding: "6px 12px", border: "none", borderRadius: "6px", cursor: "pointer" }}
                            onClick={() => handleDeleteRoom(room.id)}
                        >
                            객실 삭제
                        </button>
                    </div>
                ))}

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                    <button
                        style={{
                            backgroundColor: "#007bff",
                            color: "#fff",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                        onClick={handleSubmit}
                    >
                        저장
                    </button>
                    <button
                        style={{
                            backgroundColor: "#6c757d",
                            color: "#fff",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                        }}
                        onClick={onClose}
                    >
                        닫기
                    </button>
                </div>
            </div>

            <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex; justify-content: center; align-items: center;
          z-index: 1000;
        }
        .modal-container {
          background: white;
          padding: 30px;
          border-radius: 10px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .modal-container input[type="text"],
        .modal-container input[type="number"],
        .modal-container input[type="file"] {
          margin-top: 10px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          width: 100%;
          box-sizing: border-box;
          font-size: 16px;
        }
      `}</style>
        </div>
    );
};

export default AccommodationRoomRewrite;
