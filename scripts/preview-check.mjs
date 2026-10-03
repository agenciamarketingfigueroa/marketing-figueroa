import { chromium } from "npm:playwright@1.58.2";
const browser = await chromium.launch({
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
const base = "http://127.0.0.1:4173/";
const preparePage = async (page) => {
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    await document.fonts.ready;
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    await Promise.all(
      [...document.images].map((img) => img.decode().catch(() => {})),
    );
    window.scrollTo({ top: 0, behavior: "instant" });
  });
};
const pages = [
  "index.html",
  "sites.html",
  "trafego-pago.html",
  "proposta-trafego.html",
  "demonstracao-relatorio.html",
  "area-cliente.html",
];
let failed = false;
const check = (ok, message) => {
  if (!ok) {
    failed = true;
    console.error("FAIL", message);
  }
};
try {
  // Capture the working demonstration itself, so the mockups show the real responsive page.
  for (const mobile of [false, true]) {
    const page = await browser.newPage({
      viewport: mobile
        ? { width: 390, height: 844 }
        : { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    await page.goto(base + "demonstracao-relatorio.html", {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `assets/images/projects/relatorio-${
        mobile ? "mobile" : "desktop"
      }.jpg`,
      type: "jpeg",
      quality: 90,
    });
    await page.close();
  }
  for (const width of [1440, 1024, 768, 390, 320]) {
    for (const route of pages) {
      const page = await browser.newPage({
        viewport: { width, height: 1000 },
        deviceScaleFactor: 1,
        reducedMotion: "reduce",
      });
      const errors = [];
      page.on("pageerror", (error) => errors.push(String(error)));
      page.on("response", (response) => {
        if (response.status() >= 400) {
          errors.push(`${response.status()} ${response.url()}`);
        }
      });
      await page.goto(base + route, { waitUntil: "networkidle" });
      await preparePage(page);
      const metrics = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        brokenImages: [...document.images].filter((i) =>
          !i.complete || i.naturalWidth === 0
        ).map((i) => i.src),
        h1: document.querySelectorAll("h1").length,
      }));
      check(!metrics.overflow, `${route} @ ${width} horizontal overflow`);
      check(
        metrics.brokenImages.length === 0,
        `${route} @ ${width} broken images ${metrics.brokenImages}`,
      );
      check(
        metrics.h1 === 1,
        `${route} @ ${width} heading count ${metrics.h1}`,
      );
      check(
        errors.length === 0,
        `${route} @ ${width} browser errors ${errors}`,
      );
      if (route !== "demonstracao-relatorio.html") {
        const links = await page.locator(".site-nav a").allTextContents();
        check(links.length === 4, `${route}: expected four menu items`);
        if (width <= 768) {
          await page.locator(".nav-toggle").click();
          check(
            await page.locator(".nav-toggle").getAttribute("aria-expanded") ===
              "true",
            `${route}: mobile menu opens`,
          );
          await page.keyboard.press("Escape");
          check(
            await page.locator(".nav-toggle").getAttribute("aria-expanded") ===
              "false",
            `${route}: Escape closes menu`,
          );
          await page.locator(".nav-toggle").click();
          await page.locator(".site-nav a").first().click();
          check(
            await page.locator(".nav-toggle").getAttribute("aria-expanded") ===
              "false",
            `${route}: navigation closes menu`,
          );
          await page.goto(base + route, { waitUntil: "networkidle" });
        }
      }
      if (route === "demonstracao-relatorio.html") {
        await page.locator("#report-period").selectOption("previous");
        check(
          await page.locator('[data-metric="leads"]').innerText() === "50",
          "previous week leads",
        );
        check(
          (await page.locator('[data-metric="cpl"]').innerText()).includes(
            "16,00",
          ),
          "previous week cost",
        );
        check(
          (await page.locator(".bar span").allTextContents()).map(Number)
            .reduce((a, b) => a + b, 0) === 50,
          "previous chart total",
        );
        await page.locator("#report-period").selectOption("current");
        check(
          await page.locator('[data-metric="leads"]').innerText() === "75",
          "current week leads",
        );
      }
      if (route === "sites.html") {
        check(
          await page.locator(".price-card").count() === 2,
          "two site plans",
        );
        await page.locator("details summary").first().click();
        check(
          await page.locator("details").first().getAttribute("open") !== null,
          "FAQ opens",
        );
      }
      if (route === "proposta-trafego.html") {
        check(
          (await page.locator("meta[name=robots]").getAttribute("content"))
            .includes("noindex"),
          "proposal noindex",
        );
      }
      if (width === 1440 || width === 390) {
        await preparePage(page);
        await page.screenshot({
          path: `/private/tmp/figueroa-${
            route.replace(".html", "")
          }-${width}.png`,
          fullPage: true,
        });
      }
      console.log("CHECK", route, width, JSON.stringify(metrics));
      await page.close();
    }
  }
  // Local route, asset, anchor and hidden-proposal checks.
  const page = await browser.newPage();
  for (const route of pages) {
    await page.goto(base + route);
    const links = await page.locator("a[href]").evaluateAll((as) =>
      as.map((a) => a.getAttribute("href")).filter((h) => !/^https?:/.test(h))
    );
    for (const href of links) {
      const target = new URL(href, base + route);
      const response = await page.request.get(target.href);
      check(response.ok(), `${route}: broken local link ${href}`);
      if (target.hash) {
        const content = await response.text();
        check(
          content.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`),
          `${route}: missing anchor ${href}`,
        );
      }
      if (route !== "proposta-trafego.html") {
        check(
          !href.includes("proposta-trafego"),
          "proposal is not publicly linked",
        );
      }
    }
  }
  await page.goto(base + "area-cliente.html");
  await page.locator("[data-client-search-input]").fill("Vic");
  await page.locator("[data-client-search]").evaluate((form) =>
    form.requestSubmit()
  );
  check(
    await page.locator("[data-search-results] a").count() > 0,
    "existing client search returns result",
  );
  await page.locator("[data-client-search-input]").fill("Victor Lopes");
  await page.locator("[data-client-search]").evaluate((form) =>
    form.requestSubmit()
  );
  await page.waitForURL("**/clientes/victor-lopes/index.html");
  check(
    await page.locator("[data-access-gate]").isVisible(),
    "existing client exact match opens gated portal",
  );
  await page.close();
} finally {
  await browser.close();
}
if (failed) Deno.exit(1);
console.log("All checks passed.");
