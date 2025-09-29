import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';

const ImageSlider = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        const fetchMainBanners = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/events/main-banners`);
                setBanners(res.data);
            } catch (err) {
                console.error('메인배너 이벤트 불러오기 실패:', err);
            }
        };

        fetchMainBanners();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div style={{ width: '100%', maxWidth: '1180px', margin: '0 auto', overflow: 'hidden' }}>
            <Slider {...settings}>
                {banners.map(event => (
                    <div key={event.id} style={{ position: 'relative' }}>
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            style={{
                                width: '100%',
                                height: '420px',
                                objectFit: 'cover',
                                borderRadius: '12px'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '30px',
                            background: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            padding: '10px 15px',
                            borderRadius: '8px'
                        }}>
                            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>{event.title}</h2>
                            <p style={{ margin: '5px 0 0', fontSize: '14px' }}>
                                {event.startDate} ~ {event.endDate}
                            </p>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageSlider;
