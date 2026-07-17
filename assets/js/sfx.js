// Web Audio: short UI SFX + a generative ambient bed (backsound).
// Zero audio files. Muted by default; starts on first user gesture.

let ctx = null;
let muted = true;
let ambient = null;
const listeners = new Set();

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

export function isMuted() { return muted; }

export function initMute() {
  try {
    const v = localStorage.getItem("sfx-muted");
    if (v !== null) muted = v === "1";
  } catch (e) {}
}

export function onMute(l) { listeners.add(l); return () => listeners.delete(l); }

export function setMuted(m) {
  muted = m;
  try { localStorage.setItem("sfx-muted", m ? "1" : "0"); } catch (e) {}
  const c = ac();
  if (!m) {
    c?.resume?.();
    startAmbient();
  } else {
    stopAmbient();
  }
  listeners.forEach((l) => l(m));
}

// ---------- short UI blips ----------
function blip(freq, dur, type = "sine", gain = 0.04) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  const t = c.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

export const sfx = {
  hover: () => blip(880, 0.05, "sine", 0.01),
  click: () => { blip(520, 0.05, "square", 0.025); setTimeout(() => blip(760, 0.07, "square", 0.018), 40); },
  boot: () => blip(300, 0.09, "sawtooth", 0.014),
  node: () => blip(1040, 0.04, "triangle", 0.016),
  toggle: () => blip(1200, 0.08, "triangle", 0.028),
};

// ---------- generative ambient bed ----------
function startAmbient() {
  const c = ac();
  if (!c || ambient) return;

  const master = c.createGain();
  master.gain.setValueAtTime(0.0001, c.currentTime);
  master.gain.exponentialRampToValueAtTime(0.11, c.currentTime + 4);
  master.connect(c.destination);

  const filt = c.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.value = 620;
  filt.Q.value = 5;
  filt.connect(master);

  // slow filter sweep (breathing)
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.055;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 360;
  lfo.connect(lfoGain).connect(filt.frequency);
  lfo.start();

  // detuned drone stack (A1 / E2 / A2 / E3)
  const freqs = [55, 82.41, 110, 164.81];
  const oscs = freqs.map((f, i) => {
    const o = c.createOscillator();
    o.type = i % 2 ? "triangle" : "sine";
    o.frequency.value = f;
    o.detune.value = (i - 1.5) * 5;
    const og = c.createGain();
    og.gain.value = 0.28 / (i + 1);
    o.connect(og).connect(filt);
    o.start();
    return o;
  });

  // airy noise wash
  const buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * 0.5;
  const noise = c.createBufferSource();
  noise.buffer = buf; noise.loop = true;
  const nf = c.createBiquadFilter();
  nf.type = "bandpass"; nf.frequency.value = 1400; nf.Q.value = 0.6;
  const ng = c.createGain(); ng.gain.value = 0.02;
  noise.connect(nf).connect(ng).connect(master);
  noise.start();

  ambient = { master, filt, lfo, oscs, noise, timer: 0 };

  // sparse bell tones (pentatonic), evolving
  const scale = [440, 523.25, 587.33, 659.25, 783.99, 880];
  const bell = () => {
    if (!ambient) return;
    if (!muted && Math.random() < 0.75) {
      const f = scale[Math.floor(Math.random() * scale.length)] * (Math.random() < 0.25 ? 2 : 1);
      const o = c.createOscillator();
      o.type = "sine"; o.frequency.value = f;
      const bg = c.createGain();
      const t = c.currentTime;
      bg.gain.setValueAtTime(0.0001, t);
      bg.gain.exponentialRampToValueAtTime(0.045, t + 0.03);
      bg.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);
      o.connect(bg).connect(master);
      o.start(t); o.stop(t + 3.6);
    }
    ambient.timer = setTimeout(bell, 3800 + Math.random() * 6500);
  };
  ambient.timer = setTimeout(bell, 2600);
}

function stopAmbient() {
  if (!ambient || !ctx) return;
  const a = ambient;
  const c = ctx;
  clearTimeout(a.timer);
  a.master.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 2);
  ambient = null;
  setTimeout(() => {
    try { a.oscs.forEach((o) => o.stop()); a.noise.stop(); a.lfo.stop(); } catch (e) {}
  }, 2200);
}
