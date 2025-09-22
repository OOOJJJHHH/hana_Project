import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../Session/UserContext'; // UserContext 경로를 확인해주세요.

const About = () => {
    const userInfo = useContext(UserContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- 삭제 관련 상태 추가 ---
    const [deleteMode, setDeleteMode] = useState(false); // 삭제 모드 활성화 여부
    const [checkedEvents, setCheckedEvents] = useState(new Set()); // 체크된 이벤트들의 ID를 저장

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/getEvents`);
                setEvents(response.data);
            } catch (error) {
                console.error("이벤트 목록을 불러오는 데 실패했습니다:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleCreateEventClick = () => {
        navigate('/create-event');
    };

    // --- 체크박스 변경 핸들러 ---
    const handleCheckboxChange = (eventId) => {
        const newCheckedEvents = new Set(checkedEvents);
        if (newCheckedEvents.has(eventId)) {
            newCheckedEvents.delete(eventId);
        } else {
            newCheckedEvents.add(eventId);
        }
        setCheckedEvents(newCheckedEvents);
    };

    // --- 선택 항목 일괄 삭제 핸들러 ---
    const handleBulkDelete = async () => {
        if (checkedEvents.size === 0) {
            alert('삭제할 이벤트를 하나 이상 선택해주세요.');
            return;
        }

        if (window.confirm(`${checkedEvents.size}개의 이벤트를 정말 삭제하시겠습니까?`)) {
            try {
                const idsToDelete = Array.from(checkedEvents); // Set을 배열로 변환
                // 서버에 선택된 ID 배열을 보내 삭제 요청 (실제 API 주소로 수정 필요)
                await axios.delete(`${process.env.REACT_APP_API_URL}/deleteEvents`, {
                    data: { ids: idsToDelete },
                });

                // 화면에서도 즉시 반영
                setEvents(events.filter(event => !idsToDelete.includes(event.id)));
                alert('선택한 이벤트가 삭제되었습니다.');
            } catch (error) {
                console.error("이벤트 삭제에 실패했습니다:", error);
                alert('이벤트 삭제 중 오류가 발생했습니다.');
            } finally {
                // 삭제 모드 종료 및 초기화
                setDeleteMode(false);
                setCheckedEvents(new Set());
            }
        }
    };

    // 삭제 모드 취소 핸들러
    const cancelDeleteMode = () => {
        setDeleteMode(false);
        setCheckedEvents(new Set());
    };

    return (
        <div className="about-container">
            <div className="about-header">
                <h1 className="about-title">이벤트 안내</h1>
            </div>

            {/* 관리자 버튼 영역 */}
            {userInfo?.uUser === 'admin' && (
                <div className="admin-button-group">
                    {deleteMode ? (
                        <>
                            <button onClick={handleBulkDelete} className="delete-confirm-button">
                                선택 항목 삭제 ({checkedEvents.size})
                            </button>
                            <button onClick={cancelDeleteMode} className="cancel-button">
                                취소
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={handleCreateEventClick} className="create-event-button">
                                이벤트 생성
                            </button>
                            <button onClick={() => setDeleteMode(true)} className="delete-mode-button">
                                이벤트 삭제
                            </button>
                        </>
                    )}
                </div>
            )}

            <div className="event-container">
                {loading ? (
                    <p style={{ textAlign: 'center', fontSize: '18px' }}>이벤트 목록을 불러오는 중입니다...</p>
                ) : events.length > 0 ? (
                    <div className="event-grid">
                        {events.map((event) => (
                            <div className="event-card" key={event.id}>
                                {deleteMode && (
                                    <input
                                        type="checkbox"
                                        className="event-checkbox"
                                        checked={checkedEvents.has(event.id)}
                                        onChange={() => handleCheckboxChange(event.id)}
                                    />
                                )}
                                <img src={event.imageUrl} alt={event.title} className="event-image" />
                                <div className="event-content">
                                    <h2 className="event-title">{event.title}</h2>
                                    <p className="event-description">{event.description}</p>
                                    <p className="event-date">{event.startDate} ~ {event.endDate}</p>
                                    <button
                                        onClick={() => navigate(`/event/${event.id}`)}
                                        className="event-button"
                                        disabled={deleteMode} // 삭제 모드일 때 버튼 비활성화
                                    >
                                        자세히 보기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', fontSize: '18px', color: '#555' }}>
                        현재 진행중인 이벤트가 없습니다.
                    </p>
                )}
            </div>

            <style>{`
                .about-container {
                  padding: 60px 20px;
                  font-family: 'Arial', sans-serif;
                }
                .about-header {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  max-width: 1200px;
                  margin: 0 auto;
                }
                .about-title {
                  text-align: center;
                  font-size: 36px;
                  font-weight: bold;
                  color: #333;
                }
                
                /* --- 관리자 버튼 관련 스타일 --- */
                .admin-button-group {
                  display: flex;
                  justify-content: center;
                  gap: 10px;
                  margin: 20px auto 40px auto;
                }
                .admin-button-group button {
                  border: none;
                  padding: 12px 30px;
                  border-radius: 8px;
                  cursor: pointer;
                  font-size: 16px;
                  font-weight: bold;
                  transition: background-color 0.2s ease, opacity 0.2s ease;
                }
                .create-event-button { background-color: #007bff; color: white; }
                .create-event-button:hover { background-color: #005dc1; }
                .delete-mode-button { background-color: #6c757d; color: white; }
                .delete-mode-button:hover { background-color: #5a6268; }
                .delete-confirm-button { background-color: #dc3545; color: white; }
                .delete-confirm-button:hover { background-color: #c82333; }
                .cancel-button { background-color: #ffc107; color: black; }
                .cancel-button:hover { background-color: #e0a800; }
                
                .event-container {
                  background-color: #f5f5f5;
                  padding: 40px 20px;
                  min-height: 300px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 16px;
                }
                .event-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                  gap: 30px;
                  max-width: 1200px;
                  width: 100%;
                  margin: 0 auto;
                }
                .event-card {
                  position: relative;
                  background-color: #fff;
                  border-radius: 16px;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
                  display: flex;
                  flex-direction: column;
                  transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .event-card:hover {
                  transform: translateY(-5px);
                  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
                }

                .event-checkbox {
                  position: absolute;
                  top: 15px;
                  left: 15px;
                  width: 25px;
                  height: 25px;
                  cursor: pointer;
                  z-index: 10;
                }
                
                .event-image {
                  height: 180px;
                  object-fit: cover;
                  width: 100%;
                }
                .event-content {
                  padding: 20px;
                  display: flex;
                  flex-direction: column;
                  flex-grow: 1;
                }
                .event-title {
                  font-size: 20px;
                  font-weight: bold;
                  color: #222;
                  margin-bottom: 10px;
                }
                .event-description {
                  font-size: 14px;
                  color: #555;
                  flex-grow: 1;
                  margin-bottom: 10px;
                }
                .event-date {
                  font-size: 12px;
                  color: #999;
                  margin-bottom: 20px;
                }
                .event-button {
                  align-self: center;
                  background-color: #007bff;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 9999px;
                  cursor: pointer;
                  transition: background-color 0.2s ease;
                }
                .event-button:hover {
                  background-color: #005dc1;
                }
                .event-button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default About;