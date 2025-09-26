import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventAdd = () => {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        } else {
            setImageFile(null);
            setImagePreview('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            alert('대표 이미지를 등록해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('eventTitle', eventData.title);
        formData.append('eventDescription', eventData.description);
        formData.append('eventStartDate', eventData.startDate);
        formData.append('eventEndDate', eventData.endDate);
        formData.append('eventImage', imageFile); // 파일 자체를 'eventImage' 이름으로 추가

        try {
            // 서버로 FormData 전송. 백엔드에서 Event 객체 (ID 포함)를 반환하도록 수정했습니다.
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/saveEvent`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('이벤트가 성공적으로 등록되었습니다!');

            // ⭐️ 수정된 부분: 서버 응답에서 새로 생성된 ID를 추출합니다.
            const newEventId = response.data.id;

            // ⭐️ 수정된 부분: 새로 받은 ID를 사용하여 이벤트 상세 페이지로 즉시 이동합니다.
            // 이로써 목록 새로고침에 의존하지 않아 데이터 로딩 실패 문제를 해결합니다.
            navigate(`/event/${newEventId}`);

        } catch (error) {
            console.error('이벤트 등록 중 오류 발생:', error);
            alert('이벤트 등록에 실패했습니다. 서버 상태를 확인해주세요.');
        }
    };

    return (
        <div className="event-add-container">
            <h2 className="add-event-title">새 이벤트 등록</h2>
            <form onSubmit={handleSubmit} className="event-form">

                {/* 제목 입력 */}
                <div className="form-group">
                    <label htmlFor="title">제목</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={eventData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* 설명 입력 */}
                <div className="form-group">
                    <label htmlFor="description">상세 설명</label>
                    <textarea
                        id="description"
                        name="description"
                        value={eventData.description}
                        onChange={handleInputChange}
                        rows="6"
                        required
                    />
                </div>

                {/* 날짜 입력 */}
                <div className="date-group">
                    <div className="form-group date-item">
                        <label htmlFor="startDate">시작일</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={eventData.startDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group date-item">
                        <label htmlFor="endDate">종료일</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={eventData.endDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                {/* 이미지 파일 입력 */}
                <div className="form-group image-upload-group">
                    <label htmlFor="eventImage" className="image-label">
                        대표 이미지 (필수)
                    </label>
                    <input
                        type="file"
                        id="eventImage"
                        name="eventImage"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                {/* 이미지 미리보기 */}
                {imagePreview && (
                    <div className="image-preview-container">
                        <img src={imagePreview} alt="이벤트 이미지 미리보기" className="image-preview" />
                    </div>
                )}

                {/* 버튼 */}
                <div className="form-actions">
                    <button type="submit" className="submit-btn">
                        이벤트 등록
                    </button>
                    <button type="button" onClick={() => navigate('/about')} className="cancel-btn">
                        취소
                    </button>
                </div>
            </form>

            {/* CSS 스타일링 (React에서는 일반적으로 별도 파일에 두지만, 편의상 여기에 포함) */}
            <style>{`
                .event-add-container {
                  padding: 40px 20px;
                  max-width: 600px;
                  margin: 0 auto;
                  font-family: 'Arial', sans-serif;
                  background-color: #f7f9fc;
                  border-radius: 15px;
                  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                }
                .add-event-title {
                  text-align: center;
                  color: #007bff;
                  margin-bottom: 30px;
                  font-size: 28px;
                  font-weight: bold;
                }
                .event-form {
                  display: flex;
                  flex-direction: column;
                  gap: 20px;
                }
                .form-group {
                  display: flex;
                  flex-direction: column;
                }
                .form-group label {
                  margin-bottom: 8px;
                  font-weight: bold;
                  color: #333;
                }
                .form-group input[type="text"],
                .form-group input[type="date"],
                .form-group textarea {
                  padding: 12px;
                  border: 1px solid #ddd;
                  border-radius: 8px;
                  font-size: 16px;
                  transition: border-color 0.2s ease;
                }
                .form-group input:focus,
                .form-group textarea:focus {
                  border-color: #007bff;
                  outline: none;
                }
                .date-group {
                    display: flex;
                    gap: 20px;
                }
                .date-item {
                    flex: 1;
                }
                .image-upload-group input[type="file"] {
                    border: none;
                    padding: 0;
                }
                .image-preview-container {
                  margin-top: 10px;
                  text-align: center;
                  padding: 10px;
                }
                .image-preview {
                  max-width: 100%;
                  max-height: 300px;
                  border-radius: 12px;
                  border: 1px solid #ddd;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .form-actions {
                  display: flex;
                  justify-content: center;
                  gap: 20px;
                  margin-top: 20px;
                }
                .form-actions button {
                  padding: 12px 30px;
                  font-size: 16px;
                  font-weight: bold;
                  border-radius: 9999px;
                  border: none;
                  cursor: pointer;
                  transition: background-color 0.2s ease, transform 0.2s ease;
                }
                .submit-btn {
                  background-color: #007bff;
                  color: white;
                }
                .submit-btn:hover {
                    background-color: #005dc1;
                    transform: translateY(-2px);
                }
                .cancel-btn {
                  background-color: #6c757d;
                  color: white;
                }
                .cancel-btn:hover {
                    background-color: #5a6268;
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
};

export default EventAdd;