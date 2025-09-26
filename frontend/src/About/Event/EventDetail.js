import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
    // --- 1. 주소에서 정보 얻기 ---
    // HotelDetail.js는 주소 뒤에 ?name=... 을 사용해서 useLocation을 썼지만,
    // 우리는 /event/3 처럼 주소의 일부로 ID를 사용하기 때문에 useParams 훅을 사용하는 것이 더 정확하고 현대적인 방식입니다.
    // { id } 변수에는 주소창의 숫자(예: 3)가 자동으로 담깁니다.
    const { id } = useParams();
    const navigate = useNavigate();

    // --- 2. 데이터 보관 상자 준비하기 (useState) ---
    // HotelDetail.js의 'hotelInfo'처럼, 우리도 'eventInfo'라는 상자를 만듭니다.
    // 처음에는 비어있으므로 null(없음) 상태입니다.
    const [eventInfo, setEventInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태를 관리합니다.

    // --- 3. 백엔드에 데이터 요청하기 (useEffect) ---
    // 이 페이지가 처음 화면에 나타날 때, 또는 주소의 id값이 바뀔 때 딱 한 번만 실행됩니다.
    // HotelDetail.js의 fetchHotelInfo 함수와 똑같은 역할을 합니다.
    useEffect(() => {
        // id 값이 없으면 아무것도 실행하지 않습니다.
        if (!id) return;

        const fetchEventInfo = async () => {
            try {
                // 백엔드에 "id에 해당하는 이벤트 정보를 주세요" 라고 GET 방식으로 요청합니다.
                // HotelDetail.js가 호텔 이름을 주소에 담아 보낸 것처럼, 우리도 이벤트 id를 주소에 담아 보냅니다.
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/getEvent/${id}`
                );

                // 성공적으로 데이터를 받으면, eventInfo 상자에 담습니다.
                setEventInfo(response.data);
                console.log("✅ 이벤트 상세 정보 수신 성공:", response.data);

            } catch (error) {
                console.error("❌ 이벤트 상세 정보를 불러오는 데 실패했습니다:", error);
                alert("이벤트 정보를 불러오는 데 실패했습니다.");
            } finally {
                // 데이터 요청이 성공하든 실패하든, 로딩 상태를 종료합니다.
                setIsLoading(false);
            }
        };

        fetchEventInfo(); // 위에서 만든 함수를 실행합니다.
    }, [id]); // id 값이 바뀔 때마다 이 함수를 다시 실행하라는 의미입니다.

    // --- 4. 화면 그리기 (return) ---

    // 로딩 중일 때 보여줄 화면
    if (isLoading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>데이터를 불러오는 중입니다...</div>;
    }

    // 데이터를 못 찾았을 때 보여줄 화면
    if (!eventInfo) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>해당 이벤트를 찾을 수 없습니다.</div>;
    }

    // 성공적으로 데이터를 받아왔을 때 보여줄 최종 화면
    return (
        <div className="event-detail-container">
            <h1 className="event-detail-title">{eventInfo.title}</h1>
            <p className="event-detail-date">{eventInfo.startDate} ~ {eventInfo.endDate}</p>
            <div className="event-detail-content">
                <img src={eventInfo.imageUrl} alt={eventInfo.title} className="event-detail-image" />
                <p className="event-detail-description">
                    {eventInfo.description}
                </p>
            </div>
            <button onClick={() => navigate('/about')} className="back-to-list-button">
                목록으로 돌아가기
            </button>

            <style>{`
                .event-detail-container { padding: 60px 20px; font-family: 'Arial', sans-serif; max-width: 900px; margin: 0 auto; }
                .event-detail-title { text-align: center; font-size: 36px; font-weight: bold; color: #333; margin-bottom: 10px; }
                .event-detail-date { text-align: center; font-size: 16px; color: #888; margin-bottom: 40px; }
                .event-detail-content { background-color: #f9f9f9; border-radius: 16px; padding: 40px; margin: 0 auto; margin-bottom: 40px; }
                .event-detail-image { width: 100%; height: auto; border-radius: 8px; margin-bottom: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .event-detail-description { font-size: 18px; color: #555; line-height: 1.8; white-space: pre-wrap; }
                .back-to-list-button { display: block; margin: 0 auto; background-color: #6c757d; color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background-color 0.2s ease; }
                .back-to-list-button:hover { background-color: #5a6268; }
            `}</style>
        </div>
    );
};

export default EventDetail;