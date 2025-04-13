import React, { useState } from 'react';
import axios from 'axios';

const CityForm = () => {
    // 상태 관리: 사용자 입력 값
    const [city, setCity] = useState({
        title: '',
        content: '',
        imag: '',
        state: '' // state 값을 추가
    });

    // 폼 입력 값 처리 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCity({ ...city, [name]: value });
    };

    // 폼 제출 시 데이터 전송
    const handleSubmit = async (e) => {
        e.preventDefault();  // 폼 제출 시 페이지 리로드 방지

        try {
            // Spring Boot 서버로 POST 요청 보내기
            await axios.post('http://localhost:8080/saveCity', city);
            alert('데이터가 성공적으로 저장되었습니다.');

            // 데이터 제출 후 폼 초기화
            setCity({
                title: '',
                content: '',
                imag: '',
                state: '' // state 초기화
            });
        } catch (error) {
            console.error('Error saving city:', error);
            alert('데이터 저장에 실패했습니다.');
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
                        name="title"
                        value={city.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea
                        name="content"
                        value={city.content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Image URL:</label>
                    <input
                        type="text"
                        name="imag"
                        value={city.imag}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>State:</label>
                    <input
                        type="text"
                        name="state"
                        value={city.state}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">전송</button>
            </form>
        </div>
    );
};

export default CityForm;
