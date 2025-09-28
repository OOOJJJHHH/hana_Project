import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import MapPopupContent from "./PopUp/MapPopupContent";

const loginUser = JSON.parse(localStorage.getItem("loginUser"));

const Owner = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const cityFromContentState = location.state?.cityContents || [];

    // 기본 formData
    const [formData, setFormData] = useState({
        lodOwner: loginUser?.uFirstName || "",
        lodName: "",
        lodCallNum: "",
        lodImag: [],
        lodImagPreview: [],
    });

    const [address, setAddress] = useState({
        street: "",
        postalCode: "",
        country: "",
    });

    const [city, setCity] = useState("");
    const [rooms, setRooms] = useState([]);
    const [currency, setCurrency] = useState("KRW");
    const [showMap, setShowMap] = useState(false); // 지도 모달 표시 여부

    // 폼 입력 이벤트
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
    };

    const handleCityChange = (e) => setCity(e.target.value);

    // 전화번호 포맷팅
    const formatPhoneNumber = (value) => {
        const cleaned = value.replace(/\D/g, "");
        let formatted = cleaned;
        if (cleaned.length < 4) formatted = cleaned;
        else if (cleaned.length < 7) formatted = cleaned.slice(0, 3) + "-" + cleaned.slice(3);
        else if (cleaned.length < 11)
            formatted = cleaned.slice(0, 3) + "-" + cleaned.slice(3, 6) + "-" + cleaned.slice(6);
        else formatted = cleaned.slice(0, 3) + "-" + cleaned.slice(3, 7) + "-" + cleaned.slice(7, 11);
        return formatted;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setFormData((prev) => ({ ...prev, lodCallNum: formatted }));
    };

    // 숙소 이미지
    const handleLodImagChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = [];
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                previews.push(reader.result);
                if (previews.length === files.length) {
                    setFormData({ ...formData, lodImag: files, lodImagPreview: previews });
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeLodImage = (index) => {
        const newFiles = [...formData.lodImag];
        const newPreviews = [...formData.lodImagPreview];
        newFiles.splice(index, 1);
        newPreviews.splice(index, 1);
        setFormData({ ...formData, lodImag: newFiles, lodImagPreview: newPreviews });
    };

    // 객실
    const handleRoomChange = (index, e) => {
        const { name, value } = e.target;
        const updatedRooms = [...rooms];
        updatedRooms[index][name] = value;
        setRooms(updatedRooms);
    };

    const handleRoomImageChange = (index, e) => {
        const files = Array.from(e.target.files);
        const updatedRooms = [...rooms];
        const readerPromises = files.map(
            (file) =>
                new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                })
        );
        Promise.all(readerPromises).then((images) => {
            updatedRooms[index].roomImag = files;
            updatedRooms[index].roomImagPreview = images;
            setRooms(updatedRooms);
        });
    };

    const removeRoomImage = (roomIndex, imageIndex) => {
        const updatedRooms = [...rooms];
        updatedRooms[roomIndex].roomImag.splice(imageIndex, 1);
        updatedRooms[roomIndex].roomImagPreview.splice(imageIndex, 1);
        setRooms(updatedRooms);
    };

    const addRoom = () => {
        setRooms([
            ...rooms,
            {
                roomName: "",
                price: "",
                roomImag: [],
                roomImagPreview: [],
            },
        ]);
    };

    const removeRoom = (index) => {
        const updatedRooms = [...rooms];
        updatedRooms.splice(index, 1);
        setRooms(updatedRooms);
    };

    const handleCurrencyChange = (index, e) => {
        const updatedRooms = [...rooms];
        updatedRooms[index].currency = e.target.value;
        setRooms(updatedRooms);
    };

    // 저장 제출
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rooms.length === 0) {
            alert("최소 하나 이상의 객실을 추가해주세요.");
            return;
        }
        if (!city) {
            alert("도시를 선택해주세요.");
            return;
        }

        try {
            const form = new FormData();
            form.append("lodOwner", formData.lodOwner);
            form.append("lodCity", city);
            form.append("lodLocation", [address.street, address.postalCode, address.country].join(", "));
            form.append("lodName", formData.lodName);
            form.append("lodCallNum", formData.lodCallNum);

            formData.lodImag.forEach((file, i) => form.append(`lodImag${i}`, file));

            const roomMeta = rooms.map((room) => {
                let priceKRW = room.price;
                if (room.currency === "USD") priceKRW = Math.round(room.price * 1300);
                return { roomName: room.roomName, price: priceKRW };
            });
            form.append("rooms", JSON.stringify(roomMeta));

            rooms.forEach((room, index) => {
                room.roomImag.forEach((file, fileIndex) => {
                    form.append(`roomImag${index}_${fileIndex}`, file);
                });
            });

            await axios.post(`${process.env.REACT_APP_API_URL}/addRoom`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("데이터가 성공적으로 저장되었습니다.");
            setFormData({ lodOwner: loginUser?.uFirstName || "", lodName: "", lodCallNum: "", lodImag: [], lodImagPreview: [] });
            setAddress({ street: "", postalCode: "", country: "" });
            setCity("");
            setRooms([]);
            navigate("/");
        } catch (error) {
            console.error("❌ 저장 실패:", error);
            alert("데이터 저장에 실패했습니다.");
        }
    };

    const styles = {
        form: { width: "900px", margin: "0 auto", padding: "24px", backgroundColor: "#f9f9f9", borderRadius: "12px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", fontFamily: "Arial, sans-serif" },
        title: { fontSize: "20px", fontWeight: "bold", marginTop: "24px", marginBottom: "12px" },
        input: { width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid #ccc", borderRadius: "6px", boxSizing: "border-box" },
        label: { fontWeight: "bold", marginBottom: "6px", display: "block" },
        roomBox: { padding: "16px", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "16px", backgroundColor: "#fff" },
        button: { padding: "10px 16px", marginRight: "10px", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", backgroundColor: "#3498db", color: "#fff" },
        greenBtn: { backgroundColor: "#2ecc71", color: "#fff" },
        imagePreview: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" },
        imageContainer: { position: "relative", display: "inline-block" },
        image: { width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" },
        removeBtn: { position: "absolute", top: "-5px", right: "-5px", backgroundColor: "red", color: "white", borderRadius: "50%", border: "none", width: "20px", height: "20px", cursor: "pointer", fontWeight: "bold" },
        select: { width: "100%", padding: "10px", marginBottom: "12px", border: "1px solid #ccc", borderRadius: "6px", boxSizing: "border-box", backgroundColor: "#fff", appearance: "none", WebkitAppearance: "none", MozAppearance: "none" },
    };

    // 지도용 데이터
    const lodContentsForMap = [
        {
            lodId: 1,
            lodName: formData.lodName || "등록 예정 숙소",
            lodLocation: [address.street, address.postalCode, city, address.country].filter(Boolean).join(", "),
            lodImage: formData.lodImag[0] ? URL.createObjectURL(formData.lodImag[0]) : null,
        },
    ];

    return (
        <>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h1 style={{ textAlign: "center" }}>숙소 등록</h1>

                <label style={styles.label}>숙소 이름</label>
                <input type="text" name="lodName" value={formData.lodName} onChange={handleChange} style={styles.input} placeholder="숙소 이름을 입력하세요" required />

                <label style={styles.label}>전화번호 (한국식 자동 하이픈)</label>
                <input type="tel" name="lodCallNum" value={formData.lodCallNum} onChange={handlePhoneChange} style={styles.input} placeholder="010-1234-5678" required />

                <label style={styles.label}>거리 주소</label>
                <input type="text" name="street" value={address.street} onChange={handleAddressChange} style={styles.input} placeholder="예: Unter den Linden 77" required />

                <label style={styles.label}>우편번호</label>
                <input type="text" name="postalCode" value={address.postalCode} onChange={handleAddressChange} style={styles.input} placeholder="예: 10117" required />

                <label style={styles.label}>도시</label>
                <select name="city" value={city} onChange={handleCityChange} style={styles.select} required>
                    <option value="" disabled>도시 선택</option>
                    {cityFromContentState.map((cityItem) => (
                        <option key={cityItem.id} value={cityItem.cityName}>{cityItem.cityName}</option>
                    ))}
                </select>

                <label style={styles.label}>국가</label>
                <input type="text" name="country" value={address.country} onChange={handleAddressChange} style={styles.input} placeholder="예: Germany" required />

                <button type="button" onClick={() => setShowMap(true)} style={{ ...styles.button, backgroundColor: "#27ae60", marginBottom: "20px" }}>지도로 확인</button>

                <label style={styles.label}>숙소 이미지</label>
                <input type="file" multiple accept="image/*" onChange={handleLodImagChange} style={{ marginBottom: "12px" }} />
                <div style={styles.imagePreview}>
                    {formData.lodImagPreview.map((src, index) => (
                        <div key={index} style={styles.imageContainer}>
                            <img src={src} alt={`숙소${index}`} style={styles.image} />
                            <button type="button" style={styles.removeBtn} onClick={() => removeLodImage(index)}>×</button>
                        </div>
                    ))}
                </div>

                <h2 style={styles.title}>객실 정보</h2>
                {rooms.map((room, idx) => (
                    <div key={idx} style={styles.roomBox}>
                        <label style={styles.label}>객실명</label>
                        <input type="text" name="roomName" value={room.roomName} onChange={(e) => handleRoomChange(idx, e)} style={styles.input} required />
                        <label style={styles.label}>가격</label>
                        <input type="number" name="price" value={room.price} onChange={(e) => handleRoomChange(idx, e)} style={styles.input} min="0" required />
                        <label style={styles.label}>통화 단위</label>
                        <select name="currency" value={room.currency || "KRW"} onChange={(e) => handleCurrencyChange(idx, e)} style={styles.select}>
                            <option value="KRW">원 (KRW)</option>
                            <option value="USD">달러 (USD)</option>
                        </select>
                        <label style={styles.label}>객실 이미지</label>
                        <input type="file" multiple accept="image/*" onChange={(e) => handleRoomImageChange(idx, e)} style={{ marginBottom: "12px" }} />
                        <div style={styles.imagePreview}>
                            {room.roomImagPreview?.map((src, index) => (
                                <div key={index} style={styles.imageContainer}>
                                    <img src={src} alt={`객실${index}`} style={styles.image} />
                                    <button type="button" style={styles.removeBtn} onClick={() => removeRoomImage(idx, index)}>×</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={() => removeRoom(idx)} style={{ ...styles.button, backgroundColor: "#e74c3c" }}>객실 삭제</button>
                    </div>
                ))}
                <button type="button" onClick={addRoom} style={{ ...styles.button, ...styles.greenBtn }}>객실 추가</button>
                <button type="submit" style={{ ...styles.button, marginTop: "20px" }}>저장</button>
            </form>

            {/* MapPopupContent 모달 */}
            {showMap && <MapPopupContent onClose={() => setShowMap(false)} lodContents={lodContentsForMap} />}
        </>
    );
};

export default Owner;
