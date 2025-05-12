// gift-event.jsx
import React from 'react';
import giftEventImg from '../image/gift-event.jpg';

const GiftEvent = () => {
    return (
        <div className="gift-event-container">
            <h1 className="gift-event-title">숙박 고객 경품 이벤트</h1>
            <div className="gift-event-content">
                <img src={giftEventImg} alt="숙박 고객 경품 이벤트" className="gift-event-image" />
                <div className="gift-event-description">
                    <p>숙박 고객을 대상으로 진행하는 추첨 이벤트입니다! 푸짐한 선물들이 기다리고 있습니다.</p>
                    <p>이벤트에 참여하여 다양한 경품을 받을 기회를 놓치지 마세요. 숙박하시면 자동으로 참여됩니다.</p>
                </div>
                <a href="/" className="gift-event-button">이벤트 참여하기</a>
            </div>

            <style>{`
        .gift-event-container {
          padding: 60px 20px;
          font-family: 'Arial', sans-serif;
        }
        .gift-event-title {
          text-align: center;
          font-size: 36px;
          font-weight: bold;
          color: #333;
          margin-bottom: 40px;
        }
        .gift-event-content {
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
        .gift-event-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .gift-event-description {
          font-size: 18px;
          color: #555;
          text-align: center;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .gift-event-button {
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
        .gift-event-button:hover {
          background-color: #005dc1;
        }
      `}</style>
        </div>
    );
};

export default GiftEvent;
