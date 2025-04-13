// server.js
const express = require('express');
const mysql = require('mysql2');  // MySQL 패키지
const cors = require('cors');     // CORS 패키지 추가

const app = express();
const port = 8080;

// CORS 설정 (모든 도메인 허용)
app.use(cors());

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: 'localhost',  // MySQL 호스트
    user: 'root',       // MySQL 사용자
    password: 'root',   // MySQL 비밀번호
    database: 'project' // 사용할 데이터베이스 이름
});

// 연결 확인
connection.connect(err => {
    if (err) {
        console.error('MySQL 연결 실패: ' + err.stack);
        return;
    }
    console.log('MySQL에 연결됨');
});

// API: 데이터 가져오기
app.get('/api/contents', (req, res) => {
    const query = 'SELECT * FROM contents';  // 데이터베이스에서 데이터를 가져오는 쿼리
    connection.query(query, (err, results) => {
        if (err) {
            console.error('쿼리 실패: ' + err.stack);
            res.status(500).send('쿼리 실패');
            return;
        }
        res.json(results);  // 결과를 JSON 형식으로 반환
    });
});

// 서버 실행
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중`);
});
