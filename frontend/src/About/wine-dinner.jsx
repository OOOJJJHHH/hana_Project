// wine-dinner.jsx
import React from 'react';
import wineDinnerImg from '../image/wine-dinner.jpg';

const WineDinner = () => {
    return (
        <div className="wine-dinner-container">
            <h1 className="wine-dinner-title">와인 & 디너 패키지</h1>
            <div className="wine-dinner-content">
                <img src={wineDinnerImg} alt="와인 & 디너 패키지" className="wine-dinner-image" />
                <div className="wine-dinner-description">
                    <p>로맨틱한 밤을 위한 와인과 디너가 포함된 특별한 패키지입니다.</p>
                    <p>예약을 통해 와인과 고급 디너를 포함한 한정 패키지를 제공합니다.</p>
                    <p>상시 진행되는 이벤트로, 사랑하는 사람과 특별한 시간을 보내세요.</p>
                </div>
                <a href="/" className="wine-dinner-button">예약하기</a>
            </div>

            <style>{`
        .wine-dinner-container {
          padding: 60px 20px;
          font-family: 'Arial', sans-serif;
        }
        .wine-dinner-title {
          text-align: center;
          font-size: 36px;
          font-weight: bold;
          color: #333;
          margin-bottom: 40px;
        }
        .wine-dinner-content {
          background-color: #f5f5f5;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          padding: 40px;
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .wine-dinner-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .wine-dinner-description {
          font-size: 18px;
          color: #555;
          text-align: center;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .wine-dinner-button {
          display: block;
          margin: 0 auto;
          background-color: #007bff;
          color: white;
          padding: 12px 30px;
          font-size: 16px;
          border-radius: 9999px;
          text-align: center;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }
        .wine-dinner-button:hover {
          background-color: #005dc1;
        }
      `}</style>
        </div>
    );
};

export default WineDinner;
