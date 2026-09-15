import assert from 'node:assert/strict';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { launchBrowser, jump } from './camera-browser.mjs';

const url = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4175/porto/';
const output = process.env.PORTFOLIO_OUTPUT ?? 'test-results/phase-2';
const frozen = JSON.parse(readFileSync('docs/audit/skills-verbatim.json', 'utf8'));
const content = JSON.parse(readFileSync('lib/portfolio-content.json', 'utf8'));
const ids = ['hero', 'about', ...content.PROJECTS.map(p => p.id), 'arsenal', 'contact'];
const normalize = text => text.replace(/\s+/g, ' ').trim();
const checks = [], errors = [], requests = [], waypoints = [], a11y = [];
const report = { date: new Date().toISOString(), url, checks, errors, requests, waypoints, a11y };
const pass = name => { checks.push(name); console.log('PASS: ' + name); };
mkdirSync(output, { recursive: true });
const browser = await launchBrowser();
const watch = page => {
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', r => { if (r.status() >= 400) requests.push(r.status() + ' ' + r.url()); });
};
const ready = async page => {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-scene-status="ready"]');
  await page.evaluate(() => document.fonts.ready);
};
const afterFrame = async page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const checkStatic = async page => {
  assert.equal(await page.locator('canvas').count(), 0);
  assert.equal(await page.locator('.mp-project h2:visible').count(), 9);
  assert.equal(await page.locator('.mp-domain-panel:visible').count(), 6);
  assert.deepEqual(await page.locator('.mp-skill-tags li').allTextContents(), frozen.CATS.flatMap(cat => frozen.SKILLS.filter(s => s[2] === cat.id).map(s => s[1])));
  assert.equal(await page.locator('.mp-content[inert]').count(), 0);
  for (let i = 0; i < 6; i++) {
    const text = await page.locator('#domain-' + frozen.CATS[i].id + ' .mp-domain-copy').innerText();
    assert.equal(normalize(text), normalize(frozen.renderedDomains[i].panelText));
  }
};
const axe = async (page, name) => {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  a11y.push({ name, violations: result.violations });
  assert.deepEqual(result.violations.map(v => v.id), [], name + ': ' + JSON.stringify(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) }))));
};

