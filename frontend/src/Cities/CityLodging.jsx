import React, { useRef, useEffect, useState } from 'react';
import SelectBox from "./Custom/SelectBox";
import DataFetcher from "../dbLogic/DataFetcher";
import MapPopupContent from "./PopUp/MapPopupContent";
import axios from "axios";

const CityLodging = () => {
    const [cityContents, setCityContents] = useState([]);
    const [lodContents, setLodContents] = useState([]);
    const [nowTitle, setNowTitle] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const mapContainerRef = useRef(null);


    useEffect(() => {
        if (!nowTitle) return;

        console.log("📡 숙소 요청:", nowTitle);
        axios.get(`http://localhost:8080/getLodByCity/${encodeURIComponent(nowTitle)}`)
            .then((res) => {
                const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;
                setLodContents(Array.isArray(data) ? data : []);
            })
            .catch((err) => {
                console.error("❌ 숙소 요청 실패:", err);
            });
    }, [nowTitle]);


    // 콘솔 디버깅
    useEffect(() => {
        console.log("🔵 nowTitle:", nowTitle);
        console.log("🟢 lodContents:", lodContents);
        lodContents.forEach((l, i) => {
            console.log(`📍 lod[${i}].lodCity:`, `"${l.lodCity}"`);
        });
    }, [lodContents, nowTitle]);

    // 카카오 지도 불러오기
    useEffect(() => {
        const script = document.createElement("script");
        const apiKey = process.env.REACT_APP_KAKAO_MAP_API_KEY;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}`;
        script.async = true;
        script.onload = () => {
            const options = {
                center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                level: 3,
            };
            new window.kakao.maps.Map(mapContainerRef.current, options);
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // 카드 hover 효과
    const handleMouseEnter = (index) => setIsHovered(index);
    const handleMouseLeave = () => setIsHovered(false);
    const handleClick = (index) => alert(`${index}를 클릭했습니다!`);

    // CSS 스타일 정의
    const styles = {
        lodging_default: { padding: '10px', display: "flex", flexDirection: "rows", width: "75rem" },
        lodging_part1: { width: "15rem", marginRight: "1rem", display: "flex", flexDirection: "column" },
        map_view: {
            width: "200px", height: "150px", borderRadius: "30px", alignSelf: 'center',
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs8dhlFDMlZiSIpteHpCPxCwl9GKducDzF_g&s")',
            backgroundSize: 'cover'
        },
        map_btn: {
            width: "4rem", height: "2rem", border: "none", borderRadius: "7px",
            backgroundColor: "white", cursor: "pointer", fontSize: "12px"
        },
        lodging_part2: { width: "80%" },
        city_title_view: { fontSize: "30px", border: "1px solid black" },
        lod_content_view: {
            display: "flex", flexDirection: "rows", marginTop: "5%", flexWrap: 'wrap', gap: '30px'
        },
        lod_content: {
            display: "flex", position: 'relative', width: "16rem", height: "26rem",
            border: "0.5px solid #D8E1C47F", borderRadius: "15px",
            marginLeft: "auto", marginRight: "auto", cursor: 'pointer',
            transition: 'all 0.5s ease',
        },
        lod_img: {
            borderRadius: "15px", position: "absolute", width: "100%",
            height: "100%", objectFit: "cover", zIndex: "-2"
        },
        lod_content_detail: {
            display: "flex", flexDirection: "column", position: "absolute",
            left: "5%", bottom: "3%", color: "white"
        },
        overlay: {
            borderRadius: "15px", position: "absolute", top: "-2px", left: "-10px", right: "-20px", bottom: "-2px",
            backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: -1,
        },
        popupOverlayStyle: {
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: "1"
        }
    };

    return (
        <div style={styles.lodging_default}>
            <DataFetcher
                fetchCity={1}
                fetchLod={0}
                setCityContents={setCityContents}
                setLodContents={() => {}}
            />


            <div style={styles.lodging_part1}>
                <div ref={mapContainerRef} style={styles.map_view}>
                    <button style={styles.map_btn} onClick={() => setIsOpen(true)}>지도 열기</button>
                    {isOpen && (
                        <div style={styles.popupOverlayStyle}>
                            <MapPopupContent onClose={() => setIsOpen(false)} />
                        </div>
                    )}
                </div>
                <SelectBox
                    cityList={cityContents}
                    onCityChange={(cityName) => {
                        console.log("🏙️ 도시 선택됨:", cityName);
                        setNowTitle(cityName);
                    }}
                />


            </div>

            <div style={styles.lodging_part2}>
                <div style={styles.city_title_view}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <p>"<strong>{nowTitle}</strong>" 지역의 검색결과</p>
                    </div>
                </div>

                <div style={styles.lod_content_view}>
                    {lodContents
                        .filter(lContent =>
                            lContent.lodCity?.trim().toLowerCase() === nowTitle?.trim().toLowerCase()
                        )
                        .map((lContent, index) => (
                            <div
                                key={index}
                                style={{
                                    width: "250px",
                                    border: "1px solid #ccc",
                                    borderRadius: "12px",
                                    overflow: "hidden",
                                    padding: "12px",
                                    backgroundColor: "#fff",
                                    margin: "10px"
                                }}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handleClick(index)}
                            >
                                <img
                                    src={lContent.lodImag}
                                    alt="숙소 이미지"
                                    style={{
                                        width: "100%",
                                        height: "150px",
                                        objectFit: "cover",
                                        marginBottom: "8px",
                                        borderRadius: "8px"
                                    }}
                                />
                                <p><strong>숙소명:</strong> {lContent.lodName}</p>
                                <p><strong>도시:</strong> {lContent.lodCity}</p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default CityLodging;
