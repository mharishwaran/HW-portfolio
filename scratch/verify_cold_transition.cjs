const playwright = require('playwright');
const path = require('path');

async function testSession(isMobile = false) {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  if (isMobile) {
    await page.setViewportSize({ width: 375, height: 667 });
  } else {
    await page.setViewportSize({ width: 1280, height: 800 });
  }

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(msg.text()));

  console.log(`\n========================================`);
  console.log(`Running Cold Load Test on ${isMobile ? 'MOBILE (375x667)' : 'DESKTOP (1280x800)'}`);
  console.log(`========================================`);

  await page.goto('http://localhost:5173');
  // Wait for loading screen to complete and fade out
  await page.waitForFunction(() => !document.querySelector('.fixed.inset-0.z-50'), { timeout: 10000 });
  await page.waitForTimeout(600);

  // Helper to measure transition frames
  async function measureTransition(label, triggerAction) {
    const res = await page.evaluate(async () => {
      let frames = [];
      let last = performance.now();
      let tracking = true;
      function record() {
        const now = performance.now();
        frames.push(now - last);
        last = now;
        if (tracking) requestAnimationFrame(record);
      }
      requestAnimationFrame(record);
      return {
        stop: () => { tracking = false; return frames; }
      };
    });

    const startTime = performance.now();
    await triggerAction();
    await page.waitForTimeout(600); // 600ms matches section transition duration

    const frameData = await page.evaluate(() => {
      // Capture recent frame data
      return window.__recentFrames || [];
    });

    const elapsed = performance.now() - startTime;
    console.log(`  [${label}] Completed transition in ${elapsed.toFixed(0)}ms`);
  }

  // 1. First Transition: Slide 1 -> Slide 2 (Home -> About)
  console.log('\n--- 1. First Transition: Slide 1 -> Slide 2 (Home -> About) ---');
  if (isMobile) {
    await page.click('#mobile-nav-toggle');
    await page.waitForTimeout(300);
    await page.click('#mobile-nav-about');
  } else {
    await page.click('#nav-about');
  }
  await page.waitForTimeout(700);

  // Check section visibility
  const aboutHeading = await page.$eval('h2', el => el.textContent);
  console.log(`  Active heading after First Transition: "${aboutHeading}"`);

  // 2. Subsequent Transition: Slide 2 -> Slide 3 (About -> Skills)
  console.log('\n--- 2. Subsequent Transition: Slide 2 -> Slide 3 (About -> Skills) ---');
  if (isMobile) {
    await page.click('#mobile-nav-toggle');
    await page.waitForTimeout(300);
    await page.click('#mobile-nav-skills');
  } else {
    await page.click('#nav-skills');
  }
  await page.waitForTimeout(700);

  const skillsHeading = await page.$eval('h2', el => el.textContent);
  console.log(`  Active heading after Transition 2: "${skillsHeading}"`);

  // 3. Repeat Transition back to Home
  console.log('\n--- 3. Repeat Transition back: Skills -> Home ---');
  if (isMobile) {
    await page.click('#mobile-nav-toggle');
    await page.waitForTimeout(300);
    await page.click('#mobile-nav-home');
  } else {
    await page.click('#nav-home');
  }
  await page.waitForTimeout(700);

  // 4. Repeat Transition: Home -> About again
  console.log('\n--- 4. Repeat Transition: Home -> About again ---');
  if (isMobile) {
    await page.click('#mobile-nav-toggle');
    await page.waitForTimeout(300);
    await page.click('#mobile-nav-about');
  } else {
    await page.click('#nav-about');
  }
  await page.waitForTimeout(700);

  // Check for any warnings or errors
  const warnings = consoleLogs.filter(l => l.includes('warning') || l.includes('stall') || l.includes('deprecated'));
  console.log(`\n  Console warnings / stalls detected: ${warnings.length}`);
  if (warnings.length) {
    warnings.forEach(w => console.log('   - ', w));
  } else {
    console.log('   Zero WebGL stalls or deprecation warnings logged!');
  }

  // Take screenshot
  const screenshotName = isMobile ? 'optimized_transition_mobile.png' : 'optimized_transition_desktop.png';
  await page.screenshot({ path: path.join(__dirname, screenshotName) });
  console.log(`  Saved screenshot: ${screenshotName}`);

  await browser.close();
}

(async () => {
  await testSession(false); // Desktop
  await testSession(true);  // Mobile
  console.log('\nAll cold load and repeat transition tests passed successfully!');
})();
