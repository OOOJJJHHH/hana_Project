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
        mainBanner: false,
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
        formData.append('eventImage', imageFile);
        formData.append('mainBanner', eventData.mainBanner);

        console.log('🎉 전송될 이벤트 데이터:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            // 서버로 FormData 전송 (API URL은 실제 엔드포인트에 맞게 수정 필요)
            await axios.post(`${process.env.REACT_APP_API_URL}/saveEvent`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('이벤트가 성공적으로 등록되었습니다!');
            navigate('/about'); // 등록 완료 후 이벤트 목록 페이지로 이동

        } catch (error) {
            console.error('이벤트 등록 실패:', error);
            alert('이벤트 등록에 실패했습니다. 서버 오류를 확인해주세요.');
        }
    };

    return (
        <div className="event-add-container">
            <h1 className="event-add-title">새 이벤트 등록</h1>
            <form onSubmit={handleSubmit} className="event-add-form">
                <div className="form-group">
                    <label htmlFor="title">이벤트 제목</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={eventData.title}
                        onChange={handleInputChange}
                        placeholder="이벤트의 주제를 입력하세요"
                        required
                    />
                </div>

                <div className="form-group-row">
                    <div className="form-group">
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
                    <div className="form-group">
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

                <div className="form-group">
                    <label htmlFor="description">이벤트 설명</label>
                    <textarea
                        id="description"
                        name="description"
                        rows="8"
                        value={eventData.description}
                        onChange={handleInputChange}
                        placeholder="이벤트에 대한 상세한 설명을 작성해주세요"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="image">대표 이미지</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                </div>

                {imagePreview && (
                    <div className="image-preview-container">
                        <p>이미지 미리보기</p>
                        <img src={imagePreview} alt="이벤트 이미지 미리보기" className="image-preview" />
                    </div>
                )}

                <div className="form-actions">
                    <button type="submit" className="submit-btn">등록하기</button>
                    <button type="button" onClick={() => navigate('/about')} className="cancel-btn">취소</button>
                </div>
            </form>

            <style>{`
                .event-add-container {
                  max-width: 800px;
                  margin: 60px auto;
                  padding: 40px;
                  background-color: #ffffff;
                  border-radius: 16px;
                  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                .event-add-title {
                  text-align: center;
                  font-size: 32px;
                  font-weight: 600;
                  color: #222;
                  margin-bottom: 40px;
                }
                .event-add-form {
                  display: flex;
                  flex-direction: column;
                  gap: 24px;
                }
                .form-group {
                  display: flex;
                  flex-direction: column;
                }
                .form-group-row {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 20px;
                }
                .form-group label {
                  font-size: 14px;
                  font-weight: 600;
                  color: #555;
                  margin-bottom: 8px;
                  letter-spacing: 0.5px;
                }
                .form-group input[type="text"],
                .form-group input[type="date"],
                .form-group textarea,
                .form-group input[type="file"] {
                  width: 100%;
                  padding: 12px 14px;
                  border: 1.5px solid #ccc;
                  border-radius: 8px;
                  font-size: 16px;
                  box-sizing: border-box;
                  transition: border-color 0.3s, box-shadow 0.3s;
                  outline: none;
                }
                .form-group input:focus, .form-group textarea:focus {
                    border-color: #007bff;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
                }
                .form-group textarea {
                  resize: vertical;
                  min-height: 120px;
                }
                .image-preview-container {
                  text-align: center;
                  margin-top: 10px;
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