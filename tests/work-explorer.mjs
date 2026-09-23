import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { launchBrowser, jump } from './camera-browser.mjs';

const url = process.env.PORTFOLIO_URL ?? 'http://127.0.0.1:4175/porto/';
const output = process.env.PORTFOLIO_OUTPUT ?? 'test-results/phase-3-polish';
const content = JSON.parse(readFileSync('lib/portfolio-content.json', 'utf8'));
const checks = [], errors = [], a11y = [];
const report = { date: new Date().toISOString(), url, checks, errors, a11y };
const pass = name => { checks.push(name); console.log('PASS: ' + name); };
mkdirSync(output, { recursive: true });
const browser = await launchBrowser();
const axe = async (page, name) => {
  const result = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  a11y.push({name,violations:result.violations});
  assert.deepEqual(result.violations.map(v => ({id:v.id,targets:v.nodes.map(n=>n.target)})), [], name);
};
const openIndex = async page => {
  await page.getByRole('button',{name:'Find work',exact:true}).click();
  await page.waitForSelector('dialog[open]');
};
try {
  const ctx = await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'no-preference'});
  const page = await ctx.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'networkidle'});
  await page.waitForSelector('[data-scene-status="ready"]');
  await page.waitForTimeout(900);
  await openIndex(page);
  const dialog = page.locator('dialog');
  assert.equal(await dialog.getAttribute('aria-labelledby'),'explorer-title');
  assert.equal(await page.locator('#work-search').evaluate(n=>n===document.activeElement),true);
  assert.equal(await dialog.locator('.mp-search-results > li').count(),9);
  await page.screenshot({path:output+'/project-index.png'});
  await axe(page,'project index');
  for(let i=0;i<32;i++) {
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(()=>!!document.activeElement.closest('dialog')),true,'focus remains in native modal');
  }
  const pBefore=await page.evaluate(()=>window.__MIDNIGHT_CAMERA__.read().progress);
  await page.mouse.move(600,490);await page.mouse.wheel(0,500);await page.waitForTimeout(250);
  assert.equal(await page.evaluate(()=>window.__MIDNIGHT_CAMERA__.read().progress),pBefore,'modal scrolling must not drive the camera');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog').count(),0);
  assert.equal(await page.getByRole('button',{name:'Find work',exact:true}).evaluate(n=>n===document.activeElement),true);
  pass('native modal autofocus, focus containment, scroll isolation, Escape and opener focus restoration');

  await page.keyboard.press('Control+k');
  await page.waitForSelector('dialog[open]');
  await dialog.getByRole('button',{name:'Public source',exact:true}).click();
  assert.equal(await dialog.locator('.mp-search-results > li').count(),content.PROJECTS.filter(p=>p.repo).length);
  await dialog.getByRole('button',{name:'Archives',exact:true}).click();
  assert.equal(await dialog.locator('.mp-search-results > li').count(),content.PROJECTS.filter(p=>!p.repo).length);
  await dialog.getByRole('button',{name:'All work',exact:true}).click();
  await page.locator('#work-search').fill('Flutter');
  assert.deepEqual(await dialog.locator('.mp-search-results > li > a').evaluateAll(a=>a.map(n=>n.hash)),['#p-aqila']);
  await page.keyboard.press('ArrowDown');
  assert.equal(await page.evaluate(()=>document.activeElement.hash),'#p-aqila');
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>Math.abs(window.__MIDNIGHT_CAMERA__.read().progress-10/12)<.002);
  assert.equal(await page.locator('dialog').count(),0);
  pass('Ctrl K, actual source-status filtering, technology search, arrow keys and Enter-to-waypoint');

  await openIndex(page);
  await page.locator('#work-search').fill('no-such-stack');
  assert.equal(await dialog.locator('.mp-search-results > li').count(),0);
  await dialog.getByRole('button',{name:'Show all projects'}).click();
  assert.equal(await dialog.locator('.mp-search-results > li').count(),9);
  await page.locator('#work-search').fill('Signal Processing');
  assert.deepEqual(await dialog.locator('.mp-search-results > li > a').evaluateAll(a=>a.map(n=>n.hash)),['#p-sonic']);
  await page.screenshot({path:output+'/project-search.png'});
  await dialog.getByRole('button',{name:'Inspect SonicCipher schematic',exact:true}).click();
  assert.equal(await dialog.locator('h2').textContent(),'SonicCipher');
  assert.match(await dialog.locator('.mp-schematic-note').textContent(),/not a product screenshot or measured telemetry/);
  const ids=await page.locator('[id]').evaluateAll(nodes=>nodes.map(n=>n.id));
  assert.equal(ids.length,new Set(ids).size,'inline SVG definitions stay unique in inspector and scene');
  await page.screenshot({path:output+'/project-inspector.png'});
  await axe(page,'project inspector');
  await dialog.getByRole('button',{name:'Project index',exact:false}).click();
  assert.equal(await page.locator('#work-search').inputValue(),'Signal Processing');
  await page.keyboard.press('Escape');
  await page.waitForSelector('dialog',{state:'detached'});
  pass('empty results recovery, documented skill search, inspectable original blueprint and unique SVG definitions');

  for(let i=0;i<content.PROJECTS.length;i++) {
    await jump(page,(i+2)/12);
    const project=page.locator('[data-waypoint="'+content.PROJECTS[i].id+'"]');
    await project.getByRole('button',{name:/Inspect .* schematic/}).click();
    await page.waitForSelector('dialog[open]');
    assert.equal(await dialog.locator('.mp-project-tags li').count(),5);
    await dialog.getByRole('link',{name:'Open waypoint'}).click();
    await page.waitForFunction(p=>Math.abs(window.__MIDNIGHT_CAMERA__.read().progress-p)<.002,(i+2)/12);
    assert.equal(await page.locator('dialog').count(),0);
  }
  const diagramText=await page.locator('.mp-art text').allTextContents();
  assert.ok(!/480 REQ|94\.2|0\.041|0\.284|0\.684|28\.4 dB|PASS RATE|CAPTCHA|142 MB|850ms|ZERO IDLE BATTERY|60 FPS TICK|STOCK: 36/.test(diagramText.join(' ')));
  const unresolved=await page.locator('.mp-art').evaluateAll(arts=>arts.flatMap(art=>Array.from(art.querySelectorAll('[fill],[stroke],[marker-end]')).flatMap(node=>Array.from(node.attributes).flatMap(attr=>{
    const id=attr.value.match(/^url\(#(.+)\)$/)?.[1];return id&&!document.getElementById(id)?[id]:[];
  }))));
  assert.deepEqual(unresolved,[]);
  pass('all nine blueprint inspectors navigate back correctly; no illustrative metrics claimed as results; all SVG references resolve');
  await ctx.close();

  for(const reduced of [false,true]) {
    const mobile=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,reducedMotion:reduced?'reduce':'no-preference'});
    const p=await mobile.newPage();p.on('pageerror',e=>errors.push(e.message));
    await p.goto(url,{waitUntil:'networkidle'});
    await p.waitForSelector('[data-scene-status="'+(reduced?'reduced-motion':'ready')+'"]');
    await openIndex(p);
    const d=p.locator('dialog');
    await p.locator('#work-search').fill('Riverpod');
    await d.getByRole('button',{name:'Inspect Aqila Atelier schematic',exact:true}).tap();
    assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    assert.equal(await d.locator('.mp-art').evaluate(n=>n.scrollWidth>n.clientWidth),true,'full-size diagram is inspectable by native horizontal pan');
    await p.screenshot({path:output+'/mobile-inspector'+(reduced?'-reduced':'')+'.png'});
    await axe(p,reduced?'reduced-motion project inspector':'mobile project inspector');
    await d.getByRole('link',{name:'Open waypoint'}).tap();
    assert.equal(await p.locator('dialog').count(),0);
    if(reduced) {
      assert.equal(await p.locator('canvas').count(),0);
      assert.equal(await p.evaluate(()=>document.documentElement.style.overflow),'');
      assert.equal(await p.evaluate(()=>location.hash),'#p-aqila');
    } else await p.waitForFunction(()=>Math.abs(window.__MIDNIGHT_CAMERA__.read().progress-10/12)<.002);
    await mobile.close();
  }
  pass('touch search/inspection/waypoint navigation, native diagram pan, static mode and reduced-motion modal behavior');
  assert.deepEqual(errors,[]);
  report.passed=true;
} finally {
  report.browser=browser.version();
  writeFileSync(output+'/explorer-checks.json',JSON.stringify(report,null,2)+'\n');
  await browser.close();
}
