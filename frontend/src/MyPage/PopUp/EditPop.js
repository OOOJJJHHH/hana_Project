import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserUpdateContext } from "../../Session/UserContext";

const EditPop = ({ uId, onClose }) => {
    const setUserInfo = useContext(UserUpdateContext);

    const [userProfile, setUserProfile] = useState(null);
    const [formData, setFormData] = useState({});
    const [hoveredButton, setHoveredButton] = useState(null);

    const formContent = {
        uFirstName: "이름",
        uId: "아이디",
        uIdEmail: "이메일",
        uLastName: "성"
    };

    useEffect(() => {
        if (!uId) return;

        console.log(uId);

        axios.get(`${process.env.REACT_APP_API_URL}/getUser/${uId}`, {
            withCredentials: true,
        })
            .then(response => {
                setUserProfile(response.data);
                setFormData({
                    uId: response.data.uId,
                    uFirstName: response.data.uFirstName,
                    uLastName: response.data.uLastName,
                    uIdEmail: response.data.uIdEmail,
                });
            })
            .catch(error => {
                console.error("유저 정보 불러오기 실패:", error);
            });
    }, [uId]);

    const contentChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/user/update`, formData, {
                withCredentials: true,
            });
            alert("정보가 성공적으로 수정되었습니다.");

            setUserInfo(formData);  // Context 업데이트 (필요에 따라 조정)
            localStorage.setItem("loginUser", JSON.stringify(formData));
            onClose();
        } catch (error) {
            console.error("정보 저장 실패:", error);
            alert("정보 저장에 실패했습니다.");
        }
    };

    if (!userProfile) return <div>로딩 중...</div>;

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000,
        }}>
            <div style={{
                width: "500px",
                padding: "20px",
                background: "#fff",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
                <h2>회원 정보 수정</h2>
                <form onSubmit={handleSubmit}>
                    {Object.entries(formData).map(([key, value]) => (
                        <div key={key} style={{ marginBottom: "10px", fontSize: "16px" }}>
                            <label style={{ display: "inline-block", width: "80px" }}>
                                {formContent[key]}:
                            </label>
                            <input
                                type="text"
                                name={key}
                                value={value}
                                onChange={contentChange}
                                required
                                style={{ height: "35px", padding: "0 8px", width: "300px" }}
                            />
                        </div>
                    ))}

                    <div style={{ marginTop: "20px" }}>
                        <button
                            type="submit"
                            style={{
                                padding: '8px 20px',
                                backgroundColor: hoveredButton === 'save' ? '#e9f679' : 'white',
                                border: '1px solid #ccc',
                                borderRadius: "5px",
                                cursor: 'pointer',
                                marginRight: '10px',
                                transition: '0.3s'
                            }}
                            onMouseEnter={() => setHoveredButton('save')}
                            onMouseLeave={() => setHoveredButton(null)}
                        >
                            저장
                        </button>
                        <button
                            type="button"
                            style={{
                                padding: '8px 20px',
                                backgroundColor: hoveredButton === 'cancel' ? '#e9f679' : 'white',
                                border: '1px solid #ccc',
                                borderRadius: "5px",
                                cursor: 'pointer',
                                transition: '0.3s'
                            }}
                            onClick={onClose}
                            onMouseEnter={() => setHoveredButton('cancel')}
                            onMouseLeave={() => setHoveredButton(null)}
                        >
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPop;
