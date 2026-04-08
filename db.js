const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
  host: 'gateway01.ap-northeast-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '381kDxf2fwYrQ6L.root',
  password: 'IiG11wQvFcuACtTh',
  database: 'test',
  ssl: {
    // path.join과 __dirname을 써야 Vercel 서버에서 인증서를 인식합니다.
    ca: fs.readFileSync(path.join(__dirname, 'isrgrootx1.pem')), 
    rejectUnauthorized: true
  }
});

connection.connect((err) => {
  if (err) {
    console.error('TiDB 연결 실패: ' + err.stack);
    return;
  }
  console.log('TiDB Cloud 연결 성공!');
});

module.exports = connection;