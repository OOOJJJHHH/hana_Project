import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import fanfare from './image/fanfare.png';
import fan1 from './image/1.jpg';
import fan2 from './image/2.jpg';
import fan3 from './image/3.jpg';
import fan4 from './image/4.jpg';
import fan5 from './image/5.jpg';
import arrowLeft from './image/arrow-left.png';
import arrowRight from './image/arrow-right.png';
import spring from './image/spring.png';
import fan2_1 from './image/2-1.jpg';
import fan2_2 from './image/2-2.jpg';
import {contents} from "./Locals/Locals";
import { useNavigate } from "react-router-dom";
import { topRatedHotels } from './Pages/HotelDetail';


const Meddle = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [startCity, setStartCity] = useState(0);
  const [startCity1, setStartCity1] = useState(0);
  const [activeButton, setActiveButton] = useState("left");
  const boxes = Array(9).fill("사진");
  const navigate = useNavigate();
  const [hotelList, setHotelList] = useState([]);

  useEffect(() => {
    setHotelList(topRatedHotels);  // 기존 데이터 대신 평점 상위 6개 호텔로 덮어쓰기
  }, []);

  // 예시 데이터 (DB에서 받아올 예정)
  const [cities, setCities] = useState([
    { id: 1, name: "서울", imageUrl: fan2_1 },
    { id: 2, name: "부산", imageUrl: fan2_2 },
    { id: 3, name: "대구", imageUrl: fan2_1 },
    { id: 4, name: "인천", imageUrl: fan2_2 },
    { id: 5, name: "대전", imageUrl: fan2_1 },
    { id: 6, name: "광주", imageUrl: fan2_2 },
    { id: 7, name: "울산", imageUrl: fan2_1 },
    { id: 8, name: "세종", imageUrl: fan2_2 },
  ]);

  const [cities1, setCities1] = useState([
    { id: 1, name: "서울", imageUrl: fan2_1 },
    { id: 2, name: "부산", imageUrl: fan2_2 },
    { id: 3, name: "대구", imageUrl: fan2_1 },
    { id: 4, name: "인천", imageUrl: fan2_2 },
    { id: 5, name: "대전", imageUrl: fan2_1 },
    { id: 6, name: "광주", imageUrl: fan2_2 },
    { id: 7, name: "울산", imageUrl: fan2_1 },
    { id: 8, name: "세종", imageUrl: fan2_2 },
  ]);
  const handleNext_3 = () => {
    const nextStartCity = startCity1 + 4;
    if (nextStartCity <= cities1.length - 4) {
      setStartCity1(nextStartCity);
    } else if (nextStartCity <= cities1.length) {
      setStartCity1(cities1.length - 4); // 마지막 그룹이 4개 미만일 경우
    }
  };
  const handlePrev_3 = () => {
    const prevStartCity = startCity1 - 4;
    if (prevStartCity >= 0) {
      setStartCity1(prevStartCity);
    } else {
      setStartCity1(0);
    }
  };

  const handleNext_2 = () => {
    const nextStartCity = startCity + 4;
    if (nextStartCity <= cities.length - 4) {
      setStartCity(nextStartCity);
    } else if (nextStartCity <= cities.length) {
      setStartCity(cities.length - 4); // 마지막 그룹이 4개 미만일 경우
    }
  };
  const handlePrev_2 = () => {
    const prevStartCity = startCity - 4;
    if (prevStartCity >= 0) {
      setStartCity(prevStartCity);
    } else {
      setStartCity(0);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) stars.push("★");
    if (hasHalfStar) stars.push("☆");
    while (stars.length < 5) stars.push("✩");

    return stars.join("");
  };
  const handleClickcity = (cityName) => {
    alert(`You clicked on ${cityName}`);
  };

  const handleNext = () => {
    if (startIndex + 3 < boxes.length) {
      setStartIndex(startIndex + 3);
    }
  };

  const handlePrev = () => {
    if (startIndex - 3 >= 0) {
      setStartIndex(startIndex - 3);
    }
  };

  return (
      <MeddleContainer>
        <ImageSlider />

        <ResponsiveContainer>
          {/* 여가 최저가 보장 텍스트가 왼쪽에 배치 */}
          <FanfareContainer>
            <FanfareImage src={fanfare} alt="fanfare" />
            <FanfareText>여가 최저가 보장!</FanfareText>
            <FanfareImage src={fanfare} alt="fanfare" />
          </FanfareContainer>

          <ResponsiveContainer_1>
            <ArrowButton onClick={handlePrev}>&lt;</ArrowButton>
            <BoxWrapper>
              <BoxSlider style={{ transform: `translateX(-${startIndex * (100 / 3)}%)` }}>
                {boxes.map((text, index) => (
                    <ResponsiveBox key={index}>{text}</ResponsiveBox>
                ))}
              </BoxSlider>
            </BoxWrapper>
            <ArrowButton onClick={handleNext}>&gt;</ArrowButton>
          </ResponsiveContainer_1>
        </ResponsiveContainer>

        {/* ✅ 새로 추가된 컴포넌트 */}
        <ToggleRectangles />

        <ClickableImage
            src={spring}
            alt="spring"
            onClick={() => navigate('/about')}
        />
        <span style={{ fontSize: "24px", fontWeight: "bold", display: "block", width: "100%", maxWidth: "1180px" }}>평점순</span>
        {/* ✅ 둥근 사각형 리스트 */}
        <RoundedRectangleContainer>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'nowrap', marginTop: '20px' }}>
            {topRatedHotels.map((hotel, idx) => (
                <div
                    key={idx}
                    style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '10px', width: '150px' }}
                    onClick={() => navigate(`/hotel-detail?name=${encodeURIComponent(hotel.name)}`)}
                >
                  <img src={hotel.thumbnail} alt={hotel.name} style={{ width: '100%' }} />
                  <h3>{hotel.name}</h3>
                  <p>{renderStars(hotel.rating)} ({hotel.rating})</p>
                </div>
            ))}
          </div>
        </RoundedRectangleContainer>
        <span style={{ fontSize: "24px", fontWeight: "bold", display: "block", width: "100%", maxWidth: "1180px", marginTop: "40px" }}>도시이름</span>
        <div style={{
          position: 'relative',
          overflow : "hidden",
          width : "1180px"
        }}>

          <ContainerCity style={{
            display: 'flex',
            gap: '20px',
            padding: '20px',
            transition: 'transform 0.3s ease-in-out',
            transform: `translateX(-${startCity * 290}px)`,
            width: '1220px'
          }}>
            {cities.map((city) => (
                <SquareStyleCity key={city.id} onClick={() => handleClickcity(city.name)}>
                  <CityImage src={city.imageUrl} alt={city.name} />
                  <CityName>{city.name}</CityName>
                </SquareStyleCity>
            ))}
          </ContainerCity>
          <ArrowButton style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)' }} onClick={handlePrev_2}>&lt;</ArrowButton>
          <ArrowButton style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }} onClick={handleNext_2}>&gt;</ArrowButton>
        </div>
        <span style={{ fontSize: "24px", fontWeight: "bold", display: "block", width: "100%", maxWidth: "1180px", marginTop: "40px"  }}>도시이름2</span>
        <div style={{
          position: 'relative',
          overflow : "hidden",
          width : "1180px"
        }}>

          <NewContainerCity style={{
            display: 'flex',
            gap: '20px',
            padding: '20px',
            transition: 'transform 0.3s ease-in-out',
            transform: `translateX(-${startCity1 * 290}px)`,
            width: '1220px'
          }}>
            {cities1.map((city) => ( // <- slice 적용
                <NewSquareStyleCity key={city.id} onClick={() => handleClickcity(city.name)}>
                  <NewCityImage src={city.imageUrl} alt={city.name} />
                  <NewCityName>{city.name}</NewCityName>
                </NewSquareStyleCity>
            ))}
          </NewContainerCity>
          <ArrowButton style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)' }} onClick={handlePrev_3}>&lt;</ArrowButton>
          <ArrowButton style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }} onClick={handleNext_3}>&gt;</ArrowButton>
        </div>
      </MeddleContainer>
  );
};


