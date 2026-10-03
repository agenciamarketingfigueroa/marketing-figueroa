// Run with: deno run -A scripts/render-brand-icons.mjs
// Exports the official monogram from favicon.svg at browser and Apple icon sizes.
import { chromium } from "npm:playwright@1.58.2";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const iconUrl = new URL("../assets/images/favicon.svg", import.meta.url);
  for (
    const [size, output] of [
      [512, "assets/images/app-icon-512.png"],
      [192, "assets/images/app-icon-192.png"],
      [180, "apple-touch-icon.png"],
      [32, "assets/images/favicon-32.png"],
      [16, "assets/images/favicon-16.png"],
    ]
  ) {
    const page = await browser.newPage({
      viewport: { width: size, height: size },
      deviceScaleFactor: 1,
    });
    await page.goto(iconUrl.href);
    await page.evaluate(async (size) => {
      document.documentElement.style.width = `${size}px`;
      document.documentElement.style.height = `${size}px`;
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );
    }, size);
    await page.screenshot({
      path: output,
      clip: { x: 0, y: 0, width: size, height: size },
    });
    await page.close();
  }
} finally {
  await browser.close();
}
