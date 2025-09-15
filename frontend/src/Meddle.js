import React from 'react';
import ImageSlider from "./Main/ImageSlider";
import FanfareWithLowestPrice from "./Main/FanfareWithLowestPrice";
import TopRatedHotels from "./Main/TopRatedHotels";
import UKWeather from "./Main/UKWeather";

const Meddle = () => {
  return (
      <div style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ImageSlider />
        <FanfareWithLowestPrice />
        <TopRatedHotels />
      </div>
  );
};

export default Meddle;
