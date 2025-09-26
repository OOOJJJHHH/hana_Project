import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../Session/UserContext';

const EventDetail = () => {
    const { title } = useParams(); // id 대신 title
    const navigate = useNavigate();
    const userInfo = useContext(UserContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/getEventByTitle/${encodeURIComponent(title)}`
                );
                setEvent(res.data);
            } catch (err) {
                console.error('이벤트 불러오기 실패', err);
                alert('이벤트를 불러오는 데 실패했습니다.');
                navigate('/about');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [title, navigate]);

    const handleClose = () => {
        navigate(-1);
    };

    const handleDelete = async () => {
        if (!window.confirm('이 이벤트를 삭제하시겠습니까?')) return;
        try {
            setDeleting(true);
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/deleteEventByTitle/${encodeURIComponent(title)}`
            );
            alert('이벤트가 삭제되었습니다.');
            navigate('/about');
        } catch (err) {
            console.error('삭제 실패', err);
            alert('삭제 중 오류가 발생했습니다.');
        } finally {
            setDeleting(false);
        }
    };

    if (loading)
        return <div style={{ padding: 40, textAlign: 'center' }}>이벤트 정보를 불러오는 중...</div>;

    if (!event)
        return <div style={{ padding: 40, textAlign: 'center' }}>해당 이벤트를 찾을 수 없습니다.</div>;

    return (
        <div className="event-detail-overlay">
            <div className="event-detail-card">
                <button className="close-btn" onClick={handleClose}>
                    ✕
                </button>

                {event.imageUrl && (
                    <div className="img-wrap">
                        <img src={event.imageUrl} alt={event.title} />
                    </div>
                )}

                <div className="detail-content">
                    <h2>{event.title}</h2>
                    <p className="date">
                        {event.startDate} ~ {event.endDate}
                    </p>
                    <p className="description">{event.description}</p>

                    <div className="detail-actions">
                        <button onClick={() => navigate('/about')} className="back-btn">
                            목록으로
                        </button>

                        {userInfo?.uUser === 'admin' && (
                            <>
                                <button
                                    onClick={() =>
                                        navigate(`/create-event?editTitle=${encodeURIComponent(event.title)}`)
                                    }
                                    className="edit-btn"
                                >
                                    수정
                                </button>
                                <button onClick={handleDelete} className="delete-btn" disabled={deleting}>
                                    {deleting ? '삭제중...' : '삭제'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        .event-detail-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.45);
          z-index: 2000;
          padding: 20px;
        }
        .event-detail-card {
          width: 100%;
          max-width: 920px;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 12px 40px rgba(0,0,0,0.25);
          position: relative;
          display: flex;
          flex-direction: column;
          max-height: 90vh;
        }
        .close-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background: transparent;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
        .img-wrap img {
          width: 100%;
          height: 320px;
          object-fit: cover;
        }
        .detail-content {
          padding: 24px;
          overflow: auto;
        }
        .detail-content h2 {
          margin: 0 0 8px;
          font-size: 24px;
          color: #222;
        }
        .detail-content .date {
          font-size: 13px;
          color: #888;
          margin-bottom: 16px;
        }
        .detail-content .description {
          font-size: 15px;
          color: #444;
          line-height: 1.6;
          white-space: pre-line;
        }
        .detail-actions {
          display:flex;
          gap: 12px;
          margin-top: 20px;
        }
        .detail-actions button {
          border: none;
          padding: 10px 18px;
          border-radius: 9999px;
          cursor: pointer;
          font-weight: 600;
        }
        .back-btn { background: #6c757d; color: white; }
        .edit-btn { background: #007bff; color: white; }
        .delete-btn { background: #dc3545; color: white; }
      `}</style>
        </div>
    );
};

export default EventDetail;
