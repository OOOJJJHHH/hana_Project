import { useState } from "react";
import axios from "axios";

const Owner = () => {
    const [formData, setFormData] = useState({
        lodOwner: "",
        lodCity: "",
        lodName: "",
        lodLocation: "",
        lodCallNum: "",
        lodImag: null,  // 이미지 파일
    });

    const [rooms, setRooms] = useState([]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "lodImag") {
            setFormData({ ...formData, lodImag: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleRoomChange = (index, e) => {
        const { name, value, files } = e.target;
        const updatedRooms = [...rooms];
        updatedRooms[index] = {
            ...updatedRooms[index],
            [name]: files ? files[0] : value,
        };
        setRooms(updatedRooms);
    };

    const addRoom = () => {
        setRooms([...rooms, { roomName: "", price: "", roomImag: null }]);
    };

    const removeRoom = (index) => {
        const updatedRooms = [...rooms];
        updatedRooms.splice(index, 1);
        setRooms(updatedRooms);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rooms.length === 0) {
            alert("최소 하나 이상의 객실을 추가해주세요.");
            return;
        }

        try {
            const form = new FormData();

            // 숙소 정보 추가
            form.append("lodOwner", formData.lodOwner);
            form.append("lodCity", formData.lodCity);
            form.append("lodName", formData.lodName);
            form.append("lodLocation", formData.lodLocation);
            form.append("lodCallNum", formData.lodCallNum);
            form.append("lodImag", formData.lodImag); // 이미지 파일

            // 객실 JSON 문자열
            const roomDataToJson = rooms.map(({ roomName, price }) => ({ roomName, price }));
            form.append("rooms", JSON.stringify(roomDataToJson));

            // 객실 이미지 파일들 따로 append
            rooms.forEach((room, index) => {
                form.append(`roomImag${index}`, room.roomImag);
            });

            await axios.post("http://localhost:8080/getRoom", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert("데이터가 성공적으로 저장되었습니다.");
            setFormData({
                lodOwner: "",
                lodCity: "",
                lodName: "",
                lodLocation: "",
                lodCallNum: "",
                lodImag: null,
            });
            setRooms([]);
        } catch (error) {
            console.error("❌ 저장 실패:", error);
            alert("데이터 저장에 실패했습니다.");
        }
    };

    const styles = {
        form: {
            maxWidth: "600px",
            margin: "0 auto",
            padding: "24px",
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            fontFamily: "Arial, sans-serif",
        },
        title: {
            fontSize: "20px",
            fontWeight: "bold",
            marginTop: "24px",
            marginBottom: "12px",
        },
        input: {
            width: "100%",
            padding: "10px",
            marginBottom: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            boxSizing: "border-box",
        },
        roomBox: {
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "16px",
            backgroundColor: "#fff",
        },
        button: {
            padding: "10px 16px",
            marginRight: "10px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            backgroundColor: "#3498db",
            color: "#fff",
        },
        greenBtn: {
            backgroundColor: "#2ecc71",
            color: "#fff",
        },
    };

    return (
        <div style={styles.form}>
            <h2 style={styles.title}>숙소 정보</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="lodOwner" value={formData.lodOwner} onChange={handleChange} style={styles.input} placeholder="숙소 올린 사람" required />
                <input type="text" name="lodName" value={formData.lodName} onChange={handleChange} style={styles.input} placeholder="숙소명" required />
                <input type="text" name="lodCity" value={formData.lodCity} onChange={handleChange} style={styles.input} placeholder="숙소 위치 도시" required />
                <input type="text" name="lodLocation" value={formData.lodLocation} onChange={handleChange} style={styles.input} placeholder="숙소 주소" required />
                <input type="text" name="lodCallNum" value={formData.lodCallNum} onChange={handleChange} style={styles.input} placeholder="숙소 전화번호" required />
                <input type="file" name="lodImag" onChange={handleChange} style={styles.input} required />

                <h3 style={styles.title}>객실 정보</h3>
                {rooms.map((room, index) => (
                    <div key={index} style={styles.roomBox}>
                        <input type="text" name="roomName" value={room.roomName} onChange={(e) => handleRoomChange(index, e)} style={styles.input} placeholder="객실명" required />
                        <input type="number" name="price" value={room.price} onChange={(e) => handleRoomChange(index, e)} style={styles.input} placeholder="객실 가격" required />
                        <input type="file" name="roomImag" onChange={(e) => handleRoomChange(index, e)} style={styles.input} required />
                        <button type="button" onClick={() => removeRoom(index)} style={styles.button}>객실 삭제</button>
                    </div>
                ))}

                <button type="button" onClick={addRoom} style={styles.button}>객실 추가</button>
                <div>
                    <button type="submit" style={{ ...styles.button, ...styles.greenBtn }}>저장</button>
                </div>
            </form>
        </div>
    );
};

export default Owner;
