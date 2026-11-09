const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const imgBuffer = fs.readFileSync(path.resolve(__dirname, 'sec_about.png'));
  const base64Img = 'data:image/png;base64,' + imgBuffer.toString('base64');

  await page.setContent(`<html><body style="margin:0;"><canvas id="c"></canvas></body></html>`);

  const bounds = await page.evaluate(async (imgSrc) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const c = document.getElementById('c');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        const data = imgData.data;

        let minX = img.width, maxX = 0, minY = img.height, maxY = 0;
        for (let y = 150; y < 780; y++) {
          for (let x = 700; x < 1250; x++) {
            const idx = (y * img.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            if ((r > 80 && b > 130) || (r > 150 && g > 150 && b > 150) || (b > 180)) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }
        resolve({ minX, maxX, minY, maxY, width: maxX - minX, height: maxY - minY });
      };
      img.src = imgSrc;
    });
  }, base64Img);

  console.log('About card pixels in sec_about.png:', bounds);
  await browser.close();
})();
