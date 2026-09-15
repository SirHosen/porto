import { chromium } from 'playwright';

export const url = process.env.PORTFOLIO_PROTOTYPE_URL ?? 'http://127.0.0.1:4175/porto/prototype/';
export const output = process.env.PORTFOLIO_CAMERA_OUTPUT ?? 'test-results/phase-1';
export const software = process.env.PORTFOLIO_RENDERER === 'software';

export function launchBrowser() {
  return chromium.launch({
    executablePath: process.env.PORTFOLIO_CHROME_PATH ?? '/opt/google/chrome/chrome',
    headless: true,
    args: ['--no-sandbox', '--enable-gpu', '--use-gl=angle', ...(software
      ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
      : ['--use-angle=gl', '--ignore-gpu-blocklist'])],
  });
}

export async function ready(page) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-scene-status="ready"]', { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
}

export async function jump(page, progress) {
  await page.evaluate((p) => window.__MIDNIGHT_CAMERA__.travel(p), progress);
  await page.waitForFunction((p) => Math.abs(window.__MIDNIGHT_CAMERA__.read().progress - p) < .002, progress);
  // Let the demand-driven render consume the new camera position.
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}
