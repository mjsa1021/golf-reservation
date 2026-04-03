const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// 데이터 저장용 변수 (서버 재시작 시 초기화됩니다)
let users = [];
let reservations = [];

// 1. 회원가입: 중복 체크 및 필수 정보 저장
app.post('/signup', (req, res) => {
    const { id, password, name, birth } = req.body;
    
    // 이미 가입된 번호인지 확인
    if (users.find(u => u.id === id)) {
        return res.status(400).send("이미 가입된 휴대폰 번호입니다.");
    }
    
    users.push({ id, password, name, birth });
    res.send("회원가입이 정상적으로 완료되었습니다!");
});

// 2. 로그인: 아이디와 비밀번호 일치 확인
app.post('/login', (req, res) => {
    const { id, password } = req.body;
    const user = users.find(u => u.id === id && u.password === password);
    
    if (user) {
        res.send("로그인 성공! 환영합니다.");
    } else {
        res.status(401).send("번호나 비밀번호가 틀렸습니다. 다시 확인해주세요.");
    }
});

// 3. 아이디/비밀번호 찾기: 이름과 생년월일로 조회
app.post('/find-account', (req, res) => {
    const { name, birth } = req.body;
    const user = users.find(u => u.name === name && u.birth === birth);
    
    if (user) {
        res.send(`정보를 찾았습니다!\n\n아이디(번호): ${user.id}\n비밀번호: ${user.password}`);
    } else {
        res.status(404).send("일치하는 회원 정보가 없습니다. 이름과 생년월일을 확인해주세요.");
    }
});

// 4. 예약하기: 중복 예약 방지 로직 포함
app.post('/reserve', (req, res) => {
    const { userId, date, time, court, people } = req.body;
    
    // 같은 구장, 같은 날짜, 같은 시간에 이미 예약이 있는지 확인
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
