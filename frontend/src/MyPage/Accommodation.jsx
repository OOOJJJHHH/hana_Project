import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import AccommodationRewrite from "./PopUp/AccommodationRewrite";
import AccommodationRoomRewrite from "./PopUp/AccommodationRoomRewrite";

const Accommodation = ({ uId }) => {
    const [lodgings, setLodgings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingLodging, setEditingLodging] = useState(null);
    const [editingRooms, setEditingRooms] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);

    const fetchLodgings = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/getlodbyUid/${uId}`);
            setLodgings(res.data);
            console.log(res.data);
        } catch (err) {
            console.error("숙소 목록 불러오기 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (uId) fetchLodgings();
    }, [uId]);

    const handleDeleteLodging = async (lodId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/lodging/${lodId}`);
            setLodgings((prev) => prev.filter((lod) => lod.id !== lodId));
            alert("숙소가 삭제되었습니다.");
        } catch (error) {
            console.error("숙소 삭제 실패:", error);
            alert("숙소 삭제 실패");
        }
    };

    const handleEditLodging = (lod) => setEditingLodging({ ...lod });
    const handleEditRooms = (lod) => setEditingRooms({ ...lod });

    const handleCloseModal = () => {
        setEditingLodging(null);
        setEditingRooms(null);
    };

    const handleUpdateLodging = () => {
        fetchLodgings();
        setEditingLodging(null);
    };

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        centerPadding: "10px",
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: "0px",
                },
            },
        ],
    };

    // ✅ 마키 텍스트 컴포넌트
    const MarqueeText = ({ text, hovered }) => {
        const containerRef = useRef(null);
        const textRef = useRef(null);
        const [needMarquee, setNeedMarquee] = useState(false);

        useEffect(() => {
            const textWidth = textRef.current?.scrollWidth || 0;
            const containerWidth = containerRef.current?.offsetWidth || 0;
            setNeedMarquee(textWidth > containerWidth);
        }, [text]);

        return (
            <div ref={containerRef} className="marquee-wrapper">
                <div
                    ref={textRef}
                    className={`marquee-text ${hovered && needMarquee ? "marquee-animate" : ""}`}
                >
                    {text}
                </div>
            </div>
        );
    };

    return (
        <div
            style={{
                padding: "40px 0px",
                maxWidth: "700px", // ← 여기서 더 줄일 수도 있음
                margin: "0 auto", // ← 중앙 정렬
                overflow: "hidden",
                width: "100%", // ← 추가
                boxSizing: "border-box", // ← 패딩 포함한 너비 제어
            }}
        >
            <style>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); display: flex;
          justify-content: center; align-items: center;
          z-index: 1000;
        }
        .slick-dots {
          bottom: -140px;
        }
        .slick-slider {
          overflow: visible !important;
          padding-top: 70px;
          margin-bottom: 100px;
        }
        .slick-list {
          overflow: visible !important;
        }
        .slick-slide > div {
          padding: 0 10px;
          box-sizing: border-box;
          overflow: visible !important;
        }
        .lodging-card {
          width: 100%;
          height: 480px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          background-color: #fff;
          display: flex;
          flex-direction: column;
          transition: transform 0.3s ease-in-out;
          overflow: visible;
          cursor: pointer;
          position: relative;
          z-index: 1;
        }
        .lodging-card:hover {
          transform: scale(1.03);
          z-index: 100;
        }
        /* 이미지 컨테이너를 flex로 중앙 정렬 */
        .lodging-image-container {
          width: 100%;
          height: 300px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          background-color: #f0f0f0; /* 배경색 지정 가능 */
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        .lodging-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          display: block;
        }
        .lodging-content {
          padding: 20px;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }
        .lodging-name {
          font-size: 20px;
          color: #333;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 20px;
        }
        .lodging-info {
          font-size: 14px;
          color: #555;
          margin: 6px 0;
        }
        .lodging-actions {
          display: flex;
          justify-content: space-between;
          padding: 15px 20px;
          background-color: #f9f9f9;
          border-top: 1px solid #ddd;
        }
        .btn {
          padding: 8px 16px;
          border-radius: 5px;
          border: none;
          cursor: pointer;
          color: white;
          font-weight: 600;
        }
        .btn-delete { background-color: #ff4d4d; }
        .btn-edit-lodging { background-color: #007bff; margin-right: 10px; }
        .btn-edit-rooms { background-color: #28a745; }

        .marquee-wrapper {
          position: relative;
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
        }
        .marquee-text {
          display: inline-block;
          white-space: nowrap;
          transition: transform 0.3s ease;
        }
        .marquee-animate {
          animation: scroll-text 8s linear infinite;
        }
        @keyframes scroll-text {
          0% { transform: translateX(20%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

            <h1
                style={{
                    fontSize: "32px",
                    textAlign: "center",
                    marginBottom: "40px",
                    color: "#333",
                }}
            >
                내가 등록한 숙소 목록
            </h1>

            {loading ? (
                <p>로딩 중...</p>
            ) : lodgings.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "80px 20px",
                        border: "1px solid #ddd",
                        borderRadius: "10px",
                        backgroundColor: "#f9f9f9",
                        color: "#555",
                        maxWidth: "600px",
                        margin: "50px auto",
                    }}
                >
                    <img
                        src="/no-results.png"
                        alt="No lodgings"
                        style={{ width: "120px", height: "120px", marginBottom: "20px", opacity: 0.6 }}
                    />
                    <h2>등록된 숙소가 없습니다</h2>
                    <p>숙소를 등록하고 방문자들을 맞이해보세요!</p>
                </div>
            ) : (
                <Slider {...settings}>
                    {lodgings.map((lod) => (
                        <div
                            key={lod.id}
                            onMouseEnter={() => setHoveredId(lod.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <div className="lodging-card">
                                <div className="lodging-image-container">
                                    <img src={lod.lodImag} alt={`${lod.lodName} 이미지`} className="lodging-image" />
                                </div>
                                <div className="lodging-content">
                                    <Link to={`/hotel-detail?name=${lod.lodName}`} style={{ textDecoration: "none" }}>
                                        <h2 className="lodging-name">{lod.lodName}</h2>
                                    </Link>
                                    <div className="lodging-info">
                                        <strong>도시:</strong>{" "}
                                        <MarqueeText text={lod.lodCity} hovered={hoveredId === lod.id} />
                                    </div>
                                    <div className="lodging-info">
                                        <strong>주소:</strong>{" "}
                                        <MarqueeText text={lod.lodLocation} hovered={hoveredId === lod.id} />
                                    </div>
                                    <div className="lodging-info">
                                        <strong>전화번호:</strong>{" "}
                                        <MarqueeText text={lod.lodCallNum} hovered={hoveredId === lod.id} />
                                    </div>
                                </div>
                                <div className="lodging-actions">
                                    <button className="btn btn-delete" onClick={() => handleDeleteLodging(lod.id)}>
                                        삭제
                                    </button>
                                    <button className="btn btn-edit-lodging" onClick={() => handleEditLodging(lod)}>
                                        숙소 수정
                                    </button>
                                    <button className="btn btn-edit-rooms" onClick={() => setEditingRooms(lod.lodName)}>
                                        객실 수정
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            )}

            {editingLodging && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <AccommodationRewrite
                            lodging={editingLodging}
                            onClose={handleCloseModal}
                            onUpdate={handleUpdateLodging}
                        />
                    </div>
                </div>
            )}

            {editingRooms && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div onClick={(e) => e.stopPropagation()}>
                        <AccommodationRoomRewrite
                            lodName={editingRooms} // lodName만 전달
                            onClose={handleCloseModal}
                            onUpdate={fetchLodgings}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Accommodation;
