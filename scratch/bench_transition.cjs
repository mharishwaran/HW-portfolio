const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch({
    args: ['--enable-webgl', '--ignore-gpu-blocklist', '--enable-gpu-rasterization']
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.goto('http://localhost:5173');
  await page.waitForFunction(() => !document.querySelector('.fixed.inset-0.z-50'), { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Measure Transition 1: Home -> About
  const res1 = await page.evaluate(async () => {
    let frameTimes = [];
    let last = performance.now();
    let tracking = true;
    function onFrame() {
      const now = performance.now();
      frameTimes.push(now - last);
      last = now;
      if (tracking) requestAnimationFrame(onFrame);
    }
    requestAnimationFrame(onFrame);

    const start = performance.now();
    document.querySelector('#nav-about').click();

    await new Promise(r => setTimeout(r, 1000));
    tracking = false;

    return {
      frames: frameTimes,
      max: Math.max(...frameTimes),
      avg: frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length,
      longFrames: frameTimes.filter(f => f > 33.3)
    };
  });

  console.log('--- Transition 1 (First Navigation) ---');
  console.log(`Frames count: ${res1.frames.length}, Avg: ${res1.avg.toFixed(1)}ms, Max: ${res1.max.toFixed(1)}ms`);
  console.log(`Stutter/Drop frames (>33.3ms): ${res1.longFrames.length}`);
  if (res1.longFrames.length) {
    console.log(`Stutter durations: ${res1.longFrames.map(f => f.toFixed(1) + 'ms').join(', ')}`);
  }

  // Measure Transition 2: About -> Home
  const res2 = await page.evaluate(async () => {
    let frameTimes = [];
    let last = performance.now();
    let tracking = true;
    function onFrame() {
      const now = performance.now();
      frameTimes.push(now - last);
      last = now;
      if (tracking) requestAnimationFrame(onFrame);
    }
    requestAnimationFrame(onFrame);

    document.querySelector('#nav-home').click();

    await new Promise(r => setTimeout(r, 1000));
    tracking = false;

    return {
      frames: frameTimes,
      max: Math.max(...frameTimes),
      avg: frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length,
      longFrames: frameTimes.filter(f => f > 33.3)
    };
  });

  console.log('\n--- Transition 2 (Subsequent Navigation) ---');
  console.log(`Frames count: ${res2.frames.length}, Avg: ${res2.avg.toFixed(1)}ms, Max: ${res2.max.toFixed(1)}ms`);
  console.log(`Stutter/Drop frames (>33.3ms): ${res2.longFrames.length}`);
  if (res2.longFrames.length) {
    console.log(`Stutter durations: ${res2.longFrames.map(f => f.toFixed(1) + 'ms').join(', ')}`);
  }

  await browser.close();
})();
