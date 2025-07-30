import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const AccommodationRoomRewrite = ({ lodName, onClose, onUpdate }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletedRoomIds, setDeletedRoomIds] = useState([]);
    const nextNewRoomId = useRef(0);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const encodedLodName = encodeURIComponent(lodName);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/getlodUseN/${encodedLodName}`);

            if (res.data && res.data.rooms) {
                const preparedRooms = res.data.rooms.map(room => ({
                    ...room,
                    imageFile: null,
                    preview: null,
                    isNew: false, // DB에서 가져온 객실은 '새로운' 객실이 아님
                }));
                setRooms(preparedRooms);
                setDeletedRoomIds([]);
                nextNewRoomId.current = 0;
            } else {
                setRooms([]);
                setDeletedRoomIds([]);
                nextNewRoomId.current = 0;
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

    const handleRoomChange = (id, field, value) => {
        setRooms(prevRooms =>
            prevRooms.map(room =>
                room.id === id ? { ...room, [field]: value } : room
            )
        );
    };

    const handleImageChange = (id, file) => {
        setRooms(prevRooms =>
            prevRooms.map(room =>
                room.id === id
                    ? {
                        ...room,
                        imageFile: file,
                        preview: file ? URL.createObjectURL(file) : null,
                    }
                    : room
            )
        );
    };

    const handleAddRoom = () => {
        if (rooms.length >= 3) {
            alert("객실은 최대 3개까지 등록할 수 있습니다.");
            return;
        }

        const newRoom = {
            id: `new_${nextNewRoomId.current++}`,
            roomName: "",
            price: 0,
            roomImages: [],
            imageFile: null,
            preview: null,
            isNew: true,
        };
        setRooms(prevRooms => [...prevRooms, newRoom]);
    };

    const handleDeleteRoom = (id) => {
        if (!window.confirm("객실을 목록에서 제거하시겠습니까? '저장' 버튼을 눌러야 최종 반영됩니다.")) return;

        const roomToDelete = rooms.find(room => room.id === id);
        setRooms(prevRooms => prevRooms.filter(room => room.id !== id));

        if (roomToDelete && !roomToDelete.isNew) {
            setDeletedRoomIds(prevIds => [...prevIds, roomToDelete.id]);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const form = new FormData();

            form.append("deletedRoomIds", JSON.stringify(deletedRoomIds.length > 0 ? deletedRoomIds : []));

            const roomsToUpdateOrCreate = rooms.map(room => {
                const roomData = {
                    roomName: room.roomName,
                    price: Number(room.price),
                    isNew: room.isNew,
                };
                if (!room.isNew) roomData.id = room.id;
                return roomData;
            });

            form.append("roomUpdates", JSON.stringify(roomsToUpdateOrCreate));

            rooms.forEach(room => {
                if (room.imageFile) {
                    form.append(`roomImage_${room.id}`, room.imageFile);
                }
            });

            // 디버깅용 로그
            console.log("deletedRoomIds:", deletedRoomIds);
            console.log("roomsToUpdateOrCreate:", roomsToUpdateOrCreate);
            for (let pair of form.entries()) {
                console.log(pair[0], pair[1]);
            }

            await axios.put(
                `${process.env.REACT_APP_API_URL}/batch-update`,
                form,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            alert("객실 정보가 성공적으로 반영되었습니다.");
            onUpdate();
            onClose();
        } catch (err) {
            console.error("객실 정보 반영 실패:", err.response ? err.response.data : err.message);
            alert("객실 정보 반영 실패");
        } finally {
            setLoading(false);
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

                <button
                    style={{
                        backgroundColor: "#28a745",
                        color: "#fff",
                        padding: "10px 20px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginBottom: "20px",
                    }}
                    onClick={handleAddRoom}
                    disabled={rooms.length >= 3}
                >
                    객실 추가 ({rooms.length}/3)
                </button>

                {rooms.length === 0 && <p>등록된 객실이 없습니다. 객실을 추가해주세요.</p>}

                {rooms.map((room, index) => (
                    <div
                        key={room.id}
                        style={{ marginBottom: "30px", borderBottom: "1px solid #ccc", paddingBottom: "20px" }}
                    >
                        {/* ✅ 객실 유형 표시 추가 */}
                        {room.isNew ? (
                            <p style={{ color: "purple", fontWeight: "bold", fontSize: "1rem", marginBottom: "10px" }}>
                                ✨ 새로운 객실
                            </p>
                        ) : (
                            <p style={{ color: "#337ab7", fontWeight: "bold", fontSize: "1rem", marginBottom: "10px" }}>
                                🏠 기존 객실
                            </p>
                        )}
                        <input
                            type="text"
                            value={room.roomName || ''}
                            onChange={(e) => handleRoomChange(room.id, "roomName", e.target.value)}
                            placeholder="객실 이름"
                        />
                        <input
                            type="number"
                            value={room.price || ''}
                            onChange={(e) => handleRoomChange(room.id, "price", e.target.value)}
                            placeholder="가격"
                        />

                        <label style={{ display: "block", marginTop: "10px" }}>이미지 업로드</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(room.id, e.target.files[0])}
                        />

                        <div style={{ marginTop: "10px", textAlign: "center" }}>
                            {room.preview ? (
                                <>
                                    <p style={{ fontSize: "14px", color: "green", marginBottom: "5px" }}>
                                        ✅ **새로 선택된 이미지 (업로드 예정)**
                                    </p>
                                    <img
                                        src={room.preview}
                                        alt="새 이미지 미리보기"
                                        style={{
                                            width: "100%",
                                            borderRadius: "10px",
                                            maxHeight: "200px",
                                            objectFit: "cover",
                                            border: "2px solid green"
                                        }}
                                    />
                                    <button
                                        style={{
                                            marginTop: "10px",
                                            backgroundColor: "#f0ad4e",
                                            color: "white",
                                            padding: "6px 12px",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => handleImageChange(room.id, null)}
                                    >
                                        새 이미지 선택 취소
                                    </button>
                                </>
                            ) : (
                                room.roomImages && room.roomImages.length > 0 && room.roomImages[0] ? (
                                    <>
                                        <p style={{ fontSize: "14px", color: "#337ab7", marginBottom: "5px" }}>
                                            🖼️ **기존 객실 이미지 (DB에서 로드됨)**
                                        </p>
                                        <img
                                            src={room.roomImages[0]}
                                            alt="기존 객실 이미지"
                                            style={{
                                                width: "100%",
                                                borderRadius: "10px",
                                                maxHeight: "200px",
                                                objectFit: "cover",
                                                border: "2px solid #337ab7"
                                            }}
                                        />
                                    </>
                                ) : (
                                    <p style={{ fontSize: "14px", color: "#888" }}>
                                        ⚠️ 등록된 객실 이미지가 없습니다. 새로운 이미지를 업로드해주세요.
                                    </p>
                                )
                            )}
                        </div>

                        <button
                            style={{ marginTop: "20px", backgroundColor: "red", color: "white", padding: "6px 12px", border: "none", borderRadius: "6px", cursor: "pointer" }}
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