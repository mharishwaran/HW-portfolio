const { chromium } = require('playwright');
const path = require('path');

// Let's see how camera FOV / aspect ratio works:
// In Three.js:
// const fov = 45;
// aspect = width / height;
// When width = 768, height = 1024, aspect = 0.75 (portrait-ish)
// When width = 1280, height = 800, aspect = 1.6 (landscape)
