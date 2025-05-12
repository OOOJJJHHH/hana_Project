# 1. Gradle 빌드용 이미지
FROM gradle:8.5-jdk17 AS builder

# 2. 작업 디렉토리 지정
WORKDIR /app

# 3. 전체 코드 복사
COPY . .

# 4. 빌드 (테스트 생략)
RUN gradle build -x test

# 5. 실제 실행 이미지 (JDK만 있는 경량 이미지)
FROM openjdk:17
WORKDIR /app

# 6. 빌드된 JAR 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 7. 실행
CMD ["java", "-jar", "app.jar"]
