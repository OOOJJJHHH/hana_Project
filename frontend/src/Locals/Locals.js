import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

const contents = {
  header: {},
  hotels: [
    { image: Hotel1Image, name: "Hotel Artemide", location: "Rome, Italy", recommendedBy: "Sofia" },
    { image: Hotel2Image, name: "Hotel Diana Roof Garden", location: "Rome, Italy", recommendedBy: "Matteo" },
    { image: Hotel3Image, name: "Starhotels Metropole", location: "Rome, Italy", recommendedBy: "Sofia" },
    { image: Hotel4Image, name: "Rome Marriott Grand Hotel Flora", location: "Rome, Italy", recommendedBy: "Liam" },
    { image: Hotel5Image, name: "Intercontinental Rome Ambasciatori Palace", location: "Rome, Italy", recommendedBy: "Emma" },
    { image: Hotel6Image, name: "Il Grande Gatsby Bar & Restaurant", location: "Rome, Italy", recommendedBy: "James" },
    { image: Hotel7Image, name: "Hotel Scott House", location: "Rome, Italy", recommendedBy: "Noah" },
    { image: Hotel7Image, name: "Hotel Scott House", location: "Rome, Italy", recommendedBy: "Olivia" },
    { image: Hotel7Image, name: "Hotel Scott House", location: "Rome, Italy", recommendedBy: "Ava" },
    { image: Hotel7Image, name: "Hotel Scott House", location: "Rome, Italy", recommendedBy: "Ethan" },
    { image: Hotel7Image, name: "Hotel Scott House", location: "Rome, Italy", recommendedBy: "Ava" },
    { image: Hotel7Image, name: "Hotel Scott House", location: "Rome, Italy", recommendedBy: "Ava" },
  ],
  recommenders: [
    { name: "Sofia", image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Matteo", image: "https://randomuser.me/api/portraits/men/55.jpg" },
    { name: "Liam", image: "https://randomuser.me/api/portraits/men/41.jpg" },
    { name: "Emma", image: "https://randomuser.me/api/portraits/women/65.jpg" },
    { name: "James", image: "https://randomuser.me/api/portraits/men/25.jpg" },
    { name: "Noah", image: "https://randomuser.me/api/portraits/men/23.jpg" },
    { name: "Olivia", image: "https://randomuser.me/api/portraits/women/33.jpg" },
    { name: "Isabella", image: "https://randomuser.me/api/portraits/women/12.jpg" },
    { name: "Ethan", image: "https://randomuser.me/api/portraits/men/66.jpg" },
    { name: "Ava", image: "https://randomuser.me/api/portraits/women/19.jpg" },
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

        <div className="recommender-container">
          {contents.recommenders.map((recommender, index) => (
            <div
              key={index}
              className={`recommender-item ${selectedRecommender === recommender.name ? "active" : ""}`}
              onClick={() => handleRecommenderClick(recommender.name)}
            >
              <img src={recommender.image} alt={recommender.name} className="recommender-image" />
              <span>{recommender.name}</span>
            </div>
          ))}
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
              <div className="recommendation-card" key={index} onClick={() => handleCardClick(hotel)} style={{ cursor: "pointer" }}>
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
