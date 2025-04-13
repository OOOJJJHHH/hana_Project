import React, {useRef, useEffect, useState} from 'react';
import SelectBox from "./Custom/SelectBox";
import DataFetcher from "../dbLogic/DataFetcher";
import MapPopupContent from "./PopUp/MapPopupContent";


const CityLodging = () => {

    const [cityContents, setcityContents] = useState([]);
    const [lodContents, setlodContents] = useState([]);
    
    //현재 선택되어있는 도시의 이름을 지정해줌
    const [nowTitle, setNowTitle] = useState('');
    useEffect(() => {
        cityContents.forEach((cContent) => {
            if (cContent.cityState == 1) {
                setNowTitle(cContent.cityName); // state가 1일 경우 nowTitle에 값 할당
            }
        });
    }, [cityContents]);

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = (index) => {
        setIsHovered(index);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleClick = (index) => {
        alert(`${index}를 클릭했습니다!`);
    };


    //Css 설정 부분 ==============================
    //전체적인 영역의 크기
    const lodging_default = {
        padding: '10px',
        display: "flex",
        flexDirection: "rows",
        width: "75rem",
    };

    //왼쪽 영역 =================================
    const lodging_part1 = {
        width: "15rem",
        marginRight: "1rem",
        display: "flex",
        flexDirection: "column",
    };

    const map_view = {
        width: "200px",
        height: "150px",
        borderRadius: "30px",
        alignSelf: 'center',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: 'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs8dhlFDMlZiSIpteHpCPxCwl9GKducDzF_g&s")',  // 여기에 이미지 URL을 넣으세요
        backgroundSize: 'cover',  // 배경 이미지 크기를 버튼에 맞게 설정
    };

    const map_btn = {
        width: "4rem",
        height: "2rem",
        border: "none",
        borderRadius: "7px",
        backgroundColor: "white",
        cursor: "pointer",
        fontSize: "12px"
    };
    
    //오른쪽 영역 =================================
    const lodging_part2 = {
        width: "80%",
    };

    
    const city_title_view = {
        fontSize: "30px",
        border: "1px solid black"
    };
    
    //카드 형식의 내용들이 보여지는 영역의 크기
    const lod_content_view = {
        display: "flex",
        flexDirection: "rows",
        marginTop: "5%",
        flexWrap: 'wrap',  // 아이템이 넘칠 경우 다음 줄로 넘어가게 설정
        gap: '30px',       // 아이템 간의 간격을 설정
    };

    //카드 형태로 보여주기 위한 div의 css
    const lod_content = {
        display: "flex",
        position: 'relative',
        width: "16rem",
        height: "26rem",
        border: "0.5px solid #D8E1C47F",
        borderRadius: "15px",
        marginLeft: "auto",
        marginRight: "auto",
        cursor: 'pointer',
        transition: 'all 0.5s ease',  // 효과가 부드럽게 적용되도록 transition 추가
    };
    
    //배경 이미지의 위치와 크기 조절
    const lod_img = {
        borderRadius: "15px",
        position: "absolute",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: "-2"
    };

    // 상세 내용을 보여주는 p태그를 위한 css
    const lod_content_detail = {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        left: "5%",
        bottom: "3%",
        color: "white"
    };

    //텍스트 잘 보이게 하기 위한 div의 css
    const overlay = {
        borderRadius: "15px",
        position: "absolute",
        top: "-2px",
        left: "-10px",
        right: "-20px",
        bottom: "-2px",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // 검정색 반투명 오버레이
        zIndex: -1, // 오버레이가 이미지 위에 위치하지 않도록 설정
    };

    const mapContainerRef = useRef(null); // map div 요소를 참조할 ref 생성

    useEffect(() => {
        // 카카오 맵 API가 로드되면 지도 생성
        const script = document.createElement("script");

        // .env에서 API 키를 가져와서 URL에 포함
        const apiKey = process.env.REACT_APP_KAKAO_MAP_API_KEY;

        // 카카오 맵 API 스크립트 URL
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}`;
        script.async = true;

        // 스크립트 로드 완료 후 실행될 콜백 함수
        script.onload = () => {
            const options = {
                center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도 중심 좌표
                level: 3, // 지도 레벨
            };

            // 카카오 맵 생성
            new window.kakao.maps.Map(mapContainerRef.current, options);
        };

        // 스크립트를 body에 추가하여 로드
        document.body.appendChild(script);
        //
        // 컴포넌트가 언마운트될 때 스크립트 제거
        return () => {
            document.body.removeChild(script);
        };
    }, []); // 빈 배열을 넣어서 최초 렌더링 시에만 실행되게 함


    const [isOpen, setIsOpen] = useState(false);

    // 팝업창 열기
    const openPopup = () => setIsOpen(true);

    // 팝업창 닫기
    const closePopup = () => setIsOpen(false);

    // 팝업 오버레이 스타일
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

    return (
        <div style={lodging_default}>

            <DataFetcher
                fetchCity={1}
                fetchLod={1}
                setCityContents={setcityContents}
                setLodContents={setlodContents}
            />


            <div style={lodging_part1}>
                <div
                    ref={mapContainerRef}
                    style={map_view}
                >
                    <button style={map_btn} onClick={openPopup}>지도 열기</button>
                    {isOpen && (
                        <div style={popupOverlayStyle}>
                            <MapPopupContent onClose={closePopup} />
                        </div>
                    )}
                </div>
                <div >
                    <SelectBox />
                </div>
            </div>

            <div style={lodging_part2}>

                <div  style={city_title_view}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <p>"<strong>{nowTitle}</strong>" 지역의 검색결과</p>
                    </div>
                </div>

                <div style={lod_content_view}>
                    {
                        lodContents.map((lContent, index) => (
                            lContent.lodCity === nowTitle ? (
                                <div
                                    style={{
                                        ...lod_content,
                                        transform: isHovered === index ? 'scale(1.1)' : 'scale(1.0)',
                                        boxShadow: isHovered === index
                                            ? '0px 4px 15px rgba(0, 0, 0, 0.3)'  // 마우스를 올렸을 때 그림자
                                            : 'none'  // 마우스를 뗐을 때 그림자 없음
                                    }}// 해당 div에만 회전 효과 적용
                                    onMouseEnter={() => handleMouseEnter(index)}   // 마우스 올릴 때
                                    onMouseLeave={handleMouseLeave}   // 마우스 내릴 때
                                    onClick={() => handleClick(index)}
                                    key={index}
                                >
                                    <div style={lod_content_detail}>
                                        <div style={overlay}></div>
                                        <p>숙소 이름 : {lContent.lodName}</p>
                                        <p>숙소 위치 : {lContent.lodPrice} / (원)</p>
                                    </div>
                                    <img src={lContent.lodImag} style={lod_img}/>
                                </div>
                            ) : null
                        ))
                    }
                </div>

            </div>





        </div>
    );
};

export default CityLodging;




// useEffect(() => {
//
//     const getFunction = async () => {
//         try {
//             const cityresponse = await axios.get("http://localhost:8080/getCity");
//             setcityContents(cityresponse.data);
//
//             const lodresponse = await axios.get("http://localhost:8080/getLod");
//             setcityContents(lodresponse.data);
//
//         } catch (error) {
//             console.log("정보 가져오기 오류 : ", error);
//         }
//     };
//
//     getFunction();
//
// }, []);