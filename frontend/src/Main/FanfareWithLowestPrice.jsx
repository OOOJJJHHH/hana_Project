import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fanfare from '../image/fanfare.png';
import axios from 'axios';

const container = {
    display: 'flex',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '90%',
    maxWidth: '1200px',
    marginTop: '30px',
    gap: '30px',
};

const fanfareContainer = {
    height: "260px",
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    backgroundColor: '#fff',
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
    color: 'black',
};

const fanfareImage = {
    height: '25px',
    width: '25px',
};

const sliderContainer = {
    flex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
};

const box = {
    width: '180px',
    height: '220px',
    border: '1px solid gray',
    borderRadius: '5px',
    padding: '10px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
};

const imageStyle = {
    width: '100%',
    height: '80%',
    objectFit: 'cover',
    borderRadius: '5px',
};

const buttonStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '10px',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
};

const FanfareWithLowestPrice = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [startIndex, setStartIndex] = useState(0);

    // API 호출하여 가장 저렴한 6개 객실 가져오기
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/rooms/cheapest-top6`)
            .then(res => setRooms(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleNext = () => {
        if (startIndex + 3 < rooms.length) setStartIndex(startIndex + 3);
    };

    const handlePrev = () => {
        if (startIndex - 3 >= 0) setStartIndex(startIndex - 3);
    };

    const roomsToShow = rooms.slice(startIndex, startIndex + 3);

    return (
        <div style={container}>
            {/* Left: Fanfare Banner */}
            <div style={fanfareContainer}>
                <div style={fanfareTitle}>
                    <img src={fanfare} alt="fanfare" style={fanfareImage} />
                    <span style={fanfareText}>여가 최저가 보장!</span>
                    <img src={fanfare} alt="fanfare" style={fanfareImage} />
                </div>
                <p style={{ fontSize: '16px', textAlign: 'center', marginTop: '10px', color: '#333' }}>
                    최저가 숙소를 지금 확인해보세요!
                </p>
            </div>

            {/* Right: Lowest Price Slider */}
            <div style={sliderContainer}>
                <button onClick={handlePrev} style={buttonStyle}>&lt;</button>
                {roomsToShow.map((room, index) => (
                    <div
                        key={index}
                        style={box}
                        onClick={() => navigate(`/hotel-detail?name=${encodeURIComponent(room.clodName)}`)}
                    >
                        {room.roomImages[0] && <img src={room.roomImages[0]} alt={room.roomName} style={imageStyle} />}
                        <span>{room.roomName}</span>
                        <span style={{ fontWeight: 'bold', color: 'red' }}>{room.price.toLocaleString()}원</span>
                    </div>
                ))}
                <button onClick={handleNext} style={buttonStyle}>&gt;</button>
            </div>
        </div>
    );
};

export default FanfareWithLowestPrice;
