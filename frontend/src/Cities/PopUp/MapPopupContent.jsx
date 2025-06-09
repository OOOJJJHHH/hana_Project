import React, { useEffect } from 'react';
const { kakao } = window;

function MapPopupContent({ onClose, lodContents = [] }) {
    useEffect(() => {
        // 1. 지도를 표시할 DOM 요소
        const container = document.getElementById("map");

        // 2. 지도 기본 옵션 (중심 위치: 서울, 확대 수준: 7)
        const options = {
            center: new kakao.maps.LatLng(37.5665, 126.9780),
            level: 7,
        };

        // 3. 지도 생성
        const map = new kakao.maps.Map(container, options);

        // 4. 모든 마커를 포함할 수 있도록 지도 영역을 확장하는 객체 생성
        const bounds = new kakao.maps.LatLngBounds();

        // 5. 주소 → 좌표 변환을 위한 geocoder 생성
        const geocoder = new kakao.maps.services.Geocoder();

        // 6. lodContents 배열에 있는 각 숙소 정보에 대해 마커 생성
        lodContents.forEach((lod) => {
            // lodLocation이 없으면 스킵
            if (!lod.lodLocation) return;

            // lodLocation(주소)를 좌표로 변환
            geocoder.addressSearch(lod.lodLocation, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    // 변환된 좌표 정보
                    const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                    // 변환된 좌표로 마커 생성
                    const marker = new kakao.maps.Marker({
                        map: map,
                        position: coords,
                    });

                    // 마커 클릭 시 표시될 정보창 (인포윈도우) 생성
                    const infowindow = new kakao.maps.InfoWindow({
                        content: `
                            <div style="padding:10px;font-size:14px;">
                                <strong>${lod.lodName}</strong><br/>
                                위치: ${lod.lodLocation}
                            </div>
                        `
                    });

                    // 마커 클릭 시 인포윈도우 열기
                    kakao.maps.event.addListener(marker, 'click', () => {
                        infowindow.open(map, marker);
                    });

                    // 지도 범위에 현재 마커의 좌표 포함
                    bounds.extend(coords);
                    map.setBounds(bounds); // 모든 마커가 보이도록 지도 영역 조정
                } else {
                    console.warn(`❌ 주소 변환 실패: ${lod.lodLocation}`);
                }
            });
        });

        // 7. 사용자가 지도 클릭 시 핑 찍기 기능

        let clickMarker = null; // 클릭한 위치의 마커 저장용 변수 (단일 마커)

        // 지도 클릭 이벤트 등록
        kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
            const clickPosition = mouseEvent.latLng; // 클릭한 좌표

            if (clickMarker) {
                // 이전에 클릭한 마커가 있다면 위치만 이동
                clickMarker.setPosition(clickPosition);
            } else {
                // 없으면 새로 마커 생성
                clickMarker = new kakao.maps.Marker({
                    map: map,
                    position: clickPosition,
                });
            }

            // 클릭한 위치로 지도 중심 이동
            map.panTo(clickPosition);
        });

    }, [lodContents]); // lodContents 변경 시 useEffect 다시 실행

    return (
        <div style={popupContentStyle}>
            {/* 지도 렌더링 영역 */}
            <div id="map" style={{ width: "100%", height: "32rem" }}></div>

            {/* 닫기 버튼 */}
            <button onClick={onClose} style={closeButtonStyle}>닫기</button>
        </div>
    );
}

// 팝업 전체 스타일 정의
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


// 닫기 버튼 스타일 정의
const closeButtonStyle = {
    marginTop: "10px",
    padding: "8px 16px",
    fontSize: "14px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
};

export default MapPopupContent;
