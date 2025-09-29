// src/components/ImageSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import arrowLeft from '../image/arrow-left.png';
import arrowRight from '../image/arrow-right.png';
import axios from 'axios';

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
    imageSlide: {
        minWidth: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '15px',
        position: 'relative',
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
    slideText: {
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: '#fff',
        backgroundColor: 'rgba(0,0,0,0.4)',
        padding: '10px 15px',
        borderRadius: '10px',
    },
    slideTitle: { fontSize: '20px', fontWeight: '700', margin: 0 },
    slideDate: { fontSize: '14px', margin: '5px 0 0 0' },
};

const ImageSlider = () => {
    const [bannerEvents, setBannerEvents] = useState([]);
    const [index, setIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const intervalRef = useRef(null);

    // 메인 배너 이벤트 불러오기
    useEffect(() => {
        const fetchMainBanners = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/events/main-banners`
                );
                setBannerEvents(res.data); // mainBanner === true인 이벤트만
            } catch (err) {
                console.error('배너 이벤트 불러오기 실패:', err);
            }
        };
        fetchMainBanners();
    }, []);

    // 자동 슬라이드
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            nextImage();
        }, 4000);
        return () => clearInterval(intervalRef.current);
    }, [bannerEvents]);

    const prevImage = () => setIndex(prev => prev - 1);
    const nextImage = () => setIndex(prev => prev + 1);

    // 무한 슬라이드 처리
    const handleTransitionEnd = () => {
        if (bannerEvents.length === 0) return;
        if (index === bannerEvents.length + 1) {
            setIsTransitioning(false);
            setIndex(1);
        } else if (index === 0) {
            setIsTransitioning(false);
            setIndex(bannerEvents.length);
        }
    };

    // transition false → true 복원
    useEffect(() => {
        if (!isTransitioning) {
            requestAnimationFrame(() => setIsTransitioning(true));
        }
    }, [isTransitioning]);

    // 보여줄 이미지 배열 (마지막, ...배너, 첫번째)
    const images = bannerEvents.length > 0
        ? [bannerEvents[bannerEvents.length - 1], ...bannerEvents, bannerEvents[0]]
        : [];

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
                {images.map((event, i) => (
                    <div key={i} style={styles.imageSlide}>
                        <img src={event?.imageUrl} alt={event?.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px' }} />
                        {event && (
                            <div style={styles.slideText}>
                                <h3 style={styles.slideTitle}>{event.title}</h3>
                                <p style={styles.slideDate}>{event.startDate} ~ {event.endDate}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <img
                src={arrowRight}
                alt="next"
                style={{ ...styles.arrow, ...styles.rightArrow }}
                onClick={nextImage}
            />

            {/* 인디케이터 */}
            <div style={styles.dots}>
                {bannerEvents.map((_, i) => (
                    <div
                        key={i}
                        style={{
                            ...styles.dot,
                            ...(i + 1 === index ? styles.activeDot : {}),
                        }}
                        onClick={() => setIndex(i + 1)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;
