import React, { useContext, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { UserUpdateContext } from "../Session/UserContext";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const setUserInfo = useContext(UserUpdateContext);
  const [userType, setUserType] = useState("");

  const handleGoogleCallback = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google User:", decoded);

      const userInfoToSend = {
        uId: `google_${decoded.sub}`,
        uIdEmail: decoded.email,
        uFirstName: decoded.given_name || "",
        uLastName: decoded.family_name || "",
        uUser: "tenant",
      };

      const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/googleLogin`,
          userInfoToSend,
          { withCredentials: true }
      );

      if (res.data) {
        setUserInfo(res.data);
        setUserType(res.data.userType);
        localStorage.setItem("loginUser", JSON.stringify(res.data));
        window.location.href = "/";
      }
    } catch (err) {
      console.error("Google login error", err);
      alert("구글 로그인 중 문제가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/login`,
          { uId: id, uPassword: password },
          { withCredentials: true }
      );

      if (response.data) {
        setUserInfo(response.data);
        setUserType(response.data.userType);
        localStorage.setItem("loginUser", JSON.stringify(response.data));
        window.location.href = "/";
      }
    } catch (error) {
      console.error("로그인 실패", error);
      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  const handleFindClick = () => {
    window.open(
        "/popup/find",
        "FindPopup",
        "width=400,height=600,left=200,top=100"
    );
  };

  // ✅ 모던 스타일
  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif",
    },
    box: {
      backgroundColor: "#fff",
      padding: "3rem",
      borderRadius: "1.5rem",
      width: "100%",
      maxWidth: "420px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    },
    title: {
      textAlign: "center",
      fontSize: "1.8rem",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "2rem",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontSize: "0.9rem",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      marginBottom: "1.5rem",
      border: "1px solid #ccc",
      borderRadius: "0.5rem",
      fontSize: "1rem",
      transition: "border 0.2s",
    },
    button: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: "#6366f1",
      color: "#fff",
      border: "none",
      borderRadius: "0.5rem",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "background 0.3s",
    },
    buttonHover: {
      backgroundColor: "#4f46e5",
    },
    link: {
      color: "#4f46e5",
      textDecoration: "none",
      cursor: "pointer",
      marginLeft: "0.3rem",
    },
    googleWrapper: {
      marginTop: "1.5rem",
      display: "flex",
      justifyContent: "center",
    },
    footerText: {
      textAlign: "center",
      fontSize: "0.9rem",
      marginTop: "1rem",
      color: "#555",
    },
  };

  return (
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <div style={styles.container}>
          <div style={styles.box}>
            <h2 style={styles.title}>로그인</h2>
            <form onSubmit={handleSubmit}>
              <label style={styles.label}>아이디</label>
              <input
                  type="text"
                  style={styles.input}
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                  placeholder="아이디 입력"
              />

              <label style={styles.label}>비밀번호</label>
              <input
                  type="password"
                  style={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="비밀번호 입력"
              />

              <button type="submit" style={styles.button}>
                로그인
              </button>
            </form>

            <p style={styles.footerText}>
              계정이 없으신가요?
              <a href="/signup" style={styles.link}>
                회원가입
              </a>
            </p>

            <p style={styles.footerText}>
              아이디/비밀번호를 잊으셨나요?
              <span onClick={handleFindClick} style={styles.link}>
              찾기
            </span>
            </p>

            <div style={styles.googleWrapper}>
              <GoogleLogin
                  onSuccess={handleGoogleCallback}
                  onError={() => alert("구글 로그인 실패")}
              />
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
  );
}
