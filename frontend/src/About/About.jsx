import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../Session/UserContext'; // UserContext 경로를 확인해주세요.

const About = () => {
    // UserContext에서 사용자 정보(관리자 여부 판단용)를 가져옵니다.
    const userInfo = useContext(UserContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- 삭제 관련 상태 ---
    const [deleteMode, setDeleteMode] = useState(false); // 삭제 모드 활성화 여부
    const [checkedEvents, setCheckedEvents] = useState(new Set()); // 체크된 이벤트들의 Title을 저장

    // ✅ D-day 계산 함수
    const getDDay = (startDate, endDate) => {
        const today = new Date();
        // 날짜 형식은 YYYY-MM-DD라고 가정합니다.
        const start = new Date(startDate);
        const end = new Date(endDate);

        // 시간을 00:00:00으로 맞추어 날짜 계산의 정확성을 높입니다.
        today.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // 1. 이벤트 종료 여부 확인 (종료일 < 오늘)
        if (end.getTime() < today.getTime()) {
            return "종료";
        }

        // 2. 이벤트 진행 중 여부 확인 (시작일 <= 오늘 <= 종료일)
        if (start.getTime() <= today.getTime() && today.getTime() <= end.getTime()) {
            return "진행 중";
        }

        // 3. 이벤트 예정 여부 확인 (시작일 > 오늘)
        if (start.getTime() > today.getTime()) {
            const diffTime = start.getTime() - today.getTime();
            // 밀리초를 일(day)로 변환
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) return "D-day";
            return `D-${diffDays}`;
        }

        return ""; // 예외 케이스
    };


    // 이벤트 목록을 불러오는 useEffect
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // 백엔드: GET /getEvents 호출
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

    // '이벤트 생성' 버튼 클릭 핸들러
    const handleCreateEventClick = () => {
        navigate('/create-event'); // EventAdd.js로 연결되는 라우트 경로
    };

    // 체크박스 변경 핸들러 (이벤트 Title을 Set에 추가/제거)
    const handleCheckboxChange = (eventTitle) => {
        const newCheckedEvents = new Set(checkedEvents);
        if (newCheckedEvents.has(eventTitle)) {
            newCheckedEvents.delete(eventTitle);
        } else {
            newCheckedEvents.add(eventTitle);
        }
        setCheckedEvents(newCheckedEvents);
    };

    // 🔥 선택 항목 일괄 삭제 핸들러
    const handleBulkDelete = async () => {
        if (checkedEvents.size === 0) {
            alert('삭제할 이벤트를 하나 이상 선택해주세요.');
            return;
        }

        if (window.confirm(`${checkedEvents.size}개의 이벤트를 정말 삭제하시겠습니까?`)) {
            try {
                const titlesToDelete = Array.from(checkedEvents);

                // 백엔드 단일 삭제 API를 각 항목에 대해 반복 호출
                for (const title of titlesToDelete) {
                    await axios.delete(
                        // ⚠️ 현재 Title 기반 삭제 API 호출. ID 기반으로 백엔드 수정 시 프론트도 반드시 ID로 바꿔야 오류가 해결됩니다.
                        `${process.env.REACT_APP_API_URL}/deleteEventByTitle/${encodeURIComponent(title)}`
                    );
                }

                // UI에서 삭제된 이벤트 제거 후 목록 갱신
                setEvents(events.filter(event => !titlesToDelete.includes(event.title)));
                alert('선택한 이벤트가 삭제되었습니다.');
            } catch (error) {
                console.error("이벤트 삭제에 실패했습니다:", error);
                alert('이벤트 삭제 중 오류가 발생했습니다. 서버 또는 권한을 확인해주세요.');
            } finally {
                // 삭제 모드 종료 및 상태 초기화
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

            {/* 관리자 버튼 영역 (userInfo?.uUser가 'admin'일 때만 표시) */}
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
                            <div className="event-card" key={event.title}>
                                {deleteMode && (
                                    <input
                                        type="checkbox"
                                        className="event-checkbox"
                                        checked={checkedEvents.has(event.title)}
                                        onChange={() => handleCheckboxChange(event.title)}
                                    />
                                )}
                                {/* imageUrl은 Presigned URL을 통해 이미지를 직접 표시 */}
                                <img src={event.imageUrl} alt={event.title} className="event-image" />
                                <div className="event-content">
                                    <h2 className="event-title">{event.title}</h2>
                                    {/* ✅ D-day 표시 로직 및 동적 클래스 할당 */}
                                    <p className="event-date">
                                        {event.startDate} ~ {event.endDate}
                                        {/* D-day 결과에 따라 클래스 이름 할당 (띄어쓰기는 하이픈으로 치환) */}
                                        <span className={`d-day-badge d-day-${getDDay(event.startDate, event.endDate).replace(/\s/g, '-')}`}>
                                            ({getDDay(event.startDate, event.endDate)})
                                        </span>
                                    </p>
                                    <button
                                        // EventDetail.js로 이동 (URL 인코딩 필수)
                                        onClick={() => navigate(`/event/${encodeURIComponent(event.title)}`)}
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

            {/* 인라인 스타일은 유지 */}
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
                  display: flex; /* D-day 배지를 옆으로 배치 */
                  align-items: center;
                  gap: 8px;
                }
                
                /* D-day 배지 기본 스타일 */
                .d-day-badge {
                    font-weight: bold;
                    font-size: 14px;
                }

                /* 🎯 1. 시작 예정 (D-n 또는 D-day)일 때: 빨간색 */
                .d-day-D-day, 
                .d-day-D- {
                    /* "D-1", "D-5", "D-day" 모두 포함 */
                    color: #dc3545; /* 빨간색 */
                }

                /* 🎯 2. 진행 중일 때: 초록색 */
                .d-day-진행-중 {
                    color: #28a745; /* 초록색 */
                }

                /* 🎯 3. 종료일 때: 회색 */
                .d-day-종료 {
                    color: #6c757d; /* 회색 */
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