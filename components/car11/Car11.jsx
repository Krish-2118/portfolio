'use client';

// Car 21 portfolio: ported from the Claude Design file "Car 11 Portfolio v3.dc.html".
import React from 'react';
import DriverPhoto from './DriverPhoto';
import IntroOverlay, { INTRO_TIMING } from './IntroOverlay';
import './car11.css';

const SECTORS = [
  { code: 'LGT', id: null }, { code: 'CAR', id: 's-car' }, { code: 'DRV', id: 's-driver' },
  { code: 'GRG', id: 's-garage' }, { code: 'STD', id: 's-standings' }, { code: 'TEL', id: 's-telemetry' }, { code: 'RAD', id: 's-radio' }
];
const PACE = { Cruise: 0.7, Spirited: 1, Race: 1.45 };
const PARTS = [
  { n: '01', kicker: 'FRONT WING', title: 'Frontend', stack: ['React', 'Next.js', 'TypeScript', 'Tailwind'], desc: 'First contact with the user. Responsive interfaces, from swipe-to-match flows to a scroll-driven fest website.', color: '#FFC72C' },
  { n: '02', kicker: 'POWER UNIT', title: 'Backend', stack: ['Node.js', 'Express', 'REST APIs'], desc: 'Where the work happens. APIs for auth, CRUD, search and AI parsing, built and tested end to end.', color: '#FFC72C' },
  { n: '03', kicker: 'ERS', title: 'Data', stack: ['MongoDB', 'PostgreSQL', 'Prisma', 'Supabase'], desc: 'Stores the energy and gives it back. Schemas and queries in MongoDB and PostgreSQL.', color: '#46f0ff' },
  { n: '04', kicker: 'HALO', title: 'Auth & access', stack: ['NextAuth', 'Firebase Auth', 'OAuth'], desc: 'Protects what matters. Google and GitHub sign-in, role-based access and row-level security.', color: '#FFC72C' },
  { n: '05', kicker: 'SENSORS & TELEMETRY', title: 'AI integration', stack: ['Gemini AI', 'RAG', 'Vector search'], desc: 'Reads the world and reports back. Gemini turns a project description into a Bill of Materials and the skills it needs.', color: '#46f0ff' }
];
// Each part card owns 0.14 of the garage scroll and holds from 0.34 to 0.84 of that band. Scroll stops through the
// garage: the opening shot, the breakdown overview, each card mid-hold, then the grid. Wheel, keys and swipes move one
// stop at a time, so a fast flick glides to the next card instead of skipping past it
const PART_STOP = k => 0.18 + 0.14 * (k + 0.6);
const HERO_STOPS = [0, 0.15, 0, 1, 2, 3, 4].map((k, i) => (i < 2 ? k : PART_STOP(k)));
const TD_SHOTS = [[6.2, 3.4, 5.6, 0, 0.7, 0.2], [2.6, 0.9, 3.8, null], [-3.0, 2.4, -2.8, null], [-3.6, 0.9, 2.0, null], [2.6, 1.6, 3.0, null], [3.0, 1.9, -2.2, null], [-1.7, 1.25, -6.4, 0, 2.0, 14]];
// Opening shot (seconds): a dim, moody close-up, then a slow pull-back into the hero orbit. The overhead key
// light starts to rise `lights` s in, just as the camera starts to pull back, and each light bank then fades up
// from its fraction of the pull, so the car is lit up progressively as the camera reveals it.
const INTRO = { hold: 2.6, total: 9.4, lights: 2.4, dim: 0.16, banks: { rim: 0.22, ring: 0.4, wall: 0.6 }, lit: 0.8 };
const pullAt = f => INTRO.hold + f * (INTRO.total - INTRO.hold);
// one light bank fading up to full from pull fraction f
const bankOn = (f, r) => { const t0 = pullAt(f); return sstep(t0, t0 + 1.2, r); };
const TEX_DIR = '/models/rb22/textures/';
const TEX = ['AC_black.png_20.png', 'AC_silver.png_17.png', 'INT_carbon_fibre2.png_6.png', 'S.png_15.png', 'carbon-fiber.png_0.png', 'clearled.png_23.png', 'disc_d.png_13.png', 'driver_color.png_19.png', 'ext_carbon_fiber_d.png_7.png', 'flat_nm.png_3.png', 'generic_main2_d.png_5.png', 'glass_da.png_11.png', 'gp21_cinture.png_18.png', 'kers_blue.png_21.png', 'rb22_LCD.png_22.png', 'rear_light_2_d.png_10.png', 'redbull_decal_da.png_12.png', 'redbull_details_d.png_2.png', 'redbull_driver_3.png_9.png', 'redbull_paint_d.png_8.png', 'redbull_steering_wheel_d.png_24.png', 'redbull_steering_wheel_decals_da.png_25.png', 'redbull_wheel_d.png_14.png'];
const PROJECTS = [
  { name: 'OmniPool', num: '01', compound: 'SOFT', cc: '#E8352B', tag: 'AI PLATFORM', desc: 'A platform where hardware makers and companies build together. Paste in a project description and Gemini AI generates its Bill of Materials and recommends the skills it needs. Behind it is a MERN backend with REST APIs for auth, CRUD, AI parsing and search. Top 100 global finalist, Google Solution Challenge 2026.', stack: ['React', 'Node.js', 'Express', 'MongoDB', 'Gemini AI', 'Tailwind CSS'], repo: 'https://github.com/Krish-2118/OMNIPOOL', livery: 'repeating-linear-gradient(118deg,#FFC72C 0 26px,#0d0e10 26px 34px)' },
  { name: 'DistrictEye', num: '02', compound: 'MEDIUM', cc: '#F5D90A', tag: 'POLICE DASHBOARD', desc: 'A performance dashboard for Odisha Police districts. Admins upload CSV or Excel reports, and the dashboard tracks NBW execution, conviction ratio, narcotics seizures and missing persons traced. It ranks districts on a leaderboard and writes plain-language AI insights. Role-based access keeps uploads to admins.', stack: ['Next.js', 'TypeScript', 'Firebase', 'Tailwind CSS'], repo: 'https://github.com/Krish-2118/project-safety', live: 'https://project-safety-two.vercel.app/', livery: 'linear-gradient(100deg,#2448C9 0 52%,#F1F0EB 52% 58%,#2448C9 58% 76%,#0d0e10 76%)' },
  { name: 'ProjectMatch', num: '03', compound: 'HARD', cc: '#EDEDED', tag: 'COLLABORATION', desc: 'Swipe to find teammates, not dates. Builders swipe through profiles and live projects, and a match only happens when both sides swipe right. Sign-in is through GitHub or Google with NextAuth.', stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'NextAuth'], repo: 'https://github.com/Krish-2118/project-match', livery: 'linear-gradient(90deg,#ECEAE4 0 64%,#D6322B 64% 69%,#ECEAE4 69% 74%,#0d0e10 74%)' },
  { name: 'Innovision', num: '04', compound: 'INTER', cc: '#2BB24C', tag: 'FEST WEBSITE', desc: 'The official website of Innovision 2026, NIT Rourkela’s technical fest. It has scroll-driven event worlds, an event explorer, a 3D photo gallery, the schedule, a merch store, Google sign-in for registration and a built-in admin dashboard. Built with OpenCode and DSC NIT Rourkela.', stack: ['Next.js', 'TypeScript', 'GSAP', 'Supabase', 'ImageKit', 'Vercel'], repo: 'https://github.com/OpencodeNIT-R/project-spacex', livery: 'linear-gradient(100deg,#0d0e10 0 30%,#2BB24C 30% 36%,#0d0e10 36% 62%,#7a5cff 62% 68%,#0d0e10 68%)' }
];
const GAUGES = [
  { name: 'FRONTEND', v: 0.88, stack: 'React · Next.js · Tailwind CSS' },
  { name: 'BACKEND', v: 0.82, stack: 'Node.js · Express · REST APIs' },
  { name: 'DATABASES', v: 0.76, stack: 'MongoDB · PostgreSQL · Prisma' },
  { name: 'LANGUAGES', v: 0.8, stack: 'C++ · JavaScript · TypeScript · SQL' }
];
// pit stop keys, laid out like the car seen from above: Q E front, Z C rear
const PIT_KEYS = { q: 'FL', e: 'FR', z: 'RL', c: 'RR' };
const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sstep = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const fmt = ms => { const s = ms / 1000; const m = Math.floor(s / 60); const r = (s - m * 60).toFixed(3); return m + ':' + (r.length < 6 ? '0' + r : r); };

function makeTrace() {
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const n = 52, v = [];
  for (let i = 0; i < n; i++) { const base = 0.45 + 0.3 * Math.sin(i / 5) + 0.15 * Math.sin(i / 1.7); v.push(clamp(base + (rnd() - 0.5) * 0.35, 0.05, 0.98)); }
  const sp = v.map((y, i) => `${(i / (n - 1) * 600).toFixed(1)},${(150 - y * 130).toFixed(1)}`).join(' ');
  const thr = v.map((y, i) => `${(i / (n - 1) * 600).toFixed(1)},${(198 - clamp(y * 1.5 - 0.2) * 34).toFixed(1)}`).join(' ');
  const brk = v.map((y, i) => { const d = i ? clamp((v[i - 1] - y) * 3) : 0; return `${(i / (n - 1) * 600).toFixed(1)},${(244 - d * 34).toFixed(1)}`; }).join(' ');
  return { speed: sp, thr, brk };
}
const TRACE = makeTrace();

export default class Car11 extends React.Component {
  // public/models/rb22.glb is generated by `npm run model:rb22`
  static defaultProps = { modelUrl: '/models/rb22.glb', drivePace: 'Spirited', camera: 'Chase' };
  state = {
    phase: 'loading', lit: 0, outro: false, audio: false, weather: 'wet', drs: false, sector: 0,
    times: [null, null, null, null, null, null, null], fp: false, fpBest: null, fpLast: null, fpLap: 1, fpRun: false, modal: null, project: 0, tele: false,
    radioLog: [], form: { name: '', email: '', msg: '' }, toast: null, toastColor: '#2BD96B',
    model: { status: 'proxy', name: '', size: 0, tris: 0, meshes: 0, parts: [], progress: 0, err: '' }, dragOver: false, urlInput: '', race: 'grid', glit: 0, gantryHide: false, splits: [null, null, null], curSec: 0, tdStep: -1, stopTags: [], mapPts: '', mapStops: [],
    rt: { stage: 'idle', lit: 0, time: null }, board: [], pit: { stage: 'idle', idx: 0, seq: [], time: null, best: null, flash: null }
  };
  rootRef = React.createRef(); glRef = React.createRef(); labelsRef = React.createRef();
  lab0 = React.createRef(); lab1 = React.createRef(); lab2 = React.createRef(); lab3 = React.createRef(); lab4 = React.createRef();
  towerRef = React.createRef(); progRef = React.createRef(); hudRef = React.createRef(); ledRef = React.createRef(); spdRef = React.createRef(); gearRef = React.createRef();
  heroTitleRef = React.createRef(); breakdownRef = React.createRef(); cueRef = React.createRef();
  cardRef = React.createRef(); holoRef = React.createRef(); teleRef = React.createRef(); waveRef = React.createRef();
  fpLapRef = React.createRef(); pitTimerRef = React.createRef();
  barTopRef = React.createRef(); barBotRef = React.createRef(); grainRef = React.createRef(); splitRef = React.createRef(); cutRef = React.createRef(); gridRef = React.createRef(); headerRef = React.createRef(); raceClockRef = React.createRef(); mapRef = React.createRef(); mapTurnRef = React.createRef(); mapCarRef = React.createRef();

