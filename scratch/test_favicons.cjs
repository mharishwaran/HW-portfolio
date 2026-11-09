const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Test Design Options for HW favicon
  const designs = [
    {
      id: 'opt1_bold_geom',
      desc: 'Bold Geometric HW Monogram with Purple-to-Blue Linear Gradient',
      svg: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19"/>
      <stop offset="50%" stop-color="#05070e"/>
      <stop offset="100%" stop-color="#020408"/>
    </linearGradient>
    <linearGradient id="hwGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="50%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(192, 132, 252, 0.6)"/>
      <stop offset="100%" stop-color="rgba(56, 189, 248, 0.4)"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <!-- Background Plate -->
  <rect width="64" height="64" rx="15" fill="url(#bgGrad)"/>
  <rect x="1" y="1" width="62" height="62" rx="14" fill="none" stroke="url(#strokeGrad)" stroke-width="1.5"/>
  <!-- Ambient subtle inner glow -->
  <circle cx="20" cy="18" r="16" fill="rgba(168, 85, 247, 0.15)" filter="blur(8px)"/>
  <circle cx="46" cy="46" r="16" fill="rgba(56, 189, 248, 0.12)" filter="blur(8px)"/>
  
  <!-- "H" Vector Path -->
  <!-- Left bar: x=12, width=5.5, y=17 to 47 -->
  <!-- Crossbar: x=12 to 27, y=29.5 to 34.5 -->
  <!-- Right bar: x=21.5, width=5.5, y=17 to 47 -->
  <path d="M 12 17.5 
           L 17.5 17.5 
           L 17.5 29.5 
           L 22.5 29.5 
           L 22.5 17.5 
           L 28 17.5 
           L 28 46.5 
           L 22.5 46.5 
           L 22.5 34.5 
           L 17.5 34.5 
           L 17.5 46.5 
           L 12 46.5 Z" 
        fill="url(#hwGrad)"/>

  <!-- "W" Vector Path -->
  <!-- W starts at x=31, ends at x=52 -->
  <path d="M 31.5 17.5 
           L 36.5 17.5 
           L 39.5 37 
           L 42.5 24 
           L 46 24 
           L 49 37 
           L 52 17.5 
           L 57 17.5 
           L 52 46.5 
           L 47 46.5 
           L 44.25 33.5 
           L 41.5 46.5 
           L 36.5 46.5 Z" 
        fill="url(#hwGrad)"/>
</svg>
      `
    },
    {
      id: 'opt2_font_typography',
      desc: 'Bold Typographic HW with High-Contrast Gradient & Crisp Letterforms',
      svg: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0c0f1d"/>
      <stop offset="60%" stop-color="#05070f"/>
      <stop offset="100%" stop-color="#020307"/>
    </linearGradient>
    <linearGradient id="hwGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d8b4fe"/>
      <stop offset="45%" stop-color="#a78bfa"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <linearGradient id="strokeGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(168, 85, 247, 0.5)"/>
      <stop offset="50%" stop-color="rgba(99, 102, 241, 0.3)"/>
      <stop offset="100%" stop-color="rgba(56, 189, 248, 0.5)"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#bgGrad2)"/>
  <rect x="1" y="1" width="62" height="62" rx="13" fill="none" stroke="url(#strokeGrad2)" stroke-width="1.8"/>
  <text x="32" y="44" 
        font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Outfit', 'Inter', sans-serif" 
        font-size="29" 
        font-weight="900" 
        letter-spacing="-1.5" 
        text-anchor="middle" 
        fill="url(#hwGrad2)">HW</text>
</svg>
      `
    },
    {
      id: 'opt3_interlocking_connected',
      desc: 'Modern Interlocked Monogram where H and W seamlessly bridge',
      svg: `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="bgGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080b16"/>
      <stop offset="100%" stop-color="#020409"/>
    </linearGradient>
    <linearGradient id="hwGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="40%" stop-color="#818cf8"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <linearGradient id="borderGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(192, 132, 252, 0.7)"/>
      <stop offset="100%" stop-color="rgba(56, 189, 248, 0.5)"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="url(#bgGrad3)"/>
  <rect x="1" y="1" width="62" height="62" rx="15" fill="none" stroke="url(#borderGrad3)" stroke-width="1.5"/>
  <g transform="translate(1, 0)">
    <!-- H left stem -->
    <rect x="11" y="18" width="5.5" height="28" rx="2.5" fill="url(#hwGrad3)"/>
    <!-- H crossbar connected to W -->
    <rect x="13.5" y="29.5" width="13" height="5" rx="2" fill="url(#hwGrad3)"/>
    <!-- H right stem / W left stem -->
    <rect x="22" y="18" width="5.5" height="28" rx="2.5" fill="url(#hwGrad3)"/>
    <!-- W central diagonals and right stem -->
    <path d="M 27 46 
             L 34 26 
             L 39 26 
             L 44 46 
             L 38.5 46 
             L 36.5 36.5 
             L 34.5 46 Z" 
          fill="url(#hwGrad3)"/>
    <rect x="44" y="18" width="5.5" height="28" rx="2.5" fill="url(#hwGrad3)"/>
  </g>
</svg>
      `
    }
  ];

  let html = `
    <html>
      <body style="background: #000; color: #fff; font-family: sans-serif; padding: 40px;">
        <h2 style="margin-bottom: 30px;">Favicon Options Comparison at Real Browser Tab Sizes</h2>
        <div style="display: flex; gap: 40px; flex-wrap: wrap;">
  `;

  for (const des of designs) {
    html += `
      <div style="background: #111; padding: 20px; border-radius: 12px; border: 1px solid #222; width: 280px;">
        <h3 style="font-size: 14px; margin-top: 0;">${des.id}</h3>
        <p style="font-size: 11px; color: #888;">${des.desc}</p>
        
        <div style="margin-top: 15px;">
          <div style="font-size: 10px; color: #666; margin-bottom: 6px;">64x64 (High-DPI / Touch)</div>
          ${des.svg}
        </div>

        <div style="margin-top: 15px; display: flex; align-items: center; gap: 15px;">
          <div>
            <div style="font-size: 10px; color: #666; margin-bottom: 6px;">32x32 Tab</div>
            <div style="width: 32px; height: 32px;">${des.svg.replace('width="64" height="64"', 'width="32" height="32"')}</div>
          </div>
          <div>
            <div style="font-size: 10px; color: #666; margin-bottom: 6px;">16x16 Tab</div>
            <div style="width: 16px; height: 16px;">${des.svg.replace('width="64" height="64"', 'width="16" height="16"')}</div>
          </div>
        </div>

        <!-- Simulated Browser Tab -->
        <div style="margin-top: 20px; background: #202124; padding: 6px 12px; border-radius: 8px 8px 0 0; display: flex; align-items: center; gap: 8px; width: 180px; border-bottom: 2px solid #818cf8;">
          <div style="width: 16px; height: 16px;">${des.svg.replace('width="64" height="64"', 'width="16" height="16"')}</div>
          <span style="font-size: 12px; color: #e8eaed; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500;">HW Portfolio</span>
        </div>
      </div>
    `;
  }

  html += `</div></body></html>`;

  await page.setContent(html);
  const outPath = path.join(__dirname, 'favicon_comparison.png');
  await page.screenshot({ path: outPath, fullPage: true });
  console.log('Saved favicon comparison screenshot to', outPath);

  await browser.close();
})();
