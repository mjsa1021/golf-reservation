const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

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
    // 여기 u.id 부분을 정확히 확인하세요
    const user = users.find(u => u.id === id && u.password === password);
    if (user) {
        res.send("로그인 성공!");
    } else {
        res.status(401).send("아이디 또는 비밀번호가 틀렸습니다.");
    }
});

app.post('/reserve', (req, res) => {
    const { loc, date, time, court } = req.body;
    const isBooked = reservations.find(r => r.loc === loc && r.date === date && r.time === time && r.court === court);
    if (isBooked) return res.status(400).send("죄송합니다. 해당 시간은 이미 다른 분이 예약하셨습니다.");
    
    reservations.push({ loc, date, time, court });
    res.send("예약 완료!");
});

module.exports = app;