const ImageSlider = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef(null);
  const images = [fan1, fan2, fan3, fan4, fan5];

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length]);

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
      <SliderContainer>
        {/* 왼쪽 화살표 */}
        <SliderArrowLeft
            src={arrowLeft}
            alt="Previous"
            onClick={handlePrevClick}
        />

        {/* 이미지 리스트 */}
        <ImageContainer style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
          {images.map((image, index) => (
              <Image key={index} src={image} alt={`Image ${index + 1}`} />
          ))}
        </ImageContainer>

        {/* 오른쪽 화살표 */}
        <SliderArrowRight
            src={arrowRight}
            alt="Next"
            onClick={handleNextClick}
        />
      </SliderContainer>
  );
};

// ✅ 새로 추가된 컴포넌트
const ToggleRectangles = () => {
  const [activeButton, setActiveButton] = useState("left");
  const navigate = useNavigate();

  const avaHotels = contents.hotels.filter(hotel => hotel.recommendedBy === "오오오");
  const sofiaHotels = contents.hotels.filter(hotel => hotel.recommendedBy === "승범");

  const selectedHotels = activeButton === "left" ? avaHotels : sofiaHotels;

  const handleCardClick = (hotel) => {
    navigate(`/hotel-detail?name=${encodeURIComponent(hotel.name)}`);
  };

  return (
      <>
        <ButtonContainer>
          <ToggleButton
              isActive={activeButton === "left"}
              onClick={() => setActiveButton("left")}
          >
            오오오 님의 최저가 상품
          </ToggleButton>
          <ToggleButton
              isActive={activeButton === "right"}
              onClick={() => setActiveButton("right")}
          >
            승범 님의 최저가 상품
          </ToggleButton>
        </ButtonContainer>

        <RectangleContainer>
          {selectedHotels.map((hotel, index) => (
              <Rectangle key={index} onClick={() => handleCardClick(hotel)} style={{cursor: "pointer"}}>
                <img src={hotel.image} alt={`호텔 ${index + 1}`} />
              </Rectangle>
          ))}
        </RectangleContainer>
      </>
  );
};

