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
            
            // [추가] 로그인 성공 시 아이디를 브라우저에 임시 저장 (기록용)
            localStorage.setItem("userId", id); 

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
    
    // 추가부분 로그인할 때 저장했던 아이디 가져오기
    const userId = localStorage.getItem("userId") || "unknown";

    if(!loc || !date || !time || !court) return alert("모든 정보를 선택해주세요.");

    fetch("https://golf-reservation-seven.vercel.app/reserve", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },

        // 수정부분 누가 예약했는지(userId) 정보를 포함하여 서버로 보냄
        body: JSON.stringify({ userId, loc, date, time, court }) 
    })
    .then(async res => {
        const message = await res.text();
        if(res.ok) {
            alert("예약 완료");
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

// 1. 로고 클릭 시 처음 화면으로 (페이지 새로고침)
function goHome() {
    location.reload();
}

// 2. 구장 안내 (알림창으로 간단히 표시)
function showGuide() {
    alert("현재 예약 가능한 구장:\n1. 대구 CC (회원제)\n2. 인터불고 경산 CC\n3. 팔공 CC\n4. 청도 그레이스 CC");
}

// 3. 내 예약 확인 (예약 결과창으로 화면 이동)
function checkMyReserve() {
    const resultSection = document.getElementById("result");
    if (resultSection.innerText.includes("아직 예약된 정보가 없습니다")) {
        alert("아직 예약하신 내역이 없습니다.");
    } else {
        resultSection.scrollIntoView({ behavior: 'smooth' }); // 예약 내역이 있는 곳으로 부드럽게 이동
        alert("아래 '나의 예약 확인서'에서 상세 내용을 확인하세요");
    }
}