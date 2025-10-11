import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext, UserUpdateContext } from "../../Session/UserContext";

const EditPop = ({ onClose }) => {
    const userInfo = useContext(UserContext);
    const setUserInfo = useContext(UserUpdateContext);

    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const visibleFields = {
        uFirstName: "이름",
        uId: "아이디",
        uIdEmail: "이메일",
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (!userInfo?.uId) return;
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userInfo.uId}`);
                setFormData(res.data);
                setLoading(false);
            } catch (err) {
                console.error("유저 정보 불러오기 실패:", err);
                setLoading(false);
            }
        };
        fetchUser();
    }, [userInfo?.uId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (showPasswordFields) {
            if (passwordData.currentPassword !== formData.uPassword) {
                alert("현재 비밀번호가 일치하지 않습니다.");
                return;
            }
            if (passwordData.newPassword.length < 6) {
                alert("새 비밀번호는 최소 6자 이상이어야 합니다.");
                return;
            }
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                alert("새 비밀번호와 확인이 일치하지 않습니다.");
                return;
            }

            formData.uPassword = passwordData.newPassword;
        }

        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/user/${userInfo.uId}`, formData);
            alert("정보가 성공적으로 수정되었습니다.");
            setUserInfo(formData);
            localStorage.setItem("loginUser", JSON.stringify(formData));
            onClose();
        } catch (error) {
            console.error("정보 수정 실패:", error);
            alert("정보 수정에 실패했습니다.");
        }
    };

    // ✅ 백엔드 컨트롤러 요청 버튼
    const handleBackendRequest = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/reservation/test`, {
                userId: userInfo.uId,
            });
            console.log("✅ 요청 성공:", response.data);
            alert("요청이 성공적으로 전송되었습니다.");
        } catch (err) {
            console.error("❌ 요청 실패:", err);
            alert("요청 전송에 실패했습니다.");
        }
    };

    if (loading || !formData) return <div style={styles.loading}>로딩 중...</div>;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.title}>회원 정보 수정</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    {Object.entries(visibleFields).map(([key, label]) => (
                        <div key={key} style={styles.formGroup}>
                            <label style={styles.label}>{label}</label>
                            <input
                                type="text"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                disabled={key === "uId"}
                                style={styles.input}
                            />
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => setShowPasswordFields(prev => !prev)}
                        style={styles.toggleButton}
                    >
                        {showPasswordFields ? "비밀번호 변경 취소" : "비밀번호 변경"}
                    </button>

                    {showPasswordFields && (
                        <>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>현재 비밀번호</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>새 비밀번호</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    style={styles.input}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>비밀번호 확인</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    style={styles.input}
                                />
                            </div>
                        </>
                    )}

                    <div style={styles.buttonGroup}>
                        <button
                            type="submit"
                            style={{ ...styles.button, backgroundColor: "#4CAF50", color: "white" }}
                        >
                            저장
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ ...styles.button, backgroundColor: "#f44336", color: "white" }}
                        >
                            취소
                        </button>
                    </div>

                    {/* ✅ 여기 새 버튼 추가됨 */}
                    <div style={{ marginTop: "15px" }}>
                        <button
                            type="button"
                            onClick={handleBackendRequest}
                            style={{
                                ...styles.button,
                                backgroundColor: "#2196F3",
                                color: "white",
                                width: "100%"
                            }}
                        >
                            백엔드 요청 테스트
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    modal: {
        width: "450px",
        padding: "30px",
        background: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    },
    title: {
        marginBottom: "25px",
        fontSize: "22px",
        fontWeight: "bold",
        textAlign: "center",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    formGroup: {
        display: "flex",
        flexDirection: "column",
    },
    label: {
        marginBottom: "6px",
        fontWeight: "500",
        fontSize: "14px",
        color: "#555",
    },
    input: {
        height: "38px",
        padding: "0 12px",
        fontSize: "14px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        outline: "none",
        transition: "border-color 0.2s",
    },
    toggleButton: {
        padding: "10px",
        fontSize: "14px",
        backgroundColor: "#eee",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        color: "#333",
        marginTop: "10px",
        transition: "background-color 0.2s",
    },
    buttonGroup: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "20px",
    },
    button: {
        padding: "10px 18px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
    },
    loading: {
        textAlign: "center",
        marginTop: "100px",
        fontSize: "18px",
    }
};

export default EditPop;
