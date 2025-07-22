import React, { useState } from "react";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const HotelReWrite = ({
                          isOpen,
                          onClose,
                          hotelId,
                          roomId,
                          userId,
                      }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const getStarIcon = (index) => {
        const currentRating = hoverRating || rating;
        if (currentRating >= index) return <FaStar color="#FFD700" />;
        if (currentRating >= index - 0.5) return <FaStarHalfAlt color="#FFD700" />;
        return <FaRegStar color="#FFD700" />;
    };

    const handleStarClick = (e, index) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - left;
        const isHalf = clickX < width / 2;
        const selected = isHalf ? index - 0.5 : index;
        setRating(selected);
    };

    const handleMouseMove = (e, index) => {
        const { left, width } = e.currentTarget.getBoundingClientRect();
        const moveX = e.clientX - left;
        const isHalf = moveX < width / 2;
        setHoverRating(isHalf ? index - 0.5 : index);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleSubmit = async () => {
        if (!userId) {
            alert("로그인이 필요합니다.");
            return;
        }

        if (!comment.trim()) {
            alert("리뷰 내용을 작성해주세요.");
            return;
        }

        setSubmitting(true);

        console.log("POST payload:", {
            hotelId,
            roomId,
            userId,
            rating,
            comment: comment.trim(),
        });


        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/saveReview`, {
                clodContentId: hotelId,
                roomId,
                userId,
                rating,
                comment: comment.trim(),
            });

            alert("리뷰가 등록되었습니다!");
            setComment("");
            setRating(5);
            onClose(); // 모달 닫기
        } catch (error) {
            alert("리뷰 등록에 실패했습니다.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={overlay}>
            <div style={modal}>
                <h3 style={styles.title}>리뷰 작성</h3>

                {/* 별점 */}
                <div style={styles.ratingContainer}>
                    <span style={styles.label}>별점:</span>
                    {[1, 2, 3, 4, 5].map((index) => (
                        <span
                            key={index}
                            onClick={(e) => handleStarClick(e, index)}
                            onMouseMove={(e) => handleMouseMove(e, index)}
                            onMouseLeave={handleMouseLeave}
                            style={styles.star}
                        >
                            {getStarIcon(index)}
                        </span>
                    ))}
                    <span style={{ marginLeft: 10, fontWeight: 500 }}>{rating}점</span>
                </div>

                {/* 리뷰 내용 */}
                <textarea
                    placeholder="리뷰를 작성해주세요..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    style={styles.textarea}
                    disabled={submitting}
                />

                {/* 버튼 */}
                <div style={styles.buttonGroup}>
                    <button onClick={onClose} disabled={submitting} style={styles.cancelButton}>
                        취소
                    </button>
                    <button onClick={handleSubmit} disabled={submitting} style={styles.submitButton}>
                        {submitting ? "등록 중..." : "리뷰 등록"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// 스타일
const overlay = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
};

const modal = {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "12px",
    padding: "24px",
    width: "420px",
    maxWidth: "90%",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
};

const styles = {
    title: {
        marginBottom: "16px",
        fontSize: "1.5rem",
        fontWeight: "600",
        color: "#333",
    },
    ratingContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: "16px",
    },
    label: {
        marginRight: 8,
        fontWeight: 500,
    },
    star: {
        fontSize: "1.8rem",
        cursor: "pointer",
        display: "inline-block",
        width: 28,
        textAlign: "center",
        transition: "transform 0.2s ease",
    },
    textarea: {
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        outline: "none",
        resize: "none",
        fontSize: "1rem",
        marginBottom: "16px",
        fontFamily: "inherit",
        boxSizing: "border-box",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
    },
    submitButton: {
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        padding: "10px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: 600,
        transition: "background-color 0.3s ease",
    },
    cancelButton: {
        backgroundColor: "#ccc",
        color: "#333",
        border: "none",
        padding: "10px 16px",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: 500,
        transition: "background-color 0.3s ease",
    },
};

export default HotelReWrite;
