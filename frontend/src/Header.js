import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserUpdateContext } from "./Session/UserContext";
import axios from "axios";
import SearchPreview from "./HeaderSearchView/SearchPreview"; // 검색 결과 미리보기 컴포넌트
import { debounce } from "lodash"; // 입력 지연(debounce) 처리

const Header = () => {
    const navigate = useNavigate(); // 페이지 이동을 위한 훅

    // 사용자 정보 및 갱신 함수 가져오기
    const userInfo = useContext(UserContext);
    const setUserInfo = useContext(UserUpdateContext);

    // 검색 관련 상태
    const [searchQuery, setSearchQuery] = useState(""); // 검색 입력값
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 배열
    const [showPreview, setShowPreview] = useState(false); // 미리보기 표시 여부
    const [currentPage, setCurrentPage] = useState(1); // 페이지네이션 현재 페이지
    const [errorMessage, setErrorMessage] = useState(null); // 에러 메시지 상태
    const itemsPerPage = 4; // 페이지당 항목 수

    const searchWrapperRef = useRef(null); // 미리보기 영역 외 클릭 감지

    // 로그아웃 처리
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

    // ===========================
    // 검색 자동 실행(useEffect + debounce)
    // ===========================
    useEffect(() => {
        // 검색어가 없으면 미리보기 숨김
        if (!searchQuery.trim()) {
            setShowPreview(false);
            return;
        }

        // debounce: 사용자가 입력을 멈춘 후 300ms 뒤에 검색 실행
        const debouncedSearch = debounce(async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/hotels/search`, {
                    params: { query: searchQuery },
                });
                setSearchResults(res.data); // 검색 결과 업데이트
                setShowPreview(true);       // 미리보기 표시
                setCurrentPage(1);          // 페이지 초기화
                setErrorMessage(null);      // 에러 초기화
            } catch (error) {
                console.error("검색 에러:", error);
                setErrorMessage("검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                setShowPreview(true);       // 에러 표시용 미리보기
            }
        }, 300);

        debouncedSearch();

        // cleanup: 컴포넌트 언마운트 시 debounce 취소
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchQuery]);

    // ===========================
    // 외부 클릭 시 검색 미리보기 닫기
    // ===========================
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
                setShowPreview(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ===========================
    // 스타일 객체
    // ===========================
    const headerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "10px 40px",
        backgroundColor: "#ffffff",
        width: "100%",
        position: "relative",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    };

    const topRowStyle = {
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "1400px",
        justifyContent: "space-between"
    };

    const logoButtonStyle = { background: "transparent", border: "none", cursor: "pointer" };
    const logoH1Style = { fontSize: "1.8rem", fontWeight: "bold", color: "#333" };
    const searchWrapperStyle = { display: "flex", position: "relative", gap: "10px" };
    const searchInputStyle = { width: "400px", padding: "8px 12px", border: "2px solid #ddd", borderRadius: "10px", fontSize: "1rem" };
    const loginTextStyle = { display: "flex", alignItems: "center" };
    const headMyLogButtonStyle = { backgroundColor: "white", border: "1px solid black", padding: "5px 10px", borderRadius: "5px", margin: "0 15px 0 0", cursor: "pointer" };
    const navStyle = { width: "100%", display: "flex", justifyContent: "center", marginTop: "10px" };
    const navListStyle = { listStyle: "none", display: "flex", gap: "40px", margin: 0, padding: 0 };
    const navItemStyle = { display: "inline-block" };
    const navLinkStyle = { color: "black", fontWeight: 700, textDecoration: "none", fontSize: "1.2rem" };

    return (
        <div style={headerStyle}>
            {/* 상단 로고 + 검색 + 로그인/마이페이지 영역 */}
            <div style={topRowStyle}>
                {/* 로고 클릭 시 메인 페이지 이동 */}
                <button style={logoButtonStyle} onClick={() => navigate("/")}>
                    <h1 style={logoH1Style}>여가</h1>
                </button>

                {/* 검색 입력 및 미리보기 */}
                <div style={searchWrapperStyle} ref={searchWrapperRef}>
                    <input
                        type="text"
                        placeholder="숙소명을 입력해주세요!"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={searchInputStyle}
                    />
                    {/* 검색 버튼 제거, 입력 시 자동 검색 */}

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

                {/* 로그인 / 사용자 환영 메시지 */}
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

            {/* 네비게이션 */}
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
