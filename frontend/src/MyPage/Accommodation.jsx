import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import AccommodationRewrite from "./PopUp/AccommodationRewrite";
import AccommodationRoomRewrite from "./PopUp/AccommodationRoomRewrite"; // ✅ 추가

const Accommodation = ({ uId }) => {
    const [lodgings, setLodgings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingLodging, setEditingLodging] = useState(null);
    const [editingRooms, setEditingRooms] = useState(null); // ✅ 객실 수정 상태 추가
    const modalRef = useRef(null);

    const fetchLodgings = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/getlodbyUid/${uId}`);
            setLodgings(res.data);
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
            setLodgings(prev => prev.filter(lod => lod.id !== lodId));
            alert("숙소가 삭제되었습니다.");
        } catch (error) {
            console.error("숙소 삭제 실패:", error);
            alert("숙소 삭제 실패");
        }
    };

    const handleEditLodging = (lod) => setEditingLodging({ ...lod });
    const handleEditRooms = (lod) => setEditingRooms({ ...lod }); // ✅ 객실 수정

    const handleCloseModal = () => {
        setEditingLodging(null);
        setEditingRooms(null);
    };

    const handleUpdateLodging = (updatedLodging) => {
        setLodgings(prev =>
            prev.map(lod => (lod.id === updatedLodging.id ? updatedLodging : lod))
        );
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 2,
        responsive: [{ breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } }],
    };

    const renderMarquee = (text) => (
        <div className="marquee-container">
            <div className="marquee-text">{text}</div>
        </div>
    );

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
            <style>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.5); display: flex;
                    justify-content: center; align-items: center;
                    z-index: 1000;
                }
            `}</style>

            <h1 style={{ fontSize: '32px', textAlign: 'center', marginBottom: '40px', color: '#333' }}>
                내가 등록한 숙소 목록
            </h1>

            {loading ? (
                <p>로딩 중...</p>
            ) : lodgings.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '80px 20px',
                    border: '1px solid #ddd', borderRadius: '10px',
                    backgroundColor: '#f9f9f9', color: '#555',
                    maxWidth: '600px', margin: '50px auto'
                }}>
                    <img src="/no-results.png" alt="No lodgings"
                         style={{ width: '120px', height: '120px', marginBottom: '20px', opacity: 0.6 }} />
                    <h2>등록된 숙소가 없습니다</h2>
                    <p>숙소를 등록하고 방문자들을 맞이해보세요!</p>
                </div>
            ) : (
                <Slider {...settings}>
                    {lodgings.map((lod) => (
                        <div key={lod.id} style={{ padding: '10px' }}>
                            <div style={{
                                borderRadius: '10px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                backgroundColor: '#fff',
                                maxWidth: '90%',
                                margin: '0 auto',
                                overflow: 'hidden',
                            }}>
                                <img
                                    src={lod.lodImag
                                        ? `${process.env.REACT_APP_API_URL}/lodging/image/${lod.lodImag}`
                                        : '/default-lodging.jpg'}
                                    alt={`${lod.lodName} 이미지`}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />

                                <div style={{ padding: '20px' }}>
                                    <Link to={`/hotel-detail?name=${lod.lodName}`} style={{ textDecoration: 'none' }}>
                                        <h2 style={{ fontSize: '20px', color: '#333' }}>
                                            {lod.lodName.length > 15 ? renderMarquee(lod.lodName) : lod.lodName}
                                        </h2>
                                    </Link>
                                    <p><strong>도시:</strong> {lod.lodCity}</p>
                                    <p><strong>주소:</strong> {lod.lodLocation}</p>
                                    <p><strong>전화번호:</strong> {lod.lodCallNum}</p>
                                </div>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    padding: '15px 20px', backgroundColor: '#f9f9f9',
                                    borderTop: '1px solid #ddd'
                                }}>
                                    <button
                                        onClick={() => handleDeleteLodging(lod.id)}
                                        style={{
                                            padding: '8px 16px', backgroundColor: '#ff4d4d',
                                            color: 'white', border: 'none',
                                            borderRadius: '5px', cursor: 'pointer'
                                        }}
                                    >
                                        삭제
                                    </button>

                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => handleEditLodging(lod)}
                                            style={{
                                                padding: '8px 14px', backgroundColor: '#007bff',
                                                color: 'white', border: 'none',
                                                borderRadius: '5px', cursor: 'pointer'
                                            }}
                                        >
                                            숙소 수정
                                        </button>

                                        <button
                                            onClick={() => handleEditRooms(lod)}
                                            style={{
                                                padding: '8px 14px', backgroundColor: '#28a745',
                                                color: 'white', border: 'none',
                                                borderRadius: '5px', cursor: 'pointer'
                                            }}
                                        >
                                            객실 수정
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            )}

            {/* 숙소 수정 모달 */}
            {editingLodging && (
                <AccommodationRewrite
                    lodging={editingLodging}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdateLodging}
                />
            )}

            {/* 객실 수정 모달 (새 컴포넌트) */}
            {editingRooms && (
                <AccommodationRoomRewrite
                    lodging={editingRooms}
                    onClose={handleCloseModal}
                    onUpdated={fetchLodgings} // 수정 완료 후 숙소 목록 새로고침
                />
            )}
        </div>
    );
};

export default Accommodation;
