# webscarping

## Pinterest Originals Image Scraper (Puppeteer)

สคริปต์นี้ใช้ Puppeteer สำหรับดึงลิงก์รูปภาพต้นฉบับ (originals) จากหน้า Pinterest โดยจะ scroll หน้าเว็บและสะสมลิงก์ originals ที่ไม่ซ้ำกันสูงสุด 200 รูป พร้อมบันทึกลงไฟล์ `images.json`

### วิธีใช้งาน

1. ติดตั้ง dependencies (ต้องมี Node.js)
   ```
   npm install puppeteer
   ```

2. แก้ไข URL Pinterest ที่ต้องการในไฟล์ `webscrape.js` (บรรทัดล่างๆ)

3. รันสคริปต์
   ```
   node webscrape.js
   ```

4. ผลลัพธ์จะถูกบันทึกในไฟล์ `images.json` เป็น array ของลิงก์ originals (สูงสุด 200 รูป)

### หมายเหตุ
- สคริปต์นี้ออกแบบมาเพื่อ Pinterest โดยเฉพาะ และจะดึงเฉพาะลิงก์ที่มี `/originals/` ใน URL เท่านั้น
- ใช้ headless browser จำลองการ scroll เพื่อให้โหลดรูปแบบ lazy load ได้ครบ
- หากต้องการ scrape เว็บอื่นหรือปรับจำนวนรูป สามารถแก้ไขโค้ดใน `webscrape.js` ได้



