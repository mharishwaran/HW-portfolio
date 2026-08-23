import { chromium } from 'playwright';

(async () => {
  console.log("Launching headless browser...");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Set viewport to standard desktop
  await page.setViewportSize({ width: 1280, height: 800 });

  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.error(`[BROWSER EXCEPTION]:`, err);
  });

  console.log("Navigating to http://localhost:5173/ ...");
  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 15000 });
    console.log("Page loaded. Waiting 5 seconds...");
    await page.waitForTimeout(5000);
    
    console.log("Taking screenshot...");
    await page.screenshot({ path: 'C:/Users/haris/.gemini/antigravity/brain/2b85c97c-25a5-47f9-8683-66a212618ca9/screenshot.png' });
    console.log("Screenshot saved to artifacts/screenshot.png");
  } catch (e) {
    console.error("Navigation/screenshot failed:", e.message);
  }

  await browser.close();
  console.log("Browser closed.");
})();
