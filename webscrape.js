// webscrape.js
// ดึงลิงค์รูปภาพทั้งหมดจาก tag <img> ในหน้าเว็บด้วย puppeteer

const puppeteer = require('puppeteer');
const fs = require('fs');

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function scrapePinterestImages(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Scroll ทีละหน้าจอและสะสมลิงก์ originals หลัง scroll แต่ละรอบ
    let prevHeight = 0;
    let sameCount = 0;
    const allOriginals = new Set();
    while (sameCount < 4 && allOriginals.size < 200) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await delay(900);
        // ดึงลิงก์ originals รอบนี้
        const links = await page.evaluate(() => {
            const urls = new Set();
            document.querySelectorAll('img').forEach(img => {
                // srcset
                const srcset = img.getAttribute('srcset');
                if (srcset) {
                    srcset.split(',').forEach(item => {
                        const url = item.trim().split(' ')[0];
                        if (url && url.includes('/originals/') && !url.includes('videos/thumbnails/')) urls.add(url);
                    });
                }
                // data-pin-media
                const pin = img.getAttribute('data-pin-media');
                if (pin && pin.includes('/originals/')) urls.add(pin);
                // data-media
                const media = img.getAttribute('data-media');
                if (media && media.includes('/originals/')) urls.add(media);
                // data-image-src
                const imgsrc = img.getAttribute('data-image-src');
                if (imgsrc && imgsrc.includes('/originals/')) urls.add(imgsrc);
                // src
                if (img.src && img.src.includes('/originals/')) urls.add(img.src);
                // data-src
                const ds = img.getAttribute('data-src');
                if (ds && ds.includes('/originals/')) urls.add(ds);
                // data-lazy-src
                const dls = img.getAttribute('data-lazy-src');
                if (dls && dls.includes('/originals/')) urls.add(dls);
            });
            return Array.from(urls);
        });
        links.forEach(link => allOriginals.add(link));
        console.log(`[Scroll] สะสม originals: ${allOriginals.size}`);
        if (allOriginals.size >= 200) break;
        const currentHeight = await page.evaluate('document.body.scrollHeight');
        if (currentHeight === prevHeight) {
            sameCount++;
        } else {
            sameCount = 0;
        }
        prevHeight = currentHeight;
    }
    // รอโหลด originals สุดท้าย
    await delay(2500);
    // ดึงรอบสุดท้าย
    const lastLinks = await page.evaluate(() => {
        const urls = new Set();
        document.querySelectorAll('img').forEach(img => {
            const srcset = img.getAttribute('srcset');
            if (srcset) {
                srcset.split(',').forEach(item => {
                    const url = item.trim().split(' ')[0];
                    if (url && url.includes('/originals/') && !url.includes('videos/thumbnails/')) urls.add(url);
                });
            }
            const pin = img.getAttribute('data-pin-media');
            if (pin && pin.includes('/originals/')) urls.add(pin);
            const media = img.getAttribute('data-media');
            if (media && media.includes('/originals/')) urls.add(media);
            const imgsrc = img.getAttribute('data-image-src');
            if (imgsrc && imgsrc.includes('/originals/')) urls.add(imgsrc);
            if (img.src && img.src.includes('/originals/')) urls.add(img.src);
            const ds = img.getAttribute('data-src');
            if (ds && ds.includes('/originals/')) urls.add(ds);
            const dls = img.getAttribute('data-lazy-src');
            if (dls && dls.includes('/originals/')) urls.add(dls);
        });
        return Array.from(urls);
    });
    lastLinks.forEach(link => allOriginals.add(link));
    console.log(`รวมได้ทั้งหมด ${allOriginals.size} ลิงก์ originals (ไม่ซ้ำ)`);
    await browser.close();
    return Array.from(allOriginals);
}

(async () => {
    const url = 'https://www.pinterest.com/search/pins/?q=anime%20character&rs=content_type_filter'; // เปลี่ยน URL ตามต้องการ
    const images = await scrapePinterestImages(url);
    const originals = images.filter(link => link.includes('/originals/')).slice(0, 200);
    console.log(`Originals only (สูงสุด 200):`, originals);
    fs.writeFileSync('images.json', JSON.stringify(originals, null, 2), 'utf-8');
    console.log(`บันทึกลิงค์รูป originals ${originals.length} รูป ลงไฟล์ images.json แล้ว`);
})();
