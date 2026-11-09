const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('main', { timeout: 15000 });
  await page.waitForTimeout(1000);

  const aboutBtn = page.locator('nav button, button').filter({ hasText: /^About$/i }).first();
  await aboutBtn.click();
  await page.waitForTimeout(1500);

  const heading = page.locator('main h2:has-text("About Me")');
  console.log('About Me heading box:', await heading.boundingBox());

  const card = page.locator('main .glass-panel').first();
  console.log('About Me card box:', await card.boundingBox());

  await browser.close();
})();
