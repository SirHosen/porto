"use client";

import ScriptLoader from "@/app/ScriptLoader";
import HeroAnimated from "@/components/HeroAnimated";
import LoadingScreen from "@/components/LoadingScreen";
import PremiumEffects from "@/components/PremiumEffects";
import SkillConstellation from "@/components/SkillConstellation";

const modules = [
  { id: "cat-lang", title: "Languages", items: [["python","Python"],["jsts","TypeScript / JavaScript"],["php","PHP"],["sql","SQL / PLpgSQL"],["htmlcss","HTML / CSS"],["shell","Shell / Batch"],["json","JSON / Config Schema"]] },
  { id: "cat-web", title: "Web & Product", items: [["nextjs","Next.js App Router"],["react","React"],["laravel","Laravel"],["tailwind","Tailwind CSS"],["supabase","Supabase"],["rest","REST APIs"],["a11y","Accessibility & SEO"]] },
  { id: "cat-ai", title: "Data & AI", items: [["pytorch","PyTorch"],["opencv","OpenCV & OCR"],["lstm","LSTM"],["bayes","Bayesian Inference"],["stats","Statistical Validation"],["numpy","Scientific Python"],["signal","Signal Processing"]] },
  { id: "cat-auto", title: "Automation", items: [["selenium","Selenium"],["playwright","Playwright"],["scraping","Web Scraping"],["concurrency","Async & Concurrency"],["scheduler","Background Jobs"],["notify","Webhooks & Alerts"],["config","Config-driven Engines"]] },
  { id: "cat-sys", title: "Systems & Network", items: [["linux","Linux"],["windows","Windows"],["git","Git / GitHub"],["mikrotik","MikroTik / MTCNA"],["cisco","Cisco"],["lanwlan","LAN / WLAN"],["http","HTTP / Proxy Networking"]] },
  { id: "cat-prac", title: "Engineering", items: [["architecture","Modular Architecture"],["testing","Automated Testing"],["database","MySQL / PostgreSQL / SQLite"],["security","Auth, RLS & Secure Config"],["prompt","Prompt Engineering"],["aiworkflow","AI-assisted Development"],["docs","Technical Documentation"]] },
];

const builds = [
  { id:"p-nestfetch", title:"NESTfetch", type:"Python Platform", desc:"Config-driven multi-site scraping engine with async I/O, history, dashboard and tests.", meta:"python · scraping · async · sqlite · testing", featured:true },
  { id:"p-gamenest", title:"GameNest", type:"Full-stack", desc:"Production Next.js catalog with Supabase CMS, protected admin, accessibility and SEO.", meta:"typescript · next.js · supabase · postgres", featured:true },
  { id:"p-spin", title:"Spinwheel AI Lab", type:"Applied ML", desc:"Computer-vision data pipeline with Bayesian analysis and honest walk-forward ML evaluation.", meta:"pytorch · opencv · bayesian · statistics", featured:true },
  { id:"p-sonorus", title:"Sonorus", type:"Laravel", desc:"Classical music streaming product with roles, catalog, playlists and listening history.", meta:"php · laravel · mysql · audio" },
  { id:"p-sonic", title:"SonicCipher", type:"Desktop / Audio", desc:"Text-to-audio encoding experiment with signal visualization and modular PyQt architecture.", meta:"python · numpy · scipy · pyqt" },
  { id:"p-formqa", title:"Adaptive Form QA Harness", type:"Automation / QA", desc:"Configurable Selenium regression harness for authorized, dynamic multi-page form testing.", meta:"selenium · config · concurrency · testing" },
  { id:"p-sessionlab", title:"Browser Session Reliability Lab", type:"Systems Lab", desc:"Controlled multi-session browser and proxy reliability experiments with resilient cleanup.", meta:"selenium · threads · proxy · logging" },
  { id:"p-portfolio", title:"The Dependency Graph", type:"Creative Engineering", desc:"A cinematic portfolio where every build is wired to the modules it actually uses.", meta:"next.js · canvas · gsap · accessibility" },
];