try {
  for (const key of ['CATS', 'SKILLS', 'DOMAIN_COPY']) assert.deepEqual(content[key], frozen[key]);
  assert.equal(content.PROJECTS.length, 9);
  pass('frozen skills data and descriptions match Phase 0 exactly; all nine projects retained');

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const page = await context.newPage(); watch(page); await ready(page);
  for (let i = 0; i < ids.length; i++) {
    await jump(page, i / 12);
    const panel = page.locator('[data-waypoint="' + ids[i] + '"]');
    assert.equal(await panel.getAttribute('data-visible'), 'true');
    assert.equal(await panel.evaluate(n => n.inert), false);
    const data = await page.evaluate(() => window.__MIDNIGHT_CAMERA__.read());
    assert.equal(data.activeTriggers, 1);
    assert.ok(data.calls <= 10 && data.triangles < 10000);
    const box = await panel.boundingBox();
    assert.ok(box.x >= -1 && box.x + box.width <= 1441 && box.y >= 85 && box.y + box.height <= 820, ids[i] + ' must fit between navigation');
    waypoints.push({ id: ids[i], progress: data.progress, position: data.position, box, calls: data.calls, triangles: data.triangles });
    await page.screenshot({ path: output + '/desktop-' + String(i).padStart(2,'0') + '-' + ids[i] + '.png' });
    if ([0, 2, 11, 12].includes(i)) await axe(page, 'desktop ' + ids[i]);
  }
  assert.ok(waypoints[0].position[2] - waypoints.at(-1).position[2] > 450);
  await jump(page, 2 / 12);
  const before = await page.locator('[data-waypoint="p-nestfetch"]').boundingBox();
  await jump(page, 2 / 12 + .018);
  const approaching = await page.locator('[data-waypoint="p-nestfetch"]').boundingBox();
  assert.ok(approaching.width > before.width * 1.3, 'project grows as the camera approaches its world-space anchor');
  await jump(page, 2 / 12);
  assert.ok(Math.abs((await page.locator('[data-waypoint="p-nestfetch"]').boundingBox()).width - before.width) < 1);
  pass('13 actual camera stops, nine distinct projected project panels, reversible perspective, bounded geometry, desktop screenshots');

  await jump(page, 11 / 12);
  for (let i = 0; i < 6; i++) {
    await page.locator('#tab-' + frozen.CATS[i].id).click();
    await afterFrame(page);
    const panel = page.locator('#domain-' + frozen.CATS[i].id);
    assert.equal(await panel.isVisible(), true);
    assert.equal(normalize(await panel.locator('.mp-domain-copy').innerText()), normalize(frozen.renderedDomains[i].panelText));
    await page.screenshot({ path: output + '/skills-' + frozen.CATS[i].code.toLowerCase() + '.png' });
  }
  await page.locator('#tab-cat-prac').focus(); await page.keyboard.press('Home');
  assert.equal(await page.locator('#tab-cat-lang').getAttribute('aria-selected'), 'true');
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('#tab-cat-web').getAttribute('aria-selected'), 'true');
  await page.keyboard.press('End');
  assert.equal(await page.locator('#tab-cat-prac').getAttribute('aria-selected'), 'true');
  await page.keyboard.press('Home');
  const core = await page.locator('.mp-core').boundingBox();
  const orbitBefore = await page.screenshot({ clip: core });
  await page.mouse.move(core.x + core.width * .5, core.y + core.height * .5);
  await page.mouse.down(); await page.mouse.move(core.x + core.width * .7, core.y + core.height * .6, { steps: 8 }); await page.mouse.up();
  await afterFrame(page);
  assert.notDeepEqual(await page.screenshot({ clip: core }), orbitBefore, 'drag really rotates the 3D crystal');
  await page.getByRole('button', { name: 'RESET ↺' }).click(); await afterFrame(page);
  assert.deepEqual(await page.screenshot({ clip: core }), orbitBefore, 'reset restores the deterministic core pose');
  pass('all six Skills panels match frozen text; keyboard tabs, real crystal drag and reset');

  await page.getByRole('link', { name: '9 connected projects', exact: true }).click();
  await page.waitForFunction(() => Math.abs(window.__MIDNIGHT_CAMERA__.read().progress - 2 / 12) < .002);
  await page.locator('[data-waypoint="p-nestfetch"]').getByRole('link', { name: 'Next waypoint' }).click();
  await page.waitForFunction(() => Math.abs(window.__MIDNIGHT_CAMERA__.read().progress - 3 / 12) < .002);
  await page.locator('.mp-nav').getByRole('link', { name: 'Contact', exact: true }).click();
  await page.waitForFunction(() => window.__MIDNIGHT_CAMERA__.read().progress > .998);
  pass('section navigation, project next/previous, and Skills-to-work links drive the camera');

  await jump(page, 0);
  await page.mouse.move(30, 350); await page.mouse.wheel(0, 600);
  await page.waitForFunction(() => window.__MIDNIGHT_CAMERA__.read().progress > .02);
  const binding = await page.evaluate(() => ({ p: window.__MIDNIGHT_CAMERA__.read().progress, scroll: scrollY / (document.querySelector('.mp-track').offsetHeight - innerHeight) }));
  assert.ok(Math.abs(binding.p - binding.scroll) < .01);
  await jump(page, 1 / 12); await page.waitForTimeout(400);
  const idle = await page.evaluate(() => window.__MIDNIGHT_CAMERA__.read().renders);
  await page.waitForTimeout(800);
  assert.ok((await page.evaluate(() => window.__MIDNIGHT_CAMERA__.read().renders)) - idle <= 2);
  pass('real wheel binding and idle render suspension');

  for (const [width, height] of [[320,568], [390,844], [768,1024], [1440,900]]) {
    await page.setViewportSize({ width, height }); await page.waitForTimeout(500);
    for (const i of [0,2,8,11,12]) {
      await jump(page, i / 12);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontal overflow at ' + width + ' / ' + ids[i]);
      const box = await page.locator('[data-waypoint="' + ids[i] + '"]').boundingBox();
      assert.ok(box.x >= -1 && box.x + box.width <= width + 1, 'panel width at ' + width + '/' + ids[i]);
      if (width === 390) await page.screenshot({ path: output + '/responsive-' + ids[i] + '.png' });
    }
  }
  pass('320/390/768/1440 layouts and safe viewport resizing');

  await jump(page, 11 / 12);
  await page.getByRole('button', { name: 'Static view', exact: true }).click();
  await page.waitForSelector('[data-scene-status="static"]'); await checkStatic(page);
  assert.equal(await page.evaluate(() => !!window.__MIDNIGHT_CAMERA__ || document.documentElement.classList.contains('lenis')), false);
  await page.getByRole('button', { name: 'Enable 3D', exact: true }).click();
  await page.waitForSelector('[data-scene-status="ready"]');
  await page.waitForFunction(() => Math.abs(window.__MIDNIGHT_CAMERA__.read().progress - 11 / 12) < .002);
  assert.equal(await page.evaluate(() => window.__MIDNIGHT_CAMERA__.read().activeTriggers), 1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForSelector('[data-scene-status="reduced-motion"]'); await checkStatic(page);
  pass('manual static mode, complete content, clean remount, runtime reduced-motion teardown');
  await context.close();

  const mobile = await browser.newContext({ viewport: { width:390,height:844 }, deviceScaleFactor:2, isMobile:true, hasTouch:true, reducedMotion:'no-preference' });
  const mobilePage = await mobile.newPage(); watch(mobilePage); await ready(mobilePage);
  for (let i=0;i<ids.length;i++) {
    await jump(mobilePage, i/12);
    await mobilePage.screenshot({path:output+'/mobile-'+String(i).padStart(2,'0')+'-'+ids[i]+'.png'});
  }
  await jump(mobilePage,11/12);
  assert.equal(await mobilePage.locator('.mp-core-bottom > span').textContent(),'SELECT A DOMAIN · SCROLL TO CONTINUE');
  for(let i=0;i<6;i++) {
    await mobilePage.locator('#tab-'+frozen.CATS[i].id).click();
    assert.equal(normalize(await mobilePage.locator('#domain-'+frozen.CATS[i].id+' .mp-domain-copy').innerText()),normalize(frozen.renderedDomains[i].panelText));
  }
  await axe(mobilePage,'mobile Skills');
  await jump(mobilePage,0);
  const cdp = await mobile.newCDPSession(mobilePage);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:190,y:650}]});
  for(let y=620;y>=170;y-=30) {await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:190,y}]});await mobilePage.waitForTimeout(25);}
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await mobilePage.waitForFunction(()=>window.__MIDNIGHT_CAMERA__.read().progress>.02);
  await mobilePage.evaluate(()=>document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await mobilePage.waitForSelector('[data-scene-status="webgl-unavailable"]');await checkStatic(mobilePage);
  pass('all mobile waypoint screenshots, six mobile domains, native touch travel and context-loss fallback');
  await mobile.close();

  for(const mode of ['reduced','no-js','no-webgl']) {
    const ctx = await browser.newContext({viewport:{width:390,height:844},reducedMotion:mode==='reduced'?'reduce':'no-preference',javaScriptEnabled:mode!=='no-js'});
    if(mode==='no-webgl') await ctx.addInitScript(()=>{
      const original=HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext=function(kind,...args){return ['webgl','webgl2','experimental-webgl'].includes(kind)?null:original.call(this,kind,...args);};
    });
    const p=await ctx.newPage();watch(p);await p.goto(url,{waitUntil:'networkidle'});
    if(mode==='no-webgl') await p.waitForSelector('[data-scene-status="webgl-unavailable"]');
    await checkStatic(p);
    assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await p.screenshot({path:output+'/fallback-'+mode+'.png',fullPage:true});
    if(mode!=='no-js') await axe(p,mode+' fallback');
    await ctx.close();
  }
  pass('reduced-motion, no-JavaScript and no-WebGL all expose the complete static document');
  assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
  pass('no uncaught runtime errors or failed asset requests');
  report.passed=true;
} finally {
  report.browser=browser.version();
  writeFileSync(output+'/checks.json',JSON.stringify(report,null,2)+'\n');
  await browser.close();
}
