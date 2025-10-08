// src/components/Main/TopRatedHotels.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const container = {
    width: '90%',
    maxWidth: '1180px',
    margin: '40px auto',
    fontFamily: "'Noto Sans', sans-serif",
};

const title = {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "25px",
    color: "#333",
    textAlign: "left", // 왼쪽 정렬
};

const hotelList = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // 왼쪽 정렬
};

const card = {
    width: '220px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    backgroundColor: '#fff',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
};

const cardHover = {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
};

const imageWrapper = {
    width: '100%',
    height: '140px',
    overflow: 'hidden',
    backgroundColor: '#eee',
};

const imageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s',
};

const infoWrapper = {
    padding: '12px 15px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
};

const hotelName = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#222',
    marginBottom: '6px',
    lineHeight: '1.2',
};

const ratingStyle = {
    fontSize: '14px',
    color: '#666',
};

// ⭐ 평점 숫자 → 별 표시
const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) stars.push("★");
    if (hasHalfStar) stars.push("☆");
    while (stars.length < 5) stars.push("✩");

    return stars.join("");
};

const TopRatedHotels = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/rooms/top5`)
            .then(res => {
                console.log("TopRatedHotels API 데이터:", res.data);
                setRooms(res.data);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <div style={container}>
            <div style={title}>평점순 숙소</div>
            <div style={hotelList}>
                {rooms.map((room, index) => (
                    <div
                        key={room.roomId}
                        style={{ ...card, ...(hoverIndex === index ? cardHover : {}) }}
                        onClick={() => navigate(`/hotel-detail?name=${encodeURIComponent(room.clodName)}`)}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <div style={imageWrapper}>
                            {room.roomImages && room.roomImages.length > 0 ? (
                                <img
                                    src={room.roomImages[0]}
                                    alt={room.roomName}
                                    style={{ ...imageStyle, ...(hoverIndex === index ? { transform: 'scale(1.05)' } : {}) }}
                                />
                            ) : (
                                <div style={imageStyle}></div>
                            )}
                        </div>
                        <div style={infoWrapper}>
                            <div style={hotelName}>{room.roomName} ({room.clodName})</div>
                            <div style={ratingStyle}>
                                {renderStars(room.averageRating)} ({room.averageRating.toFixed(1)}, {room.reviewCount}개 리뷰)
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopRatedHotels;
