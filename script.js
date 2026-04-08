/* ==========================================
   1. 초기 설정
   ========================================== */
let selectedDate = "";
let selectedTime = "";
let currentMonth = new Date();

/* ==========================================
   2. 회원 관리 (회원가입 먹통 해결 버전)
   ========================================== */

// [회원가입창 토글] - 버튼 클릭 시 입력창 노출 및 함수 연결
function toggleSignup() {
    console.log("회원가입 모드 전환");
    const extra = document.getElementById("signup-extra");
    if (extra) extra.style.display = "block";
    
    const btn = document.getElementById("btn-signup-toggle");
    if (btn) {
        btn.innerText = "위 정보로 가입하기";
        btn.style.backgroundColor = "#2e7d32";
        // [중요] 여기서 signup 함수를 버튼에 직접 연결합니다.
        btn.onclick = signup; 
    }
}

// [회원가입 실행] - Supabase 데이터 전송
async function signup() {
    console.log("signup 함수 진입"); // 로그 확인용

    const id = document.getElementById("user-id").value;
    const pw = document.getElementById("user-pw").value;
    const name = document.getElementById("user-name").value;

    if (!id || !pw || !name) {
        alert("아이디, 비밀번호, 이름을 모두 입력해주세요.");
        return;
    }

    try {
        console.log("DB 데이터 전송 시작...");
        const { data, error } = await _supabase
            .from('member')
            .insert([{
                mem_id: id,
                mem_pw: pw,
                mem_name: name,
                mem_tel: id 
            }]);

        if (error) {
            console.error("Supabase 가입 에러:", error);
            alert("가입 실패: " + error.message);
        } else {
            console.log("가입 성공!");
            alert("회원가입이 완료되었습니다! 로그인 해주세요.");
            location.reload(); // 성공 시 새로고침하여 로그인창으로 이동
        }
    } catch (e) {
        console.error("시스템 에러:", e);
        alert("연결 중 오류가 발생했습니다.");
    }
}

// [로그인 실행]
async function login() {
    const id = document.getElementById("user-id").value;
    const pw = document.getElementById("user-pw").value;
    
    if (!id || !pw) return alert("번호와 비밀번호를 입력해주세요.");

    try {
        const { data, error } = await _supabase
            .from('member')
            .select('*')
            .eq('mem_id', id)
            .eq('mem_pw', pw)
            .single();

        if (data) {
            localStorage.setItem("userId", id);
            localStorage.setItem("mem_no", data.mem_no);
            alert(data.mem_name + "님 환영합니다!");
            
            document.getElementById("auth-section").style.display = "none";
            document.getElementById("reserve-section").style.display = "block";
            goToStep(1); 
            renderCalendar();
        } else {
            alert("정보가 맞지 않습니다. 다시 확인해주세요.");
        }
    } catch (e) {
        alert("로그인 중 오류가 발생했습니다.");
    }
}

// [로그아웃]
function handleLogout() {
    if(confirm("로그아웃 하시겠습니까?")) {
        localStorage.clear();
        location.reload();
    }
}

/* ==========================================
   3. 화면 제어 로직 (백업본 유지)
   ========================================== */

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
        infoDiv.innerHTML = `<p>날짜: ${selectedDate}</p><p>시간: ${selectedTime}</p><p>구장: ${court}</p>`;
    }
}

function goToInfo(type) {
    document.getElementById("auth-section").style.display = "none";
    if (document.getElementById("reserve-section")) document.getElementById("reserve-section").style.display = "none";
    if (document.getElementById("main-info-menu")) document.getElementById("main-info-menu").style.display = "none";
    
    document.getElementById("info-section").style.display = "block";
    document.querySelectorAll('.info-content').forEach(el => el.style.display = "none");
    const target = document.getElementById(`info-${type}`);
    if (target) target.style.display = "block";
}

function goBackHome() {
    document.getElementById("info-section").style.display = "none";
    if (document.getElementById("main-info-menu")) document.getElementById("main-info-menu").style.display = "flex";
    if (localStorage.getItem("userId")) {
        document.getElementById("reserve-section").style.display = "block";
    } else {
        document.getElementById("auth-section").style.display = "block";
    }
}

/* ==========================================
   4. 달력 및 예약 로직
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

async function reserve() {
    const court = document.getElementById("court").value;
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
        location.reload();
    } else {
        alert("예약 실패: " + error.message);
    }
}

function showMyInfo() { alert("내 가입 번호: " + localStorage.getItem("userId")); }
function goHome() { location.reload(); }
