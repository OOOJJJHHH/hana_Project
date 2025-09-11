import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function City() {
    const navigate = useNavigate();
    const [cityContents, setcityContents] = useState([]);
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
            setcityContents(res.data);
        };
        fetchData();
    }, []);

    const container = {
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: "'Noto Sans KR', sans-serif",
    };

    const buttonArea = {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '10px',  // 멘트와 버튼 간격 위해 조금 줄임
        flexWrap: 'wrap',
    };

    const alertMessage = {
        width: '100%',
        textAlign: 'center',
        marginBottom: '20px',
        color: '#ff5722',
        fontWeight: '600',
        fontSize: '16px',
        fontFamily: "'Noto Sans KR', sans-serif",
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

    const card = {
        position: 'relative',
        display: 'flex',
        borderRadius: '16px',
        width: "900px",
        overflow: 'hidden',
        marginBottom: '30px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        height: '260px',
    };

    const cardImage = {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    };

    const cardContent = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        padding: '30px',
        background: 'linear-gradient(to right, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.1) 100%)',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    };

    const cityNameStyle = {
        fontSize: '32px',
        fontWeight: 'bold',
        marginBottom: '10px',
    };

    const cityDetailStyle = {
        fontSize: '16px',
        color: '#ddd',
        maxWidth: '60%',
    };

    const viewButton = {
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        padding: '10px 20px',
        backgroundColor: '#ffffff',
        color: '#333',
        borderRadius: '6px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'all 0.3s ease',
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
                cityContents
                    .filter((c) => c.cityName.toLowerCase().includes(searchTerm))
                    .map((c, index) => (
                        <div key={index} style={card}>
                            <img src={c.cityImageUrl} alt={c.cityName} style={cardImage} />
                            <div style={cardContent}>
                                <div style={cityNameStyle}>{c.cityName}</div>
                                <p style={cityDetailStyle}>{c.cityDetail}</p>
                            </div>
                            <button
                                style={hoveredIndex === index ? viewButtonHover : viewButton}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => handleClick(c.cityName)}
                            >
                                숙소 보러가기
                            </button>
                        </div>
                    ))
            )}
        </div>
    );
}

export default City;
