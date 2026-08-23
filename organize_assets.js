import fs from 'fs';
import path from 'path';

const brainDir = 'C:/Users/haris/.gemini/antigravity/brain/2b85c97c-25a5-47f9-8683-66a212618ca9/.user_uploaded';
const assetsDir = 'c:/Users/haris/OneDrive/Documents/ANT PF/public/assets';

const mappings = {
  'media_1786884108943.png': 'udemy_web_dev.png',
  'media_1786884121646.png': 'chatgpt_masterclass.png',
  'media_1786884121638.png': 'uniq_react.png',
  'media_1786884121632.png': 'cil_webinar.png',
  'media_1786884121657.png': 'novitech_events.png',
  'media_1786884121689.png': 'guvi_genai.png',
  'media_1786884109003.png': 'letsupgrade_html_css.png',
  'media_1786884108960.png': 'letsupgrade_python.png',
  'media_1786884108973.png': 'letsupgrade_url_params.png',
  'media_1786884108959.png': 'bolt_python.png'
};

Object.entries(mappings).forEach(([srcName, destName]) => {
  const srcPath = path.join(brainDir, srcName);
  const destPath = path.join(assetsDir, destName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${srcName} to ${destName}`);
  } else {
    console.error(`Source not found: ${srcPath}`);
  }
});
