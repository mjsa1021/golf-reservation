let selectedDate = "";
let selectedTime = "";
let currentMonth = new Date();

// --- 달력 생성 로직 ---
function renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    const display = document.getElementById("current-month-display");
    grid.innerHTML = "";

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    display.innerText = `${year}년 ${month + 1}월`;

    // 요일 헤더
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    days.forEach(d => {
        const div = document.createElement("div");
        div.className = "day-label";
        div.innerText = d;
        grid.appendChild(div);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0,0,0,0);

    // 공백
    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement("div"));

    // 날짜 채우기
    for (let i = 1; i <= lastDate; i++) {
        const dateObj = new Date(year, month, i);
        const btn = document.createElement("div");
        btn.className = "day";
        btn.innerText = i;

        if (dateObj < today) {
            btn.classList.add("disabled"); // 지난 날짜는 회색+비활성화
        } else {
            if (dateObj.getTime() === today.getTime()) btn.classList.add("today");
            btn.onclick = () => {
                document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
                btn.classList.add("selected");
                selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            };
        }
        grid.appendChild(btn);
    }
}

function changeMonth(diff) {
    currentMonth.setMonth(currentMonth.getMonth() + diff);
    renderCalendar();
}

// --- 예약 기능 ---
function selectTime(time, btn) {
    selectedTime = time;
    document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

function reserve() {
    const court = document.getElementById("court").value;
    const people = document.getElementById("people-count").value;
    const userId = localStorage.getItem("userId");

    if (!selectedDate) return alert("달력에서 날짜를 먼저 골라주세요.");
    if (!selectedTime) return alert("오전/오후 시간을 골라주세요.");

    fetch("https://golf-reservation-seven.vercel.app/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, date: selectedDate, time: selectedTime, court, people })
    }).then(async res => {
        const msg = await res.text();
        if (res.ok) {
            alert("예약이 완료되었습니다!");
            document.getElementById("result").innerHTML = `
                <p style='color:#2e7d32; font-size:1.5rem;'><b>[예약 성공]</b></p>
                <p>날짜: ${selectedDate}</p>
                <p>시간: ${selectedTime}</p>
                <p>장소: ${court}</p>
                <p>인원: ${people}명</p>
            `;
            document.getElementById("result").scrollIntoView();
        } else alert(msg);
    });
}

// --- 로그인/회원가입 ---
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
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("reserve-section").style.display = "block";
            renderCalendar(); // 로그인 후 달력 그리기
        } else alert("비밀번호가 틀렸거나 없는 번호입니다.");
    });
}

function toggleSignup() {
    const extra = document.getElementById("signup-extra");
    extra.style.display = "block";
    document.getElementById("btn-signup-toggle").innerText = "입력한 정보로 가입하기";
    document.getElementById("btn-signup-toggle").onclick = signup;
}

function signup() {
    const id = document.getElementById("user-id").value;
    const pw = document.getElementById("user-pw").value;
    const name = document.getElementById("user-name").value;
    const birth = document.getElementById("user-birth").value;
    fetch("https://golf-reservation-seven.vercel.app/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw, name, birth })
    }).then(async res => {
        alert(await res.text());
        if (res.ok) location.reload();
    });
}

function goHome() { location.reload(); }
function checkMyReserve() { document.getElementById("my-reservation-view").scrollIntoView({behavior:'smooth'}); }
function showMyInfo() { alert("회원님 번호: " + localStorage.getItem("userId")); }
