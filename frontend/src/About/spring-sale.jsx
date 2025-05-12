        import React from 'react';
        import springSaleImg from '../image/spring-sale.jpg';

        const SpringSale = () => {
            return (
                <div className="spring-sale-container">
                    <h1 className="spring-sale-title">봄맞이 스페셜 할인</h1>
                    <div className="spring-sale-content">
                        <img src={springSaleImg} alt="Spring Sale" className="spring-sale-image" />
                        <p className="spring-sale-description">
                            전 객실 최대 30% 할인! 지금 예약하고 봄 여행을 떠나세요. 봄맞이 스페셜 할인 이벤트가 5월 한 달 동안 진행됩니다.
                            기회를 놓치지 마세요!
                        </p>
                        <p className="spring-sale-date">2025.05.01 ~ 2025.05.31</p>
                        <a href="/" className="spring-sale-button">
                            지금 예약하기
                        </a>
                    </div>

                    <style>{`
                .spring-sale-container {
                  padding: 60px 20px;
                  font-family: 'Arial', sans-serif;
                }
                .spring-sale-title {
                  text-align: center;
                  font-size: 36px;
                  font-weight: bold;
                  color: #333;
                  margin-bottom: 40px;
                }
                .spring-sale-content {
                  background-color: #f5f5f5;
                  border-radius: 16px;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                  padding: 40px;
                  max-width: 800px;
                  margin: 0 auto;
                }
                .spring-sale-image {
                  width: 100%;
                  height: 100%;
                  border-radius: 8px;
                  margin-bottom: 20px;
                }
                .spring-sale-description {
                  font-size: 18px;
                  color: #555;
                  line-height: 1.6;
                  margin-bottom: 20px;
                }
                .spring-sale-date {
                  font-size: 14px;
                  color: #999;
                  margin-bottom: 30px;
                }
                .spring-sale-button {
                  display: block;
                  margin: 0 auto;
                  background-color: #007bff;
                  color: white;
                  padding: 12px 30px;
                  font-size: 16px;
                  border-radius: 9999px;
                  text-align: center;
                  text-decoration: none;
                  transition: background-color 0.2s ease;
                }
                .spring-sale-button:hover {
                  background-color: #005dc1;
                }
              `}</style>
                </div>
            );
        };

        export default SpringSale;
