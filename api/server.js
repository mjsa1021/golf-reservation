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
    if (users.find(u => u.id === id)) return res.status(400).send("이미 등록된 전화번호입니다.");
    users.push({ id, password, name, birth });
    res.send("회원가입이 완료되었습니다!");
});

// 로그인
app.post('/login', (req, res) => {
    const { id, password } = req.body;
    const user = users.find(u => u.id === id && u.password === password);
    if (user) res.send("로그인 성공!");
    else res.status(401).send("아이디 또는 비밀번호가 틀렸습니다.");
});

// 정보 찾기
app.post('/find-account', (req, res) => {
    const { name, birth } = req.body;
    const user = users.find(u => u.name === name && u.birth === birth);
    if (user) res.send(`정보를 찾았습니다!\n아이디: ${user.id}\n비밀번호: ${user.password}`);
    else res.status(404).send("정보가 없습니다.");
});

// 예약하기 (인원 정보 추가)
app.post('/reserve', (req, res) => {
    const { userId, loc, date, time, court, people } = req.body;
    const isBooked = reservations.find(r => r.loc === loc && r.date === date && r.time === time && r.court === court);
    if (isBooked) return res.status(400).send("이미 예약된 시간대입니다.");
    
    reservations.push({ userId, loc, date, time, court, people });
    res.send("예약 완료!");
});

module.exports = app;
