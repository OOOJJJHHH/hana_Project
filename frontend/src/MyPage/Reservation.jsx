import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Reservation() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`${process.env.REACT_APP_API_URL}/getlodUseN/숙소1`)  // 여기서 숙소1 하드코딩
            .then(response => {
                setData(response.data);
                setError(null);
            })
            .catch(err => {
                setError(err.message || "에러 발생");
                setData(null);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>로딩중...</div>;
    if (error) return <div>에러: {error}</div>;

    return (
        <div>
            <h1>API 응답 테스트</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default Reservation;
