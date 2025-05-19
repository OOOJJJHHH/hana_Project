import { useState } from "react";
import axios from "axios";

const Owner = () => {
    const [formData, setFormData] = useState({
        lodOwner: "",
        lodCity: "",
        lodName: "",
        lodLocation: "",
        lodCallNum: "",
        lodImag: null,
        lodImagPreview: "",
    });

    const [rooms, setRooms] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLodImagChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    lodImag: file,
                    lodImagPreview: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLodImage = () => {
        setFormData({
            ...formData,
            lodImag: null,
            lodImagPreview: "",
        });
    };

    const handleRoomChange = (index, e) => {
        const { name, value } = e.target;
        const updatedRooms = [...rooms];
        updatedRooms[index][name] = value;
        setRooms(updatedRooms);
    };

    const handleRoomImageChange = (index, e) => {
        const files = Array.from(e.target.files);
        const updatedRooms = [...rooms];
        updatedRooms[index].roomImag = files;

        const readerPromises = files.map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readerPromises).then((images) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rooms.length === 0) {
            alert("최소 하나 이상의 객실을 추가해주세요.");
            return;
        }

        try {
            const form = new FormData();

            // 숙소 정보
            form.append("lodOwner", formData.lodOwner);
            form.append("lodCity", formData.lodCity);
            form.append("lodName", formData.lodName);
            form.append("lodLocation", formData.lodLocation);
            form.append("lodCallNum", formData.lodCallNum);
            if (formData.lodImag) {
                form.append("lodImag", formData.lodImag);
            }

            // rooms JSON (roomName, price만)
            const roomMeta = rooms.map((room) => ({
                roomName: room.roomName,
                price: room.price,
            }));
            form.append("rooms", JSON.stringify(roomMeta));

            // 객실 이미지들: 최대 5개까지 전송
            rooms.forEach((room, index) => {
                if (index < 5 && room.roomImag.length > 0) {
                    form.append(`roomImag${index}`, room.roomImag[0]); // 첫 번째 이미지만 전송
                }
            });

            await axios.post(`${process.env.REACT_APP_API_URL}/addRoom`, form, {
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
                lodImagPreview: "",
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
        imagePreview: {
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginTop: "8px",
        },
        imageContainer: {
            position: "relative",
            display: "inline-block",
        },
        image: {
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "8px",
        },
        removeBtn: {
            position: "absolute",
            top: "-5px",
            right: "-5px",
            backgroundColor: "red",
            color: "white",
            borderRadius: "50%",
            border: "none",
            width: "20px",
            height: "20px",
            cursor: "pointer",
            fontWeight: "bold",
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
                <input type="file" name="lodImag" onChange={handleLodImagChange} style={styles.input} accept="image/*" required />
                {formData.lodImagPreview && (
                    <div style={styles.imagePreview}>
                        <div style={styles.imageContainer}>
                            <img src={formData.lodImagPreview} alt="lod-imag-preview" style={styles.image} />
                            <button type="button" onClick={removeLodImage} style={styles.removeBtn}>×</button>
                        </div>
                    </div>
                )}

                <h3 style={styles.title}>객실 정보</h3>
                {rooms.map((room, index) => (
                    <div key={index} style={styles.roomBox}>
                        <input type="text" name="roomName" value={room.roomName} onChange={(e) => handleRoomChange(index, e)} style={styles.input} placeholder="객실명" required />
                        <input type="number" name="price" value={room.price} onChange={(e) => handleRoomChange(index, e)} style={styles.input} placeholder="객실 가격" required />
                        <input type="file" name="roomImag" onChange={(e) => handleRoomImageChange(index, e)} style={styles.input} accept="image/*" multiple required />
                        {room.roomImagPreview && room.roomImagPreview.length > 0 && (
                            <div style={styles.imagePreview}>
                                {room.roomImagPreview.map((image, imageIndex) => (
                                    <div key={imageIndex} style={styles.imageContainer}>
                                        <img src={image} alt={`room-image-${imageIndex}`} style={styles.image} />
                                        <button type="button" onClick={() => removeRoomImage(index, imageIndex)} style={styles.removeBtn}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
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
