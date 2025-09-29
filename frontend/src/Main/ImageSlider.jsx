// components/EventSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import arrowLeft from '../image/arrow-left.png';
import arrowRight from '../image/arrow-right.png';

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
    image: {
        minWidth: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '15px',
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
    slideTextBox: {
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        background: 'rgba(0,0,0,0.5)',
        color: '#fff',
        padding: '12px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    slideTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        margin: 0,
    },
    slideDate: {
        fontSize: '14px',
        marginTop: '4px',
    },
};

const EventSlider = () => {
    const [events, setEvents] = useState([]);         // 전체 이벤트
    const [filteredEvents, setFilteredEvents] = useState([]); // 메인배너O만
    const [index, setIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const intervalRef = useRef(null);

    // ===============================
    // 백엔드에서 이벤트 가져오기
    // ===============================
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/getEvents`)
            .then(res => {
                setEvents(res.data);
            })
            .catch(err => console.error("이벤트 불러오기 실패:", err));
    }, []);

    // ===============================
    // 메인배너 필터링 (localStorage 기반)
    // ===============================
    useEffect(() => {
        const bannerTitles = JSON.parse(localStorage.getItem('mainBannerEvents')) || [];
        const filtered = events.filter(e => bannerTitles.includes(e.title));
        setFilteredEvents(filtered);
        setIndex(1); // 새로 필터링할 때 index 초기화
    }, [events]);

    // ===============================
    // 자동 슬라이드 (3초마다)
    // ===============================
    useEffect(() => {
        if (filteredEvents.length === 0) return;
        intervalRef.current = setInterval(() => nextImage(), 3000);
        return () => clearInterval(intervalRef.current);
    }, [filteredEvents, index]);

    // ===============================
    // 슬라이드 이동
    // ===============================
    const prevImage = () => setIndex(prev => prev - 1);
    const nextImage = () => setIndex(prev => prev + 1);

    // ===============================
    // 무한 슬라이드 처리
    // ===============================
    const handleTransitionEnd = () => {
        if (filteredEvents.length === 0) return;
        if (index === filteredEvents.length + 1) {
            setIsTransitioning(false);
            setIndex(1);
        } else if (index === 0) {
            setIsTransitioning(false);
            setIndex(filteredEvents.length);
        }
    };

    useEffect(() => {
        if (!isTransitioning) {
            requestAnimationFrame(() => setIsTransitioning(true));
        }
    }, [isTransitioning]);

    // ===============================
    // 무한 슬라이드용 배열 [마지막, ...중간..., 첫번째]
    // ===============================
    const images = filteredEvents.length > 0
        ? [filteredEvents[filteredEvents.length - 1], ...filteredEvents, filteredEvents[0]]
        : [];

    return (
        <div style={styles.container}>
            {/* 좌우 화살표 */}
            {filteredEvents.length > 0 && (
                <>
                    <img src={arrowLeft} alt="prev" style={{ ...styles.arrow, ...styles.leftArrow }} onClick={prevImage} />
                    <img src={arrowRight} alt="next" style={{ ...styles.arrow, ...styles.rightArrow }} onClick={nextImage} />
                </>
            )}

            {/* 이미지 슬라이드 */}
            <div
                style={{
                    ...styles.imageContainer,
                    transform: `translateX(-${index * 100}%)`,
                    transition: isTransitioning ? 'transform 0.6s ease-in-out' : 'none',
                }}
                onTransitionEnd={handleTransitionEnd}
            >
                {images.map((event, i) => (
                    <div key={i} style={{ position: 'relative', minWidth: '100%', height: '100%' }}>
                        <img src={event?.imageUrl} alt={event?.title} style={styles.image} />
                        <div style={styles.slideTextBox}>
                            <h3 style={styles.slideTitle}>{event?.title}</h3>
                            <p style={styles.slideDate}>{event?.startDate} ~ {event?.endDate}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 인디케이터 */}
            <div style={styles.dots}>
                {filteredEvents.map((_, i) => (
                    <div
                        key={i}
                        style={{
                            ...styles.dot,
                            ...(i + 1 === index ? styles.activeDot : {})
                        }}
                        onClick={() => setIndex(i + 1)}
                    />
                ))}
            </div>
        </div>
    );
};

export default EventSlider;
