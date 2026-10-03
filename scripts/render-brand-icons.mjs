// Render the official SVG with its white background; do not redraw the symbol.
// CLI: node scripts/render-brand-icons.mjs
// Optional: PLAYWRIGHT_MODULE (package path), BROWSER_EXECUTABLE (Chrome/Edge path).
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

export async function renderBrandIcons(browser) {
  const svg = await readFile(new URL('../assets/images/favicon.svg', import.meta.url), 'utf8');
  for (const [size, output] of [
    [512, 'assets/images/app-icon-512.png'],
    [192, 'assets/images/app-icon-192.png'],
    [180, 'apple-touch-icon.png'],
    [32, 'assets/images/favicon-32.png'],
    [16, 'assets/images/favicon-16.png'],
  ]) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    try {
      await page.setContent('<html><head><style>html,body{margin:0;background:white}svg{display:block;width:' + size + 'px;height:' + size + 'px}</style></head><body>' + svg + '</body></html>');
      await page.screenshot({ path: fileURLToPath(new URL('../' + output, import.meta.url)), clip: { x: 0, y: 0, width: size, height: size } });
    } finally { await page.close(); }
  }
}

if (typeof process !== 'undefined' && process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const require = createRequire(import.meta.url);
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
  const executablePath = process.env.BROWSER_EXECUTABLE || [
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].find(existsSync);
  const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  try { await renderBrandIcons(browser); } finally { await browser.close(); }
}
