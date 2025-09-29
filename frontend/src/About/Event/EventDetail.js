import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../Session/UserContext';

const EventDetail = () => {
    const { title } = useParams();
    const navigate = useNavigate();
    const userInfo = useContext(UserContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [togglingBanner, setTogglingBanner] = useState(false); // 메인배너 토글 상태

    // 이벤트 상세 정보 조회
    useEffect(() => {
        const fetchEvent = async () => {
            const encodedTitle = encodeURIComponent(title);
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/getEventByTitle/${encodedTitle}`
                );
                setEvent(res.data);
            } catch (err) {
                console.error('이벤트 불러오기 실패:', err);
                alert('이벤트를 불러오는 데 실패했거나 해당 이벤트가 존재하지 않습니다.');
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

    // 이벤트 삭제
    const handleDelete = async () => {
        if (!window.confirm('이 이벤트를 정말 삭제하시겠습니까?')) return;

        try {
            setDeleting(true);
            const encodedTitle = encodeURIComponent(title);
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/deleteEventByTitle/${encodedTitle}`
            );
            alert('이벤트가 성공적으로 삭제되었습니다.');
            navigate('/about');
        } catch (error) {
            console.error('이벤트 삭제 실패:', error);
            alert('이벤트 삭제에 실패했습니다. 서버 오류를 확인해주세요.');
        } finally {
            setDeleting(false);
        }
    };

    // 메인배너 토글
    const handleToggleBanner = async () => {
        if (!event) return;

        try {
            setTogglingBanner(true);
            const encodedTitle = encodeURIComponent(event.title);

            // true/false만 보내서 저장
            const res = await axios.put(
                `${process.env.REACT_APP_API_URL}/updateMainBanner/${encodedTitle}`,
                { mainBanner: !event.mainBanner } // O → true, X → false
            );

            setEvent(res.data); // 변경된 값 반영
        } catch (err) {
            console.error('메인배너 변경 실패:', err);
            alert('메인배너 변경에 실패했습니다.');
        } finally {
            setTogglingBanner(false);
        }
    };


    if (loading) {
        return <div className="detail-modal"><p>이벤트 정보를 불러오는 중...</p></div>;
    }

    if (!event) {
        return <div className="detail-modal"><p>이벤트가 존재하지 않거나, 불러올 수 없습니다.</p></div>;
    }

    return (
        <div className="detail-modal">
            <div className="modal-content-wrap">
                <button onClick={handleClose} className="close-btn">X</button>
                <div className="img-wrap">
                    <img src={event.imageUrl || '/default.jpg'} alt={event.title || '이벤트 이미지'} />
                </div>
                <div className="detail-content">
                    <h2>{event.title || '제목 없음'}</h2>
                    <p className="date">{event.startDate || ''} ~ {event.endDate || ''}</p>
                    <p className="description">{event.description || '설명 없음'}</p>

                    {userInfo?.uUser === 'admin' && (
                        <div className="detail-actions">
                            <button
                                onClick={handleToggleBanner}
                                disabled={togglingBanner}
                                className="banner-btn"
                            >
                                {togglingBanner ? '변경 중...' : event.mainBanner ? '메인배너O' : '메인배너X'}
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="delete-btn"
                            >
                                {deleting ? '삭제 중...' : '이벤트 삭제'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .detail-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); display:flex; justify-content:center; align-items:center; z-index:1000; }
                .modal-content-wrap { background:white; border-radius:12px; box-shadow:0 4px 20px rgba(0,0,0,0.25); width:90%; max-width:600px; position:relative; display:flex; flex-direction:column; max-height:90vh; overflow:hidden; }
                .close-btn { position:absolute; top:12px; right:12px; background:transparent; border:none; font-size:20px; font-weight:bold; color:#fff; text-shadow:0 0 5px rgba(0,0,0,0.5); cursor:pointer; z-index:10; transition:color 0.2s; }
                .close-btn:hover { color:#ccc; }
                .img-wrap { flex-shrink:0; }
                .img-wrap img { width:100%; height:320px; object-fit:cover; border-radius:12px 12px 0 0; }
                .detail-content { padding:24px; overflow-y:auto; flex-grow:1; }
                .detail-content h2 { margin:0 0 8px; font-size:24px; color:#222; }
                .detail-content .date { font-size:13px; color:#888; margin-bottom:16px; }
                .detail-content .description { font-size:15px; color:#444; line-height:1.6; white-space:pre-line; }
                .detail-actions { display:flex; justify-content:flex-end; gap:12px; margin-top:20px; padding-top:10px; border-top:1px solid #eee; }
                .detail-actions button { padding:10px 20px; font-size:14px; font-weight:bold; border-radius:8px; cursor:pointer; transition:background-color 0.2s; }
                .delete-btn { background-color:#dc3545; color:white; border:none; }
                .delete-btn:hover { background-color:#c82333; }
                .delete-btn:disabled { background-color:#ccc; cursor:not-allowed; }
                .banner-btn { background-color:#007bff; color:white; border:none; padding:10px 20px; border-radius:8px; font-weight:bold; cursor:pointer; transition:background-color 0.2s; }
                .banner-btn:hover { background-color:#005dc1; }
                @media (max-width:768px) { .modal-content-wrap { width:95%; max-height:95vh; } .img-wrap img { height:250px; } }
            `}</style>
        </div>
    );
};

export default EventDetail;
