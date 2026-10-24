import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const outDir = '/home/hosea/.gemini/antigravity-cli/brain/095adac4-18c5-45a4-9edb-5b7fe0cf9be8/scratch/screenshots';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/google/chrome/chrome',
  headless: true,
  args: ['--no-sandbox', '--enable-gpu', '--use-gl=angle', '--use-angle=gl', '--ignore-gpu-blocklist'],
});

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  
  console.log('Navigating to http://127.0.0.1:4178/porto/ ...');
  await page.goto('http://127.0.0.1:4178/porto/', { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-scene-status="ready"]', { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);

  // 1. Capture Hero
  await page.screenshot({ path: `${outDir}/00-hero.png` });
  console.log('Captured 00-hero.png');

  // 2. Jump to About (progress 1/12)
  await page.evaluate(() => window.__MIDNIGHT_CAMERA__.travel(1 / 12));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outDir}/01-about.png` });
  console.log('Captured 01-about.png');

  // 3. Jump to NESTfetch (progress 2/12)
  await page.evaluate(() => window.__MIDNIGHT_CAMERA__.travel(2 / 12));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outDir}/02-nestfetch.png` });
  console.log('Captured 02-nestfetch.png');

  // 4. Jump to SPIN AI (progress 4/12)
  await page.evaluate(() => window.__MIDNIGHT_CAMERA__.travel(4 / 12));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outDir}/04-spin.png` });
  console.log('Captured 04-spin.png');

  // 5. Jump to Skills (progress 11/12)
  await page.evaluate(() => window.__MIDNIGHT_CAMERA__.travel(11 / 12));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outDir}/11-skills.png` });
  console.log('Captured 11-skills.png');

  // 6. Jump to Contact (progress 12/12)
  await page.evaluate(() => window.__MIDNIGHT_CAMERA__.travel(1));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outDir}/12-contact.png` });
  console.log('Captured 12-contact.png');

  // 6. Mobile view (390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://127.0.0.1:4178/porto/', { waitUntil: 'networkidle' });
  await mobilePage.waitForSelector('[data-scene-status="ready"]', { timeout: 15000 });
  await mobilePage.waitForTimeout(1000);
  await mobilePage.screenshot({ path: `${outDir}/mobile-00-hero.png` });
  console.log('Captured mobile-00-hero.png');

  await mobilePage.evaluate(() => window.__MIDNIGHT_CAMERA__.travel(2 / 12));
  await mobilePage.waitForTimeout(1200);
  await mobilePage.screenshot({ path: `${outDir}/mobile-02-nestfetch.png` });
  console.log('Captured mobile-02-nestfetch.png');

  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
} finally {
  await browser.close();
}
