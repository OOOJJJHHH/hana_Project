import React, { useState, useEffect, useRef } from 'react';
import arrowLeft from '../image/arrow-left.png';
import arrowRight from '../image/arrow-right.png';
import axios from 'axios';

// ✅ 텍스트 오버레이를 위한 스타일 추가
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
    // ✅ 각 슬라이드를 감싸는 컨테이너 스타일 추가
    slide: {
        position: 'relative', // 텍스트 오버레이를 위해 relative 포지션 설정
        minWidth: '100%',
        height: '100%',
        color: 'white',
    },
    image: {
        width: '100%', // minWidth에서 width로 변경하여 컨테이너에 꽉 차게 함
        height: '100%',
        objectFit: 'cover',
        borderRadius: '15px',
    },
    // ✅ 텍스트 오버레이 스타일
    textOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        padding: '40px 25px 25px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)', // 아래쪽을 어둡게
        borderRadius: '0 0 15px 15px',
        boxSizing: 'border-box', // 패딩이 너비를 넘지 않도록 설정
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
    }
};

const ImageSlider = () => {
    // ✅ State 이름을 events로 변경하고, 이벤트 객체 전체를 저장
    const [events, setEvents] = useState([]);
    const [index, setIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const intervalRef = useRef(null);

    useEffect(() => {
        const fetchMainBannerEvents = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/getMainBannerEvents`);
                const bannerEvents = res.data; // ✅ 데이터 전체를 변수에 저장

                if (bannerEvents.length > 0) {
                    // ✅ 무한 슬라이더를 위해 이벤트 객체 자체를 복사
                    setEvents([bannerEvents[bannerEvents.length - 1], ...bannerEvents, bannerEvents[0]]);
                    setIndex(1);
                }
            } catch (err) {
                console.error('메인배너 이벤트 불러오기 실패:', err);
            }
        };
        fetchMainBannerEvents();
    }, []);

    useEffect(() => {
        if (events.length === 0) return; // ✅ events로 조건 변경
        intervalRef.current = setInterval(() => nextImage(), 4000);
        return () => clearInterval(intervalRef.current);
    }, [events]); // ✅ events로 의존성 배열 변경

    const prevImage = () => setIndex(prev => prev - 1);
    const nextImage = () => setIndex(prev => prev + 1);

    const handleTransitionEnd = () => {
        if (index === events.length - 1) { // ✅ events.length로 변경
            setIsTransitioning(false);
            setIndex(1);
        } else if (index === 0) {
            setIsTransitioning(false);
            setIndex(events.length - 2); // ✅ events.length로 변경
        }
    };

    useEffect(() => {
        if (!isTransitioning) requestAnimationFrame(() => setIsTransitioning(true));
    }, [isTransitioning]);

    if (events.length === 0) return null; // ✅ events로 변경

    return (
        <div style={styles.container}>
            <img src={arrowLeft} alt="prev" style={{ ...styles.arrow, ...styles.leftArrow }} onClick={prevImage} />
            <div
                style={{
                    ...styles.imageContainer,
                    transform: `translateX(-${index * 100}%)`,
                    transition: isTransitioning ? 'transform 0.6s ease-in-out' : 'none',
                }}
                onTransitionEnd={handleTransitionEnd}
            >
                {/* ✅ events 배열을 순회하며 각 슬라이드 렌더링 */}
                {events.map((event, i) => (
                    <div key={i} style={styles.slide}>
                        <img src={event.imageUrl} alt={event.title || `slide-${i}`} style={styles.image} />
                        {/* ✅ 텍스트 오버레이 영역 */}
                        <div style={styles.textOverlay}>
                            <h2 style={styles.title}>{event.title}</h2>
                            <p style={styles.date}>{event.startDate} ~ {event.endDate}</p>
                        </div>
                    </div>
                ))}
            </div>
            <img src={arrowRight} alt="next" style={{ ...styles.arrow, ...styles.rightArrow }} onClick={nextImage} />

            <div style={styles.dots}>
                {/* ✅ events.slice로 변경 */}
                {events.slice(1, events.length - 1).map((_, i) => (
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

export default ImageSlider;