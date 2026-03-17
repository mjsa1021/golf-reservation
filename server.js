const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

// 데이터 로드 함수
const loadData = (filename) => {
    try {
        if (!fs.existsSync(filename)) return []; // 파일이 없으면 빈 배열 반환
        return JSON.parse(fs.readFileSync(filename, 'utf8'));
    } catch (e) {
        return [];
    }
};

// 데이터 저장 함수
const saveData = (filename, data) => {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
};

// 회원가입 API
app.post('/signup', (req, res) => {
    const { id, password } = req.body;
    let users = loadData('users.json');

    const exists = users.find(user => user.id === id);
    if (exists) {
        return res.status(400).send("이미 존재하는 아이디입니다.");
    }

    users.push({ id, password });
    saveData('users.json', users);
    res.send("회원가입 완료!");
});

// 로그인 API
app.post('/login', (req, res) => {
    const { id, password } = req.body;
    let users = loadData('users.json');

    const user = users.find(u => u.id === id && u.password === password);
    if (user) {
        res.send("로그인 성공!"); // 텍스트로 통일
    } else {
        res.status(401).send("아이디 또는 비밀번호가 틀렸습니다.");
    }
});

// 예약 API (수정됨: 데이터 로드 및 저장 추가)
app.post('/reserve', (req, res) => {
    const { loc, date, time, court } = req.body;
    
    // 1. 파일에서 기존 예약 목록을 불러옵니다.
    let reservations = loadData('reservations.json');

    // 2. 지역(loc), 날짜, 시간, 구장이 모두 겹치는지 확인합니다.
    const isAlreadyBooked = reservations.find(r => 
        r.loc === loc &&
        r.date === date && 
        r.time === time && 
        r.court === court
    );

    // 3. 중복 예약이 있다면 거절합니다.
    if (isAlreadyBooked) {
        return res.status(400).send("죄송합니다. 해당 시간은 이미 다른 분이 예약하셨습니다.");
    }

    // 4. 중복이 없으면 목록에 추가하고 파일에 저장합니다.
    reservations.push({ loc, date, time, court });
    saveData('reservations.json', reservations);
    
    res.send(`${date} ${time}에 ${court} 예약이 성공적으로 완료되었습니다.`);
});

app.listen(3000, () => console.log("서버 실행 중..."));
