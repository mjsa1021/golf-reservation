// script.js

// 회원가입
function signup() {
    const id = document.getElementById("signup-id").value;
    const pw = document.getElementById("signup-pw").value;
    if(!id || !pw) return alert("아이디와 비밀번호를 모두 입력해주세요.");

    // 주소를 vercel 주소로 수정했습니다.
    fetch("https://golf-reservation-seven.vercel.app/signup", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw })
    })
    .then(async res => {
        const msg = await res.text();
        if(res.ok) alert("회원가입이 완료되었습니다! 이제 로그인을 진행해주세요.");
        else alert(msg); 
    })
    .catch(err => alert("서버 연결 오류가 발생했습니다."));
}

// 로그인
function login() {
    // 1. 아래 id 이름들이 HTML의 input 태그 id와 똑같은지 확인하세요!
    // 보통 로그인 칸은 "login-id", "login-pw"라고 이름을 붙입니다.
    const id = document.getElementById("login-id").value; 
    const pw = document.getElementById("login-pw").value;

    if(!id || !pw) return alert("아이디와 비밀번호를 입력해주세요.");

    fetch("https://golf-reservation-seven.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw })
    })
    .then(async res => {
        const msg = await res.text();
        if(res.ok) {
            alert(id + "님, 환영합니다!");
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("reserve-section").style.display = "block";
        } else {
            alert(msg);
        }
    })
    .catch(err => alert("서버 연결 오류가 발생했습니다."));
}

// 예약하기
function reserve() {
    const loc = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const court = document.getElementById("court").value;

    if(!loc || !date || !time || !court) return alert("모든 정보를 선택해주세요.");

    fetch("https://golf-reservation-seven.vercel.app/reserve", { 
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
                <p><strong>지역:</strong> ${loc}</p>
                <p><strong>구장:</strong> ${court}</p>
                <p><strong>일시:</strong> ${date} ${time}</p>
            `;
        } else {
            alert(message); // 중복 예약 시 서버 메시지("이미 예약된 시간대입니다") 출력
        }
    })
    .catch(err => alert("연결 오류가 발생했습니다."));
}
