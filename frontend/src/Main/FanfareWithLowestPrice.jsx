// src/components/Main/FanfareWithLowestPrice.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fanfare from '../image/fanfare.png';
import axios from 'axios';

const container = {
    display: 'flex',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '90%',
    maxWidth: '1200px',
    marginTop: '35px',
    gap: '30px',
};

const fanfareContainer = {
    height: '260px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    backgroundColor: '#fff',
    padding: '15px',
};

const fanfareTitle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
};

const fanfareText = {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
};

const fanfareImage = {
    height: '25px',
    width: '25px',
};

const sliderOuter = {
    flex: 2,
    overflow: 'hidden',
    borderRadius: '12px',
    backgroundColor: '#fff',
    padding: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
};

const sliderInner = {
    display: 'flex',
    gap: '15px',
    transition: 'transform 0.5s ease',
};

const box = {
    width: '180px',
    height: '250px',
    borderRadius: '8px',
    padding: '10px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    flexShrink: 0,
    backgroundColor: '#fdfdfd',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s',
};

const imageStyle = {
    width: '100%',
    height: '80%',
    objectFit: 'cover',
    borderRadius: '6px',
    marginBottom: '5px',
};

const buttonStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    padding: '10px 15px',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    color: '#888',
    transition: 'color 0.3s',
};

const FanfareWithLowestPrice = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const visibleCount = 3; // 한 화면에 보이는 카드 수
    const CARD_WIDTH = 190;
    const GAP = 28;

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/rooms/cheapest-top6`)
            .then(res => {
                setRooms(res.data.slice(0, 9)); // 최대 9개만 표시
            })
            .catch(err => console.error(err));
    }, []);

    const handleNext = () => {
        const maxIndex = rooms.length - visibleCount;
        setCurrentIndex(currentIndex >= maxIndex ? 0 : currentIndex + 1);
    };

    const handlePrev = () => {
        const maxIndex = rooms.length - visibleCount;
        setCurrentIndex(currentIndex === 0 ? maxIndex : currentIndex - 1);
    };

    return (
        <div style={container}>
            {/* Left: Fanfare Banner */}
            <div style={fanfareContainer}>
                <div style={fanfareTitle}>
                    <img src={fanfare} alt="fanfare" style={fanfareImage} />
                    <span style={fanfareText}>여가 최저가 보장!</span>
                    <img src={fanfare} alt="fanfare" style={fanfareImage} />
                </div>
                <p style={{ fontSize: '16px', textAlign: 'center', marginTop: '10px', color: '#555' }}>
                    최저가 숙소를 지금 확인해보세요!
                </p>
            </div>

            {/* Right: Slider */}
            <div style={sliderOuter}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button onClick={handlePrev} style={buttonStyle}>&lt;</button>
                    <div style={{ overflow: 'hidden', width: `${visibleCount * (CARD_WIDTH + GAP) - GAP}px` }}>
                        <div
                            style={{
                                ...sliderInner,
                                width: `${rooms.length * (CARD_WIDTH + GAP) - GAP}px`,
                                transform: `translateX(-${currentIndex * (CARD_WIDTH + GAP)}px)`,
                            }}
                        >
                            {rooms.map((room, index) => (
                                <div
                                    key={index}
                                    style={box}
                                    onClick={() => navigate(`/hotel-detail?name=${encodeURIComponent(room.clodName)}`)}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    {room.roomImages?.[0] && (
                                        <img src={room.roomImages[0]} alt={room.roomName} style={imageStyle} />
                                    )}
                                    <span style={{ fontWeight: 'bold', textAlign: 'center' }}>{room.roomName}</span>
                                    <span style={{ fontWeight: 'bold', color: '#e53935', marginTop: '5px' }}>
                                        {room.price.toLocaleString()}원
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleNext} style={buttonStyle}>&gt;</button>
                </div>
            </div>
        </div>
    );
};

export default FanfareWithLowestPrice;
