const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// [중요] Vercel은 파일을 저장할 수 없으므로 우선 메모리 변수에 저장합니다.
// (나중에 데이터가 사라지지 않게 하려면 DB를 연결해야 합니다.)
let users = [];
let reservations = [];

// 회원가입 API
app.post('/signup', (req, res) => {
    const { id, password } = req.body;
    const exists = users.find(user => user.id === id);
    if (exists) {
        return res.status(400).send("이미 존재하는 아이디입니다.");
    }

    users.push({ id, password });
    res.send("회원가입 완료!");
});

// 로그인 API
app.post('/login', (req, res) => {
    const { id, password } = req.body;
    const user = users.find(u => u.id === id && u.password === password);
    if (user) {
        res.send("로그인 성공!");
    } else {
        res.status(401).send("아이디 또는 비밀번호가 틀렸습니다.");
    }
});

// 예약 API
app.post('/reserve', (req, res) => {
    const { loc, date, time, court } = req.body;
    
    // 중복 체크
    const isAlreadyBooked = reservations.find(r => 
        r.loc === loc &&
        r.date === date && 
        r.time === time && 
        r.court === court
    );

    if (isAlreadyBooked) {
        return res.status(400).send("죄송합니다. 해당 시간은 이미 다른 분이 예약하셨습니다.");
    }

    reservations.push({ loc, date, time, court });
    res.send(`${date} ${time}에 ${court} 예약이 성공적으로 완료되었습니다.`);
});

// Vercel에서 서버를 실행하기 위한 설정
module.exports = app;

// 로컬 테스트용 (Vercel 배포 시에는 무시됨)
if (process.env.NODE_ENV !== 'production') {
    app.listen(3000, () => console.log("서버 실행 중..."));
}
