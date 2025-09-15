import React, { useEffect, useState } from 'react';

const UKWeatherPopup = () => {
    const [forecast, setForecast] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [error, setError] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const API_KEY = '76f59296790eca380cc7389d1bbe8877';

    useEffect(() => {
        // 5일 예보
        fetch(`https://api.openweathermap.org/data/2.5/forecast?q=London,uk&appid=${API_KEY}&units=metric`)
            .then(res => res.ok ? res.json() : Promise.reject('Weather API fetch error'))
            .then(data => setForecast(data))
            .catch(err => setError(err));

        // 현재 날씨
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=${API_KEY}&units=metric`)
            .then(res => res.ok ? res.json() : Promise.reject('Current Weather API fetch error'))
            .then(data => setCurrentWeather(data))
            .catch(err => setError(err));
    }, []);

    if (error) return <div>에러: {error}</div>;
    if (!forecast || !currentWeather) return <div>로딩 중...</div>;

    // 날짜별 데이터 묶기
    const dailyData = {};
    forecast.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) dailyData[date] = [];
        dailyData[date].push(item);
    });

    const dates = Object.keys(dailyData);
    const selectedDate = dates[selectedIndex];
    const selectedDayData = dailyData[selectedDate] || [];

    const timeCards = selectedDayData.map(item => {
        const time = item.dt_txt.split(' ')[1].slice(0,5);
        const temp = Math.round(item.main.temp);
        const icon = item.weather[0].icon;
        return (
            <div key={item.dt} style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '5px',
                margin: '0 3px',
                minWidth: '60px',
                textAlign: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{ fontSize: '10px', marginBottom: '2px' }}>{time}</div>
                <img src={`https://openweathermap.org/img/wn/${icon}.png`} alt="icon" style={{ width: '30px', height: '30px' }} />
                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{temp}°C</div>
            </div>
        );
    });

    // 화살표 이동 함수
    const prevDate = () => setSelectedIndex((selectedIndex - 1 + dates.length) % dates.length);
    const nextDate = () => setSelectedIndex((selectedIndex + 1) % dates.length);

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '220px',
            background: '#f0f4f8',
            borderRadius: '12px',
            padding: '10px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            zIndex: 999
        }}>
            {/* 화살표 + 날짜 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <button onClick={prevDate} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}>{'<'}</button>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedDate}</div>
                <button onClick={nextDate} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}>{'>'}</button>
            </div>

            {/* 현재 날씨 */}
            <div style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '8px',
                textAlign: 'center',
                marginBottom: '10px',
                boxShadow: '0 1px 5px rgba(0,0,0,0.1)'
            }}>
                <img src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`} alt="current" style={{ width: '50px', height: '50px' }} />
                <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{Math.round(currentWeather.main.temp)}°C</div>
                <div style={{ fontSize: '12px' }}>{currentWeather.weather[0].description}</div>
            </div>

            {/* 시간별 날씨 */}
            <div style={{ display: 'flex', overflowX: 'auto', padding: '5px 0' }}>
                {timeCards}
            </div>
        </div>
    );
};

export default UKWeatherPopup;
