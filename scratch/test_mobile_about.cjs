const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 375, height: 667 } });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('main', { timeout: 15000 });
  await page.waitForTimeout(1000);

  // Click mobile nav toggle
  await page.click('#mobile-nav-toggle');
  await page.waitForTimeout(400);

  // Click About
  await page.click('#mobile-nav-about');
  await page.waitForTimeout(1200);

  const outPath = path.join(__dirname, 'about_mobile_actual.png');
  await page.screenshot({ path: outPath });
  console.log('Saved about_mobile_actual.png');

  await browser.close();
})();
