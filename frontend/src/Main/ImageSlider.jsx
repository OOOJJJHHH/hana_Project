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
        height: '350px',
        overflow: 'hidden',
        margin: '0 auto'
    },
    imageContainer: {
        display: 'flex',
        transition: 'transform 0.5s ease-in-out',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
    arrow: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '40px',
        height: 'auto',
        cursor: 'pointer',
        zIndex: 100,
    },
    leftArrow: {
        left: '10px',
    },
    rightArrow: {
        right: '10px',
    }
};

const ImageSlider = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const intervalRef = useRef(null);
    const images = [fan1, fan2, fan3, fan4, fan5];

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(intervalRef.current);
    }, []);

    const prevImage = () => {
        setCurrentImageIndex(prev =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const nextImage = () => {
        setCurrentImageIndex(prev =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

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
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                }}
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
        </div>
    );
};

export default ImageSlider;
