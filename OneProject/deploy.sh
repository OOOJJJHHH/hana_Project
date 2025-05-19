#!/bin/bash

echo "🔁 Git pull 중..."
git pull origin master || { echo "❌ Git pull 실패"; exit 1; }

echo "🔨 Docker 이미지 빌드 중..."
docker build -t my-spring-app . || { echo "❌ Docker 빌드 실패"; exit 1; }

echo "🛑 기존 컨테이너 중지 및 삭제 중..."
docker stop spring-container 2>/dev/null
docker rm spring-container 2>/dev/null

echo "🚀 새 컨테이너 실행 중..."
docker run -d \
  -v /home/ec2-user/app/uploads:/app/lodUploads \
  -p 8080:8080 \
  --name spring-container \
  --network host \  # EC2의 네트워크를 사용하여 IAM Role 상속
  my-spring-app || { echo "❌ 컨테이너 실행 실패"; exit 1; }

echo "✅ 배포 완료!"