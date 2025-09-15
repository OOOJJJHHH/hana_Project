import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./HotelDetail.css";
import { UserContext } from "../Session/UserContext";
import ReserPopup from "./ReserPopup";
import HotelReviews from "./HotelReviews";

const HotelDetail = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hotelName = queryParams.get("name");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);
  const [roomImages, setRoomImages] = useState([]);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isWish, setIsWish] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const userInfo = useContext(UserContext);

  // 호텔 정보 불러오기
  useEffect(() => {
    if (!hotelName) return;

    const fetchHotelInfo = async () => {
      try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/getlodUseN/${encodeURIComponent(hotelName)}`
        );
        const data = response.data;
        console.log(response.data);
        setHotelInfo(data);

        if (data.rooms?.length > 0) {
          const initialRoom = data.rooms[0];
          setSelectedRoom(initialRoom.roomName);
          setRoomPrice(initialRoom.price);
          setRoomImages(initialRoom.roomImages || []);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error("호텔 정보 가져오기 실패:", error);
        alert("호텔 정보를 불러오는데 실패했습니다.");
      }
    };

    fetchHotelInfo();
  }, [hotelName]);

  // 찜 상태 불러오기 (hotelName, userInfo, selectedRoom 변경 시)
  useEffect(() => {
    if (!userInfo || !hotelName || !selectedRoom) return;

    const fetchWishlistStatus = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/wishlist/check`, {
          params: {
            userName: userInfo.uId,
            lodName: hotelName,
            roomName: selectedRoom,
          },
        });
        if (response.data.success) {
          setIsWish(response.data.isWish);
        }
      } catch (error) {
        console.error("찜 상태 확인 실패:", error);
      }
    };

    fetchWishlistStatus();
  }, [hotelName, userInfo, selectedRoom]);



  // 서버에 예약 요청 보내는 함수
  const submitReservationToServer = async (reservationData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/reservation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 인증 토큰 필요 시 Authorization 헤더 추가
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        throw new Error("예약 실패");
      }

      const result = await response.json();
      alert("예약 성공! 자세한 내용은 마이페이지에서 확인해주세요! ");
      setIsPopupOpen(false);

    } catch (error) {
      alert("예약 중 오류가 발생했습니다: " + error.message);
    }
  };



  const handleReservationClick = () => {
    if (!userInfo) {
      alert("로그인이 필요합니다.");
      return;
    }
    setIsPopupOpen(true);
  };

  const handleRoomChange = (e) => {
    const roomType = e.target.value;
    setSelectedRoom(roomType);
    const selected = hotelInfo.rooms.find((room) => room.roomName === roomType);
    setRoomPrice(selected?.price || 0);
    setRoomImages(selected?.roomImages || []);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % roomImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + roomImages.length) % roomImages.length);
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < full; i++) stars.push("★");
    if (half) stars.push("☆");
    while (stars.length < 5) stars.push("✩");
    return stars.join("");
  };

  const handleWishlistClick = async () => {
    if (!userInfo || !selectedRoom) {
      alert("로그인 및 방 선택이 필요합니다.");
      return;
    }

    setIsWishlistLoading(true);
    try {
      const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/wishlist/toggle`,
          {
            userId: userInfo.uId,
            lodName: hotelName,
            roomName: selectedRoom,
          },
          { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setIsWish(response.data.isWish);
        alert(response.data.message);
      } else {
        alert(response.data.message || "처리 중 문제가 발생했습니다.");
      }
    } catch (error) {
      console.error("찜 요청 실패:", error);
      alert(error.response?.data?.message || "에러가 발생했습니다.");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  if (!hotelInfo) return <div>Loading...</div>;

  return (
      <div className="hotel-detail-container">
        <div className="image-slider">
          {roomImages.length === 0 ? (
              <p>이미지가 없습니다.</p>
          ) : (
              <>
                {roomImages.length > 1 && (
                    <button className="nav-button left" onClick={handlePrev} aria-label="이전 이미지">⟨</button>
                )}
                <img src={roomImages[currentIndex]} alt="room" className="main-image" />
                {roomImages.length > 1 && (
                    <button className="nav-button right" onClick={handleNext} aria-label="다음 이미지">⟩</button>
                )}
              </>
          )}
        </div>

        <div className="hotel-info">
          <h1>{hotelInfo.lodName}</h1>
          <p>{hotelInfo.lodLocation}</p>
          <p>소유자: {hotelInfo.lodOwner}</p>
          <p>연락처: {hotelInfo.lodCallNum}</p>

          <div className="room-selector">
            <label htmlFor="room-select">방 종류:</label>
            <select id="room-select" value={selectedRoom} onChange={handleRoomChange}>
              {hotelInfo.rooms.map((room) => (
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
            {userInfo?.uUser === "landlord" ? (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  계정 타입이 "숙소 게시자(landlord)" 일 경우에는 예약하지 못합니다
                </p>
            ) : (
                <>
                  <button className="reserve-button" onClick={handleReservationClick}>
                    예약하기
                  </button>
                  <button
                      className="wishlist-button"
                      onClick={handleWishlistClick}
                      disabled={isWishlistLoading}
                  >
                    {isWishlistLoading ? "처리중..." : isWish ? "💖 찜취소" : "🤍 찜하기"}
                  </button>
                </>
            )}
          </div>

        </div>

        <HotelReviews
            hotelId={hotelInfo.id}
            roomId={hotelInfo.rooms.find(r => r.roomName === selectedRoom)?.id}
            userId={userInfo?.uId}
        />

        {/* 모달 표시 */}
        {isPopupOpen && (
            <ReserPopup
                rooms={hotelInfo.rooms}        // 전체 방 리스트 전달
                selectedRoomName={selectedRoom} // 현재 선택된 방 이름
                roomInfo={{
                  hotelId: hotelInfo.id,
                  hotelName: hotelInfo.lodName,
                  roomName: selectedRoom,
                  roomPrice: roomPrice,
                }}
                onClose={() => setIsPopupOpen(false)}
                onSubmitReservation={(reservationData) => {
                  // 예약 완료 처리
                  console.log("예약 정보:", reservationData);
                  submitReservationToServer(reservationData);
                }}
            />

        )}


      </div>
  );
};

export default HotelDetail;
