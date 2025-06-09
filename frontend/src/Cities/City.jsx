import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import CitySearch from "./CitySerch"; // CitySearch 컴포넌트 import

function City() {
    const navigate = useNavigate();

    const [cityContents, setcityContents] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태 추가

    // 버튼 클릭 시 해당 content를 state로 전달하며 페이지 이동
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

    // CitySearch 컴포넌트에서 검색어를 받을 함수
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
        height: "100%",
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

    return (
        <div style={citydiv_default}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "60px",
                marginBottom: "20px"
            }}>
                <button
                    style={{
                        color: "white",
                        backgroundColor: "gray",
                        borderRadius: "10px",
                        fontSize: "30px",
                        width: "200px",
                        height: "50px"
                    }}
                    onClick={makeCity}
                >
                    도시 추가
                </button>
                <button
                    style={{
                        color: "white",
                        backgroundColor: "gray",
                        borderRadius: "10px",
                        fontSize: "30px",
                        width: "200px",
                        height: "50px"
                    }}
                    onClick={makeLod}
                >
                    숙소 추가
                </button>
                <button
                    style={{
                        color: "white",
                        backgroundColor: "gray",
                        borderRadius: "10px",
                        fontSize: "30px",
                        width: "200px",
                        height: "50px"
                    }}
                    onClick={serchCity}
                >
                    도시 검색
                </button>
                <button
                    style={{
                        color: "white",
                        backgroundColor: "gray",
                        borderRadius: "10px",
                        fontSize: "30px",
                        width: "200px",
                        height: "50px"
                    }}
                    onClick={makeLod}
                >
                    숙소 삭제
                </button>
            </div>

            {/* CitySearch 컴포넌트에 검색어 전달 함수 props로 넘김 */}
            <CitySearch onSearch={handleSearch} />

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
                                    <span
                                        style={{
                                            ...beforeStyle,
                                            width: hoveredButtonIndex === index ? '100%' : '0',
                                        }}
                                    ></span>
                                    <span
                                        style={{
                                            ...afterStyle,
                                            width: hoveredButtonIndex === index ? '100%' : '0',
                                        }}
                                    ></span>
                                </button>
                            </div>
                        </div>
                    ))
            )}
        </div>
    );
};

export default City;
