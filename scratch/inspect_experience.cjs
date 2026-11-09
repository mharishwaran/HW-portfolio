const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173/');

  // Wait for loading screen to disappear
  await page.waitForSelector('main', { timeout: 15000 });
  console.log('Main mounted.');

  // Wait 1s for initial render
  await page.waitForTimeout(1000);

  // Click on Experience in navbar or navigation dots
  // Nav buttons in navbar or dot 4 (0: home, 1: about, 2: skills, 3: projects, 4: experience)
  const expButton = page.locator('nav button, button').filter({ hasText: /^Experience$/i }).first();
  if (await expButton.isVisible()) {
    console.log('Clicking navbar Experience button...');
    await expButton.click();
  } else {
    console.log('Navigating via dot index 4...');
    const dots = page.locator('div.fixed.right-6 button');
    await dots.nth(4).click();
  }

  // Wait 1.5s for transition to settle
  await page.waitForTimeout(1500);

  // Get experience card bounding box
  const expCard = page.locator('main h2:has-text("Work Experience")').locator('..').locator('.glass-panel').first();
  const box = await expCard.boundingBox();
  console.log('Work Experience card bounding box:', box);

  const heading = page.locator('main h2:has-text("Work Experience")');
  const headingBox = await heading.boundingBox();
  console.log('Work Experience heading bounding box:', headingBox);

  // Take screenshot
  const outPath = path.join(__dirname, 'current_experience.png');
  await page.screenshot({ path: outPath });
  console.log('Screenshot saved to', outPath);

  await browser.close();
})();
