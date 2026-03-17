// script.js

// 회원가입
function signup() {
    const id = document.getElementById("signup-id").value;
    const pw = document.getElementById("signup-pw").value;
    if(!id || !pw) return alert("아이디와 비밀번호를 모두 입력해주세요.");

    fetch("https://golf-reservation.onrender.com/signup", { // 실제 배포된 서버 주소로 변경
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw })
    })
    .then(async res => {
        const msg = await res.text();
        if(res.ok) alert("회원가입이 완료되었습니다! 로그인을 진행해주세요.");
        else alert(msg); // "이미 존재하는 아이디입니다" 등 출력
    })
    .catch(err => alert("서버 연결 오류가 발생했습니다."));
}

// 로그인
function login() {
    const id = document.getElementById("signup-id").value; 
    const pw = document.getElementById("signup-pw").value;

    fetch("https://golf-reservation.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw })
    })
    .then(async res => {
        if(res.ok) {
            alert(id + "님, 환영합니다!");
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("reserve-section").style.display = "block";
        } else {
            const msg = await res.text();
            alert(msg);
        }
    });
}

// 예약하기
function reserve() {
    const loc = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const court = document.getElementById("court").value;

    if(!loc || !date || !time || !court) return alert("모든 정보를 선택해주세요.");

    fetch("https://golf-reservation-seven.vercel.app/reserve", { // 본인 주소 확인
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loc, date, time, court })
    })
    .then(async res => {
        const message = await res.text();
        if(res.ok) {
            alert("예약이 완료되었습니다!");
            document.getElementById("result").innerHTML = `
                <p style='color:blue; font-weight:bold;'>[예약 완료]</p>
                <p><strong>구장:</strong> ${court}</p>
                <p><strong>일시:</strong> ${date} ${time}</p>
            `;
        } else {
            // 서버에서 보낸 "이미 예약된 시간대입니다" 메시지를 띄웁니다.
            alert(message);
        }
    })
    .catch(err => alert("연결 오류가 발생했습니다."));
}
}
