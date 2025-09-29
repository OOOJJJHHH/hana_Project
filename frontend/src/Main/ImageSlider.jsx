import React, { useState, useEffect, useRef } from 'react';
import arrowLeft from '../image/arrow-left.png';
import arrowRight from '../image/arrow-right.png';
import axios from 'axios';

const styles = {
    container: { /* 기존 스타일 그대로 */ },
    imageContainer: { display: 'flex', height: '100%' },
    imageSlide: {
        minWidth: '100%',
        height: '100%',
        objectFit: 'cover',
        borderRadius: '15px',
        position: 'relative',
        color: '#fff',
    },
    arrow: { /* 기존 스타일 그대로 */ },
    leftArrow: { left: '20px' },
    rightArrow: { right: '20px' },
    dots: { position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' },
    dot: { width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.6)', cursor: 'pointer', transition: 'all 0.3s ease' },
    activeDot: { backgroundColor: '#fff', transform: 'scale(1.2)' },
    overlayText: { position: 'absolute', bottom: '20px', left: '20px', textShadow: '0 0 5px rgba(0,0,0,0.5)' }
};

const ImageSlider = () => {
    const [bannerEvents, setBannerEvents] = useState([]);
    const [index, setIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const intervalRef = useRef(null);

    // ✅ 메인배너 이벤트만 불러오기
    useEffect(() => {
        const fetchMainBanners = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/events/main-banners`);
                setBannerEvents(res.data); // mainBanner === true인 이벤트만 배열로 저장
            } catch (err) {
                console.error(err);
            }
        };
        fetchMainBanners();
    }, []);

    // 자동 슬라이드
    useEffect(() => {
        intervalRef.current = setInterval(() => nextImage(), 4000);
        return () => clearInterval(intervalRef.current);
    }, [bannerEvents, index]);

    const prevImage = () => setIndex(prev => (prev === 0 ? bannerEvents.length - 1 : prev - 1));
    const nextImage = () => setIndex(prev => (prev === bannerEvents.length - 1 ? 0 : prev + 1));

    return (
        <div style={styles.container}>
            <img src={arrowLeft} alt="prev" style={{ ...styles.arrow, ...styles.leftArrow }} onClick={prevImage} />
            <div style={{
                ...styles.imageContainer,
                transform: `translateX(-${index * 100}%)`,
                transition: isTransitioning ? 'transform 0.6s ease-in-out' : 'none'
            }}>
                {bannerEvents.map((event, i) => (
                    <div key={i} style={styles.imageSlide}>
                        <img src={event.imageUrl} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px' }} />
                        {/* 이미지 위에 제목과 기간 표시 */}
                        <div style={styles.overlayText}>
                            <h2>{event.title}</h2>
                            <p>{event.startDate} ~ {event.endDate}</p>
                        </div>
                    </div>
                ))}
            </div>
            <img src={arrowRight} alt="next" style={{ ...styles.arrow, ...styles.rightArrow }} onClick={nextImage} />

            {/* 인디케이터 */}
            <div style={styles.dots}>
                {bannerEvents.map((_, i) => (
                    <div
                        key={i}
                        style={{ ...styles.dot, ...(i === index ? styles.activeDot : {}) }}
                        onClick={() => setIndex(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageSlider;
