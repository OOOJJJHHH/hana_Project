import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// window 전역에서 kakao 객체를 가져옴 (카카오 지도 API)
const { kakao } = window;

function MapPopupContent({ onClose, lodContents = [] }) {
    // 주변 음식점 정보 상태
    const [placesInfo, setPlacesInfo] = useState([]);
    // 페이지 이동 함수 생성 (react-router-dom)
    const navigate = useNavigate();

    // 숙소 이미지가 없을 때 기본 이미지 URL
    const defaultLodImage = "https://via.placeholder.com/250x150?text=No+Image";

    useEffect(() => {
        // 지도 그릴 컨테이너 DOM 얻기
        const container = document.getElementById("map");
        if (!container) return;

        // 지도 생성 옵션: 서울 중심, 줌 레벨 7
        const options = {
            center: new kakao.maps.LatLng(37.5665, 126.978),
            level: 7,
        };

        // 카카오 지도 생성
        const map = new kakao.maps.Map(container, options);
        // 지도에 표시할 좌표 범위 저장용 객체
        const bounds = new kakao.maps.LatLngBounds();
        // 주소-좌표 변환 서비스
        const geocoder = new kakao.maps.services.Geocoder();
        // 장소 검색 서비스
        const ps = new kakao.maps.services.Places();

        // 현재 열려있는 인포윈도우를 저장하기 위한 변수
        let currentInfoWindow = null;

        // 주어진 좌표 기준 반경 500m 이내 음식점 검색 (최대 5개)
        const searchNearbyFoods = (coords) => {
            ps.categorySearch(
                "FD6", // 음식점 카테고리 코드
                (data, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        const geometry = kakao.maps.geometry;

                        // 좌표간 거리 계산 가능 여부 확인
                        if (!geometry || !geometry.spherical) {
                            // 거리 계산 못 하면 그냥 최대 5개만 보여줌
                            setPlacesInfo(data.slice(0, 5));
                            return;
                        }

                        // 반경 500m 이내 음식점 필터링
                        const nearbyPlaces = data.filter((place) => {
                            const placePos = new kakao.maps.LatLng(place.y, place.x);
                            const distance = geometry.spherical.computeDistanceBetween(
                                coords,
                                placePos
                            );
                            return distance <= 500;
                        });

                        // 최대 5개 음식점 상태 저장
                        setPlacesInfo(nearbyPlaces.slice(0, 5));
                    } else {
                        // 검색 실패 시 빈 배열로 초기화
                        setPlacesInfo([]);
                    }
                },
                {
                    location: coords,
                    radius: 500,
                }
            );
        };

        // lodContents 배열(숙소 목록) 순회하며 마커 및 인포윈도우 생성
        lodContents.forEach((lod) => {
            if (!lod.lodLocation) return; // 위치 정보 없으면 건너뜀

            // 숙소 주소 -> 좌표 변환
            geocoder.addressSearch(lod.lodLocation, (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                    // 숙소 위치에 마커 생성
                    const marker = new kakao.maps.Marker({
                        map,
                        position: coords,
                    });

                    // 인포윈도우 내용: 숙소명, 위치, 이미지(없으면 기본 이미지)
                    const infowindow = new kakao.maps.InfoWindow({
                        content: `
              <div style="padding:10px;font-size:14px; max-width:250px;">
                <a href="#" id="lod-name-${lod.lodId}" style="font-weight:bold; color:#0078ff; text-decoration:none;">
                  ${lod.lodName}
                </a><br/>
                위치: ${lod.lodLocation}<br/>
                <img src="${lod.lodImage || defaultLodImage}" alt="${lod.lodName}" style="width:100%; margin-top:8px; border-radius:4px;" />
              </div>
            `,
                    });

                    // 마커 클릭 이벤트
                    kakao.maps.event.addListener(marker, "click", () => {
                        // 기존 인포윈도우가 열려있으면 닫기
                        if (currentInfoWindow) currentInfoWindow.close();
                        // 클릭한 마커에 인포윈도우 열기
                        infowindow.open(map, marker);
                        currentInfoWindow = infowindow;

                        // 인포윈도우 내 숙소명 링크 클릭 이벤트 등록 (비동기 처리)
                        setTimeout(() => {
                            const lodNameLink = document.getElementById(`lod-name-${lod.lodId}`);
                            if (lodNameLink) {
                                lodNameLink.onclick = (e) => {
                                    e.preventDefault(); // 기본 링크 이동 막기
                                    // 상세 페이지로 네비게이트
                                    navigate(`/lodDetail/${lod.lodId}`);
                                };
                            }
                        }, 100);

                        // 클릭한 숙소 위치 기준 주변 음식점 검색
                        searchNearbyFoods(coords);
                    });

                    // 지도 영역에 이 좌표 포함시키기
                    bounds.extend(coords);
                    map.setBounds(bounds);
                } else {
                    console.warn(`❌ 주소 변환 실패: ${lod.lodLocation}`);
                }
            });
        });

        // 지도 빈 공간 클릭 시 마커 찍고 주변 음식점 검색 처리
        let clickMarker = null; // 클릭 마커 변수
        let clickInfoWindow = null; // 클릭 인포윈도우 변수

        kakao.maps.event.addListener(map, "click", function (mouseEvent) {
            const clickPosition = mouseEvent.latLng;

            // 기존 마커 위치 갱신 또는 새 마커 생성
            if (clickMarker) {
                clickMarker.setPosition(clickPosition);
            } else {
                clickMarker = new kakao.maps.Marker({
                    map,
                    position: clickPosition,
                });
            }

            // 클릭 좌표 -> 주소 변환 (역지오코딩)
            geocoder.coord2Address(
                clickPosition.getLng(),
                clickPosition.getLat(),
                (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        // 주소 정보 및 지역 정보 얻기
                        const address = result[0].address.address_name || "주소 정보 없음";
                        const region =
                            (result[0].region_1depth_name || "") +
                            " " +
                            (result[0].region_2depth_name || "");

                        // 인포윈도우 내용
                        const content = `
              <div style="padding:10px; font-size:14px;">
                <strong>클릭 위치 정보</strong><br/>
                주소: ${address}<br/>
                지역: ${region}
              </div>
            `;

                        // 기존 인포윈도우 닫고 새로 열기
                        if (clickInfoWindow) clickInfoWindow.close();
                        clickInfoWindow = new kakao.maps.InfoWindow({ content });
                        clickInfoWindow.open(map, clickMarker);

                        // 클릭 위치 주변 음식점 검색
                        searchNearbyFoods(clickPosition);
                    } else {
                        console.warn("역지오코딩 실패");
                        setPlacesInfo([]); // 음식점 목록 초기화
                    }
                }
            );

            // 클릭 위치로 지도 중심 이동
            map.panTo(clickPosition);
        });
    }, [lodContents, navigate]); // lodContents, navigate 바뀔 때마다 재실행

    return (
        <div style={popupContentStyle}>
            <div style={mapAndPlacesWrapper}>
                {/* 지도 영역 */}
                <div id="map" style={mapStyle}></div>

                {/* 주변 음식점 목록 */}
                <div style={placesListStyle}>
                    <h4>클릭 위치 주변 음식점 (최대 5개)</h4>
                    {placesInfo.length === 0 && <div>주변 음식점 정보가 없습니다.</div>}
                    <ul style={{ paddingLeft: 20, marginTop: 8 }}>
                        {placesInfo.map((place) => (
                            <li
                                key={place.id}
                                style={{
                                    marginBottom: 12,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                {/* 음식점 썸네일 이미지 */}
                                <img
                                    src={
                                        place.thumbnail ||
                                        "https://via.placeholder.com/60x60?text=No+Image"
                                    }
                                    alt={place.place_name}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        objectFit: "cover",
                                        marginRight: 10,
                                        borderRadius: 4,
                                    }}
                                />
                                {/* 음식점 이름, 주소, 상세보기 링크 */}
                                <div style={{ flex: 1 }}>
                                    <strong>{place.place_name}</strong>
                                    <br />
                                    {place.road_address_name || place.address_name}
                                    <br />
                                    <a
                                        href={place.place_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ fontSize: 12, color: "#0078ff" }}
                                    >
                                        상세보기
                                    </a>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* 닫기 버튼 영역 */}
            <div style={buttonWrapperStyle}>
                <button onClick={onClose} style={closeButtonStyle}>
                    닫기
                </button>
            </div>
        </div>
    );
}

