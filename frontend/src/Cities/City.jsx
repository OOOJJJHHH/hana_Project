import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import DataFetcher from "../dbLogic/DataFetcher";
import CitySearch from "./CitySerch"; // useNavigate 훅 임포트


function City(){

    const navigate = useNavigate(); // useNavigate 훅으로 navigate 함수 생성

    const [cityContents, setcityContents] = useState([]);

    // 버튼 클릭 시 해당 content를 state로 전달
    const handleClick = (cityName) => {
        // navigate로 다른 페이지로 이동
        navigate('/cityLodging', { state: { cityName: cityName } });
    };

    const serchCity = () => {
        navigate('/cityserch');
    }

    const makeCity = () => {
        navigate('/cityform');
    }

    const makeLod = () => {
        navigate('/owner');
    }

    useEffect(() => {
        const fetchData = async () => {
            if (true) {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/getCity`);
                setcityContents(res.data);
                console.log("✅ 도시 응답:", res.data);
            }
        };
        fetchData();
    }, []);



    const citydiv_default = {
        padding: '10px',
        width: "75rem",
        display: 'flex',             /* Flexbox 활성화 */
        flexDirection: 'column',     /* 항목들을 세로로 배치 */
        alignItems: 'center',
    };

    //CSS 설정
    const cityStyle_default = {
        position: 'relative',
        display: 'flex',             /* Flexbox 활성화 */
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
        display: 'flex',             /* Flexbox 활성화 */
        flexDirection: 'column',
        justifyContent: 'center',    /* 수평 중앙 정렬 */
        marginLeft: "7%",
        fontSize: "30px",
        color: "white",
    };
    const btn_content = {
        position: 'absolute',       /* 자식 div를 절대 위치로 설정 */
        bottom: '10px',                /* 부모 div의 하단에 붙임 */
        right: '10px',
    };
    const backImg = {
        borderRadius: "15px",
        width: "100%",
        height: "100%",
    };


    const [isHovered, setIsHovered] = useState(false);
    // 각 버튼의 hover 상태를 추적하기 위해 상태 배열 사용
    const [hoveredButtonIndex, setHoveredButtonIndex] = useState(null);

    // 마우스가 버튼 위에 있을 때의 이벤트 처리
    const handleMouseEnter = (index) => {
        setHoveredButtonIndex(index);
    };

    // 마우스가 버튼을 떠날 때의 이벤트 처리
    const handleMouseLeave = () => {
        setHoveredButtonIndex(null);
    };

    //버튼 스타일
    const buttonStyle = {
        position: "relative",
        width: "130px",
        height: "40px",
        lineHeight: "42px",
        padding: "0",
        border: "none",
        background: "linear-gradient(90deg, rgba(255, 204, 0, 1) 0%, rgba(255, 255, 102, 1) 100%)",
        color: isHovered ? "#000000" : "initial",
        boxShadow: isHovered ? "none" : "none", // 기본 상태에서는 box-shadow 없음
        cursor: "pointer",
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
        width: isHovered ? "100%" : "0",
    };

    const afterStyle = {
        ...beforeAfterStyle,
        left: "0",
        bottom: "0",
        height: "2.5px",
        width: isHovered ? "100%" : "0",
    };

    return(
        <div style={citydiv_default}>

            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "60px",

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
                    onClick={() => {makeCity()}}>도시 추가</button>
                <button style={{
                        color: "white",
                        backgroundColor: "gray",
                        borderRadius: "10px",
                        fontSize: "30px",
                        width: "200px",
                        height: "50px"
                    }}
                    onClick={() => {makeLod()}}>숙소 추가</button>

                <button style={{
                        color: "white",
                        backgroundColor: "gray",
                        borderRadius: "10px",
                        fontSize: "30px",
                        width: "200px",
                        height: "50px"
                    }}
                    onClick={() => {serchCity()}}>도시 검색</button>
                <button style={{
                        color: "white",
                        backgroundColor: "gray",
                        borderRadius: "10px",
                        fontSize: "30px",
                        width: "200px",
                        height: "50px"
                    }}
                    onClick={() => {makeLod()}}>숙소 삭제</button>
            </div>

            <CitySearch />

            {cityContents.length == 0 ? (
                <div>
                    <p>현재 추가되어있는 도시 없음</p>
                </div>
            ) : (
                cityContents.map((content, index) => (
                <div key={index} style={cityStyle_default}>

                    <div style={city_content}>
                        <strong>{content.cityName}</strong>
                        <p style={{ fontSize: '15px' }}>{content.cityDetail}</p>
                    </div>

                    <img src={content.cityImag} alt={`${content.cityName} 이미지`} style={backImg} />
                    <p>{content.cityImag}</p>

                    <div style={btn_content}>
                        <button
                            style={{
                                ...buttonStyle,
                                backgroundColor: hoveredButtonIndex === index ? 'rgba(255,27,0,1)' : 'transparent', // hover 상태에서만 배경 변경
                                borderRadius: '5px', // 버튼 모서리 둥글게 하기
                            }}
                            onMouseEnter={() => handleMouseEnter(index)} // 해당 버튼의 index 전달
                            onMouseLeave={handleMouseLeave}
                            onClick={() => handleClick(content.cityName)}
                        >
                            숙소 보러가기
                            <span
                                style={{
                                    ...beforeStyle,
                                    width: hoveredButtonIndex === index ? '100%' : '0', // hover 시 width 변화
                                }}
                            ></span>
                            <span
                                style={{
                                    ...afterStyle,
                                    width: hoveredButtonIndex === index ? '100%' : '0', // hover 시 width 변화
                                }}
                            ></span>
                        </button>
                    </div>
                </div>
            )
        ))}
        </div>
    );

};


export default City;



// // PUT 요청을 보내는 함수
// console.log('Clicked item index:', cityName);
//
// const update = async (cityName) => {
//     try {
//         const response = await axios.patch(
//             `http://localhost:8080/updateCity/${cityName}`
//         );
//         console.log('Response:', response.data);
//     } catch (error) {
//         console.error('There was an error updating the city!', error);
//     }
// };
//
// update(cityName);