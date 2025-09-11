import React, { useState } from "react";
import axios from "axios";

const CityForm = () => {
    const [city, setCity] = useState({
        cityName: "",
        cityDetail: "",
        cityImag: null,
        cityState: "0",
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCity((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setCity((prev) => ({ ...prev, cityImag: file }));

        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("cityName", city.cityName);
            formData.append("cityDetail", city.cityDetail);
            formData.append("cityState", city.cityState);

            if (city.cityImag) {
                formData.append("cityImag", city.cityImag);
            }

            await axios.post(`${process.env.REACT_APP_API_URL}/saveCity`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("도시 정보가 성공적으로 저장되었습니다.");

            setCity({
                cityName: "",
                cityDetail: "",
                cityImag: null,
                cityState: "0",
            });
            setPreviewUrl(null);
        } catch (error) {
            console.error("도시 저장 오류:", error);
            alert("도시 저장에 실패했습니다.");
        }
    };

    const styles = {
        container: {
            maxWidth: 480,
            height: "600px",
            margin: "40px auto",
            padding: "32px",
            borderRadius: 12,
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            backgroundColor: "#fff",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        },
        heading: {
            textAlign: "center",
            marginBottom: 32,
            fontSize: 28,
            fontWeight: "600",
            color: "#222",
        },
        formGroup: {
            marginBottom: 20,
            display: "flex",
            flexDirection: "column",
        },
        label: {
            marginBottom: 8,
            fontWeight: "600",
            color: "#555",
            fontSize: 14,
            letterSpacing: 0.5,
        },
        input: {
            padding: "10px 14px",
            fontSize: 16,
            borderRadius: 8,
            border: "1.5px solid #ccc",
            transition: "border-color 0.3s",
            outline: "none",
        },
        inputFocus: {
            borderColor: "#4a90e2",
            boxShadow: "0 0 6px #4a90e2",
        },
        textarea: {
            minHeight: 100,
            padding: "10px 14px",
            fontSize: 16,
            borderRadius: 8,
            border: "1.5px solid #ccc",
            resize: "vertical",
            transition: "border-color 0.3s",
            outline: "none",
        },
        fileInput: {
            padding: 6,
            borderRadius: 8,
            border: "1.5px solid #ccc",
            cursor: "pointer",
            fontSize: 14,
            color: "#666",
            backgroundColor: "#fafafa",
            transition: "border-color 0.3s",
        },
        previewImage: {
            marginTop: 12,
            maxWidth: "100%",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            objectFit: "cover",
        },
        button: {
            marginTop: 30,
            width: "100%",
            padding: "14px 0",
            fontSize: 18,
            fontWeight: "700",
            color: "#fff",
            backgroundColor: "#4a90e2",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            transition: "background-color 0.3s",
        },
        buttonHover: {
            backgroundColor: "#357ABD",
        },
    };

    // 포커스 상태 관리 (optional)
    const [focus, setFocus] = useState({});

    const handleFocus = (field) => {
        setFocus((prev) => ({ ...prev, [field]: true }));
    };
    const handleBlur = (field) => {
        setFocus((prev) => ({ ...prev, [field]: false }));
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>도시 정보 입력</h1>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="cityName">
                        제목
                    </label>
                    <input
                        id="cityName"
                        type="text"
                        name="cityName"
                        value={city.cityName}
                        onChange={handleChange}
                        onFocus={() => handleFocus("cityName")}
                        onBlur={() => handleBlur("cityName")}
                        required
                        style={{
                            ...styles.input,
                            ...(focus.cityName ? styles.inputFocus : {}),
                        }}
                        placeholder="도시 이름을 입력하세요"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="cityDetail">
                        내용
                    </label>
                    <textarea
                        id="cityDetail"
                        name="cityDetail"
                        value={city.cityDetail}
                        onChange={handleChange}
                        onFocus={() => handleFocus("cityDetail")}
                        onBlur={() => handleBlur("cityDetail")}
                        required
                        style={{
                            ...styles.textarea,
                            ...(focus.cityDetail ? styles.inputFocus : {}),
                        }}
                        placeholder="도시 상세 정보를 입력하세요"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="cityImag">
                        이미지
                    </label>
                    <input
                        id="cityImag"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={styles.fileInput}
                    />
                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="미리보기"
                            style={styles.previewImage}
                            loading="lazy"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    style={styles.button}
                    onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)
                    }
                    onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)
                    }
                >
                    전송
                </button>
            </form>
        </div>
    );
};

export default CityForm;
