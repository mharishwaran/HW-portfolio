const playwright = require('playwright');
const path = require('path');

(async () => {
  const browser = await playwright.chromium.launch();
  
  // 1. Desktop Test
  console.log('--- Testing Desktop Layout (1280x800) ---');
  const desktopPage = await browser.newPage();
  await desktopPage.setViewportSize({ width: 1280, height: 800 });
  await desktopPage.goto('http://localhost:5173');
  
  // Wait for loading screen to complete
  await desktopPage.waitForFunction(() => !document.querySelector('.fixed.inset-0.z-50'), { timeout: 10000 });
  await desktopPage.waitForTimeout(1000);

  // Navigate to projects
  await desktopPage.click('#nav-projects');
  await desktopPage.waitForTimeout(800);

  // Verify project cards
  const cards = await desktopPage.$$('main div.grid > div.glass-panel');
  console.log(`Found ${cards.length} project cards on desktop.`);

  const expectedData = [
    {
      title: 'Blood Donor Management System',
      demo: 'https://blood-donor-management-system-v2.netlify.app/',
      github: 'https://github.com/mharishwaran/blood-donor-management-system'
    },
    {
      title: 'RESUMIQ – AI Resume Analyzer',
      demo: 'https://resumiq-ai-hw.vercel.app/',
      github: 'https://github.com/mharishwaran/resumiq'
    }
  ];

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const exp = expectedData[i];
    console.log(`\nChecking Card ${i + 1}: ${exp.title}`);

    // Check action icons
    const iconLinks = await card.$$('div.flex.items-center.gap-2 a');
    console.log(`  Found ${iconLinks.length} top-right icons.`);
    if (iconLinks.length !== 2) {
      console.error('  FAIL: Expected exactly 2 icons!');
      continue;
    }

    const demoHref = await iconLinks[0].getAttribute('href');
    const demoTarget = await iconLinks[0].getAttribute('target');
    const demoRel = await iconLinks[0].getAttribute('rel');
    const demoBox = await iconLinks[0].boundingBox();

    const ghHref = await iconLinks[1].getAttribute('href');
    const ghTarget = await iconLinks[1].getAttribute('target');
    const ghRel = await iconLinks[1].getAttribute('rel');
    const ghBox = await iconLinks[1].boundingBox();

    console.log(`  Icon 1 (Left - Live Demo): href="${demoHref}" target="${demoTarget}" rel="${demoRel}"`);
    console.log(`  Icon 2 (Right - GitHub): href="${ghHref}" target="${ghTarget}" rel="${ghRel}"`);

    const demoMatches = demoHref === exp.demo;
    const ghMatches = ghHref === exp.github;
    const isSideBySide = ghBox.x > demoBox.x && Math.abs(ghBox.y - demoBox.y) < 5;

    console.log(`  Live Demo URL match: ${demoMatches ? 'PASS' : 'FAIL'}`);
    console.log(`  GitHub URL match: ${ghMatches ? 'PASS' : 'FAIL'}`);
    console.log(`  Horizontal side-by-side icon alignment: ${isSideBySide ? 'PASS' : 'FAIL'}`);
  }

  // Save desktop screenshot
  await desktopPage.screenshot({ path: path.join(__dirname, 'projects_with_github_desktop.png') });
  console.log('\nSaved projects_with_github_desktop.png');
  await desktopPage.close();

  // 2. Mobile Test (375x667)
  console.log('\n--- Testing Mobile Layout (375x667) ---');
  const mobilePage = await browser.newPage();
  await mobilePage.setViewportSize({ width: 375, height: 667 });
  await mobilePage.goto('http://localhost:5173');
  await mobilePage.waitForFunction(() => !document.querySelector('.fixed.inset-0.z-50'), { timeout: 10000 });
  await mobilePage.waitForTimeout(1000);

  // Open mobile menu and navigate
  await mobilePage.click('#mobile-nav-toggle');
  await mobilePage.waitForTimeout(500);
  await mobilePage.click('#mobile-nav-projects');
  await mobilePage.waitForTimeout(800);

  const mobileCards = await mobilePage.$$('main div.grid > div.glass-panel');
  console.log(`Found ${mobileCards.length} project cards on mobile.`);

  for (let i = 0; i < mobileCards.length; i++) {
    const card = mobileCards[i];
    const iconLinks = await card.$$('div.flex.items-center.gap-2 a');
    console.log(`  Card ${i + 1} has ${iconLinks.length} icons at top-right.`);
    const demoBox = await iconLinks[0].boundingBox();
    const ghBox = await iconLinks[1].boundingBox();
    const isSideBySide = ghBox.x > demoBox.x && Math.abs(ghBox.y - demoBox.y) < 5;
    console.log(`  Mobile Card ${i + 1} icons horizontal side-by-side: ${isSideBySide ? 'PASS' : 'FAIL'}`);
  }

  await mobilePage.screenshot({ path: path.join(__dirname, 'projects_with_github_mobile.png') });
  console.log('Saved projects_with_github_mobile.png');
  await mobilePage.close();

  await browser.close();
  console.log('\nAll project icon verification tests completed successfully!');
})();
