const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:5173');

  // Wait for loading screen to complete
  await page.waitForFunction(() => !document.querySelector('.fixed.inset-0.z-50'), { timeout: 10000 });
  await page.waitForTimeout(1000); // Wait for idle state

  console.log('--- Ready on Home Section ---');

  // Inject FPS / frame duration tracker
  await page.evaluate(() => {
    window.__frameDurations = [];
    let lastTime = performance.now();
    function track() {
      const now = performance.now();
      window.__frameDurations.push(now - lastTime);
      lastTime = now;
      requestAnimationFrame(track);
    }
    requestAnimationFrame(track);
  });

  // Collect baseline for 500ms
  await page.waitForTimeout(500);

  // Transition 1: Home -> About
  console.log('--- Triggering First Transition: Home -> About ---');
  const t1Start = await page.evaluate(() => {
    window.__frameDurations.length = 0; // reset
    return performance.now();
  });

  await page.click('#nav-about');
  await page.waitForTimeout(1000);

  const t1Frames = await page.evaluate(() => window.__frameDurations.slice());
  const t1Max = Math.max(...t1Frames);
  const t1Avg = t1Frames.reduce((a, b) => a + b, 0) / t1Frames.length;
  const t1LongFrames = t1Frames.filter(d => d > 33.3); // > 30 FPS drops
  console.log(`Transition 1 (Home -> About):
    Total frames: ${t1Frames.length}
    Avg frame time: ${t1Avg.toFixed(2)} ms
    Max frame time: ${t1Max.toFixed(2)} ms
    Long frames (>33.3ms): ${t1LongFrames.length}
    Durations of long frames: ${t1LongFrames.map(d => d.toFixed(1) + 'ms').join(', ')}
  `);

  // Transition 2: About -> Home
  console.log('--- Triggering Second Transition: About -> Home ---');
  await page.evaluate(() => { window.__frameDurations.length = 0; });
  await page.click('#nav-home');
  await page.waitForTimeout(1000);

  const t2Frames = await page.evaluate(() => window.__frameDurations.slice());
  const t2Max = Math.max(...t2Frames);
  const t2Avg = t2Frames.reduce((a, b) => a + b, 0) / t2Frames.length;
  const t2LongFrames = t2Frames.filter(d => d > 33.3);
  console.log(`Transition 2 (About -> Home):
    Total frames: ${t2Frames.length}
    Avg frame time: ${t2Avg.toFixed(2)} ms
    Max frame time: ${t2Max.toFixed(2)} ms
    Long frames (>33.3ms): ${t2LongFrames.length}
    Durations of long frames: ${t2LongFrames.map(d => d.toFixed(1) + 'ms').join(', ')}
  `);

  // Transition 3: Home -> About (Repeat)
  console.log('--- Triggering Third Transition: Home -> About (Repeat) ---');
  await page.evaluate(() => { window.__frameDurations.length = 0; });
  await page.click('#nav-about');
  await page.waitForTimeout(1000);

  const t3Frames = await page.evaluate(() => window.__frameDurations.slice());
  const t3Max = Math.max(...t3Frames);
  const t3Avg = t3Frames.reduce((a, b) => a + b, 0) / t3Frames.length;
  const t3LongFrames = t3Frames.filter(d => d > 33.3);
  console.log(`Transition 3 (Home -> About Repeat):
    Total frames: ${t3Frames.length}
    Avg frame time: ${t3Avg.toFixed(2)} ms
    Max frame time: ${t3Max.toFixed(2)} ms
    Long frames (>33.3ms): ${t3LongFrames.length}
    Durations of long frames: ${t3LongFrames.map(d => d.toFixed(1) + 'ms').join(', ')}
  `);

  await browser.close();
})();
