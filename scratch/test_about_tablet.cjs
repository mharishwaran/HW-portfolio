const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('main', { timeout: 15000 });
  await page.waitForTimeout(800);

  // Click About
  const aboutBtn = page.locator('nav button, button').filter({ hasText: /^About$/i }).first();
  await aboutBtn.click();
  await page.waitForTimeout(1400);

  const outPath = path.join(__dirname, 'about_tablet_768.png');
  await page.screenshot({ path: outPath });
  console.log('Saved about_tablet_768.png');

  await browser.close();
})();
