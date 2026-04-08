// 회원가입 버튼 클릭 이벤트
async function signup() {
    const id = document.getElementById('phone').value;
    const password = document.getElementById('pw').value;
    const name = document.getElementById('name').value;
    const birth = document.getElementById('birth').value;

    try {
        // 로컬 테스트 시에는 http://localhost:3000/signup 으로 보냅니다.
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password, name, birth })
        });

        const result = await response.text();
        if (response.ok) {
            alert("회원가입 성공!");
            window.location.href = "login.html"; // 가입 성공 시 로그인 페이지로
        } else {
            alert("가입 실패: " + result);
        }
    } catch (error) {
        console.error("에러 발생:", error);
        alert("서버와 연결할 수 없습니다.");
    }
}