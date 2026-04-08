/* ==========================================
   1. 초기 변수 및 설정
   ========================================== */
let selectedDate = "";
let selectedTime = "";
let currentMonth = new Date();

// [필수] HTML 상단에 Supabase 초기화 코드가 반드시 있어야 합니다.
// const _supabase = supabase.createClient('URL', 'KEY');

/* ==========================================
   2. 화면 제어 및 메뉴 이동 (백업 코드 유지 & 보완)
   ========================================== */

// 예약 단계 및 섹션 전환
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

// 공지사항, 이용안내 등 정보 페이지 이동
function goToInfo(type) {
    document.getElementById("auth-section").style.display = "none";
    if (document.getElementById("reserve-section")) document.getElementById("reserve-section").style.display = "none";
    if (document.getElementById("main-info-menu")) document.getElementById("main-info-menu").style.display = "none";
    
    document.getElementById("info-section").style.display = "block";
    document.querySelectorAll('.info-content').forEach(el => el.style.display = "none");
    
    const target = document.getElementById(`info-${type}`);
    if (target) target.style.display = "block";
    window.scrollTo(0, 0);
}

// 홈으로 돌아가기
function goBackHome() {
    document.getElementById("info-section").style.display = "none";
    if (document.getElementById("main-info-menu")) document.getElementById("main-info-menu").style.display = "flex";
    
    const userId = localStorage.getItem("userId");
    if (userId) {
        document.getElementById("reserve-section").style.display = "block";
    } else {
        document.getElementById("auth-section").style.display = "block";
    }
}

/* ==========================================
   3. 회원 관리 로직 (Supabase 연동)
   ========================================== */

// 회원가입 모드 전환 (입력창 토글)
function toggleSignup() {
    const extra = document.getElementById("signup-extra");
    if (extra) extra.style.display = "block";
    
    const btn = document.getElementById("btn-signup-toggle");
    if (btn) {
        btn.innerText = "위 정보로 가입하기";
        btn.style.backgroundColor = "#2e7d32";
        btn.onclick = signup; // 버튼 클릭 시 signup 함수 실행으로 변경
    }
}

// 회원가입 실행
async function signup() {
    const id = document.getElementById("user-id").value;
    const pw = document.getElementById("user-pw").value;
    const name = document.getElementById("user-name").value;
    const birth = document.getElementById("user-birth").value;

    if (!id || !pw || !name) return alert("아이디, 비밀번호, 이름을 모두 입력해주세요.");

    const { error } = await _supabase
        .from('member')
        .insert([{
            mem_id: id,
            mem_pw: pw,
            mem_name: name,
            mem_tel: id // 연락처로 ID(번호) 저장
        }]);

    if (!error) {
        alert("회원가입 성공! 로그인 해주세요.");
        location.reload();
    } else {
        alert("가입 실패: " + error.message);
    }
}

// 로그인 실행
async function login() {
    const id = document.getElementById("user-id").value;
    const pw = document.getElementById("user-pw").value;
    if (!id || !pw) return alert("번호와 비밀번호를 입력해주세요.");

    const { data, error } = await _supabase
        .from('member')
        .select('*')
        .eq('mem_id', id)
        .eq('mem_pw', pw)
        .single();

    if (data) {
        localStorage.setItem("userId", id);
        localStorage.setItem("mem_no", data.mem_no); // HeidiSQL용 고유번호 저장
        alert(data.mem_name + "님 환영합니다!");
        
        document.getElementById("auth-section").style.display = "none";
        document.getElementById("reserve-section").style.display = "block";
        goToStep(1); 
        renderCalendar();
    } else {
        alert("정보가 맞지 않습니다. 다시 확인해주세요.");
    }
}

// 로그아웃
function handleLogout() {
    if(confirm("로그아웃 하시겠습니까?")) {
        localStorage.clear();
        location.reload();
    }
}

/* ==========================================
   4. 달력 및 예약 로직 (백업 코드 유지)
   ========================================== */

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

// 예약 실행
async function reserve() {
    const court = document.getElementById("court").value;
    const people = document.getElementById("people-count").value;
    const memNo = localStorage.getItem("mem_no");
    
    if (!selectedDate || !selectedTime) return alert("날짜와 시간을 선택해주세요.");

    const { error } = await _supabase
        .from('reservation')
        .insert([{
            mem_no: memNo,
            course_no: (court.includes("하양") ? 2 : 1),
            res_date: selectedDate,
            res_time: selectedTime,
            status: '예약완료'
        }]);

    if (!error) {
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
    } else {
        alert("예약 실패: " + error.message);
    }
}

/* ==========================================
   5. 기타 유틸리티
   ========================================== */
function showMyInfo() { alert("내 가입 번호: " + localStorage.getItem("userId")); }
function checkMyReserve() { 
    const resDiv = document.getElementById("result");
    if(!resDiv || resDiv.style.display === "none") alert("아직 예약 내역이 없습니다.");
    else resDiv.scrollIntoView({ behavior: 'smooth' });
}
function goHome() { location.reload(); }
