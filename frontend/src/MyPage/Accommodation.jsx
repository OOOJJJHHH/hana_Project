import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { UserContext } from "../Session/UserContext";
import axios from "axios";

// 👇 Accommodation 컴포넌트
const Accommodation = () => {
    const { uId } = useContext(UserContext);
    const [lodgings, setLodgings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLodgings = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/lod/getlodbyUid/${uId}`);
                setLodgings(res.data);
            } catch (err) {
                console.error("숙소 목록 불러오기 실패:", err);
            } finally {
                setLoading(false);
            }
        };

        if (uId) fetchLodgings();
    }, [uId]);

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
                    <RegisterButton onClick={() => alert("등록 페이지로 이동 예정")}>
                        숙소 등록하러 가기
                    </RegisterButton>
                </EmptyBox>
            ) : (
                <LodgingList>
                    {lodgings.map((lod) => (
                        <LodgingItem key={lod.id}>
                            <LodgingTitle>{lod.lodName}</LodgingTitle>
                            <p><strong>도시:</strong> {lod.lodCity}</p>
                            <p><strong>주소:</strong> {lod.lodLocation}</p>
                            <p><strong>전화번호:</strong> {lod.lodCallNum}</p>
                            {lod.lodImageUrl && (
                                <LodgingImage
                                    src={lod.lodImageUrl}
                                    alt={`${lod.lodName} 이미지`}
                                    onError={(e) => (e.target.src = "/default-lodging.jpg")}
                                />
                            )}
                        </LodgingItem>
                    ))}
                </LodgingList>
            )}
        </Container>
    );
};

// 💅 스타일 분리
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
`;

const LodgingImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: auto;
  margin-top: 10px;
  border-radius: 5px;
`;

export default Accommodation;
