    import React, { useEffect } from 'react';
    const { kakao } = window;

    function MapPopupContent({ onClose }) {
        useEffect(() => {
            const container = document.getElementById("map");

            const options = {
                center: new kakao.maps.LatLng(33.450701, 126.570667),
                level: 3,
            };

            const map = new kakao.maps.Map(container, options);

            let marker = null; // 마커 저장 변수

            // 지도 클릭 이벤트 등록
            kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
                const latlng = mouseEvent.latLng;

                if (marker) {
                    // 마커가 이미 있다면 위치만 옮김
                    marker.setPosition(latlng);
                } else {
                    // 없으면 새로 생성
                    marker = new kakao.maps.Marker({
                        position: latlng,
                        map: map,
                    });
                }
            });
        }, []);

        return (
            <div style={popupContentStyle}>
                {/*지도 불러올 영역*/}
                <div id="map" style={{ width: "100%", height: "32rem" }}></div>
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
        width: '70rem',
        height: "35rem",
        textAlign: 'center',
    };

    export default MapPopupContent;
