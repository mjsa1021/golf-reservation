// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs'); // 파일 시스템 모듈 추가
const app = express();

app.use(cors());
app.use(express.json());

// 데이터 로드 함수
const loadData = (filename) => {
    try {
        return JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch (e) {
        return [];
    }
};

// 데이터 저장 함수
const saveData = (filename, data) => {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
};

// 회원가입 API (중복 아이디 체크 추가)
app.post('/signup', (req, res) => {
    const { id, password } = req.body;
    let users = loadData('users.json');

    // 중복 아이디 확인
    const exists = users.find(user => user.id === id);
    if (exists) {
        return res.status(400).send("이미 존재하는 아이디입니다.");
    }

    users.push({ id, password });
    saveData('users.json', users);
    res.send("회원가입 완료!");
});

// 로그인 API (실제 검증 로직 추가)
app.post('/login', (req, res) => {
    const { id, password } = req.body;
    let users = loadData('users.json');

    const user = users.find(u => u.id === id && u.password === password);
    if (user) {
        res.send({ success: true, message: "로그인 성공!" });
    } else {
        res.status(401).send("아이디 또는 비밀번호가 틀렸습니다.");
    }
});

// 예약 API (중복 예약 방지 추가)
app.post('/reserve', (req, res) => {
    const { loc, date, time, court } = req.body;
    
    // 1. 이미 저장된 예약 리스트(reservations)에서 똑같은 조건이 있는지 찾습니다.
    const isAlreadyBooked = reservations.find(r => 
        r.date === date && 
        r.time === time && 
        r.court === court
    );

    // 2. 만약 똑같은 예약이 있다면, 에러 메시지를 보냅니다.
    if (isAlreadyBooked) {
        return res.status(400).send("죄송합니다. 해당 시간은 이미 다른 분이 예약하셨습니다.");
    }

    // 3. 중복이 없을 때만 리스트에 추가합니다.
    reservations.push({ loc, date, time, court });
    res.send(`${date} ${time}에 ${court} 예약이 성공적으로 완료되었습니다.`);
});

app.listen(3000, () => console.log("서버가 3000번 포트에서 실행 중입니다."));
