// src/Main/Recommend.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';

// 한 번에 표시할 숙소의 개수
const ITEMS_TO_DISPLAY = 5;

/**
 * 배열에서 무작위로 지정된 개수(count)의 요소를 추출하는 유틸리티 함수
 * @param {Array<Object>} arr - 전체 숙소 목록
 * @param {number} count - 추출할 개수
 * @returns {Array<Object>} 무작위로 추출된 숙소 목록
 */
const getRandomElements = (arr, count) => {
    if (!arr || arr.length === 0) return [];

    // 배열 복사 후 셔플 (Fisher-Yates 알고리즘 기반)
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[i], shuffled[j]];
    }

    // 앞에서부터 count만큼 자르기 (전체 개수보다 많으면 전체를 반환)
    return shuffled.slice(0, Math.min(count, shuffled.length));
};

// --- 스타일 객체 ---

const container = {
    width: '90%',
    maxWidth: '1180px',
    margin: '40px auto',
    fontFamily: "'Inter', sans-serif",
};

const header = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '25px',
    gap: '15px',
};

const title = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
};

const refreshButton = {
    padding: '8px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 8px rgba(52, 152, 219, 0.3)',
    transition: 'background-color 0.2s, transform 0.1s',
};

const refreshButtonHover = {
    backgroundColor: '#2980b9',
    transform: 'translateY(-1px)',
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
    const safeRating = parseFloat(rating) || 0;
    const stars = [];
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) stars.push("★");
    if (hasHalfStar) stars.push("☆");
    while (stars.length < 5) stars.push("✩");

    // 별 색상을 노란색 계열로 변경하여 시각적으로 강조
    return <span style={{ color: '#FFD700' }}>{stars.join("")}</span>;
};

