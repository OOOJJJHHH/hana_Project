import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Locals.css";
import LocalsImage from "../image/Locals.jpg";
import { FaUserCircle } from "react-icons/fa";



// 호텔 이미지 import
import Hotel1Image from "../image/Hotel1.jpg";
import Hotel2Image from "../image/Hotel2.jpg";
import Hotel3Image from "../image/Hotel3.jpg";
import Hotel4Image from "../image/Hotel4.jpg";
import Hotel5Image from "../image/Hotel5.jpg";
import Hotel6Image from "../image/Locals.jpg";
import Hotel7Image from "../image/Hotel7.jpg";

export const contents = {
  header: {},
  hotels: [
    { image: Hotel1Image, name: "Hotel Artemide", location: "Rome, Italy", recommendedBy: "오오오" },
    { image: Hotel2Image, name: "Hotel Diana Roof Garden", location: "Rome, Italy", recommendedBy: "오오오" },
    { image: Hotel3Image, name: "Starhotels Metropole", location: "Rome, Italy", recommendedBy: "오오오" },
    { image: Hotel4Image, name: "Rome Marriott Grand Hotel Flora", location: "Rome, Italy", recommendedBy: "승범" },
    { image: Hotel5Image, name: "Intercontinental Rome Ambasciatori Palace", location: "Rome, Italy", recommendedBy: "집" },
    { image: Hotel6Image, name: "Il Grande Gatsby Bar & Restaurant", location: "Rome, Italy", recommendedBy: "집" },
    { image: Hotel7Image, name: "Hotel Scott House", location: "Rome, Italy", recommendedBy: "집" },
    { image: Hotel7Image, name: "Hotel Scott House", location: "Rome, Italy", recommendedBy: "하이" },
    { image: Hotel7Image, name: "Hotel Scott House", location: "Rome, Italy", recommendedBy: "하이" },
    { image: Hotel7Image, name: "Hotel Scott House", location: "Rome, Italy", recommendedBy: "승범" },
    { image: Hotel7Image, name: "Hotel Scott House", location: "Rome, Italy", recommendedBy: "어진" },
    { image: Hotel7Image, name: "Hotel Scott House", location: "Rome, Italy", recommendedBy: "어진" },
  ],
  recommenders: [
    { name: "오오오", image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "오오오", image: "https://randomuser.me/api/portraits/men/55.jpg" },
    { name: "오오오", image: "https://randomuser.me/api/portraits/men/41.jpg" },
    { name: "승범", image: "https://randomuser.me/api/portraits/women/65.jpg" },
    { name: "승범", image: "https://randomuser.me/api/portraits/men/25.jpg" },
    { name: "집", image: "https://randomuser.me/api/portraits/men/23.jpg" },
    { name: "집", image: "https://randomuser.me/api/portraits/women/33.jpg" },
    { name: "하이", image: "https://randomuser.me/api/portraits/women/12.jpg" },
    { name: "하이", image: "https://randomuser.me/api/portraits/men/66.jpg" },
    { name: "어진", image: "https://randomuser.me/api/portraits/women/19.jpg" },
  ],
};



