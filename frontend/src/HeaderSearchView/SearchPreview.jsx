import React from 'react';
import styled from 'styled-components';

// props로 검색 결과, 현재 페이지, 페이지 변경 함수, itemsPerPage, 에러 메시지, 검색어를 받음
const SearchPreview = ({
                           searchResults,
                           currentPage,
                           setCurrentPage,
                           itemsPerPage,
                           errorMessage,
                           searchQuery
                       }) => {
    // 페이지네이션 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(searchResults.length / itemsPerPage);

    return (
        <PreviewDropdown>
            <PreviewBox>
                <h3>현재 입력한 "{searchQuery}" 에 대한 검색 결과</h3>
                {errorMessage ? (
                    <ErrorMessage>{errorMessage}</ErrorMessage>
                ) : (
                    <>
                        <CardGrid>
                            {currentItems.map((hotel) => (
                                <Card key={hotel.id}>
                                    <img src={hotel.imageUrl} alt={hotel.name} />
                                    <h4>{hotel.name}</h4>
                                    <p>{hotel.location}</p>
                                </Card>
                            ))}
                        </CardGrid>

                        {searchResults.length > 0 && (
                            <Pagination>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <PageButton
                                        key={i}
                                        active={i + 1 === currentPage}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </PageButton>
                                ))}
                            </Pagination>
                        )}
                    </>
                )}
            </PreviewBox>
        </PreviewDropdown>
    );
};

// ===============================
// 스타일 정의
// ===============================
const PreviewDropdown = styled.div`
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 1000;
`;

const PreviewBox = styled.div`
    width: 90%;
    max-width: 1000px;
    background: #fafafa;
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

const ErrorMessage = styled.p`
    color: red;
    font-weight: bold;
    text-align: center;
    margin-top: 10px;
`;

const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-top: 10px;
`;

const Card = styled.div`
    background: white;
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 10px;
    text-align: center;

    img {
        width: 100%;
        height: 100px;
        object-fit: cover;
        border-radius: 8px;
    }

    h4 {
        margin: 10px 0 5px;
    }

    p {
        font-size: 0.85rem;
        color: gray;
    }
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 10px;
    gap: 6px;
`;

const PageButton = styled.button`
    padding: 5px 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: ${(props) => (props.active ? "#ff5722" : "white")};
    color: ${(props) => (props.active ? "white" : "black")};
    cursor: pointer;

    &:hover {
        background: #ff5722;
        color: white;
    }
`;

export default SearchPreview;
