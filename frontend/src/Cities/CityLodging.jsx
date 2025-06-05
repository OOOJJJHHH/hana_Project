import React, {useRef, useEffect, useState} from 'react';
import SelectBox from "./Custom/SelectBox";
import DataFetcher from "../dbLogic/DataFetcher";
import MapPopupContent from "./PopUp/MapPopupContent";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";

const CityLodging = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // state로 전달된 값 받기
    const cityFromState = location.state?.cityName;

    // 전달된 값 없으면 되돌리기
    useEffect(() => {
        if (!cityFromState) {
            alert('잘못된 접근입니다.');
            navigate(-1);
        }
    }, [cityFromState, navigate]);

    const [cityContents, setcityContents] = useState([]);
    const [lodContents, setlodContents] = useState([]);
    const [nowTitle, setNowTitle] = useState(cityFromState || '');

    useEffect(() => {
        const activeCity = cityContents.find(cContent => cContent.cityState === 1);
        if (activeCity) {
            setNowTitle(activeCity.cityName);
        }
    }, [cityContents]);

    useEffect(() => {

        const fetchData = async () => {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/getCity`);
                setNowTitle(res.data);
        };
        fetchData();

    }, [nowTitle]);

    // ... (중략: 스타일, 마우스 이벤트, 지도 세팅 등)

    const [isOpen, setIsOpen] = useState(false);
    const openPopup = () => setIsOpen(true);
    const closePopup = () => setIsOpen(false);
    const popupOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: "1"
    };

    const mapContainerRef = useRef(null);


    return (
        <div style={{ padding: '10px', display: "flex", flexDirection: "row", width: "75rem" }}>

            <DataFetcher
                fetchCity={1}
                fetchLod={1}
                setCityContents={setcityContents}
                setLodContents={setlodContents}
            />

            <div style={{ width: "15rem", marginRight: "1rem", display: "flex", flexDirection: "column" }}>
                <div
                    ref={mapContainerRef}
                    style={{
                        width: "200px",
                        height: "150px",
                        borderRadius: "30px",
                        alignSelf: 'center',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs8dhlFDMlZiSIpteHpCPxCwl9GKducDzF_g&s")',
                        backgroundSize: 'cover',
                    }}
                >
                    <button
                        style={{
                            width: "4rem",
                            height: "2rem",
                            border: "none",
                            borderRadius: "7px",
                            backgroundColor: "white",
                            cursor: "pointer",
                            fontSize: "12px"
                        }}
                        onClick={openPopup}
                    >
                        지도 열기
                    </button>
                    {isOpen && (
                        <div style={popupOverlayStyle}>
                            <MapPopupContent onClose={closePopup} />
                        </div>
                    )}
                </div>

                {/* 여기만 수정했습니다 */}
                <div>
                    <SelectBox cityList={cityContents} onCityChange={setNowTitle} />
                </div>
            </div>

            <div style={{ width: "80%" }}>
                <div style={{ fontSize: "30px", border: "1px solid black" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <p>"<strong>{nowTitle}</strong>" 지역의 검색결과</p>
                    </div>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "rows",
                    marginTop: "5%",
                    flexWrap: 'wrap',
                    gap: '30px',
                }}>
                    {lodContents.map((lContent, index) => (
                        lContent.lodCity === nowTitle ? (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    position: 'relative',
                                    width: "16rem",
                                    height: "26rem",
                                    border: "0.5px solid #D8E1C47F",
                                    borderRadius: "15px",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    cursor: 'pointer',
                                    transition: 'all 0.5s ease',
                                    transform: (index === null ? 1 : 1), // 호버 효과 등 필요시 추가
                                    boxShadow: 'none'
                                }}
                            >
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    position: "absolute",
                                    left: "5%",
                                    bottom: "3%",
                                    color: "white"
                                }}>
                                    <div style={{
                                        borderRadius: "15px",
                                        position: "absolute",
                                        top: "-2px",
                                        left: "-10px",
                                        right: "-20px",
                                        bottom: "-2px",
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        zIndex: -1,
                                    }}></div>
                                    <p>숙소 이름 : {lContent.lodName}</p>
                                    <p>숙소 위치 : {lContent.lodPrice} / (원)</p>
                                </div>
                                <img src={lContent.lodImag} style={{
                                    borderRadius: "15px",
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    zIndex: "-2"
                                }} />
                            </div>
                        ) : null
                    ))}
                </div>
            </div>

        </div>
    );
};

export default CityLodging;
