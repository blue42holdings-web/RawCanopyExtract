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
    var natureBus = ctx.createGain(); natureBus.gain.value = 0.6;
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

    // PAD MOODS (soft, no piano): three chords voiced wide and low
    var MOODS = [
      [45, 52, 59, 64, 71],   // A minor add9 feel
      [50, 57, 64, 66, 73],   // D lydian
      [41, 48, 57, 60, 67]    // F major 7 (add9)
    ];
    function padVoice(t0, dur, notes, level) {
      var bus = ctx.createGain(); bus.gain.value = 0;
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.5;
      lp.frequency.setValueAtTime(500, t0); lp.frequency.linearRampToValueAtTime(1400, t0 + dur * 0.5); lp.frequency.linearRampToValueAtTime(600, t0 + dur);
      lp.connect(bus); bus.connect(padBus);
      var att = Math.min(12, dur * 0.3), rel = Math.min(14, dur * 0.35);
      bus.gain.setValueAtTime(0, t0); bus.gain.linearRampToValueAtTime(level, t0 + att);
      bus.gain.setValueAtTime(level, t0 + dur - rel); bus.gain.linearRampToValueAtTime(0, t0 + dur);
      notes.forEach(function (n, i) {
        [-7, 6].forEach(function (cents) {
          var o = ctx.createOscillator(); o.type = i < 2 ? 'sawtooth' : 'triangle';
          o.frequency.value = mtof(n); o.detune.value = cents + rnd(-2, 2);
          var g = ctx.createGain(); g.gain.value = (i < 2 ? 0.05 : 0.09) / (1 + i * 0.15);
          o.connect(g); g.connect(lp); o.start(t0); o.stop(t0 + dur + 0.2);
        });
      });
    }

    // SERIOUS: deep drones and layered low tones
    function drones(t0, dur) {
      var bus = ctx.createGain(); bus.gain.value = 0; bus.connect(droneBus);
      var att = 7, rel = 9;
      bus.gain.setValueAtTime(0, t0); bus.gain.linearRampToValueAtTime(1, t0 + att);
      bus.gain.setValueAtTime(1, t0 + dur - rel); bus.gain.linearRampToValueAtTime(0, t0 + dur);
      function tone(type, freq, gain, cutoff) {
        var o = ctx.createOscillator(); o.type = type; o.frequency.value = freq;
        var g = ctx.createGain(); g.gain.value = gain;
        var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = cutoff; f.Q.value = 1.4;
        f.frequency.setValueAtTime(cutoff * 0.6, t0); f.frequency.linearRampToValueAtTime(cutoff * 1.4, t0 + dur * 0.55); f.frequency.linearRampToValueAtTime(cutoff * 0.7, t0 + dur);
        o.connect(f); f.connect(g); g.connect(bus); o.start(t0); o.stop(t0 + dur + 0.2); return o;
      }
      var base = [36.71, 43.65][Math.floor(Math.random() * 2)]; // D1 or F1
      tone('sine', base, 0.55, 200); tone('sine', base * 1.5, 0.25, 200);
      tone('sawtooth', base * 2, 0.12, 260); tone('sawtooth', base * 2 * 1.004, 0.12, 260); // slow beating
      tone('sawtooth', base * 4, 0.07, 520); tone('sawtooth', base * 6 * 1.003, 0.05, 520);
      tone('sawtooth', base * 4.76, 0.045, 520); // minor third color
      // faint dissonant shimmer high above
      tone('sine', 587.3, 0.012, 3000); tone('sine', 622.3, 0.01, 3000);
    }

    // ---------- timeline ----------
    var tl = { t: T0 + 2, n: 0, started: false };
    function levelNature(t, v, rampSec) { natureBus.gain.setTargetAtTime(v, t, rampSec / 3); }
    function scheduleSegment() {
      var t = tl.t, serious = tl.n > 1 && Math.random() < 0.17;
      if (serious) {
        var dur = rnd(26, 34);
        padBus.gain.setTargetAtTime(0, t, 3);
        droneBus.gain.setTargetAtTime(1, t, 1.5);
        drones(t, dur);
        levelNature(t, 0.22, 6); levelNature(t + dur - 9, 0.6, 8);
        tl.t = t + dur - 6;
      } else {
        var d = rnd(50, 66), notes = MOODS[tl.n % 3];
        droneBus.gain.setTargetAtTime(0, t, 3);
        padBus.gain.setTargetAtTime(1, t, 2);
        padVoice(t, d + 12, notes, 0.34);
        // ambient builds a little then settles, nature comes back forward
        levelNature(t, 0.45, 9);
        levelNature(t + d * 0.55, 0.9, 12);
        tl.t = t + d - 4;
        tl.n++;
      }
    }
    var birdT = T0 + 6;
    function scheduleBirds(upTo) {
      while (birdT < upTo) {
        birdPhrase(birdT);
        birdT += rnd(6, 20);
      }
    }
    function scheduleUntil(horizon) {
      while (tl.t < horizon) scheduleSegment();
      scheduleBirds(horizon);
    }
    scheduleUntil(T0 + 40);

    return {
      master: master, duck: duck,
      scheduleUntil: scheduleUntil,
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
      if (!muted) eng.fadeIn(6);
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
  function firstGesture() {
    ['pointerdown', 'touchend', 'keydown', 'click'].forEach(function (n) { document.removeEventListener(n, firstGesture, true); });
    if (muted) { mkBtn(); return; }
    start();
  }
  ['pointerdown', 'touchend', 'keydown', 'click'].forEach(function (n) { document.addEventListener(n, firstGesture, true); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mkBtn); else mkBtn();

  // step aside while the site's own story audio is playing
  document.addEventListener('play', function (e) { if (e.target && e.target.tagName === 'AUDIO' && eng) { playing++; eng.setDuck(0.0, 1.2); } }, true);
  function released(e) { if (e.target && e.target.tagName === 'AUDIO' && eng) { playing = Math.max(0, playing - 1); if (!playing) eng.setDuck(1, 3); } }
  document.addEventListener('pause', released, true);
  document.addEventListener('ended', released, true);
  document.addEventListener('visibilitychange', function () {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else if (!muted) ctx.resume();
  });
})();
