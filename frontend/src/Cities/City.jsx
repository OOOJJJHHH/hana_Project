// City.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function City() {
    const navigate = useNavigate();
    const [cityContents, setCityContents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userType, setUserType] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleClick = (cityName) => {
        navigate('/cityLodging', {
            state: { cityName, cityContents }
        });
    };

    const makeCity = () => navigate('/cityform');
    const makeLod = () => navigate('/owner', { state: { cityContents } });

    useEffect(() => {
        const loginUser = JSON.parse(localStorage.getItem("loginUser"));
        if (loginUser?.uUser) {
            setUserType(loginUser.uUser);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/getCity`);
            setCityContents(res.data);
        };
        fetchData();
    }, []);

    // ================== 스타일 ==================
    const container = {
        padding: '40px',
        width: '100%', // 화면 전체 기준
        margin: '0 auto',
        fontFamily: "'Noto Sans KR', sans-serif",
    };

    const buttonArea = {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '10px',
        flexWrap: 'wrap',
    };

    const alertMessage = {
        width: '100%',
        textAlign: 'center',
        marginBottom: '20px',
        color: '#ff5722',
        fontWeight: '600',
        fontSize: '16px',
    };

    const actionButton = {
        backgroundColor: '#2196F3',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: '0.3s',
    };

    const listStyle = {
        display: 'flex',
        flexDirection: 'column',   // 세로로 쌓임
        alignItems: 'center',      // 중앙 정렬
        gap: '30px',               // 카드 간격
    };

    const card = {
        position: 'relative',
        borderRadius: '16px',
        width: '70vw',      // 화면 가로 기준 70%
        maxWidth: '900px',  // 최대 너비 제한
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        height: '260px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        backgroundColor: '#fff',
        transition: 'transform 0.3s',
    };

    const cardHover = {
        ...card,
        transform: 'translateY(-5px)',
    };

    const cardImage = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0,
    };

    const cardContent = {
        position: 'relative',
        zIndex: 1,
        padding: '20px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0) 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '100%',
    };

    const cityNameStyle = { fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' };
    const cityDetailStyle = { fontSize: '14px', color: '#ddd' };

    const viewButton = {
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        padding: '8px 16px',
        backgroundColor: '#ffffff',
        color: '#333',
        borderRadius: '6px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.3s ease',
        zIndex: 2,
    };

    const viewButtonHover = {
        ...viewButton,
        backgroundColor: '#f0f0f0',
        color: '#000',
        borderColor: '#999',
    };

    const noCity = {
        textAlign: 'center',
        marginTop: '60px',
        fontSize: '18px',
        color: '#888',
    };

    return (
        <div style={container}>
            {/* 알림 문구 */}
            {(userType === "admin" || userType === "landlord") && (
                <div style={alertMessage}>
                    숙소 삭제는 마이페이지에서 가능합니다
                </div>
            )}

            {/* 관리자/호스트 버튼 영역 */}
            <div style={buttonArea}>
                {(userType === "admin" || userType === "landlord") && (
                    <>
                        {userType === "admin" && (
                            <button style={actionButton} onClick={makeCity}>도시 추가</button>
                        )}
                        <button style={actionButton} onClick={makeLod}>숙소 추가</button>
                    </>
                )}
            </div>

            {/* 도시 리스트 */}
            {cityContents.length === 0 ? (
                <p style={noCity}>현재 추가되어 있는 도시가 없습니다.</p>
            ) : (
                <div style={listStyle}>
                    {cityContents
                        .filter(c => c.cityName.toLowerCase().includes(searchTerm))
                        .map((c, index) => (
                            <div
                                key={index}
                                style={hoveredIndex === index ? cardHover : card}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <img src={c.cityImageUrl} alt={c.cityName} style={cardImage} />
                                <div style={cardContent}>
                                    <div style={cityNameStyle}>{c.cityName}</div>
                                    <div style={cityDetailStyle}>{c.cityDetail}</div>
                                </div>
                                <button
                                    style={hoveredIndex === index ? viewButtonHover : viewButton}
                                    onClick={() => handleClick(c.cityName)}
                                >
                                    숙소 보러가기 ▶
                                </button>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default City;
