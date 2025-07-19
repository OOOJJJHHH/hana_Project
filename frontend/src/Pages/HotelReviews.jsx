import React, { useEffect, useState } from "react";
import axios from "axios";

const HotelReviews = ({ hotelId, roomId, userId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");

    // 별점 렌더링 함수 (이전과 동일)
    const renderStars = (rating) => {
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        const stars = [];
        for (let i = 0; i < full; i++) stars.push("★");
        if (half) stars.push("☆");
        while (stars.length < 5) stars.push("✩");
        return stars.join("");
    };

    const fetchReviews = async () => {
        if (!hotelId || !roomId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/reviews`,
                { params: { hotelId, roomId } }
            );
            setReviews(response.data);
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

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (!newComment.trim()) {
            alert("리뷰 내용을 입력해주세요.");
            return;
        }
        setSubmitting(true);
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/reviews`, {
                hotelId,
                roomId,
                userId,
                rating: newRating,
                comment: newComment.trim(),
            });
            setNewComment("");
            setNewRating(5);
            setShowForm(false); // 작성 후 폼 닫기
            fetchReviews();
        } catch {
            alert("리뷰 작성에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAllReviews = async () => {
        if (!window.confirm("정말 모든 리뷰를 삭제하시겠습니까?")) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/reviews`, {
                data: { hotelId, roomId, userId },
            });
            fetchReviews();
        } catch {
            alert("리뷰 삭제에 실패했습니다.");
        }
    };

    // 클릭 핸들러 함수
    const handleWriteClick = () => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }
        setShowForm((prev) => !prev);
    };

    const handleDeleteClick = () => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }
        handleDeleteAllReviews();
    };

    // 인라인 스타일
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
        buttonHover: {
            backgroundColor: "#0056b3",
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
    };

    // hover효과 인라인으로 간단 구현용 함수 (선택 사항)
    const onMouseEnter = (e) => {
        e.currentTarget.style.backgroundColor = "#0056b3";
    };
    const onMouseLeave = (e) => {
        e.currentTarget.style.backgroundColor = "#007bff";
    };

    return (
        <div className="hotel-review-section" style={{ minHeight: "150px" }}>
            {/* 헤더 + 버튼들 한 줄에 배치 */}
            <div style={styles.header}>
                <h2 style={styles.title}>리뷰</h2>
                <div style={styles.buttonContainer}>
                    <button
                        style={styles.button}
                        onClick={handleWriteClick}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        작성
                    </button>
                    <button
                        style={styles.button}
                        onClick={handleDeleteClick}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                    >
                        삭제
                    </button>
                </div>
            </div>

            {/* 리뷰 작성 폼 (showForm에 따라 표시) */}
            {showForm && (
                <form
                    onSubmit={handleSubmitReview}
                    className="review-form"
                    style={{ marginBottom: "20px" }}
                >
                    <label>
                        별점:
                        <select
                            value={newRating}
                            onChange={(e) => setNewRating(Number(e.target.value))}
                            disabled={submitting}
                        >
                            {[5, 4, 3, 2, 1].map((num) => (
                                <option key={num} value={num}>
                                    {num}점
                                </option>
                            ))}
                        </select>
                    </label>
                    <br />
                    <label>
                        리뷰 내용:
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={submitting}
                            rows={3}
                            placeholder="리뷰를 작성해주세요."
                            style={{ width: "100%" }}
                        />
                    </label>
                    <br />
                    <button type="submit" disabled={submitting} style={{ ...styles.button }}>
                        {submitting ? "등록중..." : "리뷰 등록"}
                    </button>
                </form>
            )}

            {/* 리뷰 상태 표시 */}
            {loading && <p>리뷰를 불러오는 중입니다...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && reviews.length === 0 && <p>아직 리뷰가 없습니다.</p>}

            {/* 리뷰 목록 */}
            {!loading &&
                !error &&
                reviews.length > 0 &&
                reviews.map((review) => (
                    <div key={review.id} className="review-card" style={{ marginBottom: 12 }}>
                        <p>
                            <strong>{review.user}</strong> {renderStars(review.rating)} ({review.rating})
                        </p>
                        <p>{review.comment}</p>
                        {/* 개별 리뷰 삭제 버튼 (선택 시) */}
                        {userId === review.userId && (
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
                        )}
                    </div>
                ))}
        </div>
    );
};

export default HotelReviews;
