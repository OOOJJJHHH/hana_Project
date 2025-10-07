// src/Main/Recommend.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 배열에서 무작위로 지정된 개수(count)의 요소를 추출하는 유틸리티 함수
const getRandomElements = (arr, count) => {
    if (!arr || arr.length === 0) return [];

    // 배열 복사 후 셔플 (Fisher-Yates 알고리즘 기반)
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 앞에서부터 count만큼 자르기
    return shuffled.slice(0, count);
};

const container = {
    width: '90%',
    maxWidth: '1180px',
    margin: '40px auto',
    fontFamily: "'Noto Sans', sans-serif",
};

const title = {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '25px',
    color: '#333',
    textAlign: 'center',
};

const hotelList = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
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

// 평점 숫자 → 별 표시
const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) stars.push("★");
    if (hasHalfStar) stars.push("☆");
    while (stars.length < 5) stars.push("✩");

    // 별 색상을 노란색 계열로 변경하여 시각적으로 강조
    return <span style={{ color: '#FFD700' }}>{stars.join("")}</span>;
};

const Recommend = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);

    useEffect(() => {
        // ✅ API 엔드포인트를 사용자가 요청한 '/getAllLodgings'로 변경
        axios.get(`${process.env.REACT_APP_API_URL}/getAllLodgings`)
            .then(res => {
                console.log("Recommend API 데이터 (전체 숙소):", res.data);

                // ✅ 클라이언트 측에서 무작위 4개 선택
                const randomRooms = getRandomElements(res.data, 4);
                setRooms(randomRooms);
            })
            .catch(err => console.error("추천 숙소 불러오기 실패:", err));
    }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행 (새로고침 시 데이터 달라짐)

    // 숙소 목록이 4개 미만일 수도 있으므로, 가져온 목록을 그대로 사용
    const displayRooms = rooms;

    return (
        <div style={container}>
            <div style={title}>추천 숙소</div>
            <div style={hotelList}>
                {displayRooms.map((room, index) => (
                    <div
                        key={room.roomId}
                        style={{ ...card, ...(hoverIndex === index ? cardHover : {}) }}
                        onClick={() => navigate(`/hotel-detail?name=${encodeURIComponent(room.clodName)}`)}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <div style={imageWrapper}>
                            {/* 백엔드 데이터 구조에 맞춰 room.roomImages 대신 room.lodImageUrls 등을 사용해야 할 수 있으나,
                                현재 프론트엔드 구조를 최대한 유지하기 위해 room.roomImages를 사용합니다. */}
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
                            {/* 숙소 이름 (호텔 이름) */}
                            {/* LodDTO 구조에 맞춰 필드 이름이 roomName, clodName, averageRating, reviewCount 라고 가정합니다. */}
                            <div style={hotelName}>{room.roomName} ({room.clodName})</div>
                            {/* 평점 및 리뷰 수 */}
                            <div style={ratingStyle}>
                                {renderStars(room.averageRating)} ({room.averageRating ? room.averageRating.toFixed(1) : '0.0'}, {room.reviewCount || 0}개 리뷰)
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {displayRooms.length === 0 && (
                <p style={{ textAlign: 'center', fontSize: '16px', color: '#888' }}>현재 추천할 숙소가 없습니다.</p>
            )}
        </div>
    );
};

export default Recommend;
