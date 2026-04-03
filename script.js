let selectedDate = "";
let selectedTime = "";
let currentMonth = new Date();

const BASE_URL = "https://golf-reservation-seven.vercel.app";

function renderCalendar() {
    const grid = document.getElementById("calendar-grid");
    const display = document.getElementById("current-month-display");
    grid.innerHTML = "";

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    display.innerText = `${year}년 ${month + 1}월`;

    ['일','월','화','수','목','금','토'].forEach(d => {
        const div = document.createElement("div"); 
        div.className = "day-label"; 
        div.innerText = d; 
        grid.appendChild(div);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date(); 
    today.setHours(0,0,0,0);

    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement("div"));


    for (let i = 1; i <= lastDate; i++) {
        const dateObj = new Date(year, month, i);
        const cell = document.createElement("div"); 
        cell.className = "day"; 
        cell.innerText = i;


        if (dateObj < today) {
            cell.classList.add("disabled");
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


function login() {
    const id = document.getElementById("user-id").value;
    const pw = document.getElementById("user-pw").value;

    if (!id || !pw) return alert("아이디와 비밀번호를 입력해주세요.");

    fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw })
    }).then(async res => {
        if (res.ok) {
            localStorage.setItem("userId", id);
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("reserve-section").style.display = "block";
            renderCalendar();
        } else {
            alert("로그인 실패: 아이디나 비밀번호를 다시 확인하세요.");
        }
    }).catch(err => alert("서버 연결에 실패했습니다."));
}


function reserve() {
    const court = document.getElementById("court").value;
    const people = document.getElementById("people-count").value;
    const userId = localStorage.getItem("userId");

    if (!selectedDate) return alert("달력에서 날짜를 먼저 선택해주세요.");
    if (!selectedTime) return alert("운영 시간을 선택해주세요.");

    fetch(`${BASE_URL}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, date: selectedDate, time: selectedTime, court, people })
    }).then(async res => {
        if (res.ok) {
            alert("축하합니다! 예약이 완료되었습니다.");
            // 결과 화면 업데이트
            document.getElementById("result").innerHTML = `
                <div style="color: #2e7d32; font-weight: bold; margin-bottom: 10px;">[최근 예약 내역]</div>
                <div>장소: ${court}</div>
                <div>날짜: ${selectedDate}</div>
                <div>시간: ${selectedTime}</div>
                <div>인원: ${people}명</div>
            `;
        } else {
            const errorMsg = await res.text();
            alert(errorMsg);
        }
    });
}


function toggleSignup() {
    document.getElementById("signup-extra").style.display = "block";
    const btn = document.getElementById("btn-signup-toggle");
    btn.innerText = "정보 확인 후 가입 완료하기";
    btn.style.backgroundColor = "#2e7d32";
    btn.onclick = signup;
}


function signup() {
    const id = document.getElementById("user-id").value;
    const pw = document.getElementById("user-pw").value;
    const name = document.getElementById("user-name").value;
    const birth = document.getElementById("user-birth").value;

    if (!id || !pw || !name || !birth) return alert("모든 항목을 입력해야 가입이 가능합니다.");

    fetch(`${BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: pw, name, birth })
    }).then(async res => {
        const msg = await res.text();
        alert(msg);
        if (res.ok) location.reload(); 
    });
}


function findAccount() {
    const name = document.getElementById("find-name").value;
    const birth = document.getElementById("find-birth").value;

    if (!name || !birth) return alert("이름과 생년월일을 입력해주세요.");

    fetch(`${BASE_URL}/find-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, birth })
    }).then(async res => {
        const result = await res.text();
        alert(result);
    });
}

function showFindModal() { document.getElementById("find-modal").style.display = "block"; }
function closeFindModal() { document.getElementById("find-modal").style.display = "none"; }
function goHome() { location.reload(); }
function showMyInfo() { alert("내 가입 번호: " + localStorage.getItem("userId")); }
function checkMyReserve() { document.getElementById("result").scrollIntoView({ behavior: 'smooth' }); }
