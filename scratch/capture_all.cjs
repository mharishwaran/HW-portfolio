const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/');
  await page.waitForSelector('main', { timeout: 15000 });
  await page.waitForTimeout(1000);

  const sections = ['home', 'about', 'skills', 'projects', 'experience', 'certifications', 'contact'];

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    console.log(`Navigating to ${sec}...`);
    const dots = page.locator('div.fixed.right-6 button');
    await dots.nth(i).click();
    await page.waitForTimeout(1200);
    const outPath = path.join(__dirname, `sec_${sec}.png`);
    await page.screenshot({ path: outPath });
  }

  await browser.close();
  console.log('Done capturing all sections.');
})();
