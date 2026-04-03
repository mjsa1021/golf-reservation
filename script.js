function toggleSignup() {
    const extra = document.getElementById("signup-extra");
    const btnSignup = document.getElementById("btn-signup-toggle");
    const btnLogin = document.getElementById("btn-login-main");
    if (extra.style.display === "none") {
        extra.style.display = "block";
        btnSignup.innerText = "위 내용으로 가입 완료하기";
        btnLogin.style.display = "none";
        btnSignup.onclick = signup; 
    }
}

function signup() {
    const id = document.getElementById("user-id").value;
    const pw = document.getElementById("user-pw").value;
    const pwConfirm = document.getElementById("user-pw-confirm").value;
    const name = document.getElementById("user-name").value;
    const birth = document.getElementById("user-birth").value;

    if (!id || !pw || !name || !birth) return alert("항목을 모두 입력하세요.");
    if (pw !== pwConfirm) return alert("비밀번호 불일치.");

    fetch("https://golf-reservation-seven.vercel.app/signup", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw, name, birth })
    }).then(async res => {
        alert(await res.text());
        if (res.ok) location.reload();
    });
}

function login() {
    const id = document.getElementById("user-id").value; 
    const pw = document.getElementById("user-pw").value;
    fetch("https://golf-reservation-seven.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw })
    }).then(async res => {
        if (res.ok) {
            localStorage.setItem("userId", id);
            localStorage.setItem("userPw", pw);
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("reserve-section").style.display = "block";
        } else alert(await res.text());
    });
}

function findAccount() {
    const name = document.getElementById("find-name").value;
    const birth = document.getElementById("find-birth").value;
    fetch("https://golf-reservation-seven.vercel.app/find-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birth })
    }).then(async res => alert(await res.text()));
}

function reserve() {
    const loc = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const court = document.getElementById("court").value;
    const people = document.getElementById("people-count").value; // 인원수 추가
    const userId = localStorage.getItem("userId") || "unknown";

    if (!loc || !date || !time || !court) return alert("모든 항목을 선택하세요.");

    fetch("https://golf-reservation-seven.vercel.app/reserve", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, loc, date, time, court, people }) 
    }).then(async res => {
        if (res.ok) {
            alert("예약 완료");
            document.getElementById("result").innerHTML = `
                <p style='color:blue; font-weight:bold;'>[예약 완료 확인서]</p>
                <p><strong>지역/구장:</strong> ${loc} ${court}</p>
                <p><strong>일시:</strong> ${date} ${time}</p>
                <p><strong>인원:</strong> ${people}명</p>
            `;
        } else alert(await res.text());
    });
}

function goHome() { location.reload(); }
function showGuide() { alert("대구, 경산, 팔공, 청도 구장 이용 가능합니다."); }
function checkMyReserve() { document.getElementById("result").scrollIntoView({ behavior: 'smooth' }); }
function showMyInfo() { alert(`아이디: ${localStorage.getItem("userId")}\n비번: ${localStorage.getItem("userPw")}`); }
function showFindModal() { document.getElementById("find-modal").style.display = "block"; }
function closeFindModal() { document.getElementById("find-modal").style.display = "none"; }
