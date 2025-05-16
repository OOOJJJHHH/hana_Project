import React, { useState } from 'react';

function Popup({ onClose, userInfo, onAddLocal }) {
    // ✅ Hook은 컴포넌트 최상단에서 항상 호출
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [location, setLocation] = useState('');
    const [intro, setIntro] = useState('');
    const [msgVisible, setMsgVisible] = useState(false);

    if (!userInfo) return null; // userInfo가 없으면 렌더링하지 않음

    // 이미지 선택 시 프리뷰 처리
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImagePreview(null);
        }
    };

    const handleFocus = () => {
        setMsgVisible(true);
    };

    const handleBlur = () => {
        setMsgVisible(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!location.trim() || !intro.trim()) {
            alert("위치와 소개는 반드시 입력하세요.");
            return;
        }

        const imageSrc =
            imagePreview ||
            'https://via.placeholder.com/80?text=No+Image';

        const newLocal = {
            name: userInfo.uFirstName || "이름 없음",
            location,
            intro,
            detail: intro,
            image: imageSrc,
        };

        onAddLocal(newLocal);
    };

    return (
        <>
            <style>{`
                .popup-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 1000;
                }
                .popup-content {
                    position: fixed;
                    top: 50%; left: 50%;
                    width: 400px;
                    background: white;
                    border-radius: 10px;
                    padding: 20px;
                    transform: translate(-50%, -50%);
                    z-index: 1001;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    text-align: center;
                }
                .popup-close-btn {
                    position: absolute;
                    top: 10px; right: 15px;
                    background: transparent;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                }
                form label {
                    display: block;
                    margin-bottom: 10px;
                    font-weight: bold;
                    text-align: left;
                }
                form input[type="text"], form input[type="file"] {
                    width: 100%;
                    padding: 6px 8px;
                    margin-top: 4px;
                    box-sizing: border-box;
                    border-radius: 4px;
                    border: 1px solid #ccc;
                }
                form button[type="submit"] {
                    margin-top: 15px;
                    padding: 8px 12px;
                    cursor: pointer;
                    border: none;
                    background-color: #007bff;
                    color: white;
                    border-radius: 4px;
                    font-weight: bold;
                    width: 100%;
                }
                .readonly-msg {
                    color: red;
                    font-size: 14px;
                    margin-top: 4px;
                    text-align: left;
                }
                .image-preview {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin: 10px auto;
                    border: 1px solid #ccc;
                }
            `}</style>

            <div className="popup-overlay" onClick={onClose} />
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <button className="popup-close-btn" onClick={onClose}>×</button>
                <h2>새 현지인 생성</h2>

                <form onSubmit={handleSubmit}>
                    <label>
                        이미지 파일 선택:
                        <input type="file" name="imageFile" accept="image/*" onChange={handleImageChange} />
                    </label>

                    {imagePreview && (
                        <img src={imagePreview} alt="미리보기" className="image-preview" />
                    )}

                    <label>
                        이름:
                        <input
                            type="text"
                            name="name"
                            value={userInfo.uFirstName || ''}
                            readOnly
                            style={{
                                marginTop: '10px',
                                fontSize: '20px',
                                backgroundColor: '#f0f0f0',
                                border: '2px solid #000',
                                cursor: 'not-allowed',
                                borderRadius: '4px',
                                padding: '6px 8px',
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                        />
                        {msgVisible && (
                            <div className="readonly-msg">이름은 변경할 수 없습니다</div>
                        )}
                    </label>

                    <label>
                        위치:
                        <input
                            type="text"
                            name="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        소개:
                        <input
                            type="text"
                            name="intro"
                            value={intro}
                            onChange={(e) => setIntro(e.target.value)}
                            required
                        />
                    </label>

                    <button type="submit">저장</button>
                </form>
            </div>
        </>
    );
}

export default Popup;