// src/components/Main/TopRatedHotels.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

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
    justifyContent: 'center',  // 이 부분 추가
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

    const topHotels = [
        { name: '어진 카스텔', rating: 4.5 },
        { name: '백볼리', rating: 4.7 },
        { name: '호텔Z', rating: 4.9 },
        { name: '준희비에토', rating: 4.3 },
        { name: '석현치아노', rating: 4.2 },
    ];

    return (
        <div style={container}>
            <div style={title}>평점순 숙소</div>
            <div style={hotelList}>
                {topHotels.map((hotel, index) => (
                    <div
                        key={index}
                        style={card}
                        onClick={() => navigate(`/hotel-detail?name=${encodeURIComponent(hotel.name)}`)}
                    >
                        <div style={placeholderImage}></div>
                        <div style={hotelName}>{hotel.name}</div>
                        <div style={ratingStyle}>
                            {renderStars(hotel.rating)} ({hotel.rating})
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopRatedHotels;
