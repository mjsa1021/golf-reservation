function signup() {
    const id = document.getElementById("signup-id").value;
    const pw = document.getElementById("signup-pw").value;
    
    if(!id || !pw) return alert("아이디와 비밀번호를 모두 적어주세요.");

    fetch("https://golf-reservation.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw })
    })
    .then(res => {
        if(res.ok) {
            alert("회원가입이 잘 되었습니다! 이제 로그인을 해주세요.");
        } else {
            alert("회원가입에 실패했습니다.");
        }
    })
    .catch(err => alert("서버 연결 오류가 발생했습니다."));
}

function login() {
    // 로그인 입력창 ID가 signup-id와 동일한지 꼭 확인하세요!
    const id = document.getElementById("signup-id").value; 
    const pw = document.getElementById("signup-pw").value;

    if(!id || !pw) return alert("아이디와 비밀번호를 입력하셔야 합니다.");

    // 실제로는 여기서 서버에 로그인 요청을 보내야 하지만, 
    // 우선 현재 로직대로 화면 전환을 처리합니다.
    alert(id + "님, 환영합니다! 예약 화면으로 이동합니다.");
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("reserve-section").style.display = "block";
}

function reserve() {
    const loc = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const court = document.getElementById("court").value;

    if(!loc || !date || !time || !court) return alert("빠진 항목이 있습니다. 모든 정보를 골라주세요.");

    // 서버에도 예약 정보를 저장합니다.
    fetch("https://golf-reservation.onrender.com/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loc, date, time, court })
    })
    .then(res => {
        document.getElementById("result").innerHTML = `
            <p><strong>[지역]</strong> ${loc}</p>
            <p><strong>[날짜]</strong> ${date}</p>
            <p><strong>[시간]</strong> ${time}</p>
            <p><strong>[구장]</strong> ${court}</p>
            <div style="background:#1b5e20; color:white; padding:15px; margin-top:20px; border-radius:10px;">
                축하합니다! 예약 신청이 정상적으로 접수되었습니다.
            </div>
        `;
    })
    .catch(err => alert("예약 저장 중 오류가 발생했습니다."));
}