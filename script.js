// 1. 서버 주소 설정
const API_URL = 'http://localhost:3000';

// 2. 로그인 및 회원가입 통합 처리 함수 (index.html의 handleAuth와 매칭)
async function handleAuth() {
    const id = document.getElementById('user-id').value;
    const pw = document.getElementById('user-pw').value;

    if (!id || !pw) {
        alert("아이디와 비밀번호를 입력해주세요.");
        return;
    }

    // 회원가입 모드일 때 (isSignupMode는 html에 선언됨)
    if (isSignupMode) {
        const name = document.getElementById('user-name').value;
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: id, 
                    password: pw, 
                    name: name,
                    tel: id // HeidiSQL mem_tel 컬럼에 저장
                })
            });

            if (response.ok) {
                alert("회원가입 성공! 로그인 해주세요.");
                location.reload();
            } else {
                const result = await response.text();
                alert("가입 실패: " + result);
            }
        } catch (error) {
            alert("서버 연결 에러: 'node server.js'가 실행 중인지 확인하세요.");
        }
    } 
    // 로그인 모드일 때
    else {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, password: pw })
            });

            if (response.ok) {
                localStorage.setItem('uid', id);
                localStorage.setItem('uname', id); 
                showReserveSection(id); // HTML에 정의된 함수 호출
            } else {
                alert("로그인 실패: 정보를 확인해주세요.");
            }
        } catch (error) {
            alert("서버 연결 에러!");
        }
    }
}

// 3. 예약 완료 버튼 함수 (index.html의 reserve()와 매칭)
async function reserve() {
    const uid = localStorage.getItem('uid'); 
    const court = document.getElementById('court')?.value || "경산 파크골프장";
    
    if (!uid) {
        alert("로그인이 필요합니다.");
        return;
    }
    // selDate, selTime은 HTML 전역변수 사용
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
        alert("서버 연결 에러: 로컬 환경(Live Server)에서 테스트하세요.");
    }
}

// 4. 로그아웃 함수
function handleLogout() {
    if(confirm("로그아웃 하시겠습니까?")) {
        localStorage.clear();
        location.reload();
    }
}