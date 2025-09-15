import React, { useEffect, useState, useRef } from 'react';

const UKWeatherPopup = () => {
    const [forecast, setForecast] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [error, setError] = useState(null);

    // movable popup state
    const [position, setPosition] = useState(() => {
        try {
            const savedPosition = localStorage.getItem('weatherPopupPosition');
            return savedPosition ? JSON.parse(savedPosition) : { x: window.innerWidth - 240, y: 20 };
        } catch (error) {
            console.error("Failed to parse position from localStorage", error);
            return { x: window.innerWidth - 240, y: 20 };
        }
    });

    // 날짜 인덱스 상태에 localStorage 적용
    const [selectedIndex, setSelectedIndex] = useState(() => {
        try {
            const savedIndex = localStorage.getItem('weatherPopupDateIndex');
            return savedIndex ? parseInt(savedIndex, 10) : 0;
        } catch (error) {
            console.error("Failed to parse date index from localStorage", error);
            return 0;
        }
    });

    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const popupRef = useRef(null);
    const API_KEY = '76f59296790eca380cc7389d1bbe8877';

    // Fetch weather data
    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const [forecastRes, currentRes] = await Promise.all([
                    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=London,uk&appid=${API_KEY}&units=metric`),
                    fetch(`https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=${API_KEY}&units=metric`)
                ]);

                if (!forecastRes.ok) throw new Error('Weather forecast API fetch error');
                if (!currentRes.ok) throw new Error('Current weather API fetch error');

                const forecastData = await forecastRes.json();
                const currentData = await currentRes.json();

                setForecast(forecastData);
                setCurrentWeather(currentData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchWeatherData();
    }, []);

    // Effect for handling the drag functionality
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - offset.x,
                    y: e.clientY - offset.y,
                });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            localStorage.setItem('weatherPopupPosition', JSON.stringify(position));
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, offset, position]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - popupRef.current.offsetLeft,
            y: e.clientY - popupRef.current.offsetTop,
        });
    };

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
        const time = item.dt_txt.split(' ')[1].slice(0, 5);
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
    const prevDate = () => {
        const newIndex = (selectedIndex - 1 + dates.length) % dates.length;
        setSelectedIndex(newIndex);
        localStorage.setItem('weatherPopupDateIndex', newIndex);
    };

    const nextDate = () => {
        const newIndex = (selectedIndex + 1) % dates.length;
        setSelectedIndex(newIndex);
        localStorage.setItem('weatherPopupDateIndex', newIndex);
    };

    return (
        <div
            ref={popupRef}
            style={{
                position: 'fixed',
                top: `${position.y}px`,
                left: `${position.x}px`,
                width: '220px',
                background: '#f0f4f8',
                borderRadius: '12px',
                padding: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                zIndex: 999,
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={handleMouseDown}
        >
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