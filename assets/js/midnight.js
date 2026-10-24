import { CATS, SKILLS, PROJECTS, DOMAIN_COPY, PROJECT_DETAILS } from './data.js';
import { createCore } from './core.js';
import { setMuted, sfx } from './sfx.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tags = items => `<ul class="project-tags">${items.map(item=>`<li>${escapeHTML(item)}</li>`).join('')}</ul>`;
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
let userPaused = false;
try { userPaused=localStorage.getItem('midnight-motion-paused')==='1'; } catch { /* Storage is optional. */ }
let paused = motionQuery.matches || userPaused;

const covers = {
  aqila: `<div class="atelier-window"><div class="atelier-brand"><b>A</b>Aqila Atelier</div><p class="atelier-subtitle">A thoughtful retail workspace</p><div class="atelier-stats"><div class="atelier-stat"><span>INVENTORY</span><strong>In balance.</strong></div><div class="atelier-stat"><span>THE ATELIER</span><strong>In motion.</strong></div></div><div class="atelier-chart">${[30,48,39,64,55,80,72,100].map(h=>`<i style="--bar:${h}%"></i>`).join('')}</div></div>`,
  nest: `<span class="nest-orbit"></span><div class="nest-code"><em>❯ nestfetch run</em><br>sources → configured<br>pipeline → async<br>output → structured</div><span class="nest-node"></span><span class="nest-name">NEST<span>fetch</span></span>`,
  game: `<div class="game-world"><div class="game-grid"></div><div class="game-moon"></div></div><span class="game-name">GAME<span style="color:#d0a9d2">NEST</span></span>`,
};
const featured = ['p-aqila','p-nestfetch','p-gamenest'].map(id=>PROJECTS.find(p=>p.id===id));
const archive = PROJECTS.filter(p=>!p.featured);
$('#featured-projects').innerHTML=featured.map((p,i)=>`<article class="project-card"><button class="project-cover cover-${p.featured}" type="button" data-project="${p.id}" aria-label="Explore ${escapeHTML(p.name)}"><span class="cover-label"><span>PROJECT / 0${i+1}</span><span>${p.featured==='aqila'?'INTERFACE STUDY':'CONCEPT VISUAL'}</span></span><span aria-hidden="true">${covers[p.featured]}</span><span class="cover-arrow" aria-hidden="true">↗</span></button><div class="project-meta"><span>${escapeHTML(p.kind).toUpperCase()}</span><span>${escapeHTML(p.status).toUpperCase()}</span></div><h3><button type="button" data-project="${p.id}">${escapeHTML(p.name)}</button></h3><p>${escapeHTML(p.tagline)}</p>${tags(p.stack)}</article>`).join('');
function renderArchive(filter='all') {
  const projects=archive.filter(p=>filter==='all'||p.category===filter);
  $('#project-archive').innerHTML=projects.map(p=>`<button type="button" class="archive-row" data-project="${p.id}" aria-label="Explore ${escapeHTML(p.name)}, ${escapeHTML(p.status)}"><span class="row-index">${p.index}</span><strong>${escapeHTML(p.name)}</strong><span class="row-stack">${p.stack.slice(0,3).map(escapeHTML).join(' / ')}</span><span class="row-status">${escapeHTML(p.status).toUpperCase()}</span><span class="row-arrow" aria-hidden="true">↗</span></button>`).join('');
  $('#archive-count').textContent=`[ ${String(projects.length).padStart(2,'0')} ]`;
  $('#filter-status').textContent=`${projects.length} ${filter==='all'?'archived projects':filter==='lab'?'labs':'products'} shown.`;
}
renderArchive();
$('.project-filters').addEventListener('click',e=>{
  const button=e.target.closest('[data-filter]');if(!button)return;
  $$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  renderArchive(button.dataset.filter);sfx.click();
});

const dialog=$('#project-dialog');
let dialogTrigger;
function openProject(id,trigger) {
  const p=PROJECTS.find(project=>project.id===id);if(!p)return;
  const detail=PROJECT_DETAILS[id];
  $('#dialog-content').innerHTML=`<div class="eyebrow">PROJECT ${p.index} <span>/</span> ${escapeHTML(p.kind).toUpperCase()}</div><h2 id="dialog-title">${escapeHTML(p.name)}</h2><p>${escapeHTML(p.tagline)}</p>${tags(p.stack)}<h3>INSIDE THE BUILD</h3><ul class="detail-list">${detail.highlights.map(text=>`<li>${escapeHTML(text)}</li>`).join('')}</ul><div class="dialog-status"><strong>${escapeHTML(p.status).toUpperCase()}</strong><br>${escapeHTML(detail.note)}</div><div class="dialog-links">${p.repo?`<a class="button button-red" href="${p.repo}" target="_blank" rel="noopener noreferrer">View source <span aria-hidden="true">↗</span></a>`:''}<a class="button button-outline" href="#arsenal" data-dialog-arsenal="${p.deps[0]}">Explore the stack <span aria-hidden="true">↓</span></a></div><p class="dialog-provenance">${escapeHTML(detail.source)}</p>`;
  dialogTrigger=trigger;dialog.showModal();document.body.classList.add('dialog-open');sfx.click();
}
document.addEventListener('click',e=>{const trigger=e.target.closest('[data-project]');if(trigger)openProject(trigger.dataset.project,trigger);});
$('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{
  if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}
  const link=e.target.closest('[data-dialog-arsenal]');
  if(link){const skill=SKILLS.find(s=>s[0]===link.dataset.dialogArsenal);if(skill)selectDomain(CATS.findIndex(c=>c.id===skill[2]));dialog.close();requestAnimationFrame(()=>$('#arsenal').scrollIntoView({behavior:paused?'instant':'smooth'}));}
});
dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');dialogTrigger?.focus({preventScroll:true});});

