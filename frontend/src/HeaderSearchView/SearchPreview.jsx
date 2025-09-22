import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SearchPreview = ({ searchResults, searchQuery }) => {
    const navigate = useNavigate();

    return (
        <PreviewDropdown>
            <PreviewBox>
                <Title>검색어 "{searchQuery}" 결과</Title>

                {searchResults.length === 0 ? (
                    <EmptyMessage>검색 결과가 없습니다.</EmptyMessage>
                ) : (
                    searchResults.map((city) => (
                        <CitySection key={city.cityName}>
                            <CityName>{city.cityName}</CityName>

                            {city.hotels.map((hotel, idx) => (
                                <HotelCard key={idx}>
                                    <HotelImage src={hotel.lodImag} alt={hotel.lodName} />
                                    <HotelInfo>
                                        <HotelName
                                            onClick={() =>
                                                navigate(`/hotelDetail?name=${encodeURIComponent(hotel.lodName)}`)
                                            }
                                        >
                                            {hotel.lodName}
                                        </HotelName>
                                        <RoomsContainer>
                                            {hotel.roomImages?.map((roomImg, i) => (
                                                <RoomImage
                                                    key={i}
                                                    src={roomImg}
                                                    alt={`${hotel.lodName} 방 이미지`}
                                                />
                                            ))}
                                            <RoomName>
                                                {hotel.roomName ? `방: ${hotel.roomName}` : ""}
                                            </RoomName>
                                        </RoomsContainer>
                                    </HotelInfo>
                                </HotelCard>
                            ))}
                        </CitySection>
                    ))
                )}
            </PreviewBox>
        </PreviewDropdown>
    );
};

// ===============================
// 스타일
// ===============================
const PreviewDropdown = styled.div`
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 1000;
`;

const PreviewBox = styled.div`
    width: 95%;
    max-width: 1000px;
    max-height: 600px;
    overflow-y: auto;
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
`;

const Title = styled.h3`
    margin-bottom: 15px;
`;

const EmptyMessage = styled.p`
    text-align: center;
    color: #555;
`;

const CitySection = styled.div`
    margin-bottom: 25px;
`;

const CityName = styled.h4`
    font-size: 1.3rem;
    font-weight: bold;
    margin-bottom: 10px;
    border-bottom: 1px solid #eee;
    padding-bottom: 5px;
`;

const HotelCard = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
    padding: 10px;
    background: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: transform 0.2s ease;
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
`;

const HotelImage = styled.img`
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
`;

const HotelInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const HotelName = styled.h5`
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 5px;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
        color: #ff5722;
    }
`;

const RoomsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin-top: 5px;
`;

const RoomImage = styled.img`
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 5px;
`;

const RoomName = styled.p`
    font-size: 0.85rem;
    color: #555;
    margin-top: 5px;
`;

export default SearchPreview;
