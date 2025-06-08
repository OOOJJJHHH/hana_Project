import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { UserUpdateContext } from "../Session/UserContext";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const setUserInfo = useContext(UserUpdateContext);
  const [userType, setUserType] = useState(""); // 사용자 타입 추가 (tenant, landlord)

  // 컴포넌트 마운트 시 Kakao SDK 초기화
  useEffect(() => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        // 'YOUR_KAKAO_APP_KEY'를 실제 카카오 JavaScript 앱 키로 변경하세요.
        window.Kakao.init('e386795908b2f6e2e6f00a9632262472');
        console.log("Kakao SDK initialized:", window.Kakao.isInitialized());
      }
    }
  }, []);

  // 일반 로그인 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
          "http://localhost:8080/api/login",  // 일반 로그인 API 호출
          {
            uId: id,
            uPassword: password,
          },
          {
            withCredentials: true,
          }
      );

      if (response.data) {
        console.log(response.data);
        setUserInfo(response.data);
        setUserType(response.data.userType);
        localStorage.setItem('loginUser', JSON.stringify(response.data));
        window.location.href = "/";
      }
    } catch (error) {
      console.error("로그인 실패", error);
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  // Kakao 로그인 핸들러
  const handleKakaoLogin = () => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Auth.login({
        // 카카오에서 가져올 사용자 정보 범위 설정 (이메일과 닉네임 요청)
        scope: 'profile_nickname,email',
        success: async function(authObj) {
          console.log("Kakao Login Success:", authObj);

          // 카카오 사용자 정보 가져오기 API 호출
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: async function(kakaoUser) {
              console.log("Kakao User Info:", kakaoUser);

              // uId와 uIdEmail을 카카오 정보로 설정
              // uId는 'kakao_' 접두사를 붙여 일반 회원가입 ID와 중복되지 않게 합니다.
              // DB의 `kakaoId` 필드에 저장할 때는 접두사를 제거한 순수 카카오 고유 ID를 사용합니다.
              const uIdFromKakao = `kakao_${kakaoUser.id}`;
              const uIdEmailFromKakao = kakaoUser.kakao_account?.email || ''; // 이메일이 없을 경우 빈 문자열

              try {
                // 백엔드의 새로운 카카오 로그인/회원가입 엔드포인트 호출
                const response = await axios.post(
                    "http://localhost:8080/api/kakaoLogin", // 이 엔드포인트를 백엔드에 새로 구현해야 합니다.
                    {
                      uId: uIdFromKakao, // 예: "kakao_123456789"
                      uIdEmail: uIdEmailFromKakao, // 예: "user@example.com"
                      uFirstName: kakaoUser.properties.nickname, // 예: "홍길동"
                      uLastName: '', // 카카오에서 성을 제공하지 않으므로 비워둠
                      uUser: 'tenant' // 카카오 로그인 시 기본 사용자 타입을 'tenant'로 설정 (필요시 사용자에게 선택 UI 제공)
                    },
                    {
                      withCredentials: true,
                    }
                );

                if (response.data) {
                  console.log("Kakao Login/Signup Success on Backend:", response.data);
                  setUserInfo(response.data);
                  setUserType(response.data.userType);
                  localStorage.setItem('loginUser', JSON.stringify(response.data));
                  window.location.href = "/"; // 로그인 성공 후 홈으로 이동
                }
              } catch (error) {
                console.error("백엔드에서 카카오 로그인 처리 실패:", error);
                alert("카카오 로그인 처리 중 오류가 발생했습니다.");
              }
            },
            fail: function(error) {
              console.error("카카오 사용자 정보 가져오기 실패:", error);
              alert("카카오 사용자 정보를 가져오는데 실패했습니다.");
            }
          });
        },
        fail: function(err) {
          console.error("Kakao Login Failed:", err);
          alert("카카오 로그인에 실패했습니다.");
        },
      });
    } else {
      alert("카카오 SDK가 로드되지 않았거나 초기화되지 않았습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleFindClick = () => {
    window.open("/popup/find", "FindPopup", "width=400,height=600,left=200,top=100");
  };

  // 스타일 관련 코드는 이전과 동일하므로 생략합니다.
  // ... containerStyle, boxStyle, inputStyle, buttonStyle 등 ...

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    paddingTop: "4rem",
    justifyContent: "center",
  };

  const boxStyle = {
    backgroundColor: "#AAD1E7",
    padding: "2rem",
    borderRadius: "1rem",
    width: "100%",
    maxWidth: "400px",
    border: "1px solid #111111"
  };

  const inputStyle = {
    width: "calc(100% - 1rem)",
    padding: "0.5rem",
    marginBottom: "1rem",
    border: "1px solid #ffffff",
    borderRadius: "0.5rem",
    fontSize: "0.9rem",
    boxSizing: "border-box",
  };

  const labelStyle = {
    marginBottom: "0.5rem",
    display: "block",
    fontSize: "0.9rem",
  };

  const buttonStyle = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#94A0D1",
    color: "#000000",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    cursor: "pointer",
  };

  const kakaoButtonStyle = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#FEE500",
    color: "#000000",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "0.5rem",
  };

  const naverButtonStyle = {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#03c75a",
    color: "#000000",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "0.5rem",
  };

  const linkStyle = {
    color: "#0070b6",
    textDecoration: "none",
    marginLeft: "0.25rem",
  };


  return (
      <div style={containerStyle}>
        <div style={boxStyle}>
          <h2 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.5rem" }}>
            로그인
          </h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label style={labelStyle}>아이디</label>
              <input
                  type="text"
                  style={inputStyle}
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                  placeholder="id"
              />
            </div>
            <div>
              <label style={labelStyle}>비밀번호</label>
              <input
                  type="password"
                  style={inputStyle}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="pw"
              />
            </div>
            <button type="submit" style={buttonStyle}>
              로그인
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
            계정이 없으신가요?
            <a href="/signup" style={linkStyle}>회원가입</a>
          </p>

          <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
            아이디, 비밀번호를 잊으셨나요?
            <br />
            <span onClick={handleFindClick} style={{ ...linkStyle, cursor: "pointer" }}>
            아이디/비밀번호 찾기
          </span>
          </p>

          {/* Kakao 로그인 버튼의 type을 "submit"에서 "button"으로 변경하고 onClick 핸들러 연결 */}
          <button type="button" style={kakaoButtonStyle} onClick={handleKakaoLogin}>
            Kakao로 로그인
          </button>
          <button type="submit" style={naverButtonStyle}>Naver로 로그인</button>
        </div>
      </div>
  );
}