import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { launchBrowser, ready, jump, output, url } from './camera-browser.mjs';

mkdirSync(output, { recursive: true });
const browser = await launchBrowser();
const errors = [], failedRequests = [], waypoints = [];
const watch = (page) => {
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('response', (r) => { if (r.status() >= 400) failedRequests.push(r.status() + ' ' + r.url()); });
};
const report = { date: new Date().toISOString(), url, checks: [], errors, failedRequests, waypoints };
const pass = (name) => { report.checks.push(name); console.log('PASS: ' + name); };

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const page = await context.newPage(); watch(page);
  await ready(page);
  assert.equal(await page.locator('canvas').count(), 1);
  for (const progress of [0, .25, .5, .75, 1]) {
    await jump(page, progress);
    const data = await page.evaluate(() => window.__MIDNIGHT_CAMERA__.read());
    assert.equal(data.activeTriggers, 1, 'only one ScrollTrigger may own the path');
    assert.ok(data.calls <= 10, 'placeholder scene draw budget');
    assert.ok(data.triangles < 10000, 'placeholder scene triangle budget');
    waypoints.push({ progress, position: data.position, direction: data.direction });
    await page.screenshot({ path: output + '/frame-' + Math.round(progress * 100) + '.png' });
  }
  assert.ok(waypoints[0].position[2] - waypoints[4].position[2] > 120, 'camera must travel through world space');
  assert.ok(Math.max(...waypoints.map((w) => w.position[0])) - Math.min(...waypoints.map((w) => w.position[0])) > 3, 'path must actually bend');
  await jump(page, .5);
  const returned = await page.evaluate(() => window.__MIDNIGHT_CAMERA__.read().position);
  assert.ok(returned.every((value, i) => Math.abs(value - waypoints[2].position[i]) < .02));
  pass('continuous camera path, five stops, reversible travel, bounded geometry');

  await jump(page, 0);
  await page.mouse.wheel(0, 550);
  await page.waitForFunction(() => window.__MIDNIGHT_CAMERA__.read().progress > .03);
  const binding = await page.evaluate(() => ({ actual: window.__MIDNIGHT_CAMERA__.read().progress, expected: scrollY / (document.querySelector('#camera-track').offsetHeight - innerHeight) }));
  assert.ok(Math.abs(binding.actual - binding.expected) < .01);
  pass('real wheel input drives scroll position and camera progress');

  await jump(page, .25);
  await page.waitForTimeout(350);
  const beforeIdle = await page.evaluate(() => window.__MIDNIGHT_CAMERA__.read().renders);
  await page.waitForTimeout(800);
  const afterIdle = await page.evaluate(() => window.__MIDNIGHT_CAMERA__.read().renders);
  assert.ok(afterIdle - beforeIdle <= 2, 'idle scene should not continuously redraw');
  pass('demand rendering stops when camera is idle');

  await page.getByRole('link', { name: 'Frame 5: Exit', exact: true }).click();
  await page.waitForFunction(() => window.__MIDNIGHT_CAMERA__.read().progress > .998);
  await page.keyboard.press('Home');
  await page.waitForFunction(() => window.__MIDNIGHT_CAMERA__.read().progress < .01);
  pass('waypoint navigation and native keyboard scrolling');

  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.waitForTimeout(300);
    await jump(page, 0);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'overflow at ' + width);
    if (width === 390) await page.screenshot({ path: output + '/mobile-start.png' });
  }
  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  report.axe = axe.violations;
  assert.deepEqual(axe.violations.map((v) => v.id), []);
  pass('320–1440 px layout and automated WCAG A/AA checks');

  await page.getByRole('button', { name: 'Static view', exact: true }).click();
  await page.waitForSelector('[data-scene-status="static"]');
  assert.equal(await page.locator('canvas').count(), 0);
  assert.equal(await page.evaluate(() => !!window.__MIDNIGHT_CAMERA__), false);
  assert.equal(await page.evaluate(() => document.documentElement.classList.contains('lenis')), false);
  await page.getByRole('button', { name: 'Enable 3D', exact: true }).click();
  await page.waitForSelector('[data-scene-status="ready"]');
  assert.equal(await page.evaluate(() => window.__MIDNIGHT_CAMERA__.read().activeTriggers), 1);
  pass('manual static view, cleanup, and clean 3D remount');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForSelector('[data-scene-status="reduced-motion"]');
  assert.equal(await page.locator('canvas').count(), 0);
  assert.equal(await page.evaluate(() => !!window.__MIDNIGHT_CAMERA__), false);
  pass('changing OS motion preference tears down the 3D scene');
  await context.close();

  const reduced = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', isMobile: true, hasTouch: true });
  const reducedPage = await reduced.newPage(); watch(reducedPage);
  await reducedPage.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await reducedPage.locator('canvas').count(), 0);
  assert.equal(await reducedPage.evaluate(() => !!window.__MIDNIGHT_CAMERA__), false);
  assert.equal(await reducedPage.locator('.path-stop h2:visible').count(), 5);
  await reducedPage.screenshot({ path: output + '/reduced-motion.png', fullPage: true });
  const reducedAxe = await new AxeBuilder({ page: reducedPage }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  assert.deepEqual(reducedAxe.violations.map((v) => v.id), []);
  pass('reduced-motion first load has complete static content and no WebGL runtime');
  await reduced.close();

  const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const noJSPage = await noJS.newPage(); watch(noJSPage);
  await noJSPage.goto(url, { waitUntil: 'load' });
  assert.equal(await noJSPage.locator('.path-stop h2:visible').count(), 5);
  assert.equal(await noJSPage.locator('canvas').count(), 0);
  pass('static export is readable without JavaScript');
  await noJS.close();

  const touch = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'no-preference' });
  const touchPage = await touch.newPage(); watch(touchPage);
  await ready(touchPage);
  const touchCDP = await touch.newCDPSession(touchPage);
  await touchCDP.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 190, y: 650 }] });
  for (let y = 620; y >= 170; y -= 30) {
    await touchCDP.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 190, y }] });
    await touchPage.waitForTimeout(25);
  }
  await touchCDP.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await touchPage.waitForFunction(() => window.__MIDNIGHT_CAMERA__.read().progress > .05);
  pass('emulated native touch scrolling moves the camera without a scroll trap');
  await touchPage.evaluate(() => document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await touchPage.waitForSelector('[data-scene-status="webgl-unavailable"]');
  assert.equal(await touchPage.locator('.path-stop h2:visible').count(), 5);
  assert.equal(await touchPage.evaluate(() => !!window.__MIDNIGHT_CAMERA__), false);
  pass('live WebGL context loss releases the scene and exposes static content');
  await touch.close();

  const unavailable = await browser.newContext({ reducedMotion: 'no-preference' });
  await unavailable.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(kind, ...args) {
      return ['webgl', 'webgl2', 'experimental-webgl'].includes(kind) ? null : original.call(this, kind, ...args);
    };
  });
  const unavailablePage = await unavailable.newPage(); watch(unavailablePage);
  await unavailablePage.goto(url, { waitUntil: 'networkidle' });
  await unavailablePage.waitForSelector('[data-scene-status="webgl-unavailable"]');
  assert.equal(await unavailablePage.locator('.path-stop h2:visible').count(), 5);
  pass('WebGL failure falls back to complete static content');
  await unavailable.close();

  assert.deepEqual(errors, []);
  assert.deepEqual(failedRequests, []);
  pass('no uncaught runtime errors or failed requests');
} finally {
  report.browser = browser.version();
  writeFileSync(output + '/checks.json', JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
