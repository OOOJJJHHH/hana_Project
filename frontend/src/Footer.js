import React, { useState } from 'react';
import styled from 'styled-components';

const Footer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);  // 팀 소개 팝업 상태 관리
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);  // 이용 약관 팝업 상태 관리

    const openModal = () => {
        setIsModalOpen(true);  // 팀 소개 모달 열기
    };

    const closeModal = () => {
        setIsModalOpen(false);  // 팀 소개 모달 닫기
    };

    const openTermsModal = () => {
        setIsTermsModalOpen(true);  // 이용 약관 모달 열기
    };

    const closeTermsModal = () => {
        setIsTermsModalOpen(false);  // 이용 약관 모달 닫기
    };

    return (
        <FooterContainer>
            {/* 4행 4열 레이아웃 */}
            <GridContainer>
                <StyledDiv style={{ fontSize: "20px", fontWeight: "bold" }}>고객지원실 운영안내</StyledDiv>
                {/* 팀 소개 클릭 */}
                <StyledDiv onClick={openModal} style={{ fontSize: "15px", marginLeft: "250px", color: "gray", cursor: "pointer" }}>
                    팀 소개
                </StyledDiv>
                <StyledDiv style={{ fontSize: "15px", marginLeft: "200px", color: "gray" }}>파트너</StyledDiv>
                <StyledDiv style={{ fontSize: "15px", marginLeft: "180px", color: "gray" }}>지원</StyledDiv>

                <StyledDiv noMargin>상담 시간 09:00 ~ 16:20</StyledDiv>

                <StyledDiv style={{ fontSize: "15px", marginLeft: "250px", color: "gray" }}>회사소개</StyledDiv>
                <StyledDiv style={{ fontSize: "15px", marginLeft: "200px", color: "gray" }}>파트너 홈</StyledDiv>
                <StyledDiv style={{ fontSize: "15px", marginLeft: "180px", color: "gray" }}>공지사항/FAQ</StyledDiv>

                <StyledDiv noMargin>점심 시간 12:35 ~ 13:35</StyledDiv>

                <StyledDiv style={{ fontSize: "15px", marginLeft: "250px", color: "gray" }}>채용</StyledDiv>
                <StyledDiv style={{ fontSize: "15px", marginLeft: "200px", color: "gray" }}>마케팅/제휴 문의</StyledDiv>
                <StyledDiv style={{ fontSize: "15px", marginLeft: "180px", color: "gray" }}>최저가 보장제</StyledDiv>

                <StyledDiv noMargin>우선 상담 1234 ~ 5678</StyledDiv>

                <StyledDiv style={{ fontSize: "15px", marginLeft: "250px", color: "gray" }}>공고</StyledDiv>
            </GridContainer>
            <HorizontalLine />

            <GridContainer_bottom>
                {/* 이용 약관만 클릭 가능 */}
                <StyledDivBottom onClick={openTermsModal}style={{cursor: "pointer"}}>이용 약관</StyledDivBottom>
                <StyledDivBottom>개인정보 처리방침</StyledDivBottom>
                <StyledDivBottom>취소 및 환불 정책</StyledDivBottom>

                <StyledDivBottom>상호명여간행장</StyledDivBottom>
                <StyledDivBottom>주소: 신구대학교 남관 111호 PBL룸</StyledDivBottom>
                <StyledDivBottom></StyledDivBottom>

                <StyledDivBottom>세계 여러나라의 숙박업소를 보여주는 사이트입니다.</StyledDivBottom>
            </GridContainer_bottom>

            {/* 팀 소개 팝업 */}
            {isModalOpen && (
                <ModalOverlay>
                    <Modal>
                        <h1 style={{ color: "blue", textAlign: "center" }}>팀 소개</h1>
                        <p>조장: 오준희</p>
                        <p>조원: 백승범, 이어진, 한석현</p>
                        <ButtonContainer>
                            <button onClick={closeModal}>닫기</button>
                        </ButtonContainer>
                    </Modal>
                </ModalOverlay>
            )}

            {/* 이용 약관 팝업 */}
            {isTermsModalOpen && (
                <ModalOverlay>
                    <Modal>
                        <h1 style={{ color: "blue", textAlign: "center" }}>이용 약관</h1>
                        <p>여기는 이용 약관</p>
                        <ButtonContainer>
                            <button onClick={closeTermsModal}>닫기</button>
                        </ButtonContainer>
                    </Modal>
                </ModalOverlay>
            )}
        </FooterContainer>
    );
};

// Footer 스타일링
const FooterContainer = styled.div`
    margin-top: auto;
    background-color: white;
    color: black;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
`;

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr); 
    grid-template-rows: auto; 
    gap: 0;
    margin-top: 100px;
    width: 100%;
    max-width: 1180px;
`;

const GridContainer_bottom = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr); 
    grid-template-rows: auto; 
    color: gray;
    gap: 0; /* Removes the gap between grid items */
    margin-top: 20px;
    width: 100%;
    max-width: 1180px;
`;

const StyledDivBottom = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
    
`;

const StyledDiv = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 0;
    margin-bottom: 0;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Modal = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 300px;

    button {
        margin-top: 20px;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;

const HorizontalLine = styled.div`
    width: 1180px;
    height: 1px;
    background-color: gray;
    margin-top: 30px;
`;

export default Footer;
