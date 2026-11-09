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
    await page.waitForTimeout(1000);

    // Navigate to experience
    // On mobile, navbar might have hamburger or dots might be hidden
    // Let's check how navigation works on mobile:
    const expBtn = page.locator('button:has-text("EXPERIENCE"), button:has-text("Experience")').first();
    if (await expBtn.isVisible()) {
      await expBtn.click();
    } else {
      // Trigger navigation by calling window scroll/keyboard or finding mobile nav
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');
    }

    await page.waitForTimeout(1200);

    const outPath = path.join(__dirname, `exp_${vp.name}.png`);
    await page.screenshot({ path: outPath });
    console.log(`Saved screenshot for ${vp.name}`);
    await context.close();
  }

  await browser.close();
})();
