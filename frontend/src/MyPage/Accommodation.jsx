import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Accommodation = ({ uId }) => {
    const [lodgings, setLodgings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLodgings = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/getlodbyUid/${uId}`);
                setLodgings(res.data);
            } catch (err) {
                console.error("숙소 목록 불러오기 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        if (uId) fetchLodgings();
    }, [uId]);

    // 숙소 삭제 요청
    const handleDeleteLodging = async (lodId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/lodging/${lodId}`);
            setLodgings((prevLodgings) => prevLodgings.filter((lod) => lod.id !== lodId));
            alert("숙소가 삭제되었습니다.");
        } catch (error) {
            console.error("숙소 삭제 실패:", error);
            alert("숙소 삭제 실패");
        }
    };

    // 숙소 수정 페이지로 이동
    const handleEditLodging = (lodId) => {
        alert("숙소 수정 페이지로 이동");
        // 숙소 수정 페이지로 이동 로직
    };

    return (
        <Container>
            <Title>내가 등록한 숙소 목록</Title>

            {loading ? (
                <p>로딩 중...</p>
            ) : lodgings.length === 0 ? (
                <EmptyBox>
                    <EmptyImage src="/no-results.png" alt="No lodgings" />
                    <EmptyTitle>등록된 숙소가 없습니다</EmptyTitle>
                    <EmptyText>숙소를 등록하고 방문자들을 맞이해보세요!</EmptyText>
                    <RegisterButton onClick={() => alert("등록 페이지로 이동 예정")}>숙소 등록하러 가기</RegisterButton>
                </EmptyBox>
            ) : (
                <LodgingList>
                    {lodgings.map((lod) => (
                        <LodgingItem key={lod.id}>
                            <Link to={`/hotel-detail?name=${lod.lodName}`}>
                                <LodgingTitle>{lod.lodName}</LodgingTitle>
                            </Link>
                            <p><strong>도시:</strong> {lod.lodCity}</p>
                            <p><strong>주소:</strong> {lod.lodLocation}</p>
                            <p><strong>전화번호:</strong> {lod.lodCallNum}</p>
                            {lod.lodImageUrl && <LodgingImage src={lod.lodImageUrl} alt={`${lod.lodName} 이미지`} />}
                            <div>
                                {/* 삭제 버튼 */}
                                <button onClick={() => handleDeleteLodging(lod.id)}>삭제</button>
                                {/* 수정 버튼 */}
                                <button onClick={() => handleEditLodging(lod.id)}>수정</button>
                            </div>
                        </LodgingItem>
                    ))}
                </LodgingList>
            )}
        </Container>
    );
};

const Container = styled.div`
    padding: 30px;
`;

const Title = styled.h1`
    font-size: 32px;
    margin-bottom: 20px;
`;

const EmptyBox = styled.div`
    text-align: center;
    padding: 60px 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #f9f9f9;
    color: #555;
    max-width: 600px;
    margin: 50px auto;
`;

const EmptyImage = styled.img`
    width: 120px;
    height: 120px;
    margin-bottom: 20px;
    opacity: 0.6;
`;

const EmptyTitle = styled.h2`
    font-size: 24px;
    margin-bottom: 10px;
`;

const EmptyText = styled.p`
    font-size: 16px;
`;

const RegisterButton = styled.button`
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;

const LodgingList = styled.ul`
    list-style: none;
    padding: 0;
`;

const LodgingItem = styled.li`
    border: 1px solid #ccc;
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const LodgingTitle = styled.h2`
    font-size: 24px;
    color: #333;
    text-decoration: none;
    &:hover {
        color: #007bff;
    }
`;

const LodgingImage = styled.img`
    width: 100%;
    max-width: 400px;
    height: auto;
    margin-top: 10px;
    border-radius: 5px;
`;

export default Accommodation;
