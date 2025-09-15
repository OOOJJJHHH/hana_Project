import { useState } from "react";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";

export default function FindAccountForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState("id");
  const [loading, setLoading] = useState(false);

  const handleFindId = async () => {
    if (!email) {
      setMessage("이메일을 입력하세요.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(`${API_BASE}/api/auth/find-id`, { email }, { withCredentials: true });
      const userId = res.data.userId;
      setMessage(`이메일(${email})로 등록된 아이디는 ${userId} 입니다.`);
    } catch (e) {
      if (e.response?.status === 404) {
        setMessage("해당 이메일로 등록된 아이디가 없습니다.");
      } else {
        setMessage("아이디 조회 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFindPassword = () => {
    setMessage(`아이디(${username})로 등록된 이메일로 임시 비밀번호를 전송했습니다.`);
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      padding: "16px",
    },
    card: {
      background: "#ffffff",
      padding: "24px",
      borderRadius: "12px",
      width: "100%",
      maxWidth: "400px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      textAlign: "center",
    },
    heading: {
      fontSize: "24px",
      marginBottom: "20px",
    },
    tabs: {
      display: "flex",
      justifyContent: "space-around",
      marginBottom: "20px",
    },
    tabButton: {
      flex: 1,
      padding: "10px",
      border: "none",
      background: "#eee",
      cursor: "pointer",
      fontWeight: "bold",
    },
    activeTab: {
      background: "#6366f1",
      color: "white",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    input: {
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "16px",
    },
    formButton: {
      padding: "10px",
      background: "#6366f1",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      cursor: "pointer",
    },
    message: {
      marginTop: "16px",
      color: "green",
      fontSize: "14px",
    },
    backButton: {
      marginTop: "20px",
      padding: "10px",
      background: "#8db5b3",
      color: "white",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
    },
  };

  return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.heading}>아이디 & 비밀번호 찾기</h2>
          <div style={styles.tabs}>
            <button
                style={tab === "id" ? { ...styles.tabButton, ...styles.activeTab } : styles.tabButton}
                onClick={() => setTab("id")}
            >
              아이디 찾기
            </button>
            <button
                style={tab === "password" ? { ...styles.tabButton, ...styles.activeTab } : styles.tabButton}
                onClick={() => setTab("password")}
            >
              비밀번호 찾기
            </button>
          </div>

          {tab === "id" && (
              <div style={styles.form}>
                <input
                    type="email"
                    placeholder="가입한 이메일을 입력하세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleFindId} style={styles.formButton} disabled={loading}>
                  {loading ? "조회 중..." : "아이디 찾기"}
                </button>
              </div>
          )}

          {tab === "password" && (
              <div style={styles.form}>
                <input
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handleFindPassword} style={styles.formButton}>비밀번호 찾기</button>
              </div>
          )}

          {message && <p style={styles.message}>{message}</p>}
        </div>
      </div>
  );
}