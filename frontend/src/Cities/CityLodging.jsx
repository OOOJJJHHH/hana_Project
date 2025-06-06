import React, {useRef, useEffect, useState} from 'react';
import SelectBox from "./Custom/SelectBox";
import DataFetcher from "../dbLogic/DataFetcher";
import MapPopupContent from "./PopUp/MapPopupContent";
import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {contents} from "../Locals/Locals";

const CityLodging = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // state로 전달된 값 받기
    const cityFromNameState = location.state?.cityName;
    const cityFromContentState = location.state?.cityContents;

    const [cityContents, setcityContents] = useState(cityFromContentState || []);
    const [lodContents, setlodContents] = useState([]);
    const [nowTitle, setNowTitle] = useState(cityFromNameState || '');

    // 전달된 값 없으면 되돌리기
    useEffect(() => {
        if (!cityFromNameState) {
            alert('잘못된 접근입니다.');
            navigate(-1);
        }
    }, [cityFromNameState, navigate]);

    useEffect(() => {
        console.log("시도");
        console.log({nowTitle});
        const now = encodeURIComponent(nowTitle);
        console.log({now});
        const fetchData = async () => {
                try {
                    const reslod = await axios.get(`${process.env.REACT_APP_API_URL}/getLodsByCity/${now}`);
                    setlodContents(reslod.data);
                    console.log(reslod.data);
                    console.log(reslod);

                } catch (error) {
                    console.error("❌ 숙소 불러오기 실패:", error);
                }
        };
        fetchData();
    }, [nowTitle]);



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

    const nonContent = {
        width: "100%",
        height: "300px",
        display: 'flex',
        justifyContent: 'center',
        alignItems: "center"
    }

    const mapContainerRef = useRef(null);

    return (
        <div style={{ padding: '10px', display: "flex", flexDirection: "row", width: "75rem" }}>


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
                    flexDirection: "row",
                    marginTop: "5%",
                    // minWidth: lodContents ? '700px' : undefined,
                    minHeight: lodContents ? '700px' : undefined,
                    flexWrap: 'wrap',
                    gap: '30px',
                }}>
                    {lodContents.length == 0 ? (
                            <div style={nonContent}>
                                <p>현재 추가되어있는 숙소가 없습니다</p>
                            </div>
                        ):
                        (lodContents.map((lContent, index) => (
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
                                        width: "100%",
                                        top: "-2px",
                                        left: "-10px",
                                        right: "-20px",
                                        bottom: "-2px",
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                        zIndex: -1,
                                    }}></div>
                                    <p>숙소 이름 : {lContent.lodName}</p>
                                    <p>숙소 위치 : {lContent.lodLocation}</p>
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
                    )))}
                </div>
            </div>

        </div>
    );
};

export default CityLodging;
