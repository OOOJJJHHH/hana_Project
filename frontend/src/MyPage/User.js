import React, { useState, useRef, useContext, useEffect } from "react";
import axios from "axios";
import Wishlist from "./Wishlist";
import Account from "./Account";
import { UserContext } from "../Session/UserContext";
import Accommodation from "./Accommodation";
import Reservation from "./Reservation";
import Revation from "./Revation";

const User = () => {
    const userInfo = useContext(UserContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState("info");
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [userDetails, setUserDetails] = useState(null);

    const getImageUrl = (profileImage) => {
        if (!profileImage) return null;
        if (profileImage.startsWith("http")) return profileImage;
        return `${process.env.REACT_APP_S3_URL}/${profileImage}`;
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!userInfo?.uId) return;
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_URL}/user/${userInfo.uId}`
                );
                setUserDetails(res.data);
                setSelectedImage(getImageUrl(res.data.profileImage));
            } catch (err) {
                console.error("유저 정보 로딩 실패:", err);
            }
        };
        fetchUserInfo();
    }, [userInfo?.uId]);

    const uploadImageToServer = async (file) => {
        if (!userInfo?.uId) {
            alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
            return null;
        }

        const formData = new FormData();
        formData.append("userId", userInfo.uId);
        formData.append("file", file);

        try {
            setUploading(true);
            await axios.post(
                `${process.env.REACT_APP_API_URL}/user/profile/upload`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            const updatedUser = await axios.get(
                `${process.env.REACT_APP_API_URL}/user/${userInfo.uId}`
            );
            setUserDetails(updatedUser.data);
            setSelectedImage(getImageUrl(updatedUser.data.profileImage));

            setUploading(false);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 2000);
        } catch (error) {
            console.error("이미지 업로드 실패:", error);
            setUploading(false);
            alert("이미지 업로드에 실패했습니다.");
        }
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) await uploadImageToServer(file);
    };

    const handleClickChangeImage = () => fileInputRef.current.click();

    const handleMenuClick = (menu) => setSelectedMenu(menu);

    const renderContent = () => {
        switch (selectedMenu) {
            case "info":
                return <Account />;
            case "reservation":
                return <Revation />;
            case "wishlist":
                return <Wishlist />;
            case "Reservation":
                return <Reservation />;
            case "Accommodation":
                return <Accommodation uId={userInfo.uId} />;
            default:
                return <div>선택된 메뉴가 없습니다.</div>;
        }
    };

    if (!userInfo || !userInfo.uUser) {
        return <div>사용자 정보를 불러올 수 없습니다. 다시 로그인 해주세요.</div>;
    }

    const sidebarStyle = {
        borderRadius: "20px",
        border: "1px solid #e0e0e0",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#fff",
        height: "fit-content",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    };

    const buttonStyle = (active) => ({
        fontSize: "18px",
        fontWeight: active ? "bold" : "normal",
        padding: "12px",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        backgroundColor: active ? "#007BFF" : "#f9f9f9",
        color: active ? "white" : "#333",
        transition: "all 0.3s ease",
    });

    const renderSidebarButtons = (buttons) => (
        <div style={sidebarStyle}>
            {buttons.map(({ key, label }) => (
                <button
                    key={key}
                    style={buttonStyle(selectedMenu === key)}
                    onClick={() => handleMenuClick(key)}
                >
                    {label}
                </button>
            ))}
        </div>
    );

    const renderUserPage = (buttons) => (
        <div style={{ padding: "30px" }}>
            <p style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "30px" }}>
                마이페이지
            </p>

            <div
                style={{
                    width: "1180px",
                    display: "flex",
                    flexDirection: "row",
                    gap: "30px",
                }}
            >
                {/* 왼쪽 사이드 */}
                <div
                    style={{
                        width: "28%",
                        display: "flex",
                        flexDirection: "column",
                        gap: "25px",
                    }}
                >
                    {/* 프로필 카드 */}
                    <div
                        style={{
                            borderRadius: "20px",
                            border: "1px solid #e0e0e0",
                            padding: "25px",
                            backgroundColor: "#fff",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                    >
                        <div
                            style={{
                                width: "150px",
                                height: "150px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                cursor: "pointer",
                                border: "4px solid #007BFF",
                            }}
                            onClick={handleClickChangeImage}
                        >
                            {userDetails?.profileImage ? (
                                <img
                                    src={userDetails?.profileImage ? getImageUrl(userDetails.profileImage) : require("../image/user.png")}
                                    alt="Profile"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = require("../image/user.png"); // 기본 이미지
                                    }}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <div style={{ marginTop: "60px", color: "#888" }}>
                                    이미지 없음
                                </div>
                            )}
                        </div>

                        {uploadSuccess && (
                            <p style={{ marginTop: "15px", color: "green", fontSize: "14px" }}>
                                ✅ 프로필 이미지가 변경되었습니다!
                            </p>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                            ref={fileInputRef}
                        />
                    </div>

                    {renderSidebarButtons(buttons)}
                </div>

                {/* 오른쪽 컨텐츠 */}
                <div
                    style={{
                        borderRadius: "20px",
                        border: "1px solid #e0e0e0",
                        padding: "25px",
                        backgroundColor: "#fff",
                        width: "70%",
                        minHeight: "800px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                >
                    {renderContent()}
                </div>
            </div>
        </div>
    );

    if (userInfo.uUser === "tenant") {
        return renderUserPage([
            { key: "info", label: "계정" },
            { key: "reservation", label: "예약 내역" },
            { key: "wishlist", label: "위시리스트" },
        ]);
    }

    if (userInfo.uUser === "landlord" || userInfo.uUser === "admin") {
        return renderUserPage([
            { key: "info", label: "계정" },
            { key: "Accommodation", label: "숙소 관리" },
            { key: "Reservation", label: "예약 확인" },
        ]);
    }

    return null;
};

export default User;
