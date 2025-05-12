# 1. Node.js 기반 이미지 사용
FROM node:18

# 2. 작업 디렉토리 지정
WORKDIR /app

# 3. package.json 복사 후 의존성 설치
COPY package*.json ./
RUN npm install

# 4. 전체 소스 복사
COPY . .

# 5. 개발 서버 실행
CMD ["npm", "start"]
