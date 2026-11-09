const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d1124"/>
      <stop offset="50%" stop-color="#060914"/>
      <stop offset="100%" stop-color="#020409"/>
    </linearGradient>
    <linearGradient id="hwGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="45%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(192, 132, 252, 0.65)"/>
      <stop offset="50%" stop-color="rgba(129, 140, 248, 0.35)"/>
      <stop offset="100%" stop-color="rgba(56, 189, 248, 0.55)"/>
    </linearGradient>
  </defs>

  <!-- Dark Base Plate with Rounded Corners -->
  <rect width="64" height="64" rx="14" fill="url(#bgGrad)"/>
  
  <!-- Subtle Glowing Border Accent -->
  <rect x="1" y="1" width="62" height="62" rx="13" fill="none" stroke="url(#borderGrad)" stroke-width="1.75"/>
  
  <!-- Ambient Glow Behind Letters -->
  <circle cx="20" cy="22" r="14" fill="#a855f7" opacity="0.16"/>
  <circle cx="45" cy="42" r="14" fill="#38bdf8" opacity="0.14"/>

  <!-- "H" Monogram Glyph -->
  <path d="M 12 17.5 
           L 17.5 17.5 
           L 17.5 29.5 
           L 23 29.5 
           L 23 17.5 
           L 28.5 17.5 
           L 28.5 46.5 
           L 23 46.5 
           L 23 34.5 
           L 17.5 34.5 
           L 17.5 46.5 
           L 12 46.5 Z" 
        fill="url(#hwGrad)"/>

  <!-- "W" Monogram Glyph -->
  <path d="M 32.5 17.5 
           L 37.5 17.5 
           L 40.5 37 
           L 43.5 24 
           L 47 24 
           L 50 37 
           L 53 17.5 
           L 58 17.5 
           L 53 46.5 
           L 48 46.5 
           L 45.25 33.5 
           L 42.5 46.5 
           L 37.5 46.5 Z" 
        fill="url(#hwGrad)"/>
</svg>`;

(async () => {
  // 1. Write public/favicon.svg
  const publicDir = path.resolve(__dirname, '../public');
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent.trim(), 'utf8');
  console.log('Saved public/favicon.svg');

  // 2. Generate PNG versions using Playwright
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 }
  ];

  for (const s of sizes) {
    await page.setViewportSize({ width: s.size, height: s.size });
    await page.setContent(`
      <html style="margin:0;padding:0;overflow:hidden;background:transparent;">
        <body style="margin:0;padding:0;overflow:hidden;background:transparent;">
          <div style="width:${s.size}px;height:${s.size}px;display:flex;">
            ${svgContent.replace('width="64" height="64"', `width="${s.size}" height="${s.size}"`)}
          </div>
        </body>
      </html>
    `);
    const pngPath = path.join(publicDir, s.name);
    await page.screenshot({ path: pngPath, omitBackground: true });
    console.log(`Saved ${s.name} (${s.size}x${s.size})`);
  }

  // 3. Render browser tab preview
  await page.setViewportSize({ width: 600, height: 200 });
  await page.setContent(`
    <html>
      <body style="background: #0f121d; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 30px; display: flex; flex-direction: column; gap: 20px;">
        <div style="font-size: 13px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">
          Browser Tab Branding Preview
        </div>

        <!-- Chrome Browser Window Header Mockup -->
        <div style="background: #1e2230; border-radius: 10px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5);">
          <!-- Top Tab Bar -->
          <div style="background: #141724; padding: 8px 12px 0 12px; display: flex; align-items: center; gap: 8px;">
            <!-- Active Tab -->
            <div style="background: #1e2230; border-radius: 8px 8px 0 0; padding: 8px 16px; display: flex; align-items: center; gap: 10px; border-top: 2px solid #818cf8; width: 220px;">
              <img src="data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}" width="16" height="16" />
              <span style="font-size: 13px; font-weight: 500; color: #f1f5f9; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                HW Portfolio
              </span>
              <span style="margin-left: auto; color: #64748b; font-size: 14px; line-height: 1;">×</span>
            </div>
            <!-- Inactive Tab -->
            <div style="padding: 6px 12px; display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 12px;">
              <span>+ New Tab</span>
            </div>
          </div>
          <!-- Address Bar Area -->
          <div style="padding: 8px 14px; display: flex; align-items: center; gap: 10px; background: #1e2230; border-top: 1px solid #2d3748;">
            <div style="background: #0f121d; border-radius: 6px; padding: 4px 12px; font-size: 12px; color: #94a3b8; flex: 1; border: 1px solid #334155;">
              <span style="color: #4ade80;">🔒</span> https://harishwaran.dev
            </div>
          </div>
        </div>
      </body>
    </html>
  `);

  const previewPath = path.resolve(__dirname, 'browser_tab_preview.png');
  await page.screenshot({ path: previewPath });
  console.log('Saved browser_tab_preview.png');

  await browser.close();
})();
