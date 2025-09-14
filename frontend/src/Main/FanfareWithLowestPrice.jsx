import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fanfare from '../image/fanfare.png';
import fan1 from '../image/1.jpg';
import fan2 from '../image/2.jpg';
import fan3 from '../image/3.jpg';

const container = {
    display: 'flex',
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
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
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
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
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
    const [startIndex, setStartIndex] = useState(0);

    const topHotels = [
        { name: '어진 카스텔', image: fan1 },
        { name: '백볼리', image: fan2 },
        { name: '호텔Z', image: fan3 },
    ];

    const hotelsToShow = topHotels.slice(startIndex, startIndex + 3);

    const handleNext = () => {
        if (startIndex + 3 < topHotels.length) {
            setStartIndex(startIndex + 3);
        }
    };

    const handlePrev = () => {
        if (startIndex - 3 >= 0) {
            setStartIndex(startIndex - 3);
        }
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
                <p style={{ fontSize: '16px', textAlign: 'center', marginTop: '10px', color: '#333' }}>
                    최저가 숙소를 지금 확인해보세요!
                </p>
            </div>

            {/* Right: Lowest Price Slider */}
            <div style={sliderContainer}>
                <button onClick={handlePrev} style={buttonStyle}>
                    &lt;
                </button>
                {hotelsToShow.map((hotel, index) => (
                    <div
                        key={index}
                        style={box}
                        onClick={() => navigate(`/hotel-detail?name=${encodeURIComponent(hotel.name)}`)}
                    >
                        <img src={hotel.image} alt={hotel.name} style={imageStyle} />
                        <span>{hotel.name}</span>
                    </div>
                ))}
                <button onClick={handleNext} style={buttonStyle}>
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default FanfareWithLowestPrice;
