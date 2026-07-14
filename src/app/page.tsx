export default function Page() {
  return (
    <>
      <a className="skip-link" href="#index">Skip to content</a>

      {/* OPTIONAL real video backdrop (sits behind everything).
           To use your own footage: add a <source> below, then remove the `hidden`
           attribute. Keep it muted + loop + playsinline. A procedural data-flow
           layer (js/bgflow.js) renders on top of this and works without any file. */}
      <video id="bg-video" aria-hidden="true" autoPlay muted loop playsInline hidden>
        {/* <source src="media/bg.webm" type="video/webm" /> */}
        {/* <source src="media/bg.mp4" type="video/mp4" /> */}
      </video>
      <canvas id="bg-flow" aria-hidden="true"></canvas>
      <canvas id="graph" aria-hidden="true"></canvas>
      <div id="vignette" aria-hidden="true"></div>
      <div id="scrim" aria-hidden="true"></div>
      <div id="bars" aria-hidden="true"><i className="bar-top"></i><i className="bar-bot"></i></div>
      <div id="graph-tip" aria-hidden="true"></div>
      <div id="cur-dot" aria-hidden="true"></div>
      <div id="cur-ring" aria-hidden="true"></div>

      <div id="boot" aria-hidden="true">
        <pre id="boot-log"></pre>
        <div className="boot-skip">press any key / tap to skip</div>
      </div>

      <nav id="topnav">
        <div className="nav-inner">
          <a className="logo" href="#boot-sec">hosea<span>.dev</span></a>
          <ul className="nav-links">
            <li><a href="#index">index</a></li>
            <li><a href="#modules">modules</a></li>
            <li><a href="#builds">builds</a></li>
            <li><a href="#log">log</a></li>
            <li><a className="deploy-link" href="#deploy">deploy</a></li>
          </ul>
        </div>
      </nav>

      <main>

      {/* ============ STAGE 0 : BOOT ============ */}
      <section className="stage" id="boot-sec" data-cam='{"pos":[0,12,130],"alpha":1}'>
        <div className="stage-inner hero-grid">
          <div className="hero-copy reveal">
            <div className="stage-tag">[ stage 0/5 : boot ] — system power-on</div>
            <h1 id="hero-title">Hosea Oktarivanes<br />Ferdinan Sinaga<span className="caret">_</span></h1>
            <p className="roles mono">Informatics Engineering Student · Web Developer · Network Engineer</p>
            <p className="hero-sub">This page is a system. Every skill is a node, every project is a build linked to the modules it actually uses. Scroll to fly through the dependency graph.</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#builds">Explore the builds</a>
              <a className="btn btn-ghost" href="https://github.com/SirHosen" target="_blank" rel="noopener noreferrer">github.com/SirHosen ↗</a>
            </div>
            <p className="scroll-hint mono">scroll ↓ to boot the system</p>
          </div>
          <div className="term reveal" aria-label="whoami terminal">
            <div className="term-bar"><i></i><i></i><i></i><em>hosea@system:~$</em></div>
            <div className="term-body">
      <div><span className="pr">$</span> ./whoami --verbose</div>
      <div><span className="k">name     :</span> "Hosea Oktarivanes Ferdinan Sinaga"</div>
      <div><span className="k">roles    :</span> [ web_developer, network_engineer ]</div>
      <div><span className="k">stack    :</span> [ laravel, next.js, vue, python ]</div>
      <div><span className="k">network  :</span> [ mikrotik:MTCNA, cisco ]</div>
      <div><span className="k">location :</span> "Kota Bekasi, Jawa Barat, ID"</div>
      <div><span className="k">status   :</span> open_to_work → internship | freelance</div>
      <div><span className="pr">$</span> <span className="cursor"></span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STAGE 1 : INDEX ============ */}
      <section className="stage" id="index" data-cam='{"pos":[16,6,66],"alpha":1}'>
        <div className="stage-inner">
          <div className="col col-right">
            <div className="stage-head reveal">
              <div className="stage-tag">[ stage 1/5 : index ] — reading the center node</div>
              <h2>About</h2>
            </div>
            <div className="panel reveal">
              <p>I'm an <strong>Informatics Engineering student</strong> at Universitas Bina Sarana Informatika with hands-on experience across <strong>full-stack web development, network engineering, and applied cybersecurity</strong>.</p>
              <p>I build and ship real applications with modern frameworks like <strong>Laravel, Next.js, and Vue.js</strong>, use <strong>Python</strong> for automation and data-driven tools, and I'm equally at home configuring and troubleshooting networks on <strong>MikroTik and Cisco</strong> equipment.</p>
              <p>My focus: turning practical problems into <strong>reliable, well-tested software</strong> — with a habit of documenting and reviewing code carefully. Outside of coursework, I mentor peers on programming and Linux, and explore cybersecurity and emerging web technologies.</p>
            </div>
            <div className="panel log-panel mono reveal" aria-label="system stats">
      <div className="pr">$ system --stats</div>
      <div><span className="ok">[ OK ]</span> gpa .............. 3.74 / 4.00</div>
      <div><span className="ok">[ OK ]</span> projects ......... 8 shipped</div>
      <div><span className="ok">[ OK ]</span> certifications ... 4 verified</div>
      <div><span className="ok">[ OK ]</span> largest_build .... ~13,500 lines / 75 modules</div>
      <div><span className="ok">[ OK ]</span> test_suite ....... 29/29 passing</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STAGE 2 : MODULES ============ */}
      <section className="stage" id="modules" data-cam='{"pos":[-56,18,86],"alpha":1}'>
        <div className="stage-inner">
          <div className="col col-left wide">
            <div className="stage-head reveal">
              <div className="stage-tag">[ stage 2/5 : modules ] — loading skill graph, 6 groups / 38 nodes</div>
              <h2>Modules</h2>
              <p className="stage-sub">Hover a module to trace it through the graph — which hub it belongs to, and which builds depend on it.</p>
            </div>
            <div className="module-grid">
              <div className="panel module reveal" data-cat="cat-lang">
                <h3><span className="m-ico" data-ico="cat-lang"></span>Languages <code>7 nodes</code></h3>
                <div className="chips">
                  <button className="chip" data-node="php">PHP</button>
                  <button className="chip" data-node="jsts">JavaScript / TypeScript</button>
                  <button className="chip" data-node="python">Python</button>
                  <button className="chip" data-node="java">Java</button>
                  <button className="chip" data-node="dart">Dart</button>
                  <button className="chip" data-node="sql">SQL</button>
                  <button className="chip" data-node="htmlcss">HTML / CSS</button>
                </div>
              </div>
              <div className="panel module reveal" data-cat="cat-web">
                <h3><span className="m-ico" data-ico="cat-web"></span>Web &amp; Frameworks <code>7 nodes</code></h3>
                <div className="chips">
                  <button className="chip" data-node="laravel">Laravel</button>
                  <button className="chip" data-node="nextjs">Next.js (App Router)</button>
                  <button className="chip" data-node="vue">Vue.js</button>
                  <button className="chip" data-node="alpine">Alpine.js</button>
                  <button className="chip" data-node="flutter">Flutter</button>
                  <button className="chip" data-node="tailwind">Tailwind CSS</button>
                  <button className="chip" data-node="django">Django (learning)</button>
                </div>
              </div>
              <div className="panel module reveal" data-cat="cat-db">
                <h3><span className="m-ico" data-ico="cat-db"></span>Databases <code>6 nodes</code></h3>
                <div className="chips">
                  <button className="chip" data-node="mysql">MySQL / MariaDB</button>
                  <button className="chip" data-node="postgres">PostgreSQL</button>
                  <button className="chip" data-node="supabase">Supabase</button>
                  <button className="chip" data-node="sqlite">SQLite</button>
                  <button className="chip" data-node="erd">ERD / LRS design</button>
                  <button className="chip" data-node="prisma">Prisma ORM</button>
                </div>
              </div>
              <div className="panel module reveal" data-cat="cat-net">
                <h3><span className="m-ico" data-ico="cat-net"></span>Networking <code>5 nodes</code></h3>
                <div className="chips">
                  <button className="chip" data-node="mikrotik">MikroTik (MTCNA)</button>
                  <button className="chip" data-node="cisco">Cisco</button>
                  <button className="chip" data-node="lanwlan">LAN / WLAN configuration</button>
                  <button className="chip" data-node="qos">QoS</button>
                  <button className="chip" data-node="cabling">Cabling &amp; troubleshooting</button>
                </div>
              </div>
              <div className="panel module reveal" data-cat="cat-sys">
                <h3><span className="m-ico" data-ico="cat-sys"></span>Systems &amp; Tools <code>7 nodes</code></h3>
                <div className="chips">
                  <button className="chip" data-node="windows">Windows (advanced)</button>
                  <button className="chip" data-node="linux">Linux (Arch, Ubuntu)</button>
                  <button className="chip" data-node="git">Git / GitHub</button>
                  <button className="chip" data-node="pm2">PM2</button>
                  <button className="chip" data-node="nginx">Nginx</button>
                  <button className="chip" data-node="tasksched">Task Scheduler</button>
                  <button className="chip" data-node="systemd">systemd</button>
                </div>
              </div>
              <div className="panel module reveal" data-cat="cat-prac">
                <h3><span className="m-ico" data-ico="cat-prac"></span>Practices <code>6 nodes</code></h3>
                <div className="chips">
                  <button className="chip" data-node="fullstack">Full-stack development</button>
                  <button className="chip" data-node="rest">REST APIs</button>
                  <button className="chip" data-node="scrum">Scrum</button>
                  <button className="chip" data-node="rad">RAD</button>
                  <button className="chip" data-node="codereview">Code review &amp; auditing</button>
                  <button className="chip" data-node="blackbox">Black-box testing</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STAGE 3 : BUILDS ============ */}
      <section className="stage" id="builds" data-cam='{"pos":[58,-10,104],"alpha":1}'>
        <div className="stage-inner">
          <div className="col col-right wide">
            <div className="stage-head reveal">
              <div className="stage-tag">[ stage 3/5 : builds ] — linking 8 builds to their real dependencies</div>
              <h2>Builds</h2>
              <p className="stage-sub">Each build is a cluster node in the graph, wired to the exact modules it uses. Open one to inspect it.</p>
            </div>
            <div className="build-grid">
              <button className="card reveal" data-project="p-spin">
                <h3>Spin Wheel Probability Lab</h3><span className="type">Personal</span>
                <p>Probabilistic modeling desktop app — ensemble prediction engine, 29/29 tests passing.</p>
                <span className="card-meta mono">4 deps · python · sql · rest · review</span>
                <span className="open mono">open build →</span>
              </button>
              <button className="card reveal" data-project="p-rumah">
                <h3>Rumah Pemuridan</h3><span className="type">Web Project</span>
                <p>Content management website on Next.js App Router + Supabase, secured with RLS.</p>
                <span className="card-meta mono">4 deps · ts · next.js · supabase · postgres</span>
                <span className="open mono">open build →</span>
              </button>
              <button className="card reveal" data-project="p-restoran">
                <h3>Restoran Nusantara</h3><span className="type">Web Project</span>
                <p>Restaurant &amp; reservation platform on Laravel 10 with role-based admin dashboard.</p>
                <span className="card-meta mono">6 deps · php · laravel · mysql · +3</span>
                <span className="open mono">open build →</span>
              </button>
              <button className="card reveal" data-project="p-price">
                <h3>Price &amp; Stock Monitoring Service</h3><span className="type">Freelance</span>
                <p>24/7 competitor price &amp; stock monitor with real-time Telegram alerts.</p>
                <span className="card-meta mono">3 deps · python · task scheduler · systemd</span>
                <span className="open mono">open build →</span>
              </button>
              <button className="card reveal" data-project="p-sonic">
                <h3>SonicCipher</h3><span className="type">Personal</span>
                <p>Text → encrypted audio via custom Frequency-Shift Audio Encryption (FSAE).</p>
                <span className="card-meta mono">2 deps · python · systems &amp; tools</span>
                <span className="open mono">open build →</span>
              </button>
              <button className="card reveal" data-project="p-sonorus">
                <h3>Sonorus</h3><span className="type">Academic</span>
                <p>Classical music streaming website in Laravel — auth, streaming, database management.</p>
                <span className="card-meta mono">3 deps · php · laravel · mysql</span>
                <span className="open mono">open build →</span>
              </button>
              <button className="card reveal" data-project="p-coop">
                <h3>Cooperative Management System</h3><span className="type">Freelance</span>
                <p>Web-based cooperative management — members, transactions, reporting — delivered with Scrum.</p>
                <span className="card-meta mono">2 deps · scrum · full-stack</span>
                <span className="open mono">open build →</span>
              </button>
              <button className="card reveal" data-project="p-auto">
                <h3>Automotive Production Scheduler</h3><span className="type">Freelance</span>
                <p>Automated scheduling with optimization algorithms for an automotive production workflow.</p>
                <span className="card-meta mono">2 deps · rad · full-stack</span>
                <span className="open mono">open build →</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STAGE 4 : LOG ============ */}
      <section className="stage" id="log" data-cam='{"pos":[0,64,155],"alpha":0.3}'>
        <div className="stage-inner">
          <div className="col col-left wide">
            <div className="stage-head reveal">
              <div className="stage-tag">[ stage 4/5 : log ] — git log --graph --all, 3 branches</div>
              <h2>Commit Log</h2>
              <p className="stage-sub mono"><span className="lg-work">● work</span>&nbsp;&nbsp;<span className="lg-edu">● education</span>&nbsp;&nbsp;<span className="lg-cert">● certification</span></p>
            </div>
            <div className="panel commits reveal">
              <div className="commit" data-branch="work">
                <div className="rail"><span className="dot dot-work"></span></div>
                <div className="c-body">
                  <div className="c-line mono"><span className="hash h-work">f7a2e1c</span> <span className="refs">(work)</span></div>
                  <div className="c-msg">Warehouse Associate (Part-time) — JNT Express</div>
                  <div className="c-meta mono">Feb 2025 – Mar 2025 · package sorting &amp; warehouse operations in a fast-paced logistics environment</div>
                </div>
              </div>
              <div className="commit" data-branch="cert">
                <div className="rail"><span className="dot dot-cert"></span></div>
                <div className="c-body">
                  <div className="c-line mono"><span className="hash h-cert">b3d94af</span> <span className="refs">(cert)</span></div>
                  <div className="c-msg">MikroTik Certified Network Associate (MTCNA)</div>
                  <div className="c-meta mono">issuer: MikroTik</div>
                </div>
              </div>
              <div className="commit" data-branch="cert">
                <div className="rail"><span className="dot dot-cert"></span></div>
                <div className="c-body">
                  <div className="c-line mono"><span className="hash h-cert">9c1e5b7</span> <span className="refs">(cert)</span></div>
                  <div className="c-msg">Network and Computer Systems Technician</div>
                  <div className="c-meta mono">issuer: Badan Nasional Sertifikasi Profesi (BNSP)</div>
                </div>
              </div>
              <div className="commit" data-branch="cert">
                <div className="rail"><span className="dot dot-cert"></span></div>
                <div className="c-body">
                  <div className="c-line mono"><span className="hash h-cert">5eaf208</span> <span className="refs">(cert)</span></div>
                  <div className="c-msg">Intermediate Computer Operator</div>
                  <div className="c-meta mono">issuer: Badan Nasional Sertifikasi Profesi (BNSP)</div>
                </div>
              </div>
              <div className="commit" data-branch="cert">
                <div className="rail"><span className="dot dot-cert"></span></div>
                <div className="c-body">
                  <div className="c-line mono"><span className="hash h-cert">d47c91e</span> <span className="refs">(cert)</span></div>
                  <div className="c-msg">PCAP: Programming Essentials in Python</div>
                  <div className="c-meta mono">issuer: Cisco Networking Academy</div>
                </div>
              </div>
              <div className="commit" data-branch="edu">
                <div className="rail"><span className="dot dot-edu"></span></div>
                <div className="c-body">
                  <div className="c-line mono"><span className="hash h-edu">a3f74c2</span> <span className="refs">(HEAD → education)</span></div>
                  <div className="c-msg">Bachelor of Informatics Engineering — Universitas Bina Sarana Informatika</div>
                  <div className="c-meta mono">2022 – Present · GPA 3.74/4.00 · specialization: Information Technology</div>
                </div>
              </div>
              <div className="commit" data-branch="work">
                <div className="rail"><span className="dot dot-work"></span></div>
                <div className="c-body">
                  <div className="c-line mono"><span className="hash h-work">7b825d3</span> <span className="refs">(work)</span></div>
                  <div className="c-msg">IT Intern — PT Nusa Komputer</div>
                  <div className="c-meta mono">May 2020 – Jun 2020 · PC assembly · network cabling · technical content · customer service</div>
                </div>
              </div>
              <div className="commit" data-branch="edu">
                <div className="rail"><span className="dot dot-edu"></span></div>
                <div className="c-body">
                  <div className="c-line mono"><span className="hash h-edu">2c90ef4</span> <span className="refs">(education) <span className="init">← init</span></span></div>
                  <div className="c-msg">Computer &amp; Network Engineering — SMK Karya Guna Bhakti II</div>
                  <div className="c-meta mono">2019 – 2022 · vocational: computer hardware &amp; network infrastructure</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STAGE 5 : DEPLOY ============ */}
      <section className="stage" id="deploy" data-cam='{"pos":[0,10,190],"alpha":0.5}'>
        <div className="stage-inner">
          <div className="deploy-box reveal">
            <div className="stage-tag">[ stage 5/5 : deploy ] — all checks passed, ready to ship</div>
            <h2>Deploy to production<span className="accent">.</span></h2>
            <p className="deploy-sub">Whether it's a full-stack web app, a network that just works, or an automation that runs 24/7 — the system is ready.</p>
            <div className="panel log-panel mono deploy-term">
      <div className="pr">$ hosea deploy --contact</div>
      <div><span className="ok">[ OK ]</span> channel: email → hoseaoktarivanes@gmail.com</div>
      <div><span className="ok">[ OK ]</span> channel: github → github.com/SirHosen</div>
      <div><span className="ok">[ OK ]</span> channel: phone → +62 857-7111-5132</div>
            </div>
            <div className="hero-actions center">
              <a className="btn btn-primary" href="mailto:hoseaoktarivanes@gmail.com">hoseaoktarivanes@gmail.com</a>
              <a className="btn btn-ghost" href="https://github.com/SirHosen" target="_blank" rel="noopener noreferrer">github.com/SirHosen ↗</a>
            </div>
            <p className="deploy-meta mono">Kota Bekasi, Jawa Barat, Indonesia</p>
          </div>
        </div>
      </section>

      </main>

      <footer>
        <div className="foot">
          <span>© 2026 Hosea Oktarivanes Ferdinan Sinaga</span>
          <span className="mono">mentoring peers on programming &amp; linux · cybersecurity research · open source · music · fishing · gaming</span>
          <span className="mono">no build step — deploys anywhere</span>
        </div>
      </footer>

      <div className="modal-backdrop" id="modal-backdrop" hidden>
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <button className="modal-close" id="modal-close" aria-label="Close build details">×</button>
          <div id="modal-body"></div>
        </div>
      </div>
    </>
  );
}
