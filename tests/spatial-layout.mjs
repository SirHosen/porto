import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { launchBrowser, jump } from './camera-browser.mjs';

const output=process.env.PORTFOLIO_OUTPUT??'test-results/spatial-verified';
const url=process.env.PORTFOLIO_URL??'http://127.0.0.1:4175/porto/';
mkdirSync(output,{recursive:true});
const report={date:new Date().toISOString(),url,checks:[],errors:[]};
const browser=await launchBrowser();
try {
  const page=await browser.newPage({viewport:{width:320,height:568}});
  page.on('pageerror',error=>report.errors.push(error.message));
  await page.goto(url,{waitUntil:'networkidle'});
  await page.waitForSelector('[data-scene-status="ready"]');
  await page.waitForTimeout(900);
  for(const [i,id] of [[0,'hero'],[1,'about'],[12,'contact']]) {
    await jump(page,i/12);
    const panel=page.locator('[data-waypoint="'+id+'"]');
    const dimensions=await panel.evaluate(n=>({client:n.clientHeight,scroll:n.scrollHeight}));
    assert.ok(dimensions.scroll<=dimensions.client+1,id+' must fit the short viewport');
    const box=await panel.boundingBox();
    assert.ok(box.y>=75 && box.y+box.height<=490,id+' stays between the fixed navigation');
    await page.screenshot({path:output+'/short-'+id+'.png'});
  }
  report.checks.push('320×568 hero, about and contact fit without clipped actions');
  await jump(page,8/12);
  const panel=page.locator('[data-waypoint="p-sessionlab"]');
  const details=panel.locator('.mp-project-body');
  const previous=await page.evaluate(()=>window.__MIDNIGHT_CAMERA__.read().progress);
  await details.hover();await page.mouse.wheel(0,350);await page.waitForTimeout(650);
  assert.ok(await details.evaluate(n=>n.scrollTop>0),'long project details scroll natively');
  assert.ok(Math.abs((await page.evaluate(()=>window.__MIDNIGHT_CAMERA__.read().progress))-previous)<.0001,'detail scroll must not move the scene');
  const next=panel.getByRole('link',{name:'Next waypoint'});
  const box=await next.boundingBox();
  assert.ok(box.y>=75 && box.y+box.height<=490,'project navigation stays visible during nested scroll');
  await page.screenshot({path:output+'/short-project-scrolled.png'});
  await next.click();
  await page.waitForFunction(()=>Math.abs(window.__MIDNIGHT_CAMERA__.read().progress-9/12)<.002);
  report.checks.push('short-screen detail scroll, fixed project controls, and next-waypoint navigation');
  assert.deepEqual(report.errors,[]);
  report.passed=true;
  console.log(report.checks.join('\n'));
} finally {
  report.browser=browser.version();
  writeFileSync(output+'/spatial-layout.json',JSON.stringify(report,null,2)+'\n');
  await browser.close();
}
