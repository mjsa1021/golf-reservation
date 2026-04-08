const mysql = require('mysql2');
const fs = require('fs');

// TiDB Cloud 연결 설정
const connection = mysql.createConnection({
  host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '381kDxf2fwYrQ6L.root',
  password: 'IiG11wQvFcuACtTh',
  database: 'test',
  ssl: {
    // 본인 컴퓨터의 인증서 경로로 수정하세요!
    ca: fs.readFileSync('D:/DB/isrgrootx1.pem'), 
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