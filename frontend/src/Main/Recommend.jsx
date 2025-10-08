import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RefreshCw } from "react-feather";

// ===== 스타일 =====
const container = {
    width: "90%",
    maxWidth: "1180px",
    margin: "40px auto",
    fontFamily: "'Noto Sans', sans-serif",
};

const title = {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "25px",
    color: "#333",
    textAlign: "center",
};

const hotelList = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
};

const card = {
    width: "220px",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    cursor: "pointer",
    backgroundColor: "#fff",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
};

const cardHover = {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
};

const imageWrapper = {
    width: "100%",
    height: "140px",
    overflow: "hidden",
    backgroundColor: "#eee",
};

const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s",
};

const infoWrapper = {
    padding: "12px 15px",
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
};

const hotelName = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#222",
    marginBottom: "6px",
    lineHeight: "1.2",
    height: "40px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
};

// ===== 버튼 스타일 =====
const refreshButton = {
    cursor: "pointer",
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#68b1ff",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "500",
    boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    transition: "all 0.2s",
};

const refreshButtonHover = {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
    backgroundColor: "#bed1f4",   // hover 시 밝은 파랑
};

// ===== 랜덤 추천 컴포넌트 =====
const Recommend = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [displayHotels, setDisplayHotels] = useState([]);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [isRefreshHover, setIsRefreshHover] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 1. 전체 숙소 로드
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/getAllLodgings`);
                setHotels(response.data || []);
                setRandomHotels(response.data || []);
            } catch (error) {
                console.error("숙소 불러오기 실패:", error);
            }
        };
        fetchHotels();
    }, []);

    // 2. 랜덤 5개 선택
    const setRandomHotels = (list) => {
        if (!list || list.length === 0) {
            setDisplayHotels([]);
            return;
        }
        const shuffled = [...list].sort(() => 0.5 - Math.random());
        setDisplayHotels(shuffled.slice(0, 5));
    };

    // 3. 추천 다시 받기
    const refreshDisplay = () => {
        setIsRefreshing(true);
        setRandomHotels(hotels);
        setTimeout(() => setIsRefreshing(false), 800); // 아이콘 회전 시간
    };

    return (
        <div style={container}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <div style={title}>오늘의 추천 숙소</div>
                <button
                    style={{ ...refreshButton, ...(isRefreshHover ? refreshButtonHover : {}) }}
                    onClick={refreshDisplay}
                    onMouseEnter={() => setIsRefreshHover(true)}
                    onMouseLeave={() => setIsRefreshHover(false)}
                >
                    <RefreshCw
                        size={18}
                        style={{ transition: "transform 0.8s", transform: isRefreshing ? "rotate(360deg)" : "rotate(0deg)" }}
                    />
                    추천 다시 받기
                </button>
            </div>

            <div style={hotelList}>
                {displayHotels.length > 0 ? (
                    displayHotels.map((hotel, index) => (
                        <div
                            key={hotel.id || index}
                            style={{ ...card, ...(hoverIndex === index ? cardHover : {}) }}
                            onClick={() => navigate(`/hotel-detail?name=${encodeURIComponent(hotel.lodName)}`)}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            <div style={imageWrapper}>
                                {hotel.lodImag ? (
                                    <img
                                        src={hotel.lodImag}
                                        alt={hotel.lodName}
                                        style={{ ...imageStyle, ...(hoverIndex === index ? { transform: "scale(1.05)" } : {}) }}
                                    />
                                ) : (
                                    <div style={imageStyle}></div>
                                )}
                            </div>
                            <div style={infoWrapper}>
                                <div style={hotelName}>{hotel.lodName}</div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>추천 숙소가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default Recommend;
