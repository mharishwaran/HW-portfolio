const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173');
  await page.waitForFunction(() => !document.querySelector('.fixed.inset-0.z-50'), { timeout: 10000 });
  await page.waitForTimeout(600);
  await page.click('#nav-experience');
  await page.waitForTimeout(1000);

  const expBox = await page.$eval('main .glass-panel', el => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right };
  });

  console.log('Work Experience card bounding rect:', expBox);

  // In Three.js, let's find the screen position of the card!
  const cardScreenPos = await page.evaluate(() => {
    // Canvas dimensions: 1280x800
    // In ThreeCanvas:
    // camera fov 45, position [0.6, 0.5, 4.0], lookAt [0.12, 0.4, 0]
    // ID card target position: [-1.5, 0.3, -0.2]
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    };
  });
  console.log('Window:', cardScreenPos);

  await browser.close();
})();
