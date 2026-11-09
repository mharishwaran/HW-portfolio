const playwright = require('playwright');
const path = require('path');

(async () => {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.goto('http://localhost:5173');
  await page.waitForFunction(() => !document.querySelector('.fixed.inset-0.z-50'), { timeout: 10000 });
  await page.waitForTimeout(1000);

  // Start Chrome DevTools Trace
  console.log('--- Starting Trace on Home ---');
  await context.tracing.start({ screenshots: true, snapshots: true });

  // Measure click to first paint of About
  const result = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const start = performance.now();
      let longTasks = [];
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          longTasks.push({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
          });
        }
      });
      observer.observe({ entryTypes: ['longtask'] });

      // Click nav-about
      document.querySelector('#nav-about').click();

      // Track frame times for 1 second
      let frames = [];
      let last = performance.now();
      function onFrame() {
        const now = performance.now();
        frames.push(now - last);
        last = now;
        if (now - start < 1000) {
          requestAnimationFrame(onFrame);
        } else {
          observer.disconnect();
          resolve({
            totalTime: now - start,
            longTasks,
            frames
          });
        }
      }
      requestAnimationFrame(onFrame);
    });
  });

  await context.tracing.stop({ path: path.join(__dirname, 'trace_transition1.json') });
  console.log('Trace saved to trace_transition1.json');

  console.log('Long tasks detected during Transition 1:', result.longTasks);
  const badFrames = result.frames.filter(f => f > 30);
  console.log('Frames > 30ms during Transition 1:', badFrames.map(f => f.toFixed(1) + 'ms'));
  console.log('Max frame time:', Math.max(...result.frames).toFixed(1) + 'ms');

  await browser.close();
})();
