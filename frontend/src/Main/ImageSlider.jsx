// components/Meddle/ImageSlider.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import arrowLeft from './image/arrow-left.png';
import arrowRight from './image/arrow-right.png';

const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 3000);

        return () => clearInterval(intervalRef.current);
    }, [images]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    return (
        <SliderWrapper>
            <Arrow src={arrowLeft} alt="left arrow" onClick={prevSlide} />
            <ImageTrack style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((img, idx) => (
                    <SlideImage key={idx} src={img} alt={`slide-${idx}`} />
                ))}
            </ImageTrack>
            <Arrow src={arrowRight} alt="right arrow" onClick={nextSlide} />
        </SliderWrapper>
    );
};

export default ImageSlider;

// styled-components (SliderWrapper, Arrow, ImageTrack, SlideImage)은 원한다면 Meddle.styled.js로 분리 가능
const SliderWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const ImageTrack = styled.div`
  display: flex;
  transition: transform 0.3s ease-in-out;
`;

const SlideImage = styled.img`
  width: 100%;
  flex-shrink: 0;
`;

const Arrow = styled.img`
  position: absolute;
  top: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  user-select: none;
  transform: translateY(-50%);
  &:first-of-type {
    left: 10px;
  }
  &:last-of-type {
    right: 10px;
  }
`;