// ✅ 스타일 코드


const MeddleContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 20px;
  box-sizing: border-box;
`;

const ResponsiveContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 100px;
  margin-top: 20px;
  margin-left: 100px;
  width: 100%;
  justify-content: center;
`;
const ResponsiveContainer_1 = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const FanfareContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FanfareImage = styled.img`
  height: 25px;
  width: 25px;
`;

const FanfareText = styled.span`
  font-size: 22px;
  font-weight: bold;
  color:rgb(0, 0, 0);
`;

const ArrowButton = styled.button`
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 20px;
  cursor: pointer;
  border-radius: 5px;
`;

const BoxWrapper = styled.div`
  width: 80%;
  max-width: 630px;
  overflow: hidden;
`;

const BoxSlider = styled.div`
  display: flex;
  gap: 10px;
  transition: transform 0.5s ease-in-out;
`;
const Rating = styled.div`
  font-size: 18px;
  color: black;
  margin-top: 10px;
`;
const ResponsiveBox = styled.div`
  width: 30%;
  min-width: 200px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  border: 1px solid gray;
  border-radius: 5px;
  cursor: pointer;
`;

const SliderContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 1200px;
  height: 350px;
  overflow: hidden;
  margin: 0 auto;
  top: 0; /* 추가 */
