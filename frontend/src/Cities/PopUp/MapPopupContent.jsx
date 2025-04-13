// MapPopupContent.js
import React, {useEffect} from 'react';
const {kakao} = window;

function MapPopupContent({ onClose }) {

    useEffect(() => {
        const container = document.getElementById("map");

        const options = {
            center : new kakao.maps.LatLng(33.450701, 126.570667),
            level: 3
        };

        const map = new kakao.maps.Map(container, options);
    }, []);

    return (
        <div style={popupContentStyle}>
            {/*지도 불러올 영역*/}

            <div id="map" style={{width: "100%", height: "32rem"}}>
            </div>

            <button onClick={onClose}>닫기</button>
        </div>
    );
}

// 팝업창 내용 스타일
const popupContentStyle = {
    position: "relative",
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '70rem', // 크기 지정
    height: "35rem",
    textAlign: 'center',
};

export default MapPopupContent;
