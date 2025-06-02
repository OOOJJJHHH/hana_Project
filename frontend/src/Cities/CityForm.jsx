import React, { useState } from 'react';
import axios from 'axios';

const CityForm = () => {
    // 도시 정보 상태 관리
    // cityImag: 사진 파일 객체를 저장하기 위해 초기값 null로 설정
    const [city, setCity] = useState({
        cityName: '',
        cityDetail: '',
        cityImag: null,  // 사진 파일
        cityState: '0'
    });

    // 이미지 미리보기 URL 상태
    const [previewUrl, setPreviewUrl] = useState(null);

    // 텍스트 input들 상태 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCity(prev => ({ ...prev, [name]: value }));
    };

    // 이미지 파일 선택 핸들러
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // 선택된 첫 번째 파일
        setCity(prev => ({ ...prev, cityImag: file }));

        if (file) {
            // 브라우저에서 미리보기용 URL 생성
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // FormData 생성 - 멀티파트 폼데이터 형식으로 전송
            const formData = new FormData();
            formData.append("cityName", city.cityName);
            formData.append("cityDetail", city.cityDetail);
            formData.append("cityState", city.cityState);

            // 사진 파일이 있으면 첨부
            if (city.cityImag) {
                formData.append("cityImag", city.cityImag);
            }

            // 서버에 POST 요청 (멀티파트/form-data)
            await axios.post("http://localhost:8080/saveCity", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert('도시 정보가 성공적으로 저장되었습니다.');

            // 상태 초기화
            setCity({
                cityName: '',
                cityDetail: '',
                cityImag: null,
                cityState: '0'
            });
            setPreviewUrl(null);

        } catch (error) {
            console.error('도시 저장 오류:', error);
            alert('도시 저장에 실패했습니다.');
        }
    };

    return (
        <div>
            <h1>도시 정보 입력</h1>
            <form onSubmit={handleSubmit}>

                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="cityName"
                        value={city.cityName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Content:</label>
                    <textarea
                        name="cityDetail"
                        value={city.cityDetail}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {/* 이미지 미리보기 */}
                    {previewUrl && (
                        <div style={{ marginTop: '10px' }}>
                            <img
                                src={previewUrl}
                                alt="미리보기"
                                style={{ maxWidth: '300px', border: '1px solid #ccc' }}
                            />
                        </div>
                    )}
                </div>

                <button type="submit">전송</button>
            </form>
        </div>
    );
};

export default CityForm;
