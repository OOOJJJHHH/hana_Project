package com.example.oneproject.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")  // 모든 경로에 대해 CORS 허용
                .allowedOrigins("http://localhost:3000")  // 요청을 허용할 도메인 (여기서는 프론트엔드 서버)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")  // 허용할 HTTP 메소드
                .allowedHeaders("*")  // 허용할 HTTP 헤더
                .allowCredentials(true);  // 자격 증명 허용 (쿠키나 인증 헤더)
    }
}