// 1. 회원가입 화면 토글 (처음 오셨나요? 누를 때 실행)
function toggleSignup() {
    const extra = document.getElementById("signup-extra");
    const btnSignup = document.getElementById("btn-signup-toggle");
    const btnLogin = document.getElementById("btn-login-main");
    
    // 숨겨진 추가 정보창을 보여줍니다.
    if (extra.style.display === "none") {
        extra.style.display = "block";
        btnSignup.innerText = "위 내용으로 가입 완료하기";
        btnLogin.style.display = "none"; // 가입 중에는 로그인 버튼 숨김
        // 버튼 클릭 시 가입 함수가 실행되도록 변경
        btnSignup.onclick = signup; 
    }
}

// 2. 실제 회원가입 처리 함수
function signup() {
    const id = document.getElementById("user-id").value;
    const pw = document.getElementById("user-pw").value;
    const pwConfirm = document.getElementById("user-pw-confirm").value;
    const name = document.getElementById("user-name").value;
    const birth = document.getElementById("user-birth").value;

    if (!id || !pw || !name || !birth) return alert("모든 항목을 입력해주세요.");
    if (pw !== pwConfirm) return alert("비밀번호가 서로 다릅니다. 다시 확인해주세요.");

    fetch("https://golf-reservation-seven.vercel.app/signup", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw, name, birth })
    })
    .then(async res => {
        const msg = await res.text();
        if (res.ok) {
            alert("회원가입이 완료되었습니다! 이제 로그인을 해주세요.");
            location.reload(); // 화면 초기화
        } else {
            alert(msg); 
        }
    })
    .catch(err => alert("서버 연결 오류가 발생했습니다."));
}

// 3. 로그인 함수
function login() {
    const id = document.getElementById("user-id").value; 
    const pw = document.getElementById("user-pw").value;

    if (!id || !pw) return alert("로그인할 아이디(전화번호)와 비밀번호를 적어주세요.");

    fetch("https://golf-reservation-seven.vercel.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw })
    })
    .then(async res => {
        const msg = await res.text();
        if (res.ok) {
            alert(id + "님, 환영합니다!");
            localStorage.setItem("userId", id); // 로그인 성공 시 아이디 저장
            localStorage.setItem("userPw", pw); // 내 정보 확인용 비밀번호 저장

            // 화면 전환
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("reserve-section").style.display = "block";
        } else {
            alert(msg);
        }
    })
    .catch(err => alert("서버 연결 오류가 발생했습니다."));
}

// 4. 아이디/비밀번호 찾기 함수
function findAccount() {
    const name = document.getElementById("find-name").value;
    const birth = document.getElementById("find-birth").value;

    if (!name || !birth) return alert("성함과 생년월일을 입력해주세요.");

    fetch("https://golf-reservation-seven.vercel.app/find-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birth })
    })
    .then(async res => {
        const msg = await res.text();
        alert(msg); // 서버에서 찾은 정보를 팝업으로 보여줌
    })
    .catch(err => alert("정보를 찾는 중 오류가 발생했습니다."));
}

// 5. 예약 함수
function reserve() {
    const loc = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const court = document.getElementById("court").value;
    const userId = localStorage.getItem("userId") || "unknown";

    if (!loc || !date || !time || !court) return alert("모든 정보를 선택해주세요.");

    fetch("https://golf-reservation-seven.vercel.app/reserve", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, loc, date, time, court }) 
    })
    .then(async res => {
        const message = await res.text();
        if (res.ok) {
            alert("예약 완료");
            document.getElementById("result").innerHTML = `
                <p style='color:blue; font-weight:bold;'>[예약 완료 확인서]</p>
                <p><strong>예약자:</strong> ${userId}</p>
                <p><strong>지역:</strong> ${loc}</p>
                <p><strong>구장:</strong> ${court}</p>
                <p><strong>일시:</strong> ${date} ${time}</p>
            `;
        } else {
            alert(message);
        }
    })
    .catch(err => alert("연결 오류가 발생했습니다."));
}

// --- 상단 메뉴 및 기타 제어 함수 ---

function goHome() { location.reload(); }

function showGuide() {
    alert("현재 예약 가능한 구장:\n1. 대구 CC (회원제)\n2. 인터불고 경산 CC\n3. 팔공 CC\n4. 청도 그레이스 CC");
}

function checkMyReserve() {
    const resultSection = document.getElementById("result");
    if (resultSection.innerText.includes("아직 예약된 정보가 없습니다")) {
        alert("아직 예약하신 내역이 없습니다.");
    } else {
        resultSection.scrollIntoView({ behavior: 'smooth' });
        alert("아래 '나의 예약 확인서'에서 상세 내용을 확인하세요!");
    }
}

function showMyInfo() {
    const id = localStorage.getItem("userId");
    const pw = localStorage.getItem("userPw");
    if (!id) return alert("로그인 정보가 없습니다.");
    alert(`[내 정보 확인]\n아이디(번호): ${id}\n비밀번호: ${pw}`);
}

function showFindModal() { document.getElementById("find-modal").style.display = "block"; }
function closeFindModal() { document.getElementById("find-modal").style.display = "none"; }