const core = createCore($('#core-canvas'), {isPaused:()=>paused,onUnavailable:()=>{
  $('#core-fallback').hidden=false;$('#core-canvas').hidden=true;$('#reset-core').disabled=true;$('#core-hint').textContent='STATIC VIEW · EXPLORE THE DOMAINS';
}});
$('#reset-core').addEventListener('click',()=>core.reset());
if(matchMedia('(pointer:coarse)').matches)$('#core-hint').textContent=core.available?'SELECT A DOMAIN · SCROLL TO CONTINUE':'STATIC VIEW · EXPLORE THE DOMAINS';
$('#domain-tabs').innerHTML=CATS.map((c,i)=>`<button type="button" role="tab" id="tab-${c.id}" class="domain-tab" aria-controls="domain-panel" aria-selected="${i===0}" tabindex="${i===0?'0':'-1'}" data-domain="${i}"><span class="domain-idx">0${i+1}</span><strong>${escapeHTML(c.label)}</strong><span class="domain-count">${String(SKILLS.filter(s=>s[2]===c.id).length).padStart(2,'0')}</span><span class="domain-plus" aria-hidden="true">${i===0?'−':'+'}</span></button>`).join('');
function selectDomain(index,focus=false) {
  const c=CATS[index];if(!c)return;
  const skills=SKILLS.filter(s=>s[2]===c.id);
  $$('[data-domain]').forEach((button,i)=>{button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;button.querySelector('.domain-plus').textContent=i===index?'−':'+';if(focus&&i===index)button.focus();});
  $('#domain-panel').setAttribute('aria-labelledby',`tab-${c.id}`);
  const connected=PROJECTS.filter(p=>p.deps.some(dep=>skills.some(s=>s[0]===dep)));
  $('#domain-panel').innerHTML=`<p>${escapeHTML(DOMAIN_COPY[c.id])}</p><ul class="skill-tags">${skills.map(s=>`<li>${escapeHTML(s[1])}</li>`).join('')}</ul><p class="domain-projects">IN PRACTICE → <a href="#work">${connected.length} connected projects</a></p>`;
  $('#core-code').textContent=`${c.code} / 0${index+1}`;core.setDomain(c.color);
}
selectDomain(0);
$('#domain-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-domain]');if(b){selectDomain(Number(b.dataset.domain));sfx.node();}});
$('#domain-tabs').addEventListener('keydown',e=>{
  const b=e.target.closest('[data-domain]');if(!b)return;
  let i=Number(b.dataset.domain);
  if(['ArrowDown','ArrowRight'].includes(e.key))i=(i+1)%CATS.length;
  else if(['ArrowUp','ArrowLeft'].includes(e.key))i=(i+CATS.length-1)%CATS.length;
  else if(e.key==='Home')i=0;else if(e.key==='End')i=CATS.length-1;else return;
  e.preventDefault();selectDomain(i,true);
});
$('#skill-count').textContent=`${CATS.length} DOMAINS / ${SKILLS.length} TOOLS & PRACTICES`;
$('#year').textContent=new Date().getFullYear();