function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Locals = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const initialFilter = query.get("name");

  const [searchQuery, setSearchQuery] = useState("");
  const [hotels, setHotels] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [selectedRecommender, setSelectedRecommender] = useState(initialFilter);

  const [localData, setLocalData] = useState([]);

  // 슬라이더용 상태
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchLocalData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/getLandlord");
        setLocalData(response.data);
      } catch (error) {
        console.error("에러 발생:", error);
      }
    };

    fetchLocalData();
  }, []);

  useEffect(() => {
    if (initialFilter) {
      const filtered = contents.hotels.filter(hotel => hotel.recommendedBy === initialFilter);
      setHotels(filtered);
      setShowMore(false);
    } else {
      setHotels(contents.hotels.slice(0, 4));
    }
  }, [initialFilter]);

  const handleViewMore = () => {
    const nextHotels = contents.hotels.slice(hotels.length, hotels.length + 4);
    const newHotels = [...hotels, ...nextHotels];
    setHotels(newHotels);

    if (newHotels.length >= contents.hotels.length) {
      setShowMore(false);
    }
  };

  const handleRecommenderClick = (name) => {
    setSelectedRecommender(name);
    const filtered = contents.hotels.filter(hotel => hotel.recommendedBy === name);
    setHotels(filtered);
    setShowMore(false);
    navigate(`?name=${name}`);
  };

  const handleShowAll = () => {
    setSelectedRecommender(null);
    setHotels(contents.hotels.slice(0, 4));
    setShowMore(true);
    navigate(`/locals`);
  };

  const handleCardClick = (hotel) => {
    navigate(`/hotel-detail?name=${encodeURIComponent(hotel.name)}`);
  };

  // 슬라이더 넘기기 함수
  const maxPage = Math.floor((localData.length - 1) / itemsPerPage);

  const handleNext = () => {
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const currentLocalSlice = localData.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
      <div className="locals-container">
        <header className="locals-header">
          <div className="header-text">
            <h1>{contents.header.title}</h1>
            <p>{contents.header.subtitle}</p>
          </div>
        </header>

        <section className="recommendations">
          <div className="recommendations-header">
            <h2>현지인과 함께하는 소도시 여행 속 추천 장소</h2>
          </div>

          <div className="recommender-slider" style={{ display: "flex", alignItems: "center" }}>
            {/* 이전 버튼은 첫 페이지가 아니면 보여줌 */}
            {currentPage > 0 && (
                <button
                    onClick={handlePrev}
                    className="slider-btn"
                    style={{
                      fontSize: "24px",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      userSelect: "none",
                      marginRight: "10px",
                    }}
                    aria-label="Previous"
                >
                  &lt;
                </button>
            )}

            <div
                className="recommender-container"
                style={{ display: "flex", gap: "10px", overflow: "hidden", flexGrow: 1, justifyContent: "center" }}
            >
              {currentLocalSlice.map((recommender, index) => {
                const recommenderName = recommender.name || recommender.uFirstName;

                return (
                    <div
                        key={index}
                        className="recommender-item"
                        style={{
                          flex: "0 0 auto",
                          textAlign: "center",
                          cursor: "pointer", // 클릭 가능하다는 시각적 표시
                        }}
                        onClick={() => handleRecommenderClick(recommenderName)}
                    >
                      <img
                          src={recommender.image }
                          alt={recommenderName }
                          className="recommender-image"
                          style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                      />
                      <span>{recommenderName}</span>
                    </div>
                );
              })}
            </div>


            {/* 다음 버튼은 마지막 페이지가 아니면 보여줌 */}
            {currentPage < maxPage && (
                <button
                    onClick={handleNext}
                    className="slider-btn"
                    style={{
                      marginLeft: "10px",
                      fontSize: "24px",
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      userSelect: "none",
                    }}
                    aria-label="Next"
                >
                  &gt;
                </button>
            )}
          </div>

          {selectedRecommender && (
              <div style={{ marginTop: "10px" }}>
                <button className="view-more-btn" onClick={handleShowAll}>
                  전체 추천 보기
                </button>
              </div>
          )}

          <div className="recommendation-list">
            {hotels.map((hotel, index) => {
              const recommender = contents.recommenders.find(r => r.name === hotel.recommendedBy);

              return (
                  <div
                      className="recommendation-card"
                      key={index}
                      onClick={() => handleCardClick(hotel)}
                      style={{ cursor: "pointer" }}
                  >
                    <div className="card-image-container">
                      <img src={hotel.image} alt={hotel.name} className="card-image" />
                      {recommender ? (
                          <img
                              src={recommender.image}
                              alt={recommender.name}
                              className="user-image-overlay"
                          />
                      ) : (
                          <FaUserCircle className="user-icon" />
                      )}
                    </div>
                    <div className="card-info">
                      <h3>{hotel.name}</h3>
                      <p>{hotel.location}</p>
                      <span>추천인: {hotel.recommendedBy}</span>
                    </div>
                  </div>
              );
            })}
          </div>

          {showMore && (
              <button className="view-more-btn" onClick={handleViewMore}>
                더 보기
              </button>
          )}
        </section>
      </div>
  );
};

export default Locals;
