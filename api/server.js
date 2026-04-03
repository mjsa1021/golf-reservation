const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let reservations = [];

app.post('/signup', (req, res) => {
    const { id, password, name, birth } = req.body;
    if (users.find(u => u.id === id)) return res.status(400).send("이미 등록된 번호입니다.");
    users.push({ id, password, name, birth });
    res.send("회원가입 완료!");
});

app.post('/login', (req, res) => {
    const { id, password } = req.body;
    const user = users.find(u => u.id === id && u.password === password);
    if (user) res.send("로그인 성공!");
    else res.status(401).send("번호나 비밀번호가 틀렸습니다.");
});

app.post('/find-account', (req, res) => {
    const { name, birth } = req.body;
    const user = users.find(u => u.name === name && u.birth === birth);
    if (user) res.send(`정보를 찾았습니다!\n아이디: ${user.id}\n비밀번호: ${user.password}`);
    else res.status(404).send("정보가 없습니다.");
});

app.post('/reserve', (req, res) => {
    const { userId, date, time, court, people } = req.body;
    const isBooked = reservations.find(r => r.date === date && r.time === time && r.court === court);
    if (isBooked) return res.status(400).send("이미 예약된 시간입니다.");
    reservations.push({ userId, date, time, court, people });
    res.send("예약 완료!");
});

module.exports = app;
