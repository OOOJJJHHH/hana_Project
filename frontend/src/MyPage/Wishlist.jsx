import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Session/UserContext";

const Wishlist = () => {
    const userInfo = useContext(UserContext);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate(); // 🚀 페이지 이동용

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!userInfo?.uId) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/wishlist/${userInfo.uId}`
                );
                setWishlist(res.data);
            } catch (err) {
                console.error("❌ 찜 목록 불러오기 실패", err);
                alert("찜 목록을 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, [userInfo]);

    // 카드 클릭 시 호텔 상세 페이지 이동
    const handleCardClick = (lodName) => {
        // hotelName 쿼리 파라미터로 전달
        navigate(`/hotel-detail?name=${encodeURIComponent(lodName)}`);
    };

    // ---------------- CSS 객체 ----------------
    const styles = {
        container: { padding: "2rem" },
        title: { fontSize: "1.8rem", fontWeight: "700", marginBottom: "1rem" },
        emptyText: { fontSize: "1rem", color: "#555" },
        wishlistContainer: {
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxHeight: "80vh",
            overflowY: "auto",
            paddingRight: "8px",
        },
        card: {
            border: "1px solid #ddd",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            padding: "12px",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            cursor: "pointer", // 클릭 가능
            transition: "transform 0.2s",
        },
        cardHover: {
            transform: "scale(1.02)",
        },
        cardTitle: { fontSize: "1.1rem", fontWeight: "600" },
        cardText: { fontSize: "0.9rem", color: "#555" },
        cardPrice: { fontSize: "0.9rem", color: "#555", fontWeight: "500" },
        imageSlider: { display: "flex", overflowX: "auto", gap: "8px", paddingTop: "8px" },
        imageWrapper: {
            minWidth: "200px",
            height: "140px",
            borderRadius: "8px",
            overflow: "hidden",
            flexShrink: 0,
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        image: { width: "100%", height: "100%", objectFit: "contain" },
        noImageText: { color: "#888", fontSize: "0.9rem" },
    };

    if (loading) return <p style={styles.emptyText}>불러오는 중...</p>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>💖 찜한 숙소 목록</h2>

            {wishlist.length === 0 ? (
                <p style={styles.emptyText}>찜한 숙소가 없습니다.</p>
            ) : (
                <div style={styles.wishlistContainer}>
                    {wishlist.map((item, idx) => (
                        <div
                            key={idx}
                            style={styles.card}
                            onClick={() => handleCardClick(item.lodName)}
                        >
                            <h3 style={styles.cardTitle}>
                                {item.lodName} - {item.roomName}
                            </h3>
                            <p style={styles.cardText}>📍 {item.lodLocation}</p>
                            <p style={styles.cardPrice}>💰 {item.roomPrice.toLocaleString()}원</p>

                            <div style={styles.imageSlider}>
                                {item.roomImages && item.roomImages.length > 0 ? (
                                    item.roomImages.map((imgUrl, i) => (
                                        <div key={i} style={styles.imageWrapper}>
                                            <img
                                                src={imgUrl}
                                                alt={`${item.roomName} 이미지 ${i + 1}`}
                                                style={styles.image}
                                            />
                                        </div>
                                    ))
                                ) : (
                                    <div style={styles.imageWrapper}>
                                        <span style={styles.noImageText}>등록된 이미지 없음</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
