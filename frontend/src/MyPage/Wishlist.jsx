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
            if (!userInfo?.id) return;

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

    // 찜 삭제 처리
    const handleRemove = async (lodName, roomName) => {
        if (!window.confirm(`'${lodName} - ${roomName}' 을(를) 찜 목록에서 삭제할까요?`)) return;

        try {
            const res = await axios.delete(`${process.env.REACT_APP_API_URL}/wishlist/delete`, {
                params: {
                    userId: userInfo.id,
                    lodName,
                    roomName
                }
            });

            if (res.data.success) {
                alert("찜 목록에서 삭제되었습니다.");
                setWishlist(prev =>
                    prev.filter(item => !(item.lodName === lodName && item.roomName === roomName))
                );
            } else {
                alert(res.data.message || "삭제에 실패했습니다.");
            }
        } catch (err) {
            console.error("삭제 실패:", err);
            alert("찜 삭제 중 오류가 발생했습니다.");
        }
    };

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
                        <br />
                        <button
                            onClick={() => handleRemove(item.lodName, item.roomName)}
                            style={{
                                marginTop: "10px",
                                padding: "0.5rem 1rem",
                                backgroundColor: "#f44336",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                            }}
                        >
                            ❌ 찜 삭제
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default Wishlist;
