// Run with: deno run -A scripts/capture-sites.mjs
import { chromium } from "npm:playwright@1.58.2";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const projects = [
  ["thaina", "https://thainasampaio.com.br"],
  ["borrachas-rocha", "https://borrachasrocha.com.br"],
  ["patricia-abreu", "https://drapatriciaabreu.com.br"],
  ["dosim", "https://dosim.com.br"],
  ["spark", "https://sparkfilmes.com.br"],
];
let failed = false;
try {
  for (const [name, url] of projects) {
    for (const mobile of name === "thaina" ? [false, true] : [false]) {
      const page = await browser.newPage({
        viewport: mobile
          ? { width: 390, height: 844 }
          : { width: 1440, height: 1000 },
        deviceScaleFactor: 1,
        isMobile: mobile,
        hasTouch: mobile,
      });
      try {
        const response = await page.goto(url, {
          waitUntil: "networkidle",
          timeout: 60000,
        });
        if (!response?.ok()) throw new Error(`HTTP ${response?.status()}`);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(2500);
        await page.screenshot({
          path: `assets/images/projects/${name}-${
            mobile ? "mobile" : "desktop"
          }.jpg`,
          type: "jpeg",
          quality: 88,
        });
        console.log(name, mobile ? "mobile" : "desktop", await page.title());
      } catch (error) {
        failed = true;
        console.error(name, String(error));
      }
      await page.close();
    }
  }
} finally {
  await browser.close();
}
if (failed) Deno.exit(1);
