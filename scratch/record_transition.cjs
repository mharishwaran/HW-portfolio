const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('main', { timeout: 15000 });
  await page.waitForTimeout(1000);

  // Navigate to Projects first
  const projBtn = page.locator('nav button, button').filter({ hasText: /^Projects$/i }).first();
  await projBtn.click();
  await page.waitForTimeout(1200);

  console.log('Now clicking Experience to observe transition...');
  const expBtn = page.locator('nav button, button').filter({ hasText: /^Experience$/i }).first();
  await expBtn.click();

  // Capture frames every 80ms for 1.2 seconds
  for (let i = 0; i < 15; i++) {
    await page.waitForTimeout(80);
    const outPath = path.join(__dirname, `trans_${String(i).padStart(2, '0')}.png`);
    await page.screenshot({ path: outPath });
  }

  console.log('Captured transition frames.');
  await browser.close();
})();
