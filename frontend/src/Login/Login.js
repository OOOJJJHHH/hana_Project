import React, { useState } from "react";

export default function LoginForm() {
  const [id, setid] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("로그인 시도:", { id, password });
  };

  const handleFindClick = () => {
    window.open("/popup/find", "FindPopup", "width=400,height=600,left=200,top=100");

  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    //justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    paddingTop: "4rem",
    
  };
  
  
  const boxStyle = {
    backgroundColor: "#AAD1E7",
    padding: "2rem",
    borderRadius: "1rem",
    width: "100%",
    maxWidth: "400px",
    border : "1px solid #111111"
  };
  

  const inputStyle = {
    width: "100%",
    padding: "0.5rem 0rem 0.5rem 0",
    marginBottom: "1rem",
    border: "1px solid #ffffff",
    borderRadius: "1rem",
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
            <label>아이디</label>
            <input
              type="text"
              style={inputStyle}
              value={id}
              onChange={(e) => setid(e.target.value)}
              required
              placeholder="   id"
            />
          </div>
          <div>
            <label>비밀번호</label>
            <input
              type="password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="   pw"
            />
          </div>
          <button type="submit" style={buttonStyle}>
            로그인
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
          계정이 없으신가요?
          <a href="/signup" style={linkStyle}> 회원가입 </a>
        </p>

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
          아이디, 비밀번호를 잊으셨나요?
          <br />
          <span onClick={handleFindClick} style={{ ...linkStyle, cursor: "pointer" }}>
            아이디/비밀번호 찾기
          </span>
        </p>

        <button type="submit" style={kakaoButtonStyle}>Kakao로 로그인</button>
        <button type="submit" style={naverButtonStyle}>Naver로 로그인</button>
      </div>
    </div>
  );
}
