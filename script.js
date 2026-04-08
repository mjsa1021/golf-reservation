const _supabase = supabase.createClient(
    'https://cxihknkegqjllaetliui.supabase.co', 
    'sb_publishable_GPYrYSU37rxlEG0DpKDFgA_oTwChTDK'
);

let isSignupMode = false;
let selDate = "";
let selTime = "";
let currentMonth = new Date();

window.onload = function() {
    const savedNo = localStorage.getItem('m_no');
    const savedName = localStorage.getItem('uname');
    if (savedNo && savedName) {
        showReserveSection(savedName);
    }
};


function showSection(id) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    window.scrollTo(0, 0);
}

function goHome() {
    if (localStorage.getItem('m_no')) showSection('reserve-section');
    else showSection('auth-section');
}

function showInfo(type) {
    showSection('info-section');
    const title = document.getElementById('info-title');
    const body = document.getElementById('info-body');
    
    if(type === 'notice') {
        title.innerText = "공지사항";
        body.innerHTML = "준비 중입니다.";
    } else {
        title.innerText = "게시판";
        body.innerHTML = "준비 중입니다.";
    }
}

function showReserveSection(name) {
    showSection('reserve-section');
    document.getElementById('user-display-name').innerText = name + " 님";
    document.getElementById('logout-btn').style.display = 'inline';
    initCalendar();
    fetchMyReservations();
}

// 4. 인증 (로그인/회원가입)
function toggleSignup() {
    isSignupMode = !isSignupMode;
    document.getElementById('signup-extra').style.display = isSignupMode ? 'block' : 'none';
    document.getElementById('btn-auth-main').innerText = isSignupMode ? '가입 완료' : '로그인 하기';
    document.getElementById('btn-signup-toggle').innerText = isSignupMode ? '취소하고 로그인으로' : '회원가입 하기';
}

async function handleAuth() {
    const id = document.getElementById('user-id').value;
    const pw = document.getElementById('user-pw').value;

    if (isSignupMode) {
        const name = document.getElementById('user-name').value;
        const birth = document.getElementById('user-birth').value;
        if(!id || !pw || !name) return alert("필수 항목을 모두 입력해주세요.");

        const { error } = await _supabase.from('member').insert([
            { mem_id: id, mem_pw: pw, mem_name: name, mem_tel: birth }
        ]);
        if (error) alert("이미 가입된 아이디이거나 오류가 발생했습니다.");
        else { alert("가입 성공! 이제 로그인 해주세요."); location.reload(); }
    } else {
        const { data } = await _supabase.from('member').select('*').eq('mem_id', id).eq('mem_pw', pw).single();
        if (data) {
            localStorage.setItem('m_no', data.mem_no); // SQL의 mem_no 키값 저장
            localStorage.setItem('uname', data.mem_name);
            showReserveSection(data.mem_name);
        } else {
            alert("정보가 올바르지 않습니다.");
        }
    }
}

function handleLogout() {
    if(confirm("로그아웃 하시겠습니까?")) {
        localStorage.clear();
        location.reload();
    }
}

// 5. 달력 기능
function initCalendar() {
    const grid = document.getElementById('calendar-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    document.getElementById('current-month-display').innerText = `${year}년 ${month + 1}월`;
    
    ['일','월','화','수','목','금','토'].forEach(d => {
        const el = document.createElement('div');
        el.className = 'day-label';
        el.innerText = d;
        grid.appendChild(el);
    });
    
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0,0,0,0);

    for(let i=0; i<firstDay; i++) grid.appendChild(document.createElement('div'));
    for(let i=1; i<=lastDate; i++) {
        const d = document.createElement('div');
        const dObj = new Date(year, month, i);
        d.className = 'day';
        d.innerText = i;
        if(dObj < today) d.style.color = '#ccc';
        else {
            d.onclick = () => {
                document.querySelectorAll('.day').forEach(el => el.classList.remove('selected'));
                d.classList.add('selected');
                selDate = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
            };
        }
        grid.appendChild(d);
    }
}

function changeMonth(diff) {
    currentMonth.setMonth(currentMonth.getMonth() + diff);
    initCalendar();
}

// 6. 예약 단계 제어
function selectTime(t, btn) {
    selTime = t;
    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function goToStep(n) {
    if (n === 2 && !selDate) return alert("날짜를 먼저 선택해주세요.");
    if (n === 3 && !selTime) return alert("예약 시간을 선택해주세요.");
    
    document.getElementById('step-1').style.display = 'none';
    document.getElementById('step-2').style.display = 'none';
    document.getElementById('step-3').style.display = 'none';
    document.getElementById(`step-${n}`).style.display = 'block';
    
    if (n === 3) {
        document.getElementById('final-check').innerHTML = `
            <p><strong>[선택한 예약 정보]</strong></p>
            일자: ${selDate}<br>
            장소: ${document.getElementById('court').value}<br>
            시간: ${selTime === '09:00' ? '오전 (09:00 ~ 12:00)' : '오후 (13:00 ~ 17:00)'}
        `;
    }
}

// 7. 예약 및 취소 연동 (SQL 필드 기준)
async function reserve() {
    const m_no = localStorage.getItem('m_no');
    const court = document.getElementById('court').value;

    // 중복 예약 방지 확인
    const { data: dup } = await _supabase.from('reservation')
        .select('*')
        .eq('res_date', selDate)
        .eq('res_time', selTime)
        .eq('court_name', court);

    if (dup && dup.length > 0) return alert("이미 예약이 완료된 시간대입니다.");

    const { error } = await _supabase.from('reservation').insert([{
        mem_no: m_no, // member 테이블의 FK
        res_date: selDate,
        res_time: selTime,
        court_name: court
    }]);

    if (error) alert("서버 오류로 예약에 실패했습니다.");
    else { alert("예약이 완료되었습니다."); location.reload(); }
}

async function fetchMyReservations() {
    const m_no = localStorage.getItem('m_no');
    const { data, error } = await _supabase.from('reservation')
        .select('*')
        .eq('mem_no', m_no)
        .order('res_date', { ascending: true });

    const listDiv = document.getElementById('my-res-list');
    if (!data || data.length === 0) {
        listDiv.innerHTML = "<p style='color:#999;'>내역이 없습니다.</p>";
        return;
    }
    listDiv.innerHTML = data.map(res => `
        <div class="res-item">
            <div>
                <strong>${res.res_date}</strong> (${res.res_time === '09:00' ? '오전' : '오후'})<br>
                <small>${res.court_name}</small>
            </div>
            <button class="btn-cancel" onclick="cancelRes(${res.res_no})">취소</button>
        </div>
    `).join('');
}

async function cancelRes(no) {
    if(!confirm("정말 예약을 취소하시겠습니까?")) return;
    const { error } = await _supabase.from('reservation').delete().eq('res_no', no);
    if(error) alert("오류 발생");
    else { alert("취소되었습니다."); fetchMyReservations(); }
}
