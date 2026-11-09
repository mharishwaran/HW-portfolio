const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: 'mobile_375', width: 375, height: 667 },
    { name: 'tablet_768', width: 768, height: 1024 },
    { name: 'laptop_1024', width: 1024, height: 768 },
    { name: 'desktop_1280', width: 1280, height: 800 }
  ];

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/');
    await page.waitForSelector('main', { timeout: 15000 });
    await page.waitForTimeout(800);

    // If mobile/tablet toggle is present, use mobile menu
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

    const outPath = path.join(__dirname, `exp_updated_${vp.name}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Saved screenshot for ${vp.name}`);
    await context.close();
  }

  await browser.close();
  console.log('All responsive screenshots saved.');
})();
