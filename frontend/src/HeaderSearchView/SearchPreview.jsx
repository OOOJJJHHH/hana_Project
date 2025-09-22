import React from "react";
import { useNavigate } from "react-router-dom";

const SearchPreview = ({ searchResults, searchQuery }) => {
    const navigate = useNavigate();

    const handleHotelClick = (hotelName) => {
        navigate(`/hotel-detail?name=${encodeURIComponent(hotelName)}`);
    };

    // ===== 인라인 스타일 객체 =====
    const styles = {
        previewDropdown: {
            position: "absolute",
            top: "50px",
            left: 0,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            zIndex: 1000,
        },
        previewBox: {
            width: "100%",
            maxWidth: "1200px",
            background: "#fafafa",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            maxHeight: "700px",
            overflowY: "auto",
        },
        searchHeader: {
            marginBottom: "15px",
        },
        searchTitle: {
            fontSize: "1.2rem",
            fontWeight: "bold",
        },
        highlight: {
            color: "#ff5722",
        },
        noResult: {
            textAlign: "center",
            color: "red",
            fontWeight: "bold",
        },
        resultContainer: {
            display: "flex",
            flexDirection: "column",
            gap: "25px",
        },
        citySection: {
            display: "flex",
            flexDirection: "column",
            gap: "15px",
        },
        cityName: {
            fontSize: "1.2rem",
            fontWeight: "700",
            color: "#333",
            borderBottom: "2px solid #ff5722",
            paddingBottom: "5px",
        },
        hotelCard: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            padding: "12px",
            background: "white",
            borderRadius: "10px",
            border: "1px solid #ddd",
        },
        hotelHeader: {
            display: "flex",
            alignItems: "center",
            gap: "15px",
            cursor: "pointer",
        },
        hotelImageWrapper: {
            flex: "0 0 120px",
            height: "100px",
            overflow: "hidden",
            borderRadius: "8px",
        },
        hotelImage: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
        },
        hotelInfo: {
            display: "flex",
            flexDirection: "column",
        },
        hotelTitle: {
            fontSize: "1rem",
            fontWeight: 600,
        },
        roomsContainer: {
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginTop: "10px",
        },
        roomCard: {
            width: "180px",
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #ccc",
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            cursor: "pointer",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
        },
        roomCardHover: {
            transform: "translateY(-3px)",
            boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
        },
        roomMainImageWrapper: {
            width: "100%",
            height: "100px",
            overflow: "hidden",
            borderRadius: "6px",
        },
        roomMainImage: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
        },
        roomImagesScroll: {
            display: "flex",
            gap: "5px",
            overflowX: "auto",
        },
        roomImageThumb: {
            width: "50px",
            height: "50px",
            borderRadius: "4px",
            objectFit: "cover",
            flexShrink: 0,
        },
        roomName: {
            fontWeight: 600,
            fontSize: "0.9rem",
        },
        roomPrice: {
            fontSize: "0.85rem",
            color: "gray",
        },
    };

    return (
        <div style={styles.previewDropdown}>
            <div style={styles.previewBox}>
                <div style={styles.searchHeader}>
                    <h3 style={styles.searchTitle}>
                        현재 입력한 "<span style={styles.highlight}>{searchQuery}</span>"에 대한 검색 결과
                    </h3>
                </div>

                {searchResults.length === 0 ? (
                    <p style={styles.noResult}>검색 결과가 없습니다.</p>
                ) : (
                    <div style={styles.resultContainer}>
                        {searchResults.map((city, idx) => (
                            <div key={idx} style={styles.citySection}>
                                <h4 style={styles.cityName}>{city.cityName}</h4>
                                {city.hotels.map((hotel) => (
                                    <div key={hotel.lodName} style={styles.hotelCard}>
                                        <div
                                            style={styles.hotelHeader}
                                            onClick={() => handleHotelClick(hotel.lodName)}
                                        >
                                            <div style={styles.hotelImageWrapper}>
                                                <img src={hotel.lodImag} alt={hotel.lodName} style={styles.hotelImage} />
                                            </div>
                                            <div style={styles.hotelInfo}>
                                                <h5 style={styles.hotelTitle}>{hotel.lodName}</h5>
                                                <p style={{ fontSize: "0.85rem", color: "gray" }}>
                                                    객실 수: {hotel.rooms.length}개
                                                </p>
                                            </div>
                                        </div>
                                        <div style={styles.roomsContainer}>
                                            {hotel.rooms.map((room) => (
                                                <div
                                                    key={room.roomId}
                                                    style={styles.roomCard}
                                                    onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.roomCardHover)}
                                                    onMouseOut={(e) => Object.assign(e.currentTarget.style, { transform: "none", boxShadow: "none" })}
                                                >
                                                    <div style={styles.roomMainImageWrapper}>
                                                        {room.roomImages[0] && (
                                                            <img
                                                                src={room.roomImages[0].imageKey}
                                                                alt={room.roomName}
                                                                style={styles.roomMainImage}
                                                            />
                                                        )}
                                                    </div>
                                                    <span style={styles.roomName}>{room.roomName}</span>
                                                    {room.price && <span style={styles.roomPrice}>{room.price.toLocaleString()}원</span>}
                                                    {/* 이미지 여러 장 수평 스크롤 */}
                                                    {room.roomImages.length > 1 && (
                                                        <div style={styles.roomImagesScroll}>
                                                            {room.roomImages.slice(1).map((img, i) => (
                                                                <img key={i} src={img.imageKey} alt={room.roomName} style={styles.roomImageThumb} />
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPreview;
