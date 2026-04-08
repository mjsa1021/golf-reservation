// 서버 주소 설정 (로컬 서버 실행 중이어야 함)
const API_URL = 'http://localhost:3000';

// 1. 회원가입 함수 (HTML input ID들과 일치하도록 수정)
async function signup() {
    // HTML의 input ID가 'user-id', 'user-pw' 등일 경우를 대비해 확인이 필요합니다.
    // 여기서는 올려주신 코드의 ID를 기준으로 하되, 작동 안 할 시 HTML ID를 확인하세요.
    const id = document.getElementById('phone')?.value || document.getElementById('user-id')?.value;
    const password = document.getElementById('pw')?.value || document.getElementById('user-pw')?.value;
    const name = document.getElementById('name')?.value || document.getElementById('user-name')?.value;
    const birth = document.getElementById('birth')?.value || document.getElementById('user-birth')?.value;

    if (!id || !password) {
        alert("아이디와 비밀번호를 입력해주세요.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password, name, birth })
        });

        const result = await response.text();
        if (response.ok) {
            alert("회원가입 성공!");
            // 가입 성공 후 로컬 스토리지에 임시 저장하여 바로 로그인 상태를 유지하거나
            // 로그인 페이지로 이동시킵니다.
            window.location.href = "login.html"; 
        } else {
            alert("가입 실패: " + result);
        }
    } catch (error) {
        console.error("에러 발생:", error);
        alert("서버와 연결할 수 없습니다.");
    }
}

// 2. 예약 완료 버튼 클릭 시 실행되는 함수 (추가됨)
async function handleReserve() {
    // 현재 선택된 날짜와 시간 정보 (기존 달력 로직에서 저장된 변수)
    // selDate와 selTime이 전역 변수로 선언되어 있어야 합니다.
    const uid = localStorage.getItem('uid'); 
    const court = document.getElementById('court')?.value || "경산 파크골프장";
    
    if (!uid) {
        alert("로그인이 필요합니다.");
        return;
    }
    if (!selDate || !selTime) {
        alert("날짜와 시간을 먼저 선택해주세요.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/reserve`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                uid: uid, 
                res_date: selDate, 
                res_time: selTime, 
                court_name: court 
            })
        });

        const result = await response.text();
        if (response.ok) {
            alert("예약이 완료되었습니다!");
            location.reload(); // 성공 시 새로고침하여 내역 갱신
        } else {
            alert("예약 실패: " + result);
        }
    } catch (err) {
        console.error("예약 에러:", err);
        alert("서버와 연결할 수 없습니다.");
    }
}

// 3. 로그아웃 함수
function handleLogout() {
    if(confirm("로그아웃 하시겠습니까?")) {
        localStorage.clear();
        location.reload();
    }
}