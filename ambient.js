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
    comp.threshold.value = -34; comp.knee.value = 24; comp.ratio.value = 8; comp.attack.value = 0.05; comp.release.value = 0.5;
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

    // (Oct 11: the synthetic wind and waves are gone. Real recorded nature now lives in the FIELD layers below.)

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
    // a different arrangement every time the music starts: shuffled harmony order,
    // a new key, its own pace and its own color
    for (var si = SCALES.length - 1; si > 0; si--) { var sj = Math.floor(Math.random() * (si + 1)), st = SCALES[si]; SCALES[si] = SCALES[sj]; SCALES[sj] = st; }
    var ARR = { trans: [-5, -3, -2, 0, 2][Math.floor(Math.random() * 5)], pace: rnd(0.8, 1.35), bright: rnd(0.7, 1.15), chord: rnd(30, 48),
      // Oct 11: keyboard and space age synth voices only. No pure sine or triangle tones up top (they read as
      // a flute or a plastic toy). Detuned sawtooth and square waves through a warm low pass, like an analog pad.
      voice: [[['sawtooth', -8, 0.34], ['sawtooth', 8, 0.34], ['square', -1200, 0.12]],
              [['sawtooth', -11, 0.32], ['sawtooth', 6, 0.32], ['sawtooth', 1195, 0.07]],
              [['sawtooth', -6, 0.3], ['square', 5, 0.18], ['sawtooth', -1205, 0.16]]][Math.floor(Math.random() * 3)] };
    var DEEP = 0; // set per section: about half the sections drop an octave into a lower, darker tone
    var DARK_SCALES = [
      [45, 48, 50, 52, 53, 55, 57, 60, 62, 64],   // A aeolian, low
      [43, 46, 48, 50, 51, 55, 58, 60, 62, 63],   // G minor with flat 6
      [40, 43, 45, 47, 48, 52, 55, 57, 59, 60],   // E minor, low
      [41, 44, 46, 48, 49, 53, 56, 58, 60, 61]    // F phrygian color
    ];
    // half the time the whole piece starts in the low, serious mood; either way the two moods trade places along the way
    var SERIOUS = Math.random() < 0.5 ? 1 : 0;
    padBus.gain.value = 1;
    var lastMidi = 0;
    function padNote(t0, midi, dur, level) {
      var mm = midi + (DEEP ? 0 : ARR.trans); while (mm > 74) mm -= 12;   // keep the pads out of the thin, whistly top register
      var f = mtof(mm), br = ARR.bright * (DEEP ? 0.42 : 1);
      var bus = ctx.createGain(); bus.gain.value = 0;
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.9;   // a little analog filter resonance as it sweeps
      lp.frequency.setValueAtTime(Math.min(1400, f * 1.6 * br + 180), t0);
      lp.frequency.linearRampToValueAtTime(Math.min(2600, f * 3.2 * br + 300), t0 + dur * 0.45);
      lp.frequency.linearRampToValueAtTime(Math.min(1200, f * 1.4 * br + 160), t0 + dur);
      var pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      lp.connect(bus);
      if (pan) { pan.pan.value = rnd(-0.6, 0.6); bus.connect(pan); pan.connect(padBus); } else bus.connect(padBus);
      var att = dur * 0.42;
      bus.gain.setValueAtTime(0, t0); bus.gain.linearRampToValueAtTime(level, t0 + att); bus.gain.linearRampToValueAtTime(0, t0 + dur);
      ARR.voice.forEach(function (v) {
        var o = ctx.createOscillator(); o.type = v[0]; o.frequency.value = f; o.detune.value = v[1] + rnd(-2, 2);
        var g = ctx.createGain(); g.gain.value = v[2] * 0.45;
        o.connect(g); g.connect(lp); o.start(t0); o.stop(t0 + dur + 0.3);
      });
    }
    function pickNote(t, reg) {
      var sc = DEEP ? DARK_SCALES[Math.floor((t - T0) / (ARR.chord * 1.4)) % DARK_SCALES.length] : SCALES[Math.floor((t - T0) / ARR.chord) % SCALES.length];
      var m = lastMidi;
      for (var k = 0; k < 6 && (m === lastMidi || Math.abs(m - lastMidi) < 2); k++) {
        var idx = Math.round(Math.max(0, Math.min(1, reg + rnd(-0.25, 0.25))) * (sc.length - 1) * (DEEP ? 0.55 : 1));
        m = sc[idx];
      }
      lastMidi = m; return m;
    }
    function padStream(t0, dur, step, reg0, reg1, lv0, lv1) {
      var t = t0;
      while (t < t0 + dur) {
        var p = (t - t0) / dur;
        padNote(t, pickNote(t, reg0 + (reg1 - reg0) * p), rnd(8, 10), 0.13 * (lv0 + (lv1 - lv0) * p));
        t += rnd(step[0], step[1]) * ARR.pace;
      }
    }

    // DARK: low overlapping drones (also never held past 10 seconds) with a haunting wind
    var howlBus = ctx.createGain(); howlBus.gain.value = 0;   // Oct 11: synthetic howl muted (its whistle read as a flute); the real howling wind recording replaces it
    (function () {
      var s = noiseSrc(), bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2.2; bp.frequency.value = 380;   // breathy, not a whistle
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
        t += rnd(3.5, 4.5);
      }
      // haunting wind rises, howls, and drops back
      howlBus.gain.setValueAtTime(0, t0); howlBus.gain.linearRampToValueAtTime(0.045, t0 + 7); howlBus.gain.setValueAtTime(0.045, t0 + dur - 8); howlBus.gain.linearRampToValueAtTime(0, t0 + dur + 4);
    }

    // ---------- night nature (Oct 11): no birds. Crickets and frogs, very low in the mix ----------
    function cricket(t, len) {
      var f = rnd(3900, 4700), pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      var out = ctx.createGain(); out.gain.value = rnd(0.003, 0.0052);
      if (pan) { pan.pan.value = rnd(-0.9, 0.9); out.connect(pan); pan.connect(natureBus); } else out.connect(natureBus);
      var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
      var g = ctx.createGain(); g.gain.value = 0; o.connect(g); g.connect(out);
      var tt = t, per = rnd(0.7, 1.1);
      while (tt < t + len) { for (var k = 0; k < 3; k++) { var a0 = tt + k * 0.045; g.gain.setValueAtTime(0, a0); g.gain.linearRampToValueAtTime(1, a0 + 0.006); g.gain.linearRampToValueAtTime(0, a0 + 0.03); } tt += per; }
      o.start(t); o.stop(t + len + 0.2);
    }
    function frog(t) {
      var pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = rnd(420, 700); bp.Q.value = 3;
      var out = ctx.createGain(); out.gain.value = rnd(0.012, 0.02);
      bp.connect(out); if (pan) { pan.pan.value = rnd(-0.8, 0.8); out.connect(pan); pan.connect(natureBus); pan.connect(revIn); } else out.connect(natureBus);
      var n = Math.random() < 0.5 ? 2 : 3, base = rnd(150, 230);
      for (var k = 0; k < n; k++) {
        var a0 = t + k * rnd(0.16, 0.22), o = ctx.createOscillator(); o.type = 'sawtooth';
        o.frequency.setValueAtTime(base, a0); o.frequency.linearRampToValueAtTime(base * 0.86, a0 + 0.12);
        var g = ctx.createGain(); g.gain.setValueAtTime(0, a0); g.gain.linearRampToValueAtTime(1, a0 + 0.015); g.gain.exponentialRampToValueAtTime(0.001, a0 + 0.13);
        o.connect(g); g.connect(bp); o.start(a0); o.stop(a0 + 0.2);
      }
    }
    function nightNature(t0, dur) {
      var t = t0 + rnd(2, 6);
      while (t < t0 + dur) { cricket(t, rnd(5, 11)); t += rnd(6, 14); }
    }


    // ---------- FIELD (Oct 11): real recorded nature, layers rising and falling ----------
    // Rain, rain on leaves, wind in the trees, mountain wind, howling wind, river, waterfall, jungle,
    // birds, ocean, frogs, crows, distant thunder, cave droplets and the odd owl. Each act picks its own
    // handful, brings them in one at a time as the music thins, then lifts them out one at a time.
    var FIELD_DIR = 'assets/audio/nature/', bufs = {};
    var fieldBus = ctx.createGain(); fieldBus.gain.value = 0.57;   // Oct 11: halfway between the first level (0.85) and the quiet one (0.38) fieldBus.connect(duck);
    function loadField(n) {
      if (!bufs[n]) bufs[n] = fetch(FIELD_DIR + n + '.mp3?v=2').then(function (r) { return r.ok ? r.arrayBuffer() : null; })
        .then(function (ab) { return ab ? new Promise(function (res) { ctx.decodeAudioData(ab, res, function () { res(null); }); }) : null; })
        .catch(function () { return null; });
      return bufs[n];
    }
    function layer(name, t0, dur, level, dark) {
      if (window.__RCX_AMBIENT_TEST) console.log('field ' + name + ' at ' + Math.round(t0) + 's for ' + Math.round(dur) + 's');
      loadField(name).then(function (buf) {
        if (!buf) return;
        var now = ctx.currentTime, start = Math.max(t0, now + 0.1), end = t0 + dur;
        if (end - start < 8) return;
        var src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
        if (dark) src.playbackRate.value = rnd(0.86, 0.95);            // a touch slower and deeper: moodier, a little eerie
        var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = dark ? rnd(1300, 2200) : rnd(7000, 11000); lp.Q.value = 0.3;
        var g = ctx.createGain(); g.gain.value = 0;
        var pan = ctx.createStereoPanner ? _origCreatePanner ? _origCreatePanner() : ctx.createStereoPanner() : null;
        src.connect(lp); lp.connect(g);
        var out = g; if (pan) { pan.pan.value = rnd(-0.35, 0.35); g.connect(pan); out = pan; }
        out.connect(fieldBus);
        if (dark) { var send = ctx.createGain(); send.gain.value = 0.5; out.connect(send); send.connect(revIn); }
        var fin = rnd(9, 16), fout = rnd(10, 16);
        g.gain.setValueAtTime(0, start);
        g.gain.linearRampToValueAtTime(level, start + fin);
        // rising and falling while it plays
        var tt = start + fin + rnd(6, 12), lv = level;
        while (tt < end - fout - 6) { lv = level * rnd(0.45, 1); g.gain.linearRampToValueAtTime(lv, tt); tt += rnd(9, 18); }
        g.gain.linearRampToValueAtTime(lv, Math.max(start + fin, end - fout)); g.gain.linearRampToValueAtTime(0, end);
        src.start(start, rnd(0, buf.duration - 1)); src.stop(end + 0.5);
      });
    }
    function oneShot(name, t, level) {
      loadField(name).then(function (buf) {
        if (!buf || ctx.currentTime > t) return;
        var src = ctx.createBufferSource(); src.buffer = buf; src.playbackRate.value = rnd(0.9, 1);
        var g = ctx.createGain(); g.gain.value = level;
        var pan = _origCreatePanner ? _origCreatePanner() : null;
        src.connect(g); var out = g; if (pan) { pan.pan.value = rnd(-0.7, 0.7); g.connect(pan); out = pan; }
        out.connect(fieldBus); var send = ctx.createGain(); send.gain.value = 0.8; out.connect(send); send.connect(revIn);
        src.start(t);
      });
    }
    // Oct 11, second pass: spaced way out. Most of the time there is NO field sound at all. Roughly
    // every three minutes ONE sound comes in during a breakdown (now and then two), plays a while and
    // goes. Ocean waves and wind in the trees come up most; rivers, streams, waterfalls and rain are rare.
    // Pacific Northwest first (Oct 11): Oregon and Northern California beaches, redwood and Mount Shasta
    // wind in the trees. Rain is light rain or mist, never hard. No rivers or waterfalls (taken out Oct 11).
    // The jungle almost never.
    var FIELD_WEIGHT = {
      bright: { 'ocean': 7, 'forest-wind': 7, 'mountain-wind': 3, 'rain': 2, 'rain-leaves': 1.2, 'birds': 1.5, 'jungle': 0.15 },
      dark: { 'ocean': 6, 'forest-wind': 5, 'howling-wind': 3, 'mountain-wind': 3, 'rain': 2, 'rain-leaves': 0.8, 'crows': 0.5, 'droplets': 0.5, 'frogs': 0.4 }
    };
    var recentField = [], nextFieldAt = 0;
    // never more than three nature sounds at once (crickets and the owl count too)
    var natureSlots = [];
    function busy(t0, t1) { var n = 0; natureSlots.forEach(function (x) { if (x[0] < t1 && x[1] > t0) n++; }); return n; }
    function claim(t0, t1) { natureSlots.push([t0, t1]); natureSlots = natureSlots.filter(function (x) { return x[1] > t0 - 600; }); }
    function pickOne(dark) {
      var w = FIELD_WEIGHT[dark ? 'dark' : 'bright'], tot = 0, k;
      for (k in w) if (recentField.indexOf(k) < 0) tot += w[k];
      var r = Math.random() * tot;
      for (k in w) { if (recentField.indexOf(k) >= 0) continue; r -= w[k]; if (r <= 0) break; }
      recentField.push(k); if (recentField.length > 3) recentField.shift();
      return k;
    }
    function fieldAct(t, build, b1, b2, b3, end, dark, first) {
      // Oct 11 (later): EVERY breakdown gets nature, never silence. Usually two sounds, never more than three
      // (crickets and the owl count). The first comes in as the music starts thinning out, the second joins
      // as it gets sparse, and both carry through to the next build.
      var t0 = Math.max(b1 + rnd(0, 6), natureStart), t1 = end + rnd(8, 14);
      if (t1 - t0 < 25) return;
      var main = pickOne(dark);
      if (busy(t0, t1) < 3) { loadField(main); claim(t0, t1); layer(main, t0, t1 - t0, /rain/.test(main) ? rnd(0.46, 0.56) : (dark ? 0.5 : 0.48), dark); }
      var s0 = b2 + rnd(0, 8), s1 = end + rnd(2, 8);
      if (Math.random() < 0.8 && s1 - s0 > 20 && busy(s0, s1) < 2) {             // usually a second one; leave room so it stays at two
        var second = pickOne(dark); loadField(second); claim(s0, s1); layer(second, s0, s1 - s0, /rain/.test(second) ? 0.46 : 0.34, dark);   // rain a notch up so it is noticed, still soft
      }
      var ot = b2 + rnd(6, Math.max(8, end - b2 - 10));
      if (dark && Math.random() < 0.25 && busy(ot, ot + 14) < 3) { claim(ot, ot + 14); oneShot('owl', ot, 0.28); }
    }


    // ---------- DRUMS AND BASS (Oct 11) ----------
    // Six grooves, all synthesized: five drum and bass (fast, 168 to 174: liquid, amen break,
    // roller, neuro with a reese bass, jungle) and the slow Miami bass 808 (74). Never a house or
    // four on the floor beat.
    // Nothing before the three minute mark. After that a random groove comes in with a build, fades in
    // and out with the same rhythm as the other changes, and never plays during a breakdown.
    var drumBus = ctx.createGain(); drumBus.gain.value = 0; drumBus.connect(duck);
    var dly = ctx.createDelay(1.5); dly.delayTime.value = 0.45; var fb = ctx.createGain(); fb.gain.value = 0.38;
    var dlyLp = ctx.createBiquadFilter(); dlyLp.type = 'lowpass'; dlyLp.frequency.value = 2200;
    dly.connect(dlyLp); dlyLp.connect(fb); fb.connect(dly); dlyLp.connect(drumBus);
    var shaper = ctx.createWaveShaper(); (function () { var n = 1024, c = new Float32Array(n); for (var i = 0; i < n; i++) { var x = i / (n - 1) * 2 - 1; c[i] = Math.tanh(x * 1.6) / Math.tanh(1.6); } shaper.curve = c; })();
    shaper.connect(drumBus);
    var hiss = makeNoise(ctx, 2, false);
    function noiseHit(t, type, freq, q, dur, lv, toDelay) {
      var s = ctx.createBufferSource(); s.buffer = hiss; var f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
      var g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(lv, t + 0.003); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      s.connect(f); f.connect(g); g.connect(drumBus); if (toDelay) { var d = ctx.createGain(); d.gain.value = toDelay; g.connect(d); d.connect(dly); }
      s.start(t, Math.random() * 1.5); s.stop(t + dur + 0.05);
    }
    function kick808(t, f1, decay, lv, slide, echo) {
      var o = ctx.createOscillator(); o.type = 'sine'; var g = ctx.createGain();
      if (echo) { var es = ctx.createGain(); es.gain.value = echo; g.connect(es); es.connect(dly); }   // the boom echoes and lingers
      f1 *= 0.78;   // Oct 11: deeper
      o.frequency.setValueAtTime(f1 * 2.4, t); o.frequency.exponentialRampToValueAtTime(f1, t + 0.09);
      if (slide) o.frequency.exponentialRampToValueAtTime(f1 * 0.72, t + decay * 0.9);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(lv, t + 0.004); g.gain.setTargetAtTime(0, t + 0.06, decay / 3.2);
      o.connect(g); g.connect(shaper); o.start(t); o.stop(t + decay + 0.3);
    }
    function kick909(t, lv) {
      var o = ctx.createOscillator(); o.type = 'sine'; var g = ctx.createGain();
      o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(41, t + 0.06);
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(lv, t + 0.002); g.gain.setTargetAtTime(0, t + 0.05, 0.16);
      o.connect(g); g.connect(shaper); o.start(t); o.stop(t + 0.9);
      noiseHit(t, 'bandpass', 900, 0.7, 0.012, lv * 0.2);                      // the 909 click
    }
    function snare(t, lv, toDelay) { noiseHit(t, 'bandpass', 800, 0.8, 0.28, lv, toDelay);
      var o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(88, t + 0.12);
      var g = ctx.createGain(); g.gain.setValueAtTime(lv * 0.5, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.12); o.connect(g); g.connect(drumBus); o.start(t); o.stop(t + 0.15); }
    function clap(t, lv) {                                                  // like real hands in a room, not a drum machine
      var n = 3 + (Math.random() < 0.5 ? 1 : 0), tt = t;
      for (var i = 0; i < n; i++) { noiseHit(tt, 'bandpass', rnd(700, 1000), 0.9, i < n - 1 ? rnd(0.018, 0.03) : rnd(0.16, 0.22), lv * (i < n - 1 ? rnd(0.6, 1) : 1), 0); tt += rnd(0.007, 0.014); }
      var s = ctx.createBufferSource(); s.buffer = hiss; var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1600;
      var g = ctx.createGain(); g.gain.setValueAtTime(lv * 0.5, tt); g.gain.exponentialRampToValueAtTime(0.0008, tt + 0.35);
      var rs = ctx.createGain(); rs.gain.value = 0.6;
      s.connect(f); f.connect(g); g.connect(drumBus); g.connect(rs); rs.connect(revIn); s.start(tt, Math.random()); s.stop(tt + 0.4);
    }
    function rim(t, lv, toDelay) { noiseHit(t, 'bandpass', 1000, 4, 0.07, lv, toDelay); }
    function hat(t, lv, open) { noiseHit(t, 'bandpass', 4800, 0.8, open ? 0.3 : 0.045, lv * 0.7); }
    function shaker(t, lv) { noiseHit(t, 'bandpass', 3800, 1.4, 0.07, lv * 0.75); }
    function bassNote(t, f, dur, lv, type) {
      var o = ctx.createOscillator(); o.type = type || 'sine'; o.frequency.value = f;
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 170; var g = ctx.createGain();
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(lv, t + 0.02); g.gain.setValueAtTime(lv, t + dur * 0.7); g.gain.linearRampToValueAtTime(0, t + dur);
      o.connect(lp); lp.connect(g); g.connect(shaper);                     // through the warm saturator: deep, but still heard on small speakers o.start(t); o.stop(t + dur + 0.05);
    }
    function reese(t, f, dur, lv) {                                        // dark drum and bass bass: two detuned saws, low passed, moving
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 2; lp.frequency.setValueAtTime(150, t); lp.frequency.linearRampToValueAtTime(340, t + dur * 0.5); lp.frequency.linearRampToValueAtTime(160, t + dur);
      var g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(lv, t + 0.03); g.gain.setValueAtTime(lv, t + dur * 0.8); g.gain.linearRampToValueAtTime(0, t + dur);
      [-9, 9].forEach(function (c) { var o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = c; o.connect(lp); o.start(t); o.stop(t + dur + 0.05); });
      lp.connect(g); g.connect(drumBus);
    }
    // each groove: tempo, and a function that plays one 16 step bar starting at t (r = root in Hz)
    // Five drum and bass grooves (fast, 168 to 174) and the slow Miami 808.
    var GROOVES = {
      dnbLiquid: { bpm: 174, bar: function (t, q, r) { kick909(t, 0.75); kick909(t + q * 10, 0.65); snare(t + q * 4, 0.16, 0.15); snare(t + q * 12, 0.16, 0.15);
        for (var i = 0; i < 16; i++) hat(t + q * i, i % 2 ? 0.012 : 0.022); shaker(t + q * 7, 0.02);
        bassNote(t, r, q * 8, 0.24); bassNote(t + q * 8, r * 1.19, q * 8, 0.22); } },
      dnbAmen: { bpm: 172, bar: function (t, q, r) { kick909(t, 0.75); kick909(t + q * 2, 0.5); kick909(t + q * 10, 0.7); kick909(t + q * 11, 0.45);
        snare(t + q * 4, 0.17); snare(t + q * 7, 0.06); snare(t + q * 9, 0.06); snare(t + q * 12, 0.17); snare(t + q * 15, 0.07);
        for (var i = 0; i < 16; i += 2) hat(t + q * i, 0.022); hat(t + q * 14, 0.02, true); bassNote(t, r, q * 16, 0.22); } },
      dnbRoller: { bpm: 174, bar: function (t, q, r) { kick909(t, 0.75); kick909(t + q * 6, 0.45); kick909(t + q * 10, 0.7); snare(t + q * 4, 0.15); snare(t + q * 12, 0.15);
        for (var i = 0; i < 16; i++) shaker(t + q * i, i % 4 === 2 ? 0.024 : 0.012); hat(t + q * 2, 0.025, true); hat(t + q * 10, 0.025, true);
        bassNote(t, r, q * 3, 0.26); bassNote(t + q * 3, r, q * 3, 0.2); bassNote(t + q * 6, r * 1.5, q * 4, 0.22); bassNote(t + q * 10, r * 1.33, q * 6, 0.24); } },
      dnbNeuro: { bpm: 172, bar: function (t, q, r) { kick909(t, 0.8); kick909(t + q * 10, 0.75); snare(t + q * 4, 0.18, 0.2); snare(t + q * 12, 0.18, 0.2);
        for (var i = 0; i < 16; i += 2) hat(t + q * i, i % 4 ? 0.016 : 0.024); reese(t, r, q * 7, 0.12); reese(t + q * 8, r * 0.94, q * 8, 0.12); } },
      dnbJungle: { bpm: 168, bar: function (t, q, r) { kick909(t, 0.7); kick909(t + q * 10, 0.6); snare(t + q * 4, 0.16); snare(t + q * 12, 0.16);
        [3, 6, 7, 9, 14, 15].forEach(function (k) { rim(t + q * k, 0.05 + Math.random() * 0.04); });
        for (var i = 0; i < 16; i += 2) hat(t + q * i, 0.018); kick808(t, r * 0.9, 1.1, 0.55, true); kick808(t + q * 8, r * 1.1, 0.9, 0.45, true); } },
      miami808: { bpm: 74, bar: function (t, q, r) { kick808(t, r, 2.8, 0.95, true, 0.4); kick808(t + q * 10, r * 1.06, 2.2, 0.8, true, 0.35); clap(t + q * 4, 0.16); clap(t + q * 12, 0.16);   // the 808 boom hangs for a second or two and echoes
        for (var i = 0; i < 16; i += 2) hat(t + q * i, i % 4 ? 0.025 : 0.04); hat(t + q * 15, 0.02); } }
    };
    var DARK_GROOVES = ['dnbNeuro', 'dnbJungle', 'dnbAmen', 'miami808'], BRIGHT_GROOVES = ['dnbLiquid', 'dnbRoller', 'dnbAmen', 'miami808'];   // drum and bass or Miami bass only, never a house beat
    var drumJobs = [], lastGroove = '', nextDrumAt = 0;
    function drumSection(t0, t1, dark, root) {
      if (drumJobs.length || t0 < nextDrumAt) return;                    // only one groove at a time, and long gaps between them
      var pool = (dark ? DARK_GROOVES : BRIGHT_GROOVES).filter(function (g) { return g !== lastGroove; });
      var name = pool[Math.floor(Math.random() * pool.length)];
      if (window.__RCX_AMBIENT_TEST && window.__RCX_GROOVE) name = window.__RCX_GROOVE;   // for test recordings only
      lastGroove = name;
      var G = GROOVES[name], q = 60 / G.bpm / 4, barLen = q * 16;
      var bars = Math.floor((t1 - t0) / barLen); if (bars < 4) return;
      t1 = t0 + bars * barLen;
      drumBus.gain.setTargetAtTime(0.0001, t0 - 0.5, 0.1);
      drumBus.gain.linearRampToValueAtTime(dark ? 0.5 : 0.42, t0 + barLen * 2);        // fades in over two bars
      drumBus.gain.setValueAtTime(dark ? 0.5 : 0.42, t1 - barLen * 2);
      drumBus.gain.linearRampToValueAtTime(0.0001, t1);                                  // and out over two
      if (window.__RCX_AMBIENT_TEST) console.log('drums ' + name + ' at ' + Math.round(t0) + 's to ' + Math.round(t1) + 's');
      drumJobs.push({ t: t0, end: t1, bar: barLen, q: q, G: G, root: root });
      nextDrumAt = t1 + 180 + rnd(0, 60);                                  // at least three minutes of no drums after this one
    }
    // REMIX button (Oct 11): each press on starts the next groove and keeps it going until pressed again
    var REMIX = ['miami808', 'dnbLiquid', 'dnbAmen', 'dnbRoller', 'miami808', 'dnbNeuro', 'dnbJungle'], remixI = Math.floor(Math.random() * REMIX.length);
    function remixOn() {
      var name = REMIX[remixI % REMIX.length]; remixI++;
      var G = GROOVES[name], q = 60 / G.bpm / 4, barLen = q * 16, t0 = ctx.currentTime + 0.15;
      drumJobs = [];
      drumBus.gain.cancelScheduledValues(ctx.currentTime); drumBus.gain.setValueAtTime(0.0001, ctx.currentTime);
      drumBus.gain.linearRampToValueAtTime(0.5, t0 + barLen);                         // fades in over a bar
      drumJobs.push({ t: t0, end: 1e12, bar: barLen, q: q, G: G, root: [36.71, 41.2, 38.89][remixI % 3] * 1.15 });
      drumTick(ctx.currentTime + 1.5);
      return name;
    }
    function remixOff() {
      drumBus.gain.cancelScheduledValues(ctx.currentTime); drumBus.gain.setValueAtTime(drumBus.gain.value, ctx.currentTime);
      drumBus.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      var j = drumJobs[0]; if (j) j.end = ctx.currentTime + 1.3;
    }
    function drumTick(horizon) {
      for (var i = 0; i < drumJobs.length; i++) { var j = drumJobs[i];
        while (j.t < j.end - 0.01 && j.t < horizon) { j.G.bar(j.t, j.q, j.root); j.t += j.bar; } }
      drumJobs = drumJobs.filter(function (j) { return j.t < j.end - 0.01; });
    }

    // ---------- timeline (Oct 11) ----------
    // Two moods, half the time each, trading places: BRIGHT (the warm pads) and DARK (low, serious,
    // ominous: only low drones and low pad notes, nothing high). Every cycle builds, then breaks down
    // slowly, layers coming out one at a time until only the night nature is left, then the next mood builds.
    var natureStart = T0 + 45;
    function natureTo(t, v, tc) { natureBus.gain.setTargetAtTime(v, Math.max(t, natureStart), tc); }
    var MOOD0 = Math.random() < 0.5 ? 1 : 0; // 1 = dark first
    var acts = { t: T0 + 0.5, n: 0 };
    function lowDrones(t0, dur, base, lv) {
      droneBus.gain.setTargetAtTime(lv, t0, 4); droneBus.gain.setTargetAtTime(0, t0 + dur - 4, 4);
      var tb = t0;
      while (tb < t0 + dur) { droneNote(tb, base, 1, 'sine', 0.5, 170); droneNote(tb + 1.2, base, 1.5, 'sine', 0.16, 190); droneNote(tb + 2.2, base, 2, 'sawtooth', 0.05, 220); tb += rnd(3.8, 4.8); }
    }
    function scheduleAct() {
      var t = acts.t, dark = (acts.n % 2 === 0) ? MOOD0 : 1 - MOOD0;
      var base = [36.71, 41.2, 32.7, 38.89][acts.n % 4];
      var build = acts.n === 0 ? 50 : rnd(42, 54), s1 = rnd(18, 24), s2 = rnd(18, 24), s3 = rnd(20, 28);
      // BUILD: all layers in
      natureTo(t, acts.n === 0 ? 0 : 0.02, 4);
      if (dark) {
        lowDrones(t, build + s1 + s2, base, 0.16);
        DEEP = 1; padStream(t, build, [3.6, 5], 0.05, 0.42, 0.34, 0.5); DEEP = 0;
      } else {
        padStream(t, build, [2.4, 3.6], acts.n === 0 ? 0.1 : 0.2, 0.8, acts.n === 0 ? 0.3 : 0.32, 0.6);
      }
      // BREAKDOWN 1: the top layer thins out, nature starts to come up
      var b1 = t + build - 4;
      if (dark) { DEEP = 1; padStream(b1, s1, [5, 6.5], 0.3, 0.1, 0.4, 0.28); DEEP = 0; }
      else padStream(b1, s1, [4, 5.6], 0.4, 0.15, 0.38, 0.26);
      natureTo(b1 + 2, 0.12, 4);
      // BREAKDOWN 2: one sparse low voice (dark keeps only its drones)
      var b2 = b1 + s1;
      if (!dark) padStream(b2, s2, [6.5, 8.5], 0.12, 0.02, 0.24, 0.12);
      natureTo(b2, 0.18, 5);
      // BREAKDOWN 3: minimal. Just the night: low wind, the ocean, crickets and frogs, all soft
      var b3 = b2 + s2;
      natureTo(b3, 0.22, 5);
      fieldAct(t, build, b1, b2, b3, b3 + s3, dark, acts.n === 0);
      // (crickets removed Oct 11)
      // (Oct 11: no automatic drums. Beats only play from the REMIX button.)
      acts.t = b3 + s3 - 4;
      acts.n++;
    }
    function scheduleUntil(horizon) {
      while (acts.t < horizon) scheduleAct();
      drumTick(Math.min(horizon, ctx.currentTime + 3));
    }
    scheduleUntil(T0 + 40);

    return {
      master: master, duck: duck,
      scheduleUntil: scheduleUntil, drumTick: drumTick, remixOn: remixOn, remixOff: remixOff, fieldBus: fieldBus, drumBus: drumBus,
      slowIn: function (sec) { var n = 256, c = new Float32Array(n); for (var i = 0; i < n; i++) { var x = i / (n - 1); c[i] = 0.22 * x * x * x; } master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(0, ctx.currentTime); master.gain.setValueCurveAtTime(c, ctx.currentTime, sec); },
      fadeIn: function (sec) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(master.gain.value, ctx.currentTime); master.gain.linearRampToValueAtTime(0.22, ctx.currentTime + sec); },
      fadeOut: function (sec) { master.gain.cancelScheduledValues(ctx.currentTime); master.gain.setValueAtTime(master.gain.value, ctx.currentTime); master.gain.linearRampToValueAtTime(0, ctx.currentTime + sec); },
      setDuck: function (v, sec) { duck.gain.cancelScheduledValues(ctx.currentTime); duck.gain.setValueAtTime(duck.gain.value, ctx.currentTime); duck.gain.linearRampToValueAtTime(v, ctx.currentTime + sec); }
    };
  }

  window.__rcxAmbientBuild = build; // exposed so the sound can be rendered offline for checking

  // ---------- page wiring ----------
  if (window.__RCX_AMBIENT_TEST) return;
  if (window.__rcxAmbientWired) return; window.__rcxAmbientWired = 1;   // the page can run this file twice: wire the buttons and sound only once
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
    btn.style.cssText = 'position:fixed;left:12px;bottom:6px;z-index:2147483000;width:58px;height:66px;box-sizing:border-box;border-radius:14px;border:2px solid #D4A24A;background:rgba(0,0,0,.78);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:7px 0 7px;box-shadow:0 4px 14px rgba(0,0,0,.55);cursor:pointer;-webkit-tap-highlight-color:transparent';
    btn.addEventListener('click', function (ev) { ev.stopPropagation(); toggle(); }, true);
    document.body.appendChild(btn); refresh();
  }
  setInterval(function () { if (btn && !document.body.contains(btn)) { btn = null; mkBtn(); } }, 2000);
  // REMIX: a little turntable above the Sound Bath box. Tap for a beat, tap again to stop, tap again for the next beat.
  var rbtn = null, remixing = false, lastWake = Date.now();
  function wake() { lastWake = Date.now(); }
  ['pointerdown', 'keydown'].forEach(function (ev) { document.addEventListener(ev, wake, true); });
  addEventListener('popstate', wake); addEventListener('pageshow', wake);
  function remixIcon(on) {
    // only the record spins; the tone arm stays put in the lower right, like a real turntable
    var c = on ? '#E9C079' : '#D4A24A';
    return '<svg viewBox="0 0 28 24" width="26" height="22" fill="none" stroke="' + c + '" stroke-linecap="round" stroke-linejoin="round" style="pointer-events:none;display:block;overflow:visible">' +
      '<g style="transform-box:view-box;transform-origin:11px 12px' + (on ? ';animation:rcxSpin 1.6s linear infinite' : '') + '">' +
        '<circle cx="11" cy="12" r="9" stroke-width="1.6"/>' +
        '<circle cx="11" cy="12" r="6.6" stroke-width=".6" opacity=".55"/><circle cx="11" cy="12" r="4.6" stroke-width=".6" opacity=".55"/>' +
        '<path d="M11 12 L11 3.6" stroke-width="1.1" opacity=".9"/>' +                      // a light streak across the grooves shows the spin
        '<circle cx="11" cy="12" r="2.6" fill="' + c + '" fill-opacity=".35" stroke-width=".8"/>' +
        '<circle cx="12.4" cy="11" r=".7" fill="' + c + '" stroke="none"/>' +                // a dot on the label
      '</g>' +
      '<circle cx="11" cy="12" r=".9" fill="#000" stroke="none"/>' +                          // the spindle
      '<circle cx="24.5" cy="3.4" r="1.6" fill="' + c + '" stroke="none"/>' +
      '<path d="M24.5 3.4 L24.5 13.5 L18.6 18.4" stroke-width="1.8"/><path d="M17.4 17.6 L19.8 19.6" stroke-width="2.4"/></svg>';
  }
  function rRefresh() {
    if (!rbtn) return; var c = remixing ? '#F4D99A' : '#E9C079';
    rbtn.innerHTML = remixIcon(remixing) + '<span style="pointer-events:none;display:block;font-family:\'Bebas Neue\',sans-serif;font-size:12.5px;letter-spacing:.12em;line-height:1.05;text-align:center;padding-left:.14em;color:' + c + '">REMIX</span>';
    rbtn.style.boxShadow = remixing ? '0 0 16px rgba(212,162,74,.55),0 4px 14px rgba(0,0,0,.55)' : '0 4px 14px rgba(0,0,0,.55)';
    rbtn.setAttribute('aria-label', remixing ? 'Remix on. Tap to stop the beat' : 'Remix. Tap to play a beat');
  }
  function mkRemix() {
    if (!document.body) return;
    var ex = document.querySelectorAll('[data-remix-btn]');
    for (var i = 0; i < ex.length; i++) if (ex[i] !== rbtn) ex[i].parentNode.removeChild(ex[i]);
    if (rbtn && document.body.contains(rbtn)) return;
    var stl = document.createElement('style'); stl.textContent = '@keyframes rcxSpin{to{transform:rotate(360deg)}}'; document.head.appendChild(stl);
    rbtn = document.createElement('button'); rbtn.type = 'button'; rbtn.setAttribute('data-remix-btn', '');
    rbtn.style.cssText = 'position:fixed;left:12px;bottom:6px;z-index:2147483000;width:58px;height:66px;box-sizing:border-box;border-radius:14px;border:2px solid #D4A24A;background:rgba(0,0,0,.78);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:7px 0 7px;cursor:pointer;-webkit-tap-highlight-color:transparent';
    rbtn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      if (!started) { muted = false; try { localStorage.removeItem(KEY); } catch (e) {} start(); }
      else if (muted) { toggle(); }
      if (!eng) return;
      if (ctx.state === 'suspended') ctx.resume();
      fresh = false;
      remixing = !remixing;
      if (remixing) { eng.fadeIn(2); eng.remixOn(); } else eng.remixOff();
      rRefresh(); refresh();
    }, true);
    document.body.appendChild(rbtn); rRefresh();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mkRemix); else mkRemix();
  setInterval(mkRemix, 2000);
  // keep the sound button clear of the story player bar: it rides up with the bar and comes back down
  setInterval(function () {
    if (!btn) return;
    var bar = document.querySelector('[data-m="player"]'), lift = 0;
    if (bar) { var r = bar.getBoundingClientRect(); if (r.height > 0 && r.top < innerHeight) lift = Math.max(0, innerHeight - r.top); }
    // Oct 11: at the very top of a page (the first thing people see) the two boxes stay out of the way of the
    // opening words; they fade in as soon as the page moves
    // Sound Bath is always there. At the very top of a page it tucks low into the corner (clear of the opening
    // words) and Remix waits; once the page moves, Sound Bath lifts a little and Remix fades in above it.
    // Oct 11: Sound Bath on top and always there; Remix appears underneath it once the page moves. Both sit up off the corner.
    var top = scrollY < 60, base = top ? 6 : 40;   // at the very top it sits low in the corner, clear of the opening words
    [btn, rbtn].forEach(function (b) { if (b && !/opacity/.test(b.style.transition)) b.style.transition = 'bottom .4s ease, opacity 1.2s ease'; });
    // Oct 11: both boxes show when a page opens and whenever you tap, then fade away after 10 quiet seconds
    var awake = Date.now() - lastWake < 10000;
    var so = awake ? '1' : '0'; if (btn.style.opacity !== so) { btn.style.opacity = so; btn.style.pointerEvents = awake ? 'auto' : 'none'; }
    if (rbtn) { var op = (top || !awake) ? '0' : '1'; if (rbtn.style.opacity !== op) { rbtn.style.opacity = op; rbtn.style.pointerEvents = op === '1' ? 'auto' : 'none'; } }
    // at the very top Sound Bath waits in Remix's spot (clear of the opening words); once the page moves it rises and Remix slides in underneath
    var rw = (base + lift) + 'px', want = (base + lift + (top ? 0 : (rbtn ? rbtn.offsetHeight : 66) + 10)) + 'px';   // raised off the bottom corner (Oct 11)   // Sound Bath at the bottom, Remix above it
    if (btn.style.bottom !== want) { btn.style.bottom = want; }
    if (rbtn && rbtn.style.bottom !== rw) { rbtn.style.bottom = rw; }
  }, 120);
  function refresh() {
    if (!btn) return; var on = started && !muted, c = on ? '#E9C079' : '#8A7A5C';
    // one box: the speaker on top, SOUND above BATH underneath. The whole box turns it on and off.
    btn.innerHTML = icon(on).replace('<svg ', '<svg style="pointer-events:none;display:block" ') +
      '<span style="pointer-events:none;display:block;font-family:\'Bebas Neue\',sans-serif;font-size:12.5px;letter-spacing:.12em;line-height:1.05;text-align:center;padding-left:.14em;color:' + c + '">SOUND<br>BATH</span>';
    btn.setAttribute('aria-label', on ? 'Sound bath on. Tap to turn it off' : 'Sound bath off. Tap to turn it on');
  }

  var startedAt = 0, fresh = false;
  function start() {
    if (started || !AC) return;
    started = true; startedAt = Date.now(); fresh = true; setTimeout(function () { fresh = false; }, 1000);
    try {
      ctx = new AC(); window.__rcxAudioCtx = ctx;
      eng = build(ctx, ctx.destination);
      timer = setInterval(function () { if (ctx.state === 'running') eng.scheduleUntil(ctx.currentTime + 45); }, 8000);
      setInterval(function () { if (ctx.state === 'running') eng.drumTick(ctx.currentTime + 1.5); }, 300);
      if (ctx.state === 'suspended') ctx.resume();
      if (!muted) eng.slowIn(30);
    } catch (e) { started = false; }
    mkBtn(); refresh();
  }
  function toggle() {
    // the very first tap on the page landed on this button: the tap already started the music, so play it (and bring it up quickly) instead of turning it off
    if (fresh && started && !muted) { fresh = false; if (ctx.state === 'suspended') ctx.resume(); eng.fadeIn(3); refresh(); return; }
    if (!started) { muted = false; try { localStorage.removeItem(KEY); } catch (e) {} start(); return; }
    muted = !muted;
    if (!muted && storyActive()) {   // turning the sound bath on stops the story, then the bath fades in
      try { var sa = window.__rcxAudio; if (sa && !sa.paused) sa.pause(); } catch (e) {}
      try { if (window.speechSynthesis && speechSynthesis.speaking) speechSynthesis.cancel(); } catch (e) {}
      storyOn = false; if (eng) eng.setDuck(1, 1.5);
    }
    try { if (muted) localStorage.setItem(KEY, 'off'); else localStorage.removeItem(KEY); } catch (e) {}
    if (muted && remixing) { remixing = false; eng.remixOff(); rRefresh(); }
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
    if (storyOn) return; // never start or nudge anything while the story is playing
    unlockIOS();
    start();
    if (ctx && ctx.state !== 'running') { try { ctx.resume(); } catch (e) {} }
    if (ctx && ctx.state === 'running') ['pointerdown', 'touchend', 'keydown', 'click'].forEach(function (n) { document.removeEventListener(n, firstGesture, true); });
  }
  ['pointerdown', 'touchstart', 'touchend', 'keydown', 'click'].forEach(function (n) { document.addEventListener(n, firstGesture, true); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mkBtn); else mkBtn();

  // step aside while the story (Roar of the Mountain) plays: slow fade out, back in when it stops.
  // The story's audio element is not attached to the page, so listen on it directly.
  var storyOn = false, watched = null;
  // Oct 11: only one sound at a time. The story and the sound bath cross fade (about a second and a half).
  function storyActive() {
    var a = window.__rcxAudio;
    return !!((a && !a.paused && !a.ended) || (window.speechSynthesis && speechSynthesis.speaking && !speechSynthesis.paused));
  }
  function storyPlay() { if (storyOn) return; storyOn = true; if (kick) { try { kick.pause(); } catch (e) {} } if (eng) eng.setDuck(0, 1.5); }
  function storyStop() { if (!storyOn) return; storyOn = false; if (eng) eng.setDuck(1, 2.5); }
  // poll as well as listen: a fresh story element can start before its listeners are attached
  setInterval(function () { var on = storyActive(); if (on && !storyOn) storyPlay(); else if (!on && storyOn) storyStop(); }, 250);
  setInterval(function () {
    var a = window.__rcxAudio;
    if (a && a !== watched) {
      watched = a;
      a.addEventListener('play', storyPlay); a.addEventListener('playing', storyPlay);
      a.addEventListener('pause', storyStop); a.addEventListener('ended', storyStop);
      if (!a.paused) storyPlay();
    }
  }, 300);
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
