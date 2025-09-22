import React, { useState, useEffect, useRef } from "react";
import {
    GoogleMap,
    Marker,
    InfoWindow,
    useJsApiLoader,
} from "@react-google-maps/api";

const MapPopupContent = ({ onClose, lodContents = [] }) => {
    const [lodMarkers, setLodMarkers] = useState([]);
    const [selectedLod, setSelectedLod] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 37.5665, lng: 126.978 }); // 기본 중심
    const mapRef = useRef(null);

    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    // lodContents → 좌표 변환
    useEffect(() => {
        if (!isLoaded || !window.google || lodContents.length === 0) return;

        const geocoder = new window.google.maps.Geocoder();
        const fetchCoords = async () => {
            const results = [];
            for (const lod of lodContents) {
                if (!lod.lodLocation) continue;
                try {
                    const { results: geoResults, status } = await new Promise(
                        (resolve) =>
                            geocoder.geocode(
                                { address: lod.lodLocation },
                                (res, status) => resolve({ results: res, status })
                            )
                    );
                    if (status === "OK" && geoResults.length > 0) {
                        const location = geoResults[0].geometry.location;
                        results.push({
                            ...lod,
                            lat: location.lat(),
                            lng: location.lng(),
                        });
                    } else {
                        console.warn(`❌ 주소 변환 실패: ${lod.lodLocation}, status: ${status}`);
                    }
                } catch (err) {
                    console.error("Geocoding error:", err);
                }
            }
            setLodMarkers(results);

            // 첫 마커가 있으면 초기 중심으로 설정
            if (results.length > 0) setMapCenter({ lat: results[0].lat, lng: results[0].lng });
        };
        fetchCoords();
    }, [lodContents, isLoaded]);

    const containerStyle = { width: "100%", height: "100%" };

    const modalStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        padding: "20px",
        boxSizing: "border-box",
    };

    const contentStyle = {
        width: "100%",
        maxWidth: "1000px",
        height: "600px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        display: "flex",
        overflow: "hidden",
        boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        position: "relative",
    };

    const menuStyle = {
        width: "250px",
        backgroundColor: "#f5f5f5",
        padding: "16px",
        overflowY: "auto",
        borderRight: "1px solid #ddd",
    };

    const closeBtnStyle = {
        position: "absolute",
        top: "12px",
        right: "12px",
        backgroundColor: "#e74c3c",
        color: "#fff",
        border: "none",
        borderRadius: "50%",
        width: "36px",
        height: "36px",
        fontSize: "18px",
        cursor: "pointer",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001,
    };

    // 메뉴 클릭 시
    const handleMenuClick = (lod) => {
        setSelectedLod(lod);
        setMapCenter({ lat: lod.lat, lng: lod.lng }); // 중심 갱신
        mapRef.current?.panTo({ lat: lod.lat, lng: lod.lng });
        mapRef.current?.setZoom(15); // 확대
    };

    if (!isLoaded) return <div>구글 지도를 불러오는 중...</div>;

    return (
        <div style={modalStyle}>
            <div style={contentStyle}>
                {/* 좌측 메뉴 */}
                <div style={menuStyle}>
                    <h3>숙소 목록</h3>
                    {lodMarkers.length === 0 && <p>숙소가 없습니다.</p>}
                    {lodMarkers.map((lod) => (
                        <div
                            key={lod.lodId}
                            style={{
                                padding: "8px",
                                marginBottom: "8px",
                                borderRadius: "6px",
                                backgroundColor: selectedLod?.lodId === lod.lodId ? "#3498db" : "#fff",
                                color: selectedLod?.lodId === lod.lodId ? "#fff" : "#333",
                                cursor: "pointer",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            }}
                            onClick={() => handleMenuClick(lod)}
                        >
                            {lod.lodName}
                        </div>
                    ))}
                </div>

                {/* 구글 지도 */}
                <div style={{ flex: 1, position: "relative" }}>
                    <button onClick={onClose} style={closeBtnStyle}>×</button>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={mapCenter} // 항상 현재 중심 유지
                        zoom={selectedLod ? 15 : 12}
                        onLoad={(map) => (mapRef.current = map)}
                    >
                        {lodMarkers.map((lod) => (
                            <Marker
                                key={lod.lodId}
                                position={{ lat: lod.lat, lng: lod.lng }}
                                onClick={() => {
                                    setSelectedLod(lod);
                                    setMapCenter({ lat: lod.lat, lng: lod.lng }); // 클릭 시 중심 갱신
                                    mapRef.current?.setZoom(15);
                                }}
                            />
                        ))}

                        {selectedLod && (
                            <InfoWindow
                                position={{ lat: selectedLod.lat, lng: selectedLod.lng }}
                                onCloseClick={() => setSelectedLod(null)} // 닫아도 중심 유지
                            >
                                <div style={{ maxWidth: "220px" }}>
                                    <strong>{selectedLod.lodName}</strong>
                                    <br />
                                    위치: {selectedLod.lodLocation}
                                    <br />
                                    <img
                                        src={selectedLod.lodImage || "https://via.placeholder.com/200x100?text=No+Image"}
                                        alt={selectedLod.lodName}
                                        style={{ width: "100%", marginTop: "5px", borderRadius: "4px" }}
                                    />
                                </div>
                            </InfoWindow>
                        )}
                    </GoogleMap>
                </div>
            </div>
        </div>
    );
};

export default MapPopupContent;
