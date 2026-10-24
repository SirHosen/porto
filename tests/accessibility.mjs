import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
mkdirSync('test-results', { recursive: true });
const baseURL=process.env.PORTFOLIO_URL || 'http://127.0.0.1:4173/';
import AxeBuilder from '@axe-core/playwright';
const browser=await chromium.launch({...(process.env.PORTFOLIO_CHROME_PATH ? {executablePath:process.env.PORTFOLIO_CHROME_PATH} : {}),headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();
await page.goto(baseURL,{waitUntil:'networkidle'});
await page.evaluate(()=>Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{}))));
await page.screenshot({path:'test-results/final-hero.png'});
let violations=0;
for(const state of ['desktop','dialog','mobile']) {
  if(state==='dialog')await page.locator('[data-project="p-aqila"]').first().click();
  if(state==='mobile'){await page.keyboard.press('Escape');await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));}
  const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  violations+=result.violations.length;
  console.log(JSON.stringify({state,violations:result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))},null,2));
}
await page.screenshot({path:'test-results/final-mobile.png'});
await browser.close();

if(violations)process.exitCode=1;
