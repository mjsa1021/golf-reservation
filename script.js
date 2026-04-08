// 1. 서버 주소 설정
// 로컬 테스트 시에는 'http://localhost:3000'을 사용합니다.
const API_URL = 'http://localhost:3000';

// 2. 회원가입 함수
async function signup() {
    // HeidiSQL 테이블 컬럼명에 맞게 변수를 매칭합니다
    const mem_id = document.getElementById('phone')?.value || document.getElementById('user-id')?.value;
    const mem_pw = document.getElementById('pw')?.value || document.getElementById('user-pw')?.value;
    const mem_name = document.getElementById('name')?.value || document.getElementById('user-name')?.value;
    const mem_birth = document.getElementById('birth')?.value || document.getElementById('user-birth')?.value;

    if (!mem_id || !mem_pw) {
        alert("아이디와 비밀번호를 입력해주세요.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // 서버의 'server.js'에서 받는 이름과 일치시켜야 합니다.
            body: JSON.stringify({ 
                id: mem_id, 
                password: mem_pw, 
                name: mem_name, 
                birth: mem_birth 
            })
        });

        const result = await response.text();
        if (response.ok) {
            alert("회원가입 성공!");
            window.location.href = "login.html"; 
        } else {
            alert("가입 실패: " + result);
        }
    } catch (error) {
        console.error("에러 발생:", error);
        alert("서버 연결 에러: 내 컴퓨터에서 'node server.js'가 실행 중인지 확인하세요.");
    }
}

// 3. 예약 완료 버튼 클릭 시 실행되는 함수
async function handleReserve() {
    // 전역 변수 selDate, selTime이 선언되어 있어야 합니다.
    const uid = localStorage.getItem('uid'); 
    const court = document.getElementById('court')?.value || "경산 파크골프장";
    
    if (!uid) {
        alert("로그인이 필요합니다.");
        return;
    }
    if (typeof selDate === 'undefined' || !selDate || !selTime) {
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

        if (response.ok) {
            alert("예약이 완료되었습니다!");
            location.reload(); 
        } else {
            const result = await response.text();
            alert("예약 실패: " + result);
        }
    } catch (err) {
        console.error("예약 에러:", err);
        alert("서버 연결 에러: Vercel 주소가 아닌 로컬 환경에서 테스트하세요.");
    }
}

// 4. 로그아웃 함수
function handleLogout() {
    if(confirm("로그아웃 하시겠습니까?")) {
        localStorage.clear();
        location.reload();
    }
}