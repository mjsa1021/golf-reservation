const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 서버가 켜져 있는 동안만 유지되는 임시 저장소 (Vercel 배포 시 초기화될 수 있음)
let users = [];
let reservations = [];

// 1. 회원가입 (전화번호, 비밀번호, 이름, 생년월일 저장)
app.post('/signup', (req, res) => {
    const { id, password, name, birth } = req.body;
    
    // 전화번호(ID) 중복 확인
    if (users.find(u => u.id === id)) {
        return res.status(400).send("이미 등록된 전화번호입니다.");
    }
    
    // 신규 유저 정보 추가
    users.push({ id, password, name, birth });
    res.send("회원가입이 완료되었습니다!");
});

// 2. 로그인
app.post('/login', (req, res) => {
    const { id, password } = req.body;
    const user = users.find(u => u.id === id && u.password === password);
    
    if (user) {
        res.send("로그인 성공!");
    } else {
        res.status(401).send("아이디 또는 비밀번호가 틀렸습니다.");
    }
});

// 3. 아이디/비밀번호 찾기 (이름과 생년월일로 검색)
app.post('/find-account', (req, res) => {
    const { name, birth } = req.body;
    
    // 성함과 생년월일이 모두 일치하는 사용자 찾기
    const user = users.find(u => u.name === name && u.birth === birth);
    
    if (user) {
        res.send(`정보를 찾았습니다!\n아이디(번호): ${user.id}\n비밀번호: ${user.password}`);
    } else {
        res.status(404).send("일치하는 정보가 없습니다. 성함과 생년월일을 다시 확인해주세요.");
    }
});

// 4. 예약하기 (중복 예약 방지 로직 포함)
app.post('/reserve', (req, res) => {
    const { loc, date, time, court } = req.body;
    
    // 같은 장소, 날짜, 시간, 코트에 이미 예약이 있는지 확인
    const isBooked = reservations.find(r => 
        r.loc === loc && r.date === date && r.time === time && r.court === court
    );
    
    if (isBooked) {
        return res.status(400).send("죄송합니다. 해당 시간은 이미 다른 분이 예약하셨습니다.");
    }
    
    reservations.push({ loc, date, time, court });
    res.send("예약 완료!");
});

// Vercel 배포를 위한 설정
module.exports = app;
