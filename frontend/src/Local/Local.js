import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Local.css';
import { UserContext } from '../Session/UserContext';
import axios from "axios";

function Local() {
  const navigate = useNavigate();
  const [localData, setLocalData] = useState([]);
  const userInfo = useContext(UserContext);

  // 컴포넌트 마운트 시 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getLandlord`);
        setLocalData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("에러 발생:", error);
      }
    };
    fetchData();
  }, []);

  const handleMoreClick = (user) => {
    navigate(`/locals?name=${user.uFirstName}`);
  };

  return (
      <div className="local-container">
        <h1 className="local-title">현지인 소개</h1>

        <div className="local-list">
          {localData.map(user => (
              <div key={user.id} className="user-card">
                <img
                    src={user.profileImage || 'https://via.placeholder.com/80x80?text=No+Image'}
                    alt="User Profile"
                />
                <div className="user-info">
                  <h2>{user.uFirstName || "이름 정보 없음"}</h2>
                  <p>📍 {user.uIdEmail || "위치 정보 없음"}</p>
                  <p>{user.intro || "소개글이 없습니다."}</p>
                </div>
                <button onClick={() => handleMoreClick(user)}>더 알아보기 ▶</button>
              </div>
          ))}
        </div>
      </div>
  );
}

export default Local;