export default function Page() {
  return <>
    <a className="skip-link" href="#index">Skip to content</a>
    <LoadingScreen /><PremiumEffects /><ScriptLoader />
    <div id="aurora-bg" aria-hidden="true"><span className="aurora-blob"/><span className="aurora-blob"/><span className="aurora-blob"/><span className="aurora-blob"/></div>
    <div id="aurora-mouse" aria-hidden="true"/><canvas id="particles-canvas" aria-hidden="true"/><div id="scroll-progress" aria-hidden="true"/>
    <canvas id="bg-flow" aria-hidden="true"/><canvas id="graph" aria-hidden="true"/><div id="vignette" aria-hidden="true"/><div id="scrim" aria-hidden="true"/>
    <div id="bars" aria-hidden="true"><i className="bar-top"/><i className="bar-bot"/></div><div id="graph-tip" aria-hidden="true"/><div id="cur-dot" aria-hidden="true"/><div id="cur-ring" aria-hidden="true"/>
    <div id="boot" aria-hidden="true" hidden><pre id="boot-log"/><div className="boot-skip">press any key / tap to skip</div></div>

    <nav id="topnav"><div className="nav-inner"><a className="logo" href="#boot-sec">hosea<span>.dev</span></a><ul className="nav-links">
      <li><a href="#index">index</a></li><li><a href="#modules">modules</a></li><li><a href="#builds">builds</a></li><li><a href="#log">proof</a></li><li><a className="deploy-link" href="#deploy">deploy</a></li>
    </ul></div></nav>

    <main>
      <section className="stage" id="boot-sec" data-cam='{"pos":[0,12,130],"alpha":1}'><div className="stage-inner hero-grid"><HeroAnimated/></div></section>

      <section className="stage" id="index" data-cam='{"pos":[16,6,66],"alpha":1}'><div className="stage-inner"><div className="col col-right">
        <div className="stage-head reveal"><div className="stage-tag">[ stage 1/5 : index ] — operator profile</div><h2>Builds systems.<br/><span className="outline-text">Ships outcomes.</span></h2></div>
        <div className="panel reveal profile-panel"><p className="profile-lead">IT generalist with a strong Python core.</p><p>Full-stack products, automation platforms, applied AI, desktop tools and network systems — engineered to be modular, testable and deployable.</p>
          <div className="capability-strip" aria-label="Core capabilities"><span>PYTHON</span><span>FULL-STACK</span><span>AUTOMATION</span><span>APPLIED AI</span><span>NETWORKS</span></div>
        </div>
        <div className="panel log-panel mono reveal" aria-label="system stats"><div className="pr">$ system --proof</div><div><span className="ok">[ OK ]</span> public_builds ...... 8</div><div><span className="ok">[ OK ]</span> skill_modules ...... 42</div><div><span className="ok">[ OK ]</span> domains ............ web / ai / automation / network</div><div><span className="ok">[ OK ]</span> operating_mode ..... build → test → ship</div></div>
      </div></div></section>

      <section className="stage" id="modules" data-cam='{"pos":[-56,18,86],"alpha":1}'><div className="stage-inner"><div className="col col-left wide">
        <div className="stage-head reveal"><div className="stage-tag">[ stage 2/5 : modules ] — 6 domains / 42 nodes</div><h2>Capability map</h2><p className="stage-sub">Hover a module. Trace the builds that prove it.</p></div>
        <SkillConstellation/>
        <div className="module-grid module-grid-fallback" aria-label="Skill directory">{modules.map(group => <div key={group.id} className="panel module reveal" data-cat={group.id}><h3><span className="m-ico" data-ico={group.id}/>{group.title}<code>{group.items.length} nodes</code></h3><div className="chips">{group.items.map(([id,label]) => <button key={id} className="chip" data-node={id}>{label}</button>)}</div></div>)}</div>
      </div></div></section>

      <section className="stage" id="builds" data-cam='{"pos":[58,-10,104],"alpha":1}'><div className="stage-inner"><div className="col col-right wide">
        <div className="stage-head reveal"><div className="stage-tag">[ stage 3/5 : builds ] — evidence over adjectives</div><h2>Selected builds</h2><p className="stage-sub">Real systems. Real trade-offs. Open a build for the architecture.</p></div>
        <div className="build-grid">{builds.map((b,i) => <button key={b.id} className={`card reveal ${b.featured ? "featured-build" : ""}`} data-project={b.id}><span className="build-index mono">0{i+1}</span><h3>{b.title}</h3><span className="type">{b.type}</span><p>{b.desc}</p><span className="card-meta mono">{b.meta}</span><span className="open mono">inspect build →</span></button>)}</div>
      </div></div></section>

      <section className="stage" id="log" data-cam='{"pos":[0,64,155],"alpha":0.3}'><div className="stage-inner"><div className="col col-left wide">
        <div className="stage-head reveal"><div className="stage-tag">[ stage 4/5 : proof ] — credentials & operating principles</div><h2>Proof, not noise</h2></div>
        <div className="proof-grid">
          <div className="panel proof-card reveal"><span className="proof-kicker mono">CERT_01</span><h3>MTCNA</h3><p>MikroTik Certified Network Associate.</p></div>
          <div className="panel proof-card reveal"><span className="proof-kicker mono">CERT_02</span><h3>BNSP</h3><p>Network & Computer Systems Technician.</p></div>
          <div className="panel proof-card reveal"><span className="proof-kicker mono">CERT_03</span><h3>PCAP</h3><p>Programming Essentials in Python.</p></div>
          <div className="panel proof-card reveal"><span className="proof-kicker mono">METHOD</span><h3>AI × Engineering</h3><p>Prompt engineering accelerates research and iteration. Tests, review and judgment remain the gate.</p></div>
        </div>
        <div className="panel principles reveal"><span className="mono pr">$ cat engineering-principles.txt</span><div className="principle-row"><b>01</b><span>Understand the system.</span><b>02</b><span>Automate the repetition.</span><b>03</b><span>Measure the result.</span><b>04</b><span>Document the decision.</span></div></div>
      </div></div></section>

      <section className="stage" id="deploy" data-cam='{"pos":[0,10,190],"alpha":0.5}'><div className="stage-inner"><div className="deploy-box reveal">
        <div className="stage-tag">[ stage 5/5 : deploy ] — ready for the next hard problem</div><h2>Let&apos;s build something<br/><span className="accent">worth shipping.</span></h2><p className="deploy-sub">Full-stack · Python · Automation · Applied AI · Networks</p>
        <div className="hero-actions center"><a className="btn btn-primary" href="mailto:hoseaoktarivanes@gmail.com">Start a conversation</a><a className="btn btn-ghost" href="https://github.com/SirHosen" target="_blank" rel="noopener noreferrer">Inspect GitHub ↗</a></div><p className="deploy-meta mono">Kota Bekasi, Indonesia · open to internship & freelance</p>
      </div></div></section>
    </main>

    <footer><div className="foot"><span>© 2026 Hosea Oktarivanes Ferdinan Sinaga</span><span className="mono">designed as a system · built to be inspected</span></div></footer>
    <div id="konami-overlay" role="dialog" aria-modal="true" aria-labelledby="konami-title"><div className="konami-content"><div className="mono">// hidden achievement unlocked</div><h2 id="konami-title">Developer mode activated.</h2><p>Dependency graph overclocked.</p><button id="konami-close" type="button">close sequence</button></div></div>
    <div className="modal-backdrop" id="modal-backdrop" hidden><div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button className="modal-close" id="modal-close" aria-label="Close build details">×</button><div id="modal-body"/></div></div>
  </>;
}
