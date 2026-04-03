let selectedDate = "";
let selectedTime = "";
let currentMonth = new Date();

const BASE_URL = "https://golf-reservation-seven.vercel.app";

// 퐈면 전환 
function goToStep(stepNumber) {
    document.querySelectorAll('.reserve-step').forEach(step => step.style.display = 'none');
    const target = document.getElementById(`step-${stepNumber}`);
    if (target) {
        target.style.display = 'block';
        window.scrollTo(0, 0);
    }

    if (stepNumber === 3) {
        const court = document.getElementById("court").value;
        const infoDiv = document.getElementById("final-check");
        infoDiv.innerHTML = `
            <p style="font-size:1.3rem; margin-bottom:10px;"><strong>[예약 내용 확인]</strong></p>
            <p>날짜: ${selectedDate}</p>
            <p>시간: ${selectedTime}</p>
            <p>구장: ${court}</p>
            <p style="color:red; font-weight:bold; margin-top:10px;">내용이 맞으시면 버튼을 눌러주세요.</p>
        `;
    }
}

// [8, 9, 10번 반영] 안내 페이지 추가부분
function goToInfo(type) {
    document.getElementById("auth-section").style.display = "none";
    document.getElementById("reserve-section").style.display = "none";
    document.getElementById("main-info-menu").style.display = "none";
    document.getElementById("info-section").style.display = "block";
    
    document.querySelectorAll('.info-content').forEach(el => el.style.display = "none");
    document.getElementById(`info-${type}`).style.display = "block";
    window.scrollTo(0, 0);
}

function goBackHome() {
    document.getElementById("info-section").style.display = "none";
    document.getElementById("main-info-menu").style.display = "flex";
    const userId = localStorage.getItem("userId");
    if (userId) document.getElementById("reserve-section").style.display = "block";
    else document.getElementById("auth-section").style.display = "block";
}

// 달력 그리기 로직
function renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    const display = document.getElementById("current-month-display");
    if (!grid || !display) return;
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
function selectTime(time, btn) { 
    selectedTime = time; 
    document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active")); 
    btn.classList.add("active"); 
}

// 로그인 및 회원가입
function login() {
    const id = document.getElementById("user-id").value;
    const pw = document.getElementById("user-pw").value;
    if (!id || !pw) return alert("번호와 비밀번호를 입력해주세요.");
    fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw })
    }).then(async res => {
        if (res.ok) {
            localStorage.setItem("userId", id);
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("reserve-section").style.display = "block";
            goToStep(1); renderCalendar();
        } else alert("정보가 맞지 않습니다. 다시 확인해주세요.");
    }).catch(err => alert("서버 연결 실패"));
}

function reserve() {
    const court = document.getElementById("court").value;
    const people = document.getElementById("people-count").value;
    const userId = localStorage.getItem("userId");
    if (!selectedDate || !selectedTime) return alert("날짜와 시간을 선택해주세요.");
    fetch(`${BASE_URL}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, date: selectedDate, time: selectedTime, court, people })
    }).then(async res => {
        if (res.ok) {
            alert("예약이 완료되었습니다!");
            document.querySelectorAll('.reserve-step').forEach(s => s.style.display = 'none');
            const resultDiv = document.getElementById("result");
            resultDiv.style.display = "block";
            const bNo = "G-" + Math.floor(Math.random() * 1000000);
            resultDiv.innerHTML = `
                <h2 style="color:#2e7d32;">[예약 완료 확인서]</h2>
                <div style="background:#f0f0f0; padding:15px; font-size:1.5rem; margin:10px 0;">접수번호: ${bNo}</div>
                <p>일시: ${selectedDate} ${selectedTime}</p>
                <p>장소: ${court} (${people}명)</p>
                <p style="font-size:0.9rem; color:#666;">현장 관리자에게 접수번호를 보여주세요.</p>
            `;
        } else alert(await res.text());
    });
}

function toggleSignup() {
    document.getElementById("signup-extra").style.display = "block";
    const btn = document.getElementById("btn-signup-toggle");
    btn.innerText = "위 정보로 가입하기";
    btn.style.backgroundColor = "#2e7d32";
    btn.onclick = signup;
}

function signup() {
    const id = document.getElementById("user-id").value;
    const pw = document.getElementById("user-pw").value;
    const name = document.getElementById("user-name").value;
    const birth = document.getElementById("user-birth").value;
    if (!id || !pw || !name || !birth) return alert("모든 빈칸을 채워주세요.");
    fetch(`${BASE_URL}/signup`, {
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
    fetch(`${BASE_URL}/find-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birth })
    }).then(async res => alert(await res.text()));
}

function showFindModal() { document.getElementById("find-modal").style.display = "block"; }
function closeFindModal() { document.getElementById("find-modal").style.display = "none"; }
function goHome() { location.reload(); }
function showMyInfo() { alert("내 가입 번호: " + localStorage.getItem("userId")); }
function checkMyReserve() { 
    const resDiv = document.getElementById("result");
    if(resDiv.style.display === "none") alert("아직 예약 내역이 없습니다.");
    else resDiv.scrollIntoView({ behavior: 'smooth' });
}
