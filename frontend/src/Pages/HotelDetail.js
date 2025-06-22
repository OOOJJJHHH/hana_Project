import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./HotelDetail.css";
import { UserContext } from "../Session/UserContext";

const HotelDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const hotelName = queryParams.get("name");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);
  const [roomImages, setRoomImages] = useState([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const userInfo = useContext(UserContext);

  useEffect(() => {
    const fetchHotelInfo = async () => {
      if (!hotelName) return;

      try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/getlodUseN/${encodeURIComponent(hotelName)}`
        );
        const data = response.data;

        setHotelInfo(data);

        if (data.rooms && data.rooms.length > 0) {
          const initialRoom = data.rooms[0];
          setSelectedRoom(initialRoom.roomName);
          setRoomPrice(initialRoom.price);
          setRoomImages(initialRoom.images || []);
        }

        setCurrentIndex(0);
      } catch (error) {
        console.error("호텔 정보 가져오기 실패:", error);
        alert("호텔 정보를 불러오는데 실패했습니다.");
      }
    };

    fetchHotelInfo();
  }, [hotelName]);

  const handleReservationClick = () => {
    if (!userInfo) {
      alert("로그인을 하셔야 합니다.");
      return;
    }
    alert("예약이 완료되었습니다.");
  };

  const handleRoomChange = (event) => {
    const roomType = event.target.value;
    setSelectedRoom(roomType);

    const selected = hotelInfo.rooms.find((room) => room.roomName === roomType);
    setRoomPrice(selected?.price || 0);
    setRoomImages(selected?.images || []);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (roomImages.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % roomImages.length);
    }
  };

  const handlePrev = () => {
    if (roomImages.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) stars.push("★");
    if (hasHalfStar) stars.push("☆");
    while (stars.length < 5) stars.push("✩");

    return stars.join("");
  };

  // 찜하기 버튼 클릭 핸들러 개선 버전
  const handleWishlistClick = async () => {
    if (!userInfo) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!hotelInfo || !selectedRoom) {
      alert("숙소 정보가 올바르지 않습니다.");
      return;
    }

    const selectedRoomObj = hotelInfo.rooms.find(room => room.roomName === selectedRoom);
    if (!selectedRoomObj) {
      alert("선택된 방을 찾을 수 없습니다.");
      return;
    }

    setIsWishlistLoading(true);

    try {
      // POST 요청의 body에 데이터 담아 보냄
      const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/wishlist/add`,
          {
            lodName: hotelInfo.lodName,           // 숙소 이름
            roomName: selectedRoomObj.roomName,   // 방 이름
            userId: userInfo.id,                   // 로그인한 사용자 고유 ID (필수)
          }
      );

      if(response.data.success){
        alert("찜목록에 추가되었습니다.");
      } else {
        alert(response.data.message || "이미 찜한 항목입니다.");
      }

    } catch (error) {
      console.error("찜 추가 실패:", error);
      alert("찜 추가에 실패했습니다.");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  if (!hotelInfo) return <div>Loading...</div>;

  return (
      <div className="hotel-detail-container">
        <div className="image-slider">
          {hotelInfo.rooms && hotelInfo.rooms.length > 0 && (() => {
            const selectedRoomData = hotelInfo.rooms.find(room => room.roomName === selectedRoom);
            return selectedRoomData ? (
                <>
                  <img
                      src={selectedRoomData.roomImag}
                      alt={`room-${selectedRoomData.roomName}`}
                      className="main-image"
                  />
                </>
            ) : (
                <p>선택된 방의 이미지가 없습니다.</p>
            );
          })()}
        </div>

        <div className="hotel-info">
          <h1>{hotelInfo.lodName}</h1>
          <p>{hotelInfo.lodLocation}</p>
          <p>소유자: {hotelInfo.lodOwner}</p>
          <p>연락처: {hotelInfo.lodCallNum}</p>

          <div className="room-selector">
            <label htmlFor="room-select">방 종류:</label>
            <select id="room-select" value={selectedRoom} onChange={handleRoomChange}>
              {hotelInfo.rooms && hotelInfo.rooms.map(room => (
                  <option key={room.id} value={room.roomName}>
                    {room.roomName} - {room.price.toLocaleString()}원
                  </option>
              ))}
            </select>
          </div>

          <div className="room-price">
            <h3>선택된 방: {selectedRoom}</h3>
            <p>가격: {roomPrice.toLocaleString()}원</p>
          </div>

          <div className="action-buttons">
            <button className="reserve-button" onClick={handleReservationClick}>
              예약하기
            </button>
            <button
                className="wishlist-button"
                onClick={handleWishlistClick}
                disabled={isWishlistLoading}
            >
              {isWishlistLoading ? "처리중..." : "찜하기"}
            </button>
          </div>
        </div>

        <div className="hotel-review-section">
          <h2>리뷰</h2>
          {hotelInfo.reviews && hotelInfo.reviews.length > 0 ? (
              hotelInfo.reviews.map((review, idx) => (
                  <div key={idx} className="review-card">
                    <p>
                      <strong>{review.user}</strong> {renderStars(review.rating)} ({review.rating})
                    </p>
                    <p>{review.comment}</p>
                  </div>
              ))
          ) : (
              <p>아직 리뷰가 없습니다.</p>
          )}
        </div>

        {hotelInfo.rooms && hotelInfo.rooms.length > 0 && (
            <div className="debug-room-info">
              <h3>✅ 방 정보 전체 디버깅 출력:</h3>
              {hotelInfo.rooms.map((room, index) => (
                  <div key={room.id}>
                    <p>🛏 Room {index + 1}</p>
                    <p>방 이름: {room.roomName}</p>
                    <p>가격: {room.price}</p>
                    <p>이미지 URL: {room.roomImag}</p>
                    <img
                        src={room.roomImag}
                        alt={`room-${room.roomName}`}
                        style={{ width: "200px", height: "auto", marginBottom: "1rem" }}
                    />
                    <hr />
                  </div>
              ))}
            </div>
        )}
      </div>
  );
};

export default HotelDetail;
