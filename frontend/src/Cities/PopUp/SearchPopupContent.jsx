import React, {useEffect, useState} from "react";

const SearchPopupContent = ({onclose , cityName}) => {

    const[lodData, setLodData] = useState();
    const[error, setError] = useState();

    // 도시 검색을 수행하는 함수
    useEffect( () => {
        const fetchData = async () => {
            try {
                // Spring Boot API 호출
                console.log(cityName)
                const response = await fetch(`http://localhost:8080/findByName?cityName=${cityName}`);

                if (!response.ok) {
                    // 오류 처리 (도시가 없을 경우)
                    throw new Error('City not found');
                }
                const data = await response.json();  // JSON 형식으로 응답 받음
                setLodData(data);  // 받아온 데이터를 state에 저장
                setError(null);  // 에러 초기화
            } catch (err) {
                console.log(err.message);
                setError(err.message);  // 에러 메시지 저장
                setLodData(null);  // 데이터 초기화
            }
        }

        fetchData();
    }, [cityName]);// cityName이 변경될 때마다 useEffect가 실행됨


// 팝업창 내용 스타일
    const popupContentStyle = {
        position: "fixed",
        zIndex: "1",
        justifyContent : "center",
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '15px',
        boxShadow: '0 40px 60px rgba(0, 0, 0, 0.8)',
        width: "500px"
    };

    return(
        <div style={popupContentStyle}>
            {lodData && (
                lodData.map((lodContent, index) => (
                    <div>
                        <div style={{border: "1px solid black"}}>
                            <p>주인 이름 : {lodContent.lodOwner}</p>
                            <p>숙소 명 : {lodContent.lodName}</p>
                        </div>
                        <button>수정 버튼</button>
                        <button>제거 버튼</button>
                    </div>
                ))
            )}
            <button onClick={onclose}>닫기</button>
        </div>

    );
}

export default SearchPopupContent;