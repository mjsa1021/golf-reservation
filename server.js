// server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 임시 데이터 저장소 (실제로는 DB를 사용해야 합니다)
let users = [];
let reservations = [];

// 회원가입 API
app.post('/signup', (req, res) => {
    const { id, password } = req.body;
    users.push({ id, password });
    res.send("회원가입 완료!");
});

// 예약 API
app.post('/reserve', (req, res) => {
    const { date, time, court } = req.body;
    reservations.push({ date, time, court });
    res.send(`${date} ${time}에 ${court} 예약이 완료되었습니다.`);
});

app.listen(3000, () => console.log("서버가 3000번 포트에서 실행 중입니다."));
