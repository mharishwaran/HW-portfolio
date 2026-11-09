const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173/');
  await page.waitForSelector('main', { timeout: 15000 });
  await page.waitForTimeout(1000);

  // Navigate to Certifications
  const certBtn = page.locator('nav button, button').filter({ hasText: /^Certifications$/i }).first();
  await certBtn.click();
  await page.waitForTimeout(1200);

  // Click COURSES tab
  console.log('Clicking COURSES tab...');
  const coursesTab = page.locator('button').filter({ hasText: /^COURSES$/i }).first();
  await coursesTab.click();
  await page.waitForTimeout(800);

  // Capture cards
  const cards = page.locator('#cert-carousel > div > div');
  const count = await cards.count();
  console.log(`Found ${count} certificate cards under COURSES`);

  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    const title = await card.locator('h3').innerText();
    const issuer = await card.locator('p').first().innerText();
    const date = await card.locator('span.font-mono').innerText();
    const desc = await card.locator('p.line-clamp-3').innerText();
    console.log(`\nCard ${i + 1}:`);
    console.log(`  Title: ${title}`);
    console.log(`  Issuer: ${issuer}`);
    console.log(`  Date: ${date}`);
    console.log(`  Desc: ${desc}`);
  }

  // Screenshot of Courses tab
  const certsScreenPath = path.join(__dirname, 'courses_tab_updated.png');
  await page.screenshot({ path: certsScreenPath });
  console.log('Saved screenshot:', certsScreenPath);

  // Click View Certificate on 2nd card
  console.log('Clicking "View Certificate" on Card 2...');
  const card2 = cards.nth(1);
  const viewCertBtn = card2.locator('text=View Certificate');
  await viewCertBtn.click();
  await page.waitForTimeout(800);

  // Check modal
  const modal = page.locator('div.fixed.inset-0.z-50');
  const isModalVisible = await modal.isVisible();
  console.log('Modal visible:', isModalVisible);

  const modalImg = modal.locator('img');
  const imgSrc = await modalImg.getAttribute('src');
  console.log('Modal image src:', imgSrc);

  const modalScreenPath = path.join(__dirname, 'cert_modal_updated.png');
  await page.screenshot({ path: modalScreenPath });
  console.log('Saved modal screenshot:', modalScreenPath);

  await browser.close();
  console.log('Verification finished successfully.');
})();
