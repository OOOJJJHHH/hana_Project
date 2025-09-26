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
    height: '230px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '10px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
};

const placeholderImage = {
    width: '100%',
    height: '130px',
    backgroundColor: '#ddd',
    borderRadius: '6px',
};

const hotelName = {
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '10px',
};

const ratingStyle = {
    fontSize: '14px',
    color: '#555',
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
            .then(res => setRooms(res.data))
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
                        onClick={() => navigate(`/hotel-detail?name=${encodeURIComponent(room.roomName)}`)}
                    >
                        <div style={placeholderImage}></div>
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