// 전체 팝업 스타일: 중앙 정렬, 흰 배경, 그림자, 최대 너비 70rem, 높이 90vh
const popupContentStyle = {
    position: "relative",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "70rem",
    height: "90vh",
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    overflow: "hidden",
};

// 지도와 음식점 리스트 묶음 스타일 - 세로 방향 플렉스박스, 공간 꽉 채움
const mapAndPlacesWrapper = {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    overflow: "hidden",
};

// 지도 스타일 - 너비 100%, 높이 최소 250px, flexBasis 100% (부모 컨테이너 내 차지하는 높이)
const mapStyle = {
    width: "100%",
    flexBasis: "100%", // 화면 높이 100% 차지 (필요시 조절 가능)
    minHeight: "250px",
};

// 음식점 리스트 스타일 - 최대 높이 40%, 스크롤 가능, 왼쪽 정렬
const placesListStyle = {
    marginTop: 12,
    maxHeight: "40%",
    overflowY: "auto",
    textAlign: "left",
    fontSize: 14,
    color: "#333",
};

// 버튼 래퍼 - 아래쪽 공간 띄우고 가운데 정렬
const buttonWrapperStyle = {
    marginTop: 15,
    flexShrink: 0,
    display: "flex",
    justifyContent: "center",
};

// 닫기 버튼 스타일 - 검은 배경, 흰색 글자, 둥근 모서리, 포인터 커서
const closeButtonStyle = {
    padding: "8px 16px",
    fontSize: "14px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
};

export default MapPopupContent;
