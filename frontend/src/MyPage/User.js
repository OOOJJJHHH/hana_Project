import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import ReView from "./ReView";
import Revation from "./Revation";
import Wishlist from "./Wishlist";
import Account from "./Account";

const User = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState('info'); // Default to 'info' menu
  const fileInputRef = useRef(null);

  // 이름 변경
  const [name, setName] = useState('이름을 입력해주세요');
  const [age, setAge] = useState('나이를 입력해주세요');
  const [email, setEmail] = useState('이메일을 입력해주세요');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', age: '', email: '' });
  const [phone, setPhone] = useState("전화번호를 입력해주세요");

  const handleEditClick = () => {
    setIsEditing(true);
    setEditData({ name, age, email, phone }); // 편집 모드일 때 현재 값들을 입력 필드에 보여주기 위함
  };

  const handleSaveClick = () => {
    setName(editData.name);
    setAge(editData.age);
    setEmail(editData.email);
    setPhone(editData.phone);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditData({ name, age, email, phone }); // 편집 취소 시 이전 값으로 복원 (선택 사항)
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  // 끝

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    renderContent();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickChangeImage = () => {
    fileInputRef.current.click();
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'info':
        return <Account />;

      case 'image':
        return <Revation />;

      case 'wishlist':
        return <Wishlist />;

      case 'recently':
        return <ReView />;

      default:
        return <div>선택된 메뉴가 없습니다.</div>;
    }
  };

  return (
    <div>
      <span
        style={{
          marginTop: '100px',
          display: 'block',
          fontSize: '35px',
        }}
      >
        마이페이지
      </span>

      <div
        style={{
          width: '1180px',
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
        }}
      >
        <div
          style={{
            width: '30%',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              border: '1px solid gray',
              padding: '20px',
              height: '400px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: '80%',
                height: '65%',
                borderRadius: '50%',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={handleClickChangeImage}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Profile"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
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
          </div>
          <div
            style={{
              border: '1px solid gray',
              padding: '20px',
              textAlign: 'center',
              height: '580px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <button
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                padding: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedMenu === 'info' ? '#f0f0f0' : 'white',

              }}
              onClick={() => handleMenuClick('info')}
            >
              계정
            </button>
            <button
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                padding: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedMenu === 'image' ? '#f0f0f0' : 'white',
              }}
              onClick={() => handleMenuClick('image')}
            >
              예약 내역
            </button>
            <button
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                padding: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedMenu === 'wishlist' ? '#f0f0f0' : 'white',
              }}
              onClick={() => handleMenuClick('wishlist')}
            >
              위시리스트
            </button>
            <button
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                padding: '10px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: selectedMenu === 'recently' ? '#f0f0f0' : 'white',
              }}
              onClick={() => handleMenuClick('recently')}
            >
              최근 본
            </button>
            {/* Add more menu buttons as needed */}
          </div>
        </div>
        <div
          style={{
            border: '1px solid gray',
            padding: '20px',
            height: '1000px',
            width: '70%',
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default User;