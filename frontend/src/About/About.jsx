import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Session/UserContext'; // UserContext 경로를 확인해주세요.
import springSaleImg from '../image/spring-sale.jpg';
import wineDinnerImg from '../image/wine-dinner.jpg';
import giftEventImg from '../image/gift-event.jpg';

const About = () => {
    // UserContext에서 로그인한 사용자 정보를 가져옵니다.
    const userInfo = useContext(UserContext);

    const events = [
        {
            id: 1,
            title: '봄맞이 스페셜 할인',
            description: '전 객실 최대 30% 할인! 지금 예약하고 봄 여행을 떠나세요.',
            image: springSaleImg,
            date: '2025.05.01 ~ 2025.05.31',
            link: '/spring-sale',
        },
        {
            id: 2,
            title: '와인 & 디너 패키지',
            description: '로맨틱한 밤을 위한 와인과 디너가 포함된 특별한 패키지.',
            image: wineDinnerImg,
            date: '상시 진행',
            link: '/wine-dinner',
        },
        {
            id: 3,
            title: '숙박 고객 경품 이벤트',
            description: '숙박 고객 대상 추첨 이벤트! 푸짐한 선물을 드립니다.',
            image: giftEventImg,
            date: '2025.05.10 ~ 2025.06.10',
            link: '/gift-event',
        },
    ];

    return (
        <div className="about-container">
            <div className="about-header">
                <h1 className="about-title">이벤트 안내</h1>
                {userInfo?.uUser === 'admin' && (
                    <Link to="/create-event" className="create-event-button">
                        이벤트 생성
                    </Link>
                )}
            </div>
            <div className="event-container">
                <div className="event-grid">
                    {events.map((event) => (
                        <div className="event-card" key={event.id}>
                            <img src={event.image} alt={event.title} className="event-image" />
                            <div className="event-content">
                                <h2 className="event-title">{event.title}</h2>
                                <p className="event-description">{event.description}</p>
                                <p className="event-date">{event.date}</p>
                                <Link to={event.link}>
                                    <button className="event-button">이벤트 참여하기</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
        .about-container {
          padding: 60px 20px;
          font-family: 'Arial', sans-serif;
        }
        .about-header {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          margin-bottom: 40px;
          max-width: 1200px;
          margin-left: auto;
          margin-right: auto;
        }
        .about-title {
          text-align: center;
          font-size: 36px;
          font-weight: bold;
          color: #333;
        }
        .create-event-button {
          position: absolute;
          right: 0;
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 9999px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }
        .create-event-button:hover {
          background-color: #005dc1;
        }
        .event-container {
          background-color: #f5f5f5;
          padding: 40px 20px;
        }
        .event-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .event-card {
          background-color: #fff;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        .event-image {
          height: 180px;
          object-fit: cover;
          width: 100%;
        }
        .event-content {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }
        .event-title {
          font-size: 20px;
          font-weight: bold;
          color: #222;
          margin-bottom: 10px;
        }
        .event-description {
          font-size: 14px;
          color: #555;
          flex-grow: 1;
          margin-bottom: 10px;
        }
        .event-date {
          font-size: 12px;
          color: #999;
          margin-bottom: 20px;
        }
        .event-button {
          align-self: center;
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 9999px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .event-button:hover {
          background-color: #005dc1;
        }
      `}</style>
        </div>
    );
};

export default About;