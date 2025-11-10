# 1️⃣ Gradle 빌드용 이미지
FROM gradle:8.5-jdk17 AS builder

# 2️⃣ 작업 디렉토리 지정
WORKDIR /app

# 3️⃣ 전체 코드 복사
COPY . .

# 4️⃣ 빌드 (테스트 생략)
RUN gradle clean build -x test

# 5️⃣ 실제 실행 이미지 (OpenJDK 17 대체 → Temurin)
FROM eclipse-temurin:17-jdk

# 6️⃣ 실행 디렉토리 지정
WORKDIR /app

# 7️⃣ 빌드 결과 JAR 복사
COPY --from=builder /app/build/libs/*.jar app.jar

# 8️⃣ 포트 노출 (Spring Boot 기본)
EXPOSE 8080

# 9️⃣ 실행 명령
ENTRYPOINT ["java", "-jar", "app.jar"]
