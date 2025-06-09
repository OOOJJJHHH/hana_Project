
import React, { useState, useRef, useContext, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import ReView from "./ReView";
import Wishlist from "./Wishlist";
import Account from "./Account";
import { UserContext } from '../Session/UserContext';
import Accommodation from "./Accommodation";
import Reservation from "./Reservation";
import Revation from "./Revation";

const User = () => {
    const userInfo = useContext(UserContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState('info');
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);


    useEffect(() => {
        console.log("🧾 userInfo:", userInfo);
    }, [userInfo]);

    const uploadImageToServer = async (file) => {
        if (!userInfo?.id) {
            alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
            return null;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userInfo.uId); // ✅ 문자열 "jun"


        try {
            setUploading(true);
            const response = await axios.post('http://localhost:8080/uploadProfileImage', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploading(false);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 2000);
            return response.data;
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            setUploading(false);
            alert("이미지 업로드에 실패했습니다.");
            return null;
        }
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const uploadedUrl = await uploadImageToServer(file);
            if (uploadedUrl) {
                setSelectedImage(uploadedUrl);
            }
        }
    };

    const handleDeleteImage = async () => {
        try {
            await axios.delete(`http://localhost:8080/deleteProfileImage?userId=${userInfo.uId}`);
            setSelectedImage(null);
        } catch (error) {
            alert("이미지 삭제 실패");
            console.error(error);
        }
    };


    const handleClickChangeImage = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/getProfileImage?userId=${userInfo.id}`);
                setSelectedImage(res.data);
            } catch (err) {
                console.error('프로필 이미지 불러오기 실패', err);
            }
        };

        if (userInfo?.id) fetchProfileImage();
    }, [userInfo]);

    const handleMenuClick = (menu) => setSelectedMenu(menu);

    const renderContent = () => {
        switch (selectedMenu) {
            case 'info': return <Account />;
            case 'image': return <Revation />;
            case 'wishlist': return <Wishlist />;
            case 'recently': return <ReView />;
            case 'Reservation': return <Reservation />;
            case 'Accommodation': return <Accommodation />;
            default: return <div>선택된 메뉴가 없습니다.</div>;
        }
    };

    if (!userInfo || !userInfo.uUser) {
        return <div>사용자 정보를 불러올 수 없습니다. 다시 로그인 해주세요.</div>;
    }

    return (
        <div>
            <span style={{ marginTop: '100px', display: 'block', fontSize: '35px' }}>
                마이페이지
            </span>

            <div style={{ width: '1180px', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                <div style={{ width: '30%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{
                        border: '1px solid gray',
                        padding: '20px',
                        height: '400px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                    }}>
                        <div
                            style={{
                                width: '80%',
                                height: '65%',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                            onClick={handleClickChangeImage}
                        >
                            {uploading ? (
                                <div style={{ textAlign: 'center', paddingTop: '60px' }}>업로드 중...</div>
                            ) : selectedImage ? (
                                <>
                                    <img
                                        src={selectedImage}
                                        alt="Profile"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDeleteImage(); }}
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            right: '5px',
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '5px',
                                            padding: '2px 6px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        삭제
                                    </button>
                                </>
                            ) : (
                                <div style={{ marginTop: '100px' }}>이미지가 없습니다.</div>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        {uploadSuccess && (
                            <p style={{ color: 'green', fontSize: '14px', marginTop: '10px' }}>
                                ✅ 업로드 성공!
                            </p>
                        )}
                    </div>

                    <div style={{
                        border: '1px solid gray',
                        padding: '20px',
                        textAlign: 'center',
                        height: '580px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                    }}>
                        <button onClick={() => handleMenuClick('info')}>계정</button>
                        <button onClick={() => handleMenuClick('Accommodation')}>숙박 확인</button>
                        <button onClick={() => handleMenuClick('Reservation')}>예약 확인</button>
                        <button onClick={() => handleMenuClick('wishlist')}>위시리스트</button>
                        <button onClick={() => handleMenuClick('recently')}>최근 본</button>
                    </div>
                </div>

                <div style={{
                    border: '1px solid gray',
                    padding: '20px',
                    height: '1000px',
                    width: '70%',
                }}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default User;
