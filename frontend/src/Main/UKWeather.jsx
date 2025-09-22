import React, { useEffect, useState, useRef } from 'react';
import WeatherIcon from '../image/Weather_Icon.png'; // 최소화 아이콘 이미지

const UKWeatherPopup = () => {
    const [forecast, setForecast] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [error, setError] = useState(null);

    const [position, setPosition] = useState(() => {
        try {
            const savedPosition = localStorage.getItem('weatherPopupPosition');
            return savedPosition ? JSON.parse(savedPosition) : { x: window.innerWidth - 240, y: 20 };
        } catch {
            return { x: window.innerWidth - 240, y: 20 };
        }
    });

    const [selectedIndex, setSelectedIndex] = useState(() => {
        try {
            const savedIndex = localStorage.getItem('weatherPopupDateIndex');
            return savedIndex ? parseInt(savedIndex, 10) : 0;
        } catch {
            return 0;
        }
    });

    const [dimensions, setDimensions] = useState(() => {
        try {
            const savedDimensions = localStorage.getItem('weatherPopupDimensions');
            return savedDimensions ? JSON.parse(savedDimensions) : { width: 220, height: 320 };
        } catch {
            return { width: 220, height: 320 };
        }
    });

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isMinimized, setIsMinimized] = useState(false);

    const popupRef = useRef(null);
    const API_KEY = '76f59296790eca380cc7389d1bbe8877';

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const [forecastRes, currentRes] = await Promise.all([
                    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=London,uk&appid=${API_KEY}&units=metric`),
                    fetch(`https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=${API_KEY}&units=metric`)
                ]);

                if (!forecastRes.ok) throw new Error('Weather forecast API fetch error');
                if (!currentRes.ok) throw new Error('Current weather API fetch error');

                setForecast(await forecastRes.json());
                setCurrentWeather(await currentRes.json());
            } catch (err) {
                setError(err.message);
            }
        };

        fetchWeatherData();
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
            } else if (isResizing) {
                const { clientX, clientY } = e;
                const newDimensions = { ...dimensions };
                const newPosition = { ...position };
                const minWidth = 220;
                const minHeight = 320;

                switch (resizeHandle) {
                    case 'bottom-right':
                        newDimensions.width = Math.max(clientX - position.x, minWidth);
                        newDimensions.height = Math.max(clientY - position.y, minHeight);
                        break;
                    case 'bottom-left':
                        const deltaX = clientX - position.x;
                        newDimensions.width = Math.max(dimensions.width - deltaX, minWidth);
                        newPosition.x = position.x + (dimensions.width - newDimensions.width);
                        newDimensions.height = Math.max(clientY - position.y, minHeight);
                        break;
                    case 'top-right':
                        const deltaY = clientY - position.y;
                        newDimensions.width = Math.max(clientX - position.x, minWidth);
                        newDimensions.height = Math.max(dimensions.height - deltaY, minHeight);
                        newPosition.y = position.y + (dimensions.height - newDimensions.height);
                        break;
                    case 'top-left':
                        const dX = clientX - position.x;
                        const dY = clientY - position.y;
                        newDimensions.width = Math.max(dimensions.width - dX, minWidth);
                        newPosition.x = position.x + (dimensions.width - newDimensions.width);
                        newDimensions.height = Math.max(dimensions.height - dY, minHeight);
                        newPosition.y = position.y + (dimensions.height - newDimensions.height);
                        break;
                    default: break;
                }
                setDimensions(newDimensions);
                setPosition(newPosition);
            }
        };

        const handleMouseUp = (e) => {
            if (isDragging) {
                setIsDragging(false);
                localStorage.setItem('weatherPopupPosition', JSON.stringify(position));
            }
            if (isResizing) {
                setIsResizing(false);
                setResizeHandle(null);
                localStorage.setItem('weatherPopupDimensions', JSON.stringify(dimensions));
                localStorage.setItem('weatherPopupPosition', JSON.stringify(position));
            }
        };

        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, resizeHandle, offset, position, dimensions]);

    const handleMouseDown = (e) => {
        // 더블 클릭 시 드래그가 시작되지 않도록 e.detail을 확인합니다.
        if (e.target.className.includes('resizer') || e.detail === 2) {
            return;
        }
        setIsDragging(true);
        setOffset({ x: e.clientX - popupRef.current.offsetLeft, y: e.clientY - popupRef.current.offsetTop });
    };

    const handleDoubleClick = () => {
        setIsMinimized(!isMinimized);
    };

    const handleResizeMouseDown = (e, handle) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeHandle(handle);
    };

    if (error) return <div>에러: {error}</div>;
    if (!forecast || !currentWeather) return <div>로딩 중...</div>;

    const dailyData = {};
    forecast.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) dailyData[date] = [];
        dailyData[date].push(item);
    });

    const dates = Object.keys(dailyData);
    const selectedDate = dates[selectedIndex];
    const selectedDayData = dailyData[selectedDate] || [];

    const calculateFontSize = (baseSize, scaleFactor) => {
        const newSize = baseSize + (dimensions.width - 220) * scaleFactor;
        return Math.max(baseSize, Math.min(newSize, baseSize + 8));
    };

    const calculateImageSize = (baseSize, scaleFactor) => {
        const newSize = baseSize + (dimensions.width - 220) * scaleFactor;
        return Math.max(baseSize, Math.min(newSize, baseSize + 20));
    };

    const timeFontSize = calculateFontSize(10, 0.02);
    const tempFontSize = calculateFontSize(12, 0.03);
    const cardImageSize = calculateImageSize(30, 0.08);

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
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                flexGrow: 1
            }}>
                <div style={{ fontSize: `${timeFontSize}px`, marginBottom: '2px' }}>{time}</div>
                <img src={`https://openweathermap.org/img/wn/${icon}.png`} alt="icon" style={{ width: `${cardImageSize}px`, height: `${cardImageSize}px` }} />
                <div style={{ fontSize: `${tempFontSize}px`, fontWeight: 'bold' }}>{temp}°C</div>
            </div>
        );
    });

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
                width: isMinimized ? '50px' : `${dimensions.width}px`,
                height: isMinimized ? '50px' : `${dimensions.height}px`,
                background: isMinimized ? 'transparent' : '#f0f4f8',
                borderRadius: isMinimized ? '50%' : '12px',
                padding: isMinimized ? '0' : '10px',
                boxShadow: isMinimized ? '0 2px 6px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.2)',
                zIndex: 999,
                cursor: isDragging ? 'grabbing' : (isMinimized ? 'pointer' : 'grab'),
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick} // 팝업 전체에 더블 클릭 이벤트 적용
        >
            {isMinimized ? (
                <img
                    src={WeatherIcon}
                    alt="weather-icon"
                    style={{ width: '50px', height: '50px' }}
                />
            ) : (
                <>
                    {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(handle => (
                        <div
                            key={handle}
                            className={`resizer resizer-${handle}`}
                            onMouseDown={(e) => handleResizeMouseDown(e, handle)}
                            style={{
                                position: 'absolute',
                                width: '15px',
                                height: '15px',
                                backgroundColor: 'transparent',
                                ...(handle === 'top-left' && { top: 0, left: 0, cursor: 'nwse-resize' }),
                                ...(handle === 'top-right' && { top: 0, right: 0, cursor: 'nesw-resize' }),
                                ...(handle === 'bottom-left' && { bottom: 0, left: 0, cursor: 'nesw-resize' }),
                                ...(handle === 'bottom-right' && { bottom: 0, right: 0, cursor: 'nwse-resize' }),
                            }}
                        />
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button onClick={prevDate} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}>{'<'}</button>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedDate}</div>
                            <button onClick={nextDate} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}>{'>'}</button>
                        </div>
                        <button
                            onClick={() => setIsMinimized(true)}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', position: 'absolute', right: '10px' }}
                        >—</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
                        <div style={{
                            background: '#fff',
                            borderRadius: '8px',
                            padding: '8px',
                            textAlign: 'center',
                            marginBottom: '10px',
                            boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexGrow: 1
                        }}>
                            <img src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                                 alt="current"
                                 style={{ width: `${calculateImageSize(50, 0.1)}px`, height: `${calculateImageSize(50, 0.1)}px` }} />
                            <div style={{ fontSize: `${calculateFontSize(16, 0.04)}px`, fontWeight: 'bold' }}>{Math.round(currentWeather.main.temp)}°C</div>
                            <div style={{ fontSize: `${calculateFontSize(12, 0.02)}px` }}>{currentWeather.weather[0].description}</div>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            overflowY: 'auto',
                            padding: '5px 0',
                            flexGrow: 1,
                            justifyContent: 'center'
                        }}>
                            {timeCards}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default UKWeatherPopup;