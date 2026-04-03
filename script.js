const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let users = [];
let reservations = [];

// 회원가입
app.post('/signup', (req, res) => {
    const { id, password, name, birth } = req.body;
    if (users.find(u => u.id === id)) return res.status(400).send("이미 등록된 번호입니다.");
    users.push({ id, password, name, birth });
    res.send("회원가입이 완료되었습니다!");
});

// 로그인
app.post('/login', (req, res) => {
    const { id, password } = req.body;
    const user = users.find(u => u.id === id && u.password === password);
    if (user) res.send("로그인 성공!");
    else res.status(401).send("번호나 비밀번호를 확인해주세요.");
});

// 예약 (경산 통합 시스템)
app.post('/reserve', (req, res) => {
    const { userId, date, time, court, people } = req.body;
    // 중복 확인 (같은 날, 같은 장소, 같은 시간)
    const isBooked = reservations.find(r => r.date === date && r.time === time && r.court === court);
    if (isBooked) return res.status(400).send("이미 예약이 꽉 찬 시간대입니다.");
    
    reservations.push({ userId, date, time, court, people });
    res.send("정상적으로 예약되었습니다.");
});

module.exports = app;
