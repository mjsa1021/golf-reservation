const express = require('express');
const cors = require('cors');
const app = express();
const db = require('../db'); // DB 연결 설정 파일

app.use(cors());
app.use(express.json());

// 1. 회원가입 API
app.post('/signup', (req, res) => {
    // 프론트엔드에서 보내는 데이터 이름: id, password, name, tel
    const { id, password, name, tel } = req.body; 
    
    // HeidiSQL 테이블 컬럼: mem_id, mem_pw, mem_name, mem_tel
    const sql = "INSERT INTO member (mem_id, mem_pw, mem_name, mem_tel) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [id, password, name, tel || id], (err, result) => {
        if (err) {
            console.error("DB 저장 에러:", err);
            return res.status(500).send("회원가입 중 오류가 발생했습니다.");
        }
        res.send("회원가입이 정상적으로 완료되었습니다!");
    });
});

// 2. 로그인 API
app.post('/login', (req, res) => {
    const { id, password } = req.body;
    
    const sql = "SELECT * FROM member WHERE mem_id = ? AND mem_pw = ?";
    
    db.query(sql, [id, password], (err, results) => {
        if (err) return res.status(500).send("서버 에러");
        
        if (results.length > 0) {
            res.send("로그인 성공! 환영합니다.");
        } else {
            res.status(401).send("아이디나 비밀번호가 틀렸습니다.");
        }
    });
});

// 3. 예약 API (이 부분이 추가되어야 에러가 안 납니다!)
app.post('/reserve', (req, res) => {
    const { uid, res_date, res_time, court_name } = req.body;

    // reservation 테이블 컬럼명에 맞춰 쿼리 작성 (HeidiSQL에서 확인한 컬럼명 기준)
    const sql = "INSERT INTO reservation (mem_id, res_date, res_time, court_name) VALUES (?, ?, ?, ?)";

    db.query(sql, [uid, res_date, res_time, court_name], (err, result) => {
        if (err) {
            console.error("예약 DB 저장 에러:", err);
            return res.status(500).send("예약 처리 중 오류가 발생했습니다.");
        }
        res.send("예약이 완료되었습니다!");
    });
});

// 서버 실행 설정
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 돌아가는 중!`);
});

module.exports = app;