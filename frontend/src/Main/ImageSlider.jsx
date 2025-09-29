// src/components/Main/ImageSlider.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageSlider = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        axios.get('/api/events') // 전체 이벤트 가져오기
            .then(res => {
                // ✅ mainBanner === true인 것만 필터링
                const mainEvents = res.data.filter(event => event.mainBanner === true);
                setBanners(mainEvents);
            })
            .catch(err => console.error(err));
    }, []);

    if (banners.length === 0) return null; // ✅ 메인 배너 없으면 슬라이더 숨김

    return (
        <div style={{ width: '100%', overflow: 'hidden' }}>
            {banners.map((event) => (
                <div key={event.id} style={{ display: 'flex', alignItems: 'center' }}>
                    {/* 이미지 비율 안 짤리게 */}
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        style={{
                            width: '70%',
                            height: '400px',
                            objectFit: 'cover', // ✅ 사진 안짤리게 꽉 차게
                            borderRadius: '12px',
                        }}
                    />
                    <div style={{ marginLeft: '20px' }}>
                        <h2>{event.title}</h2>
                        <p>{event.startDate} ~ {event.endDate}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ImageSlider;
