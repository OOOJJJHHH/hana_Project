import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../Session/UserContext'; // UserContext 경로를 확인해주세요.

const EventDetail = () => {
    // 💡 URL에서 이벤트 제목(title) 파라미터를 가져옵니다.
    const { title } = useParams();
    const navigate = useNavigate();
    // 💡 관리자 권한 확인을 위해 사용자 정보를 가져옵니다.
    const userInfo = useContext(UserContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    // 이벤트 상세 정보 조회
    useEffect(() => {
        const fetchEvent = async () => {
            // URL 파라미터에 공백이나 특수문자가 있을 수 있으므로 인코딩이 필수입니다.
            const encodedTitle = encodeURIComponent(title);
            try {
                // 백엔드: GET /getEventByTitle/{title} 호출
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/getEventByTitle/${encodedTitle}`
                );
                setEvent(res.data);
            } catch (err) {
                console.error('이벤트 불러오기 실패:', err);
                alert('이벤트를 불러오는 데 실패했거나 해당 이벤트가 존재하지 않습니다.');
                navigate('/about'); // 실패 시 이벤트 목록 페이지로 이동
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [title, navigate]); // title이 변경되거나 navigate 함수가 변경되면 재실행

    // 'X' 또는 '닫기' 버튼 클릭 핸들러 (이전 페이지로 돌아가기)
    const handleClose = () => {
        navigate(-1);
    };

    // 이벤트 삭제 핸들러 (관리자용)
    const handleDelete = async () => {
        if (!window.confirm('이 이벤트를 정말 삭제하시겠습니까?')) return;

        try {
            setDeleting(true);
            const encodedTitle = encodeURIComponent(title);

            // 백엔드: DELETE /deleteEventByTitle/{title} 호출
            await axios.delete(
                `${process.env.REACT_APP_API_URL}/deleteEventByTitle/${encodedTitle}`
            );

            alert('이벤트가 성공적으로 삭제되었습니다.');
            navigate('/about'); // 삭제 성공 시 목록 페이지로 이동
        } catch (error) {
            console.error('이벤트 삭제 실패:', error);
            alert('이벤트 삭제에 실패했습니다. 서버 오류를 확인해주세요.');
        } finally {
            setDeleting(false);
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
                    <img src={event.imageUrl} alt={event.title} />
                </div>
                <div className="detail-content">
                    <h2>{event.title}</h2>
                    <p className="date">{event.startDate} ~ {event.endDate}</p>
                    <p className="description">{event.description}</p>

                    {/* 관리자 버튼 영역 (uUser가 'admin'일 때만 표시) */}
                    {userInfo?.uUser === 'admin' && (
                        <div className="detail-actions">
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

            {/* 스타일 정의 */}
            <style>{`
                .detail-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content-wrap {
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
                    width: 90%;
                    max-width: 600px;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    max-height: 90vh;
                    overflow: hidden;
                }
                .close-btn {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    background: transparent;
                    border: none;
                    font-size: 20px;
                    font-weight: bold;
                    color: #fff; /* 이미지 위에 표시되므로 흰색으로 */
                    text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                    cursor: pointer;
                    z-index: 10;
                    transition: color 0.2s;
                }
                .close-btn:hover {
                    color: #ccc;
                }
                .img-wrap {
                    flex-shrink: 0; /* 이미지 영역이 줄어들지 않도록 설정 */
                }
                .img-wrap img {
                    width: 100%;
                    height: 320px;
                    object-fit: cover;
                    border-radius: 12px 12px 0 0;
                }
                .detail-content {
                    padding: 24px;
                    overflow-y: auto; /* 내용이 길 경우 스크롤 가능 */
                    flex-grow: 1;
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
                    white-space: pre-line; /* 줄바꿈 유지 */
                }
                .detail-actions {
                    display:flex;
                    justify-content: flex-end;
                    gap: 12px;
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 1px solid #eee;
                }
                .detail-actions button {
                    padding: 10px 20px;
                    font-size: 14px;
                    font-weight: bold;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }
                .delete-btn {
                    background-color: #dc3545;
                    color: white;
                    border: none;
                }
                .delete-btn:hover {
                    background-color: #c82333;
                }
                .delete-btn:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                }

                /* 모바일 반응형 */
                @media (max-width: 768px) {
                    .modal-content-wrap {
                        width: 95%;
                        max-height: 95vh;
                    }
                    .img-wrap img {
                        height: 250px;
                    }
                }
            `}</style>
        </div>
    );
};

export default EventDetail;