import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../Session/UserContext';

const About = () => {
    const userInfo = useContext(UserContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [deleteMode, setDeleteMode] = useState(false);
    const [checkedEvents, setCheckedEvents] = useState(new Set());

    const getDDay = (startDate, endDate) => {
        const today = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        today.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        if (end.getTime() < today.getTime()) return '종료';
        if (start.getTime() <= today.getTime() && today.getTime() <= end.getTime()) return '진행 중';
        if (start.getTime() > today.getTime()) {
            const diffDays = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            return diffDays === 0 ? 'D-day' : `D-${diffDays}`;
        }
        return '';
    };

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

    const handleCheckboxChange = (eventTitle) => {
        const newCheckedEvents = new Set(checkedEvents);
        if (newCheckedEvents.has(eventTitle)) newCheckedEvents.delete(eventTitle);
        else newCheckedEvents.add(eventTitle);
        setCheckedEvents(newCheckedEvents);
    };

    const handleBulkDelete = async () => {
        if (checkedEvents.size === 0) return alert('삭제할 이벤트를 하나 이상 선택해주세요.');
        if (window.confirm(`${checkedEvents.size}개의 이벤트를 정말 삭제하시겠습니까?`)) {
            try {
                const titlesToDelete = Array.from(checkedEvents);
                for (const title of titlesToDelete) {
                    await axios.delete(`${process.env.REACT_APP_API_URL}/deleteEventByTitle/${encodeURIComponent(title)}`);
                }
                setEvents(events.filter(event => !titlesToDelete.includes(event.title)));
                alert('선택한 이벤트가 삭제되었습니다.');
            } catch (error) {
                console.error(error);
                alert('삭제 중 오류 발생');
            } finally {
                setDeleteMode(false);
                setCheckedEvents(new Set());
            }
        }
    };

    const cancelDeleteMode = () => {
        setDeleteMode(false);
        setCheckedEvents(new Set());
    };

    // ====== 인라인 스타일 객체 ======
    const containerStyle = { padding: '60px 20px', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' };
    const headerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' };
    const titleStyle = { fontSize: '2rem', textAlign: 'center', fontWeight: 'bold', color: '#333', margin: '0 0 20px 0' };
    const adminBtnGroupStyle = { display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px auto 40px auto' };
    const adminBtnStyle = { border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: 'background-color 0.2s ease, opacity 0.2s ease' };
    const eventContainerStyle = { padding: '40px 20px', minHeight: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '16px' };
    const eventGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px', maxWidth: '1200px', width: '100%', margin: '0 auto' };
    const eventCardStyle = { position: 'relative', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s ease, box-shadow 0.3s ease' };
    const eventCardHoverStyle = { ...eventCardStyle, transform: 'translateY(-5px)', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' };
    const checkboxStyle = { position: 'absolute', top: '15px', left: '15px', width: '25px', height: '25px', cursor: 'pointer', zIndex: 10 };
    const eventImgStyle = { height: '180px', width: '100%', objectFit: 'cover' };
    const eventContentStyle = { padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 };
    const eventTitleStyle = { fontSize: '20px', fontWeight: 'bold', color: '#222', marginBottom: '10px' };
    const eventDateStyle = { fontSize: '12px', color: '#999', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' };
    const dDayStyle = (status) => {
        if (status === '종료') return { fontWeight: 'bold', fontSize: '14px', color: '#6c757d' };
        if (status === '진행 중') return { fontWeight: 'bold', fontSize: '14px', color: '#28a745' };
        return { fontWeight: 'bold', fontSize: '14px', color: '#dc3545' };
    };
    const eventBtnStyle = (disabled) => ({ alignSelf: 'center', backgroundColor: disabled ? '#ccc' : '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '9999px', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s ease' });

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={titleStyle}>이벤트 안내</h1>
            </div>

            {userInfo?.uUser === 'admin' && (
                <div style={adminBtnGroupStyle}>
                    {deleteMode ? (
                        <>
                            <button style={{ ...adminBtnStyle, backgroundColor: '#dc3545', color: 'white' }} onClick={handleBulkDelete}>
                                선택 항목 삭제 ({checkedEvents.size})
                            </button>
                            <button style={{ ...adminBtnStyle, backgroundColor: '#ffc107', color: 'black' }} onClick={cancelDeleteMode}>
                                취소
                            </button>
                        </>
                    ) : (
                        <>
                            <button style={{ ...adminBtnStyle, backgroundColor: '#007bff', color: 'white' }} onClick={handleCreateEventClick}>
                                이벤트 생성
                            </button>
                            <button style={{ ...adminBtnStyle, backgroundColor: '#6c757d', color: 'white' }} onClick={() => setDeleteMode(true)}>
                                이벤트 삭제
                            </button>
                        </>
                    )}
                </div>
            )}

            <div style={eventContainerStyle}>
                {loading ? (
                    <p style={{ textAlign: 'center', fontSize: '18px' }}>이벤트 목록을 불러오는 중입니다...</p>
                ) : events.length > 0 ? (
                    <div style={eventGridStyle}>
                        {events.map(event => {
                            const status = getDDay(event.startDate, event.endDate);
                            return (
                                <div key={event.title} style={eventCardStyle}>
                                    {deleteMode && (
                                        <input type="checkbox" style={checkboxStyle} checked={checkedEvents.has(event.title)} onChange={() => handleCheckboxChange(event.title)} />
                                    )}
                                    <img src={event.imageUrl} alt={event.title} style={eventImgStyle} />
                                    <div style={eventContentStyle}>
                                        <h2 style={eventTitleStyle}>{event.title}</h2>
                                        <p style={eventDateStyle}>
                                            {event.startDate} ~ {event.endDate} <span style={dDayStyle(status)}>({status})</span>
                                        </p>
                                        <button
                                            style={eventBtnStyle(deleteMode)}
                                            disabled={deleteMode}
                                            onClick={() => navigate(`/event/${encodeURIComponent(event.title)}`)}
                                        >
                                            자세히 보기
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', fontSize: '18px', color: '#555' }}>현재 진행중인 이벤트가 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default About;
