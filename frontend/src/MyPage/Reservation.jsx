import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Reservation() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const lodName = "숙소1";  // 동적으로 바꿔도 됨
    const encodedLodName = encodeURIComponent(lodName);

    useEffect(() => {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_URL}/getlodUseN/${encodedLodName}`)  // 여기서 숙소1 하드코딩
            .then(response => {
                setData(response.data);
                setError(null);
                console.log(response.data);
            })
            .catch(err => {
                setError(err.message || "에러 발생");
                setData(null);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>에러: {error}</div>;
    if (!data) return null;

    return (
        <div>
            <h1>{data.lodName} 숙소 정보</h1>
            <p>도시: {data.lodCity}</p>
            <p>주소: {data.lodLocation}</p>
            <p>연락처: {data.lodCallNum}</p>

            {/* 숙소 이미지 출력 */}
            <div>
                <h2>숙소 이미지</h2>
                <img
                    src={data.lodImag}
                    alt={`${data.lodName} 이미지`}
                    style={{ maxWidth: '400px', height: 'auto' }}
                />
            </div>

            {/* 객실 목록 출력 */}
            <div>
                <h2>객실 목록</h2>
                {data.rooms && data.rooms.length > 0 ? (
                    data.rooms.map(room => (
                        <div key={room.id} style={{ marginBottom: '20px' }}>
                            <h3>{room.roomName}</h3>
                            <img
                                src={room.roomImag}
                                alt={`${room.roomName} 이미지`}
                                style={{ maxWidth: '300px', height: 'auto' }}
                            />
                            <p>가격: {room.price.toLocaleString()}원</p>
                        </div>
                    ))
                ) : (
                    <p>등록된 객실이 없습니다.</p>
                )}
            </div>
        </div>
    );
}

export default Reservation;
