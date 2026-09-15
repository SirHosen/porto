import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { launchBrowser, ready, jump, output, url, software } from './camera-browser.mjs';

mkdirSync(output, { recursive: true });
const browser = await launchBrowser();
const report = {
  date: new Date().toISOString(), url, browser: browser.version(),
  build: 'Next.js production static export',
  method: 'WebGL render callback intervals during a 12 s linear Lenis scroll, synchronized through GSAP ScrollTrigger; capture and video run separately.',
  caveat: 'Emulated mobile viewport and 4x CPU on the disclosed host GPU; not a physical Android/iPhone or mobile GPU certification. Intervals measure render-loop delivery, not display presentation timestamps.',
  target: { fps: 60, nominalMeanFloor: 59, p95FrameCeilingMs: 18.5, slowFrameFractionCeiling: .01 },
  profiles: [],
};
const profiles = [
  { name: 'desktop', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, cpu: 1, runs: 1, isMobile: false },
  { name: 'mobile-4x', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, cpu: 4, runs: 3, isMobile: true },
];
try {
  for (const profile of profiles) {
    const context = await browser.newContext({ viewport: profile.viewport, deviceScaleFactor: profile.deviceScaleFactor, isMobile: profile.isMobile, hasTouch: profile.isMobile, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu });
    await ready(page);
    // Compile/warm the same materials before measuring steady-state scrolling.
    await jump(page, 1); await jump(page, 0);
    await page.waitForTimeout(600);
    for (let run = 1; run <= profile.runs; run++) {
      await jump(page, 0);
      await page.waitForTimeout(300);
      const measured = await page.evaluate(async () => {
        const camera = window.__MIDNIGHT_CAMERA__;
        camera.startCapture();
        const started = performance.now();
        await camera.travel(1, 12);
        const elapsedMs = performance.now() - started;
        return { ...camera.stopCapture(), elapsedMs };
      });
      assert.ok(measured.progress > .998, 'full path must be traversed');
      assert.ok(measured.frameTimes.length > 100, 'a real render sample is required');
      const frames = measured.frameTimes.toSorted((a, b) => a - b);
      const averageMs = frames.reduce((sum, value) => sum + value, 0) / frames.length;
      const result = {
        profile: profile.name, run, viewport: profile.viewport, deviceScaleFactor: profile.deviceScaleFactor, canvasDpr: measured.dpr, cpuSlowdown: profile.cpu,
        renderer: measured.renderer, frames: frames.length, elapsedMs: measured.elapsedMs,
        meanFps: 1000 / averageMs, medianFrameMs: frames[Math.floor(frames.length * .5)], p95FrameMs: frames[Math.floor(frames.length * .95)],
        maxFrameMs: frames.at(-1), over33ms: frames.filter((n) => n > 33.4).length,
        drawCalls: measured.calls, triangles: measured.triangles, samples: measured.samples, rawFrameTimesMs: measured.frameTimes,
      };
      result.nominal60fps = result.meanFps >= report.target.nominalMeanFloor && result.p95FrameMs <= report.target.p95FrameCeilingMs && result.over33ms / frames.length <= report.target.slowFrameFractionCeiling;
      result.hardwareRenderer = !/swiftshader|llvmpipe|software/i.test(result.renderer);
      report.profiles.push(result);
      console.log(JSON.stringify({ ...result, samples: undefined, rawFrameTimesMs: undefined }));
    }
    await context.close();
  }
  report.passed = !software && report.profiles.every((r) => r.nominal60fps && r.hardwareRenderer);
  if (!report.passed) process.exitCode = 1;
} finally {
  writeFileSync(output + '/benchmark.json', JSON.stringify(report, null, 2) + '\n');
  await browser.close();
}