const Recommend = () => {
    const navigate = useNavigate();
    // 전체 숙소 목록 (API에서 가져온 모든 데이터)
    const [allLodgings, setAllLodgings] = useState([]);
    // 현재 화면에 표시될 5개 숙소 목록
    const [displayedRooms, setDisplayedRooms] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isRefreshHover, setIsRefreshHover] = useState(false);

    /**
     * 전체 숙소 목록을 불러와 상태에 저장하고, 5개를 무작위로 선택하여 표시합니다.
     */
    const fetchRecommendations = async () => {
        // isRefreshing 상태를 사용하여 로딩/새로고침 상태를 표시
        setIsRefreshing(true);
        try {
            // [주의] 실제 API 엔드포인트로 변경해야 합니다.
            // 이 예시에서는 모든 숙소를 불러오는 엔드포인트를 가정합니다.
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/getAllLodgings`);
            const dataArray = Array.isArray(res.data) ? res.data : [];

            setAllLodgings(dataArray); // 전체 목록 저장

            // 초기 5개 무작위 선택하여 표시
            const initialDisplay = getRandomElements(dataArray, ITEMS_TO_DISPLAY);
            setDisplayedRooms(initialDisplay);

        } catch (err) {
            console.error("전체 숙소 불러오기 실패:", err);
            setAllLodgings([]);
            setDisplayedRooms([]);
        } finally {
            // 로딩 상태를 잠시 딜레이 후 해제하여 시각적 효과 부여
            setTimeout(() => {
                setIsRefreshing(false);
            }, 500);
        }
    };

    /**
     * 전체 목록에서 새로운 5개의 숙소를 무작위로 선택하여 화면을 갱신합니다.
     */
    const refreshDisplay = () => {
        if (allLodgings.length > 0) {
            setIsRefreshing(true);
            // 딜레이를 주어 로딩 효과를 시각적으로 보여줌
            setTimeout(() => {
                // ✅ 핵심: allLodgings 전체 목록에서 새로운 무작위 5개를 가져옴
                const newDisplay = getRandomElements(allLodgings, ITEMS_TO_DISPLAY);
                setDisplayedRooms(newDisplay);
                setIsRefreshing(false);
            }, 700); // 0.7초 딜레이
        } else if (!isRefreshing) {
            // 전체 목록이 비어 있으면 다시 불러오기 시도
            fetchRecommendations();
        }
    };

    useEffect(() => {
        // 컴포넌트 마운트 시 최초 1회 전체 숙소 목록 로드
        fetchRecommendations();
    }, []);

    // JSX에서 displayedRooms 사용
    const displayRooms = displayedRooms;

    return (
        <div style={container}>
            <div style={header}>
                <div style={title}>추천 숙소 목록</div>
                {/* 새로고침 버튼 */}
                <button
                    style={{...refreshButton, ...(isRefreshHover && refreshButtonHover)}}
                    onClick={refreshDisplay} // 버튼 클릭 시 새로운 무작위 5개 로드
                    disabled={isRefreshing || allLodgings.length === 0}
                    onMouseEnter={() => setIsRefreshHover(true)}
                    onMouseLeave={() => setIsRefreshHover(false)}
                >
                    <RefreshCw
                        size={18}
                        style={isRefreshing ? { animation: 'spin 1s linear infinite' } : {}}
                    />
                    {isRefreshing ? '로딩 중...' : '다른 숙소 보기 (5개)'}
                </button>
                {/* CSS 애니메이션 (RefreshCw 아이콘 회전) */}
                <style>
                    {`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}
                </style>
            </div>

            <div style={hotelList}>
                {displayRooms.length > 0 ? (
                    displayRooms.map((lodging, index) => {
                        // 데이터 구조에 따라 키 이름이 달라질 수 있어 lodId, lodName을 사용했다고 가정
                        const id = lodging.id || lodging.lodId;
                        const name = lodging.lodName;

                        if (!id || !name) {
                            return null;
                        }

                        const rating = lodging.averageRating || 0;
                        const reviewCount = lodging.reviewCount || 0;

                        // lodImag 또는 imageUrls 배열의 첫 번째 이미지를 사용
                        const imageUrl = lodging.lodImag || (Array.isArray(lodging.imageUrls) && lodging.imageUrls.length > 0
                            ? lodging.imageUrls[0] : null);

                        const firstImage = imageUrl
                            ? imageUrl : 'https://placehold.co/220x140/e0e0e0/555?text=No+Image';

                        return (
                            <div
                                key={id}
                                style={{ ...card, ...(hoverIndex === index ? cardHover : {}) }}
                                // 클릭 시 상세 페이지로 이동
                                onClick={() => navigate(`/hotel-detail?name=${encodeURIComponent(name)}`)}
                                onMouseEnter={() => setHoverIndex(index)}
                                onMouseLeave={() => setHoverIndex(null)}
                            >
                                <div style={imageWrapper}>
                                    <img
                                        src={firstImage}
                                        alt={name}
                                        style={{ ...imageStyle, ...(hoverIndex === index ? { transform: 'scale(1.05)' } : {}) }}
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/220x140/e0e0e0/555?text=No+Image'; }}
                                    />
                                </div>
                                <div style={infoWrapper}>
                                    <div style={hotelName}>{name}</div>
                                    <div style={ratingStyle}>
                                        {renderStars(rating)} ({parseFloat(rating).toFixed(1)}, {reviewCount}개 리뷰)
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p style={{ textAlign: 'center', width: '100%', fontSize: '16px', color: '#888', marginTop: '20px' }}>
                        {allLodgings.length === 0 && !isRefreshing
                            ? "현재 등록된 숙소가 없거나 데이터 로드에 실패했습니다."
                            : "숙소 목록을 불러오는 중입니다..."}
                    </p>
                )}
            </div>
            {/* 전체 숙소 개수가 5개 미만일 때 사용자에게 알림 */}
            {allLodgings.length > 0 && allLodgings.length < ITEMS_TO_DISPLAY && (
                <p style={{ textAlign: 'center', fontSize: '14px', color: '#999', marginTop: '20px' }}>
                    * 등록된 숙소가 {allLodgings.length}개로, {ITEMS_TO_DISPLAY}개 미만입니다.
                </p>
            )}
        </div>
    );
};

export default Recommend;