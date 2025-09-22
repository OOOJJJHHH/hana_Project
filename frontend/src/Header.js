import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserUpdateContext } from "./Session/UserContext";
import axios from "axios";
import SearchPreview from "./HeaderSearchView/SearchPreview"; // 검색 결과 미리보기 컴포넌트

const Header = () => {
    const navigate = useNavigate();

    const userInfo = useContext(UserContext);
    const setUserInfo = useContext(UserUpdateContext);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState(null);
    const itemsPerPage = 4;

    const searchWrapperRef = useRef(null);

    const Logout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`, {}, { withCredentials: true });
            setUserInfo(null);
            localStorage.removeItem('loginUser');
            navigate("/login");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            alert("숙소명을 입력해주세요!");
            return;
        }

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/hotels/search`, {
                params: { query: searchQuery },
            });
            setSearchResults(res.data);
            setShowPreview(true);
            setCurrentPage(1);
            setErrorMessage(null);
        } catch (error) {
            console.error("검색 에러:", error);
            setErrorMessage("검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            setShowPreview(true);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
                setShowPreview(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ====== 인라인 스타일 객체 ======
    const headerStyle = { display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 40px", backgroundColor: "#ffffff", width: "100%", position: "relative", boxShadow: "0 2px 6px rgba(0,0,0,0.05)", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" };
    const topRowStyle = { display: "flex", alignItems: "center", width: "100%", maxWidth: "1400px", justifyContent: "space-between" };
    const logoButtonStyle = { background: "transparent", border: "none", cursor: "pointer" };
    const logoH1Style = { fontSize: "1.8rem", fontWeight: "bold", color: "#333" };
    const searchWrapperStyle = { display: "flex", position: "relative", gap: "10px" };
    const searchInputStyle = { width: "400px", padding: "8px 12px", border: "2px solid #ddd", borderRadius: "10px", fontSize: "1rem" };
    const searchButtonStyle = { padding: "8px 16px", backgroundColor: "#ff5722", border: "none", borderRadius: "10px", color: "white", cursor: "pointer", fontWeight: 600 };
    const loginTextStyle = { display: "flex", alignItems: "center" };
    const headMyLogButtonStyle = { backgroundColor: "white", border: "1px solid black", padding: "5px 10px", borderRadius: "5px", margin: "0 15px 0 0", cursor: "pointer" };
    const navStyle = { width: "100%", display: "flex", justifyContent: "center", marginTop: "10px" };
    const navListStyle = { listStyle: "none", display: "flex", gap: "40px", margin: 0, padding: 0 };
    const navItemStyle = { display: "inline-block" };
    const navLinkStyle = { color: "black", fontWeight: 700, textDecoration: "none", fontSize: "1.2rem" };

    return (
        <div style={headerStyle}>
            <div style={topRowStyle}>
                <button style={logoButtonStyle} onClick={() => navigate("/")}>
                    <h1 style={logoH1Style}>여가</h1>
                </button>

                <div style={searchWrapperStyle} ref={searchWrapperRef}>
                    <input
                        type="text"
                        placeholder="숙소명을 입력해주세요!"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={searchInputStyle}
                    />
                    <button style={searchButtonStyle} onClick={handleSearch}>검색</button>

                    {showPreview && (
                        <SearchPreview
                            searchResults={searchResults}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            errorMessage={errorMessage}
                            searchQuery={searchQuery}
                        />
                    )}
                </div>

                {userInfo == null ? (
                    <span style={loginTextStyle}>
                        <button style={headMyLogButtonStyle} onClick={() => navigate("/login")}>Login</button>
                    </span>
                ) : (
                    <span style={loginTextStyle}>
                        <p style={{ marginRight: "15px" }}>
                            !! <strong style={{ fontSize: "25px" }}>{userInfo.uFirstName}</strong> !!님 반가워요
                        </p>
                        <button style={headMyLogButtonStyle} onClick={() => navigate("/UserMyPage")}>마이페이지</button>
                        <button style={headMyLogButtonStyle} onClick={Logout}>로그아웃</button>
                    </span>
                )}
            </div>

            <nav style={navStyle}>
                <ul style={navListStyle}>
                    <li style={navItemStyle}><a style={navLinkStyle} href="/city">도시들</a></li>
                    <li style={navItemStyle}><a style={navLinkStyle} href="/local">현지인</a></li>
                    <li style={navItemStyle}><a style={navLinkStyle} href="/about">이벤트</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default Header;
