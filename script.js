// 회원가입 함수
function signup() {
    const id = document.getElementById("signup-id").value;
    const pw = document.getElementById("signup-pw").value;

    if(!id || !pw) return alert("아이디와 비밀번호를 모두 입력해주세요.");

    fetch("https://golf-reservation-seven.vercel.app/signup", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw })
    })
    .then(async res => {
        const msg = await res.text();
        if(res.ok) alert("회원가입이 완료되었습니다! 이제 로그인 버튼을 눌러주세요.");
        else alert(msg); 
    })
    .catch(err => alert("서버 연결 오류가 발생했습니다."));
}

// 로그인 함수
function login() {
    const id = document.getElementById("signup-id").value; 
    const pw = document.getElementById("signup-pw").value;

    if(!id || !pw) return alert("로그인할 아이디와 비밀번호를 적어주세요.");

    fetch("https://golf-reservation-seven.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw })
    })
    .then(async res => {
        const msg = await res.text();
        if(res.ok) {
            alert(id + "님, 환영합니다!");
            // 로그인 성공 시 화면 전환
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("reserve-section").style.display = "block";
        } else {
            alert(msg); // "아이디 또는 비밀번호가 틀렸습니다" 알림
        }
    })
    .catch(err => alert("서버 연결 오류가 발생했습니다."));
}

// 예약 함수
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
                <p style='color:blue; font-weight:bold;'>[예약 완료 확인서]</p>
                <p><strong>지역:</strong> ${loc}</p>
                <p><strong>구장:</strong> ${court}</p>
                <p><strong>일시:</strong> ${date} ${time}</p>
            `;
        } else {
            alert(message); // 중복 예약 알림
        }
    })
    .catch(err => alert("연결 오류가 발생했습니다."));
}
