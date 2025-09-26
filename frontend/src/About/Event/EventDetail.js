import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
    // useParams()는 URL에 담긴 ID 같은 동적인 값을 잡아내는 낚싯대입니다.
    // 예를 들어 주소가 /event/3 이면, id 변수에는 '3'이 담깁니다.
    const { id } = useParams();
    const navigate = useNavigate();

    // 백엔드에서 받아온 이벤트 데이터를 저장할 빈 상자를 준비합니다.
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true); // 데이터를 불러오는 동안 '로딩 중'을 표시하기 위함

    // 이 페이지가 처음 화면에 나타날 때, 딱 한 번만 실행되는 코드입니다.
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // URL에서 잡아온 id를 이용해 백엔드에 "이 ID에 해당하는 이벤트 정보 하나만 주세요!" 라고 요청합니다.
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/getEvent/${id}`);
                setEvent(response.data); // 성공적으로 받아온 데이터를 event 상자에 담습니다.
            } catch (error) {
                console.error("이벤트 상세 정보를 불러오는 데 실패했습니다:", error);
                alert("이벤트 정보를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false); // 데이터 요청이 끝나면 '로딩 중' 표시를 멈춥니다.
            }
        };

        fetchEvent();
    }, [id]); // id 값이 바뀔 때마다 이 코드를 다시 실행하라는 의미입니다.

    // 로딩 중일 때 보여줄 화면
    if (loading) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>데이터를 불러오는 중입니다...</div>;
    }

    // 이벤트를 찾지 못했을 때 보여줄 화면
    if (!event) {
        return <div style={{ textAlign: 'center', padding: '50px' }}>해당 이벤트를 찾을 수 없습니다.</div>;
    }

    // 성공적으로 데이터를 받아왔을 때 보여줄 최종 화면
    return (
        <div className="event-detail-container">
            <h1 className="event-detail-title">{event.title}</h1>
            <p className="event-detail-date">{event.startDate} ~ {event.endDate}</p>
            <div className="event-detail-content">
                <img src={event.imageUrl} alt={event.title} className="event-detail-image" />
                {/* 설명에 포함된 줄바꿈(\n)을 화면에서도 줄바꿈되도록 처리합니다. */}
                <p className="event-detail-description">
                    {event.description}
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
                .event-detail-description { font-size: 18px; color: #555; line-height: 1.8; white-space: pre-wrap; } /* 이 줄 덕분에 \n이 줄바꿈으로 보입니다. */
                .back-to-list-button { display: block; margin: 0 auto; background-color: #6c757d; color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: bold; transition: background-color 0.2s ease; }
                .back-to-list-button:hover { background-color: #5a6268; }
            `}</style>
        </div>
    );
};

export default EventDetail;