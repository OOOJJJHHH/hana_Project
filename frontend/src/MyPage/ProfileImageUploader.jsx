import React, { useState } from "react";
import axios from "axios";

const ProfileImageUploader = ({ userId }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [uploadResult, setUploadResult] = useState("");

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("이미지를 선택하세요.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId); // 문자열로 전달해야 함

        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/profile/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setUploadResult("✅ 업로드 성공");
        } catch (err) {
            console.error("❌ 업로드 실패", err);
            setUploadResult("❌ 업로드 실패");
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "20px auto", textAlign: "center" }}>
            <h3>프로필 이미지 업로드</h3>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="preview" style={{ width: 150, borderRadius: 8, marginTop: 10 }} />}
            <div>
                <button onClick={handleUpload} style={{ marginTop: 10 }}>업로드</button>
            </div>
            <p>{uploadResult}</p>
        </div>
    );
};

export default ProfileImageUploader;
