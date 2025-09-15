import React, { useEffect, useState, useRef } from 'react';

const UKWeatherPopup = () => {
    const [forecast, setForecast] = useState(null);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [error, setError] = useState(null);

    const [position, setPosition] = useState(() => {
        try {
            const savedPosition = localStorage.getItem('weatherPopupPosition');
            return savedPosition ? JSON.parse(savedPosition) : { x: window.innerWidth - 240, y: 20 };
        } catch (error) {
            console.error("Failed to parse position from localStorage", error);
            return { x: window.innerWidth - 240, y: 20 };
        }
    });

    const [selectedIndex, setSelectedIndex] = useState(() => {
        try {
            const savedIndex = localStorage.getItem('weatherPopupDateIndex');
            return savedIndex ? parseInt(savedIndex, 10) : 0;
        } catch (error) {
            console.error("Failed to parse date index from localStorage", error);
            return 0;
        }
    });

    const [dimensions, setDimensions] = useState(() => {
        try {
            const savedDimensions = localStorage.getItem('weatherPopupDimensions');
            return savedDimensions ? JSON.parse(savedDimensions) : { width: 220, height: 320 };
        } catch (error) {
            console.error("Failed to parse dimensions from localStorage", error);
            return { width: 220, height: 320 };
        }
    });

    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

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

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - offset.x,
                    y: e.clientY - offset.y,
                });
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
                    default:
                        break;
                }
                setDimensions(newDimensions);
                setPosition(newPosition);
            }
        };

        const handleMouseUp = () => {
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
        if (e.target.className.includes('resizer')) {
            return;
        }
        setIsDragging(true);
        setOffset({
            x: e.clientX - popupRef.current.offsetLeft,
            y: e.clientY - popupRef.current.offsetTop,
        });
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

    // 팝업 너비에 따라 텍스트 크기를 동적으로 계산
    const calculateFontSize = (baseSize, scaleFactor) => {
        const newSize = baseSize + (dimensions.width - 220) * scaleFactor;
        return Math.max(baseSize, Math.min(newSize, baseSize + 8)); // 최소/최대 크기 제한을 좀 더 늘렸습니다.
    };

    // 팝업 너비에 따라 이미지 크기를 동적으로 계산
    const calculateImageSize = (baseSize, scaleFactor) => {
        const newSize = baseSize + (dimensions.width - 220) * scaleFactor;
        return Math.max(baseSize, Math.min(newSize, baseSize + 20)); // 최소 30px, 최대 50px 정도로 제한
    };

    // 계산된 글꼴 크기
    const timeFontSize = calculateFontSize(10, 0.02);
    const tempFontSize = calculateFontSize(12, 0.03);
    // 계산된 이미지 크기
    const cardImageSize = calculateImageSize(30, 0.08); // 기본 30px, 너비 증가에 따라 0.08 비율로 증가


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
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                background: '#f0f4f8',
                borderRadius: '12px',
                padding: '10px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                zIndex: 999,
                cursor: isDragging ? 'grabbing' : 'grab',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box'
            }}
            onMouseDown={handleMouseDown}
        >
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
                        borderRadius: handle.includes('bottom-right') ? '0 0 12px 0' :
                            handle.includes('bottom-left') ? '0 0 0 12px' :
                                handle.includes('top-right') ? '0 12px 0 0' :
                                    '12px 0 0 0'
                    }}
                />
            ))}

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                overflow: 'hidden'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <button onClick={prevDate} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}>{'<'}</button>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedDate}</div>
                    <button onClick={nextDate} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}>{'>'}</button>
                </div>

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
                    {/* 현재 날씨 이미지 크기도 팝업 너비에 따라 조절되도록 수정 */}
                    <img src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                         alt="current"
                         style={{ width: `${calculateImageSize(50, 0.1)}px`, height: `${calculateImageSize(50, 0.1)}px` }} /> {/* 현재 날씨 이미지도 스케일링 */}
                    <div style={{ fontSize: `${calculateFontSize(16, 0.04)}px`, fontWeight: 'bold' }}>{Math.round(currentWeather.main.temp)}°C</div>
                    <div style={{ fontSize: `${calculateFontSize(12, 0.02)}px` }}>{currentWeather.weather[0].description}</div>
                </div>

                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    overflowY: 'auto',
                    padding: '5px 0',
                    flexGrow: 1,
                    justifyContent: 'center' // 카드들이 중앙에 오도록
                }}>
                    {timeCards}
                </div>
            </div>
        </div>
    );
};

export default UKWeatherPopup;