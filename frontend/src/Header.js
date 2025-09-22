import React, { useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserUpdateContext } from "./Session/UserContext";
import axios from "axios";
import SearchPreview from "./HeaderSearchView/SearchPreview"; // ✅ 검색 결과 미리보기 컴포넌트

// ===============================
// 1. Header 컴포넌트
// ===============================
const Header = () => {
    const navigate = useNavigate(); // 페이지 이동 훅

    // ===============================
    // 2. 사용자 정보
    // ===============================
    const userInfo = useContext(UserContext); // 로그인한 사용자 정보
    const setUserInfo = useContext(UserUpdateContext); // 사용자 정보 갱신 함수

    // ===============================
    // 3. 검색 관련 상태
    // ===============================
    const [searchQuery, setSearchQuery] = useState(""); // 검색 입력값
    const [searchResults, setSearchResults] = useState([]); // API 검색 결과 저장
    const [showPreview, setShowPreview] = useState(false); // 미리보기 창 표시 여부
    const [currentPage, setCurrentPage] = useState(1); // 페이지네이션 현재 페이지
    const [errorMessage, setErrorMessage] = useState(null); // 검색 오류 메시지
    const itemsPerPage = 4; // 한 페이지에 보여줄 검색 결과 개수

    // 검색창 + 버튼 영역 참조 (외부 클릭 시 미리보기 닫기 용)
    const searchWrapperRef = useRef(null);

    // ===============================
    // 4. 로그아웃 함수
    // ===============================
    const Logout = async () => {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/logout`, {}, { withCredentials: true });
            setUserInfo(null); // 사용자 상태 초기화
            localStorage.removeItem('loginUser'); // 로컬스토리지 삭제
            navigate("/login"); // 로그인 페이지 이동
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    // ===============================
    // 5. 검색 버튼 클릭 시 API 호출
    // ===============================
    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            alert("숙소명을 입력해주세요!");
            return;
        }
        try {
            // axios GET 요청, 쿼리파라미터로 searchQuery 전달
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/hotels/search`, {
                params: { query: searchQuery },
            });
            setSearchResults(res.data); // 검색 결과 저장
            setShowPreview(true); // 미리보기 창 표시
            setCurrentPage(1); // 페이지 초기화
            setErrorMessage(null); // 오류 메시지 초기화
        } catch (error) {
            console.error("검색 에러:", error);
            setErrorMessage("검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            setShowPreview(true); // 오류 발생 시에도 창 표시
        }
    };

    // ===============================
    // 6. 검색창 외부 클릭 시 미리보기 닫기
    // ===============================
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
                setShowPreview(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ===============================
    // 7. Header JSX
    // ===============================
    return (
        <HeaderContainer>
            {/* ===============================
                7-1. 상단 로고 + 검색창 + 로그인/마이페이지/로그아웃
            =============================== */}
            <TopRow>
                {/* 로고 버튼 */}
                <LogoButton onClick={() => navigate("/")}>
                    <h1>여가</h1>
                </LogoButton>

                {/* ===============================
                    7-2. 검색창 + 검색 버튼 + 미리보기
                    SearchPreview 컴포넌트로 분리
                =============================== */}
                <SearchWrapper ref={searchWrapperRef}>
                    <SearchInput
                        type="text"
                        placeholder="숙소명을 입력해주세요!"
                        value={searchQuery} // 상태 바인딩
                        onChange={(e) => setSearchQuery(e.target.value)} // 입력값 변경 시 상태 업데이트
                    />
                    <SearchButton onClick={handleSearch}>검색</SearchButton>

                    {/* 검색 결과 미리보기 */}
                    {showPreview && (
                        <SearchPreview
                            searchResults={searchResults} // 검색 결과 전달
                            currentPage={currentPage} // 현재 페이지
                            setCurrentPage={setCurrentPage} // 페이지 변경 함수
                            itemsPerPage={itemsPerPage} // 한 페이지당 아이템 수
                            errorMessage={errorMessage} // 오류 메시지
                            searchQuery={searchQuery} // 현재 검색어
                        />
                    )}
                </SearchWrapper>

                {/* ===============================
                    7-3. 로그인 / 마이페이지 / 로그아웃
                =============================== */}
                {userInfo == null ? (
                    <LoginText>
                        <button style={headMyLogButton} onClick={() => navigate("/login")}>Login</button>
                    </LoginText>
                ) : (
                    <LoginText>
                        <p style={{ marginRight: "15px" }}>
                            !! <strong style={{ fontSize: "25px" }}>{userInfo.uFirstName}</strong> !!님 반가워요
                        </p>
                        <button style={headMyLogButton} onClick={() => navigate("/UserMyPage")}>마이페이지</button>
                        <button style={headMyLogButton} onClick={Logout}>로그아웃</button>
                    </LoginText>
                )}
            </TopRow>

            {/* ===============================
                7-4. 네비게이션 메뉴
            =============================== */}
            <Nav>
                <NavList>
                    <NavItem><NavLink href="/city">도시들</NavLink></NavItem>
                    <NavItem><NavLink href="/local">현지인</NavLink></NavItem>
                    <NavItem><NavLink href="/about">이벤트</NavLink></NavItem>
                </NavList>
            </Nav>
        </HeaderContainer>
    );
};

// ===============================
// 8. 스타일 및 버튼
// ===============================
const headMyLogButton = {
    backgroundColor: "white",
    border: "1px solid black",
    padding: "5px 10px",
    borderRadius: "5px",
    margin: "0 15px 0 0",
    cursor: "pointer"
};

const HeaderContainer = styled.header`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 40px;
    background-color: #ffffff;
    width: 100%;
    position: relative;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const TopRow = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 1400px;
    justify-content: space-between;
`;

const LogoButton = styled.button`
    background: transparent;
    border: none;
    cursor: pointer;
    h1 {
        font-size: 1.8rem;
        font-weight: bold;
        color: #333;
    }
`;

const SearchWrapper = styled.div`
    display: flex;
    position: relative; /* SearchPreview absolute 위치 기준 */
    gap: 10px;
`;

const SearchInput = styled.input`
    width: 300px;
    padding: 8px 12px;
    border: 2px solid #ddd;
    border-radius: 10px;
    font-size: 1rem;
`;

const SearchButton = styled.button`
    padding: 8px 16px;
    background-color: #ff5722;
    border: none;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    font-weight: 600;
    transition: background 0.2s ease;

    &:hover {
        background-color: #e64a19;
    }
`;

const LoginText = styled.span`
    display: flex;
    align-items: center;
`;

const Nav = styled.nav`
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px;
`;

const NavList = styled.ul`
    list-style: none;
    display: flex;
    gap: 40px;
    margin: 0;
    padding: 0;
`;

const NavItem = styled.li`
    display: inline-block;
`;

const NavLink = styled.a`
    color: black;
    font-weight: 700;
    text-decoration: none;
    font-size: 1.2rem;
    transition: color 0.3s ease;

    &:hover {
        text-decoration: underline;
        color: #ff5722;
    }
`;

export default Header;
