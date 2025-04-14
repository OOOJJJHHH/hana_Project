import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; // Link 컴포넌트 import

const Header = () => {
  return (
    <HeaderContainer>
      <TopRow>
        <LogoButton onClick={() => window.location.href = '/'}>
          <h1>여가</h1>
        </LogoButton>
        
        <SearchInput type="text" placeholder="검색..." style={{ width: "100px"}}/>
        
        <LoginText>
          <Link to="/login">로그인</Link> {/* Link 컴포넌트를 사용하여 로그인 페이지로 이동 */}
        </LoginText>
      </TopRow>
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

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 40px; /* 위아래 여백 줄이기 */
  background-color: #ffffff;
  color: black;
  width: 100%;
  box-sizing: border-box;
  max-width: 100%;
  

  @media (max-width: 1400px) { 
    padding: 10px 20px; /* 작은 화면에서도 여백 줄이기 */
  }

  @media (max-width: 1200px) {
    padding: 10px 20px;
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  justify-content: space-between;
  padding: 0 10px; /* 좌우 여백 줄이기 */
  margin-bottom: 5px; /* 아래쪽 여백 줄이기 */
`;


const LogoButton = styled.button`
  margin-left : 70px;
  background: transparent;  /* 배경 투명 */
  color: black;
  border: none;  /* 테두리 투명 */
  cursor: pointer; /* 클릭 가능 표시 */
  padding: 0; /* 불필요한 여백 제거 */
  outline: none; /* 포커스 시 파란색 배경 제거 */
`;


const SearchInput = styled.input`
  width: 400px !important; /* 강제 적용 */
  padding: 10px;
  border: 3px solid #ddd;
  border-radius: 15px;
  font-size: 1rem;
`;

const LoginText = styled.span`
  width: 130px !important; /* 강제 적용 */
  font-size: 1.2rem;
  color: black;
  cursor: pointer;
  transition: color 0.3s ease;
  position: relative;  /* 위치 조정 */
  z-index: 10;  /* 메뉴보다 위로 */
  

  &:hover {
    color: #ff5722; /* hover 시 색상 변경 */
  }

  @media (max-width: 768px) {
    font-size: 1rem; /* 작은 화면에서 폰트 크기 줄이기 */
  }

  a {
    text-decoration: none;
    color: inherit; /* 링크의 기본 색상 스타일을 상속 */
  }
`;

const Nav = styled.nav`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 0px;
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 40px;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const NavItem = styled.li`
display: inline-block;
padding: 0px 150px;
`;


const NavLink = styled.a`
  color: black;
  font-weight: 700; 
  text-decoration: none;
  font-size: 1.2rem;
  display: inline-block;  /* 글자 크기만큼만 클릭 가능 */
  transition: color 0.3s ease;
  

  &:hover {
    text-decoration: underline;
    color: #ff5722;
  }
`;

export default Header;
