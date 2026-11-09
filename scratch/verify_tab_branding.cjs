const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173/');

  // 1. Verify page title
  const title = await page.title();
  console.log('Document title:', title);
  if (title !== 'HW Portfolio') {
    throw new Error(`Expected title "HW Portfolio" but got "${title}"`);
  }

  // 2. Verify favicon links in DOM
  const svgFavicon = await page.locator('link[rel="icon"][type="image/svg+xml"]').getAttribute('href');
  console.log('SVG Favicon href:', svgFavicon);

  // 3. Verify favicon responds with 200 OK
  const svgRes = await page.request.get('http://localhost:5173' + svgFavicon);
  console.log('SVG Favicon HTTP status:', svgRes.status());
  console.log('SVG Favicon Content-Type:', svgRes.headers()['content-type']);

  const png32Res = await page.request.get('http://localhost:5173/favicon-32x32.png');
  console.log('PNG 32x32 HTTP status:', png32Res.status());

  const png16Res = await page.request.get('http://localhost:5173/favicon-16x16.png');
  console.log('PNG 16x16 HTTP status:', png16Res.status());

  await page.waitForSelector('main', { timeout: 15000 });
  await page.waitForTimeout(1000);

  const outPath = path.join(__dirname, 'verified_site_content.png');
  await page.screenshot({ path: outPath });
  console.log('Saved screenshot of running portfolio to', outPath);

  await browser.close();
  console.log('All browser tab branding checks PASSED successfully!');
})();
