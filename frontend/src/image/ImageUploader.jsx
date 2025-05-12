import React, { useState } from 'react';
import axios from 'axios';

function ImageUploader() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("파일을 선택해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            if (res.status === 200) {
                alert('✅ 성공입니다');
            } else {
                alert('❌ 실패: 서버 응답 오류');
            }
        } catch (err) {
            console.error(err);
            alert('❌ 실패: 요청 중 에러 발생');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>사진 업로드</button>
        </div>
    );
}

export default ImageUploader;
