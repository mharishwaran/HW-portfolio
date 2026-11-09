const playwright = require('playwright');

(async () => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });

  await page.goto('http://localhost:5173');
  await page.waitForFunction(() => !document.querySelector('.fixed.inset-0.z-50'), { timeout: 10000 });
  await page.waitForTimeout(1000);

  const client = await page.context().newCDPSession(page);
  await client.send('Profiler.enable');
  await client.send('Profiler.start');

  console.log('--- Profiling click on nav-about ---');
  await page.click('#nav-about');
  await page.waitForTimeout(1000);

  const { profile } = await client.send('Profiler.stop');
  console.log('Profiler stopped. Total nodes in profile:', profile.nodes.length);

  // Calculate self-time for each node based on samples and timeDeltas
  const nodeTimes = {};
  for (let i = 0; i < profile.samples.length; i++) {
    const nodeId = profile.samples[i];
    const delta = profile.timeDeltas[i]; // in microseconds
    nodeTimes[nodeId] = (nodeTimes[nodeId] || 0) + delta;
  }

  // Aggregate by function name and url
  const funcTimes = {};
  for (const node of profile.nodes) {
    const time = nodeTimes[node.id] || 0;
    if (time > 0) {
      const name = `${node.callFrame.functionName || '(anonymous)'} (${node.callFrame.url ? node.callFrame.url.split('/').pop() : 'native'}:${node.callFrame.lineNumber})`;
      funcTimes[name] = (funcTimes[name] || 0) + time;
    }
  }

  const sorted = Object.entries(funcTimes).sort((a, b) => b[1] - a[1]);
  console.log('\nTop 25 functions by self time during Transition 1:');
  for (const [name, time] of sorted.slice(0, 25)) {
    console.log(`- ${(time / 1000).toFixed(2)} ms: ${name}`);
  }

  await browser.close();
})();
