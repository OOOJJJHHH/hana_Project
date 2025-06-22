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
  const [selectedRoom, setSelectedRoom] = useState("Standard");
  const [roomPrice, setRoomPrice] = useState(0);
  const userInfo = useContext(UserContext);

  // ⭐ 서버에서 호텔 데이터 가져오기
  useEffect(() => {
    const fetchHotelInfo = async () => {
      if (!hotelName) return;

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/hotel?name=${encodeURIComponent(hotelName)}`);
        const data = response.data;

        setHotelInfo(data);
        setCurrentIndex(0);
        setSelectedRoom("Standard");
        setRoomPrice(data.rooms?.["Standard"] || 0);
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
    setRoomPrice(hotelInfo?.rooms?.[roomType] || 0);
  };

  const handleNext = () => {
    if (hotelInfo?.images) {
      setCurrentIndex((prev) => (prev + 1) % hotelInfo.images.length);
    }
  };

  const handlePrev = () => {
    if (hotelInfo?.images) {
      setCurrentIndex((prev) => (prev - 1 + hotelInfo.images.length) % hotelInfo.images.length);
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

  if (!hotelInfo) return <div>Loading...</div>;

  return (
      <div className="hotel-detail-container">
        <div className="image-slider">
          <img
              src={hotelInfo.images[currentIndex]}
              alt={`${hotelInfo.name} ${currentIndex + 1}`}
              className="main-image"
          />
          <button className="nav-button left" onClick={handlePrev}>〈</button>
          <button className="nav-button right" onClick={handleNext}>〉</button>
        </div>

        <div className="hotel-info">
          <h1>{hotelInfo.name}</h1>
          <p>{hotelInfo.location}</p>
          <p>{hotelInfo.description}</p>

          <div className="room-selector">
            <label htmlFor="room-select">방 종류:</label>
            <select id="room-select" value={selectedRoom} onChange={handleRoomChange}>
              {hotelInfo.rooms && Object.keys(hotelInfo.rooms).map((roomType) => (
                  <option key={roomType} value={roomType}>
                    {roomType} - {hotelInfo.rooms[roomType].toLocaleString()}원
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
            <button className="wishlist-button">찜하기</button>
          </div>
        </div>

        {/* 추천 호텔 섹션 (추후 기능 구현 가능) */}
        {/* <div className="similar-hotels-section">
        <h2>같은 지역 호텔</h2>
        <div className="similar-hotel-list">
          {filteredSimilar.map((hotel, idx) => (
            <div
              key={idx}
              className="similar-hotel-card"
              onClick={() => navigate(`/hotel-detail?name=${encodeURIComponent(hotel.name)}`)}
              style={{ cursor: "pointer" }}
            >
              <img src={hotel.image} alt={hotel.name} />
              <h3>{hotel.name}</h3>
              <p>{renderStars(hotel.rating)} ({hotel.rating})</p>
            </div>
          ))}
        </div>
      </div> */}

        <div className="hotel-review-section">
          <h2>리뷰</h2>
          {hotelInfo.reviews && hotelInfo.reviews.length > 0 ? (
              hotelInfo.reviews.map((review, idx) => (
                  <div key={idx} className="review-card">
                    <p><strong>{review.user}</strong> {renderStars(review.rating)} ({review.rating})</p>
                    <p>{review.comment}</p>
                  </div>
              ))
          ) : (
              <p>아직 리뷰가 없습니다.</p>
          )}
        </div>
      </div>
  );
};

export default HotelDetail;
