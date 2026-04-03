const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let users = [];
let reservations = [];

app.post('/signup', (req, res) => {
    const { id, password, name, birth } = req.body;
    
    if (users.find(u => u.id === id)) {
        return res.status(400).send("이미 가입된 휴대폰 번호입니다.");
    }
    
    users.push({ id, password, name, birth });
    res.send("회원가입이 정상적으로 완료되었습니다!");
});

app.post('/login', (req, res) => {
    const { id, password } = req.body;
    const user = users.find(u => u.id === id && u.password === password);
    
    if (user) {
        res.send("로그인 성공! 환영합니다.");
    } else {
        res.status(401).send("아이디나 비밀번호가 틀렸습니다. 다시 확인해주세요.");
    }
});

app.post('/find-account', (req, res) => {
    const { name, birth } = req.body;
    const user = users.find(u => u.name === name && u.birth === birth);
    
    if (user) {
        res.send(`정보를 찾았습니다!\n\n아이디(번호): ${user.id}\n비밀번호: ${user.password}`);
    } else {
        res.status(404).send("일치하는 회원 정보가 없습니다. 이름과 생년월일을 확인해주세요.");
    }
});

app.post('/reserve', (req, res) => {
    const { userId, date, time, court, people } = req.body;
    
    const isBooked = reservations.find(r => 
        r.date === date && 
        r.time === time && 
        r.court === court
    );

    if (isBooked) {
        return res.status(400).send("이미 다른 분이 예약하신 시간대입니다. 다른 시간을 선택해주세요.");
    }

    // 예약 저장
    reservations.push({ userId, date, time, court, people });
    res.send("예약이 정상적으로 신청되었습니다.");
});

// Vercel 배포를 위한 모듈 내보내기
module.exports = app;
