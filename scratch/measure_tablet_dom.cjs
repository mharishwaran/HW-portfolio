const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 768, height: 1024 } });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('main', { timeout: 15000 });
  await page.waitForTimeout(800);

  const toggle = page.locator('#mobile-nav-toggle');
  if (await toggle.isVisible()) {
    await toggle.click();
    await page.waitForTimeout(300);
    await page.click('#mobile-nav-experience');
  } else {
    const expBtn = page.locator('nav button, button').filter({ hasText: /^Experience$/i }).first();
    await expBtn.click();
  }
  await page.waitForTimeout(1400);

  const card = page.locator('main .glass-panel').first();
  console.log('Work Experience card on 768px tablet:', await card.boundingBox());

  await browser.close();
})();