`;

const SliderArrowLeft = styled.img`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  width: 40px;
  height: auto;
  cursor: pointer;
  z-index: 100;
`;

const SliderArrowRight = styled.img`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  width: 40px;
  height: auto;
  cursor: pointer;
  z-index: 100;
`;

const ImageContainer = styled.div`
  display: flex;
  transition: transform 0.5s ease-in-out;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;

const ToggleButton = styled.button`
  flex-grow: 1;
  padding: 15px 200px;
  font-size: 18px;
  font-weight: bold;
  border: 1px solid gray;
  border-bottom: ${(props) => (props.isActive ? "1px solid transparent" : "1px solid black")};
  background-color: white;
  color: ${(props) => (props.isActive ? "black" : "gray")};
  cursor: pointer;
  transition: all 0.3s ease;
`;

const RectangleContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 20px;
`;

const Rectangle = styled.div`
  width: 280px;
  height: 200px;
  border: solid 1px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RoundedRectangleContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 0px;
`;

const RoundedRectangle = styled.div`
  width: 180px;
  height: 180px; /* 높이를 약간 늘려서 평점 표시 공간 추가 */

  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column; /* 이미지와 평점을 세로로 배치 */
  align-items: center;
  justify-content: center;
  padding: 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ContainerCity = styled.div`
  display: flex;
  justify-content: flex-start; /* 변경 */
  gap: 20px;
  padding: 20px;
  transition: transform 0.3s ease-in-out; /* 추가 */
`;

// 자식 요소
const SquareStyleCity = styled.div`

  height: 280px;
  width: 280px;
  background-color: white;
  z-index : 1;
  border: 1px solid black;
  cursor: pointer;  /* 마우스를 대면 클릭 가능하도록 설정 */
  transition: transform 0.3s ease-in-out;  /* 마우스 오버 시 애니메이션 효과 추가 */

  /* 화면 크기 768px 이하일 때 크기 조정 */
  @media (max-width: 768px) {
    height: 200px;
    width: 200px;
  }

  /* 화면 크기 480px 이하일 때 크기 조정 */
  @media (max-width: 480px) {
    height: 150px;
    width: 150px;
  }

  /* hover 시 변환 효과 추가 */
  &:hover {
    transform: scale(1.05);  /* 마우스를 대면 크기 확장 */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);  /* 테두리 아래에 그림자 추가 */
  }
`;
const CityImage = styled.img`
  width: 280px;
  height: 200px;
  object-fit: cover;
`;

// CityName 스타일링
const CityName = styled.div`
  text-align: center;
  padding: 10px 0;
  font-size: 20px;
  font-weight: bold;
`;

// 화살표 이미지 스타일링
const ArrowImage = styled.img`
  position: absolute;
  width: 50px;
  height: 50px;
  margin-left: 1180px;
  margin-top: 110px;
`;

const NewContainerCity = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
  padding: 20px;
`;

const NewSquareStyleCity = styled.div`
  height: 280px;
  width: 280px;
  background-color: white;
  z-index : 1;
  border: 1px solid black;
  cursor: pointer;  /* 마우스를 대면 클릭 가능하도록 설정 */
  transition: transform 0.3s ease-in-out;  /* 마우스 오버 시 애니메이션 효과 추가 */

  @media (max-width: 768px) {
    height: 200px;
    width: 200px;
  }

  @media (max-width: 480px) {
    height: 150px;
    width: 150px;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  }
`;

const NewCityImage = styled.img`
  width: 280px;
  height: 200px;
  object-fit: cover;
`;

const NewCityName = styled.div`
  text-align: center;
  padding: 10px 0;
  font-size: 20px;
  font-weight: bold;
`;

const ClickableImage = styled.img`
  margin-top: 20px;
  width: 100%;
  max-width: 1180px;
  cursor: pointer;
  transition: transform 0.1s ease;

  &:active {
    transform: scale(0.97);
  }
`;

export default Meddle;
