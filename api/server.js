const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Vercel은 파일 저장이 안 되므로 임시 메모리 저장소를 사용합니다.
let users = [];
let reservations = [];

app.post('/signup', (req, res) => {
    const { id, password } = req.body;
    if (users.find(u => u.id === id)) return res.status(400).send("이미 존재하는 아이디입니다.");
    users.push({ id, password });
    res.send("회원가입 완료!");
});

app.post('/login', (req, res) => {
    const { id, password } = req.body;
    const user = users.find(u => u.id === id && u.password === password);
    if (user) res.send("로그인 성공!");
    else res.status(401).send("아이디 또는 비밀번호가 틀렸습니다.");
});

app.post('/reserve', (req, res) => {
    const { loc, date, time, court } = req.body;
    const isBooked = reservations.find(r => r.loc === loc && r.date === date && r.time === time && r.court === court);
    if (isBooked) return res.status(400).send("죄송합니다. 해당 시간은 이미 다른 분이 예약하셨습니다.");
    
    reservations.push({ loc, date, time, court });
    res.send("예약 완료!");
});

// Vercel 배포를 위해 반드시 추가
module.exports = app;
