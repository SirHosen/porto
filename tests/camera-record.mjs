import { mkdirSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { launchBrowser, ready, jump, output } from './camera-browser.mjs';

mkdirSync(output, { recursive: true });
const browser = await launchBrowser();
let encoder;
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  await ready(page);
  await jump(page, 0);
  const cdp = await context.newCDPSession(page);
  const target = output + '/camera-scroll.mp4';
  encoder = spawn(process.env.PORTFOLIO_FFMPEG_PATH ?? 'ffmpeg', [
    '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-vcodec', 'mjpeg', '-i', 'pipe:0',
    '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '21', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', target,
  ], { stdio: ['pipe', 'ignore', 'pipe'] });
  let stderr = '';
  encoder.stderr.on('data', (data) => { stderr += String(data); });
  const finished = new Promise((resolve, reject) => {
    encoder.on('error', reject);
    encoder.on('exit', (code) => code === 0 ? resolve() : reject(new Error('FFmpeg exited ' + code + ': ' + stderr)));
  });
  // Chrome emits only changed frames. Resample capture timestamps to 30 fps,
  // duplicating the previous image when there is a gap: no sped-up playback.
  let origin, previous, written = 0, captured = 0;
  const frame = ({ data, metadata, sessionId }) => {
    void cdp.send('Page.screencastFrameAck', { sessionId });
    const image = Buffer.from(data, 'base64');
    origin ??= metadata.timestamp;
    const targetFrame = Math.round((metadata.timestamp - origin) * 30);
    while (written < targetFrame && previous) { encoder.stdin.write(previous); written++; }
    if (written === targetFrame) { encoder.stdin.write(image); written++; }
    previous = image;
    captured++;
  };
  cdp.on('Page.screencastFrame', frame);
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, maxWidth: 1280, maxHeight: 800, everyNthFrame: 1 });
  await page.waitForTimeout(700);
  const seconds = Number(process.env.PORTFOLIO_RECORD_SECONDS ?? 16);
  if (!Number.isFinite(seconds) || seconds < 5 || seconds > 120) throw new Error('Invalid recording duration');
  await page.evaluate(seconds => window.__MIDNIGHT_CAMERA__.travel(1, seconds), seconds);
  await page.waitForTimeout(700);
  await cdp.send('Page.stopScreencast');
  cdp.off('Page.screencastFrame', frame);
  if (!previous || captured < 30) throw new Error('Insufficient captured screen frames');
  for (let i = 0; i < 21; i++) { encoder.stdin.write(previous); written++; }
  encoder.stdin.end();
  await finished;
  writeFileSync(output + '/recording.json', JSON.stringify({
    file: target, method: 'Chrome DevTools screencast, JPEG frames with capture timestamps, resampled by system FFmpeg',
    viewport: { width: 1280, height: 800 }, scrollDurationSeconds: seconds, encodedFps: 30, capturedScreenFrames: captured, encodedFrames: written,
    note: '30 fps screen recording for visual review, not the separately measured 60 fps render benchmark.',
  }, null, 2) + '\n');
  await context.close();
  console.log('Recording: ' + target + ' (' + captured + ' captured frames, 30 fps encoded)');
} finally {
  if (encoder && encoder.exitCode === null) encoder.kill('SIGTERM');
  await browser.close();
}
