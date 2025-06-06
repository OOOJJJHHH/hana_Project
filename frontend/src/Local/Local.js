import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Local.css';
import { UserContext } from '../Session/UserContext';
import axios from "axios"; // 유저 컨텍스트 임포트

const initialLocalData = [
  {
    id: 1,
    // name: "Sofia",
    location: "볼테라 (Volterra)",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    intro: "Hi 내 이름은 Sofia~ 잘 부탁해요!",
    detail: "패션을 좋아하는 이탈리아 출신 로컬 가이드입니다.",
  },
  {
    id: 2,
    name: "Matteo",
    location: "보비오 (Bobbio)",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    intro: "Mate is god! Mate is perfect!",
    detail: "자연과 사진을 사랑하는 사진 작가입니다.",
  },
  {
    id: 3,
    name: "Liam",
    location: "시에나 (Siena)",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    intro: "I'm Liam, your friendly local!",
    detail: "역사 해설을 잘하는 안내자예요.",
  },
  {
    id: 4,
    name: "Emma",
    location: "아씨시 (Assisi)",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    intro: "Emma입니다, 맛집 추천 전문가죠!",
    detail: "이탈리아 미식 투어를 안내하는 현지인입니다.",
  },
  {
    id: 5,
    name: "James",
    location: "코르토나 (Cortona)",
    image: "https://randomuser.me/api/portraits/men/25.jpg",
    intro: "여행은 James와 함께!",
    detail: "유쾌하고 친절한 소도시 가이드입니다.",
  },
  {
    id: 6,
    name: "Olivia",
    location: "오르비에토 (Orvieto)",
    image: "https://randomuser.me/api/portraits/women/33.jpg",
    intro: "음악과 예술을 좋아하는 Olivia예요!",
    detail: "소도시의 문화와 예술을 소개해요.",
  },
  {
    id: 7,
    name: "Noah",
    location: "산지미냐노 (San Gimignano)",
    image: "https://randomuser.me/api/portraits/men/23.jpg",
    intro: "Noah와 함께 커피 한 잔 어때요?",
    detail: "카페와 골목길 전문 현지인입니다.",
  },
  {
    id: 8,
    name: "Isabella",
    location: "첸토 (Cento)",
    image: "https://randomuser.me/api/portraits/women/12.jpg",
    intro: "Isabella입니다! 골목 맛집 전문가에요!",
    detail: "현지인만 아는 비밀 맛집을 소개해드려요.",
  },
  {
    id: 9,
    name: "Ethan",
    location: "라벤나 (Ravenna)",
    image: "https://randomuser.me/api/portraits/men/66.jpg",
    intro: "건축과 역사에 진심인 Ethan입니다!",
    detail: "중세 건축과 유적을 소개하는 전문가입니다.",
  },
  {
    id: 10,
    name: "Ava",
    location: "루카 (Lucca)",
    image: "https://randomuser.me/api/portraits/women/19.jpg",
    intro: "감성 여행 좋아하는 Ava예요.",
    detail: "사진 찍기 좋은 장소를 추천해요.",
  },
];



function Local() {
  const navigate = useNavigate();
  const [localData, setLocalData] = useState([]);
  const userInfo = useContext(UserContext);

  // 🔹 1. 컴포넌트 마운트 시 localStorage에서 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("시도");
        const response = await axios.get("http://localhost:8080/getLandlord");
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
    navigate(`/locals?name=${user.name}`);
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
                    src={user.profileImage || "data:image/jpeg;base64,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"}
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