const menuToggle=$('#menu-toggle'),menu=$('#mobile-menu');
function closeMenu(){menu.hidden=true;menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation');}
menuToggle.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
menu.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){closeMenu();menuToggle.focus();}});
matchMedia('(min-width: 761px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

// Ambient audio is always opt-in for each visit, even if an older portfolio
// version stored a preference. It also suspends when the page is hidden.
let wantedSound=false;
$('#sound-toggle').addEventListener('click',()=>{
  wantedSound=!wantedSound;setMuted(!wantedSound);
  $('#sound-toggle').setAttribute('aria-pressed',String(wantedSound));
  $('#sound-label').textContent=wantedSound?'SOUND ON':'SOUND OFF';
  if(wantedSound)sfx.toggle();
});

const hero=$('.hero'),art=$('.hero-art'),emberCanvas=$('#embers'),ctx=emberCanvas.getContext('2d');
let heroVisible=true,coreVisible=false,raf=0,lastFrame=0,sceneTime=0,pointerX=0,pointerY=0,smoothX=0,smoothY=0,heroWidth=1,heroHeight=1;
const motes=Array.from({length:38},(_,i)=>({x:((i*137.508)%997)/997,y:((i*71.81)%991)/991,z:.25+((i*39.7)%100)/100}));
function resizeHero(){heroWidth=hero.clientWidth;heroHeight=hero.clientHeight;const dpr=Math.min(devicePixelRatio||1,1.5);emberCanvas.width=Math.round(heroWidth*dpr);emberCanvas.height=Math.round(heroHeight*dpr);ctx?.setTransform(dpr,0,0,dpr,0,0);paintEmbers();}
function paintEmbers(){if(!ctx)return;ctx.clearRect(0,0,heroWidth,heroHeight);for(const p of motes){const x=((p.x*heroWidth+sceneTime*9*p.z)%heroWidth)-smoothX*18*p.z;const y=(p.y*heroHeight-sceneTime*16*p.z%heroHeight+heroHeight)%heroHeight-smoothY*13*p.z;ctx.fillStyle=`rgba(242,94,67,${.12+p.z*.26})`;ctx.fillRect(x,y,1+p.z,2+p.z*2);}}
new ResizeObserver(resizeHero).observe(hero);
hero.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;pointerX=(e.clientX/heroWidth-.5)*2;pointerY=(e.clientY/heroHeight-.5)*2;},{passive:true});
hero.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;});
function frame(timestamp){
  raf=0;if(paused||document.hidden)return;
  const delta=Math.min((timestamp-lastFrame)/1000,.04)||0;lastFrame=timestamp;sceneTime+=delta;
  if(heroVisible){smoothX+=(pointerX-smoothX)*.04;smoothY+=(pointerY-smoothY)*.04;art.style.transform=`scale(1.045) translate(${-smoothX*10}px,${-smoothY*7+Math.min(scrollY,heroHeight)*.1}px)`;paintEmbers();}
  if(coreVisible)core.frame(timestamp);
  if(heroVisible||coreVisible)raf=requestAnimationFrame(frame);
}
function startFrames(){if(!raf&&!paused&&!document.hidden&&(heroVisible||coreVisible)){lastFrame=performance.now();raf=requestAnimationFrame(frame);}}
new IntersectionObserver(entries=>{for(const entry of entries){if(entry.target===hero)heroVisible=entry.isIntersecting;else coreVisible=entry.isIntersecting;}startFrames();}).observe(hero);
new IntersectionObserver(entries=>{coreVisible=entries[0].isIntersecting;startFrames();}).observe($('#arsenal'));
function syncMotion(){
  paused=motionQuery.matches||userPaused;document.documentElement.classList.toggle('motion-paused',paused);
  const button=$('#motion-toggle');button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-disabled',String(motionQuery.matches));button.setAttribute('aria-label',motionQuery.matches?'Animations disabled by system preference':paused?'Resume animations':'Pause animations');button.querySelector('.motion-icon').textContent=paused?'▷':'Ⅱ';
  if(paused){cancelAnimationFrame(raf);raf=0;art.style.transform='';document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).forEach(a=>a.finish());}else startFrames();
}
$('#motion-toggle').addEventListener('click',()=>{if(motionQuery.matches)return;userPaused=!userPaused;try{localStorage.setItem('midnight-motion-paused',userPaused?'1':'0');}catch{}syncMotion();});
motionQuery.addEventListener('change',syncMotion);
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;if(wantedSound)setMuted(true);}else{if(wantedSound)setMuted(false);startFrames();}});
syncMotion();
let scrollScheduled=false;
function updateProgress(){const distance=document.documentElement.scrollHeight-innerHeight;$('.reading-progress i').style.transform=`scaleX(${distance>0?Math.min(scrollY/distance,1):0})`;scrollScheduled=false;}
window.addEventListener('scroll',()=>{if(!scrollScheduled){scrollScheduled=true;requestAnimationFrame(updateProgress);}},{passive:true});
window.addEventListener('resize',updateProgress,{passive:true});updateProgress();

if(matchMedia('(pointer:fine)').matches){
  $$('.project-cover').forEach(card=>{
    card.addEventListener('pointermove',e=>{if(paused)return;const r=card.getBoundingClientRect();card.style.setProperty('--rx',`${(.5-(e.clientY-r.top)/r.height)*5}deg`);card.style.setProperty('--ry',`${((e.clientX-r.left)/r.width-.5)*6}deg`);});
    card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');});
  });
}
if(!paused){
  [$('.hero-copy .eyebrow'),$('#hero-title'),$('.hero-intro'),$('.hero-copy .button')].forEach((element,i)=>element.animate([{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}],{duration:850,delay:100+i*130,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
}
