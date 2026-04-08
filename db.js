const mysql = require('mysql2');
const fs = require('fs');
const path = require('path'); // 파일 경로를 안전하게 잡기 위해 추가

// TiDB Cloud 연결 설정
const connection = mysql.createConnection({
  host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '381kDxf2fwYrQ6L.root',
  password: 'IiG11wQvFcuACtTh',
  database: 'test',
  ssl: {
    // 현재 파일(db.js) 위치를 기준으로 같은 폴더에 있는 인증서를 읽어옵니다.
    ca: fs.readFileSync(path.join(__dirname, 'isrgrootx1.pem')), 
    rejectUnauthorized: true
  }
});

connection.connect((err) => {
  if (err) {
    console.error('TiDB 연결 실패: ' + err.stack);
    return;
  }
  console.log('TiDB Cloud 연결 성공! 이제 데이터를 주고받을 수 있습니다.');
});

module.exports = connection;