  componentDidMount() {
    // React StrictMode remounts the same instance; a fresh token makes stale async work bail out
    this.dead = false; const mountId = this.mountId = (this.mountId || 0) + 1;
    { const cs = getComputedStyle(document.documentElement);
      this.fontA = (cs.getPropertyValue('--font-anybody').trim() || 'Anybody') + ', sans-serif';
      this.fontM = (cs.getPropertyValue('--font-jbmono').trim() || "'JetBrains Mono'") + ', monospace'; }
    this.reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.lowEnd = (navigator.hardwareConcurrency || 8) <= 4 && /Mobi|Android/i.test(navigator.userAgent);
    this.keys = new Set(); this.kon = []; this.sS = window.scrollY; this.speed = 0; this.prevT = 0; this.intro = 0; this.waveE = 0.2; this.lastLed = -1; this.flash = 0;
    this.t0 = performance.now(); this.secStart = this.t0;
    try { const b = JSON.parse(localStorage.getItem('car11-reaction') || '[]'); const best = parseFloat(localStorage.getItem('car11-pit') || ''), fpBest = parseFloat(localStorage.getItem('car11-fp') || '');
      this.setState({ board: Array.isArray(b) ? b : [], pit: { ...this.state.pit, best: isNaN(best) ? null : best }, fpBest: isNaN(fpBest) ? null : fpBest }); } catch (e) { }
    // a key released while the window is unfocused never sends keyup, which left free practice stuck on throttle
    this.onBlur = () => this.keys.clear(); window.addEventListener('blur', this.onBlur);
    this.applyTheme('wet');
    this.measure();
    this.onResize = () => { this.measure(); this.sizeCanvases(); if (this.gl) { const { renderer, camera } = this.gl; renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; } };
    window.addEventListener('resize', this.onResize);
    // re-measure only when the page's layout actually changes (fonts, images, panels opening), batched to one per frame;
    // measure() forces a layout of every reveal, so polling it caused a hitch every few seconds
    this.ro = new ResizeObserver(() => { if (this.measureRaf) return; this.measureRaf = requestAnimationFrame(() => { this.measureRaf = 0; this.measure(); }); });
    if (this.rootRef.current) this.ro.observe(this.rootRef.current);
    if (document.fonts) document.fonts.ready.then(() => { if (!this.dead) this.measure(); });
    window.addEventListener('keydown', this.onKey); window.addEventListener('keyup', this.onKeyUp);
    window.addEventListener('wheel', this.onWheel, { passive: false }); window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('touchstart', this.onTouchStart, { passive: true }); window.addEventListener('touchmove', this.onTouchMove, { passive: false }); window.addEventListener('touchend', this.onTouchEnd, { passive: true });
    try { this.modelFlip = localStorage.getItem('car11-model-flip') === '1'; } catch (e) { }
    this.dragN = 0;
    this.onDragEnter = e => { if (!this.hasFiles(e)) return; e.preventDefault(); this.dragN++; if (!this.state.dragOver && !this.state.fp) this.setState({ dragOver: true }); };
    this.onDragOver = e => { if (this.hasFiles(e)) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } };
    this.onDragLeave = e => { if (!this.hasFiles(e)) return; this.dragN = Math.max(0, this.dragN - 1); if (!this.dragN && this.state.dragOver) this.setState({ dragOver: false }); };
    this.onDrop = e => { if (!this.hasFiles(e)) return; e.preventDefault(); this.dragN = 0; this.setState({ dragOver: false }); this.loadFiles([...e.dataTransfer.files]); };
    this.dragEv = [['dragenter', this.onDragEnter], ['dragover', this.onDragOver], ['dragleave', this.onDragLeave], ['drop', this.onDrop]];
    this.dragEv.forEach(([t, f]) => window.addEventListener(t, f));
    this.onPDown = e => { if (!this.inGarage() || e.button > 0) return; const t = e.target; if (t && t.closest && t.closest('button,a,input,textarea,label,image-slot')) return; this.spin = { x: e.clientX, t: performance.now(), id: e.pointerId }; this.orbitV = 0; };
    this.onPMove = e => { const s = this.spin; if (!s || e.pointerId !== s.id) return; const now = performance.now(), dx = e.clientX - s.x, dtt = Math.max(1, now - s.t) / 1000; this.orbit = (this.orbit || 0) - dx * 0.0075; this.orbitV = clamp(-dx * 0.0075 / dtt, -7, 7) * 0.6 + (this.orbitV || 0) * 0.4; s.x = e.clientX; s.t = now; this.spinning = true; };
    this.onPUp = e => { if (this.spin && e.pointerId === this.spin.id) { if (performance.now() - this.spin.t > 90) this.orbitV = 0; this.spin = null; } };
    this.ptrEv = [['pointerdown', this.onPDown], ['pointermove', this.onPMove], ['pointerup', this.onPUp], ['pointercancel', this.onPUp]];
    this.ptrEv.forEach(([t, f]) => window.addEventListener(t, f));
    if (this.rootRef.current) this.rootRef.current.style.touchAction = 'pan-y';
    { const gc = document.createElement('canvas'); gc.width = gc.height = 160; const gx = gc.getContext('2d'); const id = gx.createImageData(160, 160); for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; } gx.putImageData(id, 0, 0);
      if (this.grainRef.current) { this.grainRef.current.style.backgroundImage = 'url(' + gc.toDataURL() + ')'; this.grainRef.current.style.mixBlendMode = 'overlay'; } }
    this.sizeCanvases();
    this.io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !this.state.tele) this.setState({ tele: true }); }), { threshold: 0.3 });
    if (this.teleRef.current) this.io.observe(this.teleRef.current);
    this.runLoader();
    this.initScene(mountId);
    this.raf = requestAnimationFrame(this.loop);
  }
  componentWillUnmount() {
    this.dead = true; cancelAnimationFrame(this.raf); cancelAnimationFrame(this.measureRaf); this.measureRaf = 0; if (this.ro) this.ro.disconnect(); clearInterval(this.litTimer);
    (this.timers || []).forEach(clearTimeout); this.clearRt(); this.clearRace(); clearTimeout(this.pitFlashT);
    window.removeEventListener('resize', this.onResize); window.removeEventListener('blur', this.onBlur); window.removeEventListener('keydown', this.onKey); window.removeEventListener('keyup', this.onKeyUp); window.removeEventListener('wheel', this.onWheel); window.removeEventListener('scroll', this.onScroll); window.removeEventListener('touchstart', this.onTouchStart); window.removeEventListener('touchmove', this.onTouchMove); window.removeEventListener('touchend', this.onTouchEnd); (this.dragEv || []).forEach(([t, f]) => window.removeEventListener(t, f)); (this.ptrEv || []).forEach(([t, f]) => window.removeEventListener(t, f)); this.revokeFiles();
    clearTimeout(this.toastT); this.timers = []; this.rtTimers = []; this.stopPitClock(); document.documentElement.style.overflow = '';
    if (this.io) this.io.disconnect(); if (this.gl) { this.gl.renderer.dispose(); this.gl.renderer.domElement.remove(); this.gl = null; } this.sceneReady = false; this._ldr = null;
    if (this.au) { this.au.ctx.close(); this.au = null; }
  }
  later(fn, ms) { (this.timers = this.timers || []).push(setTimeout(fn, ms)); }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps && prevProps.modelUrl !== this.props.modelUrl && this.props.modelUrl && this.gl) this.loadUrl(this.props.modelUrl);
    // the games and free practice freeze the page behind them, so wheel and touch scrolling can't move the lap underneath
    const lock = !!(this.state.modal || this.state.fp);
    if (prevState && lock !== !!(prevState.modal || prevState.fp)) document.documentElement.style.overflow = lock ? 'hidden' : '';
  }

  // ---------- loader ----------
  runLoader() {
    const step = this.reduce ? 260 : 650;
    this.litTimer = setInterval(() => {
      if (this.state.phase !== 'loading') return clearInterval(this.litTimer);
      const lit = this.state.lit + 1;
      this.setState({ lit }); this.beep(660, 0.12);
      if (lit >= 5) { clearInterval(this.litTimer); this.waitReady(); }
    }, step);
  }
  waitReady() {
    const go = () => {
      if (this.state.phase !== 'loading') return;
      if (!this.sceneReady && performance.now() - this.t0 < 9000) return this.later(go, 120);
      this.later(() => this.lightsOut(), 400 + Math.random() * 900);
    };
    go();
  }
  lightsOut = () => {
    if (this.state.phase !== 'loading') return;
    this.setState({ phase: 'out', lit: 0 });
    if (!this.reduce && this.rootRef.current) this.rootRef.current.animate(
      [{ transform: 'translate(0,0)' }, { transform: 'translate(-9px,5px)' }, { transform: 'translate(8px,-6px)' }, { transform: 'translate(-5px,-3px)' }, { transform: 'translate(3px,4px)' }, { transform: 'translate(0,0)' }],
      { duration: 520, easing: 'ease-out' });
    this.rev = 1;
    // the intro overlay stays up through the reveal; the scene starts underneath as it clears
    const tm = INTRO_TIMING[this.props.intro] || INTRO_TIMING.number;
    this.setState({ outro: true });
    this.later(() => this.finishLoader(), this.reduce ? 300 : tm.scene);
    this.later(() => this.setState({ outro: false }), this.reduce ? 700 : tm.end);
  };
  finishLoader() {
    const now = performance.now(); const times = this.state.times.slice(); times[0] = now - this.t0;
    this.secStart = now; this.introStart = now;
    this.setState({ phase: 'done', times, sector: 1 });
  }
  skipIntro = () => { clearInterval(this.litTimer); if (this.state.phase === 'loading') this.lightsOut(); };

  // ---------- theme ----------
  applyTheme(w) {
    const r = this.rootRef.current; if (!r) return;
    const v = w === 'wet'
      ? { '--ink': '#eef0f2', '--muted': '#8a9099', '--panel': 'rgba(9,15,34,0.9)', '--line': 'rgba(255,255,255,0.14)' }
      : { '--ink': '#eef0f2', '--muted': '#8f97a6', '--panel': 'rgba(9,15,34,0.78)', '--line': 'rgba(255,255,255,0.14)' };
    Object.entries(v).forEach(([k, val]) => r.style.setProperty(k, val));
    document.body.style.background = '#050914';
  }
  toggleWeather = () => {
    const w = this.state.weather === 'wet' ? 'dry' : 'wet';
    this.setState({ weather: w }); this.applyTheme(w); if (this.gl) this.gl.setWeather(w);
    this.showToast(w === 'wet' ? 'WET RACE · INTERS ON' : 'TRACK IS DRY · SLICKS ON', w === 'wet' ? '#46f0ff' : '#FFC72C');
  };
  showToast(t, c) { clearTimeout(this.toastT); this.setState({ toast: t, toastColor: c || '#2BD96B' }); this.toastT = setTimeout(() => this.setState({ toast: null }), 1800); }
  toggleDRS = () => { const d = !this.state.drs; this.setState({ drs: d }); this.showToast(d ? 'DRS ENABLED · 2× SPEED' : 'DRS CLOSED', d ? '#2BD96B' : '#8a9099'); };

  // ---------- audio ----------
  ensureAudio() {
    if (this.au) return this.au;
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
    const ctx = new C(); const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900; lp.Q.value = 5; lp.connect(master);
    const o1 = ctx.createOscillator(); o1.type = 'sawtooth'; const o2 = ctx.createOscillator(); o2.type = 'square';
    const g2 = ctx.createGain(); g2.gain.value = 0.35; o1.connect(lp); o2.connect(g2); g2.connect(lp); o1.start(); o2.start();
    const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = nb.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const rain = ctx.createBufferSource(); rain.buffer = nb; rain.loop = true; const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500;
    const rg = ctx.createGain(); rg.gain.value = 0; rain.connect(hp); hp.connect(rg); rg.connect(ctx.destination); rain.start();
    this.au = { ctx, master, lp, o1, o2, rg, nb }; return this.au;
  }
  toggleAudio = auto => {
    if (auto !== true) this.audioChosen = true; const on = !this.state.audio; this.setState({ audio: on });
    const a = this.ensureAudio(); if (!a) return;
    if (on) a.ctx.resume();
    this._aw = null; const t = a.ctx.currentTime; a.master.gain.setTargetAtTime(0, t, 0.2); a.rg.gain.setTargetAtTime(on && this.state.weather === 'wet' ? 0.018 : 0, t, 0.3);
  };
  beep(f, dur) {
    if (!this.state.audio || !this.au) return; const { ctx } = this.au; const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = f; g.gain.value = 0.08; g.gain.setTargetAtTime(0, ctx.currentTime + dur * 0.6, 0.03); o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + dur + 0.2);
  }
  crackle(dur) {
    if (!this.state.audio || !this.au) return; const { ctx, nb } = this.au; const s = ctx.createBufferSource(); s.buffer = nb;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 1.2; const g = ctx.createGain(); g.gain.value = 0.12;
    s.connect(bp); bp.connect(g); g.connect(ctx.destination); s.start(); s.stop(ctx.currentTime + dur);
  }

  // ---------- layout metrics ----------
  measure = () => {
    const g = id => document.getElementById(id); const hero = g('s-car'), grid = g('s-grid'); if (!hero || !grid) return;
    const H = innerHeight, top = el => el.getBoundingClientRect().top + window.scrollY;
    const heroTop = top(hero), heroLen = Math.max(1, hero.offsetHeight - H), gridTop = top(grid), docMax = document.documentElement.scrollHeight - H;
    const cen = ['s-driver', 's-garage', 's-standings', 's-telemetry', 's-radio'].map(id => { const el = g(id); return el ? top(el) + el.offsetHeight / 2 - H / 2 : gridTop; });
    this.m = { H, heroTop, heroLen, gridTop, docMax, cen, lapStart: gridTop, lapEnd: Math.max(gridTop + 1, docMax), stops: HERO_STOPS.map(f => Math.round(heroTop + heroLen * f)).concat([Math.round(gridTop)]) };
    this.reveals = [...document.querySelectorAll('[data-reveal]')];
    this.reveals.forEach(el => { const t = el.style.transform; el.style.transform = 'none'; const r = el.getBoundingClientRect(); el._top = r.top + window.scrollY; el._h = r.height; el.style.transform = t; });
    this.buildMap();
  };
  sizeCanvases() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const w = this.waveRef.current; if (w) { w.width = w.clientWidth * dpr; w.height = w.clientHeight * dpr; }
  }
  scrollToId(id) { const el = document.getElementById(id); if (!el) return; const y = clamp(el.getBoundingClientRect().top + window.scrollY, 0, this.scrollMax());
    if (this.reduce) return window.scrollTo(0, y); this.scrollTarget = y; this.scrollPos = window.scrollY; this.smoothing = true; this.slowScroll = true; }
  skipToPit = () => { if (this.state.fp) this.exitFP(); if (this.state.phase !== 'done') this.skipIntro(); if (!this.raceOn()) this.goRace(true); this.scrollToId('s-garage'); };

  // ---------- input ----------
  onKey = e => {
    const key = (e.key || '').toLowerCase(); const tag = (e.target && e.target.tagName || '').toLowerCase();
    if (this.state.fp) {
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) { e.preventDefault(); this.keys.add(key); }
      if (key === 'escape') this.exitFP();
      return;
    }
    if (tag === 'input' || tag === 'textarea') return;
    this.kon.push(key); if (this.kon.length > 10) this.kon.shift();
    if (this.kon.join() === KONAMI.join()) { this.kon = []; this.toggleDRS(); return; }
    if (key === 'escape' && this.state.modal) return this.closeModal();
    // a focused button handles its own Space/Enter; otherwise they drive the game. Held keys auto-repeat,
    // which used to flip the reaction test between a start and a jump start every few milliseconds
    const go = (key === ' ' || key === 'enter') && tag !== 'button';
    if (this.state.modal === 'reaction' && go) { e.preventDefault(); if (!e.repeat) this.rtHit(); return; }
    if (this.state.modal === 'pit' && !e.repeat) {
      const w = PIT_KEYS[key];
      if (w) { e.preventDefault(); this.pitTap(w); return; }
      if (go) { e.preventDefault(); if (this.state.pit.stage !== 'run') this.pitStart(); return; }
    }
    if (this.state.modal) return;
    const dirKey = { arrowdown: 1, pagedown: 1, ' ': e.shiftKey ? -1 : 1, arrowup: -1, pageup: -1 }[key];
    if (dirKey && tag !== 'button' && tag !== 'a' && this.stopFrom(this.smoothing ? this.scrollTarget : window.scrollY, dirKey) != null) {
      e.preventDefault(); this.stepStops(dirKey); return;
    }
    if (key === 'd') this.toggleDRS();
    if (key === 'f') this.enterFP();
    if (key === 'b') this.openBay();
  };
  onKeyUp = e => this.keys.delete((e.key || '').toLowerCase());
  cardMove = e => {
    const r = e.currentTarget.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    if (this.cardRef.current) this.cardRef.current.style.transform = `rotateY(${(px - 0.5) * 22}deg) rotateX(${(0.5 - py) * 18}deg) translateZ(10px)`;
    if (this.holoRef.current) { this.holoRef.current.style.opacity = '1'; this.holoRef.current.style.backgroundPosition = `${px * 100}% ${py * 100}%`; }
  };
  cardLeave = () => { if (this.cardRef.current) this.cardRef.current.style.transform = ''; if (this.holoRef.current) this.holoRef.current.style.opacity = '0'; };

  // ---------- free practice ----------
  enterFP = () => {
    if (!this.gl || this.state.fp) { if (!this.gl) this.showToast('3D NOT AVAILABLE', '#E8352B'); return; }
    if (this.state.phase !== 'done') return;
    // every run starts from the grid slot on the start line, so lap 1 is a timed flying lap rather than a formation lap
    const G = this.gl, a = G.samples[0], b = G.samples[3];
    this.fpS = { x: a.x, z: a.z, yaw: Math.atan2(b.x - a.x, b.z - a.z), v: 0, steer: 0, t0: null, cp: 0, lastIdx: 0 };
    if (this.state.race === 'lights') { this.clearRace(); this.setState({ race: 'grid', glit: 0 }); }
    this.keys.clear(); this.setState({ fp: true, fpRun: false, fpLap: 1, fpLast: null, modal: null });
  };
  exitFP = () => { this.keys.clear(); this.setState({ fp: false }); };
  // a completed, valid lap (both sector checkpoints passed)
  fpLapDone(t) {
    const pb = !this.state.fpBest || t < this.state.fpBest;
    if (pb) { try { localStorage.setItem('car11-fp', String(t)); } catch { /* private mode */ } }
    this.showToast(pb ? 'PURPLE LAP · ' + fmt(t) : 'LAP ' + this.state.fpLap + ' · ' + fmt(t), pb ? '#B44CFF' : '#2BD96B');
    this.setState(s => ({ fpLast: t, fpLap: s.fpLap + 1, fpBest: pb ? t : s.fpBest }));
  }
  // on-screen pedals and steering for touch screens, feeding the same key set as the keyboard
  touchKey = (k, on) => e => { e.preventDefault(); if (on) { this.keys.add(k); if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId); } else this.keys.delete(k); };

  // ---------- reaction game ----------
  clearRt() { (this.rtTimers || []).forEach(clearTimeout); this.rtTimers = []; }
  openReaction = () => { this.clearRt(); this.rtLock = 0; this.setState({ modal: 'reaction', rt: { stage: 'idle', lit: 0, time: null } }); };
  openPit = () => { this.stopPitClock(); this.setState({ modal: 'pit', pit: { ...this.state.pit, stage: 'idle', idx: 0, seq: [], time: null, flash: null } }); };
  closeModal = e => { if (e && e.stopPropagation) e.stopPropagation(); this.clearRt(); this.stopPitClock(); this.setState({ modal: null }); };
  // the whole reaction screen is the button: pointerdown (not click) so the time isn't padded by the release
  rtPointer = e => {
    if (e.button > 0) return; const t = e.target;
    if (t && t.closest && t.closest('button,a')) return;
    this.rtHit();
  };
  rtHit = () => {
    const now = performance.now(), rt = this.state.rt;
    // a tap before the first light is just the second half of the tap that started the run
    if (rt.stage === 'lights' && rt.lit === 0) return;
    if (rt.stage === 'go' && this.rtGo == null) return;
    if (rt.stage === 'lights') {
      // jump start: freeze the lights where they were and ignore taps for a beat, so the tap that caused it
      // (or a double tap) doesn't immediately start the next run
      this.clearRt(); this.rtLock = now + 900; this.crackle(0.25);
      this.setState({ rt: { stage: 'jump', lit: rt.lit, time: null } }); return;
    }
    if (rt.stage === 'go') {
      const t = now - this.rtGo; this.rtLock = now + 700;
      const board = [...this.state.board, { t, d: Date.now() }].sort((x, y) => x.t - y.t).slice(0, 5);
      try { localStorage.setItem('car11-reaction', JSON.stringify(board)); } catch (err) { }
      this.setState({ rt: { stage: 'result', lit: 0, time: t }, board }); return;
    }
    if (now < (this.rtLock || 0)) return;
    this.clearRt(); this.rtGo = null;
    this.setState({ rt: { stage: 'lights', lit: 0, time: null } });
    for (let i = 1; i <= 5; i++) this.rtTimers.push(setTimeout(() => { this.setState({ rt: { stage: 'lights', lit: i, time: null } }); this.beep(660, 0.1); }, i * 900));
    // the clock starts when the lights-out frame is committed, not when the timer fires
    this.rtTimers.push(setTimeout(() => this.setState({ rt: { stage: 'go', lit: 0, time: null } }, () => { this.rtGo = performance.now(); }), 4500 + 200 + Math.random() * 2600));
  };

  // ---------- pit stop game ----------
  pitStart = () => {
    const sh = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
    const seq = [...sh(['FL', 'FR', 'RL', 'RR']).map(w => ({ w, a: 'OFF' })), ...sh(['FL', 'FR', 'RL', 'RR']).map(w => ({ w, a: 'ON' }))];
    this.stopPitClock(); this.pitT0 = performance.now(); this.pitPen = 0; this.pitLive = true;
    this.setState({ pit: { ...this.state.pit, stage: 'run', idx: 0, seq, time: null, flash: null } });
    const tick = () => {
      if (!this.pitLive) return;
      const el = this.pitTimerRef.current; if (el) el.textContent = ((performance.now() - this.pitT0 + this.pitPen) / 1000).toFixed(2) + 's';
      this.pitRaf = requestAnimationFrame(tick);
    };
    this.pitRaf = requestAnimationFrame(tick);
  };
  stopPitClock() { this.pitLive = false; if (this.pitRaf) cancelAnimationFrame(this.pitRaf); this.pitRaf = null; clearTimeout(this.pitFlashT); if (this.pitTimerRef.current) this.pitTimerRef.current.textContent = ''; }
  pitTap(w) {
    const p = this.state.pit; if (p.stage !== 'run') return;
    const cur = p.seq[p.idx];
    if (cur.w !== w) {
      // wrong tyre: +0.3 s and a short red flash that clears itself
      this.pitPen += 300; this.beep(180, 0.1); this.setState({ pit: { ...p, flash: w } });
      clearTimeout(this.pitFlashT); this.pitFlashT = setTimeout(() => { if (this.state.pit.flash === w) this.setState(s => ({ pit: { ...s.pit, flash: null } })); }, 260);
      return;
    }
    this.beep(cur.a === 'OFF' ? 900 : 1200, 0.05);
    const idx = p.idx + 1;
    if (idx >= p.seq.length) {
      const time = (performance.now() - this.pitT0 + this.pitPen) / 1000; this.stopPitClock(); const best = p.best == null ? time : Math.min(p.best, time);
      try { localStorage.setItem('car11-pit', String(best)); } catch (e) { }
      this.setState({ pit: { ...p, stage: 'done', idx, time, best, flash: null } });
    } else this.setState({ pit: { ...p, idx, flash: null } });
  }

  // ---------- radio ----------
  setField(k, v) { this.waveE = Math.min(1.4, this.waveE + 0.5); this.setState({ form: { ...this.state.form, [k]: v } }); }
  sendRadio = e => {
    e.preventDefault(); const f = this.state.form;
    if (!f.msg.trim()) { this.setState({ radioLog: [...this.state.radioLog, { who: 'PIT WALL', text: 'Radio check. Nothing received, try again.', color: '#E8352B' }] }); this.crackle(0.3); return; }
    this.waveE = 2.2; this.crackle(0.6);
    this.setState({ radioLog: [{ who: (f.name || 'YOU').toUpperCase().slice(0, 10), text: f.msg.trim(), color: '#FFC72C' }], form: { ...f, msg: '' } });
    this.later(() => { this.waveE = 1.8; this.crackle(0.5); this.setState({ radioLog: [...this.state.radioLog, { who: 'CAR 21', text: `Copy${f.name ? ', ' + f.name.trim() : ''}. Message received. Box, box.`, color: '#2BD96B' }] }); }, 1400);
  };

  // ---------- frame loop ----------
  loop = now => {
    if (this.dead) return; this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000); this.last = now;
    const ts = this.state.drs ? 2 : 1;
    const m = this.m; if (!m) return;
    if (this.smoothing) {
      if (this.scrollPos != null && Math.abs(window.scrollY - this.scrollPos) > 80) { this.smoothing = false; this.scrollPos = null; }
      else { const cur = this.scrollPos == null ? window.scrollY : this.scrollPos; let nx = cur + (this.scrollTarget - cur) * (1 - Math.exp(-dt * (this.slowScroll ? 3.2 : 9)));
        if (Math.abs(this.scrollTarget - nx) < 0.5) { nx = this.scrollTarget; this.smoothing = false; this.slowScroll = false; } this.scrollPos = this.smoothing ? nx : null; window.scrollTo(0, nx); }
    }
    const sy = this.debugY != null ? this.debugY : window.scrollY; this.sS += (sy - this.sS) * (1 - Math.exp(-dt * (this.reduce ? 30 : 16)));
    const heroP = clamp((this.sS - m.heroTop) / m.heroLen); this.heroP = heroP;
    this.lapP = this.raceOn() ? clamp((this.sS - m.gridTop) / Math.max(1, m.docMax - m.gridTop)) : 0;
    this.mode = this.sS >= m.gridTop - m.H * 0.5 ? (this.raceOn() ? 'race' : 'grid') : 'hero';
    { const it = this.introStart ? (now - this.introStart) / 1000 : 0;
      if (this.state.phase === 'done' && (this.reduce || heroP > 0.02 || it > INTRO.total)) this.uiDone = true;
      // ui: the header and hero copy fading in. It follows the opening shot until the visitor scrolls (or the shot ends),
      // then ramps linearly to 1 and is eased only for display. Easing the running value itself, as before, had a fixed
      // point near 0 at 60 fps, so scrolling early in the intro (or reloading mid-page) left the navbar almost invisible
      const introUi = this.state.phase === 'done' ? sstep(INTRO.total - 1.6, INTRO.total - 0.2, it) : 0;
      this.uiT = this.uiDone ? Math.min(1, Math.max(this.uiT || 0, introUi) + dt * 2.5) : introUi;
      const ui = this.uiDone ? Math.max(introUi, sstep(0, 1, this.uiT)) : introUi; this.uiO = ui;
      if (this.headerRef.current) { const v = ui.toFixed(3); if (this.headerRef.current.style.opacity !== v) { this.headerRef.current.style.opacity = v; this.headerRef.current.style.transform = 'translateY(' + ((1 - ui) * -14).toFixed(1) + 'px)'; } }
      if (this.heroTitleRef.current) { const o = (1 - sstep(0.02, 0.07, heroP)) * ui; this.heroTitleRef.current.style.opacity = o; this.heroTitleRef.current.style.transform = 'translateY(' + (-heroP * 400 + (1 - ui) * 36).toFixed(1) + 'px)'; } }
    if (this.breakdownRef.current) { const bo = sstep(0.09, 0.15, heroP) * (1 - sstep(0.86, 0.92, heroP)), el = this.breakdownRef.current; el.style.opacity = bo; const live = bo > 0.5 ? '1' : '0'; if (el.dataset.live !== live) el.dataset.live = live; }
    { const k = heroP >= 0.18 && heroP < 0.88 ? Math.floor((heroP - 0.18) / 0.14) : -1; if (k !== this.state.tdStep) this.setState({ tdStep: k }); }
    if (this.gridRef.current) { const near = sstep(m.gridTop - m.H * 0.55, m.gridTop - m.H * 0.05, this.sS); const go = this.goT ? 1 - clamp((now - this.goT - 600) / 700) : 1;
      // the grid's copy and buttons clear as soon as the start sequence begins: from there it's just the lights and the car
      this.gridLift = (this.gridLift ?? 1) + ((this.state.race === 'grid' ? 1 : 0) - (this.gridLift ?? 1)) * (1 - Math.exp(-dt * 9));
      const el = this.gridRef.current; el.style.opacity = (near * go * this.gridLift).toFixed(3); el.style.pointerEvents = this.gridLift > 0.5 ? '' : 'none'; }
    if (this.mode !== this.state.mode) this.setState({ mode: this.mode });
    if (this.au) { const want = this.state.audio && (this.mode === 'race' || this.state.fp); if (want !== this._aw) { this._aw = want; const t = this.au.ctx.currentTime; this.au.master.gain.setTargetAtTime(want ? 0.05 : 0, t, 0.35); this.au.rg.gain.setTargetAtTime(want && this.state.weather === 'wet' ? 0.018 : 0, t, 0.4); } }
    this.updateTower(now);
    this.updateReveal(dt);
    this.drawWave(dt * ts);
    // a full-screen overlay covers the scene: hold its last frame instead of rendering underneath, which keeps the main
    // thread free so the reaction and pit timers measure the player rather than frame time
    if (this.gl && this.state.modal) this.speed = 0;
    else if (this.gl) { this.renderGL(dt, ts, now);
      this.ft = this.ft == null ? dt : this.ft + (dt - this.ft) * 0.05;
      if (now - (this.dprT || 0) > 1500) { this.dprT = now; let nd = this.dpr; if (this.ft > 0.023 && nd > 0.7) nd = Math.max(0.7, nd - 0.2); else if (this.ft < 0.0145 && nd < this.dprMax) nd = Math.min(this.dprMax, nd + 0.1);
        if (nd !== this.dpr) { this.dpr = nd; this.gl.renderer.setPixelRatio(nd); this.gl.renderer.setSize(innerWidth, innerHeight); } } }
    else this.speed = 0;
    this.updateHUD();
    this.updateFX(dt);
  };
  updateTower(now) {
    if (this.state.phase !== 'done' || !this.m) return;
    const on = this.mode === 'race' && !this.state.fp;
    if (this._hudOn !== on || this._hudSmall !== (innerWidth < 760 || innerHeight < 520)) { this._hudOn = on; const small = this._hudSmall = innerWidth < 760 || innerHeight < 520;
      [[this.towerRef, small], [this.mapRef, small], [this.hudRef, false]].forEach(([r, hide]) => { if (r.current) r.current.style.display = on && !hide ? 'flex' : 'none'; }); }
    if (!on || !this.gl) return;
    const G = this.gl, L = G.trackLen, d = G.d || 0, t = (this.raceEnd || now) - (this.raceT0 || now);
    if (this.raceClockRef.current) { const s = fmt(t); if (this.raceClockRef.current.textContent !== s) this.raceClockRef.current.textContent = s; }
    const sec = d >= L * 0.985 ? 3 : Math.min(2, Math.floor(d / (L / 3)));
    if (sec > this.state.curSec && !this.raceEnd) {
      const splits = this.state.splits.slice(), prev = this.state.curSec, st = t - (this.secT0 || 0); splits[prev] = st; this.secT0 = t;
      if (sec === 3) { this.raceEnd = now; this.splitFx('CHEQUERED FLAG · LAP 1', 'Lap complete', t, '#B44CFF'); this.setState({ splits, curSec: 3, race: 'done' }); }
      else { this.splitFx('SECTOR ' + (prev + 1) + ' · PERSONAL BEST', 'Into sector ' + (sec + 1), st, '#B44CFF'); this.setState({ splits, curSec: sec }); }
    }
    const yc = window.scrollY; let best = 1e9, side = 0; (this.m.cen || []).forEach((y, i) => { const dd = Math.abs(y - yc); if (dd < best) { best = dd; side = i % 2 === 0 ? 1 : -1; } });
    this.panelSide = best < this.m.H * 0.7 ? side : 0;
    { const H = this.m.H, sy = window.scrollY, rs = (this.reveals || []).map(el => { const o = parseFloat(el.style.opacity || '0'); const t = (el._top || 0) - sy; return { o, t, b: t + (el._h || 0) }; }).filter(r => r.o > 0.05);
      [this.towerRef, this.mapRef, this.hudRef].forEach(r => { const el = r.current; if (!el || el.style.display === 'none') return;
        if (el._hk !== innerHeight + 'x' + innerWidth) { el._hk = innerHeight + 'x' + innerWidth; el._bt = el.offsetTop; el._bh = el.offsetHeight; } const bt = el._bt, bb = bt + el._bh; let cover = 0; rs.forEach(q => { if (q.t < bb + 12 && q.b > bt - 12) cover = Math.max(cover, q.o); });
        const ho = (1 - sstep(0.15, 0.6, cover)).toFixed(3); if (el.style.opacity !== ho) el.style.opacity = ho; }); }
    if (this.mapCarRef.current && G.mapT) { const p = G.car.position, q = G.mapT; this.mapCarRef.current.setAttribute('cx', (q.ox + (p.x - q.minx) * q.s).toFixed(1)); this.mapCarRef.current.setAttribute('cy', (q.oy + (p.z - q.minz) * q.s).toFixed(1)); }
    if (this.mapTurnRef.current) { const s = sec >= 3 ? 'FINISH' : 'SECTOR ' + (sec + 1); if (this.mapTurnRef.current.textContent !== s) this.mapTurnRef.current.textContent = s; }
  }
  updateHUD() {
    const kmh = Math.min(this.state.fp ? 400 : 340, Math.abs(this.speed) * 3.6);
    const gi = Math.min(7, Math.floor(kmh / 30));
    const gear = kmh < 2 ? 'N' : String(gi + 1);
    const rpm = kmh < 2 ? 4200 + Math.sin(this.last / 90) * 150 : 4500 + clamp((kmh - gi * 30) / 30) * 7800;
    this.rpm = rpm;
    if (this.spdRef.current) { const s = String(Math.round(kmh)); if (this.spdRef.current.textContent !== s) this.spdRef.current.textContent = s; if (this.gearRef.current.textContent !== gear) this.gearRef.current.textContent = gear; }
    const lit = Math.round(clamp((rpm - 4200) / 8100) * 15);
    if (lit !== this.lastLed && this.ledRef.current) {
      this.lastLed = lit; const kids = this.ledRef.current.children;
      for (let i = 0; i < kids.length; i++) kids[i].style.background = i < lit ? (i < 5 ? '#2BD96B' : i < 10 ? '#E8352B' : '#7a5cff') : 'rgba(140,146,156,.18)';
    }
    if (this.au && this.state.audio) {
      const f = rpm / 60 * 1.5; const t = this.au.ctx.currentTime;
      this.au.o1.frequency.setTargetAtTime(f, t, 0.05); this.au.o2.frequency.setTargetAtTime(f * 0.5, t, 0.05); this.au.lp.frequency.setTargetAtTime(400 + rpm * 0.11, t, 0.05);
    }
  }
  drawWave(dt) {
    const cv = this.waveRef.current; if (!cv) return;
    const r = cv.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    if (cv.width !== Math.round(cv.clientWidth * Math.min(devicePixelRatio || 1, 2))) this.sizeCanvases();
    const c = cv.getContext('2d'); const W = cv.width, H = cv.height; c.clearRect(0, 0, W, H);
    this.waveE += (0.18 - this.waveE) * (1 - Math.exp(-dt * 1.6)); this.wt = (this.wt || 0) + dt;
    const n = 72, bw = W / n; c.fillStyle = this.state.weather === 'wet' ? '#FFC72C' : '#b07610';
    for (let i = 0; i < n; i++) {
      const x = i / n; const env = Math.sin(Math.PI * x);
      const a = env * this.waveE * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.9 + this.wt * 9) * Math.cos(i * 0.31 - this.wt * 5))) + (Math.random() < 0.04 * this.waveE ? Math.random() * 0.4 : 0);
      const h = Math.max(2, Math.min(H * 0.92, a * H * 0.6));
      c.fillRect(i * bw + bw * 0.2, (H - h) / 2, bw * 0.6, h);
    }
  }

  // ---------- smooth scroll + cinematic FX ----------
  inGarage() { return this.mode === 'hero' && (this.heroP || 0) < 0.06 && !this.state.fp && !this.state.modal && this.state.phase === 'done'; }
  onWheel = e => {
    if (this.inGarage() && (e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) * 0.8) && (e.deltaX || e.deltaY)) {
      e.preventDefault(); const d = e.deltaX || e.deltaY; this.orbitV = clamp((this.orbitV || 0) + d * 0.045, -7, 7); return; }
    if (this.reduce || this.state.fp || this.state.modal || e.ctrlKey) return;
    const t = e.target; if (t && t.closest && t.closest('textarea')) return;
    e.preventDefault();
    const max = this.scrollMax();
    const d = e.deltaY * (e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? innerHeight : 1);
    if (this.wheelStep(e, d)) return;
    this.scrollTarget = clamp((this.smoothing ? this.scrollTarget : window.scrollY) + d, 0, max);
    if (!this.smoothing) this.scrollPos = window.scrollY; this.smoothing = true; this.slowScroll = false;
  };
  // ---------- garage scroll stops ----------
  inStops(y) { const st = this.m && this.m.stops; return !!st && this.state.phase === 'done' && y >= st[0] - 2 && y <= st[st.length - 1] + 2; }
  // the next stop from y in direction dir, or null at either end of the range (so the page scrolls on normally from there)
  stopFrom(y, dir) {
    const st = this.m && this.m.stops; if (!st || !this.inStops(y)) return null;
    if (dir > 0) { for (let i = 0; i < st.length; i++) if (st[i] > y + 4) return st[i]; return null; }
    for (let i = st.length - 1; i >= 0; i--) if (st[i] < y - 4) return st[i]; return null;
  }
  glideTo(y) {
    this.stepSpan = Math.max(1, Math.abs(y - window.scrollY));
    if (this.reduce) { window.scrollTo(0, y); this.scrollTarget = y; return; }
    if (!this.smoothing) this.scrollPos = window.scrollY;
    this.scrollTarget = y; this.smoothing = true; this.slowScroll = true;
  }
  // a new step waits until the current glide is mostly done (left: fraction of the step still to travel), so every card
  // gets its hold however fast, or however unevenly on a slow device, the input arrives
  stepReady(left = 0.25) { return !this.smoothing || !this.stepSpan || Math.abs(this.scrollTarget - window.scrollY) / this.stepSpan < left; }
  stepStops(dir) { if (!this.stepReady()) return; const next = this.stopFrom(this.smoothing ? this.scrollTarget : window.scrollY, dir); if (next != null) this.glideTo(next); }
  // One step per wheel gesture. Trackpads send a burst of momentum events per flick, so a gesture is events less than
  // 200 ms apart in one direction. A fresh gesture steps as soon as the last glide is three quarters done; carrying on
  // within the same gesture (a long fling, a spun wheel) waits for the card to settle and a firm further push, so it
  // still travels card by card with each one held
  wheelStep(e, d) {
    const dir = Math.sign(d); if (!dir) return false;
    const base = this.smoothing ? this.scrollTarget : window.scrollY;
    if (this.stopFrom(base, dir) == null) return false;
    e.preventDefault();
    const now = performance.now(), fresh = now - (this.wheelLast || 0) > 200 || dir !== this.wheelDir;
    this.wheelLast = now; this.wheelDir = dir;
    if (fresh) { this.wheelAcc = 0; this.wheelStepped = false; }
    if (!this.stepReady(this.wheelStepped ? 0.06 : 0.25)) { this.wheelAcc = 0; return true; }
    this.wheelAcc = (this.wheelAcc || 0) + Math.abs(d);
    if (this.wheelAcc >= (this.wheelStepped ? 240 : 8)) { this.wheelAcc = 0; this.wheelStepped = true; this.stepStops(dir); }
    return true;
  }
  // swipes: a vertical swipe inside the range steps once (native scrolling resumes past either end)
  onTouchStart = e => { const t = e.touches[0]; this.tch = e.touches.length === 1 && !this.state.fp && !this.state.modal && this.inStops(window.scrollY) ? { x: t.clientX, y: t.clientY, own: null } : null; };
  onTouchMove = e => {
    const c = this.tch; if (!c) return; const t = e.touches[0], dx = t.clientX - c.x, dy = c.y - t.clientY;
    if (c.own == null && Math.max(Math.abs(dx), Math.abs(dy)) > 6) c.own = Math.abs(dy) > Math.abs(dx) && this.stopFrom(this.smoothing ? this.scrollTarget : window.scrollY, Math.sign(dy)) != null;
    if (c.own) e.preventDefault();
  };
  onTouchEnd = e => { const c = this.tch; this.tch = null; if (!c || !c.own) return; const dy = c.y - e.changedTouches[0].clientY; if (Math.abs(dy) > 30) this.stepStops(Math.sign(dy)); };
  goPart = k => this.glideTo(this.m.stops[2 + k]);
  onScroll = () => { if (this.m && !this.raceOn() && !this.state.fp && window.scrollY > this.m.gridTop + 2) { window.scrollTo(0, this.m.gridTop); this.scrollTarget = this.m.gridTop; return; } if (!this.smoothing) this.scrollTarget = window.scrollY; };
  updateReveal(dt) {
    if (!this.reveals) return; const H = innerHeight;
    const vel = (window.scrollY - (this.lastSY == null ? window.scrollY : this.lastSY)) / Math.max(dt, 1e-3); this.lastSY = window.scrollY;
    this.skew = (this.skew || 0) + (clamp(vel * -0.0009, -2.2, 2.2) - (this.skew || 0)) * (1 - Math.exp(-dt * 7));
    this.reveals.forEach(el => {
      const eh = el._h || 0; const c = (el._top || 0) - window.scrollY + eh / 2 - H / 2; const sgn = Math.sign(c);
      // d is capped: past ~1 screen the panel is fully transparent anyway, and an unbounded translateY pushed far-off
      // panels thousands of px down, which grew the page (blank scroll at the bottom, finish section never shown)
      const a = Math.max(0, Math.abs(c) - Math.max(0, (eh - H) / 2)) / H; const d = sgn * Math.min(a, 1.25);
      if (a > 1.25) { if (el._off) return; el._off = true; } else el._off = false;
      const o = (this.reduce ? 1 : 1 - sstep(0.38, 0.8, a)).toFixed(3);
      const tf = this.reduce ? '' : 'perspective(1400px) translate3d(0,' + (d * 110).toFixed(1) + 'px,0) rotateX(' + clamp(d * -14, -14, 14).toFixed(2) + 'deg) skewY(' + this.skew.toFixed(2) + 'deg)';
      // only touch the DOM when the values change, so a still page does no style work
      if (el._o !== o) { el._o = o; el.style.opacity = o; }
      if (el._tf !== tf) { el._tf = tf; el.style.transform = tf; }
    });
  }
  updateFX(dt) {
    const sk = clamp(Math.abs(this.speed) / 50);
    const target = this.reduce ? 0 : Math.max(sk * 0.95, (this.ex || 0) * 0.75, this.state.fp ? 0.45 : 0);
    this.barH = (this.barH || 0) + (target - (this.barH || 0)) * (1 - Math.exp(-dt * 2.5));
    const bh = (this.barH * 6.5).toFixed(2) + 'vh';
    if (this.barTopRef.current) { this.barTopRef.current.style.height = bh; this.barBotRef.current.style.height = bh; }
    if (this.cutRef.current) { const c = this.gl && this.gl.cut; const o = c ? (c.t < 0.38 ? sstep(0, 0.38, c.t) : 1 - sstep(0.45, 1.15, c.t)) : 0; if (this.cutO !== o) { this.cutO = o; this.cutRef.current.style.opacity = o.toFixed(3); } }
    this.gf = (this.gf || 0) + 1;

  }
  splitFx(k, n, ms, color) {
    const el = this.splitRef.current; if (!el) return;
    el.querySelector('[data-split="k"]').textContent = k;
    el.querySelector('[data-split="n"]').textContent = n;
    const t = el.querySelector('[data-split="t"]'); t.textContent = fmt(ms); t.style.background = color;
    el.animate([
      { opacity: 0, transform: 'translateX(-50%) translateY(-14px)', clipPath: 'inset(0 100% 0 0)' },
      { opacity: 1, transform: 'translateX(-50%) translateY(0)', clipPath: 'inset(0 0% 0 0)', offset: 0.16 },
      { opacity: 1, transform: 'translateX(-50%) translateY(0)', clipPath: 'inset(0 0% 0 0)', offset: 0.84 },
      { opacity: 0, transform: 'translateX(-50%) translateY(-8px)', clipPath: 'inset(0 0 0 100%)' }
    ], { duration: 2300, easing: 'cubic-bezier(.2,.8,.2,1)' });
    this.whoosh();
  }
  whoosh() {
    if (!this.state.audio || !this.au) return; const { ctx, nb } = this.au; const s = ctx.createBufferSource(); s.buffer = nb;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2; const t = ctx.currentTime;
    bp.frequency.setValueAtTime(300, t); bp.frequency.exponentialRampToValueAtTime(2400, t + 0.5);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.12, t + 0.15); g.gain.linearRampToValueAtTime(0, t + 0.7);
    s.connect(bp); bp.connect(g); g.connect(ctx.destination); s.start(); s.stop(t + 0.8);
  }

  // ---------- 3D ----------
  async initScene(mountId) {
    let T;
    // fetch the model loaders alongside three.js rather than after the scene is built
    this._ldrMods = this._ldrMods || Promise.all([import('three/addons/loaders/GLTFLoader.js'), import('three/addons/loaders/DRACOLoader.js'), import('three/addons/libs/meshopt_decoder.module.js')]);
    this._ldrMods.catch(() => { });
    try { T = await import('three'); } catch (e) { console.warn('3D unavailable', e); this.sceneReady = true; return; }
    if (this.dead || this.mountId !== mountId) return;
    try { await Promise.race([document.fonts.load('900 italic 100px ' + this.fontA), new Promise(r => setTimeout(r, 1500))]); } catch (e) { }
    if (this.dead || this.mountId !== mountId) return;
    const low = this.lowEnd;
    const renderer = new T.WebGLRenderer({ antialias: !low, powerPreference: 'high-performance' });
    this.dprMax = Math.min(devicePixelRatio || 1, low ? 1 : 1.5); this.dpr = this.dprMax; renderer.setPixelRatio(this.dpr); renderer.setSize(innerWidth, innerHeight);
    renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05; renderer.outputColorSpace = T.SRGBColorSpace; renderer.autoClear = false;
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    this.glRef.current.appendChild(renderer.domElement);
    const scene = new T.Scene(); const camera = new T.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 1200);
    const world = new T.Group(); scene.add(world);

    const pm = new T.PMREMGenerator(renderer); const env = new T.Scene();
    env.add(new T.Mesh(new T.BoxGeometry(30, 14, 30), new T.MeshBasicMaterial({ color: 0x07090c, side: T.BackSide })));
    const panel = (w, h, x, y, z, rx, ry, c, i) => { const mm = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: new T.Color(c).multiplyScalar(i), side: T.DoubleSide })); mm.position.set(x, y, z); mm.rotation.set(rx, ry, 0); env.add(mm); };
    panel(14, 1.4, 0, 6.8, 0, Math.PI / 2, 0, 0xffffff, 4); panel(12, 2.5, -14.5, 3, 0, 0, Math.PI / 2, 0xcfdcff, 2); panel(12, 2.5, 14.5, 3, 0, 0, -Math.PI / 2, 0xffd9a0, 1.8); panel(8, 1.6, 0, 2, -14.5, 0, 0, 0xff3b30, 1.2); panel(8, 1, 0, 1.5, 14.5, 0, Math.PI, 0x8fe9ff, 0.9);
    scene.environment = pm.fromScene(env, 0.04).texture; scene.environmentIntensity = 0.75;

    const glowTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; return t; })();

    const P = [[0, -80], [0, 80], [10, 125], [45, 140], [80, 120], [95, 80], [130, 60], [170, 75], [200, 40], [190, -10], [150, -30], [120, -70], [130, -120], [100, -160], [50, -165], [15, -130]];
    const curve = new T.CatmullRomCurve3(P.map(p => new T.Vector3(p[0], 0, p[1])), true, 'centripetal');
    const trackLen = curve.getLength(); const samples = curve.getSpacedPoints(600).slice(0, 600);
    // speed profile: corner limit from curvature, then a backward braking pass
    const PN = 1200, pds = trackLen / PN, prof = new Float32Array(PN);
    { const tA = new T.Vector3(), tB = new T.Vector3();
      for (let i = 0; i < PN; i++) { curve.getTangentAt(((i - 3 + PN) % PN) / PN, tA); curve.getTangentAt(((i + 3) % PN) / PN, tB); const da = Math.abs(Math.atan2(tA.x * tB.z - tA.z * tB.x, tA.x * tB.x + tA.z * tB.z)); prof[i] = Math.min(46, Math.sqrt(13 / Math.max(da / (6 * pds), 1e-5))); }
      for (let pass = 0; pass < 2; pass++) for (let i = PN - 1; i >= 0; i--) { const nx = prof[(i + 1) % PN]; prof[i] = Math.min(prof[i], Math.sqrt(nx * nx + 2 * 8 * pds)); } }
    const corners = []; for (let i = 0; i < PN; i++) { const a = prof[(i - 1 + PN) % PN], b = prof[i], c = prof[(i + 1) % PN]; if (b <= a && b < c && b < 38) corners.push(i * pds); }
    const pick = corners.filter(d => d > 90 && d < trackLen - 120);
    const stops = (pick.length >= 5 ? [0, 1, 2, 3, 4].map(j => pick[Math.round(j * (pick.length - 1) / 4)]) : [0.15, 0.3, 0.5, 0.68, 0.85].map(f => f * trackLen)).map(d => ({ d: Math.max(0, d - 8), turn: corners.findIndex(c => c >= d - 1) + 1 || 1, sector: Math.min(3, 1 + Math.floor(d / (trackLen / 3))) }));
    const mapT = (() => { let a = 1e9, b = -1e9, c = 1e9, e = -1e9; samples.forEach(q => { a = Math.min(a, q.x); b = Math.max(b, q.x); c = Math.min(c, q.z); e = Math.max(e, q.z); }); const s = 176 / Math.max(b - a, e - c); return { minx: a, minz: c, s, ox: 100 - (b - a) * s / 2, oy: 100 - (e - c) * s / 2 }; })();
    const mapPt = q => [(mapT.ox + (q.x - mapT.minx) * mapT.s).toFixed(1), (mapT.oy + (q.z - mapT.minz) * mapT.s).toFixed(1)];

    // ground with painted circuit
    const S = 560, N = low ? 2048 : 4096, cx = 100, cz = -12, m2p = N / S;
    const gc = document.createElement('canvas'); gc.width = gc.height = N; const g = gc.getContext('2d');
    const px = p => [(p.x - cx + S / 2) * m2p, (p.z - cz + S / 2) * m2p];
    g.fillStyle = '#0b0d10'; g.fillRect(0, 0, N, N);
    const path = () => { g.beginPath(); samples.forEach((p, i) => { const [u, v] = px(p); i ? g.lineTo(u, v) : g.moveTo(u, v); }); g.closePath(); };
    g.lineJoin = 'round'; g.lineCap = 'round';
    path(); g.strokeStyle = '#121519'; g.lineWidth = 34 * m2p; g.stroke();
    path(); g.setLineDash([3 * m2p, 3 * m2p]); g.strokeStyle = '#a81d1a'; g.lineWidth = 15.8 * m2p; g.stroke();
    g.lineDashOffset = 3 * m2p; g.strokeStyle = '#cfccc4'; g.stroke(); g.setLineDash([]); g.lineDashOffset = 0;
    path(); g.strokeStyle = '#d6d3cc'; g.lineWidth = 14.3 * m2p; g.stroke();
    path(); g.strokeStyle = '#1c1f24'; g.lineWidth = 13.8 * m2p; g.stroke();
    path(); g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 2.6 * m2p; g.stroke();
    for (let i = 0; i < (low ? 30000 : 90000); i++) { const v = (Math.random() * 40) | 0; g.fillStyle = `rgba(${150 + v},${155 + v},${165 + v},${Math.random() * 0.06})`; g.fillRect(Math.random() * N, Math.random() * N, 2, 2); }
    { const p0 = curve.getPointAt(0), t0 = curve.getTangentAt(0); const [u, v] = px(p0); g.save(); g.translate(u, v); g.rotate(Math.atan2(t0.z, t0.x)); const sq = 0.7 * m2p;
      for (let i = 0; i < 20; i++) for (let j = 0; j < 2; j++) { g.fillStyle = (i + j) % 2 ? '#e8e6e0' : '#0a0a0a'; g.fillRect(-sq + j * sq - 1.5 * m2p, -7 * m2p + i * sq, sq, sq); }
      for (let k = 1; k <= 3; k++) { g.fillStyle = '#d6d3cc'; g.fillRect(-k * 9 * m2p - 0.25 * m2p, (k % 2 ? -5 : 1) * m2p, 0.25 * m2p, 3.5 * m2p); g.fillRect(-k * 9 * m2p - 0.25 * m2p, (k % 2 ? -5 : 1) * m2p, 1.4 * m2p, 0.25 * m2p); }
      g.restore(); }
    const gtex = new T.CanvasTexture(gc); gtex.colorSpace = T.SRGBColorSpace; gtex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const groundMat = new T.MeshStandardMaterial({ map: gtex, roughness: 0.32, metalness: 0, transparent: true, opacity: 0.66 });
    const ground = new T.Mesh(new T.PlaneGeometry(S, S), groundMat); ground.rotation.x = -Math.PI / 2; ground.position.set(cx, 0, cz); scene.add(ground);
    const outer = new T.Mesh(new T.PlaneGeometry(4000, 4000), new T.MeshStandardMaterial({ color: 0x0b0d10, roughness: 0.5, transparent: true, opacity: 0.8 })); outer.rotation.x = -Math.PI / 2; outer.position.y = -0.05; scene.add(outer);

    // light poles
    const poleMat = new T.MeshStandardMaterial({ color: 0x24272c, metalness: 0.7, roughness: 0.4 }); const headMat = new T.MeshBasicMaterial({ color: 0xfff0d2 });
    const glowMats = [], glowT = []; const tmp = new T.Vector3();
    for (let i = 0; i < 26; i++) {
      const t = i / 26, p = curve.getPointAt(t), tan = curve.getTangentAt(t); const s = i % 2 ? 1 : -1; const n = new T.Vector3(tan.z, 0, -tan.x).multiplyScalar(17 * s); tmp.copy(p).add(n);
      let ok = true; for (let k = 0; k < samples.length; k += 3) if (samples[k].distanceTo(tmp) < 13) { ok = false; break; } if (!ok) continue;
      const pole = new T.Group(); pole.position.copy(tmp); world.add(pole);
      const c1 = new T.Mesh(new T.CylinderGeometry(0.14, 0.2, 12, 8), poleMat); c1.position.y = 6; pole.add(c1);
      const head = new T.Mesh(new T.BoxGeometry(2.2, 0.3, 0.7), headMat); head.position.y = 12; head.lookAt(p.x, 12, p.z); pole.add(head);
      const gm = new T.SpriteMaterial({ map: glowTex, color: 0xffe2b0, blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.85 }); glowMats.push(gm); glowT.push(Math.min(t, 1 - t) * 2);
      const sp = new T.Sprite(gm); sp.scale.set(9, 9, 1); sp.position.y = 12; pole.add(sp);
    }

    // barriers with LED strips (reflect in the wet)
    { const segN = Math.floor(trackLen / 4); const walls = new T.InstancedMesh(new T.BoxGeometry(0.35, 0.9, 3.7), new T.MeshStandardMaterial({ color: 0x1b1e23, roughness: 0.6, metalness: 0.2 }), segN * 2);
      const strips = new T.InstancedMesh(new T.BoxGeometry(0.37, 0.06, 3.7), new T.MeshBasicMaterial({ color: 0xffffff }), segN * 2);
      const dm = new T.Object3D(), col = new T.Color(); let wi = 0;
      for (let i = 0; i < segN; i++) { const t = (i + 0.5) / segN, p = curve.getPointAt(t), tan = curve.getTangentAt(t), yaw = Math.atan2(tan.x, tan.z);
        for (const sd of [-1, 1]) { const q = new T.Vector3(tan.z, 0, -tan.x).multiplyScalar(12.5 * sd).add(p);
          let ok = true; for (let k = 0; k < samples.length; k += 2) { const dx = samples[k].x - q.x, dz = samples[k].z - q.z; if (dx * dx + dz * dz < 110) { ok = false; break; } } if (!ok) continue;
          dm.position.set(q.x, 0.45, q.z); dm.rotation.set(0, yaw, 0); dm.updateMatrix(); walls.setMatrixAt(wi, dm.matrix);
          dm.position.y = 0.93; dm.updateMatrix(); strips.setMatrixAt(wi, dm.matrix);
          const band = Math.floor(i / 5) % 3; col.set(band === 0 ? 0xFFC72C : 0xcfd6de); col.multiplyScalar(band === 0 ? 1 : 0.3); strips.setColorAt(wi, col); wi++; } }
      walls.count = wi; strips.count = wi; world.add(walls); world.add(strips); this._strips = strips; }
    // speed streaks
    const SKN = low ? 120 : 260; const stp = new Float32Array(SKN * 6);
    for (let i = 0; i < SKN; i++) { let x = (Math.random() - 0.5) * 30; if (Math.abs(x) < 2.6) x = Math.sign(x || 1) * (2.6 + Math.random() * 3); const y = 0.2 + Math.random() * 6.5, z = (Math.random() - 0.5) * 90; stp.set([x, y, z, x, y, z + 1], i * 6); }
    const skg = new T.BufferGeometry(); skg.setAttribute('position', new T.BufferAttribute(stp, 3));
    const streaks = new T.LineSegments(skg, new T.LineBasicMaterial({ color: 0xdfe8f2, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending })); streaks.frustumCulled = false; streaks.visible = false; scene.add(streaks);

    // night environment: sky, grandstand, start gantry, garage turntable, number wall
    const E = { glowMats, glowT, headMat, strips: this._strips, gLights: [] };
    { const skyMat = new T.ShaderMaterial({ side: T.BackSide, depthWrite: false, uniforms: { top: { value: new T.Color(0x01030a) }, mid: { value: new T.Color(0x0e1c44) }, glow: { value: new T.Color(0x4a1e46) } },
        vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader: 'uniform vec3 top; uniform vec3 mid; uniform vec3 glow; varying vec3 vP; void main(){ float h = vP.y; vec3 c = mix(mid, top, smoothstep(0.0, 0.5, h)); c += glow * pow(1.0 - clamp(abs(h), 0.0, 1.0), 12.0) * 0.7; gl_FragColor = vec4(c, 1.0); }' });
      const sky = new T.Mesh(new T.SphereGeometry(900, 32, 16), skyMat); sky.position.set(cx, 0, cz); sky.frustumCulled = false; sky.renderOrder = -10; scene.add(sky); E.sky = sky; }
    { const gs = new T.Group(); const sm = new T.MeshStandardMaterial({ color: 0x121a33, roughness: 0.8, metalness: 0.15 });
      for (let k = 0; k < 6; k++) { const hgt = 0.9 + k * 0.9; const mm = new T.Mesh(new T.BoxGeometry(3, hgt, 116), sm); mm.position.set(-24 - k * 3, hgt / 2, 0); gs.add(mm); }
      const roof = new T.Mesh(new T.BoxGeometry(21, 0.35, 120), new T.MeshStandardMaterial({ color: 0x0a0f1f, roughness: 0.6, metalness: 0.4 })); roof.position.set(-32, 9.2, 0); gs.add(roof);
      const CN = low ? 1600 : 3600, cp = new Float32Array(CN * 3), cc = new Float32Array(CN * 3), pal = [0x1b2a5c, 0xE4002B, 0xFFC72C, 0xdfe4ee, 0x2a3350, 0x1b2a5c], col = new T.Color();
      for (let i = 0; i < CN; i++) { const k = (Math.random() * 6) | 0; cp.set([-24 - k * 3 + (Math.random() - 0.5) * 2.4, 1.25 + k * 0.9, (Math.random() - 0.5) * 112], i * 3); col.set(pal[(Math.random() * pal.length) | 0]).multiplyScalar(0.55); cc.set([col.r, col.g, col.b], i * 3); }
      const cg = new T.BufferGeometry(); cg.setAttribute('position', new T.BufferAttribute(cp, 3)); cg.setAttribute('color', new T.BufferAttribute(cc, 3));
      gs.add(new T.Points(cg, new T.PointsMaterial({ size: 0.42, vertexColors: true })));
      const FN = 40, fa = new Float32Array(FN * 3).fill(-99); const fg = new T.BufferGeometry(); fg.setAttribute('position', new T.BufferAttribute(fa, 3));
      const fl = new T.Points(fg, new T.PointsMaterial({ map: glowTex, size: 2.2, color: 0xffffff, transparent: true, depthWrite: false, blending: T.AdditiveBlending })); fl.frustumCulled = false; gs.add(fl); E.flash = { geo: fg, arr: fa, n: FN };
      const bc = document.createElement('canvas'); bc.width = 2048; bc.height = 96; const bx = bc.getContext('2d'); bx.fillStyle = '#060a18'; bx.fillRect(0, 0, 2048, 96); bx.font = 'italic 900 58px ' + this.fontA; bx.textBaseline = 'middle';
      ['CAR 21', 'CIRCUIT 21', 'NIGHT RACE', 'RB22', 'KRISH'].forEach((s, i) => { bx.fillStyle = i % 2 ? '#FFC72C' : '#eef0f2'; bx.fillText(s, 40 + i * 410, 52); bx.fillStyle = '#E4002B'; bx.fillRect(370 + i * 410, 30, 10, 40); });
      const bt = new T.CanvasTexture(bc); bt.colorSpace = T.SRGBColorSpace; bt.wrapS = T.RepeatWrapping; bt.repeat.set(3, 1);
      const board = new T.Mesh(new T.PlaneGeometry(110, 2.2), new T.MeshBasicMaterial({ map: bt, transparent: true, opacity: 0 })); board.position.set(-22.3, 7.2, 0); board.rotation.y = Math.PI / 2; gs.add(board); E.board = board;
      world.add(gs); }
    { const u = 14 / trackLen, gp = curve.getPointAt(u), gt = curve.getTangentAt(u); const gy = new T.Group(); gy.position.copy(gp); gy.rotation.y = Math.atan2(gt.x, gt.z); world.add(gy);
      const dm = new T.MeshStandardMaterial({ color: 0x151b2b, roughness: 0.5, metalness: 0.6 });
      [-1, 1].forEach(s => { const post = new T.Mesh(new T.BoxGeometry(0.35, 6.6, 0.35), dm); post.position.set(s * 9.5, 3.3, 0); gy.add(post); });
      const beam = new T.Mesh(new T.BoxGeometry(19.4, 0.5, 0.5), dm); beam.position.y = 6.4; gy.add(beam);
      for (let i = 0; i < 5; i++) { const x = (i - 2) * 1.15; const box = new T.Mesh(new T.BoxGeometry(0.75, 1.7, 0.3), new T.MeshStandardMaterial({ color: 0x07090f, roughness: 0.6 })); box.position.set(x, 5.4, 0); gy.add(box);
        const lm = new T.MeshBasicMaterial({ color: 0x22060a }); [0.35, -0.35].forEach(yy => { const c = new T.Mesh(new T.CircleGeometry(0.24, 24), lm); c.position.set(x, 5.4 + yy, -0.16); c.rotation.y = Math.PI; gy.add(c); });
        const sp = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: 0xff2414, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending })); sp.scale.set(2.4, 2.4, 1); sp.position.set(x, 5.05, -0.4); gy.add(sp); E.gLights.push({ mat: lm, spr: sp }); } }
    { const p0 = curve.getPointAt(0); const tt = new T.Group(); tt.position.set(p0.x, 0, p0.z); world.add(tt);
      tt.add(new T.Mesh(new T.CylinderGeometry(3.6, 3.6, 0.04, 64), new T.MeshStandardMaterial({ color: 0x0b1226, roughness: 0.3, metalness: 0.85 })));
      const ring = new T.Mesh(new T.TorusGeometry(3.6, 0.035, 8, 160), new T.MeshBasicMaterial({ color: 0xFFC72C, transparent: true })); ring.rotation.x = Math.PI / 2; ring.position.y = 0.03; tt.add(ring);
      const ring2 = new T.Mesh(new T.TorusGeometry(2.9, 0.012, 6, 160), new T.MeshBasicMaterial({ color: 0x46f0ff, transparent: true, opacity: 0.5 })); ring2.rotation.x = Math.PI / 2; ring2.position.y = 0.03; tt.add(ring2);
      E.turn = tt; E.ring = ring; E.ring2 = ring2;
      const wc = document.createElement('canvas'); wc.width = 2048; wc.height = 680; const wx = wc.getContext('2d'); wx.textAlign = 'center'; wx.textBaseline = 'alphabetic';
      wx.font = 'italic 900 600px ' + this.fontA; wx.lineWidth = 6; wx.strokeStyle = 'rgba(255,199,44,0.85)'; wx.strokeText('21', 1024, 560); wx.fillStyle = 'rgba(255,199,44,0.10)'; wx.fillText('21', 1024, 560);
      wx.font = '500 34px ' + this.fontM; wx.fillStyle = 'rgba(238,240,242,0.7)'; wx.fillText('GARAGE 21  ·  KRISH  ·  CHASSIS RB22  ·  2028', 1024, 640);
      const wt = new T.CanvasTexture(wc); wt.colorSpace = T.SRGBColorSpace;
      const wall = new T.Mesh(new T.PlaneGeometry(21, 7), new T.MeshBasicMaterial({ map: wt, transparent: true, depthWrite: false })); wall.position.set(p0.x - 10, 3.0, p0.z - 6.5); wall.rotation.y = Math.PI / 2; world.add(wall); E.wall = wall;
      const strip = new T.Mesh(new T.PlaneGeometry(26, 0.12), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true })); strip.position.set(p0.x, 7.4, p0.z); strip.rotation.x = Math.PI / 2; world.add(strip); E.strip = strip; }
    { const fs = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: 0xFFC72C, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending })); fs.visible = false; scene.add(fs); E.focus = fs; }

    // car
    const C = this.buildCar(T, glowTex); C.car.rotation.order = 'YXZ'; const car = C.car; world.add(car);

    // lights
    const hemi = new T.HemisphereLight(0x8fa6c8, 0x0b0b0b, 0.35); world.add(hemi);
    const key = new T.SpotLight(0xfff2e0, 520, 45, 0.6, 0.65, 1.6); world.add(key); world.add(key.target);
    const rim = new T.DirectionalLight(0x9fc2ff, 1.4); world.add(rim); world.add(rim.target);

    // rain
    const RN = low ? 700 : 1800; const rp = new Float32Array(RN * 6); const rv = new Float32Array(RN);
    for (let i = 0; i < RN; i++) { const x = (Math.random() - 0.5) * 80, y = Math.random() * 30, z = (Math.random() - 0.5) * 80; rp.set([x, y, z, x, y - 0.7, z], i * 6); rv[i] = 18 + Math.random() * 10; }
    const rg = new T.BufferGeometry(); rg.setAttribute('position', new T.BufferAttribute(rp, 3));
    const rain = new T.LineSegments(rg, new T.LineBasicMaterial({ color: 0xa6bcd2, transparent: true, opacity: 0.32, depthWrite: false })); rain.frustumCulled = false; scene.add(rain);

    // spray
    const SN = 500; const spp = new Float32Array(SN * 3).fill(-999); const spv = new Float32Array(SN * 3); const spl = new Float32Array(SN); let spi = 0;
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(spp, 3));
    const spray = new T.Points(sg, new T.PointsMaterial({ map: glowTex, size: 0.9, color: 0xc9d3dc, transparent: true, opacity: 0.16, depthWrite: false })); spray.frustumCulled = false; scene.add(spray);

    const bg = new T.Color(0x060b1c); scene.fog = new T.FogExp2(0x060b1c, 0.011);
    const setWeather = w => {
      const wet = w === 'wet';
      scene.fog.color.copy(bg); G_fog = wet ? 0.011 : 0.0065; this.fogBase = G_fog;
      groundMat.opacity = wet ? 0.66 : 0.92; outer.material.color.set(0x0a0f1e);
      hemi.intensity = wet ? 0.35 : 0.55; hemi.color.set(0x8fa6d8); rim.intensity = wet ? 1.4 : 1.8; rim.color.set(0x9fc2ff);
      key.intensity = wet ? 520 : 440; this.keyBase = key.intensity; this.rimBase = wet ? 1.4 : 1.8; scene.environmentIntensity = wet ? 0.75 : 0.9; renderer.toneMappingExposure = 1.05;
      rain.visible = wet; this.wet = wet;
      if (this.au) this.au.rg.gain.setTargetAtTime(wet && this.state.audio ? 0.018 : 0, this.au.ctx.currentTime, 0.3);
    };
    let G_fog = 0.011;
    setWeather(this.state.weather);

    this.gl = { T, renderer, scene, camera, world, ground, outer, car, C, curve, trackLen, samples, key, rim, hemi, rain, rp, rv, RN, spray, spp, spv, spl, SN, get spi() { return spi; }, set spi(v) { spi = v; }, bg, setWeather,
      v: new T.Vector3(), v2: new T.Vector3(), camPos: new T.Vector3(), camLook: new T.Vector3(), clear: new T.Color(), flashC: new T.Color(0x3a4656), first: true, shift: 0, fov: 38 };
    Object.assign(this.gl, { streaks, stp, SKN, env: E, prof, PN, pds, mapT });
    this.stops = stops; this.buildMap();
    { const pts = samples.concat([samples[0]]).map(q => mapPt(q).join(',')).join(' ');
      const mapStops = stops.map(s => { const [x, y] = mapPt(curve.getPointAt(s.d / trackLen)); return { x, y }; });
      this.setState({ mapPts: pts, mapStops, stopTags: stops.map(s => 'S' + s.sector + ' · TURN ' + s.turn) }); }
    try { renderer.compile(scene, camera); this.renderGL(0.016, 1, performance.now()); } catch (e) { console.warn(e); }
    await new Promise(r => requestAnimationFrame(() => r()));
    if (this.dead || this.mountId !== mountId) return;
    await this.restoreModel();
    this.sceneReady = true;
  }

  buildCar(T, glowTex) {
    const M = {
      livery: new T.MeshPhysicalMaterial({ name: 'livery', color: 0x16244f, metalness: 0.45, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.05 }),
      carbon: new T.MeshStandardMaterial({ name: 'carbon', color: 0x111317, metalness: 0.5, roughness: 0.38 }),
      white: new T.MeshStandardMaterial({ name: 'white', color: 0xE9E7E1, metalness: 0.1, roughness: 0.35 }),
      rubber: new T.MeshStandardMaterial({ name: 'rubber', color: 0x0c0c0d, metalness: 0, roughness: 0.82 }),
      rim: new T.MeshStandardMaterial({ name: 'rim', color: 0x30343b, metalness: 0.95, roughness: 0.28 }),
      metal: new T.MeshStandardMaterial({ name: 'metal', color: 0xa6abb3, metalness: 1, roughness: 0.22 }),
      red: new T.MeshBasicMaterial({ name: 'rainLight', color: 0xff1a1a }),
      cyan: new T.MeshBasicMaterial({ name: 'ersGlow', color: 0x46f0ff }),
      band: new T.MeshBasicMaterial({ name: 'compound', color: 0xE8352B })
    };
    const car = new T.Group(); car.name = 'car11';
    const add = (parent, geo, mat, x, y, z, rx = 0, ry = 0, rz = 0, name) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); if (name) m.name = name; parent.add(m); return m; };
    const B = (w, h, d) => new T.BoxGeometry(w, h, d);
    const grp = n => { const gg = new T.Group(); gg.name = n; car.add(gg); return gg; };

    const ch = grp('chassis');
    add(ch, B(1.2, 0.05, 3.7), M.carbon, 0, 0.1, -0.35, 0, 0, 0, 'floor');
    add(ch, B(0.74, 0.46, 2.1), M.livery, 0, 0.38, 0.55, 0, 0, 0, 'tub');
    add(ch, B(0.76, 0.12, 2.12), M.carbon, 0, 0.19, 0.55, 0, 0, 0, 'tubLower');
    const nose = add(ch, new T.CylinderGeometry(0.06, 0.3, 1.75, 32), M.livery, 0, 0.33, 2.45, Math.PI / 2, 0, 0, 'nose'); nose.scale.set(1.35, 1, 0.6);
    add(ch, B(0.48, 0.04, 0.78), M.carbon, 0, 0.615, 0.32, 0, 0, 0, 'cockpitRim');
    add(ch, new T.SphereGeometry(0.135, 32, 16), M.white, 0, 0.72, 0.26, 0, 0, 0, 'helmet');
    add(ch, B(0.2, 0.05, 0.02), M.carbon, 0, 0.74, 0.39, 0, 0, 0, 'visor');
    [-1, 1].forEach(s => {
      const sp = add(ch, new T.CapsuleGeometry(0.22, 1.25, 8, 24), M.livery, s * 0.6, 0.36, -0.2, Math.PI / 2, 0, 0, 'sidepod'); sp.scale.set(1.25, 1, 1.05);
      add(ch, B(0.42, 0.3, 0.04), M.carbon, s * 0.6, 0.38, 0.64, 0, 0, 0, 'inlet');
      add(ch, B(0.006, 0.05, 1.9), M.white, s * 0.374, 0.52, 0.55, 0, 0, 0, 'pinstripe');
      add(ch, B(0.5, 0.025, 0.07), M.carbon, s * 0.6, 0.44, 1.6, 0, 0, 0, 'wishbone');
      add(ch, B(0.5, 0.025, 0.07), M.carbon, s * 0.6, 0.26, 1.7, 0, 0, 0, 'wishbone');
      add(ch, B(0.46, 0.025, 0.07), M.carbon, s * 0.58, 0.44, -1.6, 0, 0, 0, 'wishbone');
      add(ch, B(0.46, 0.025, 0.07), M.carbon, s * 0.58, 0.28, -1.55, 0, 0, 0, 'wishbone');
    });
    add(ch, B(0.22, 0.2, 0.6), M.carbon, 0, 0.33, -2.15, 0, 0, 0, 'crash');
    add(ch, B(0.16, 0.08, 0.02), M.red, 0, 0.33, -2.46, 0, 0, 0, 'rainLight');
    add(ch, B(1.0, 0.18, 0.35), M.carbon, 0, 0.18, -2.05, -0.35, 0, 0, 'diffuser');
    const glow = new T.Sprite(new T.SpriteMaterial({ map: glowTex, color: 0xff2a2a, blending: T.AdditiveBlending, depthWrite: false, transparent: true }));
    glow.scale.set(1.8, 1.8, 1); glow.position.set(0, 0.33, -2.52); ch.add(glow);
    const redPt = new T.PointLight(0xff2020, 4, 9, 2); redPt.position.set(0, 0.4, -2.8); ch.add(redPt);
    const sc = document.createElement('canvas'); sc.width = sc.height = 256; const sg = sc.getContext('2d'); const gr = sg.createRadialGradient(128, 128, 10, 128, 128, 128); gr.addColorStop(0, 'rgba(0,0,0,.85)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); sg.fillStyle = gr; sg.fillRect(0, 0, 256, 256);
    const shadow = new T.Mesh(new T.PlaneGeometry(2.8, 7), new T.MeshBasicMaterial({ map: new T.CanvasTexture(sc), transparent: true, depthWrite: false })); shadow.rotation.x = -Math.PI / 2; shadow.position.set(0, 0.01, -0.2); car.add(shadow);

    const cover = grp('engineCover');
    const ec = add(cover, new T.CylinderGeometry(0.1, 0.33, 2.1, 32), M.livery, 0, 0.6, -1.1, -Math.PI / 2, 0, 0, 'engineCover'); ec.scale.set(0.9, 1, 1.25);
    add(cover, B(0.26, 0.3, 0.45), M.carbon, 0, 0.88, -0.18, 0, 0, 0, 'airbox');
    add(cover, B(0.02, 0.38, 1.1), M.livery, 0, 1.0, -1.45, 0, 0, 0, 'sharkFin');
    const nc = document.createElement('canvas'); nc.width = 256; nc.height = 128; const ng = nc.getContext('2d'); ng.fillStyle = '#FFC72C'; ng.font = 'italic 900 112px ' + this.fontA; ng.textAlign = 'center'; ng.textBaseline = 'middle'; ng.fillText('21', 128, 70);
    const nt = new T.CanvasTexture(nc); nt.colorSpace = T.SRGBColorSpace; const nm = new T.MeshStandardMaterial({ name: 'decal', map: nt, transparent: true, roughness: 0.4, polygonOffset: true, polygonOffsetFactor: -2 });
    [-1, 1].forEach(s => add(cover, new T.PlaneGeometry(0.62, 0.31), nm, s * 0.012, 1.0, -1.45, 0, s * Math.PI / 2, 0, 'number'));
    add(ch, new T.PlaneGeometry(0.34, 0.17), nm, 0, 0.445, 2.0, -Math.PI / 2 + 0.12, 0, Math.PI, 'noseNumber');

    const pu = grp('powerUnit');
    add(pu, B(0.4, 0.3, 0.85), M.metal, 0, 0.42, -1.05, 0, 0, 0, 'block');
    for (let i = 0; i < 3; i++) [-1, 1].forEach(s => add(pu, new T.CylinderGeometry(0.06, 0.06, 0.24, 20), M.rim, s * 0.1, 0.62, -0.8 - i * 0.26, 0, 0, s * 0.45, 'cylinder'));
    add(pu, new T.TorusGeometry(0.1, 0.045, 16, 32), M.metal, 0, 0.5, -1.6, 0, Math.PI / 2, 0, 'turbo');
    add(pu, new T.CylinderGeometry(0.05, 0.05, 0.5, 16), M.rim, 0, 0.5, -1.95, Math.PI / 2, 0, 0, 'exhaust');

    const ers = grp('ERS');
    add(ers, B(0.56, 0.12, 0.6), M.carbon, 0, 0.2, 0.05, 0, 0, 0, 'battery');
    for (let i = 0; i < 4; i++) add(ers, B(0.5, 0.012, 0.025), M.cyan, 0, 0.262, -0.18 + i * 0.15, 0, 0, 0, 'cell');

    const halo = grp('halo');
    const hr = add(halo, new T.TorusGeometry(0.34, 0.03, 16, 64, Math.PI), M.rim, 0, 0.8, 0.12, Math.PI / 2, 0, 0, 'haloRing'); hr.scale.set(1, 1.35, 1);
    [-1, 1].forEach(s => add(halo, B(0.035, 0.2, 0.035), M.rim, s * 0.34, 0.7, 0.1, 0, 0, 0, 'haloLeg'));
    add(halo, B(0.045, 0.045, 0.36), M.rim, 0, 0.7, 0.72, 0.6, 0, 0, 'haloPillar');

    const sens = grp('sensors');
    add(sens, B(0.2, 0.05, 0.09), M.white, 0, 1.06, -0.18, 0, 0, 0, 'tcam');
    add(sens, new T.CylinderGeometry(0.008, 0.008, 0.5, 8), M.metal, 0, 0.36, 3.35, Math.PI / 2, 0, 0, 'pitot');
    [-1, 1].forEach(s => add(sens, B(0.05, 0.05, 0.12), M.carbon, s * 0.4, 0.66, 0.72, 0, 0, 0, 'sideCam'));
    [[0, 1.09, -0.18], [0, 0.36, 3.6], [-0.4, 0.7, 0.72], [0.4, 0.7, 0.72]].forEach(p => add(sens, new T.SphereGeometry(0.024, 12, 8), M.cyan, p[0], p[1], p[2], 0, 0, 0, 'sensorLed'));

    const fw = grp('frontWing');
    add(fw, B(1.9, 0.025, 0.42), M.carbon, 0, 0.1, 3.05, 0, 0, 0, 'mainplane');
    add(fw, B(1.8, 0.02, 0.22), M.livery, 0, 0.17, 2.92, 0.35, 0, 0, 'flap1');
    add(fw, B(1.7, 0.02, 0.18), M.livery, 0, 0.24, 2.8, 0.6, 0, 0, 'flap2');
    [-1, 1].forEach(s => add(fw, B(0.025, 0.26, 0.62), M.carbon, s * 0.95, 0.19, 2.97, 0, 0, 0, 'endplate'));
    [-1, 1].forEach(s => add(fw, B(0.03, 0.2, 0.12), M.carbon, s * 0.1, 0.22, 3.0, 0, 0, 0, 'pylon'));

    const rw = grp('rearWing');
    [-1, 1].forEach(s => add(rw, B(0.025, 0.75, 0.8), M.carbon, s * 0.5, 0.8, -2.25, 0, 0, 0, 'rwEndplate'));
    add(rw, B(1.0, 0.035, 0.38), M.carbon, 0, 0.98, -2.3, 0.12, 0, 0, 'rwMain');
    const flap = new T.Group(); flap.position.set(0, 1.1, -2.12); flap.rotation.x = 0.55; rw.add(flap);
    add(flap, B(1.0, 0.025, 0.28), M.livery, 0, 0, -0.14, 0, 0, 0, 'drsFlap');
    add(rw, B(0.06, 0.5, 0.1), M.carbon, 0, 0.62, -2.25, 0, 0, 0, 'rwPylon');

    const wheels = [];
    [[0.82, 1.62, 0.32], [-0.82, 1.62, 0.32], [0.8, -1.6, 0.4], [-0.8, -1.6, 0.4]].forEach(([x, z, w]) => {
      const gw = grp('wheel'); gw.position.set(x, 0.36, z); const spin = new T.Group(); gw.add(spin);
      add(spin, new T.CylinderGeometry(0.36, 0.36, w, 48), M.rubber, 0, 0, 0, 0, 0, Math.PI / 2, 'tyre');
      add(spin, new T.CylinderGeometry(0.235, 0.235, w + 0.012, 32), M.rim, 0, 0, 0, 0, 0, Math.PI / 2, 'rim');
      [-1, 1].forEach(s => add(spin, new T.TorusGeometry(0.29, 0.012, 8, 64), M.band, s * (w / 2 + 0.004), 0, 0, 0, Math.PI / 2, 0, 'compoundBand'));
      for (let k = 0; k < 5; k++) add(spin, B(0.02, 0.42, 0.035), M.metal, (w / 2 + 0.009) * Math.sign(x), 0, 0, k * Math.PI / 5, 0, 0, 'spoke');
      wheels.push({ g: gw, spin, front: z > 0, side: Math.sign(x), base: gw.position.clone() });
    });

    const V = (x, y, z) => new T.Vector3(x, y, z);
    const parts = [
      { g: fw, off: V(0, 0.35, 2.0), rx: 0.12, label: 0, anchor: V(0, 0.2, 3.0) },
      { g: cover, off: V(0, 2.7, -0.5), rx: -0.15, with: [1] },
      { g: pu, off: V(0, 1.35, -0.3), label: 1, anchor: V(0, 0.62, -1.05) },
      { g: ers, off: V(-2.2, 0.55, 0.4), rz: 0.2, label: 2, anchor: V(0, 0.26, 0.05) },
      { g: halo, off: V(0, 1.25, 0.9), label: 3, anchor: V(0, 0.82, 0.45) },
      { g: sens, off: V(1.4, 2.0, 1.6), label: 4, anchor: V(0, 1.06, -0.18) },
      { g: rw, off: V(0, 0.7, -1.7), rx: -0.1 }
    ];
    wheels.forEach(w => parts.push({ g: w.g, base: w.base, off: V(w.side * 1.0, 0, w.front ? 0.25 : -0.25) }));
    parts.forEach((p, i) => { p.i = i; if (!p.base) p.base = p.g.position.clone(); });
    return { car, parts, wheels, flap, glow, redPt, shadow };
  }

  renderGL(dt, ts, now) {
    const G = this.gl, { renderer, scene, camera, world, car, curve, v, v2 } = G, C = G.C, E = G.env;
    const W = innerWidth, H = innerHeight, L = G.trackLen, sdt = Math.max(dt, 1e-4), tsec = now / 1000;
    const kf = r => 1 - Math.exp(-dt * r);
    const spring = (k, target, w, z) => { const s = G[k] || (G[k] = { x: target, v: 0 }); s.v += (-(w * w) * (s.x - target) - 2 * z * w * s.v) * dt; s.x += s.v * dt; return s.x; };
    const fp = this.state.fp, mode = fp ? 'fp' : (this.mode || 'hero'), hp = this.heroP || 0, raceOn = this.raceOn();
    let accel = 0, yaw;
    if (fp) {
      const f = this.fpS, k = this.keys, pv = f.v;
      const thr = k.has('w') || k.has('arrowup'), brk = k.has('s') || k.has('arrowdown'), Lk = k.has('a') || k.has('arrowleft'), Rk = k.has('d') || k.has('arrowright');
      f.v += (thr ? 14 : 0) * dt - (brk ? (f.v > 0 ? 30 : 10) : 0) * dt; f.v -= f.v * 0.14 * dt + (thr ? 0 : Math.sign(f.v) * 1.5 * dt);
      let best = 1e9, bi = 0; for (let i = 0; i < G.samples.length; i++) { const s = G.samples[i]; const d = (s.x - f.x) ** 2 + (s.z - f.z) ** 2; if (d < best) { best = d; bi = i; } }
      if (Math.sqrt(best) > 8.5) f.v -= f.v * 1.8 * dt;
      f.v = clamp(f.v, -10, this.state.drs ? 70 : 58);
      f.steer += (((Lk ? 1 : 0) - (Rk ? 1 : 0)) - f.steer) * kf(6);
      f.yaw += f.steer * dt * 2.4 * clamp(f.v / 12, -1, 1) / (1 + Math.abs(f.v) / 45);
      f.x += Math.sin(f.yaw) * f.v * dt; f.z += Math.cos(f.yaw) * f.v * dt;
      // lap timing: the clock starts on the first throttle from the grid; a lap only counts if it passed both
      // sector checkpoints, so cutting across the infield or reversing over the line can't set a time
      const N = G.samples.length;
      if (!f.t0 && thr) { f.t0 = now; f.cp = 0; this.setState({ fpRun: true }); }
      if (bi > N * 0.3 && bi < N * 0.45) f.cp |= 1; else if (bi > N * 0.6 && bi < N * 0.75 && f.cp & 1) f.cp |= 2;
      if (f.t0 && f.lastIdx > N * 0.9 && bi < N * 0.1) {
        const lt = now - f.t0;
        if (f.cp === 3) this.fpLapDone(lt); else if (lt > 4000) this.showToast('LAP INVALID · MISSED A SECTOR', '#E8352B');
        f.t0 = now; f.cp = 0;
      }
      f.lastIdx = bi;
      if (this.fpLapRef.current) { const s = fmt(f.t0 ? now - f.t0 : 0); if (this.fpLapRef.current.textContent !== s) this.fpLapRef.current.textContent = s; }
      car.position.set(f.x, 0, f.z); yaw = f.yaw; this.speed = f.v; accel = (f.v - pv) / sdt; G.d = null;
      C.wheels.forEach(w => { if (w.front) w.g.rotation.y = f.steer * 0.35; });
    } else {
      // scroll sets the target; the car follows a corner-aware speed profile with jerk-limited throttle and brake
      const D = raceOn && mode === 'race' ? this.mapD(this.sS) : 0;
      if (G.d == null) { G.d = D; G.vel = 0; G.a = 0; G.acc_t = 0; }
      if (mode === 'hero' && G.d > 0.5) { G.d = 0; G.vel = 0; G.a = 0; G.off = null; G.camYaw = null; G.yawPrev = null; G.cut = null; }
      const pace = PACE[this.props.drivePace] || 1, boost = this.state.drs ? 1.25 : 1;
      if (!this.reduce && !G.cut && Math.abs(D - G.d) > 230) G.cut = { t: 0, done: false };
      if (G.cut) { const c = G.cut; c.t += dt;
        if (!c.done && c.t >= 0.38) { c.done = true; const s = Math.sign(D - G.d) || 1; G.d = clamp(D - s * 30, 0, L * 0.999); G.vel = s * Math.min(18, this.profAt(G.d)) * pace; G.a = 0; G.off = null; G.camYaw = null; G.yawPrev = null; G.yr = 0; }
        if (c.t >= 1.15) G.cut = null; }
      if (this.reduce) { G.d = D; G.vel = 0; G.a = 0; }
      else {
        G.acc_t = Math.min(G.acc_t + dt, 0.1); const h = 1 / 120;
        while (G.acc_t >= h) { G.acc_t -= h;
          const gap = D - G.d, ag = Math.abs(gap);
          const lim = this.profAt(G.d) * pace * boost, cap = gap >= 0 ? lim : Math.min(lim, 15);
          const vDes = ag < 1.2 ? 0 : Math.sign(gap) * Math.min(cap, Math.sqrt(2 * 6.5 * (ag - 1.2)));
          const aCmd = clamp((vDes - G.vel) * 1.6, -11, 5.2 * pace * boost);
          G.a += clamp(aCmd - G.a, -30 * h, 18 * h);
          const nv = G.vel + G.a * h;
          if (vDes === 0 && G.vel !== 0 && Math.sign(nv) !== Math.sign(G.vel)) { G.vel = 0; G.a = 0; } else G.vel = nv;
          if (vDes === 0 && Math.abs(G.vel) < 0.05 && Math.abs(G.a) < 0.2) { G.vel = 0; G.a = 0; }
          G.d += G.vel * h;
        }
      }
      G.d = clamp(G.d, 0, L * 0.99999); G.u = G.d / L; accel = G.a;
      curve.getPointAt(G.u, v); car.position.copy(v);
      curve.getTangentAt(((G.d + 2.5) % L) / L, v2); const ya = Math.atan2(v2.x, v2.z);
      curve.getTangentAt(Math.max(0, G.d - 2.5) / L, v2); const yb = Math.atan2(v2.x, v2.z);
      const dy = Math.atan2(Math.sin(ya - yb), Math.cos(ya - yb)); G.curv = dy / 5; yaw = yb + dy / 2; this.speed = G.vel;
    }
    const prevYaw = G.yawPrev == null ? yaw : G.yawPrev; const dyaw = Math.atan2(Math.sin(yaw - prevYaw), Math.cos(yaw - prevYaw)); G.yawPrev = yaw;
    const sp = this.speed, asp = Math.abs(sp), sk = clamp(asp / 46);
    G.idleT = asp < 0.3 ? (G.idleT || 0) + dt : 0;
    const yrRaw = fp ? clamp(dyaw / sdt, -3, 3) : (G.curv || 0) * sp;
    G.yr = (G.yr || 0) + (yrRaw - (G.yr || 0)) * kf(fp ? 5 : 8);
    G.acc = (G.acc || 0) + (accel - (G.acc || 0)) * kf(fp ? 6 : 10);
    G.slip = (G.slip || 0) + (clamp(G.yr * asp * 0.0018, -0.08, 0.08) - (G.slip || 0)) * kf(3);
    car.rotation.y = yaw + G.slip * Math.sign(sp || 1);
    car.rotation.x = spring('pitchS', clamp(-G.acc * 0.0034, -0.03, 0.03), 7, 0.5);
    car.rotation.z = spring('rollS', clamp(G.yr * asp * 0.0011, -0.045, 0.045), 6, 0.55);
    car.position.y = Math.sin(now * 0.047) * 0.003 * sk;
    if (!fp) { const st = clamp(Math.atan(3.4 * (G.curv || 0)) * 1.4 * Math.sign(sp || 1), -0.3, 0.3); C.wheels.forEach(w => { if (w.front) w.g.rotation.y += (st - w.g.rotation.y) * kf(6); }); }

    // teardown: overview, then one part at a time
    let focus = -1, open = 0; const cardO = [0, 0, 0, 0, 0];
    if (mode === 'hero') {
      open = sstep(0.08, 0.16, hp) * (1 - sstep(0.88, 0.96, hp));
      const k = Math.floor((hp - 0.18) / 0.14); if (k >= 0 && k < 5) { focus = k; const lt = (hp - 0.18) / 0.14 - k; cardO[k] = sstep(0.16, 0.34, lt) * (1 - sstep(0.84, 0.98, lt)); }
    }
    this.ex = open;
    C.parts.forEach(p => {
      const hit = focus >= 0 && (p.label === focus || (p.with && p.with.indexOf(focus) >= 0));
      const tgt = open * (hit ? 1.25 : focus >= 0 ? 0.3 : 0.85);
      p.e = (p.e || 0) + (tgt - (p.e || 0)) * kf(3.2); const e = p.e;
      p.g.position.copy(p.base).addScaledVector(p.off, e);
      if (e > 0.001) p.g.position.y += Math.sin(tsec * 1.1 * ts + p.i * 1.7) * 0.035 * e;
      p.g.rotation.x = (p.rx || 0) * e + (e > 0.001 ? Math.sin(tsec * 0.8 * ts + p.i) * 0.025 * e : 0); p.g.rotation.z = (p.rz || 0) * e;
    });
    C.wheels.forEach(w => w.spin.rotation.x += (sp / (w.r || 0.36)) * dt);
    C.flap.rotation.x += ((this.state.drs ? 0.04 : 0.55) - C.flap.rotation.x) * kf(10);
    const braking = G.acc < -3 && asp > 2;
    const pulse = braking ? 1.6 : this.wet ? (Math.sin(tsec * 8 * ts) > 0 ? 1 : 0.25) : 0.7;
    C.glow.material.opacity = Math.min(1, pulse); const gsz = braking ? 2.9 : 1.8; C.glow.scale.set(gsz, gsz, 1); C.redPt.intensity = 4 * pulse;
    car.updateMatrixWorld(true);

    // circuit lights switch on in a wave once the car leaves the garage
    const rt = this.reduce ? 9 : this.introStart ? (now - this.introStart) / 1000 : 0;
    const lt = rt - INTRO.lights, keyUp = sstep(0.5, 2.6, lt), rv = lerp(INTRO.dim, 1, keyUp);
    G.key.intensity = (this.keyBase || 520) * rv; G.rim.intensity = (this.rimBase || 1.4) * (0.2 + 0.8 * bankOn(INTRO.banks.rim, rt));
    renderer.toneMappingExposure = 1.05 * (0.4 + 0.3 * sstep(0.5, 1.9, lt) + 0.3 * sstep(pullAt(0), pullAt(INTRO.lit), rt));
    // the backdrop starts near-black for the close-up and lifts to the garage tone as the banks come on
    const bgK = 0.35 + 0.65 * sstep(pullAt(0), pullAt(INTRO.lit), rt); scene.fog.color.copy(G.bg).multiplyScalar(bgK);
    const ringR = bankOn(INTRO.banks.ring, rt), wallR = bankOn(INTRO.banks.wall, rt);
    const lonT = mode === 'hero' ? 0 : 1; G.lon = G.lon == null ? lonT : G.lon; G.lon += clamp(lonT - G.lon, -dt * 0.9, dt * 0.45); const lon = G.lon;
    if (E) {
      E.glowMats.forEach((m, i) => { m.opacity = 0.85 * clamp((lon * 1.3 - E.glowT[i]) / 0.25); });
      E.headMat.color.setScalar(0.08 + 0.92 * lon); if (E.strips) E.strips.material.color.setScalar(0.12 + 0.88 * lon);
      const gar = 1 - sstep(0, 0.4, lon);
      E.wall.material.opacity = 0.95 * gar * wallR * (1 - 0.5 * open); E.wall.visible = gar * wallR > 0.01; E.strip.material.opacity = gar * lerp(0.02, 1, keyUp); E.strip.visible = gar > 0.01;
      E.turn.visible = gar > 0.01; E.ring.material.opacity = (0.7 + 0.3 * Math.sin(tsec * 2.2)) * gar * ringR; E.ring2.material.opacity = 0.5 * gar * ringR; E.ring.scale.setScalar(0.6 + 0.4 * ringR); E.ring2.scale.setScalar(0.5 + 0.5 * ringR);
      E.board.material.opacity = sstep(0.5, 1, lon);
      scene.fog.density = lerp(0.028, this.fogBase || 0.011, lon);
      const lit = this.state.race === 'lights' ? this.state.glit : 0;
      E.gLights.forEach((g, i) => { const on = i < lit; g.mat.color.setHex(on ? 0xff2414 : 0x22060a); g.spr.material.opacity = on ? 1 : 0; });
      if (E.flash) { const fa = E.flash.arr; for (let i = 0; i < E.flash.n; i++) { if (Math.random() < 0.035 * lon) { fa[i * 3] = -24 - Math.random() * 16; fa[i * 3 + 1] = 1.5 + Math.random() * 5; fa[i * 3 + 2] = (Math.random() - 0.5) * 112; } else if (Math.random() < 0.35) fa[i * 3 + 1] = -99; } E.flash.geo.attributes.position.needsUpdate = true; }
    }

    // camera
    // scrolling or dragging during the opening shot plays the rest of it at 3x
    if (this.introStart && !this.reduce && (hp > 0.02 || this.spin) && now - this.introStart < INTRO.total * 1000) this.introStart -= dt * 2000;
    const it = this.introStart ? (this.reduce ? INTRO.total : (now - this.introStart) / 1000 * ts) : 0, intro = clamp(it / INTRO.total);
    const creep = sstep(0, INTRO.hold, it), pk = clamp((it - INTRO.hold) / (INTRO.total - INTRO.hold)), ie = pk * pk * pk * (pk * (pk * 6 - 15) + 10);
    const camMode = this.props.camera || 'Chase', local = v, look = v2; let snap = 2.2, fovT = 48, hero = false;
    if (fp) { local.set(0, 2.1, -7 - sk * 2); look.set(0, 0.8, 7); snap = 5; fovT = 48 + sk * 12; }
    else if (mode === 'hero') {
      hero = true; snap = intro < 1 || this.spin || Math.abs(this.orbitV || 0) > 0.05 ? 9 : 2.6;
      if (!this.spin) { this.orbit = (this.orbit || 0) + (this.orbitV || 0) * dt; this.orbitV = (this.orbitV || 0) * Math.exp(-dt * 2.6); }
      if (hp > 0.03) { const home = Math.round((this.orbit || 0) / (Math.PI * 2)) * Math.PI * 2; this.orbit += (home - this.orbit) * kf(3); this.orbitV = 0; }
      const spinning = !!this.spin || Math.abs(this.orbitV || 0) > 0.05;
      const a0 = Math.PI * 0.5 - 0.6 + (this.orbit || 0) + (spinning ? 0 : Math.sin(tsec * 0.11) * 0.16) + (1 - ie) * (-1.35 + 0.35 * creep), r0 = lerp(2.9 - 0.4 * creep, 8.4, ie);
      const land = [Math.sin(a0) * r0, lerp(0.26, 1.0, ie), Math.cos(a0) * r0, 0, lerp(0.32, 0.55, ie), lerp(1.2, 0, ie)];
      const keys = [0.03, 0.13, 0.25, 0.39, 0.53, 0.67, 0.81, 0.96];
      let i = 0; while (i < keys.length - 2 && hp > keys[i + 1]) i++;
      const t = hp < keys[0] ? 0 : sstep(0.3, 0.85, clamp((hp - keys[i]) / (keys[i + 1] - keys[i])));
      const anc = [0, 1, 2, 3, 4].map(() => null); C.parts.forEach(p => { if (p.label != null) anc[p.label] = [p.g.position.x + p.anchor.x - p.base.x, p.g.position.y + p.anchor.y - p.base.y, p.g.position.z + p.anchor.z - p.base.z]; });
      const shot = s => { if (s[3] !== null) return s; const q = anc[TD_SHOTS.indexOf(s) - 1] || [0, 0.6, 0]; return [q[0] + s[0], q[1] + s[1], q[2] + s[2], q[0], q[1], q[2]]; };
      const A = i === 0 ? land : shot(TD_SHOTS[i - 1]), B = shot(TD_SHOTS[i]);
      local.set(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t)); look.set(lerp(A[3], B[3], t), lerp(A[4], B[4], t), lerp(A[5], B[5], t));
      fovT = 34 + 4 * (1 - ie);
    } else if (!raceOn) { local.set(-1.7, 1.25, -6.4); look.set(0, 2.0, 14); snap = 1.6; fovT = 42; }
    else {
      const pull = spring('pullS', clamp(G.acc * 0.14, -1.3, 1.1), 3, 0.65);
      const tv = G.idleT > 1.8 && camMode !== 'T-Cam';
      if (tv) { const s = this.panelSide || 1, a = (0.95 + Math.min(1, (G.idleT - 1.8) / 8) * 0.7) * s; local.set(Math.sin(a) * 7.2, 1.35, Math.cos(a) * 7.2); look.set(0, 0.6, 0.4); snap = 0.8; fovT = 36; }
      else if (camMode === 'T-Cam') { local.set(0, 1.22, -0.3); look.set(0, 1.0, 12); snap = 14; fovT = 60 + sk * 10; }
      else { local.set(0, 1.45 + sk * 0.1, -5.8 - sk * 1.2 - pull); look.set(0, 0.95, 6 + sk * 3); snap = 2.2; fovT = 48 + sk * 12 + clamp(G.acc, 0, 8) * 0.5; }
    }
    if (!G.off) { G.off = local.clone(); G.lookOff = look.clone(); }
    G.off.lerp(local, kf(snap)); G.lookOff.lerp(look, kf(Math.max(snap, 3)));
    if (G.camYaw == null) G.camYaw = yaw;
    G.camYaw += Math.atan2(Math.sin(car.rotation.y - G.camYaw), Math.cos(car.rotation.y - G.camYaw)) * kf(hero ? 8 : fp ? 3.5 : camMode === 'T-Cam' ? 14 : 2.6);
    const place = (out, o, ang) => { const c = Math.cos(ang), s = Math.sin(ang); out.set(car.position.x + o.x * c + o.z * s, o.y + car.position.y, car.position.z - o.x * s + o.z * c); return out; };
    place(G.camPos, G.off, G.camYaw); place(G.camLook, G.lookOff, yaw);
    if (!this.reduce) {
      const hh = hero ? 0.03 : 0.012 + sk * 0.01;
      G.camPos.x += (Math.sin(now * 0.00062) * 0.6 + Math.sin(now * 0.0014 + 1) * 0.4) * hh;
      G.camPos.y += (Math.sin(now * 0.00071 + 2) * 0.6 + Math.sin(now * 0.0016) * 0.4) * hh + Math.sin(now * 0.052) * (camMode === 'T-Cam' ? 0.007 : 0.0035) * sk;
      if (this.rev > 0) { G.camPos.x += (Math.random() - 0.5) * 0.1 * this.rev; G.camPos.y += (Math.random() - 0.5) * 0.1 * this.rev; this.rev = Math.max(0, this.rev - dt * 1.5); }
    }
    camera.position.copy(G.camPos); camera.lookAt(G.camLook);
    G.roll = (G.roll || 0) + (((hero || this.reduce) ? 0 : clamp(-G.yr * sk * 0.1, -0.06, 0.06)) - (G.roll || 0)) * kf(2.4);
    camera.rotateZ(G.roll);
    G.fov += (fovT - G.fov) * kf(2); camera.fov = G.fov;
    const wide = W >= 980, land = mode === 'hero' ? 1 - sstep(0.03, 0.08, hp) : 0;
    const shiftT = fp || !wide ? 0 : mode === 'hero' ? land * W * 0.1 : raceOn ? (this.panelSide || 0) * W * 0.16 : 0;
    const shiftYT = fp ? 0 : -land * H * (wide ? 0.05 : 0.1);
    G.shift += (shiftT - G.shift) * kf(1.6); G.shiftY = (G.shiftY || 0) + (shiftYT - (G.shiftY || 0)) * kf(2);
    camera.aspect = W / H; camera.setViewOffset(W, H, -G.shift, -G.shiftY, W, H); camera.updateProjectionMatrix();

    G.key.position.copy(car.position).add(v.set(3, 10, 4)); G.key.target.position.copy(car.position);
    G.rim.position.copy(car.position).add(v.set(-6, 5, -9)); G.rim.target.position.copy(car.position);
    if (this.wet && !this.reduce && lon > 0.6 && Math.random() < dt / 18) this.flash = 1;
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 4);
    const fl = this.flash > 0 ? (this.flash > 0.6 || (this.flash > 0.2 && this.flash < 0.35) ? 1 : 0) : 0;
    G.hemi.intensity = (this.wet ? 0.35 : 0.55) * (0.45 + 0.55 * lon) * (0.15 + 0.85 * sstep(pullAt(0), pullAt(INTRO.lit), rt)) + fl * 3;

    if (this.wet) {
      const { rp, rv, RN } = G; G.rain.position.set(Math.round(camera.position.x), 0, Math.round(camera.position.z));
      if (!this.reduce) { const fx = Math.sin(yaw) * sp * 0.006, fz = Math.cos(yaw) * sp * 0.006;
        for (let i = 0; i < RN; i++) { const o = i * 6; let y = rp[o + 1] - rv[i] * dt * ts; if (y < 0) y += 30; rp[o + 1] = y; rp[o + 4] = y - 0.7 - sk * 0.3; rp[o + 3] = rp[o] + fx; rp[o + 5] = rp[o + 2] + fz; }
        G.rain.geometry.attributes.position.needsUpdate = true; }
    }
    { const { spp, spv, spl, SN } = G; const emit = this.wet && !this.reduce ? Math.floor(sk * 12) : 0;
      for (let e = 0; e < emit; e++) {
        const w = C.wheels[2 + (e % 2)] || C.wheels[0]; if (!w) break; w.g.getWorldPosition(v); const i = G.spi; G.spi = (i + 1) % SN;
        const fx = Math.sin(yaw), fz = Math.cos(yaw);
        spp[i * 3] = v.x + (Math.random() - 0.5) * 0.4; spp[i * 3 + 1] = 0.15; spp[i * 3 + 2] = v.z + (Math.random() - 0.5) * 0.4;
        spv[i * 3] = -fx * sp * 0.25 + (Math.random() - 0.5) * 2; spv[i * 3 + 1] = 1 + Math.random() * 2.5; spv[i * 3 + 2] = -fz * sp * 0.25 + (Math.random() - 0.5) * 2; spl[i] = 1;
      }
      for (let i = 0; i < SN; i++) { if (spl[i] <= 0) continue; spl[i] -= dt * 1.4; spp[i * 3] += spv[i * 3] * dt; spp[i * 3 + 1] += spv[i * 3 + 1] * dt; spp[i * 3 + 2] += spv[i * 3 + 2] * dt; spv[i * 3 + 1] -= 3 * dt; if (spl[i] <= 0) spp[i * 3 + 1] = -999; }
      G.spray.geometry.attributes.position.needsUpdate = true; }
    if (G.streaks) { const SKs = G.streaks, stp = G.stp; const op = this.reduce || camMode === 'T-Cam' && raceOn ? 0 : Math.pow(sk, 1.6) * 0.4; SKs.material.opacity = op; SKs.visible = op > 0.01;
      if (SKs.visible) { SKs.position.set(car.position.x, 0, car.position.z); SKs.rotation.y = yaw; const rel = sp * dt, len = (0.5 + sk * 7) * Math.sign(sp || 1);
        for (let i = 0; i < G.SKN; i++) { const o = i * 6; let z = stp[o + 2] - rel; if (z < -45) z += 90; else if (z > 45) z -= 90; stp[o + 2] = z; stp[o + 5] = z + len; }
        SKs.geometry.attributes.position.needsUpdate = true; } }

    // part cards: anchored to the part in 3D, tilted toward the car
    camera.updateMatrixWorld();
    const labs = [this.lab0, this.lab1, this.lab2, this.lab3, this.lab4]; let fo = 0;
    C.parts.forEach(p => { if (p.label == null) return; const el = labs[p.label].current; if (!el) return;
      const o = fp ? 0 : cardO[p.label];
      if (o <= 0.001) { if (el.style.opacity !== '0') el.style.opacity = '0'; if (el._card && el._card.dataset.on === '1') el._card.dataset.on = '0'; return; }
      p.g.getWorldPosition(v); v.add(v2.copy(p.anchor).sub(p.base).applyQuaternion(car.quaternion));
      if (E && E.focus && o > fo) { E.focus.position.copy(v); fo = o; }
      v.project(camera);
      const sx = (v.x + 1) / 2 * W, sy = (1 - v.y) / 2 * H;
      if (!el._card) { el._card = el.querySelector('[data-card]'); el._lead = el.querySelector('[data-lead]'); }
      if (!el._cw) { el._cw = el._card.offsetWidth || 330; el._ch = el._card.offsetHeight || 220; } const cw = el._cw, ch = el._ch, right = sx < W * 0.5, L0 = 90 * (0.4 + 0.6 * o);
      const dx = clamp(right ? L0 : -L0 - cw, 16 - sx, W - 16 - cw - sx), dy = clamp(-ch / 2, Math.max(100, Math.min(210, H * 0.24)) - sy, H - 60 - ch - sy);
      { const on = o > 0.6 ? '1' : o < 0.3 ? '0' : el._card.dataset.on || '0'; if (el._card.dataset.on !== on) el._card.dataset.on = on; }
      el.style.opacity = o.toFixed(3); el.style.transform = 'translate3d(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px,0)';
      el._lead.style.width = L0.toFixed(1) + 'px'; el._lead.style.transform = right ? 'none' : 'rotate(180deg)';
      el._card.style.transformOrigin = right ? '0 50%' : '100% 50%';
      el._card.style.transform = 'translate3d(' + dx.toFixed(1) + 'px,' + (dy + (1 - o) * 26).toFixed(1) + 'px,' + ((o - 1) * 140).toFixed(1) + 'px) rotateY(' + ((right ? -1 : 1) * (10 + 14 * (1 - o))).toFixed(2) + 'deg)';
    });
    if (E && E.focus) { E.focus.material.opacity = fo * 0.9; const fs = 0.9 + Math.sin(tsec * 4) * 0.15; E.focus.scale.set(fs, fs, 1); E.focus.visible = fo > 0.01; }

    renderer.setClearColor(G.clear.copy(G.bg).multiplyScalar(bgK).lerp(G.flashC, fl * 0.6), 1); renderer.clear();
    const stV = G.streaks ? G.streaks.visible : false;
    G.ground.visible = false; G.outer.visible = false; G.rain.visible = false; G.spray.visible = false; C.shadow.visible = false; if (G.streaks) G.streaks.visible = false;
    const carVis = car.visible; if (G.heavy || this.dpr < 1) car.visible = false;
    world.scale.y = -1; world.updateMatrixWorld(true); renderer.render(scene, camera); car.visible = carVis;
    renderer.clearDepth(); world.scale.y = 1; world.updateMatrixWorld(true);
    G.ground.visible = true; G.outer.visible = true; G.rain.visible = this.wet; G.spray.visible = true; C.shadow.visible = true; if (G.streaks) G.streaks.visible = stV;
    renderer.render(scene, camera);
  }

  // ---------- navigation ----------
  jumpTo(y) {
    const go = () => { window.scrollTo(0, y); this.sS = y; this.scrollTarget = y; this.smoothing = false; this.scrollPos = null; this.lastSY = y; const G = this.gl; if (G) { G.d = null; G.off = null; G.camYaw = null; G.yawPrev = null; G.cut = null; G.idleT = 0; } };
    const el = this.cutRef.current; if (this.reduce || !el || !el.animate) return go();
    // a jump during another jump's cut takes it over from wherever the fade is; the earlier jump is dropped, where before
    // its fade-out cancelled this one's fade-in, so the second jump never happened
    const from = +getComputedStyle(el).opacity || 0, id = this.cutId = (this.cutId || 0) + 1;
    el.getAnimations().forEach(x => x.cancel()); el.style.zIndex = '50';
    el.animate([{ opacity: from }, { opacity: 1 }], { duration: 300 * (1 - from) + 1, easing: 'ease-in', fill: 'forwards' }).onfinish = () => { if (id !== this.cutId) return; go();
      el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 650, easing: 'ease-out', fill: 'forwards' }).onfinish = () => { if (id !== this.cutId) return; el.getAnimations().forEach(x => x.cancel()); el.style.zIndex = '1'; }; };
  }
  goHome = () => {
    if (this.state.fp) this.exitFP(); this.clearRt(); this.stopPitClock();
    // leaving during the start lights abandons that start
    if (this.state.race === 'lights') { this.clearRace(); this.setState({ race: 'grid', glit: 0 }); }
    this.setState({ modal: null }); this.jumpTo(0);
  };
  navGo = () => {
    if (this.state.fp) this.exitFP();
    // from the grid or the lap this is the way back; only the garage skips ahead
    if (this.mode !== 'hero') return this.goHome();
    if (this.state.phase !== 'done') this.skipIntro();
    if (!this.raceOn()) this.goRace(true);
    this.later(() => { if (this.m) this.jumpTo(this.m.cen[0]); }, 30);
  };
  raceAgain = () => {
    this.clearRace(); this.raceFlag = false; this.goT = null; this.raceEnd = null; this.raceT0 = null;
    this.setState({ race: 'grid', glit: 0, gantryHide: false, splits: [null, null, null], curSec: 0 });
    if (this.m) this.jumpTo(this.m.gridTop);
  };

  // ---------- race flow ----------
  raceOn() { return this.raceFlag === true; }
  scrollMax() { const full = document.documentElement.scrollHeight - innerHeight; return this.raceOn() || !this.m || this.state.fp ? full : Math.min(full, this.m.gridTop); }
  profAt(d) { const G = this.gl; if (!G || !G.prof) return 40; const L = G.trackLen; const i = Math.floor((((d % L) + L) % L) / G.pds) % G.PN; return G.prof[i]; }
  mapD(y) { const k = this.m && this.m.map; if (!k) return 0; if (y <= k[0][0]) return 0;
    for (let i = 1; i < k.length; i++) if (y <= k[i][0]) { const a = k[i - 1], b = k[i]; return lerp(a[1], b[1], (y - a[0]) / (b[0] - a[0])); } return k[k.length - 1][1]; }
  buildMap() { const m = this.m, st = this.stops; if (!m || !st || !this.gl) return; const L = this.gl.trackLen; const k = [[m.gridTop, 0]];
    m.cen.forEach((y, i) => k.push([Math.max(y, k[k.length - 1][0] + 1), st[i] ? st[i].d : L * (i + 1) / 6])); k.push([Math.max(m.docMax, k[k.length - 1][0] + 1), L * 0.995]); m.map = k; }
  // the start-light sequence's timers; skipping to the race (or leaving) cancels them, otherwise they fired later
  // and restarted the race clock mid-lap
  clearRace() { (this.raceTimers || []).forEach(clearTimeout); this.raceTimers = []; }
  goRace(instant) {
    this.clearRace(); this.raceFlag = true; this.goT = performance.now(); this.raceT0 = this.goT; this.secT0 = 0; this.raceEnd = null;
    this.setState({ race: 'go', glit: 0, gantryHide: !!instant, splits: [null, null, null], curSec: 0 });
    if (instant) return;
    this.rev = 1; this.whoosh(); this.crackle(0.35); this.later(() => this.setState({ gantryHide: true }), 700);
    this.later(() => { if (!this.m) return; const y = this.m.gridTop + ((this.m.cen && this.m.cen[0]) - this.m.gridTop) * 0.4; this.scrollTarget = clamp(y, 0, this.scrollMax()); this.scrollPos = window.scrollY; this.smoothing = true; this.slowScroll = true; }, 350);
  }
  startRace = () => {
    if (this.state.race !== 'grid' || this.state.phase !== 'done') return;
    if (!this.audioChosen && !this.state.audio) this.toggleAudio(true);
    if (this.m) { this.scrollTarget = this.m.gridTop; this.scrollPos = window.scrollY; this.smoothing = true; this.slowScroll = true; }
    this.setState({ race: 'lights', glit: 0, gantryHide: false });
    const step = this.reduce ? 400 : 900; this.clearRace();
    for (let i = 1; i <= 5; i++) this.raceTimers.push(setTimeout(() => { this.setState({ glit: i }); this.beep(660, 0.14); this.rev = Math.max(this.rev || 0, 0.25); }, i * step));
    // after the fifth light, a short random hold (0.2 to 0.8 s) before lights out
    this.raceTimers.push(setTimeout(() => this.goRace(false), 5 * step + 200 + Math.random() * 600));
  };

  // ---------- RB22 model bay ----------
  setModel(p) { this.setState(s => ({ model: { ...s.model, ...p } })); }
  openBay = () => { if (!this.state.fp) this.setState({ modal: 'bay' }); };
  hasFiles(e) { const d = e.dataTransfer; if (!d || ![...(d.types || [])].includes('Files')) return false; const it = [...(d.items || [])]; return !it.length || it.some(i => !/^image\//.test(i.type)); }
  idb(mode, fn) { return new Promise((res, rej) => { if (!window.indexedDB) return res(null); const r = indexedDB.open('car11-garage', 1); r.onupgradeneeded = () => r.result.createObjectStore('m'); r.onerror = () => rej(r.error);
    r.onsuccess = () => { const db = r.result; const tx = db.transaction('m', mode); const q = fn(tx.objectStore('m')); tx.oncomplete = () => { db.close(); res(q && q.result); }; tx.onerror = () => { db.close(); rej(tx.error); }; }; }); }
  async restoreModel() {
    try {
      let url = this.props.modelUrl; try { url = url || localStorage.getItem('car11-model-url'); } catch (e) { }
      const job = url ? this.loadUrl(url, true) : this.idb('readonly', st => st.get('rb22')).then(saved => saved && saved.length ? this.loadFiles(saved.map(x => new File([x.blob], x.name)), true) : null);
      await Promise.race([job, new Promise(r => setTimeout(r, 8000))]);
    } catch (e) { console.warn('model restore', e); }
  }
  async gltfLoader() {
    if (this._ldr) return this._ldr;
    const T = this.gl.T;
    const [{ GLTFLoader }, { DRACOLoader }, { MeshoptDecoder }] = await this._ldrMods;
    const mgr = new T.LoadingManager();
    mgr.setURLModifier(u => { const name = decodeURIComponent(u.split(/[\\/]/).pop().split('?')[0]); const hit = this.fileMap && this.fileMap[name.toLowerCase()]; if (hit) return hit; if (!/^(blob:|data:|https?:)/i.test(u) && TEX.includes(name)) return TEX_DIR + name; return u; });
    const l = new GLTFLoader(mgr); const dr = new DRACOLoader(); dr.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/'); l.setDRACOLoader(dr); l.setMeshoptDecoder(MeshoptDecoder);
    return (this._ldr = l);
  }
  revokeFiles() { if (this.fileMap) Object.values(this.fileMap).forEach(u => URL.revokeObjectURL(u)); this.fileMap = null; }
  loadFiles = async (files, fromCache) => {
    const main = files.find(f => /\.glb$/i.test(f.name)) || files.find(f => /\.gltf$/i.test(f.name));
    if (!main) { this.showToast('DROP A .GLB OR .GLTF FILE', '#E8352B'); return; }
    if (!this.gl) { this.showToast('3D STILL WARMING UP · TRY AGAIN', '#FFC72C'); return; }
    const keep = files.filter(f => /\.(glb|gltf|bin|png|jpe?g|webp|ktx2)$/i.test(f.name)); const size = keep.reduce((a, f) => a + f.size, 0);
    this.lastSrc = { files: keep }; this.setModel({ status: 'loading', name: main.name, size, progress: 0.12, err: '' });
    try {
      const loader = await this.gltfLoader(); this.revokeFiles(); this.fileMap = {}; keep.forEach(f => { this.fileMap[f.name.toLowerCase()] = URL.createObjectURL(f); });
      const data = /\.glb$/i.test(main.name) ? await main.arrayBuffer() : await main.text(); this.setModel({ progress: 0.45 });
      const gltf = await new Promise((res, rej) => loader.parse(data, '', res, rej)); this.setModel({ progress: 0.85 });
      await this.installModel(gltf.scene, main.name, size);
      if (!fromCache) { try { localStorage.removeItem('car11-model-url'); await this.idb('readwrite', st => st.put(keep.map(f => ({ name: f.name, blob: f })), 'rb22')); } catch (e) { console.warn('model cache', e); } }
    } catch (e) { console.warn(e); this.setModel({ status: 'error', err: String((e && e.message) || e).slice(0, 140), progress: 0 }); }
  };
  loadUrl = async (url, fromCache) => {
    url = (url || '').trim(); if (!url || !this.gl) return;
    this.lastSrc = { url }; const name = decodeURIComponent(url.split('/').pop().split('?')[0]) || 'model.glb';
    this.setModel({ status: 'loading', name, size: 0, progress: 0.02, err: '' }); let size = 0;
    try {
      const loader = await this.gltfLoader(); this.fileMap = null; let shown = 0;
      // progress re-renders the whole page, so only report it in 5% steps
      const gltf = await loader.loadAsync(url, ev => { if (!ev.total) return; size = ev.total; const p = 0.05 + (ev.loaded / ev.total) * 0.8; if (p - shown >= 0.05) { shown = p; this.setModel({ progress: p, size }); } });
      await this.installModel(gltf.scene, name, size);
      if (!fromCache && !this.props.modelUrl) try { localStorage.setItem('car11-model-url', url); } catch (e) { }
    } catch (e) { console.warn(e); this.setModel({ status: 'error', err: 'COULD NOT LOAD THAT LINK. IT MUST BE A DIRECT .GLB URL THAT ALLOWS CROSS-ORIGIN ACCESS.', progress: 0 }); }
  };
  installModel(root, name, size) {
    const G = this.gl, T = G.T;
    this.detachModel();
    if (!G.Cp) G.Cp = G.C; const P = G.Cp, car = P.car;
    const V = (x = 0, y = 0, z = 0) => new T.Vector3(x, y, z), box = new T.Box3(), mb = new T.Box3(), mc = V(), ms = V();
    const holder = new T.Group(); holder.add(root); holder.updateMatrixWorld(true);
    box.setFromObject(holder); let sz = box.getSize(V());
    if (sz.x > sz.z) holder.rotation.y = Math.PI / 2;
    holder.updateMatrixWorld(true); box.setFromObject(holder);
    const meshes = []; holder.traverse(o => { if (o.isMesh) meshes.push(o); });
    { const c = box.getCenter(V()), len = box.max.z - box.min.z; let fy = -1e9, ry = -1e9;
      meshes.forEach(m => { mb.setFromObject(m); const mz = (mb.min.z + mb.max.z) / 2; if (mz > c.z + len * 0.3) fy = Math.max(fy, mb.max.y); if (mz < c.z - len * 0.3) ry = Math.max(ry, mb.max.y); });
      let flip = fy > ry; if (this.modelFlip) flip = !flip; if (flip) holder.rotation.y += Math.PI; holder.updateMatrixWorld(true); }
    box.setFromObject(holder); sz = box.getSize(V());
    holder.scale.setScalar(5.5 / Math.max(1e-6, sz.z)); holder.updateMatrixWorld(true);
    box.setFromObject(holder); const ctr = box.getCenter(V()); holder.position.set(-ctr.x, -box.min.y, -ctr.z); holder.updateMatrixWorld(true);
    box.setFromObject(holder); const top = box.max.y, rearZ = box.min.z;
    const rb = new T.Group(); rb.name = 'rb22'; rb.add(holder); rb.updateMatrixWorld(true);
    let tris = 0, rearLight = null; const kinds = {}; const add = (k, m) => (kinds[k] = kinds[k] || []).push(m);
    meshes.forEach(m => {
      const g = m.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3;
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      mats.forEach(mt => { if (mt && 'envMapIntensity' in mt) mt.envMapIntensity = 1.15; });
      const tag = [m.name, m.parent && m.parent.name, ...mats.map(mt => mt ? mt.name + ' ' + ((mt.map && mt.map.name) || '') : '')].join(' ').toLowerCase();
      mb.setFromObject(m); mb.getCenter(mc); mb.getSize(ms); const ax = Math.abs(mc.x), az = Math.abs(mc.z);
      if (/rear.?light|rain.?light|clearled/.test(tag) && mc.z < 0) rearLight = mc.clone();
      let k = 'body';
      if (/steer|driver|helmet|seat|cinture|belt|glove|visor|lcd/.test(tag)) k = 'driver';
      else if ((/wheel|tyre|tire|\brim|disc|hub|pirelli/.test(tag) || (ms.y > 0.45 && ms.z > 0.45 && ms.x < 0.6 && ms.y < 1)) && az > 0.8 && ax > 0.35 && mc.y < 0.75) k = 'wheel';
      else if (ms.z > 3.2 || (ms.x > 1.5 && ms.z > 1.5)) k = 'body';
      else if (/halo/.test(tag)) k = 'halo';
      else if (/front.?wing|\bfw\b|fw_/.test(tag) || (mc.z > 2.0 && mc.y < 0.5)) k = 'frontWing';
      else if (/rear.?wing|\brw\b|rw_|drs|beam/.test(tag) || (mc.z < -1.85 && mc.y > 0.5)) k = 'rearWing';
      else if (/engine|cover|airbox|\bfin\b/.test(tag) || (mc.y > 0.55 && mc.z < -0.3 && mc.z > -2 && ax < 0.4)) k = 'cover';
      else if (ax > 0.42 && mc.z > -1.6 && mc.z < 1.2 && mc.y < 0.7) k = mc.x > 0 ? 'podR' : 'podL';
      add(k, m);
    });
    const wheels = [], quads = {};
    (kinds.wheel || []).forEach(m => { mb.setFromObject(m); mb.getCenter(mc); const q = (mc.x > 0 ? 'R' : 'L') + (mc.z > 0 ? 'F' : 'B'); (quads[q] = quads[q] || []).push(m); });
    Object.keys(quads).forEach(q => { const wb = new T.Box3(); quads[q].forEach(m => wb.expandByObject(m)); const c = wb.getCenter(V()), wsz = wb.getSize(V());
      const gw = new T.Group(); gw.name = 'wheel' + q; gw.position.copy(c); rb.add(gw); const spin = new T.Group(); gw.add(spin); rb.updateMatrixWorld(true);
      quads[q].forEach(m => spin.attach(m));
      wheels.push({ g: gw, spin, front: c.z > 0, side: Math.sign(c.x) || 1, base: c.clone(), r: Math.max(0.2, Math.max(wsz.y, wsz.z) / 2) }); });
    const grp = k => { const list = kinds[k]; if (!list || !list.length) return null; const g = new T.Group(); g.name = k; rb.add(g); rb.updateMatrixWorld(true); list.forEach(m => g.attach(m)); return g; };
    const centerOf = g => new T.Box3().setFromObject(g).getCenter(V());
    const dummy = () => { const g = new T.Group(); rb.add(g); return g; };
    const fw = grp('frontWing'), rw = grp('rearWing'), cov = grp('cover'), halo = grp('halo'), drv = grp('driver'), pl = grp('podL'), pr = grp('podR');
    const parts = []; const push = (g, off, o = {}) => { if (g) parts.push({ g, off, base: g.position.clone(), ...o }); };
    if (fw) push(fw, V(0, 0.35, 2.0), { rx: 0.12, label: 0, anchor: centerOf(fw) }); else push(dummy(), V(), { label: 0, anchor: V(0, 0.2, 2.6) });
    if (cov) push(cov, V(0, 2.4, -0.5), { rx: -0.15, label: 1, anchor: centerOf(cov) }); else push(dummy(), V(), { label: 1, anchor: V(0, top * 0.75, -1.1) });
    push(dummy(), V(), { label: 2, anchor: V(0, 0.28, 0.1) });
    if (halo) push(halo, V(0, 1.1, 0.8), { label: 3, anchor: centerOf(halo) }); else push(dummy(), V(), { label: 3, anchor: V(0, top * 0.85, 0.45) });
    push(dummy(), V(), { label: 4, anchor: V(0, top, -0.25) });
    push(drv, V(0, 0.7, 0.3)); push(pl, V(-1.3, 0.3, 0), { rz: 0.15 }); push(pr, V(1.3, 0.3, 0), { rz: -0.15 }); push(rw, V(0, 0.8, -1.6), { rx: -0.1 });
    wheels.forEach(w => push(w.g, V(w.side * 1.0, 0, w.front ? 0.25 : -0.25)));
    parts.forEach((p, i) => { p.i = i; });
    const lp = rearLight || V(0, 0.35, rearZ + 0.05);
    G.glowHome = G.glowHome || { gp: P.glow.parent, gpos: P.glow.position.clone(), rp: P.redPt.parent, rpos: P.redPt.position.clone() };
    car.add(P.glow); P.glow.position.set(lp.x, lp.y, lp.z - 0.06); car.add(P.redPt); P.redPt.position.set(0, lp.y + 0.05, lp.z - 0.35);
    car.children.forEach(ch => { if (ch !== P.shadow && ch !== P.glow && ch !== P.redPt) { ch.userData.proxyVis = ch.visible; ch.visible = false; } });
    car.add(rb); G.rb = rb; G.heavy = tris > 120000;
    G.C = { car, parts, wheels, flap: new T.Object3D(), glow: P.glow, redPt: P.redPt, shadow: P.shadow };
    const n = k => (kinds[k] || []).length; const row = (nm, cnt) => ({ name: nm, detail: cnt ? cnt + ' mesh' + (cnt > 1 ? 'es' : '') : 'not found · stays fixed', color: cnt ? '#2BD96B' : '#8a9099' });
    this.setModel({ status: 'ready', name, size, tris: Math.round(tris), meshes: meshes.length, progress: 1, parts: [
      { name: 'Wheels', detail: wheels.length + ' / 4 · spin' + (wheels.some(w => w.front) ? ' + steer' : ''), color: wheels.length === 4 ? '#2BD96B' : wheels.length ? '#FFC72C' : '#8a9099' },
      row('Front wing', n('frontWing')), row('Rear wing', n('rearWing')), row('Engine cover', n('cover')), row('Sidepods', n('podL') + n('podR')), row('Halo', n('halo')), row('Driver & cockpit', n('driver')), row('Monocoque & floor', n('body'))
    ] });
    this.showToast('RB22 ON THE GRID', '#2BD96B');
    return this.warm(rb);
  }
  // upload the car's textures and compile its shaders while the intro still covers the canvas,
  // so the first frame of the reveal doesn't stall on GPU work
  warm(root) {
    const { renderer, scene, camera } = this.gl;
    root.traverse(o => { if (!o.isMesh) return; (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { for (const k in m) { const t = m[k]; if (t && t.isTexture) renderer.initTexture(t); } }); });
    return renderer.compileAsync(scene, camera).catch(e => console.warn('shader warm-up', e));
  }
  detachModel() {
    const G = this.gl; if (!G || !G.rb) return; const P = G.Cp, car = P.car;
    car.remove(G.rb);
    G.rb.traverse(o => { if (!o.isMesh) return; o.geometry.dispose(); (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (!m) return; Object.values(m).forEach(x => { if (x && x.isTexture) x.dispose(); }); m.dispose(); }); });
    car.children.forEach(ch => { if (ch.userData.proxyVis != null) { ch.visible = ch.userData.proxyVis; delete ch.userData.proxyVis; } });
    const h = G.glowHome; if (h) { h.gp.add(P.glow); P.glow.position.copy(h.gpos); h.rp.add(P.redPt); P.redPt.position.copy(h.rpos); }
    G.rb = null; G.heavy = false; G.C = P;
  }
  removeModel = () => {
    if (this.state.model.status === 'proxy') return;
    this.detachModel(); this.revokeFiles(); this.lastSrc = null;
    try { localStorage.removeItem('car11-model-url'); } catch (e) { }
    this.idb('readwrite', st => st.delete('rb22')).catch(() => { });
    this.setModel({ status: 'proxy', name: '', size: 0, tris: 0, meshes: 0, parts: [], progress: 0, err: '' }); this.showToast('PROXY CAR BACK ON TRACK', '#FFC72C');
  };
  flipModel = () => {
    if (!this.lastSrc || this.state.model.status !== 'ready') return; this.modelFlip = !this.modelFlip;
    try { localStorage.setItem('car11-model-flip', this.modelFlip ? '1' : '0'); } catch (e) { }
    if (this.lastSrc.files) this.loadFiles(this.lastSrc.files, true); else this.loadUrl(this.lastSrc.url, true);
  };

  renderVals() {
    const s = this.state;

    const done = s.times.map((t, i) => (t != null && i !== s.sector ? t : null));
    const valid = done.filter(t => t != null); const minT = valid.length ? Math.min(...valid) : null;
    const towerRows = SECTORS.map((sec, i) => {
      const cur = i === s.sector && s.phase === 'done'; const t = done[i];
      return {
        pos: i + 1, code: sec.code, time: cur ? '' : (t != null ? fmt(t) : '—'),
        color: cur ? '#FFC72C' : t != null ? (t === minT ? '#B44CFF' : '#2BD96B') : 'var(--muted,#8a9099)',
        bg: cur ? 'rgba(255,199,44,.1)' : 'transparent', marker: cur ? '#FFC72C' : 'transparent',
        go: () => { if (sec.id) this.scrollToId(sec.id); else window.scrollTo({ top: 0, behavior: 'smooth' }); }
      };
    });
    const lightOn = { color: '#ff2418', glow: '0 0 28px rgba(255,36,24,.85), 0 0 70px rgba(255,36,24,.4)' }, lightOff = { color: '#1a1b1f', glow: 'none' };
    const rt = s.rt;
    const rtHeadline = rt.stage === 'idle' ? 'Tap to start' : rt.stage === 'lights' ? 'Wait for it' : rt.stage === 'go' ? 'Go!' : rt.stage === 'jump' ? 'Jump start' : (rt.time / 1000).toFixed(3) + 's';
    const rtSub = rt.stage === 'idle' ? 'CLICK OR PRESS SPACE WHEN ALL FIVE LIGHTS GO OUT' : rt.stage === 'lights' ? 'HOLD…' : rt.stage === 'go' ? 'CLICK NOW' : rt.stage === 'jump' ? 'DRIVE-THROUGH PENALTY · TAP TO RETRY' : (rt.time < 200 ? 'POLE-WORTHY REACTION' : rt.time < 300 ? 'GRID AVERAGE' : 'BOGGED DOWN OFF THE LINE') + ' · TAP TO RETRY';
    const p = s.pit; const curP = p.stage === 'run' ? p.seq[p.idx] : null;
    const wheel = w => {
      const target = curP && curP.w === w; const isFlash = p.flash === w;
      const hint = Object.keys(PIT_KEYS).find(k => PIT_KEYS[k] === w).toUpperCase();
      return { go: () => this.pitTap(w), hint, bg: isFlash ? '#E8352B' : target ? (curP.a === 'OFF' ? '#FFC72C' : '#2BD96B') : '#1a1c20', ring: target ? '#ffffff' : '#2a2d33', label: target ? 'GUN ' + curP.a : w + ' · ' + hint };
    };
    const md = s.model, pct = Math.round((md.progress || 0) * 100);
    const mCol = { proxy: '#8a9099', loading: '#FFC72C', ready: '#2BD96B', error: '#E8352B' }[md.status];
    const modelVals = {
      isBay: s.modal === 'bay', openBay: this.openBay, dragOver: s.dragOver, cutRef: this.cutRef,
      modelChip: md.status === 'ready' ? 'RB22 · GLB' : md.status === 'loading' ? 'RB22 · ' + pct + '%' : md.status === 'error' ? 'MODEL ERROR' : 'PROXY · LOAD RB22',
      modelDot: mCol, bayStatusColor: mCol, bayStatus: { proxy: 'PROXY CAR ON TRACK', loading: 'INSTALLING · ' + pct + '%', ready: 'RB22 INSTALLED', error: 'LOAD FAILED' }[md.status],
      bayErr: md.err || '', hasErr: !!md.err, bayProgress: (md.status === 'loading' ? pct : md.status === 'ready' ? 100 : 0) + '%',
      modelName: md.name || '—', modelSize: md.size ? (md.size / 1048576).toFixed(1) + ' MB' : '—', modelTris: md.tris ? md.tris.toLocaleString('en-US') : '—', modelMeshes: md.meshes || '—',
      bayParts: md.parts && md.parts.length ? md.parts : ['Wheels', 'Front wing', 'Rear wing', 'Engine cover', 'Sidepods', 'Halo', 'Driver & cockpit', 'Monocoque & floor'].map(n => ({ name: n, detail: 'awaiting model', color: 'rgba(140,146,156,.5)' })),
      modelBtnOpacity: md.status === 'ready' ? 1 : 0.35, flipModel: this.flipModel, removeModel: this.removeModel,
      pickFiles: e => { const f = [...(e.target.files || [])]; e.target.value = ''; if (f.length) this.loadFiles(f); },
      urlInput: s.urlInput, setUrl: e => this.setState({ urlInput: e.target.value }), loadUrlBtn: () => this.loadUrl(s.urlInput),
      gridRef: this.gridRef, headerRef: this.headerRef, raceClockRef: this.raceClockRef, mapRef: this.mapRef, mapTurnRef: this.mapTurnRef, mapCarRef: this.mapCarRef,
      partCards: PARTS.map((pc, i) => ({ ...pc, ref: this['lab' + i], total: String(PARTS.length).padStart(2, '0') })),
      partRail: PARTS.map((pc, i) => { const on = i === s.tdStep; return { go: () => this.goPart(i), on, n: pc.n, name: pc.kicker, color: on ? '#FFC72C' : 'rgba(238,240,242,.38)', w: on ? '44px' : '14px' }; }),
      showStart: s.race === 'grid', startRace: this.startRace,
      showGantry: s.race === 'lights' || (s.race === 'go' && !s.gantryHide), gantryOpacity: s.race === 'go' ? 0 : 1,
      gantry: [0, 1, 2, 3, 4].map(i => (s.race === 'lights' && i < s.glit ? lightOn : lightOff)),
      sectorBoxes: [0, 1, 2].map(i => { const t = s.splits[i], cur = i === s.curSec && s.race === 'go'; return { label: 'S' + (i + 1), time: t != null ? (t / 1000).toFixed(1) : cur ? '···' : '', bg: t != null ? '#B44CFF' : cur ? '#FFC72C' : 'rgba(255,255,255,.08)', ink: t != null ? '#ffffff' : cur ? '#050914' : 'var(--muted,#8a9099)' }; }),
      mapPts: s.mapPts, mapStops: s.mapStops,
      stopTag0: s.stopTags[0] || 'S1', stopTag1: s.stopTags[1] || 'S1', stopTag2: s.stopTags[2] || 'S2', stopTag3: s.stopTags[3] || 'S3', stopTag4: s.stopTags[4] || 'S3'
    };
    const pitTime = p.stage === 'done' ? p.time.toFixed(2) + 's' : p.stage === 'run' ? '' : '0.00s';
    const pitSub = p.stage === 'idle' ? 'HIT THE LIT TYRE (OR PRESS Q E Z C): GUN OFF ON ALL FOUR, THEN GUN ON. WRONG TYRE COSTS 0.3s.' + (p.best ? ' BEST ' + p.best.toFixed(2) + 's' : '')
      : p.stage === 'run' ? (curP.a === 'OFF' ? 'WHEELS OFF' : 'WHEELS ON') : (p.time <= 2.5 ? 'RECORD PACE. GO GO GO.' : 'SLOW STOP. BOX AGAIN.') + ' BEST ' + p.best.toFixed(2) + 's';
    return {
      rootRef: this.rootRef, glRef: this.glRef, labelsRef: this.labelsRef, lab0: this.lab0, lab1: this.lab1, lab2: this.lab2, lab3: this.lab3, lab4: this.lab4,
      towerRef: this.towerRef, progRef: this.progRef, hudRef: this.hudRef, ledRef: this.ledRef, spdRef: this.spdRef, gearRef: this.gearRef,
      heroTitleRef: this.heroTitleRef, breakdownRef: this.breakdownRef, cueRef: this.cueRef, cardRef: this.cardRef, holoRef: this.holoRef, teleRef: this.teleRef, waveRef: this.waveRef,
      fpLapRef: this.fpLapRef, pitTimerRef: this.pitTimerRef, barTopRef: this.barTopRef, barBotRef: this.barBotRef, grainRef: this.grainRef, splitRef: this.splitRef,
      showLoader: s.phase !== 'done' || s.outro, intro: this.props.intro, phase: s.phase, lit: s.lit,
      audioLabel: s.audio ? 'SOUND ON' : 'SOUND OFF', audioDot: s.audio ? '#2BD96B' : '#5a6272', navCta: s.mode === 'race' || s.mode === 'grid' ? '↑ BACK TO GARAGE' : 'SKIP TO RACE →', navCtaShort: s.mode === 'race' || s.mode === 'grid' ? '↑ GARAGE' : 'RACE →', navGo: this.navGo, goHome: this.goHome, raceAgain: this.raceAgain, toggleAudio: this.toggleAudio, skipIntro: this.skipIntro,
      weatherLabel: s.weather === 'wet' ? 'WET' : 'DRY', weatherDot: s.weather === 'wet' ? '#46f0ff' : '#FFC72C', toggleWeather: this.toggleWeather,
      skipToPit: this.skipToPit, enterFP: this.enterFP, exitFP: this.exitFP, openReaction: this.openReaction, openPit: this.openPit, closeModal: this.closeModal,
      drsColor: s.drs ? '#2BD96B' : 'var(--muted,#8a9099)', towerRows, leds: Array.from({ length: 15 }, (_, i) => i),
      contentOpacity: s.fp ? 0 : 1, contentPE: s.fp ? 'none' : 'auto',
      stats: [{ value: 'Top 100', label: 'GOOGLE SOLUTION CHALLENGE' }, { value: 'P1', label: 'HACK4SAFETY TRACK' }, { value: '8.40', label: 'CGPA · NIT ROURKELA' }],
      compounds: [{ label: 'SOFT', color: '#E8352B' }, { label: 'MEDIUM', color: '#F5D90A' }, { label: 'HARD', color: '#EDEDED' }, { label: 'INTER', color: '#2BB24C' }],
      projects: PROJECTS.map((pr, i) => { const on = i === s.project; return { ...pr, select: () => { this.setState({ project: i }); this.beep(320, 0.08); }, transform: on ? 'translateY(-14px) scale(1.04)' : 'translateY(0) scale(.97)', opacity: on ? 1 : 0.55, spot: on ? 1 : 0, standColor: on ? '#FFC72C' : '#2a2d33' }; }),
      sel: PROJECTS[s.project],
      standings: [
        { rnd: 'TP', event: 'OpenCode', note: 'MAY 2026 – NOW · Induction and summer tasks, mentoring new members', role: 'Technical Lead', f1: 'TEAM PRINCIPAL', badgeBg: '#FFC72C', badgeInk: '#0a0a0a', tagColor: '#FFC72C' },
        { rnd: 'R01', event: 'Innovision 2026', note: 'NIT ROURKELA TECH FEST · Built the official website', role: 'Core Team · Web Lead', f1: 'RACE ENGINEER', badgeBg: '#FFC72C', badgeInk: '#0a0a0a', tagColor: '#FFC72C' },
        { rnd: 'R02', event: 'HackNITR 7.0', note: 'SEP 2025 – JAN 2026 · Outreach for 6,500+ registrations, on-ground ops for 200+ finalists', role: 'Core Team · Organiser', f1: 'RACE CONTROL', badgeBg: '#FFC72C', badgeInk: '#0a0a0a', tagColor: '#FFC72C' },
        { rnd: 'R03', event: 'Google Solution Challenge', note: '2026 · OmniPool picked from 6,200+ submissions, 85,000+ participants', role: 'Top 100 Global Finalist', f1: 'PODIUM', href: 'https://drive.google.com/file/d/19uxxP8BsYSDQkH0J_FdimIpXfh9PT3xz/view?usp=sharing', badgeBg: '#B44CFF', badgeInk: '#ffffff', tagColor: '#B44CFF' },
        { rnd: 'R04', event: 'Hack4Safety', note: 'NOV 2025 · Odisha Police × SAC NIT Rourkela, 2,000+ participants', role: 'Track Winner', f1: 'P1 · WIN', href: 'https://drive.google.com/file/d/1HTv3Z7JnzDoy75lOYBWeKjctck0ZLm74/view?usp=sharing', badgeBg: '#B44CFF', badgeInk: '#ffffff', tagColor: '#B44CFF' }
      ],
      gauges: GAUGES.map(g => ({ ...g, dash: s.tele ? `${(226.19 * g.v).toFixed(2)} 301.59` : '0 301.59', rpm: s.tele ? Math.round(g.v * 15000).toLocaleString('en-US') : '0' })),
      trace: TRACE, traceOffset: s.tele ? 0 : 1,
      form: s.form, setName: e => this.setField('name', e.target.value), setEmail: e => this.setField('email', e.target.value), setMsg: e => this.setField('msg', e.target.value), sendRadio: this.sendRadio,
      radioLog: s.radioLog, hasLog: s.radioLog.length > 0, radioDot: s.radioLog.length ? '#2BD96B' : '#E8352B',
      cardMove: this.cardMove, cardLeave: this.cardLeave,
      toast: s.toast, toastColor: s.toastColor,
      isFP: s.fp, fpBest: s.fpBest ? fmt(s.fpBest) : '—', fpLast: s.fpLast ? fmt(s.fpLast) : '—', fpLap: 'LAP ' + s.fpLap, fpHint: s.fpRun ? 'W A S D / ARROWS TO DRIVE · ESC TO RETURN' : 'THROTTLE (W / ↑) TO START THE CLOCK', touchKey: this.touchKey,
      isReaction: s.modal === 'reaction', rtHit: this.rtHit, rtPointer: this.rtPointer, rtLights: [0, 1, 2, 3, 4].map(i => ((rt.stage === 'lights' || rt.stage === 'jump') && i < rt.lit ? lightOn : lightOff)),
      rtCta: rt.stage === 'idle' ? 'START' : rt.stage === 'result' || rt.stage === 'jump' ? 'TRY AGAIN' : '', hasBoard: s.board.length > 0, rtHeadline, rtSub,
      board: s.board.map((b, i) => ({ pos: i + 1, time: (b.t / 1000).toFixed(3) + 's', color: i === 0 ? '#B44CFF' : '#eef0f2' })),
      isPit: s.modal === 'pit', pitTime, pitSub, pitStart: this.pitStart, pitBtn: p.stage === 'idle' ? 'START STOP' : p.stage === 'run' ? 'RESTART' : 'BOX AGAIN',
      pitFL: wheel('FL'), pitFR: wheel('FR'), pitRL: wheel('RL'), pitRR: wheel('RR'),
      ...modelVals
    };
  }

  render() {
    const v = this.renderVals();
    return (
      <div ref={v.rootRef} className="c11-root" style={{ position: "relative", color: "var(--ink,#eef0f2)", fontFamily: "var(--font-anybody),sans-serif", fontStretch: "100%" }}>
        <div ref={v.glRef} style={{ position: "fixed", inset: "0", zIndex: "0", background: "radial-gradient(120% 80% at 50% 70%, #101a3a 0%, #050914 70%)" }} />
        <div style={{ position: "fixed", inset: "0", zIndex: "1", pointerEvents: "none", background: "radial-gradient(130% 95% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
        <div ref={v.grainRef} style={{ position: "fixed", inset: "0", zIndex: "1", pointerEvents: "none", opacity: ".07" }} />
        <div ref={v.barTopRef} style={{ position: "fixed", left: "0", right: "0", top: "0", height: "0", zIndex: "1", background: "#000", pointerEvents: "none" }} />
        <div ref={v.barBotRef} style={{ position: "fixed", left: "0", right: "0", bottom: "0", height: "0", zIndex: "1", background: "#000", pointerEvents: "none" }} />
        <div ref={v.splitRef} style={{ position: "fixed", left: "50%", top: "92px", transform: "translateX(-50%)", zIndex: "16", opacity: "0", pointerEvents: "none", display: "flex", alignItems: "stretch", fontFamily: "var(--font-jbmono),monospace", background: "rgba(7,8,10,.88)", border: "1px solid rgba(255,255,255,.14)" }}>
          <div style={{ padding: "10px 16px", display: "flex", flexDirection: "column", gap: "5px" }}>
            <span data-split="k" style={{ fontSize: "9px", letterSpacing: ".22em", color: "#9aa1aa" }} />
            <span data-split="n" style={{ fontFamily: "var(--font-anybody),sans-serif", fontWeight: "900", fontStretch: "140%", fontStyle: "italic", fontSize: "22px", lineHeight: "1", textTransform: "uppercase", color: "#eef0f2" }} />
          </div>
          <div data-split="t" style={{ padding: "10px 16px", display: "flex", alignItems: "center", fontSize: "19px", fontWeight: "700", fontVariantNumeric: "tabular-nums", color: "#0a0a0a", background: "#B44CFF" }} />
        </div>
        <div ref={v.cutRef} style={{ position: "fixed", inset: "0", zIndex: "1", background: "#000", opacity: "0", pointerEvents: "none" }} />
        <div ref={v.labelsRef} style={{ position: "fixed", inset: "0", zIndex: "3", pointerEvents: "none", overflow: "hidden", fontFamily: "var(--font-jbmono),monospace", color: "#eef0f2", perspective: "1200px" }}>
          {v.partCards.map((c, cIdx) => (
            <div key={cIdx} ref={c.ref} className="c11-part" style={{ '--c': c.color, opacity: "0" }}>
              <div className="c11-part-pin" />
              <div data-lead="1" className="c11-part-lead" />
              <div data-card="1" className="c11-part-card">
                <div className="c11-part-body">
                  <div className="c11-part-head">
                    <span>{c.kicker}</span>
                    <span className="c11-part-n"><b>{c.n}</b> / {c.total}</span>
                  </div>
                  <div className="c11-part-ticks" aria-hidden="true">
                    {v.partCards.map((_, tIdx) => <i key={tIdx} className={tIdx <= cIdx ? 'on' : undefined} style={{ '--j': tIdx }} />)}
                  </div>
                  <h3 className="c11-part-title">{c.title}</h3>
                  <p className="c11-part-desc">{c.desc}</p>
                  <ul className="c11-part-stack">
                    {c.stack.map((t, tIdx) => <li key={tIdx} style={{ '--j': tIdx }}>{t}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        <header ref={v.headerRef} className="c11-hdr" style={{ position: "fixed", top: "0", left: "0", right: "0", zIndex: "20", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", padding: "16px 22px", pointerEvents: "none" }}>
          <button type="button" onClick={v.goHome} aria-label="Krish, back to the garage" style={{ display: "flex", alignItems: "center", gap: "12px", pointerEvents: "auto", cursor: "pointer", background: "none", border: "0", padding: "0", color: "inherit", textAlign: "left" }}>
            <div style={{ width: "38px", height: "38px", background: "#FFC72C", color: "#0a0a0a", display: "grid", placeItems: "center", fontWeight: "900", fontStretch: "150%", fontStyle: "italic", fontSize: "19px", letterSpacing: "-.04em" }}>21</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <div style={{ fontWeight: "800", fontStretch: "130%", fontSize: "15px", letterSpacing: ".04em", textTransform: "uppercase", lineHeight: "1" }}>Krish</div>
              <div className="c11-hdr-sub" style={{ fontFamily: "var(--font-jbmono),monospace", fontSize: "10px", letterSpacing: ".16em", color: "var(--muted,#8a9099)", lineHeight: "1" }}>NIT ROURKELA · E&amp;I</div>
            </div>
          </button>
          <nav style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "wrap", pointerEvents: "auto", fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", fontWeight: "700", letterSpacing: ".14em" }}>
            <button className="c11-h0 c11-nb" onClick={v.toggleWeather} aria-label={'Weather: ' + v.weatherLabel} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 20px 11px 18px", background: "rgba(9,15,34,.88)", color: "#eef0f2", border: "0", clipPath: "polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%)", cursor: "pointer", transition: "background .2s, color .2s" }}>
              <span style={{ width: "7px", height: "7px", background: v.weatherDot }} />
              {v.weatherLabel}
            </button>
            <button className="c11-h0 c11-nb" onClick={v.toggleAudio} aria-label={v.audioLabel} aria-pressed={v.audioLabel === 'SOUND ON'} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 20px 11px 18px", background: "rgba(9,15,34,.88)", color: "#eef0f2", border: "0", clipPath: "polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%)", cursor: "pointer", transition: "background .2s, color .2s" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z" />{v.audioLabel === 'SOUND ON' ? <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /> : <path d="m23 9-6 6M17 9l6 6" />}</svg>
              <span className="c11-lbl">{v.audioLabel}</span>
            </button>
            <button className="c11-h0 c11-nb c11-nb-fp" onClick={v.enterFP} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 20px 11px 18px", background: "rgba(9,15,34,.88)", color: "#eef0f2", border: "0", clipPath: "polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%)", cursor: "pointer", transition: "background .2s, color .2s" }}>FREE PRACTICE</button>
            <button className="c11-h1 c11-nb" onClick={v.navGo} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 22px 11px 20px", background: "#FFC72C", color: "#050914", border: "0", clipPath: "polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%)", cursor: "pointer", transition: "background .2s" }}><span className="c11-long">{v.navCta}</span><span className="c11-short">{v.navCtaShort}</span></button>
          </nav>
        </header>
        <aside ref={v.towerRef} style={{ position: "fixed", left: "20px", top: "84px", zIndex: "15", display: "none", flexDirection: "column", gap: "4px", fontFamily: "var(--font-jbmono),monospace", pointerEvents: "none", color: "var(--ink,#eef0f2)" }}>
          <div style={{ display: "flex", alignItems: "stretch", background: "var(--panel,rgba(9,15,34,.9))", border: "1px solid var(--line,rgba(255,255,255,.14))" }}>
            <div style={{ padding: "8px 12px", display: "flex", flexDirection: "column", gap: "3px", minWidth: "96px", flex: "1" }}>
              <span style={{ fontSize: "9px", letterSpacing: ".16em", color: "var(--muted,#8a9099)" }}>LAP TIME</span>
              <span ref={v.raceClockRef} style={{ fontSize: "16px", fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>0:00.000</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "3px" }}>
            {v.sectorBoxes.map((b, bIdx) => (
              <div key={bIdx} style={{ padding: "6px 8px", background: b.bg, color: b.ink, display: "flex", justifyContent: "space-between", gap: "6px", fontSize: "10px", fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>
                <span>{b.label}</span>
                <span>{b.time}</span>
              </div>
            ))}
          </div>
        </aside>
        <div ref={v.mapRef} style={{ position: "fixed", right: "20px", bottom: "18px", zIndex: "15", width: "176px", padding: "10px", boxSizing: "border-box", background: "var(--panel,rgba(9,15,34,.9))", border: "1px solid var(--line,rgba(255,255,255,.14))", display: "none", flexDirection: "column", gap: "6px", fontFamily: "var(--font-jbmono),monospace", pointerEvents: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", letterSpacing: ".16em", color: "var(--muted,#8a9099)" }}>
            <span>CIRCUIT 21</span>
            <span ref={v.mapTurnRef} style={{ color: "#FFC72C" }}>S1</span>
          </div>
          <svg viewBox="0 0 200 200" style={{ width: "100%", height: "auto", display: "block" }}>
            <polyline points={v.mapPts} style={{ fill: "none", stroke: "rgba(255,255,255,.14)", strokeWidth: "10", strokeLinejoin: "round" }} />
            <polyline points={v.mapPts} style={{ fill: "none", stroke: "#eef0f2", strokeWidth: "2.4", strokeLinejoin: "round" }} />
            {v.mapStops.map((s, sIdx) => (
              <circle key={sIdx} cx={s.x} cy={s.y} r="5" style={{ fill: "#050914", stroke: "#FFC72C", strokeWidth: "1.6" }} />
            ))}
            <circle ref={v.mapCarRef} cx="-20" cy="-20" r="6" style={{ fill: "#E4002B", stroke: "#ffffff", strokeWidth: "1.6" }} />
          </svg>
        </div>
        <div ref={v.hudRef} style={{ position: "fixed", left: "50%", bottom: "18px", transform: "translateX(-50%)", zIndex: "15", display: "none", flexDirection: "column", alignItems: "center", gap: "7px", fontFamily: "var(--font-jbmono),monospace", pointerEvents: "none" }}>
          <div ref={v.ledRef} style={{ display: "flex", gap: "4px" }}>
            {v.leds.map((l, lIdx) => (
              <span key={lIdx} style={{ width: "12px", height: "5px", background: "rgba(255,255,255,.1)" }} />
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "stretch", background: "var(--panel,rgba(9,15,34,.9))", border: "1px solid var(--line,rgba(255,255,255,.14))" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", padding: "8px 14px", borderRight: "1px solid var(--line,rgba(255,255,255,.14))" }}>
              <span ref={v.spdRef} style={{ fontSize: "22px", fontWeight: "700", minWidth: "3ch", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>0</span>
              <span style={{ fontSize: "9px", letterSpacing: ".14em", color: "var(--muted,#8a9099)" }}>KM/H</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px", padding: "8px 14px", borderRight: "1px solid var(--line,rgba(255,255,255,.14))" }}>
              <span style={{ fontSize: "9px", letterSpacing: ".14em", color: "var(--muted,#8a9099)" }}>GEAR</span>
              <span ref={v.gearRef} style={{ fontSize: "22px", fontWeight: "700", color: "#FFC72C" }}>N</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", padding: "8px 14px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", letterSpacing: ".14em", color: v.drsColor }}>DRS</span>
            </div>
          </div>
        </div>
        <main style={{ position: "relative", zIndex: "2", opacity: v.contentOpacity, pointerEvents: v.contentPE, transition: "opacity .6s" }}>
          <section id="s-car" data-screen-label="01 Garage" style={{ position: "relative", height: "600vh" }}>
            <div style={{ position: "sticky", top: "0", height: "100vh", overflow: "hidden", pointerEvents: "none" }}>
              <div ref={v.heroTitleRef} style={{ position: "absolute", inset: "0", padding: "clamp(88px,13vh,130px) clamp(20px,5vw,72px) clamp(100px,15vh,140px)", display: "flex", flexDirection: "column", justifyContent: "flex-end", boxSizing: "border-box" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "28px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "540px" }}>
                    <h1 className="c11-hero-h1" style={{ margin: "0", fontWeight: "900", fontStretch: "150%", fontStyle: "italic", fontSize: "clamp(48px,6.4vw,100px)", lineHeight: ".84", letterSpacing: "-.02em", textTransform: "uppercase" }}>Krish</h1>
                    <p style={{ margin: "0", fontSize: "clamp(17px,1.4vw,21px)", lineHeight: "1.4", textWrap: "pretty" }}>Full-stack developer. I build web platforms end to end, from the database to the interface.</p>
                  </div>
                  <div ref={v.cueRef} className="c11-hero-cue" style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px", fontFamily: "var(--font-jbmono),monospace", fontSize: "10px", letterSpacing: ".24em", color: "var(--muted,#8a9099)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#eef0f2" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#FFC72C", fontSize: "13px", letterSpacing: "0" }}>
                        <span>‹</span>
                        <span style={{ width: "26px", height: "1px", background: "#FFC72C" }} />
                        <span>›</span>
                      </span>
                      <span>DRAG OR SWIPE SIDEWAYS TO ROTATE</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ width: "44px", height: "1px", background: "#FFC72C" }} />
                      <span>SCROLL TO OPEN THE CAR</span>
                    </div>
                  </div>
                </div>
              </div>
              <div ref={v.breakdownRef} style={{ position: "absolute", inset: "0", opacity: "0" }}>
                <div style={{ position: "absolute", left: "clamp(20px,5vw,72px)", top: "clamp(86px,13vh,128px)", display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontWeight: "900", fontStretch: "140%", fontStyle: "italic", fontSize: "clamp(30px,3.6vw,54px)", lineHeight: ".9", textTransform: "uppercase" }}>Inside car 21</span>
                </div>
                <nav className="c11-rail" aria-label="Car parts" style={{ position: "absolute", right: "clamp(16px,3vw,40px)", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "6px", fontFamily: "var(--font-jbmono),monospace" }}>
                  {v.partRail.map((r, rIdx) => (
                    <button key={rIdx} type="button" onClick={r.go} aria-current={r.on ? 'step' : undefined} style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", padding: "6px 0", background: "none", border: "0", cursor: "pointer", fontFamily: "inherit", fontSize: "10px", letterSpacing: ".18em", color: r.color, transition: "color .4s" }}>
                      <span>{r.name}</span>
                      <span style={{ width: r.w, height: "2px", background: r.color, transition: "width .5s" }} />
                      <span style={{ fontWeight: "700" }}>{r.n}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </section>
          <section id="s-grid" data-screen-label="02 Grid" style={{ position: "relative", height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", padding: "0 20px clamp(150px,22vh,220px)", boxSizing: "border-box", textAlign: "center" }}>
            <div ref={v.gridRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", opacity: "0" }}>
              <span style={{ fontWeight: "900", fontStretch: "150%", fontStyle: "italic", fontSize: "clamp(44px,7vw,108px)", lineHeight: ".84", textTransform: "uppercase" }}>Lights out</span>
              <span style={{ fontSize: "15px", lineHeight: "1.5", maxWidth: "440px", color: "var(--muted,#8a9099)", textWrap: "pretty" }}>
                Start the race, then scroll to drive one lap. Each corner holds part of the story.
              </span>
              {v.showStart ? (
                <button className="c11-h2" onClick={v.startRace} style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "16px", padding: "18px 30px", background: "#E4002B", color: "#ffffff", border: "0", fontWeight: "900", fontStretch: "150%", fontStyle: "italic", fontSize: "24px", textTransform: "uppercase", cursor: "pointer", clipPath: "polygon(14px 0,100% 0,calc(100% - 14px) 100%,0 100%)", pointerEvents: "auto" }}>
                  <span style={{ display: "flex", gap: "4px" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3a0610" }} />
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3a0610" }} />
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3a0610" }} />
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3a0610" }} />
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3a0610" }} />
                  </span>
                  Start the race
                </button>
              ) : null}
              {v.showStart ? (
                <button className="c11-h3" onClick={v.goHome} style={{ marginTop: "4px", padding: "10px 16px", background: "transparent", color: "#eef0f2", border: "1px solid rgba(255,255,255,.22)", fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", fontWeight: "700", letterSpacing: ".14em", cursor: "pointer", pointerEvents: "auto", transition: "border-color .2s, color .2s" }}>↑ BACK TO GARAGE</button>
              ) : null}
            </div>
          </section>
          <section id="s-driver" data-screen-label="03 Driver profile" style={{ minHeight: "150vh", padding: "max(22vh,110px) clamp(20px,6vw,120px) 22vh clamp(20px,6vw,120px)", display: "flex", alignItems: "center", justifyContent: "flex-start", boxSizing: "border-box" }}>
            <div data-reveal="1" style={{ width: "min(860px,100%)", display: "flex", flexWrap: "wrap", gap: "28px", alignItems: "center" }}>
              <div onMouseMove={v.cardMove} onMouseLeave={v.cardLeave} style={{ perspective: "1000px", flex: "0 0 auto" }}>
                <div ref={v.cardRef} style={{ position: "relative", width: "300px", height: "440px", background: "#0d0f12", border: "1px solid rgba(255,199,44,.45)", transformStyle: "preserve-3d", transition: "transform .25s ease-out", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.5)", color: "#eef0f2" }}>
                  <div style={{ position: "absolute", left: "0", right: "0", top: "0", height: "6px", background: "repeating-linear-gradient(118deg,#FFC72C 0 14px,#0d0e10 14px 19px)" }} />
                  <div style={{ position: "absolute", left: "16px", right: "16px", top: "20px", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-jbmono),monospace", fontSize: "9px", letterSpacing: ".18em", color: "#9aa1aa" }}>
                    <span>DRIVER LICENCE</span>
                    <span>2028</span>
                  </div>
                  <div style={{ position: "absolute", left: "16px", right: "16px", top: "42px", height: "230px", background: "#15181d" }}>
                    <DriverPhoto placeholder="Driver photo" style={{ display: "block", width: "100%", height: "100%" }} />
                  </div>
                  <div style={{ position: "absolute", right: "10px", top: "196px", fontWeight: "900", fontStretch: "150%", fontStyle: "italic", fontSize: "112px", lineHeight: ".8", color: "#FFC72C", letterSpacing: "-.05em", textShadow: "0 6px 24px rgba(0,0,0,.6)", pointerEvents: "none" }}>21</div>
                  <div style={{ position: "absolute", left: "16px", right: "16px", top: "288px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ fontWeight: "900", fontStretch: "140%", fontSize: "34px", lineHeight: ".9", textTransform: "uppercase" }}>Krish</div>
                    <div style={{ fontFamily: "var(--font-jbmono),monospace", fontSize: "10px", letterSpacing: ".16em", color: "#FFC72C" }}>TEAM NIT ROURKELA</div>
                  </div>
                  <div style={{ position: "absolute", left: "16px", right: "16px", bottom: "16px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", fontFamily: "var(--font-jbmono),monospace", fontSize: "9px", letterSpacing: ".12em" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      <span style={{ color: "#9aa1aa" }}>ROLL NO.</span>
                      <span style={{ fontSize: "12px" }}>124EI0011</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      <span style={{ color: "#9aa1aa" }}>DISCIPLINE</span>
                      <span style={{ fontSize: "12px" }}>E&amp;I</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      <span style={{ color: "#9aa1aa" }}>CAR</span>
                      <span style={{ fontSize: "12px" }}>#21</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                      <span style={{ color: "#9aa1aa" }}>BATCH</span>
                      <span style={{ fontSize: "12px" }}>2024 – 2028</span>
                    </div>
                  </div>
                  <div ref={v.holoRef} style={{ position: "absolute", inset: "0", pointerEvents: "none", opacity: "0", mixBlendMode: "color-dodge", background: "linear-gradient(115deg, rgba(255,0,170,0) 20%, rgba(255,80,200,.35) 35%, rgba(80,220,255,.35) 48%, rgba(255,230,90,.35) 60%, rgba(0,0,0,0) 75%)", backgroundSize: "250% 250%", transition: "opacity .3s" }} />
                </div>
              </div>
              <div style={{ flex: "1 1 300px", minWidth: "0", padding: "30px", background: "var(--panel,rgba(9,15,34,.9))", border: "1px solid var(--line,rgba(255,255,255,.14))", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", letterSpacing: ".22em", color: "#FFC72C" }}>{v.stopTag0} · DRIVER PROFILE</div>
                <h2 style={{ margin: "0", fontWeight: "900", fontStretch: "135%", fontSize: "clamp(30px,5vw,72px)", lineHeight: ".88", textTransform: "uppercase" }}>The driver</h2>
                <p style={{ margin: "0", fontSize: "17px", lineHeight: "1.55", color: "var(--ink,#eef0f2)", textWrap: "pretty" }}>
                  Krish Agarwal, B.Tech in Electronics &amp; Instrumentation at NIT Rourkela. I build full-stack web platforms with React, Next.js, Node.js and TypeScript. OmniPool, an AI hardware-collaboration platform, made the Google Solution Challenge 2026 global top 100, and I won a Hack4Safety track run by Odisha Police. Off the track I’m Technical Lead at OpenCode and on the core teams behind HackNITR and Innovision.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", borderTop: "1px solid var(--line,rgba(255,255,255,.14))" }}>
                  {v.stats.map((s, sIdx) => (
                    <div key={sIdx} style={{ padding: "16px 12px 0 0", display: "flex", flexDirection: "column", gap: "6px" }}>
                      <span style={{ fontWeight: "900", fontStretch: "140%", fontSize: "clamp(28px,3vw,40px)", lineHeight: "1" }}>{s.value}</span>
                      <span style={{ fontFamily: "var(--font-jbmono),monospace", fontSize: "10px", letterSpacing: ".14em", color: "var(--muted,#8a9099)" }}>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section id="s-garage" data-screen-label="04 Garage" style={{ minHeight: "150vh", padding: "max(22vh,110px) clamp(20px,6vw,120px)", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
            <div data-reveal="1" style={{ width: "min(820px,100%)", padding: "30px", background: "var(--panel,rgba(9,15,34,.9))", border: "1px solid var(--line,rgba(255,255,255,.14))", display: "flex", flexDirection: "column", gap: "22px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div style={{ fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", letterSpacing: ".22em", color: "#FFC72C" }}>{v.stopTag1} · THE GARAGE</div>
                  <h2 style={{ margin: "0", fontWeight: "900", fontStretch: "135%", fontSize: "clamp(30px,5vw,72px)", lineHeight: ".88", textTransform: "uppercase" }}>Projects</h2>
                </div>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", fontFamily: "var(--font-jbmono),monospace", fontSize: "10px", letterSpacing: ".12em", color: "var(--muted,#8a9099)" }}>
                  {v.compounds.map((c, cIdx) => (
                    <span key={cIdx} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "12px", height: "12px", borderRadius: "50%", border: `3px solid ${c.color}`, boxSizing: "border-box" }} />
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="c11-projgrid" style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "16px", paddingTop: "10px" }}>
                {v.projects.map((p, pIdx) => (
                  <button key={pIdx} onClick={p.select} style={{ position: "relative", display: "flex", flexDirection: "column", padding: "0", background: "transparent", border: "0", color: "inherit", textAlign: "left", cursor: "pointer", transform: p.transform, opacity: p.opacity, transition: "transform .6s cubic-bezier(.2,.9,.2,1), opacity .4s" }}>
                    <div style={{ position: "absolute", left: "-10%", right: "-10%", top: "-30px", height: "120px", background: "radial-gradient(60% 100% at 50% 0%, rgba(255,240,210,.35), rgba(255,240,210,0))", opacity: p.spot, transition: "opacity .5s", pointerEvents: "none" }} />
                    <div className="c11-proj-livery" style={{ position: "relative", height: "132px", background: p.livery, border: "1px solid rgba(255,255,255,.12)", overflow: "hidden" }}>
                      <div className="c11-proj-num" style={{ position: "absolute", left: "12px", bottom: "8px", fontWeight: "900", fontStretch: "150%", fontStyle: "italic", fontSize: "56px", lineHeight: ".8", color: "#0a0a0a", mixBlendMode: "multiply", opacity: ".8" }}>{p.num}</div>
                    </div>
                    <div style={{ padding: "14px 2px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                        <span className="c11-proj-name" style={{ fontWeight: "800", fontStretch: "125%", fontSize: "20px", textTransform: "uppercase", lineHeight: "1", minWidth: "0" }}>{p.name}</span>
                        <span className="c11-proj-ring" style={{ width: "18px", height: "18px", flex: "0 0 18px", borderRadius: "50%", border: `4px solid ${p.cc}`, background: "#111", boxSizing: "border-box" }} />
                      </div>
                      <span style={{ fontFamily: "var(--font-jbmono),monospace", fontSize: "10px", letterSpacing: ".14em", color: "var(--muted,#8a9099)" }}>{p.compound} · {p.tag}</span>
                    </div>
                    <div style={{ height: "8px", background: "#16191e", borderTop: `2px solid ${p.standColor}` }} />
                  </button>
                ))}
              </div>
              <div className="c11-projdetail" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: "24px", paddingTop: "18px", borderTop: "1px solid var(--line,rgba(255,255,255,.14))" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}>
                  <div style={{ fontFamily: "var(--font-jbmono),monospace", fontSize: "10px", letterSpacing: ".18em", color: "#FFC72C" }}>ON THE STAND · {v.sel.num}</div>
                  <div style={{ fontWeight: "900", fontStretch: "130%", fontSize: "30px", lineHeight: ".95", textTransform: "uppercase" }}>{v.sel.name}</div>
                  <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.5", textWrap: "pretty" }}>{v.sel.desc}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "0" }}>
                  <div style={{ fontFamily: "var(--font-jbmono),monospace", fontSize: "10px", letterSpacing: ".18em", color: "var(--muted,#8a9099)" }}>SETUP SHEET</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {v.sel.stack.map((s, sIdx) => (
                      <span key={sIdx} style={{ fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", padding: "5px 8px", border: "1px solid var(--line,rgba(255,255,255,.14))" }}>{s}</span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "16px", fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", letterSpacing: ".12em" }}>
                    {v.sel.repo ? <a href={v.sel.repo} target="_blank" rel="noopener noreferrer">REPO ↗</a> : null}
                    {v.sel.live ? <a href={v.sel.live} target="_blank" rel="noopener noreferrer">LIVE ↗</a> : null}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="s-standings" data-screen-label="05 Standings" style={{ minHeight: "150vh", padding: "max(22vh,110px) clamp(20px,6vw,120px) 22vh clamp(20px,6vw,120px)", display: "flex", alignItems: "center", justifyContent: "flex-start", boxSizing: "border-box" }}>
            <div data-reveal="1" style={{ width: "min(720px,100%)", padding: "30px", background: "var(--panel,rgba(9,15,34,.9))", border: "1px solid var(--line,rgba(255,255,255,.14))", display: "flex", flexDirection: "column", gap: "22px", boxSizing: "border-box" }}>
              <div style={{ fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", letterSpacing: ".22em", color: "#FFC72C" }}>{v.stopTag2} · CAREER STANDINGS</div>
              <h2 style={{ margin: "0", fontWeight: "900", fontStretch: "135%", fontSize: "clamp(30px,5vw,72px)", lineHeight: ".88", textTransform: "uppercase" }}>Experience</h2>
              <div style={{ display: "flex", flexDirection: "column", fontFamily: "var(--font-jbmono),monospace" }}>
                <div className="c11-st-head" style={{ display: "grid", gridTemplateColumns: "56px minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr)", gap: "12px", padding: "0 0 10px", fontSize: "9px", letterSpacing: ".16em", color: "var(--muted,#8a9099)", borderBottom: "1px solid var(--line,rgba(255,255,255,.14))" }}>
                  <span>RND</span>
                  <span>EVENT</span>
                  <span>ROLE</span>
                  <span style={{ textAlign: "right" }}>ENTRY</span>
                </div>
                {v.standings.map((r, rIdx) => (
                  <div key={rIdx} className="c11-st-row" style={{ display: "grid", gridTemplateColumns: "56px minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr)", gap: "12px", alignItems: "center", padding: "16px 0", borderBottom: "1px solid var(--line,rgba(255,255,255,.14))" }}>
                    <span style={{ fontSize: "11px", fontWeight: "700", padding: "4px 0", textAlign: "center", background: r.badgeBg, color: r.badgeInk }}>{r.rnd}</span>
                    <span style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
                      <span style={{ fontFamily: "var(--font-anybody),sans-serif", fontWeight: "800", fontStretch: "120%", fontSize: "20px", textTransform: "uppercase", lineHeight: "1" }}>{r.event}</span>
                      <span style={{ fontSize: "10px", lineHeight: "1.5", letterSpacing: ".06em", color: "var(--muted,#8a9099)" }}>{r.note}</span>
                    </span>
                    <span style={{ fontSize: "12px" }}>{r.role}</span>
                    {r.href ? <a href={r.href} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", letterSpacing: ".12em", textAlign: "right", color: r.tagColor }}>{r.f1} ↗</a> : <span style={{ fontSize: "11px", letterSpacing: ".12em", textAlign: "right", color: r.tagColor }}>{r.f1}</span>}
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section id="s-telemetry" data-screen-label="06 Telemetry" style={{ minHeight: "150vh", padding: "max(22vh,110px) clamp(20px,6vw,120px)", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
            <div ref={v.teleRef} data-reveal="1" style={{ width: "min(840px,100%)", padding: "30px", background: "var(--panel,rgba(9,15,34,.9))", border: "1px solid var(--line,rgba(255,255,255,.14))", display: "flex", flexDirection: "column", gap: "24px", boxSizing: "border-box" }}>
              <div style={{ fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", letterSpacing: ".22em", color: "#FFC72C" }}>{v.stopTag3} · TELEMETRY</div>
              <h2 style={{ margin: "0", fontWeight: "900", fontStretch: "135%", fontSize: "clamp(30px,5vw,72px)", lineHeight: ".88", textTransform: "uppercase" }}>Skills</h2>
              <div className="c11-gauges" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "14px" }}>
                {v.gauges.map((g, gIdx) => (
                  <div key={gIdx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "14px 8px", border: "1px solid var(--line,rgba(255,255,255,.14))" }}>
                    <div className="c11-dial" style={{ position: "relative", width: "128px", height: "128px" }}>
                      <svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%", display: "block" }}>
                        <circle cx="60" cy="60" r="48" style={{ fill: "none", stroke: "rgba(140,146,156,.22)", strokeWidth: "7", strokeDasharray: "226.19 301.59", transform: "rotate(135deg)", transformOrigin: "60px 60px" }} />
                        <circle cx="60" cy="60" r="48" style={{ fill: "none", stroke: "#E8352B", strokeWidth: "7", strokeDasharray: "33.93 301.59", strokeDashoffset: "-192.26", transform: "rotate(135deg)", transformOrigin: "60px 60px", opacity: ".6" }} />
                        <circle cx="60" cy="60" r="48" style={{ fill: "none", stroke: "#FFC72C", strokeWidth: "7", strokeDasharray: g.dash, transform: "rotate(135deg)", transformOrigin: "60px 60px", transition: "stroke-dasharray 1.8s cubic-bezier(.2,.8,.2,1)" }} />
                      </svg>
                      <div style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2px", fontFamily: "var(--font-jbmono),monospace" }}>
                        <span style={{ fontSize: "17px", fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>{g.rpm}</span>
                        <span style={{ fontSize: "8px", letterSpacing: ".18em", color: "var(--muted,#8a9099)" }}>RPM</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: "800", fontStretch: "125%", fontSize: "16px", letterSpacing: ".02em" }}>{g.name}</span>
                    <span style={{ fontFamily: "var(--font-jbmono),monospace", fontSize: "10px", color: "var(--muted,#8a9099)", textAlign: "center" }}>{g.stack}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap", fontFamily: "var(--font-jbmono),monospace", fontSize: "10px", letterSpacing: ".16em" }}>
                  <span style={{ color: "#FFC72C" }}>SPEED TRACE · SEASON 2025–26</span>
                  <span style={{ display: "flex", gap: "14px", color: "var(--muted,#8a9099)" }}>
                    <span style={{ color: "#2BD96B" }}>THR · SHIPPING</span>
                    <span style={{ color: "#E8352B" }}>BRK · DEBUGGING</span>
                  </span>
                </div>
                <svg viewBox="0 0 600 250" preserveAspectRatio="none" style={{ width: "100%", height: "230px", display: "block", border: "1px solid var(--line,rgba(255,255,255,.14))" }}>
                  <line x1="0" y1="40" x2="600" y2="40" style={{ stroke: "rgba(140,146,156,.16)", strokeWidth: "1" }} />
                  <line x1="0" y1="85" x2="600" y2="85" style={{ stroke: "rgba(140,146,156,.16)", strokeWidth: "1" }} />
                  <line x1="0" y1="130" x2="600" y2="130" style={{ stroke: "rgba(140,146,156,.16)", strokeWidth: "1" }} />
                  <line x1="0" y1="160" x2="600" y2="160" style={{ stroke: "rgba(140,146,156,.3)", strokeWidth: "1" }} />
                  <line x1="0" y1="205" x2="600" y2="205" style={{ stroke: "rgba(140,146,156,.3)", strokeWidth: "1" }} />
                  <line x1="200" y1="0" x2="200" y2="250" style={{ stroke: "rgba(140,146,156,.25)", strokeWidth: "1", strokeDasharray: "3 5" }} />
                  <line x1="400" y1="0" x2="400" y2="250" style={{ stroke: "rgba(140,146,156,.25)", strokeWidth: "1", strokeDasharray: "3 5" }} />
                  <polyline points={v.trace.speed} pathLength="1" style={{ fill: "none", stroke: "#FFC72C", strokeWidth: "2.2", strokeLinejoin: "round", strokeDasharray: "1", strokeDashoffset: v.traceOffset, transition: "stroke-dashoffset 2.4s ease-out" }} />
                  <polyline points={v.trace.thr} pathLength="1" style={{ fill: "none", stroke: "#2BD96B", strokeWidth: "1.6", strokeDasharray: "1", strokeDashoffset: v.traceOffset, transition: "stroke-dashoffset 2.8s ease-out .2s" }} />
                  <polyline points={v.trace.brk} pathLength="1" style={{ fill: "none", stroke: "#E8352B", strokeWidth: "1.6", strokeDasharray: "1", strokeDashoffset: v.traceOffset, transition: "stroke-dashoffset 2.8s ease-out .4s" }} />
                </svg>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-jbmono),monospace", fontSize: "9px", letterSpacing: ".14em", color: "var(--muted,#8a9099)" }}>
                  <span>W01</span>
                  <span>S1</span>
                  <span>S2</span>
                  <span>S3</span>
                  <span>W52</span>
                </div>
              </div>
            </div>
          </section>
          <section id="s-radio" data-screen-label="07 Team radio" style={{ minHeight: "150vh", padding: "max(22vh,110px) clamp(20px,6vw,120px) 16vh clamp(20px,6vw,120px)", display: "flex", alignItems: "center", justifyContent: "flex-start", boxSizing: "border-box" }}>
            <form onSubmit={v.sendRadio} data-reveal="1" style={{ width: "min(640px,100%)", padding: "30px", margin: "0", background: "var(--panel,rgba(9,15,34,.9))", border: "1px solid var(--line,rgba(255,255,255,.14))", display: "flex", flexDirection: "column", gap: "20px", boxSizing: "border-box" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", letterSpacing: ".22em" }}>
                <span style={{ color: "#FFC72C" }}>{v.stopTag4} · TEAM RADIO</span>
                <span style={{ display: "flex", alignItems: "center", gap: "7px", color: "var(--muted,#8a9099)" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: v.radioDot }} />
                  CH 21
                </span>
              </div>
              <h2 style={{ margin: "0", fontWeight: "900", fontStretch: "135%", fontSize: "clamp(30px,5vw,72px)", lineHeight: ".88", textTransform: "uppercase" }}>Contact</h2>
              <canvas ref={v.waveRef} style={{ width: "100%", height: "72px", display: "block", borderTop: "1px solid var(--line,rgba(255,255,255,.14))", borderBottom: "1px solid var(--line,rgba(255,255,255,.14))" }} />
              {v.hasLog ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "var(--font-jbmono),monospace", fontSize: "12px", lineHeight: "1.5" }}>
                  {v.radioLog.map((m, mIdx) => (
                    <div key={mIdx} style={{ display: "grid", gridTemplateColumns: "86px minmax(0,1fr)", gap: "10px" }}>
                      <span style={{ color: m.color, letterSpacing: ".1em" }}>{m.who}</span>
                      <span>{m.text}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "14px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "7px", fontFamily: "var(--font-jbmono),monospace", fontSize: "10px", letterSpacing: ".16em", color: "var(--muted,#8a9099)" }}>
                  CALLSIGN
                  <input className="c11-f0" value={v.form.name} onChange={v.setName} placeholder="Your name" style={{ padding: "12px", background: "rgba(0,0,0,.25)", border: "1px solid var(--line,rgba(255,255,255,.14))", color: "var(--ink,#eef0f2)", fontFamily: "var(--font-jbmono),monospace", fontSize: "14px", letterSpacing: "0", outline: "none", cursor: "text" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "7px", fontFamily: "var(--font-jbmono),monospace", fontSize: "10px", letterSpacing: ".16em", color: "var(--muted,#8a9099)" }}>
                  FREQUENCY
                  <input className="c11-f0" value={v.form.email} onChange={v.setEmail} type="email" placeholder="you@domain.com" style={{ padding: "12px", background: "rgba(0,0,0,.25)", border: "1px solid var(--line,rgba(255,255,255,.14))", color: "var(--ink,#eef0f2)", fontFamily: "var(--font-jbmono),monospace", fontSize: "14px", letterSpacing: "0", outline: "none", cursor: "text" }} />
                </label>
              </div>
              <label style={{ display: "flex", flexDirection: "column", gap: "7px", fontFamily: "var(--font-jbmono),monospace", fontSize: "10px", letterSpacing: ".16em", color: "var(--muted,#8a9099)" }}>
                MESSAGE
                <textarea className="c11-f0" value={v.form.msg} onChange={v.setMsg} rows="4" placeholder="Go ahead, Krish is listening." style={{ padding: "12px", resize: "vertical", background: "rgba(0,0,0,.25)", border: "1px solid var(--line,rgba(255,255,255,.14))", color: "var(--ink,#eef0f2)", fontFamily: "var(--font-jbmono),monospace", fontSize: "14px", letterSpacing: "0", lineHeight: "1.5", outline: "none", cursor: "text" }} />
              </label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <button className="c11-h1" type="submit" style={{ padding: "16px 26px", background: "#FFC72C", color: "#0a0a0a", border: "0", fontWeight: "900", fontStretch: "150%", fontStyle: "italic", fontSize: "22px", letterSpacing: ".02em", cursor: "pointer", clipPath: "polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%)" }}>BOX BOX</button>
                <a className="c11-h3" href="/krish-agarwal-cv.pdf" download="Krish-Agarwal-CV.pdf" style={{ padding: "15px 18px", border: "1px solid var(--line,rgba(255,255,255,.14))", color: "var(--ink,#eef0f2)", fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", letterSpacing: ".14em" }}>DOWNLOAD CV ↓</a>
              </div>
              <div style={{ display: "flex", gap: "18px", flexWrap: "wrap", fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", letterSpacing: ".14em" }}>
                <a href="https://github.com/Krish-2118" target="_blank" rel="noopener noreferrer">GITHUB ↗</a>
                <a href="https://www.linkedin.com/in/krish2121/" target="_blank" rel="noopener noreferrer">LINKEDIN ↗</a>
                <a href="mailto:agarwalkrish526@gmail.com">EMAIL ↗</a>
              </div>
            </form>
          </section>
          <section id="s-finish" data-screen-label="08 Chequered flag" style={{ position: "relative", padding: "0 0 120px" }}>
            <div style={{ height: "48px", background: "repeating-conic-gradient(#eef0f2 0 25%, #0a0a0a 0 50%) 0 0 / 48px 48px" }} />
            <div data-reveal="1" style={{ padding: "70px clamp(20px,6vw,120px) 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "22px", textAlign: "center" }}>
              <div style={{ fontWeight: "900", fontStretch: "150%", fontStyle: "italic", fontSize: "clamp(34px,9vw,140px)", lineHeight: ".85", textTransform: "uppercase" }}>Lap complete</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "center", fontFamily: "var(--font-jbmono),monospace", fontSize: "12px", fontWeight: "700", letterSpacing: ".14em" }}>
                <button className="c11-h1" onClick={v.goHome} style={{ padding: "15px 26px 15px 24px", background: "#FFC72C", color: "#050914", border: "0", clipPath: "polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%)", cursor: "pointer" }}>↑ BACK TO GARAGE</button>
                <button className="c11-h2" onClick={v.raceAgain} style={{ padding: "15px 26px 15px 24px", background: "#E4002B", color: "#ffffff", border: "0", clipPath: "polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%)", cursor: "pointer" }}>RACE AGAIN</button>
                <button className="c11-h0" onClick={v.openReaction} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "15px 24px 15px 22px", background: "rgba(9,15,34,.88)", color: "#eef0f2", border: "0", clipPath: "polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%)", cursor: "pointer", transition: "background .2s, color .2s" }}>REACTION TEST</button>
                <button className="c11-h0" onClick={v.openPit} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "15px 24px 15px 22px", background: "rgba(9,15,34,.88)", color: "#eef0f2", border: "0", clipPath: "polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%)", cursor: "pointer", transition: "background .2s, color .2s" }}>PIT STOP CHALLENGE</button>
                <button className="c11-h0" onClick={v.enterFP} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "15px 24px 15px 22px", background: "rgba(9,15,34,.88)", color: "#eef0f2", border: "0", clipPath: "polygon(9px 0,100% 0,calc(100% - 9px) 100%,0 100%)", cursor: "pointer", transition: "background .2s, color .2s" }}>FREE PRACTICE · F</button>
              </div>
              <div style={{ fontFamily: "var(--font-jbmono),monospace", fontSize: "10px", letterSpacing: ".12em", color: "var(--muted,#8a9099)", maxWidth: "560px", lineHeight: "1.7" }}>
                PRESS D FOR DRS · ORIGINAL LIVERY AND TEAM · NOT AFFILIATED WITH FORMULA 1
              </div>
            </div>
          </section>
        </main>
        {v.toast ? (
          <div style={{ position: "fixed", left: "50%", top: "150px", transform: "translateX(-50%)", zIndex: "35", padding: "10px 18px", background: "#0a0a0a", border: `1px solid ${v.toastColor}`, color: v.toastColor, fontFamily: "var(--font-jbmono),monospace", fontSize: "12px", fontWeight: "700", letterSpacing: ".2em" }}>{v.toast}</div>
        ) : null}
        {v.isFP ? (
          <div style={{ position: "fixed", top: "84px", left: "50%", transform: "translateX(-50%)", zIndex: "30", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", fontFamily: "var(--font-jbmono),monospace", textAlign: "center" }}>
            <div style={{ fontWeight: "900", fontFamily: "var(--font-anybody),sans-serif", fontStretch: "150%", fontStyle: "italic", fontSize: "clamp(28px,4vw,48px)", lineHeight: ".9", textTransform: "uppercase" }}>Free practice</div>
            <div style={{ fontSize: "11px", letterSpacing: ".16em", color: "var(--muted,#8a9099)" }}>{v.fpHint}</div>
            <div style={{ display: "flex", gap: "1px", background: "var(--line,rgba(255,255,255,.14))", border: "1px solid var(--line,rgba(255,255,255,.14))" }}>
              <div style={{ padding: "8px 14px", background: "#FFC72C", color: "#0a0a0a", display: "flex", alignItems: "center", fontSize: "13px", fontWeight: "700", letterSpacing: ".1em" }}>{v.fpLap}</div>
              <div style={{ padding: "8px 14px", background: "var(--panel,rgba(9,15,34,.84))", display: "flex", flexDirection: "column", gap: "3px", minWidth: "92px" }}>
                <span style={{ fontSize: "9px", letterSpacing: ".16em", color: "var(--muted,#8a9099)" }}>CURRENT</span>
                <span ref={v.fpLapRef} style={{ fontSize: "18px", fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>0:00.000</span>
              </div>
              <div style={{ padding: "8px 14px", background: "var(--panel,rgba(9,15,34,.84))", display: "flex", flexDirection: "column", gap: "3px", minWidth: "92px" }}>
                <span style={{ fontSize: "9px", letterSpacing: ".16em", color: "var(--muted,#8a9099)" }}>LAST</span>
                <span style={{ fontSize: "18px", fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>{v.fpLast}</span>
              </div>
              <div style={{ padding: "8px 14px", background: "var(--panel,rgba(9,15,34,.84))", display: "flex", flexDirection: "column", gap: "3px", minWidth: "92px" }}>
                <span style={{ fontSize: "9px", letterSpacing: ".16em", color: "var(--muted,#8a9099)" }}>BEST</span>
                <span style={{ fontSize: "18px", fontWeight: "700", color: "#B44CFF", fontVariantNumeric: "tabular-nums" }}>{v.fpBest}</span>
              </div>
            </div>
            <button onClick={v.exitFP} style={{ padding: "9px 14px", background: "#FFC72C", color: "#0a0a0a", border: "0", fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", fontWeight: "700", letterSpacing: ".14em", cursor: "pointer" }}>BACK TO THE LAP</button>
          </div>
        ) : null}
        {v.isFP ? (
          <div className="c11-touch" aria-hidden="true">
            <div>
              <button onPointerDown={v.touchKey('arrowleft', true)} onPointerUp={v.touchKey('arrowleft', false)} onPointerCancel={v.touchKey('arrowleft', false)} onContextMenu={e => e.preventDefault()}>◀</button>
              <button onPointerDown={v.touchKey('arrowright', true)} onPointerUp={v.touchKey('arrowright', false)} onPointerCancel={v.touchKey('arrowright', false)} onContextMenu={e => e.preventDefault()}>▶</button>
            </div>
            <div>
              <button data-k="brake" onPointerDown={v.touchKey('arrowdown', true)} onPointerUp={v.touchKey('arrowdown', false)} onPointerCancel={v.touchKey('arrowdown', false)} onContextMenu={e => e.preventDefault()}>BRAKE</button>
              <button data-k="gas" onPointerDown={v.touchKey('arrowup', true)} onPointerUp={v.touchKey('arrowup', false)} onPointerCancel={v.touchKey('arrowup', false)} onContextMenu={e => e.preventDefault()}>GAS</button>
            </div>
          </div>
        ) : null}
        {v.isReaction ? (
          <div role="dialog" aria-modal="true" aria-label="Reaction test" onPointerDown={v.rtPointer} className="c11-modal" style={{ touchAction: "manipulation" }}>
            <button className="c11-x" onClick={v.closeModal} aria-label="Close reaction test">✕</button>
            <div className="c11-modal-in" style={{ gap: "26px" }}>
            <div style={{ fontSize: "11px", letterSpacing: ".22em", color: "#FFC72C" }}>REACTION TEST</div>
            <div style={{ display: "flex", gap: "12px" }}>
              {v.rtLights.map((l, lIdx) => (
                <div key={lIdx} style={{ padding: "9px", background: "#111317", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "9px" }}>
                  <span style={{ width: "clamp(34px,7vw,56px)", height: "clamp(34px,7vw,56px)", borderRadius: "50%", background: "#1b1d21" }} />
                  <span style={{ width: "clamp(34px,7vw,56px)", height: "clamp(34px,7vw,56px)", borderRadius: "50%", background: l.color, boxShadow: l.glow }} />
                </div>
              ))}
            </div>
            <div style={{ fontFamily: "var(--font-anybody),sans-serif", fontWeight: "900", fontStretch: "150%", fontStyle: "italic", fontSize: "clamp(36px,6vw,80px)", lineHeight: ".9", textTransform: "uppercase", textAlign: "center" }}>{v.rtHeadline}</div>
            <div style={{ fontSize: "12px", letterSpacing: ".14em", color: "#9aa1aa", textAlign: "center", minHeight: "2.6em", maxWidth: "460px", lineHeight: "1.5" }}>{v.rtSub}</div>
            <div style={{ display: "flex", gap: "10px", minHeight: "40px" }}>
              {v.rtCta ? (
                <button autoFocus onClick={v.rtHit} style={{ padding: "11px 22px", background: "#FFC72C", color: "#0a0a0a", border: "0", fontFamily: "var(--font-jbmono),monospace", fontSize: "12px", fontWeight: "700", letterSpacing: ".14em", cursor: "pointer" }}>{v.rtCta}</button>
              ) : null}
              <button onClick={v.closeModal} style={{ padding: "11px 16px", background: "transparent", color: "#eef0f2", border: "1px solid rgba(255,255,255,.2)", fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", letterSpacing: ".14em", cursor: "pointer" }}>CLOSE · ESC</button>
            </div>
            {v.hasBoard ? (
              <div style={{ width: "min(340px,100%)", display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,.14)" }}>
                <div style={{ padding: "8px 12px", fontSize: "9px", letterSpacing: ".18em", color: "#9aa1aa", borderBottom: "1px solid rgba(255,255,255,.14)" }}>LEADERBOARD · THIS DEVICE</div>
                {v.board.map((b, bIdx) => (
                  <div key={bIdx} style={{ display: "flex", justifyContent: "space-between", padding: "7px 12px", fontSize: "13px", fontVariantNumeric: "tabular-nums" }}>
                    <span style={{ color: "#9aa1aa" }}>P{b.pos}</span>
                    <span style={{ color: b.color }}>{b.time}</span>
                  </div>
                ))}
              </div>
            ) : null}
            </div>
          </div>
        ) : null}
        {v.isPit ? (
          <div role="dialog" aria-modal="true" aria-label="Pit stop challenge" className="c11-modal" style={{ touchAction: "manipulation" }}>
            <button className="c11-x" onClick={v.closeModal} aria-label="Close pit stop challenge">✕</button>
            <div className="c11-modal-in" style={{ gap: "22px" }}>
            <div style={{ fontSize: "11px", letterSpacing: ".22em", color: "#FFC72C" }}>PIT STOP CHALLENGE · TARGET 2.50s</div>
            <div style={{ fontFamily: "var(--font-anybody),sans-serif", fontWeight: "900", fontStretch: "150%", fontStyle: "italic", fontSize: "clamp(48px,8vw,104px)", lineHeight: ".85", fontVariantNumeric: "tabular-nums" }}>
              <span>{v.pitTime}</span>
              <span ref={v.pitTimerRef} />
            </div>
            <div style={{ fontSize: "12px", letterSpacing: ".14em", color: "#9aa1aa", textAlign: "center", maxWidth: "420px", lineHeight: "1.6" }}>{v.pitSub}</div>
            <div className="c11-pitgrid" style={{ display: "grid", gridTemplateColumns: "80px 70px 80px", gridTemplateRows: "110px 110px 110px", gap: "10px", alignItems: "center", justifyItems: "center" }}>
              <button onClick={v.pitFL.go} style={{ gridColumn: "1", gridRow: "1", width: "64px", height: "96px", borderRadius: "10px", border: `3px solid ${v.pitFL.ring}`, background: v.pitFL.bg, color: "#0a0a0a", fontFamily: "var(--font-jbmono),monospace", fontWeight: "700", fontSize: "11px", cursor: "pointer", transition: "background .1s" }}>{v.pitFL.label}</button>
              <div style={{ gridColumn: "2", gridRow: "1 / span 3", width: "56px", height: "100%", background: "linear-gradient(#FFC72C,#d9a412)", clipPath: "polygon(35% 0,65% 0,80% 30%,100% 55%,100% 100%,0 100%,0 55%,20% 30%)" }} />
              <button onClick={v.pitFR.go} style={{ gridColumn: "3", gridRow: "1", width: "64px", height: "96px", borderRadius: "10px", border: `3px solid ${v.pitFR.ring}`, background: v.pitFR.bg, color: "#0a0a0a", fontFamily: "var(--font-jbmono),monospace", fontWeight: "700", fontSize: "11px", cursor: "pointer", transition: "background .1s" }}>{v.pitFR.label}</button>
              <button onClick={v.pitRL.go} style={{ gridColumn: "1", gridRow: "3", width: "70px", height: "100px", borderRadius: "10px", border: `3px solid ${v.pitRL.ring}`, background: v.pitRL.bg, color: "#0a0a0a", fontFamily: "var(--font-jbmono),monospace", fontWeight: "700", fontSize: "11px", cursor: "pointer", transition: "background .1s" }}>{v.pitRL.label}</button>
              <button onClick={v.pitRR.go} style={{ gridColumn: "3", gridRow: "3", width: "70px", height: "100px", borderRadius: "10px", border: `3px solid ${v.pitRR.ring}`, background: v.pitRR.bg, color: "#0a0a0a", fontFamily: "var(--font-jbmono),monospace", fontWeight: "700", fontSize: "11px", cursor: "pointer", transition: "background .1s" }}>{v.pitRR.label}</button>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button autoFocus onClick={v.pitStart} style={{ padding: "11px 18px", background: "#FFC72C", color: "#0a0a0a", border: "0", fontFamily: "var(--font-jbmono),monospace", fontSize: "12px", fontWeight: "700", letterSpacing: ".14em", cursor: "pointer" }}>{v.pitBtn}</button>
              <button onClick={v.closeModal} style={{ padding: "11px 16px", background: "transparent", color: "#eef0f2", border: "1px solid rgba(255,255,255,.2)", fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", letterSpacing: ".14em", cursor: "pointer" }}>CLOSE · ESC</button>
            </div>
            </div>
          </div>
        ) : null}
        {v.isBay ? (
          <div style={{ position: "fixed", inset: "0", zIndex: "40", background: "rgba(4,5,6,.93)", backdropFilter: "blur(8px)", overflow: "auto", fontFamily: "var(--font-jbmono),monospace", color: "#eef0f2" }}>
            <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "clamp(72px,10vh,110px) clamp(20px,4vw,48px) 48px", display: "flex", flexDirection: "column", gap: "26px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "20px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ fontSize: "11px", letterSpacing: ".22em", color: "#FFC72C" }}>GARAGE · MODEL BAY · CAR 21</div>
                  <div style={{ fontFamily: "var(--font-anybody),sans-serif", fontWeight: "900", fontStretch: "150%", fontStyle: "italic", fontSize: "clamp(40px,6vw,84px)", lineHeight: ".85", textTransform: "uppercase" }}>Chassis swap</div>
                </div>
                <button className="c11-h4" onClick={v.closeModal} style={{ padding: "11px 16px", background: "transparent", color: "#eef0f2", border: "1px solid rgba(255,255,255,.2)", fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", letterSpacing: ".14em", cursor: "pointer" }}>CLOSE · ESC</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,340px),1fr))", gap: "20px", alignItems: "stretch" }}>
                <label className="c11-h4" style={{ position: "relative", minHeight: "420px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "36px 28px 56px", border: "1px dashed rgba(255,199,44,.5)", background: "repeating-linear-gradient(135deg, rgba(255,199,44,.045) 0 2px, transparent 2px 14px), #0a0c0f", cursor: "pointer", textAlign: "center", overflow: "hidden" }}>
                  <input type="file" accept=".glb,.gltf,.bin,.png,.jpg,.jpeg,.webp" multiple={true} onChange={v.pickFiles} style={{ display: "none" }} />
                  <span style={{ position: "absolute", left: "14px", top: "14px", width: "22px", height: "22px", borderLeft: "2px solid #FFC72C", borderTop: "2px solid #FFC72C" }} />
                  <span style={{ position: "absolute", right: "14px", top: "14px", width: "22px", height: "22px", borderRight: "2px solid #FFC72C", borderTop: "2px solid #FFC72C" }} />
                  <span style={{ position: "absolute", left: "14px", bottom: "14px", width: "22px", height: "22px", borderLeft: "2px solid #FFC72C", borderBottom: "2px solid #FFC72C" }} />
                  <span style={{ position: "absolute", right: "14px", bottom: "14px", width: "22px", height: "22px", borderRight: "2px solid #FFC72C", borderBottom: "2px solid #FFC72C" }} />
                  <span style={{ fontSize: "10px", letterSpacing: ".24em", color: "#9aa1aa" }}>3D MODEL SLOT · 5.5 M · AUTO-SCALED</span>
                  <span style={{ fontFamily: "var(--font-anybody),sans-serif", fontWeight: "900", fontStretch: "150%", fontStyle: "italic", fontSize: "clamp(84px,11vw,150px)", lineHeight: ".8", letterSpacing: "-.03em", color: "transparent", WebkitTextStroke: "1px rgba(255,199,44,.7)" }}>RB22</span>
                  <span style={{ fontFamily: "var(--font-anybody),sans-serif", fontWeight: "800", fontStretch: "125%", fontSize: "22px", textTransform: "uppercase", lineHeight: "1.1" }}>Drop scene.glb here</span>
                  <span style={{ fontSize: "11px", lineHeight: "1.6", color: "#9aa1aa", maxWidth: "320px" }}>
                    or a .gltf with its .bin. Textures already in the project are picked up automatically.
                  </span>
                  <span style={{ marginTop: "6px", padding: "11px 18px", background: "#FFC72C", color: "#0a0a0a", fontSize: "12px", fontWeight: "700", letterSpacing: ".14em" }}>CHOOSE FILE</span>
                  <span style={{ position: "absolute", left: "0", right: "0", bottom: "22px", fontSize: "9px", letterSpacing: ".2em", color: "#7d848d" }}>STAYS IN THIS BROWSER · NOTHING IS UPLOADED · NO SIZE LIMIT</span>
                  <span style={{ position: "absolute", left: "0", bottom: "0", height: "2px", width: v.bayProgress, background: "#FFC72C", transition: "width .3s" }} />
                </label>
                <div style={{ display: "flex", flexDirection: "column", border: "1px solid rgba(255,255,255,.14)", background: "#0a0c0f" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                    <span style={{ fontSize: "10px", letterSpacing: ".2em", color: "#9aa1aa" }}>STATUS</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "700", letterSpacing: ".12em", color: v.bayStatusColor }}>
                      <span style={{ width: "8px", height: "8px", background: v.bayStatusColor }} />
                      {v.bayStatus}
                    </span>
                  </div>
                  {v.hasErr ? (
                    <div style={{ padding: "10px 18px", fontSize: "11px", lineHeight: "1.5", color: "#E8352B", borderBottom: "1px solid rgba(255,255,255,.1)" }}>{v.bayErr}</div>
                  ) : null}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                    <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: "5px", minWidth: "0", borderRight: "1px solid rgba(255,255,255,.1)", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                      <span style={{ fontSize: "9px", letterSpacing: ".18em", color: "#9aa1aa" }}>FILE</span>
                      <span style={{ fontSize: "13px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.modelName}</span>
                    </div>
                    <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: "5px", borderBottom: "1px solid rgba(255,255,255,.1)" }}>
                      <span style={{ fontSize: "9px", letterSpacing: ".18em", color: "#9aa1aa" }}>SIZE</span>
                      <span style={{ fontSize: "13px" }}>{v.modelSize}</span>
                    </div>
                    <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: "5px", borderRight: "1px solid rgba(255,255,255,.1)" }}>
                      <span style={{ fontSize: "9px", letterSpacing: ".18em", color: "#9aa1aa" }}>TRIANGLES</span>
                      <span style={{ fontSize: "13px", fontVariantNumeric: "tabular-nums" }}>{v.modelTris}</span>
                    </div>
                    <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: "5px" }}>
                      <span style={{ fontSize: "9px", letterSpacing: ".18em", color: "#9aa1aa" }}>MESHES</span>
                      <span style={{ fontSize: "13px", fontVariantNumeric: "tabular-nums" }}>{v.modelMeshes}</span>
                    </div>
                  </div>
                  <div style={{ padding: "14px 18px 4px", fontSize: "10px", letterSpacing: ".2em", color: "#9aa1aa" }}>DETECTED PARTS · DRIVES THE STRIP-DOWN</div>
                  <div style={{ display: "flex", flexDirection: "column", padding: "0 18px 10px" }}>
                    {v.bayParts.map((p, pIdx) => (
                      <div key={pIdx} style={{ display: "grid", gridTemplateColumns: "10px 1fr auto", gap: "10px", alignItems: "center", padding: "7px 0", borderBottom: "1px dashed rgba(255,255,255,.08)", fontSize: "12px" }}>
                        <span style={{ width: "7px", height: "7px", background: p.color }} />
                        <span>{p.name}</span>
                        <span style={{ fontSize: "10px", letterSpacing: ".08em", color: p.color }}>{p.detail}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "6px 18px 16px", opacity: v.modelBtnOpacity }}>
                    <button className="c11-h4" onClick={v.flipModel} style={{ padding: "9px 13px", background: "transparent", color: "#eef0f2", border: "1px solid rgba(255,255,255,.2)", fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", letterSpacing: ".12em", cursor: "pointer" }}>FLIP 180°</button>
                    <button className="c11-h5" onClick={v.removeModel} style={{ padding: "9px 13px", background: "transparent", color: "#eef0f2", border: "1px solid rgba(255,255,255,.2)", fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", letterSpacing: ".12em", cursor: "pointer" }}>REMOVE · BACK TO PROXY</button>
                  </div>
                  <div style={{ marginTop: "auto", padding: "14px 18px 16px", borderTop: "1px solid rgba(255,255,255,.1)", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "10px", letterSpacing: ".2em", color: "#9aa1aa" }}>OR LOAD FROM A HOSTED LINK</span>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input value={v.urlInput} onChange={v.setUrl} placeholder="https://…/rb22.glb" style={{ flex: "1", minWidth: "0", padding: "10px 12px", background: "#07080a", border: "1px solid rgba(255,255,255,.16)", color: "#eef0f2", fontFamily: "var(--font-jbmono),monospace", fontSize: "12px", outline: "none" }} />
                      <button onClick={v.loadUrlBtn} style={{ padding: "10px 16px", background: "#FFC72C", color: "#0a0a0a", border: "0", fontFamily: "var(--font-jbmono),monospace", fontSize: "11px", fontWeight: "700", letterSpacing: ".14em", cursor: "pointer" }}>LOAD</button>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "11px", lineHeight: "1.7", color: "#9aa1aa", maxWidth: "760px" }}>
                Detection reads mesh, material and texture names, then falls back to position. Naming objects wheel_FL, front_wing, rear_wing, halo and engine_cover in Blender gives the cleanest strip-down. Wheels spin and steer only when they are separate meshes.
              </div>
            </div>
          </div>
        ) : null}
        {v.dragOver ? (
          <div style={{ position: "fixed", inset: "0", zIndex: "90", background: "rgba(4,5,6,.82)", backdropFilter: "blur(6px)", pointerEvents: "none", padding: "24px", boxSizing: "border-box", fontFamily: "var(--font-jbmono),monospace", color: "#eef0f2" }}>
            <div style={{ width: "100%", height: "100%", border: "2px dashed #FFC72C", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", textAlign: "center", boxSizing: "border-box" }}>
              <span style={{ fontSize: "11px", letterSpacing: ".24em", color: "#FFC72C" }}>PIT LANE OPEN · RELEASE TO INSTALL</span>
              <span style={{ fontFamily: "var(--font-anybody),sans-serif", fontWeight: "900", fontStretch: "150%", fontStyle: "italic", fontSize: "clamp(52px,9vw,140px)", lineHeight: ".82", textTransform: "uppercase" }}>Drop the RB22</span>
              <span style={{ fontSize: "11px", letterSpacing: ".18em", color: "#9aa1aa" }}>GLB · GLTF + BIN</span>
            </div>
          </div>
        ) : null}
        {v.showGantry ? (
          <div style={{ position: "fixed", left: "50%", top: "92px", transform: "translateX(-50%)", zIndex: "30", display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", pointerEvents: "none", opacity: v.gantryOpacity, transition: "opacity .45s ease-out .1s" }}>
            <div style={{ display: "flex", gap: "clamp(8px,1.4vw,16px)", padding: "14px 18px", background: "#04060c", border: "1px solid rgba(255,255,255,.1)", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
              {v.gantry.map((g, gIdx) => (
                <div key={gIdx} style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "8px", background: "#0b0f1a", borderRadius: "10px" }}>
                  <span style={{ width: "clamp(28px,3.6vw,48px)", height: "clamp(28px,3.6vw,48px)", borderRadius: "50%", background: "#161a24" }} />
                  <span style={{ width: "clamp(28px,3.6vw,48px)", height: "clamp(28px,3.6vw,48px)", borderRadius: "50%", background: g.color, boxShadow: g.glow, transition: "background .06s, box-shadow .06s" }} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
        {v.showLoader ? (
          <IntroOverlay variant={v.intro} phase={v.phase} lit={v.lit} onSkip={v.skipIntro} />
        ) : null}
      </div>
    );
  }
}
