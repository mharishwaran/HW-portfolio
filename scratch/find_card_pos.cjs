const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173');
  await page.waitForFunction(() => !document.querySelector('.fixed.inset-0.z-50'), { timeout: 10000 });
  await page.waitForTimeout(600);
  await page.click('#nav-experience');
  await page.waitForTimeout(1000);

  // Take screenshot with bounding boxes drawn
  const expRect = await page.$eval('main .glass-panel', el => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });

  console.log('Experience Card Rect:', expRect);

  await browser.close();
})();
