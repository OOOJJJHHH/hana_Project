import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Locals.css";
import { FaUserCircle } from "react-icons/fa";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Locals = () => {
  // contents 초기값: owners만 빈 배열, header 기본값 설정
  const [contents, setContents] = useState({
    header: {
      title: "현지인 추천 소도시 여행",
      subtitle: "진정한 로컬 경험을 만나보세요!",
    },
    owners: [],
  });

  const query = useQuery();
  const navigate = useNavigate();
  const initialFilter = query.get("name");

  const [hotels, setHotels] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [selectedRecommender, setSelectedRecommender] = useState(initialFilter);

  // 슬라이더 상태
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  // 1. 초기엔 owners만 로드
  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const responseOwner = await axios.get("http://localhost:8080/getLandlord");
        setContents((prev) => ({
          ...prev,
          owners: responseOwner.data || []
        }));
      } catch (error) {
        console.error("Error fetching owners:", error);
      }
    };
    fetchOwners();
  }, []);

  // 2. URL 쿼리에 name 있으면 해당 사용자 숙소 자동 로드
  useEffect(() => {
    if (initialFilter && contents.owners.length > 0) {
      handleRecommenderClick(initialFilter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFilter, contents.owners]);

  // 3. 추천인 클릭 시 해당 이름으로 숙소 API 호출
  const handleRecommenderClick = async (name) => {
    try {
      setSelectedRecommender(name);
      navigate(`?name=${encodeURIComponent(name)}`);

      const responseLod = await axios.get(`http://localhost:8080/getlodbyName/${encodeURIComponent(name)}`);
      const lods = responseLod.data || [];
      setHotels(lods);
      setShowMore(false);
    } catch (error) {
      console.error("Error fetching lodgings for", name, error);
      setHotels([]);
      setShowMore(false);
    }
  };

  // 전체보기 버튼 클릭 시 전체 숙소 초기 4개 보여주고 필터 해제
  const handleShowAll = () => {
    setSelectedRecommender(null);
    setHotels([]);
    setShowMore(false);
    navigate(`/locals`);
  };

  // 숙소 카드 클릭 시 상세 페이지로 이동
  const handleCardClick = (hotel) => {
    navigate(`/hotel-detail?name=${encodeURIComponent(hotel.lodName)}`);
  };

  // 슬라이더 이전, 다음
  const maxPage = contents.owners.length > 0
      ? Math.floor((contents.owners.length - 1) / itemsPerPage)
      : 0;

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

  const currentLocalSlice = contents.owners.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

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
            {currentPage > 0 && (
                <button
                    onClick={handlePrev}
                    className="slider-btn"
                    style={{ fontSize: "24px", cursor: "pointer", background: "none", border: "none", userSelect: "none", marginRight: "10px" }}
                    aria-label="Previous"
                >
                  &lt;
                </button>
            )}

            <div
                className="recommender-container"
                style={{ display: "flex", gap: "10px", overflow: "hidden", flexGrow: 1, justifyContent: "center" }}
            >
              {currentLocalSlice.length > 0 ? (
                  currentLocalSlice.map((owner, index) => {
                    const ownerName = owner.uFirstName;
                    const ownerProfileImage = owner.profileImage;

                    return (
                        <div
                            key={owner.id || index}
                            className="recommender-item"
                            style={{ flex: "0 0 auto", textAlign: "center", cursor: "pointer" }}
                            onClick={() => handleRecommenderClick(ownerName)}
                        >
                          {ownerProfileImage ? (
                              <img
                                  src={ownerProfileImage}
                                  alt={ownerName}
                                  className="recommender-image"
                                  style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                              />
                          ) : (
                              <FaUserCircle
                                  className="recommender-image"
                                  style={{ width: "60px", height: "60px", borderRadius: "50%" }}
                              />
                          )}
                          <span>{ownerName}</span>
                        </div>
                    );
                  })
              ) : (
                  <p style={{ textAlign: "center", width: "100%", padding: "20px" }}>추천인 데이터가 없습니다.</p>
              )}
            </div>

            {currentPage < maxPage && (
                <button
                    onClick={handleNext}
                    className="slider-btn"
                    style={{ marginLeft: "10px", fontSize: "24px", cursor: "pointer", background: "none", border: "none", userSelect: "none" }}
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
            {hotels.length > 0 ? (
                hotels.map((hotel, index) => {
                  const owner = contents.owners.find((o) => o.uFirstName === hotel.lodOwner);

                  return (
                      <div
                          className="recommendation-card"
                          key={hotel.id || index}
                          onClick={() => handleCardClick(hotel)}
                          style={{ cursor: "pointer" }}
                      >
                        <div className="card-image-container">
                          <img src={hotel.lodImag} alt={hotel.lodName} className="card-image" />
                          {owner && owner.profileImage ? (
                              <img
                                  src={owner.profileImage}
                                  alt={owner.uFirstName}
                                  className="user-image-overlay"
                              />
                          ) : (
                              <FaUserCircle className="user-icon" />
                          )}
                        </div>
                        <div className="card-info">
                          <h3>{hotel.lodName}</h3>
                          <p>{hotel.lodLocation}</p>
                          <span>추천인: {hotel.lodOwner}</span>
                        </div>
                      </div>
                  );
                })
            ) : (
                <p style={{ textAlign: "center", width: "100%", padding: "20px" }}>아직 추천된 호텔이 없습니다.</p>
            )}
          </div>
        </section>

        {contents.owners.length > 0 ? (
            <ul>
              {contents.owners.map((owner, index) => (
                  <li key={owner.id || index}>
                    ID: {owner.id || "N/A"}, 이름: {owner.uFirstName} {owner.uLastName}, Email: {owner.uIdEmail || "N/A"}, Uid: {owner.uId || "N/A"}, Profile: {owner.profileImage || "N/A"}
                  </li>
              ))}
            </ul>
        ) : (
            <p>No owner data available.</p>
        )}

        <h3>--- Hotels Data (Raw) ---</h3>
      </div>
  );
};

export default Locals;
