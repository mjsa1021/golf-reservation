let selectedDate = "";
let selectedTime = "";
let currentMonth = new Date();

// --- 달력 그리기 기능 ---
function renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    const display = document.getElementById("current-month-display");
    grid.innerHTML = "";

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    display.innerText = `${year}년 ${month + 1}월`;

    const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
    dayLabels.forEach(d => {
        const div = document.createElement("div");
        div.className = "day-label";
        div.innerText = d;
        grid.appendChild(div);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement("div"));

    for (let i = 1; i <= lastDate; i++) {
        const dateObj = new Date(year, month, i);
        const cell = document.createElement("div");
        cell.className = "day";
        cell.innerText = i;

        if (dateObj < today) {
            cell.classList.add("disabled"); // 지난 날짜는 회색
        } else {
            if (dateObj.getTime() === today.getTime()) cell.classList.add("today");
            cell.onclick = () => {
                document.querySelectorAll(".day").forEach(d => d.classList.remove("selected"));
                cell.classList.add("selected");
                selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            };
        }
        grid.appendChild(cell);
    }
}

function changeMonth(diff) {
    currentMonth.setMonth(currentMonth.getMonth() + diff);
    renderCalendar();
}

function selectTime(time, btn) {
    selectedTime = time;
    document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
}

// --- 예약 및 통신 ---
function reserve() {
    const court = document.getElementById("court").value;
    const people = document.getElementById("people-count").value;
    const userId = localStorage.getItem("userId") || "unknown";

    if (!selectedDate) return alert("달력에서 날짜를 선택해주세요.");
    if (!selectedTime) return alert("오전/오후 시간을 선택해주세요.");

    fetch("https://golf-reservation-seven.vercel.app/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, date: selectedDate, time: selectedTime, court, people })
    }).then(async res => {
        const msg = await res.text();
        if (res.ok) {
            alert("예약 완료!");
            document.getElementById("result").innerHTML = `
                <p style='color:#2e7d32; font-weight:bold; font-size:1.6rem;'>[예약 확인서]</p>
                <p>날짜: ${selectedDate}</p>
                <p>시간: ${selectedTime}</p>
                <p>구장: ${court}</p>
                <p>인원: ${people}명</p>
            `;
        } else alert(msg);
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
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("reserve-section").style.display = "block";
            renderCalendar();
        } else alert("정보가 올바르지 않습니다.");
    });
}

function toggleSignup() {
    document.getElementById("signup-extra").style.display = "block";
    const btn = document.getElementById("btn-signup-toggle");
    btn.innerText = "위 정보로 가입하기";
    btn.onclick = signup;
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
function checkMyReserve() { document.getElementById("result").scrollIntoView({ behavior: 'smooth' }); }
function showMyInfo() { alert("회원님 연락처: " + localStorage.getItem("userId")); }
