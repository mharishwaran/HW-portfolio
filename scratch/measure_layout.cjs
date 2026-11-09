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

  // We can compute 3D card 2D bounding box from Three.js scene via window if available or pixel scan:
  const cardPixelBounds = await page.evaluate(() => {
    // Canvas is the webgl canvas
    const canvas = document.querySelector('canvas');
    if (!canvas) return null;
    
    // We can find the card by scanning non-black/non-background pixels in the right region (x > 688)
    // Or we can query the WebGL context if preserved, but canvas.getContext('webgl2') might return null if already active.
    // Instead, let's inspect the DOM elements bounding rects:
    const cardEl = document.querySelector('.glass-panel');
    const box = cardEl ? cardEl.getBoundingClientRect() : null;
    return {
      cardEl: box ? { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom } : null,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    };
  });

  console.log('DOM Card:', cardPixelBounds);
  await browser.close();
})();
