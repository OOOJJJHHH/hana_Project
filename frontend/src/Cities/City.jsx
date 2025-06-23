import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import CitySearch from "./CitySerch";

function City() {
    const navigate = useNavigate();

    const [cityContents, setcityContents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userType, setUserType] = useState(null);

    const handleClick = (cityName) => {
        navigate('/cityLodging', {
            state: {
                cityName: cityName,
                cityContents: cityContents
            }
        });
    };

    const serchCity = () => {
        navigate('/cityserch');
    };

    const makeCity = () => {
        navigate('/cityform');
    };

    const makeLod = () => {
        navigate('/owner', {
            state: {
                cityContents: cityContents
            }
        });
    };

    // 로그인 정보 확인
    useEffect(() => {
        const loginUser = JSON.parse(localStorage.getItem("loginUser"));
        if (loginUser?.uUser) {
            console.log("현재 로그인한 사용자 userType:", loginUser.uUser);  // 여기에 출력
            setUserType(loginUser.uUser);
        } else {
            console.log("로그인 정보 없음 또는 userType이 없습니다.");
        }
    }, []);

    // 검색어 전달 함수
    const handleSearch = (term) => {
        setSearchTerm(term.toLowerCase());
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/getCity`);
            setcityContents(res.data);
            console.log("✅ 도시 응답:", res.data);
        };
        fetchData();
    }, []);

    const citydiv_default = {
        padding: '10px',
        width: "75rem",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    };

    const cityStyle_default = {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        borderRadius: "15px",
        border: '1px solid #D8E1C47F',
        margin: "10px",
        width: "1200px",
        height: "300px",
    };

    const city_content = {
        position: "absolute",
        width: "100%",
        height: "100%",
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: "7%",
        fontSize: "30px",
        color: "white",
    };

    const btn_content = {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
    };

    const backImg = {
        borderRadius: "15px",
        width: "100%",
        height: "auto",         // ✅ 자동 높이로 설정
        objectFit: "cover",     // ✅ 꽉 채우되 비율 유지 (혹은 contain)
        border: "1px solid #ccc"
    };

    const [hoveredButtonIndex, setHoveredButtonIndex] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredButtonIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredButtonIndex(null);
    };

    const buttonStyle = {
        position: "relative",
        width: "130px",
        height: "40px",
        lineHeight: "42px",
        padding: "0",
        border: "none",
        background: "linear-gradient(90deg, rgba(255, 204, 0, 1) 0%, rgba(255, 255, 102, 1) 100%)",
        color: "initial",
        cursor: "pointer",
        borderRadius: '5px',
    };

    const beforeAfterStyle = {
        content: '""',
        position: "absolute",
        background: "#000000FF",
        boxShadow: "-1px -1px 5px 0px #fff, 7px 7px 20px 0px #0003, 4px 4px 5px 0px #0002",
        transition: "400ms ease all",
    };

    const beforeStyle = {
        ...beforeAfterStyle,
        top: "0",
        right: "0",
        height: "2px",
        width: hoveredButtonIndex !== null ? "100%" : "0",
    };

    const afterStyle = {
        ...beforeAfterStyle,
        left: "0",
        bottom: "0",
        height: "2.5px",
        width: hoveredButtonIndex !== null ? "100%" : "0",
    };

    const buttonCommonStyle = {
        color: "white",
        backgroundColor: "gray",
        borderRadius: "10px",
        fontSize: "30px",
        width: "200px",
        height: "50px"
    };

    return (
        <div style={citydiv_default}>
            {/* 버튼 영역 */}
            <div style={{ display: "flex", justifyContent: "center", gap: "60px", marginBottom: "20px" }}>
                {userType === "admin" && (
                    <>
                        <button style={buttonCommonStyle} onClick={makeCity}>
                            도시 추가
                        </button>
                        <button style={buttonCommonStyle} onClick={makeLod}>
                            숙소 추가
                        </button>
                        <button style={buttonCommonStyle} onClick={makeLod}>
                            숙소 삭제
                        </button>
                    </>
                )}

                {userType === "landlord" && (
                    <>
                        <button style={buttonCommonStyle} onClick={makeLod}>
                            숙소 추가
                        </button>
                        <button style={buttonCommonStyle} onClick={makeLod}>
                            숙소 삭제
                        </button>
                    </>
                )}
            </div>


            {/* 도시 리스트 */}
            {cityContents.length === 0 ? (
                <div>
                    <p>현재 추가되어있는 도시 없음</p>
                </div>
            ) : (
                cityContents
                    .filter((content) =>
                        content.cityName.toLowerCase().includes(searchTerm)
                    )
                    .map((content, index) => (
                        <div key={index} style={cityStyle_default}>
                            <div style={city_content}>
                                <strong>{content.cityName}</strong>
                                <p style={{ fontSize: '15px' }}>{content.cityDetail}</p>
                            </div>

                            <img src={content.cityImageUrl} alt={`${content.cityName} 이미지`} style={backImg} />

                            <div style={btn_content}>
                                <button
                                    style={{
                                        ...buttonStyle,
                                        backgroundColor: hoveredButtonIndex === index ? 'rgba(255,27,0,1)' : 'transparent',
                                    }}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                    onClick={() => handleClick(content.cityName)}
                                >
                                    숙소 보러가기
                                    <span style={{
                                        ...beforeStyle,
                                        width: hoveredButtonIndex === index ? '100%' : '0',
                                    }}></span>
                                    <span style={{
                                        ...afterStyle,
                                        width: hoveredButtonIndex === index ? '100%' : '0',
                                    }}></span>
                                </button>
                            </div>
                        </div>
                    ))
            )}
        </div>
    );
}

export default City;
