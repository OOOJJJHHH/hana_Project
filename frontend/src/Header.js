// Header.jsx
import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, UserUpdateContext } from "./Session/UserContext";
import axios from "axios";
import SearchPreview from "./HeaderSearchView/SearchPreview";
import { debounce } from "lodash";

const NAV_HEIGHT = 70; // 메뉴바 높이

const Header = () => {
    const navigate = useNavigate();
    const userInfo = useContext(UserContext);
    const setUserInfo = useContext(UserUpdateContext);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const searchWrapperRef = useRef(null);
    const sentinelRef = useRef(null);

    // 로그아웃
    const Logout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`, {}, { withCredentials: true });
            setUserInfo(null);
            localStorage.removeItem("loginUser");
            navigate("/login");
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    // 검색 (debounce 적용)
    useEffect(() => {
        if (!searchQuery.trim()) {
            setShowPreview(false);
            return;
        }
        const debouncedSearch = debounce(async () => {
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
        }, 300);

        debouncedSearch();
        return () => debouncedSearch.cancel();
    }, [searchQuery]);

    // 외부 클릭 시 미리보기 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
                setShowPreview(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // IntersectionObserver로 스크롤 감지
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsScrolled(!entry.isIntersecting),
            { root: null, threshold: 0 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, []);

    // ================= 스타일 =================
    const headerWrapperStyle = {
        width: "100%",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "#fff",
        zIndex: 1000,
    };

    const topRowStyle = {
        display: isScrolled ? "none" : "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "1400px",
        justifyContent: "space-between",
        padding: "10px 40px",
        boxSizing: "border-box",
        margin: "0 auto",
        // 스크롤 전에도 구분
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
    };

    const logoButtonStyle = { background: "transparent", border: "none", cursor: "pointer" };
    const logoH1Style = { fontSize: "1.8rem", fontWeight: "bold", color: "#333", margin: 0 };

    const searchWrapperStyle = { display: "flex", position: "relative", gap: "10px", width: "40%" };
    const searchInputStyle = { width: "100%", padding: "8px 12px", border: "2px solid #ddd", borderRadius: "10px", fontSize: "0.9rem" };
    const loginTextStyle = { display: "flex", alignItems: "center" };
    const headMyLogButtonStyle = { backgroundColor: "white", border: "1px solid black", padding: "5px 10px", borderRadius: "5px", margin: "0 15px 0 0", cursor: "pointer" };

    const navStyle = {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        position: isScrolled ? "fixed" : "relative",
        top: isScrolled ? 0 : "auto",
        left: 0,
        backgroundColor: "#ffffff",
        zIndex: 1100,
        boxShadow: isScrolled ? "0 2px 6px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.05)", // 스크롤 전에도 약간 그림자
        padding: "10px 0",
        transition: "box-shadow 0.2s ease",
    };

    const navListStyle = { listStyle: "none", display: "flex", gap: "80px", margin: "0 0 0 0", padding: 0 };
    const navLinkStyle = { color: "black", fontWeight: 700, textDecoration: "none", fontSize: "1rem" };

    return (
        <>
            <div style={headerWrapperStyle}>
                {/* 로고 + 검색 + 로그인 */}
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
                        {showPreview && (
                            <SearchPreview
                                searchResults={searchResults}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                itemsPerPage={4}
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
                                !! <strong style={{ fontSize: "16px" }}>{userInfo.uFirstName}</strong> !!님 반가워요
                            </p>
                            <button style={headMyLogButtonStyle} onClick={() => navigate("/UserMyPage")}>마이페이지</button>
                            <button style={headMyLogButtonStyle} onClick={Logout}>로그아웃</button>
                        </span>
                    )}
                </div>

                {/* sentinel */}
                <div ref={sentinelRef} style={{ height: 1 }} />
            </div>

            {/* placeholder: nav가 fixed일 때 본문 밀림 방지 */}
            {isScrolled && <div style={{ height: `${NAV_HEIGHT}px` }} />}

            {/* 네비게이션 */}
            <nav style={navStyle}>
                <ul style={navListStyle}>
                    <li><a style={navLinkStyle} href="/city">도시들</a></li>
                    <li><a style={navLinkStyle} href="/local">현지인</a></li>
                    <li><a style={navLinkStyle} href="/about">이벤트</a></li>
                </ul>
            </nav>
        </>
    );
};

export default Header;
