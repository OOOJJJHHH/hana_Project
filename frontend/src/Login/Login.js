import React, { useContext, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { UserUpdateContext } from "../Session/UserContext";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

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

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/googleLogin`, userInfoToSend, {
        withCredentials: true,
      });

      if (res.data) {
        console.log("Google 로그인 성공 응답 데이터:", res.data);
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
        console.log("일반 로그인 성공 응답 데이터:", response.data);
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
    window.open("/popup/find", "FindPopup", "width=400,height=600,left=200,top=100");
  };

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
    border: "1px solid #111111",
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

  const linkStyle = {
    color: "#0070b6",
    textDecoration: "none",
    marginLeft: "0.25rem",
  };

  return (
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
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
              <button type="submit" style={buttonStyle}>로그인</button>
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

            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
              <GoogleLogin onSuccess={handleGoogleCallback} onError={() => alert("구글 로그인 실패")} />
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
  );
}
