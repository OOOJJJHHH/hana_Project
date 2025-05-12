import React, { useState } from "react";

const Lodging = () => {
  const [lodgingInfo, setLodgingInfo] = useState({
    owner: "어진",
    name: "",
    city: "",
    address: "",
    phone: "",
  });

  const [rooms, setRooms] = useState([{ roomName: "", price: "", imageFiles: [] }]);

  const handleLodgingChange = (e) => {
    const { name, value } = e.target;
    setLodgingInfo({ ...lodgingInfo, [name]: value });
  };

  const handleRoomChange = (index, e) => {
    const { name, value } = e.target;
    const updatedRooms = [...rooms];
    updatedRooms[index][name] = value;
    setRooms(updatedRooms);
  };

  const addRoom = () => {
    setRooms([...rooms, { roomName: "", price: "", imageFiles: [] }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("숙소 정보:", lodgingInfo);
    console.log("객실 정보:", rooms);
  };

  const handleImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    const updatedRooms = [...rooms];
    updatedRooms[index].imageFiles = files;
    setRooms(updatedRooms);
  };

  const handleImageDelete = (roomIndex, fileIndex) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].imageFiles.splice(fileIndex, 1);
    setRooms(updatedRooms);
  };

  const removeRoom = (index) => {
    const updatedRooms = [...rooms];
    updatedRooms.splice(index, 1);
    setRooms(updatedRooms);
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
    },
    blueBtn: {
      backgroundColor: "#3498db",
      color: "#fff",
    },
    greenBtn: {
      backgroundColor: "#2ecc71",
      color: "#fff",
    },
  };

  return (
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>숙소 정보</h2>

        <input
            name="owner"
            value={lodgingInfo.owner}
            readOnly
            style={{ ...styles.input, backgroundColor: "#eee", cursor: "not-allowed" }}
        />
        <input name="name" placeholder="숙소 명" value={lodgingInfo.name} onChange={handleLodgingChange} style={styles.input} />
        <input name="city" placeholder="숙소 위치 (도시)" value={lodgingInfo.city} onChange={handleLodgingChange} style={styles.input} />
        <input name="address" placeholder="숙소 주소" value={lodgingInfo.address} onChange={handleLodgingChange} style={styles.input} />
        <input name="phone" placeholder="숙소 전화번호" value={lodgingInfo.phone} onChange={handleLodgingChange} style={styles.input} />

        <h2 style={styles.title}>객실 정보</h2>

        {rooms.map((room, index) => (
            <div key={index} style={styles.roomBox}>
              <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageChange(index, e)}
                  style={styles.input}
              />
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "8px" }}>
                {room.imageFiles &&
                    room.imageFiles.map((file, fileIdx) => (
                        <div key={fileIdx} style={{ position: "relative" }}>
                          <img
                              src={URL.createObjectURL(file)}
                              alt="preview"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                                borderRadius: "6px",
                                border: "1px solid #ccc"
                              }}
                          />
                          <button
                              type="button"
                              onClick={() => handleImageDelete(index, fileIdx)}
                              style={{
                                position: "absolute",
                                top: "-8px",
                                right: "-8px",
                                background: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                                fontSize: "12px"
                              }}
                          >
                            ×
                          </button>
                        </div>
                    ))}
              </div>

              <input name="roomName" placeholder="객실 명" value={room.roomName} onChange={(e) => handleRoomChange(index, e)} style={styles.input} />
              <input name="price" placeholder="가격" value={room.price} onChange={(e) => handleRoomChange(index, e)} style={styles.input} />

              <button
                  type="button"
                  onClick={() => removeRoom(index)}
                  style={{
                    ...styles.button,
                    backgroundColor: "#e74c3c",
                    color: "#fff",
                    marginTop: "8px"
                  }}
              >
                객실 삭제
              </button>
            </div>
        ))}

        <button type="button" onClick={addRoom} style={{ ...styles.button, ...styles.blueBtn }}>
          객실 추가
        </button>

        <button type="submit" style={{ ...styles.button, ...styles.greenBtn }}>
          저장
        </button>
      </form>
  );
};

export default Lodging;
