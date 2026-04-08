const express = require('express');
const cors = require('cors');
const app = express();
const db = require('../db'); // 드디어 DB 연결!

app.use(cors());
app.use(express.json());

// 회원가입 API
app.post('/signup', (req, res) => {
    const { id, password, name, birth } = req.body;
    
    // DB에 데이터 넣기 (SQL 쿼리문)
    const sql = "INSERT INTO member (mem_id, mem_pw, mem_name, mem_tel) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [id, password, name, id], (err, result) => {
        if (err) {
            console.error("DB 저장 에러:", err);
            return res.status(500).send("회원가입 중 오류가 발생했습니다.");
        }
        res.send("회원가입이 정상적으로 완료되었습니다!");
    });
});

// 로그인 API
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

// Vercel을 위한 서버 실행 설정 (로컬 테스트용)
if (process.env.NODE_ENV !== 'production') {
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`서버가 http://localhost:${PORT} 에서 돌아가는 중!`);
    });
}

module.exports = app;