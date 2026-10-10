/* RCX ambient soundscape. Everything is synthesized in the browser (no audio files).
   Starts on the first click or tap. Layers: wind, waves, birds (nature) and soft pads (three moods
   that blend into each other). About 10 percent of the time it turns serious: deep drones and
   layered low tones for a short while, then returns to calm. */
(function () {
  'use strict';
  var KEY = 'rcx-ambient';
  var AC = window.AudioContext || window.webkitAudioContext;
  if (!AC && !window.__RCX_AMBIENT_TEST) return;

  // ---------- helpers ----------
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }

  function makeNoise(ctx, seconds, pink) {
    var len = Math.floor(ctx.sampleRate * seconds);
    var buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch), b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (var i = 0; i < len; i++) {
        var w = Math.random() * 2 - 1;
        if (pink) {
          b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759;
          b2 = 0.96900 * b2 + w * 0.1538520; b3 = 0.86650 * b3 + w * 0.3104856;
          b4 = 0.55000 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.0168980;
          d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
        } else d[i] = w;
      }
      // seamless loop: short crossfade at the seam
      var f = Math.floor(ctx.sampleRate * 0.25);
      for (var j = 0; j < f; j++) { var k = j / f; d[j] = d[j] * k + d[len - f + j] * (1 - k); }
    }
    return buf;
  }

  function makeReverb(ctx, seconds) {
    var len = Math.floor(ctx.sampleRate * seconds);
    var buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++) {
      var d = buf.getChannelData(ch);
      for (var i = 0; i < len; i++) {
        var t = i / len;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.6) * (t < 0.01 ? t / 0.01 : 1);
      }
    }
    return buf;
  }

  // ---------- engine ----------
  function build(ctx, dest) {
    var T0 = ctx.currentTime;
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -24; comp.knee.value = 24; comp.ratio.value = 3; comp.attack.value = 0.05; comp.release.value = 0.5;
    var master = ctx.createGain(); master.gain.value = 0;
    comp.connect(master); master.connect(dest);
    var duck = ctx.createGain(); duck.gain.value = 1; duck.connect(comp); // used when story audio plays

    var rev = ctx.createConvolver(); rev.buffer = makeReverb(ctx, 4.5);
    var revIn = ctx.createGain(); revIn.gain.value = 0.55; revIn.connect(rev);
    var revOut = ctx.createGain(); revOut.gain.value = 0.9; rev.connect(revOut); revOut.connect(duck);

    var padBus = ctx.createGain(); padBus.gain.value = 0;
    var droneBus = ctx.createGain(); droneBus.gain.value = 0;
    var natureBus = ctx.createGain(); natureBus.gain.value = 0;
    padBus.connect(duck); padBus.connect(revIn);
    droneBus.connect(duck); droneBus.connect(revIn);
    natureBus.connect(duck);

    var noise = makeNoise(ctx, 7, true);
    function noiseSrc() { var s = ctx.createBufferSource(); s.buffer = noise; s.loop = true; s.loopStart = 0; s.loopEnd = noise.duration; s.start(0, Math.random() * 3); return s; }
    function lfo(freq, depth, target) {
      var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = freq;
      var g = ctx.createGain(); g.gain.value = depth; o.connect(g); g.connect(target); o.start(); return o;
    }

    // WIND: pink noise, band-passed, with slow drifting gain and pitch
    (function () {
      var s = noiseSrc();
      var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 520; bp.Q.value = 0.55;
      var g = ctx.createGain(); g.gain.value = 0.16;
      s.connect(bp); bp.connect(g); g.connect(natureBus);
      lfo(0.043, 0.09, g.gain); lfo(0.071, 0.05, g.gain);
      lfo(0.05, 260, bp.frequency); lfo(0.083, 140, bp.frequency);
      // a thin high whistle layer
      var s2 = noiseSrc();
      var bp2 = ctx.createBiquadFilter(); bp2.type = 'bandpass'; bp2.frequency.value = 1700; bp2.Q.value = 4;
      var g2 = ctx.createGain(); g2.gain.value = 0.012;
      s2.connect(bp2); bp2.connect(g2); g2.connect(natureBus);
      lfo(0.037, 0.011, g2.gain); lfo(0.029, 380, bp2.frequency);
    })();

    // WAVES: low rumble that swells and recedes, with a hissy foam layer riding on top
    (function () {
      var s = noiseSrc();
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 650; lp.Q.value = 0.4;
      var g = ctx.createGain(); g.gain.value = 0.2;
      s.connect(lp); lp.connect(g); g.connect(natureBus);
      lfo(0.095, 0.17, g.gain); lfo(0.061, 0.08, g.gain);
      lfo(0.095, 300, lp.frequency);
      var s2 = noiseSrc();
      var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2400;
      var g2 = ctx.createGain(); g2.gain.value = 0.02;
      s2.connect(hp); hp.connect(g2); g2.connect(natureBus);
      lfo(0.095, 0.017, g2.gain);
    })();

    // BIRDS: sparse chirps scheduled on the audio clock
    function chirp(t, base) {
      var o = ctx.createOscillator(); o.type = 'sine';
      var g = ctx.createGain(); g.gain.value = 0;
      var pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      var dur = rnd(0.05, 0.12), f0 = base * rnd(0.85, 1.15), up = Math.random() < 0.6;
      o.frequency.setValueAtTime(f0, t);
      o.frequency.exponentialRampToValueAtTime(up ? f0 * rnd(1.25, 1.6) : f0 * rnd(0.6, 0.8), t + dur);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(rnd(0.5, 0.9), t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g);
      if (pan) { pan.pan.value = pan._p; g.connect(pan); pan.connect(natureBus); pan.connect(revIn); }
      else { g.connect(natureBus); g.connect(revIn); }
      o.start(t); o.stop(t + dur + 0.05);
    }
    function birdPhrase(t) {
      var base = rnd(2400, 4200), n = Math.floor(rnd(2, 6)), gap = rnd(0.09, 0.2), tt = t;
      for (var i = 0; i < n; i++) {
        chirp(tt, base * (1 + (i % 2) * 0.12));
        tt += gap + rnd(0, 0.06);
      }
    }
    // pan per chirp: set a default pan value holder
    var _origCreatePanner = ctx.createStereoPanner ? ctx.createStereoPanner.bind(ctx) : null;
    if (_origCreatePanner) ctx.createStereoPanner = function () { var p = _origCreatePanner(); p._p = rnd(-0.8, 0.8); return p; };

    // PAD: a stream of overlapping notes. No single note is held longer than 10 seconds,
    // so the harmony is always moving and each tone melts into the next.
    var SCALES = [
      [57, 60, 62, 64, 67, 69, 71, 72, 74, 76, 79, 81],        // A minor with 9ths
      [57, 59, 62, 64, 66, 69, 71, 74, 76, 78, 81, 83],        // D lydian color
      [53, 57, 60, 62, 64, 65, 69, 72, 74, 76, 77, 81],        // F major 9 color
      [55, 59, 62, 64, 67, 69, 71, 74, 76, 79, 81, 83],        // G add9
      [57, 60, 64, 65, 67, 69, 72, 74, 76, 79, 81, 84]         // A minor, brighter
    ];
    padBus.gain.value = 1;
    var lastMidi = 0;
    function padNote(t0, midi, dur, level) {
      var f = mtof(midi);
      var bus = ctx.createGain(); bus.gain.value = 0;
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.4;
      lp.frequency.setValueAtTime(Math.min(3200, f * 2.2), t0);
      lp.frequency.linearRampToValueAtTime(Math.min(4200, f * 4.5), t0 + dur * 0.4);
      lp.frequency.linearRampToValueAtTime(Math.min(2400, f * 2), t0 + dur);
      var pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      lp.connect(bus);
      if (pan) { pan.pan.value = rnd(-0.6, 0.6); bus.connect(pan); pan.connect(padBus); } else bus.connect(padBus);
      var att = dur * 0.42;
      bus.gain.setValueAtTime(0, t0); bus.gain.linearRampToValueAtTime(level, t0 + att); bus.gain.linearRampToValueAtTime(0, t0 + dur);
      [[ 'sine', -5, 1 ], [ 'triangle', 6, 0.5 ]].forEach(function (v) {
        var o = ctx.createOscillator(); o.type = v[0]; o.frequency.value = f; o.detune.value = v[1] + rnd(-2, 2);
        var g = ctx.createGain(); g.gain.value = v[2];
        o.connect(g); g.connect(lp); o.start(t0); o.stop(t0 + dur + 0.3);
      });
    }
    function pickNote(t, reg) {
      var sc = SCALES[Math.floor((t - T0) / 36) % SCALES.length];
      var m = lastMidi;
      for (var k = 0; k < 6 && (m === lastMidi || Math.abs(m - lastMidi) < 2); k++) {
        var idx = Math.round(Math.max(0, Math.min(1, reg + rnd(-0.25, 0.25))) * (sc.length - 1));
        m = sc[idx];
      }
      lastMidi = m; return m;
    }
    function padStream(t0, dur, step, reg0, reg1, lv0, lv1) {
      var t = t0;
      while (t < t0 + dur) {
        var p = (t - t0) / dur;
        padNote(t, pickNote(t, reg0 + (reg1 - reg0) * p), rnd(8, 10), 0.13 * (lv0 + (lv1 - lv0) * p));
        t += rnd(step[0], step[1]);
      }
    }

    // DARK: low overlapping drones (also never held past 10 seconds) with a haunting wind
    var howlBus = ctx.createGain(); howlBus.gain.value = 0; howlBus.connect(duck); howlBus.connect(revIn);
    (function () {
      var s = noiseSrc(), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 9; bp.frequency.value = 620;
      var g = ctx.createGain(); g.gain.value = 0.5;
      s.connect(bp); bp.connect(g); g.connect(howlBus);
      lfo(0.07, 260, bp.frequency); lfo(0.11, 140, bp.frequency);
      var s2 = noiseSrc(), bp2 = ctx.createBiquadFilter(); bp2.type = 'bandpass'; bp2.Q.value = 14; bp2.frequency.value = 1100;
      var g2 = ctx.createGain(); g2.gain.value = 0.22;
      s2.connect(bp2); bp2.connect(g2); g2.connect(howlBus);
      lfo(0.05, 380, bp2.frequency); lfo(0.13, 200, bp2.frequency);
    })();
    function droneNote(t0, base, mult, type, level, cutoff) {
      var dur = rnd(8.5, 10);
      var o = ctx.createOscillator(); o.type = type; o.frequency.value = base * mult; o.detune.value = rnd(-4, 4);
      var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = 1.2;
      f.frequency.setValueAtTime(cutoff * 0.6, t0); f.frequency.linearRampToValueAtTime(cutoff * 1.3, t0 + dur * 0.45); f.frequency.linearRampToValueAtTime(cutoff * 0.7, t0 + dur);
      var g = ctx.createGain(); g.gain.value = 0;
      g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(level, t0 + dur * 0.42); g.gain.linearRampToValueAtTime(0, t0 + dur);
      o.connect(f); f.connect(g); g.connect(droneBus); o.start(t0); o.stop(t0 + dur + 0.3);
    }
    function darkAct(t0, dur) {
      var base = [36.71, 43.65, 32.70][Math.floor(Math.random() * 3)];
      droneBus.gain.setTargetAtTime(0.2, t0, 2);
      droneBus.gain.setTargetAtTime(0, t0 + dur - 2, 3);
      var t = t0;
      while (t < t0 + dur) {
        droneNote(t, base, 1, 'sine', 0.55, 200);
        droneNote(t + 0.5, base, 1.5, 'sine', 0.2, 200);
        droneNote(t + 1, base, 2, 'sawtooth', 0.08, 260);
        droneNote(t + 1.5, base, [4, 4.76, 6][Math.floor(Math.random() * 3)], 'sawtooth', 0.045, 520);
        if (Math.random() < 0.6) droneNote(t + 2, 587.3 * [1, 0.945][Math.floor(Math.random() * 2)], 1, 'sine', 0.012, 3000);
        t += rnd(3.5, 4.5);
      }
      // haunting wind rises, howls, and drops back
      howlBus.gain.setValueAtTime(0, t0); howlBus.gain.linearRampToValueAtTime(0.045, t0 + 7); howlBus.gain.setValueAtTime(0.045, t0 + dur - 8); howlBus.gain.linearRampToValueAtTime(0, t0 + dur + 4);
    }

    // ---------- timeline ----------
    // build (pads climb to higher notes) > break (softer, nature fades in) > build (nature fades out)
    // > sometimes a dark passage (about 10 percent of the time) > break ...
    var natureStart = T0 + 60;
    function natureTo(t, v, tc) { natureBus.gain.setTargetAtTime(v, Math.max(t, natureStart), tc); }
    var acts = { t: T0 + 0.5, n: 0, next: 'build', buildCount: 0 };
    function scheduleAct() {
      var t = acts.t, kind = acts.next, dur;
      if (kind === 'build') {
        dur = acts.n === 0 ? 50 : rnd(40, 52);
        padStream(t, dur, [2.4, 3.6], acts.n === 0 ? 0.1 : 0.2, 0.8, acts.n === 0 ? 0.3 : 0.32, 0.6);
        if (acts.n > 0) natureTo(t, 0, 4);
        acts.buildCount++;
        acts.next = (acts.buildCount > 1 && Math.random() < 0.2) ? 'dark' : 'break';
      } else if (kind === 'break') {
        dur = rnd(55, 70);
        padStream(t, dur, [3.8, 5.4], 0.35, 0.12, 0.42, 0.32);
        natureTo(t + 2, 0.24, 3.5); // ten seconds or so to fade up, then it stays soft
        acts.next = Math.random() < 0.55 ? 'build' : 'break';
      } else {
        dur = rnd(26, 32);
        natureTo(t, 0.03, 3);
        darkAct(t, dur);
        acts.next = 'break';
      }
      acts.t = t + dur - (kind === 'dark' ? 2 : 5);
      acts.n++;
    }
    var birdT = T0 + 80;
    function scheduleBirds(upTo) {
      while (birdT < upTo) {
        birdPhrase(birdT);
        birdT += rnd(15, 45);
      }
    }
    function scheduleUntil(horizon) {
      while (acts.t < horizon) scheduleAct();
      // birds removed by request
    }
    scheduleUntil(T0 + 40);

    return {
      master: master, duck: duck,
      scheduleUntil: scheduleUntil,
      slowIn: function (sec) { var n = 256, c = new Float32Array(n); for (var i = 0; i < n; i++) { var x = i / (n - 1); c[i] = 0.6 * x * x * x; } master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(0, ctx.currentTime); master.gain.setValueCurveAtTime(c, ctx.currentTime, sec); },
      fadeIn: function (sec) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(master.gain.value, ctx.currentTime); master.gain.linearRampToValueAtTime(0.6, ctx.currentTime + sec); },
      fadeOut: function (sec) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(master.gain.value, ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + sec); },
      setDuck: function (v, sec) { duck.gain.cancelScheduledValues(ctx.currentTime); duck.gain.setValueAtTime(duck.gain.value, ctx.currentTime); duck.gain.linearRampToValueAtTime(v, ctx.currentTime + sec); }
    };
  }

  window.__rcxAmbientBuild = build; // exposed so the sound can be rendered offline for checking

  // ---------- page wiring ----------
  if (window.__RCX_AMBIENT_TEST) return;
  var ctx = null, eng = null, timer = null, muted = false, started = false, playing = 0, btn = null;
  try { muted = localStorage.getItem(KEY) === 'off'; } catch (e) {}

  function icon(on) {
    return on
      ? '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#D4A24A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9a4 4 0 0 1 0 6"/><path d="M18.5 6.5a8 8 0 0 1 0 11"/></svg>'
      : '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#D4A24A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
  }
  function mkBtn() {
    var ex = document.querySelectorAll('[data-ambient-btn]');
    for (var i = 1; i < ex.length; i++) ex[i].parentNode.removeChild(ex[i]);
    if (ex.length) { btn = ex[0]; return; }
    if (!document.body) return;
    btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('data-ambient-btn', '');
    btn.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:2147483000;width:44px;height:44px;border-radius:50%;border:2px solid #D4A24A;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent';
    btn.addEventListener('click', function (ev) { ev.stopPropagation(); toggle(); }, true);
    document.body.appendChild(btn); refresh();
  }
  setInterval(function () { if (btn && !document.body.contains(btn)) { btn = null; mkBtn(); } }, 2000);
  function refresh() { if (!btn) return; var on = started && !muted; btn.innerHTML = icon(on).replace('<svg ', '<svg style="pointer-events:none" '); btn.setAttribute('aria-label', on ? 'Turn ambient sound off' : 'Turn ambient sound on'); }

  function start() {
    if (started || !AC) return;
    started = true;
    try {
      ctx = new AC();
      eng = build(ctx, ctx.destination);
      timer = setInterval(function () { if (ctx.state === 'running') eng.scheduleUntil(ctx.currentTime + 45); }, 8000);
      if (ctx.state === 'suspended') ctx.resume();
      if (!muted) eng.slowIn(30);
    } catch (e) { started = false; }
    mkBtn(); refresh();
  }
  function toggle() {
    if (!started) { muted = false; try { localStorage.removeItem(KEY); } catch (e) {} start(); return; }
    muted = !muted;
    try { if (muted) localStorage.setItem(KEY, 'off'); else localStorage.removeItem(KEY); } catch (e) {}
    if (muted) eng.fadeOut(1.5); else { if (ctx.state === 'suspended') ctx.resume(); eng.fadeIn(2.5); }
    refresh();
  }
  var kick = null;
  function unlockIOS() {
    // iOS routes Web Audio through the ringer switch unless a media element is playing
    try {
      if (kick) { if (kick.paused) kick.play().catch(function () {}); return; }
      var n = 4000, b = new ArrayBuffer(44 + n * 2), v = new DataView(b);
      function w(o, t) { for (var i = 0; i < t.length; i++) v.setUint8(o + i, t.charCodeAt(i)); }
      w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
      v.setUint32(24, 8000, true); v.setUint32(28, 16000, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
      var blob = new Blob([b], { type: 'audio/wav' });
      kick = document.createElement('audio');
      kick.setAttribute('data-ambient-kick', ''); kick.loop = true; kick.setAttribute('playsinline', ''); kick.src = URL.createObjectURL(blob);
      kick.play().catch(function () {});
    } catch (e) {}
  }
  function firstGesture() {
    if (muted) { mkBtn(); return; }
    unlockIOS();
    start();
    if (ctx && ctx.state !== 'running') { try { ctx.resume(); } catch (e) {} }
    if (ctx && ctx.state === 'running') ['pointerdown', 'touchend', 'keydown', 'click'].forEach(function (n) { document.removeEventListener(n, firstGesture, true); });
  }
  ['pointerdown', 'touchstart', 'touchend', 'keydown', 'click'].forEach(function (n) { document.addEventListener(n, firstGesture, true); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mkBtn); else mkBtn();

  // step aside while the site's own story audio is playing
  document.addEventListener('play', function (e) { if (e.target && e.target.tagName === 'AUDIO' && !e.target.hasAttribute('data-ambient-kick') && eng) { playing++; eng.setDuck(0.0, 1.2); } }, true);
  function released(e) { if (e.target && e.target.tagName === 'AUDIO' && !e.target.hasAttribute('data-ambient-kick') && eng) { playing = Math.max(0, playing - 1); if (!playing) eng.setDuck(1, 3); } }
  document.addEventListener('pause', released, true);
  document.addEventListener('ended', released, true);
  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (!muted) ctx.resume();
  });
})();
