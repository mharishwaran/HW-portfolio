const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('main', { timeout: 15000 });
  await page.waitForTimeout(1000);

  const expButton = page.locator('nav button, button').filter({ hasText: /^Experience$/i }).first();
  await expButton.click();
  await page.waitForTimeout(1500);

  // We can evaluate projectToScreen in Three.js by attaching a helper or querying card world position:
  const cardData = await page.evaluate(() => {
    // Let's find the canvas and take image data using a 2D canvas drawing the canvas
    const webglCanvas = document.querySelector('canvas');
    const c2d = document.createElement('canvas');
    c2d.width = webglCanvas.width;
    c2d.height = webglCanvas.height;
    const ctx = c2d.getContext('2d');
    ctx.drawImage(webglCanvas, 0, 0);
    const imgData = ctx.getImageData(0, 0, c2d.width, c2d.height);
    const data = imgData.data;

    let minX = c2d.width, maxX = 0, minY = c2d.height, maxY = 0;
    // Scan for card pixels in right half (x > 688)
    // Card border is glowing indigo/purple rgba(99, 102, 241) or rgba(168, 85, 247)
    // Or card background is #0a0f24 / #020617 (r > 5, g > 5, b > 20)
    for (let y = 100; y < c2d.height - 50; y++) {
      for (let x = 688; x < c2d.width - 50; x++) {
        const idx = (y * c2d.width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        // The ID card has distinctive colors: purple/indigo border, white text, photo
        if (a > 100 && (b > 35 || r > 35 || g > 35)) {
          // ignore isolated star particles (radius < 3px)
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    return { minX, maxX, minY, maxY, canvasW: c2d.width, canvasH: c2d.height };
  });

  console.log('Detected Card Bounds in Canvas:', cardData);
  await browser.close();
})();
