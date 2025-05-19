import React, {useState, useEffect, useContext} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./HotelDetail.css";
import { UserContext } from '../Session/UserContext';

// 내부 이미지 임포트
import Hotel1Inside1 from "../image/Hotel1(inside1).jpg";
import Hotel1Inside2 from "../image/Hotel1(inside2).jpg";
import Hotel1Inside3 from "../image/Hotel1(inside3).jpg";
import Hotel1Inside4 from "../image/Hotel1(inside4).jpg";

import Hotel2Inside1 from "../image/Hotel2(inside1).jpg";
import Hotel2Inside2 from "../image/Hotel2(inside2).jpg";
import Hotel2Inside3 from "../image/Hotel2(inside3).jpg";
import Hotel2Inside4 from "../image/Hotel2(inside4).jpg";

import Hotel3Inside1 from "../image/Hotel3(inside1).jpg";
import Hotel3Inside2 from "../image/Hotel3(inside2).jpg";
import Hotel3Inside3 from "../image/Hotel3(inside3).jpg";
import Hotel3Inside4 from "../image/Hotel3(inside4).jpg";

import Hotel4Inside1 from "../image/Hotel4(inside1).jpg";
import Hotel4Inside2 from "../image/Hotel4(inside2).jpg";
import Hotel4Inside3 from "../image/Hotel4(inside3).jpg";
import Hotel4Inside4 from "../image/Hotel4(inside4).jpg";

import Hotel5Inside1 from "../image/Hotel5(inside1).jpg";
import Hotel5Inside2 from "../image/Hotel5(inside2).jpg";
import Hotel5Inside3 from "../image/Hotel5(inside3).jpg";
import Hotel5Inside4 from "../image/Hotel5(inside4).jpg";

import Hotel6Inside1 from "../image/Hotel6(inside1).jpg";
import Hotel6Inside2 from "../image/Hotel6(inside2).jpg";
import Hotel6Inside3 from "../image/Hotel6(inside3).jpg";
import Hotel6Inside4 from "../image/Hotel6(inside4).jpg";

import Hotel7Inside1 from "../image/Hotel7(inside1).jpg";
import Hotel7Inside2 from "../image/Hotel7(inside2).jpg";
import Hotel7Inside3 from "../image/Hotel7(inside3).jpg";
import Hotel7Inside4 from "../image/Hotel7(inside4).jpg";

// 추천 호텔 썸네일 이미지
import Hotel1 from "../image/Hotel1.jpg";
import Hotel2 from "../image/Hotel2.jpg";
import Hotel3 from "../image/Hotel3.jpg";
import Hotel4 from "../image/Hotel4.jpg";
import Hotel5 from "../image/Hotel5.jpg";
import Hotel6 from "../image/Hotel6.jpg";
import Hotel7 from "../image/Hotel7.jpg";

// ⭐ 랜덤 리뷰 생성 함수
const getRandomReviews = () => {
  const sampleUsers = ["민지", "지훈", "Alex", "Yuna", "Luca", "Soo", "Jin", "Emily"];
  const sampleComments = [
    "정말 좋은 숙소였어요!",
    "위치가 완벽하고 깨끗했어요.",
    "직원들이 친절했어요.",
    "다시 방문하고 싶어요.",
    "아침 식사가 맛있었어요.",
    "조용하고 아늑했어요.",
    "전반적으로 만족했어요.",
    "뷰가 정말 멋졌어요."
  ];

  const reviewCount = Math.floor(Math.random() * 2) + 1; // 1~2개 리뷰
  return Array.from({ length: reviewCount }).map(() => ({
    user: sampleUsers[Math.floor(Math.random() * sampleUsers.length)],
    comment: sampleComments[Math.floor(Math.random() * sampleComments.length)],
    rating: (Math.random() < 0.5 ? 4 : 5),
  }));
};

