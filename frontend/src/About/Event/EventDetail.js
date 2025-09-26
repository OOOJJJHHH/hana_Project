import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
    // --- 1. 주소에서 정보 얻기 ---
    // 기존: const { id } = useParams();
    // ⭐️ 수정: 주소의 일부로 ID 대신 '제목(title)'을 사용합니다.
    const { title } = useParams();
    const navigate = useNavigate();

    // --- 2. 데이터 보관 상자 준비하기 (useState) ---
    const [eventInfo, setEventInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // --- 3. 백엔드에 데이터 요청하기 (useEffect) ---
    useEffect(() => {
        // 기존: if (!id) return;
        // ⭐️ 수정: title 값이 없으면 실행하지 않습니다.
        if (!title) return;

        const fetchEventInfo = async () => {
            try {
                // ⭐️ 수정: 백엔드에 "제목에 해당하는 이벤트 정보를 주세요"라고 요청합니다.
                // 경로가 /getEvent/:title 로 변경되었습니다.
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/getEvent/${title}`
                );

                setEventInfo(response.data);
                console.log("✅ 이벤트 상세 정보 수신 성공:", response.data);

            } catch (error) {
                console.error("❌ 이벤트 상세 정보를 불러오는 데 실패했습니다:", error);
                alert("이벤트 정보를 불러오는 데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEventInfo();
        // ⭐️ 수정: 의존성 배열을 [title]로 변경합니다. title 값이 바뀔 때마다 함수를 다시 실행합니다.
    }, [title]);

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