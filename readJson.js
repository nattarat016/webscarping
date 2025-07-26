const fs = require('fs');

// อ่านไฟล์ .json
const raw = fs.readFileSync('images.json', 'utf-8');
const urls = JSON.parse(raw);

// แสดงออกแบบไม่มี quote หรือ comma
urls.forEach(url => console.log(url));
