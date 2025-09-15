import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../Session/UserContext";

const Wishlist = () => {
    const userInfo = useContext(UserContext);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    // 찜 목록 불러오기
    useEffect(() => {
        const fetchWishlist = async () => {
            if (!userInfo?.id) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/wishlist/${userInfo.id}`
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

    if (loading) return <p>불러오는 중...</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>📌 찜한 숙소 목록</h2>
            {wishlist.length === 0 ? (
                <p>찜한 숙소가 없습니다.</p>
            ) : (
                wishlist.map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            border: "1px solid #ccc",
                            padding: "1rem",
                            borderRadius: "8px",
                            marginBottom: "1rem",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        }}
                    >
                        <h3>{item.lodName} - {item.roomName}</h3>
                        <p>📍 위치: {item.lodLocation}</p>
                        <p>💰 가격: {item.roomPrice.toLocaleString()}원</p>
                        <img
                            src={item.roomImage}
                            alt={`${item.roomName} 이미지`}
                            style={{ width: "300px", height: "auto", borderRadius: "8px" }}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default Wishlist;
