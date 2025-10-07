// src/Main/ImageSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// 화살표 이미지 파일 import 오류 방지를 위해 SVG 아이콘을 직접 정의합니다.

// SVG 아이콘 (왼쪽 화살표)
const LeftArrowIcon = ({ style, onClick }) => (
    <svg
        style={style}
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

// SVG 아이콘 (오른쪽 화살표)
const RightArrowIcon = ({ style, onClick }) => (
    <svg
        style={style}
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

// ✅ 슬라이더 스타일
const styles = {
    container: {
        position: 'relative',
        width: '90%',
        maxWidth: '1200px',
        height: '400px',
        overflow: 'hidden',
        margin: '30px auto',
        borderRadius: '15px',
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    },
    imageContainer: {
        display: 'flex',
        height: '100%',
    },
    slide: {
        position: 'relative',
        minWidth: '100%',
        height: '100%',
        color: 'white',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '15px',
    },
    textOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '40px 25px 25px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
        borderRadius: '0 0 15px 15px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    contentArea: { // 제목과 날짜를 묶는 컨테이너
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '100%',
    },
    titleGroup: {
        flexGrow: 1,
    },
    title: {
        margin: '0 0 8px 0',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    date: {
        margin: 0,
        fontSize: '15px',
        opacity: 0.9,
    },
    eventTag: { // 오른쪽 아래에 추가된 스타일
        padding: '8px 15px',
        backgroundColor: '#ff4d4f', /* 밝은 빨간색 계열 */
        borderRadius: '50px',
        fontSize: '14px',
        fontWeight: 'bold',
        color: 'white',
        whiteSpace: 'nowrap',
        marginLeft: '20px',
        alignSelf: 'flex-end',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    },
    arrow: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '45px',
        height: '45px',
        cursor: 'pointer',
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '50%',
        padding: '8px',
        transition: 'all 0.3s ease',
    },
    leftArrow: { left: '20px' },
    rightArrow: { right: '20px' },
    dots: {
        position: 'absolute',
        bottom: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
    },
    dot: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    activeDot: {
        backgroundColor: '#fff',
        transform: 'scale(1.2)',
    },
};

const ImageSlider = () => {
    const [events, setEvents] = useState([]);
    const [index, setIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const intervalRef = useRef(null);

    // ✅ 메인배너 이벤트 불러오기
    const fetchMainBannerEvents = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/getMainBannerEvents`);
            const bannerEvents = res.data;

            if (bannerEvents.length > 0) {
                // 무한 슬라이드 위해 첫/마지막 요소 복사
                setEvents([bannerEvents[bannerEvents.length - 1], ...bannerEvents, bannerEvents[0]]);
                setIndex(1);
            } else {
                setEvents([]); // 이벤트가 없으면 빈 배열로 설정
            }
        } catch (err) {
            console.error('메인배너 이벤트 불러오기 실패:', err);
        }
    };

    useEffect(() => {
        fetchMainBannerEvents();
    }, []);

    // ✅ 자동 슬라이드
    useEffect(() => {
        // 이벤트가 3개 이상(복사본 포함)일 경우에만 자동 슬라이드 실행
        if (events.length <= 3) return;
        intervalRef.current = setInterval(() => nextImage(), 4000);
        return () => clearInterval(intervalRef.current);
    }, [events.length]);

    const prevImage = () => setIndex(prev => prev - 1);
    const nextImage = () => setIndex(prev => prev + 1);

    const handleTransitionEnd = () => {
        if (events.length < 3) return; // 무한 슬라이드 조건 미충족

        const realLength = events.length - 2;

        if (index === events.length - 1) { // 마지막 복사본에 도달하면
            setIsTransitioning(false);
            setIndex(1); // 첫 번째 실제 슬라이드로 이동
        } else if (index === 0) { // 첫 번째 복사본에 도달하면
            setIsTransitioning(false);
            setIndex(realLength); // 마지막 실제 슬라이드로 이동
        }
    };

    useEffect(() => {
        if (!isTransitioning) requestAnimationFrame(() => setIsTransitioning(true));
    }, [isTransitioning]);

    // ✅ mainBanner 상태 토글 함수 (이 컴포넌트에서는 사용되지 않지만, 기존 코드를 유지)
    const toggleBanner = async (title, newStatus) => {
        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/updateMainBanner/${encodeURIComponent(title)}`,
                { mainBanner: newStatus }
            );
            fetchMainBannerEvents(); // 갱신
        } catch (err) {
            console.error(err);
        }
    };

    // ----------------------------------------------------
    // 이벤트가 3개 미만(복사본 포함)일 경우 정적 이미지 처리
    // ----------------------------------------------------
    if (events.length < 3) {
        if (events.length === 0) return null;

        const singleEvent = events.length === 1 ? events[0] : events[1]; // 실제 이벤트 선택
        if (!singleEvent) return null;

        return (
            <div style={{...styles.container, height: '400px'}}>
                <div style={{...styles.slide, minWidth: '100%'}}>
                    <img src={singleEvent.imageUrl} alt={singleEvent.title} style={styles.image} />
                    <div style={styles.textOverlay}>
                        <div style={styles.contentArea}>
                            <div style={styles.titleGroup}>
                                <h2 style={styles.title}>{singleEvent.title}</h2>
                                <p style={styles.date}>{singleEvent.startDate} ~ {singleEvent.endDate}</p>
                            </div>
                            <span style={styles.eventTag}>✨ 이벤트 ✨</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ----------------------------------------------------
    // 이벤트가 3개 이상일 경우 무한 슬라이드 렌더링
    // ----------------------------------------------------
    return (
        <div style={styles.container}>
            {/* 왼쪽 화살표: 인라인 SVG 사용 */}
            <LeftArrowIcon
                style={{ ...styles.arrow, ...styles.leftArrow }}
                onClick={prevImage}
            />

            <div
                style={{
                    ...styles.imageContainer,
                    transform: `translateX(-${index * 100}%)`,
                    transition: isTransitioning ? 'transform 0.6s ease-in-out' : 'none',
                }}
                onTransitionEnd={handleTransitionEnd}
            >
                {events.map((event, i) => (
                    <div key={i} style={styles.slide}>
                        <img src={event.imageUrl} alt={event.title || `slide-${i}`} style={styles.image} />
                        <div style={styles.textOverlay}>
                            <div style={styles.contentArea}>
                                <div style={styles.titleGroup}>
                                    <h2 style={styles.title}>{event.title}</h2>
                                    <p style={styles.date}>{event.startDate} ~ {event.endDate}</p>
                                </div>
                                {/* 오른쪽 아래에 이벤트 태그 추가 */}
                                <span style={styles.eventTag}>✨ 이벤트 ✨</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 오른쪽 화살표: 인라인 SVG 사용 */}
            <RightArrowIcon
                style={{ ...styles.arrow, ...styles.rightArrow }}
                onClick={nextImage}
            />

            <div style={styles.dots}>
                {/* 복사된 첫 번째(0)와 마지막(length-1) 요소를 제외하고 점을 표시 */}
                {events.slice(1, events.length - 1).map((_, i) => (
                    <div
                        key={i}
                        // 현재 인덱스를 실제 이벤트 배열의 인덱스 (1부터 events.length-2)와 비교
                        style={{ ...styles.dot, ...(i + 1 === index ? styles.activeDot : {}) }}
                        onClick={() => {
                            // 자동 슬라이드 인터벌 리셋
                            clearInterval(intervalRef.current);
                            intervalRef.current = setInterval(() => nextImage(), 4000);
                            setIndex(i + 1);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;
