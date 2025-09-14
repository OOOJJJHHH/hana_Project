import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UKWeatherChartTable = () => {
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState(null);

    const API_KEY = '76f59296790eca380cc7389d1bbe8877';  // 여기에 발급받은 키 넣기

    useEffect(() => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=London,uk&appid=${API_KEY}&units=metric`)
            .then(res => {
                if (!res.ok) throw new Error('Weather API fetch error');
                return res.json();
            })
            .then(data => {
                setForecast(data);
            })
            .catch(err => {
                setError(err.message);
            });
    }, []);

    if (error) return <div>에러: {error}</div>;
    if (!forecast) return <div>로딩 중...</div>;

    // 그래프용 데이터 가공: 시간 문자열 + 온도
    const chartData = forecast.list.map(item => ({
        time: item.dt_txt,
        temp: item.main.temp
    }));

    return (
        <div style={{ width: '90%', maxWidth: '800px', margin: '20px auto' }}>
            <h2 style={{ textAlign: 'center' }}>런던 5일 예보 온도 변화</h2>

            {/* 그래프 */}
            <ResponsiveContainer width="100%" height={300}>
                <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tickFormatter={(tick) => tick.substr(5,11)} interval={7} />
                    <YAxis domain={['auto', 'auto']} unit="°C" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="temp" name="온도 (°C)" stroke="#8884d8" dot={false} />
                </LineChart>
            </ResponsiveContainer>


        </div>
    );
};

export default UKWeatherChartTable;
