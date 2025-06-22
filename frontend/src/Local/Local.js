import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Local.css';
import { UserContext } from '../Session/UserContext';
import axios from "axios"; // 유저 컨텍스트 임포트

function Local() {
  const navigate = useNavigate();
  const [localData, setLocalData] = useState([]);
  const userInfo = useContext(UserContext);

  // 🔹 1. 컴포넌트 마운트 시 localStorage에서 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("시도");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getLandlord`);
        console.log(response.data);
        setLocalData(response.data);
        console.log("성공");
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 className="local-title">현지인 소개</h1>

        </div>

        <div className="local-list">
          {localData.map(user => (
              <div key={user.id} className="user-card">
                <img
                    src={user.profileImage || 'None'}
                    alt="User Profile"
                />
                <div className="user-info">
                  <h2>{user.uFirstName || "이름 정보 없음"}</h2>
                  <p>📍 {user.uLastName || "위치 정보 없음"}</p>
                  <p>{user.intro || "소개글이 없습니다."}</p> {/* intro가 없으면 기본 문구 출력 */}
                </div>
                <button onClick={() => handleMoreClick(user)}>더 알아보기 ▶</button>
              </div>
          ))}
        </div>

      </div>
  );
}

export default Local;