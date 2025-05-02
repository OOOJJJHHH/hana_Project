import React, { useState } from "react";
import axios from "axios";

const Owner = () => {

    // 객체 형식으로 상태 관리
    const [formData, setformData] = useState({
        lodOwner: "",
        lodCity: "",
        lodName: "",
        lodLocation: "",
        lodCallNum: "",
        lodPrice: "",
        lodImag: ""
    });

    // 입력값을 상태로 업데이트하는 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData({ ...formData, [name]: value });
    };

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault();  // 기본 폼 제출 동작 방지
        console.log(formData);  // 입력된 데이터를 콘솔에 출력 (나중에 API로 보낼 수 있음)

        try{
            await axios.post('http://localhost:8080/saveLod', formData);
            alert("데이터가 성공적으로 저장되었습니다");

            // 폼 리셋
            setformData({
                lodOwner: "",
                lodCity: "",
                lodName: "",
                lodLocation: "",
                lodCallNum: "",
                lodPrice: "",
                lodImag: ""
            });

        } catch (error){
            console.error('Error saving city:', error);
            alert('데이터 저장에 실패했습니다.');
        }

    };

    return (
        <div>
            <h2>숙소 등록 페이지</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>숙소 올린 사람:</label>
                    <input
                        type="text"
                        name="lodOwner"
                        value={formData.lodOwner}
                        onChange={handleChange}
                        placeholder="올린 사람 입력"
                        required
                    />
                </div>
                <div>
                    <label>숙소가 위치한 도시:</label>
                    <input
                        type="text"
                        name="lodCity"  // name 속성을 통해 상태의 key와 일치시킴
                        value={formData.lodCity}
                        onChange={handleChange}
                        placeholder="도시 입력"
                        required
                    />
                </div>
                <div>
                    <label>숙소명:</label>
                    <input
                        type="text"
                        name="lodName"
                        value={formData.lodName}
                        onChange={handleChange}
                        placeholder="숙소명 입력"
                        required
                    />
                </div>
                <div>
                    <label>숙소 주소:</label>
                    <input
                        type="text"
                        name="lodLocation"
                        value={formData.lodLocation}
                        onChange={handleChange}
                        placeholder="주소 입력"
                        required
                    />
                </div>
                <div>
                    <label>숙소 전화번호:</label>
                    <input
                        type="text"
                        name="lodCallNum"
                        value={formData.lodCallNum}
                        onChange={handleChange}
                        placeholder="전화번호 입력"
                        required
                    />
                </div>
                <div>
                    <label>숙소 가격:</label>
                    <input
                        type="number"
                        name="lodPrice"
                        value={formData.lodPrice}
                        onChange={handleChange}
                        placeholder="전화번호 입력"
                        required
                    />
                </div>

                <div>
                    <label>숙소 이미지:</label>
                    <input
                        type="text"
                        name="lodImag"
                        value={formData.lodImag}
                        onChange={handleChange}
                        placeholder="숙소 이미지 입력"
                        required
                    />
                </div>
                <button type="submit">저장</button>
            </form>
        </div>
    );
}

export default Owner;
