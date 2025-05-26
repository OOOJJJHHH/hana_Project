import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import DataFetcher from "../dbLogic/DataFetcher";
import CitySearch from "./CitySerch"; // useNavigate 훅 임포트


function City(){

    const navigate = useNavigate(); // useNavigate 훅으로 navigate 함수 생성

    const [cityContents, setcityContents] = useState([]);
    const [lodContents, setlodContents] = useState([]);

    // 버튼 클릭 시 해당 content를 state로 전달
    const handleClick = (cityName) => {
        // PUT 요청을 보내는 함수
        console.log('Clicked item index:', cityName);

        const update = async (cityName) => {
            try {
                const response = await axios.patch(
                    `http://localhost:8080/updateCity/${cityName}`
                );
                console.log('Response:', response.data);
            } catch (error) {
                console.error('There was an error updating the city!', error);
            }
        };

        update(cityName);

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

            <DataFetcher
                fetchCity={1}
                fetchLod={0}
                setCityContents={setcityContents}
                setLodContents={setlodContents}
            />

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
                    <img src={content.cityImag} style={backImg} />
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
//
//
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
//
// const City = () => {
//     // 도시 목록 상태
//     const [cities, setCities] = useState([]);
//
//     // 컴포넌트가 마운트될 때 도시 정보 가져오기
//     useEffect(() => {
//         axios.get('http://localhost:8080/getCity')
//             .then(response => {
//                 // 응답 데이터를 cities 상태에 저장
//                 setCities(response.data);
//             })
//             .catch(error => {
//                 console.error('도시 정보 가져오기 오류:', error);
//                 alert('도시 정보를 가져오는 데 실패했습니다.');
//             });
//     }, []); // 빈 배열로 설정하면 처음 한 번만 실행됨
//
//     return (
//         <div>
//             <h2>도시 목록</h2>
//             <ul>
//                 {cities.map((city, index) => (
//                     <li key={index}>
//                         <h3>{city.title}</h3>
//                         <p>{city.content}</p>
//                         <img src={city.imag} />
//                         <p>=========================</p>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };
//
// export default City;



// ["0","튀빙겐", "좋아요", "data:image/jpeg;base64,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"],
//     ["0","퓌센", "굿이에요", "data:image/jpeg;base64,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"],
//     ["0","파이네", "짱이에요", "data:image/jpeg;base64,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"],


//     // 컴포넌트가 마운트될 때 도시 정보 가져오기
// useEffect(() => {
//     axios.get('http://localhost:8080/getCity')
//         .then(response => {
//             // 응답 데이터를 cities 상태에 저장
//             setContents(response.data);
//         })
//         .catch(error => {
//             console.error('도시 정보 가져오기 오류:', error);
//             alert('도시 정보를 가져오는 데 실패했습니다.');
//         });
// }, []); // 빈 배열로 설정하면 처음 한 번만 실행됨