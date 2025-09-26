// src/components/Main/TopRatedHotels.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const container = {
    width: '90%',
    maxWidth: '1180px',
    marginTop: '40px',
};

const title = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
};

const hotelList = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
};

const card = {
    width: '200px',
    height: '260px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#f9f9f9',
};

const imageStyle = {
    width: '100%',
    height: '130px',
    objectFit: 'cover',
    borderRadius: '6px',
    backgroundColor: '#ddd',
};

const hotelName = {
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
};

const ratingStyle = {
    fontSize: '14px',
    color: '#555',
    marginTop: '5px',
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

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/rooms/top5-reviews`)
            .then(res => {
                console.log("TopRatedHotels API 데이터:", res.data); // ← 여기에 콘솔 출력
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
                        key={index}
                        style={card}
                        onClick={() => navigate(`/hotel-detail?name=${encodeURIComponent(room.clodName)}`)}
                    >
                        {/* 대표 이미지 */}
                        {room.roomImages && room.roomImages.length > 0 ? (
                            <img
                                src={room.roomImages[0]}
                                alt={room.roomName}
                                style={imageStyle}
                            />
                        ) : (
                            <div style={imageStyle}></div>
                        )}

                        <div style={hotelName}>{room.roomName} ({room.clodName})</div>
                        <div style={ratingStyle}>
                            {renderStars(room.averageRating)} ({room.averageRating.toFixed(1)}, {room.reviewCount}개 리뷰)
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopRatedHotels;