// 📦 호텔 상세 정보
const hotelDetails = {
  "Hotel Artemide": {
    name: "Hotel Artemide",
    location: "Rome, Italy",
    description: "Hotel Artemide 설명입니다.",
    images: [Hotel1Inside1, Hotel1Inside2, Hotel1Inside3, Hotel1Inside4],
    thumbnail: Hotel1,
    rating: 4.5,
    rooms: {
      Standard: 150000,
      Deluxe: 250000,
      VIP: 400000
    },
    reviews: getRandomReviews(),
  },
  "Hotel Diana Roof Garden": {
    name: "Hotel Diana Roof Garden",
    location: "Rome, Italy",
    description: "Hotel Diana Roof Garden 설명입니다.",
    images: [Hotel2Inside1, Hotel2Inside2, Hotel2Inside3, Hotel2Inside4],
    thumbnail: Hotel2,
    rating: 4.2,
    rooms: {
      Standard: 120000,
      Deluxe: 220000,
      VIP: 350000
    },
    reviews: getRandomReviews(),
  },
  "Starhotels Metropole": {
    name: "Starhotels Metropole",
    location: "Rome, Italy",
    description: "Starhotels Metropole 설명입니다.",
    images: [Hotel3Inside1, Hotel3Inside2, Hotel3Inside3, Hotel3Inside4],
    thumbnail: Hotel3,
    rating: 4.0,
    rooms: {
      Standard: 140000,
      Deluxe: 230000,
      VIP: 360000
    },
    reviews: getRandomReviews(),
  },
  "Rome Marriott Grand Hotel Flora": {
    name: "Rome Marriott Grand Hotel Flora",
    location: "Rome, Italy",
    description: "Rome Marriott Grand Hotel Flora 설명입니다.",
    images: [Hotel4Inside1, Hotel4Inside2, Hotel4Inside3, Hotel4Inside4],
    thumbnail: Hotel4,
    rating: 4.4,
    rooms: {
      Standard: 160000,
      Deluxe: 270000,
      VIP: 420000
    },
    reviews: getRandomReviews(),
  },
  "Intercontinental Rome Ambasciatori Palace": {
    name: "Intercontinental Rome Ambasciatori Palace",
    location: "Rome, Italy",
    description: "Intercontinental Rome Ambasciatori Palace 설명입니다.",
    images: [Hotel5Inside1, Hotel5Inside2, Hotel5Inside3, Hotel5Inside4],
    thumbnail: Hotel5,
    rating: 4.3,
    rooms: {
      Standard: 180000,
      Deluxe: 300000,
      VIP: 450000
    },
    reviews: getRandomReviews(),
  },
  "Il Grande Gatsby Bar & Restaurant": {
    name: "Il Grande Gatsby Bar & Restaurant",
    location: "Rome, Italy",
    description: "Il Grande Gatsby Bar & Restaurant 설명입니다.",
    images: [Hotel6Inside1, Hotel6Inside2, Hotel6Inside3, Hotel6Inside4],
    thumbnail: Hotel6,
    rating: 4.1,
    rooms: {
      Standard: 110000,
      Deluxe: 210000,
      VIP: 330000
    },
    reviews: getRandomReviews(),
  },
  "Hotel Scott House": {
    name: "Hotel Scott House",
    location: "Rome, Italy",
    description: "Hotel Scott House 설명입니다.",
    images: [Hotel7Inside1, Hotel7Inside2, Hotel7Inside3, Hotel7Inside4],
    thumbnail: Hotel7,
    rating: 3.9,
    rooms: {
      Standard: 130000,
      Deluxe: 220000,
      VIP: 350000
    },
    reviews: getRandomReviews(),
  },
};

const HotelDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const hotelName = queryParams.get("name");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("Standard"); // 기본 선택 방
  const [roomPrice, setRoomPrice] = useState(0); // 기본 가격

  const userInfo = useContext(UserContext);

  const handleReservationClick = () => {
    if (!userInfo) {
      alert("로그인을 하셔야 합니다.");
      return;
    }
    alert("예약이 완료되었습니다.");
  };
  useEffect(() => {
    if (hotelName && hotelDetails[hotelName]) {
      setHotelInfo(hotelDetails[hotelName]);
      setCurrentIndex(0);
      setSelectedRoom("Standard"); // 기본 방을 "Standard"로 설정
      setRoomPrice(hotelDetails[hotelName].rooms["Standard"]); // 기본 가격 설정
    }
  }, [hotelName]);

  const handleRoomChange = (event) => {
    const roomType = event.target.value;
    setSelectedRoom(roomType);
    setRoomPrice(hotelInfo.rooms[roomType]); // 선택한 방에 따른 가격 변경
  };

  const handleNext = () => {
    if (hotelInfo) {
      setCurrentIndex((prev) => (prev + 1) % hotelInfo.images.length);
    }
  };

  const handlePrev = () => {
    if (hotelInfo) {
      setCurrentIndex((prev) => (prev - 1 + hotelInfo.images.length) % hotelInfo.images.length);
    }
  };

  if (!hotelInfo) return <div>Loading...</div>;

  const filteredSimilar = Object.values(hotelDetails)
    .filter((h) => h.name !== hotelInfo.name && h.location === hotelInfo.location)
    .map((h) => ({
      name: h.name,
      image: h.thumbnail,
      rating: h.rating,
    }));

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) stars.push("★");
    if (hasHalfStar) stars.push("☆");
    while (stars.length < 5) stars.push("✩");

    return stars.join("");
  };

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
            {Object.keys(hotelInfo.rooms).map((roomType) => (
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

      <div className="similar-hotels-section">
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
      </div>

      <div className="hotel-review-section">
        <h2>리뷰</h2>
        {hotelInfo.reviews.length > 0 ? (
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
export const topRatedHotels = Object.values(hotelDetails)
    .sort((a, b) => b.rating - a.rating) // 평점 내림차순 정렬
    .slice(0, 6); // 상위 6개

export default HotelDetail;
