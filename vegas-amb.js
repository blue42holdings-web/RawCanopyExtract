/* Oct 22 2026 (Scott): while the slot machines are on screen it should feel like you're standing in Vegas.
   A quiet casino floor: a soft lounge chord bed, the murmur of a crowd, far off slot machine jingles and the odd coin.
   All made in code, kept low. The Sound Bath steps aside while it plays and comes back when you scroll past.
   It plays when the Sound Bath is already on, or once the visitor pulls a handle (their own tap starts the sound). */
(function () {
  if (window.__rcxVegas) return; window.__rcxVegas = 1;
  var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
  var ctx = null, out = null, on = false, inView = false, wanted = false, timers = [], ownCtx = false;
  function now() { return ctx.currentTime; }
  function getCtx() {
    if (ctx) return ctx;
    if (window.__rcxAudioCtx && window.__rcxAudioCtx.state === 'running') ctx = window.__rcxAudioCtx;
    else { try { ctx = new AC(); ownCtx = true; } catch (e) { return null; } }
    out = ctx.createGain(); out.gain.value = 0;
    var lim = ctx.createDynamicsCompressor(); lim.threshold.value = -10; lim.ratio.value = 6; lim.connect(ctx.destination); out.connect(lim);
    return ctx;
  }
  function noiseBuf() { var n = ctx.sampleRate * 3, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0), last = 0; for (var i = 0; i < n; i++) { var w = Math.random() * 2 - 1; last = (last + 0.04 * w) / 1.04; d[i] = last * 3.2; } return b; }
  var crowd = null, voiceT = [];
  // Oct 23 (Scott): no ocean-like hiss. The room is "walla": many far off voices talking, made from voice-like
  // tones shaped into vowels and syllables, each voice starting and stopping at random.
  var VOW = [[730, 1090], [270, 2290], [530, 1840], [570, 840], [300, 870], [660, 1720], [490, 1350]];   // ah ee eh aw oo ae uh
  function voice(bus) {
    var o = ctx.createOscillator(), f1 = ctx.createBiquadFilter(), f2 = ctx.createBiquadFilter(), g = ctx.createGain(), m1 = ctx.createGain(), m2 = ctx.createGain();
    var pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null, pitch = 95 + Math.random() * 130;
    o.type = 'sawtooth'; o.frequency.value = pitch;
    f1.type = 'bandpass'; f1.Q.value = 9; f2.type = 'bandpass'; f2.Q.value = 12; m1.gain.value = 1; m2.gain.value = 0.5;
    g.gain.value = 0;
    o.connect(f1); o.connect(f2); f1.connect(m1); f2.connect(m2); m1.connect(g); m2.connect(g);
    if (pan) { pan.pan.value = Math.random() * 1.6 - 0.8; g.connect(pan); pan.connect(bus); } else g.connect(bus);
    o.start();
    function phrase() {
      if (!on) return;
      var t = now() + 0.02, n = 3 + Math.floor(Math.random() * 9), tt = t;
      for (var i = 0; i < n; i++) {
        var v = VOW[Math.floor(Math.random() * VOW.length)], d = 0.09 + Math.random() * 0.17, lv = 0.05 + Math.random() * 0.06;
        f1.frequency.setTargetAtTime(v[0], tt, 0.02); f2.frequency.setTargetAtTime(v[1], tt, 0.02);
        o.frequency.setTargetAtTime(pitch * (0.9 + Math.random() * 0.25), tt, 0.05);
        g.gain.setTargetAtTime(lv, tt, 0.015); g.gain.setTargetAtTime(0.0, tt + d * 0.75, 0.02);
        tt += d + Math.random() * 0.04;
      }
      voiceT.push(setTimeout(phrase, (tt - t) * 1000 + 300 + Math.random() * 2200));
    }
    voiceT.push(setTimeout(phrase, Math.random() * 1500));
    return o;
  }
  function startCrowd() {   // the room: a dozen people talking across the floor, soft and far away
    var bus = ctx.createGain(); bus.gain.value = 0.55;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200;
    var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 160;
    bus.connect(hp); hp.connect(lp); lp.connect(out);
    var vs = []; for (var i = 0; i < 12; i++) vs.push(voice(bus));
    crowd = vs;
  }
  function note(f, t, len, vol, type, pan, lp) {
    var o = ctx.createOscillator(), g = ctx.createGain(), p = ctx.createStereoPanner ? ctx.createStereoPanner() : null, f2 = ctx.createBiquadFilter();
    o.type = type || 'sine'; o.frequency.value = f; f2.type = 'lowpass'; f2.frequency.value = lp || 6000;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(f2); f2.connect(g); if (p) { p.pan.value = pan || 0; g.connect(p); p.connect(out); } else g.connect(out);
    o.start(t); o.stop(t + len + 0.05);
  }
  var CH = [[146.8, 174.6, 220, 261.6, 329.6], [98, 174.6, 246.9, 329.6, 440], [130.8, 164.8, 196, 246.9, 293.7], [110, 138.6, 196, 233.1, 329.6]];   // Dm9, G13, Cmaj9, A7b9: lounge changes
  var ci = 0;
  function pad() {   // the lounge bed, soft and slow
    if (!on) return; var t = now() + 0.05, c = CH[ci++ % CH.length];
    c.forEach(function (f, i) { note(f, t, 4.4, i ? 0.022 : 0.035, 'triangle', (i - 2) * 0.25, 1400); note(f * 2.003, t + 0.02, 3.6, 0.007, 'sine', (2 - i) * 0.2, 2400); });
    timers.push(setTimeout(pad, 4000));
  }
  function jingle() {   // a machine across the room pays out
    if (!on) return; var t = now() + 0.05, base = [523.25, 587.33, 659.26][Math.floor(Math.random() * 3)], pan = Math.random() * 1.6 - 0.8, k = 4 + Math.floor(Math.random() * 2);   // Oct 23 (Scott): only the standard four or five note figure, never the high ones
    for (var i = 0; i < k; i++) note(base * [1, 1.26, 1.5, 2, 1.5][i], t + i * 0.085, 0.22, 0.018, 'square', pan, 2200);
    timers.push(setTimeout(jingle, 900 + Math.random() * 2600));
  }
  function coins() {   // Oct 23 (Scott): the coin tinkle was the high-pitched sound; off
    return;
    if (!on) return; var t = now() + 0.05, pan = Math.random() * 1.4 - 0.7, n = 2 + Math.floor(Math.random() * 5);
    for (var i = 0; i < n; i++) note(3200 + Math.random() * 1800, t + i * (0.05 + Math.random() * 0.06), 0.09, 0.014, 'triangle', pan, 9000);
    timers.push(setTimeout(coins, 2500 + Math.random() * 5000));
  }
  function start() {
    if (on || !getCtx()) return; if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    on = true; pad(); jingle(); coins();   // Oct 23 (Scott): no room walla, no talking
    out.gain.cancelScheduledValues(now()); out.gain.setValueAtTime(out.gain.value, now()); out.gain.linearRampToValueAtTime(0.32, now() + 3);
    if (window.__rcxBathDuck) window.__rcxBathDuck(0, 2.5);
  }
  function stop() {
    if (!on) return; on = false; timers.forEach(clearTimeout); timers = [];
    out.gain.cancelScheduledValues(now()); out.gain.setValueAtTime(out.gain.value, now()); out.gain.linearRampToValueAtTime(0, now() + 2.5);
    var c = crowd; crowd = null; voiceT.forEach(clearTimeout); voiceT = []; setTimeout(function () { if (c) c.forEach(function (o) { try { o.stop(); } catch (e) {} }); }, 2700);
    if (window.__rcxBathDuck) window.__rcxBathDuck(1, 3);
  }
  function decide() { var want = inView && !document.hidden && (wanted || (window.__rcxBathOn && window.__rcxBathOn())); if (want) start(); else stop(); }
  addEventListener('message', function (e) { if (e.data && e.data.fmPull) { wanted = true; decide(); } });
  document.addEventListener('visibilitychange', decide);
  var io = null, watched = null;
  setInterval(function () {
    var f = document.querySelector('.hg-slot'); if (!f || f === watched || !window.IntersectionObserver) { if (!f && on) { inView = false; decide(); } return; }
    watched = f; if (io) io.disconnect();
    io = new IntersectionObserver(function (es) { es.forEach(function (x) { inView = x.isIntersecting && x.intersectionRatio > 0.25; }); decide(); }, { threshold: [0, 0.25, 0.5] });
    io.observe(f);
  }, 1000);
  window.__rcxVegasState = function () { return { on: on, inView: inView, gain: out ? out.gain.value : 0 }; };
  setInterval(decide, 1500);   // catches the Sound Bath being switched on while the machines are already showing
})();
