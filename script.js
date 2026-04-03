let selectedDate = "";
let selectedTime = "";
let currentMonth = new Date();

function renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    const display = document.getElementById("current-month-display");
    grid.innerHTML = "";
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    display.innerText = `${year}년 ${month + 1}월`;
    ['일','월','화','수','목','금','토'].forEach(d => {
        const div = document.createElement("div"); div.className = "day-label"; div.innerText = d; grid.appendChild(div);
    });
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date(); today.setHours(0,0,0,0);
    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement("div"));
    for (let i = 1; i <= lastDate; i++) {
        const dateObj = new Date(year, month, i);
        const cell = document.createElement("div"); cell.className = "day"; cell.innerText = i;
        if (dateObj < today) cell.classList.add("disabled");
        else {
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

function changeMonth(diff) { currentMonth.setMonth(currentMonth.getMonth() + diff); renderCalendar(); }
function selectTime(time, btn) { selectedTime = time; document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active")); btn.classList.add("active"); }

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
            renderCalendar();
        } else alert("로그인 실패: 번호나 비번을 확인하세요.");
    });
}

function reserve() {
    const court = document.getElementById("court").value;
    const people = document.getElementById("people-count").value;
    const userId = localStorage.getItem("userId");
    if (!selectedDate || !selectedTime) return alert("날짜와 시간을 선택해주세요.");
    fetch("https://golf-reservation-seven.vercel.app/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, date: selectedDate, time: selectedTime, court, people })
    }).then(async res => {
        if (res.ok) {
            alert("예약 완료!");
            document.getElementById("result").innerHTML = `<b>[예약 완료]</b><br>날짜: ${selectedDate}<br>시간: ${selectedTime}<br>인원: ${people}명`;
        } else alert(await res.text());
    });
}

function toggleSignup() {
    document.getElementById("signup-extra").style.display = "block";
    const btn = document.getElementById("btn-signup-toggle");
    btn.innerText = "정보 확인 후 가입하기";
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

function findAccount() {
    const name = document.getElementById("find-name").value;
    const birth = document.getElementById("find-birth").value;
    fetch("https://golf-reservation-seven.vercel.app/find-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birth })
    }).then(async res => alert(await res.text()));
}

function showFindModal() { document.getElementById("find-modal").style.display = "block"; }
function closeFindModal() { document.getElementById("find-modal").style.display = "none"; }
function goHome() { location.reload(); }
function showMyInfo() { alert("내 번호: " + localStorage.getItem("userId")); }
function checkMyReserve() { document.getElementById("result").scrollIntoView(); }
