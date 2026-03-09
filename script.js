function signup() {
    const id = document.getElementById("signup-id").value;
    const pw = document.getElementById("signup-pw").value;
    
    if(!id || !pw) return alert("아이디와 비밀번호를 모두 적어주세요.");

    fetch("https://golf-reservation.onrender.com/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw })
    })
    .then(res => res.text())
    .then(msg => alert("회원가입이 잘 되었습니다! 이제 로그인을 해주세요."));
}

function login() {
    const id = document.getElementById("signup-id").value;
    const pw = document.getElementById("signup-pw").value;

    if(id && pw) {
        alert(id + "님, 환영합니다! 예약 화면으로 이동합니다.");
        document.getElementById("auth-section").style.display = "none";
        document.getElementById("reserve-section").style.display = "block";
    } else {
        alert("아이디와 비밀번호를 입력하셔야 합니다.");
    }
}

function reserve() {
    const loc = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const court = document.getElementById("court").value;

    if(!loc || !date || !time || !court) return alert("빠진 항목이 있습니다. 모든 정보를 골라주세요.");

    document.getElementById("result").innerHTML = `
        <p><strong>[지역]</strong> ${loc}</p>
        <p><strong>[날짜]</strong> ${date}</p>
        <p><strong>[시간]</strong> ${time}</p>
        <p><strong>[구장]</strong> ${court}</p>
        <div style="background:#1b5e20; color:white; padding:15px; margin-top:20px; border-radius:10px;">
            축하합니다! 예약 신청이 정상적으로 접수되었습니다.
        </div>
    `;
}