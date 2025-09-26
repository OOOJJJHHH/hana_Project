// components/ImageSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import arrowLeft from '../image/arrow-left.png';
import arrowRight from '../image/arrow-right.png';
import fan1 from '../image/1.jpg';
import fan2 from '../image/2.jpg';
import fan3 from '../image/3.jpg';
import fan4 from '../image/4.jpg';
import fan5 from '../image/5.jpg';

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
    }
};

const ImageSlider = () => {
    const originalImages = [fan1, fan2, fan3, fan4, fan5];
    const images = [originalImages[originalImages.length - 1], ...originalImages, originalImages[0]];
    // [마지막, 1,2,3,4,5, 첫번째]

    const [index, setIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            nextImage();
        }, 4000);
        return () => clearInterval(intervalRef.current);
    }, []);

    const prevImage = () => setIndex(prev => prev - 1);
    const nextImage = () => setIndex(prev => prev + 1);

    const handleTransitionEnd = () => {
        if (index === images.length - 1) {
            // 마지막 → 첫번째 순간이동
            setIsTransitioning(false);
            setIndex(1);
        } else if (index === 0) {
            // 첫번째 → 마지막 순간이동
            setIsTransitioning(false);
            setIndex(images.length - 2);
        }
    };

    // transition false → true로 복원 (자연스럽게 연결)
    useEffect(() => {
        if (!isTransitioning) {
            requestAnimationFrame(() => {
                setIsTransitioning(true);
            });
        }
    }, [isTransitioning]);

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
                {images.map((img, i) => (
                    <img key={i} src={img} alt={`slide-${i}`} style={styles.image} />
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
                {originalImages.map((_, i) => (
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
