import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import SelectBox from "../Custom/SelectBox";
import axios from "axios";


const CityLodging = () => {

    const location = useLocation();
    const navigate = useNavigate(); // useNavigate 훅으로 navigate 함수 생성

    const handleClick = () => {
        navigate('/city'); // 버튼 클릭 시 Middle 컴포넌트로 이동
    };

    const [contents, setContents] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8080/getCity")
            .then(response => {
                setContents(response.data);
            })
            .catch(error => {
                console.log("도시 정보 가져오기 오류 : ", error);
                alert('도시 정보를 가져오는 데 실패했습니다.');
            })
    }, []);


    const lodging_default = {
        padding: '10px',
        display: "flex",
        flexDirection: "rows",
        width: "75rem",
        border: "2px solid black"
    };

    const lodging_part1 = {
        width: "12rem",
        marginRight: "1rem",
        display: "flex",
        flexDirection: "column"
    };

    const lodging_part2 = {
        width: "",
        display: "flex",
        flexDirection: "column"
    };

    return (
        <div style={lodging_default}>
            <div style={lodging_part1}>
                <div style={{border: "2px solid black"}}>
                    {/*지도*/}지도
                </div>
                <div >
                    <SelectBox />
                </div>
                {contents.map((content, index) => (
                    <div key={index}>
                        <p>{content.id}</p>
                        <p>{content.title}</p>
                        <p>{content.content}</p>
                        <p>{content.imag}</p>
                        <p>{content.state}</p>
                    </div>
                ))}
            </div>
            <div style={lodging_part2}>
                <div  style={{border: "2px solid black"}}>
                    <p>{}건의 검색결과</p>
                </div>
                <div style={{border: "2px solid black"}}>
                    {contents.map((content, index) => (
                        <div key={index}>
                            <div>
                                <img src={content.imag} alt=""/>
                            </div>
                            <p>{content.title}</p>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={handleClick}>뒤로가기</button>
        </div>
    );
};

export default CityLodging;
