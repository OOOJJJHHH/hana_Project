import React, { useEffect, useState } from "react";
import axios from "axios";
import HotelReWrite from "./HotelReWrite"; // ✅ 리뷰 작성/수정 모달

const HotelReviews = ({ hotelId, roomId, userId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editingReview, setEditingReview] = useState(null); // ✅ 수정 모드 여부

    const fetchReviews = async () => {
        if (!hotelId || !roomId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/getReviews`,
                {
                    params: {
                        clodContentId: hotelId,
                        roomId,
                    },
                }
            );
            setReviews(response.data);
            console.log(response.data);
            setError(null);
        } catch {
            setError("리뷰를 불러오는 중 오류가 발생했습니다.");
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [hotelId, roomId]);

    const handleWriteClick = () => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }
        setEditingReview(null); // 작성 모드
        setShowModal(true);
    };

    const handleEditClick = (review) => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }
        setEditingReview(review); // 수정 모드
        setShowModal(true);
    };

    const handleDeleteClick = () => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (!window.confirm("정말 모든 리뷰를 삭제하시겠습니까?")) return;
        axios
            .delete(`${process.env.REACT_APP_API_URL}/reviews`, {
                data: { hotelId, roomId, userId },
            })
            .then(fetchReviews)
            .catch(() => alert("리뷰 삭제에 실패했습니다."));
    };

    const renderStars = (rating) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        const stars = [];
        for (let i = 0; i < full; i++) stars.push("★");
        if (half) stars.push("☆");
        while (stars.length < 5) stars.push("✩");
        return stars.join("");
    };

    const styles = {
        header: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
            paddingBottom: 6,
            borderBottom: "2px solid #007bff",
        },
        title: {
            margin: 0,
            fontSize: "1.8rem",
            fontWeight: "700",
            color: "#333",
        },
        buttonContainer: {
            display: "flex",
            gap: 10,
        },
        button: {
            backgroundColor: "#007bff",
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: 5,
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "1rem",
            transition: "background-color 0.3s ease",
        },
        reviewCardDeleteBtn: {
            color: "red",
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            marginTop: 6,
            fontSize: "0.9rem",
        },
        reviewCardEditBtn: {
            color: "#007bff",
            background: "none",
            border: "none",
            padding: 0,
            marginRight: 10,
            fontSize: "0.9rem",
            cursor: "pointer",
        },
    };

    return (
        <div className="hotel-review-section" style={{ minHeight: "150px" }}>
            <div style={styles.header}>
                <h2 style={styles.title}>리뷰</h2>
                <div style={styles.buttonContainer}>
                    <button
                        style={styles.button}
                        onClick={handleWriteClick}
                    >
                        작성
                    </button>
                    <button
                        style={styles.button}
                        onClick={handleDeleteClick}
                    >
                        삭제
                    </button>
                </div>
            </div>

            {/* ✅ 작성/수정 모달 */}
            <HotelReWrite
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                hotelId={hotelId}
                roomId={roomId}
                userId={userId}
                editingReview={editingReview}
                refreshReviews={fetchReviews}
            />

            {/* 상태 표시 */}
            {loading && <p>리뷰를 불러오는 중입니다...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && reviews.length === 0 && <p>아직 리뷰가 없습니다.</p>}

            {/* 리뷰 목록 */}
            {!loading && !error &&
                reviews.map((review) => (
                    <div key={review.id} className="review-card" style={{ marginBottom: 12 }}>
                        <p>
                            <strong>{review.user}</strong> {renderStars(review.rating)} ({review.rating})
                        </p>
                        <p>{review.comment}</p>
                        {userId === review.userId && (
                            <div>
                                <button
                                    onClick={() => handleEditClick(review)}
                                    style={styles.reviewCardEditBtn}
                                >
                                    수정
                                </button>
                                <button
                                    onClick={() => {
                                        if (window.confirm("이 리뷰를 삭제하시겠습니까?")) {
                                            axios
                                                .delete(`${process.env.REACT_APP_API_URL}/reviews/${review.id}`, {
                                                    data: { userId },
                                                })
                                                .then(fetchReviews)
                                                .catch(() => alert("리뷰 삭제에 실패했습니다."));
                                        }
                                    }}
                                    style={styles.reviewCardDeleteBtn}
                                >
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
};

export default HotelReviews;
