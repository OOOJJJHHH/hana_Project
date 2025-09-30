// src/Main/ImageSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import arrowLeft from '../image/arrow-left.png';
import arrowRight from '../image/arrow-right.png';
import axios from 'axios';

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
        if (events.length === 0) return;
        intervalRef.current = setInterval(() => nextImage(), 4000);
        return () => clearInterval(intervalRef.current);
    }, [events]);

    const prevImage = () => setIndex(prev => prev - 1);
    const nextImage = () => setIndex(prev => prev + 1);

    const handleTransitionEnd = () => {
        if (index === events.length - 1) {
            setIsTransitioning(false);
            setIndex(1);
        } else if (index === 0) {
            setIsTransitioning(false);
            setIndex(events.length - 2);
        }
    };

    useEffect(() => {
        if (!isTransitioning) requestAnimationFrame(() => setIsTransitioning(true));
    }, [isTransitioning]);

    // ✅ mainBanner 상태 토글 함수
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

    if (events.length === 0) return null;

    return (
        <div style={styles.container}>
            <img
                src={arrowLeft}
                alt="prev"
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
                            <h2 style={styles.title}>{event.title}</h2>
                            <p style={styles.date}>{event.startDate} ~ {event.endDate}</p>
                        </div>
                    </div>
                ))}
            </div>
            <img
                src={arrowRight}
                alt="next"
                style={{ ...styles.arrow, ...styles.rightArrow }}
                onClick={nextImage}
            />
            <div style={styles.dots}>
                {events.slice(1, events.length - 1).map((_, i) => (
                    <div
                        key={i}
                        style={{ ...styles.dot, ...(i + 1 === index ? styles.activeDot : {}) }}
                        onClick={() => setIndex(i + 1)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;
