import React, { useState } from "react";
import axios from "axios";

const AccommodationRewrite = ({ lodging, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        ...lodging,
        lodImagFile: null,
        lodImagPreview: lodging.lodImag || null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                lodImagFile: file,
                lodImagPreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            const form = new FormData();

            // 1. JSON 형태의 숙소 데이터 → Blob으로 감싸서 'data' 라는 이름으로 전송
            const lodgingData = {
                lodName: formData.lodName,
                lodCity: formData.lodCity,
                lodLocation: formData.lodLocation,
                lodCallNum: formData.lodCallNum
            };
            const json = new Blob([JSON.stringify(lodgingData)], { type: "application/json" });
            form.append("data", json);

            // 2. 이미지가 있으면 lodImag 필드로 전송
            if (formData.lodImagFile) {
                form.append("lodImag", formData.lodImagFile);
            }

            // 3. 서버에 PUT 요청
            const res = await axios.put(
                `${process.env.REACT_APP_API_URL}/lodging/${lodging.id}`,
                form,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            alert("숙소가 수정되었습니다.");
            onUpdate(res.data);
            onClose();
        } catch (err) {
            console.error("숙소 수정 실패:", err);
            alert("숙소 수정 실패");
        }
    };


    return (
        <div className="rewrite-modal-overlay" onClick={onClose}>
            <div className="rewrite-modal-container" onClick={(e) => e.stopPropagation()}>
                <h2>숙소 수정</h2>
                <input
                    type="text"
                    name="lodName"
                    value={formData.lodName}
                    onChange={handleChange}
                    placeholder="숙소 이름"
                />
                <input
                    type="text"
                    name="lodCity"
                    value={formData.lodCity}
                    onChange={handleChange}
                    placeholder="도시"
                />
                <input
                    type="text"
                    name="lodLocation"
                    value={formData.lodLocation}
                    onChange={handleChange}
                    placeholder="주소"
                />
                <input
                    type="text"
                    name="lodCallNum"
                    value={formData.lodCallNum}
                    onChange={handleChange}
                    placeholder="전화번호"
                />

                <label style={{ marginTop: "10px", display: "block" }}>이미지 업로드</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />

                {formData.lodImagPreview && (
                    <img
                        src={formData.lodImagPreview}
                        alt="미리보기"
                        style={{ width: "100%", marginTop: "10px", borderRadius: "10px" }}
                    />
                )}

                <div className="rewrite-modal-buttons">
                    <button className="save-btn" onClick={handleSubmit}>저장</button>
                    <button className="cancel-btn" onClick={onClose}>닫기</button>
                </div>

                <style>{`
                    .rewrite-modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                        margin: 0;
                        padding: 0;
                    }

                    .rewrite-modal-container {
                        background: #fff;
                        padding: 30px;
                        border-radius: 10px;
                        width: 100%;
                        max-width: 500px;
                        box-shadow: 0 0 20px rgba(0,0,0,0.2);
                        display: flex;
                        flex-direction: column;
                    }

                    .rewrite-modal-container input[type="text"],
                    .rewrite-modal-container input[type="file"] {
                        margin-top: 10px;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 6px;
                        font-size: 16px;
                        width: 100%;
                        box-sizing: border-box;
                    }

                    .rewrite-modal-buttons {
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 20px;
                        gap: 10px;
                    }

                    .save-btn {
                        background-color: #007bff;
                        color: #fff;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                    }

                    .cancel-btn {
                        background-color: #6c757d;
                        color: #fff;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 6px;
                        cursor: pointer;
                    }

                    .rewrite-modal-container img {
                        margin-top: 10px;
                        border-radius: 10px;
                        max-height: 200px;
                        object-fit: cover;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default AccommodationRewrite;
