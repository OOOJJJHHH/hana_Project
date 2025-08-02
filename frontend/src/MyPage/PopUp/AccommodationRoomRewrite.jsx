import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const AccommodationRoomRewrite = ({ lodName, onClose, onUpdate }) => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deletedRoomIds, setDeletedRoomIds] = useState([]);
    const nextNewRoomId = useRef(0);

    useEffect(() => {
        if (lodName) fetchRooms();
    }, [lodName]);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const encoded = encodeURIComponent(lodName);
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/getlodUseN/${encoded}`);
            const prepared = (res.data.rooms || []).map(room => ({
                ...room,
                imageFiles: [],
                previews: [],
                isNew: false,
                keepExistingImages: true,
                removedImageUrls: [], // ✅ 개별 삭제된 이미지 URL
            }));
            setRooms(prepared);
            setDeletedRoomIds([]);
            nextNewRoomId.current = 0;
        } catch (err) {
            console.error(err);
            alert("객실 정보 로딩 실패");
        }
        setLoading(false);
    };

    const handleChange = (id, field, value) => {
        setRooms(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const handleImageChange = (id, files) => {
        const arr = Array.from(files);
        const previews = arr.map(f => URL.createObjectURL(f));
        setRooms(prev => prev.map(r => r.id === id ? {
            ...r,
            imageFiles: arr,
            previews,
            keepExistingImages: false // ✅ 새로 선택 시 기존 이미지 유지 안함
        } : r));
    };

    const handleAddRoom = () => {
        if (rooms.length >= 3) return alert("최대 3개");
        const id = `new_${nextNewRoomId.current++}`;
        setRooms([...rooms, {
            id,
            roomName: "",
            price: "",
            imageFiles: [],
            previews: [],
            isNew: true,
            keepExistingImages: false,
            removedImageUrls: [],
        }]);
    };

    const handleDeleteRoom = (id) => {
        if (!window.confirm("삭제하시겠습니까? 저장 시 적용됩니다.")) return;
        const target = rooms.find(r => r.id === id);
        setRooms(prev => prev.filter(r => r.id !== id));
        if (target && !target.isNew) setDeletedRoomIds(prev => [...prev, target.id]);
    };

    // ✅ 기존 이미지 개별 삭제 핸들러
    const handleRemoveExistingImage = (roomId, imageUrl) => {
        setRooms(prev => prev.map(r => {
            if (r.id !== roomId) return r;
            return {
                ...r,
                roomImages: r.roomImages.filter(url => url !== imageUrl),
                removedImageUrls: [...(r.removedImageUrls || []), imageUrl],
            };
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const form = new FormData();
            form.append("lodName", lodName);
            form.append("deletedRoomIds", JSON.stringify(deletedRoomIds));

            const updates = rooms.map(r => ({
                roomName: r.roomName,
                price: Number(r.price),
                id: r.id,
                isNew: r.isNew,
                keepExistingImages: r.keepExistingImages !== false,
                removedImageUrls: r.removedImageUrls || [] // ✅ 제거된 기존 이미지 목록 전송
            }));
            form.append("roomUpdates", JSON.stringify(updates));

            rooms.forEach(r => {
                const key = `roomImage_${r.id}`;
                r.imageFiles.forEach(file => {
                    form.append(key, file);
                });
            });

            // 디버깅 로그
            console.log("=== 📦 FormData Contents ===");
            for (const pair of form.entries()) {
                if (pair[1] instanceof File) {
                    console.log(`${pair[0]}: ${pair[1].name} (size: ${pair[1].size} bytes)`);
                } else {
                    console.log(`${pair[0]}: ${pair[1]}`);
                }
            }

            await axios.put(`${process.env.REACT_APP_API_URL}/batch-update`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("저장 성공");
            onUpdate();
            onClose();
        } catch (err) {
            console.error(err);
            alert("저장 실패");
        }
        setLoading(false);
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={e => e.stopPropagation()}>
                <header style={headerStyle}>
                    <h2>객실 수정</h2>
                    <button style={closeBtnStyle} onClick={onClose}>×</button>
                </header>

                <button style={addBtnStyle} onClick={handleAddRoom} disabled={rooms.length >= 3}>
                    + 객실 추가 ({rooms.length}/3)
                </button>

                {rooms.map(r => (
                    <div key={r.id} style={roomCardStyle}>
                        <div style={roomHeaderStyle}>
                            <strong>{r.isNew ? "새로운 객실" : "기존 객실"}</strong>
                            <button style={delBtnStyle} onClick={() => handleDeleteRoom(r.id)}>삭제</button>
                        </div>

                        <input
                            style={inputStyle}
                            type="text"
                            placeholder="객실 이름"
                            value={r.roomName}
                            onChange={e => handleChange(r.id, "roomName", e.target.value)}
                        />
                        <input
                            style={inputStyle}
                            type="number"
                            placeholder="가격"
                            value={r.price}
                            onChange={e => handleChange(r.id, "price", e.target.value)}
                        />

                        <input
                            style={fileInputStyle}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={e => handleImageChange(r.id, e.target.files)}
                        />

                        <div style={previewContainerStyle}>
                            {r.previews.length > 0 ? (
                                r.previews.map((src, i) => (
                                    <img key={i} src={src} style={previewImgStyle} alt="선택 이미지" />
                                ))
                            ) : (
                                (r.roomImages || []).map((src, i) => (
                                    <div key={i} style={existingImgBox}>
                                        <img src={src} style={existingImgStyle} alt="기존 이미지" />
                                        <button style={removeBtnStyle} onClick={() => handleRemoveExistingImage(r.id, src)}>×</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}

                <footer style={footerStyle}>
                    <button style={saveBtnStyle} onClick={handleSubmit} disabled={loading}>
                        {loading ? "저장 중…" : "저장하기"}
                    </button>
                    <button style={cancelBtnStyle} onClick={onClose}>취소</button>
                </footer>
            </div>
        </div>
    );
};

// === 스타일 ===
const overlayStyle = {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.6)", display: "flex",
    justifyContent: "center", alignItems: "center", zIndex: 1000,
};
const modalStyle = {
    background: "#fff", width: "100%", maxWidth: "700px",
    maxHeight: "90vh", overflowY: "auto",
    borderRadius: "8px", padding: "20px", boxSizing: "border-box",
};
const headerStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" };
const closeBtnStyle = { fontSize: "1.5rem", background: "none", border: "none", cursor: "pointer" };
const addBtnStyle = { display: "block", marginBottom: "20px", padding: "10px 15px", background: "#28a745", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" };
const roomCardStyle = { background: "#f9f9f9", padding: "15px", borderRadius: "6px", marginBottom: "20px" };
const roomHeaderStyle = { display: "flex", justifyContent: "space-between", marginBottom: "10px" };
const delBtnStyle = { background: "transparent", color: "#ff5252", border: "none", cursor: "pointer" };
const inputStyle = { width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "1rem", boxSizing: "border-box" };
const fileInputStyle = { marginBottom: "10px" };
const previewContainerStyle = { display: "flex", gap: "10px", flexWrap: "wrap" };
const previewImgStyle = { width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px", border: "2px solid #28a745" };
const existingImgBox = { position: "relative" };
const existingImgStyle = { width: "100px", height: "100px", objectFit: "cover", borderRadius: "4px", border: "2px solid #888" };
const removeBtnStyle = {
    position: "absolute", top: "-8px", right: "-8px",
    background: "#ff5252", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer"
};
const footerStyle = { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "20px" };
const saveBtnStyle = { padding: "10px 20px", background: "#007bff", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" };
const cancelBtnStyle = { padding: "10px 20px", background: "#6c757d", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" };

export default AccommodationRoomRewrite;
