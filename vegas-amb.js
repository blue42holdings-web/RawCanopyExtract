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
  var crowd = null;
  function startCrowd() {   // the room: a low, warm murmur that drifts
    var s = ctx.createBufferSource(); s.buffer = noiseBuf(); s.loop = true;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 520; bp.Q.value = 0.7;
    var g = ctx.createGain(); g.gain.value = 0.22;
    var lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 0.13; lg.gain.value = 0.08; lfo.connect(lg); lg.connect(g.gain); lfo.start();
    s.connect(bp); bp.connect(g); g.connect(out); s.start(); crowd = [s, lfo];
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
    if (!on) return; var t = now() + 0.05, base = [1046.5, 1174.7, 1318.5, 1568, 1760][Math.floor(Math.random() * 5)], pan = Math.random() * 1.6 - 0.8, k = 3 + Math.floor(Math.random() * 4);
    for (var i = 0; i < k; i++) note(base * [1, 1.26, 1.5, 2, 1.5, 2.52][i % 6], t + i * 0.085, 0.22, 0.018, 'square', pan, 3200);
    timers.push(setTimeout(jingle, 900 + Math.random() * 2600));
  }
  function coins() {   // a few coins dropping in a tray
    if (!on) return; var t = now() + 0.05, pan = Math.random() * 1.4 - 0.7, n = 2 + Math.floor(Math.random() * 5);
    for (var i = 0; i < n; i++) note(3200 + Math.random() * 1800, t + i * (0.05 + Math.random() * 0.06), 0.09, 0.014, 'triangle', pan, 9000);
    timers.push(setTimeout(coins, 2500 + Math.random() * 5000));
  }
  function start() {
    if (on || !getCtx()) return; if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
    on = true; startCrowd(); pad(); jingle(); coins();
    out.gain.cancelScheduledValues(now()); out.gain.setValueAtTime(out.gain.value, now()); out.gain.linearRampToValueAtTime(0.32, now() + 3);
    if (window.__rcxBathDuck) window.__rcxBathDuck(0, 2.5);
  }
  function stop() {
    if (!on) return; on = false; timers.forEach(clearTimeout); timers = [];
    out.gain.cancelScheduledValues(now()); out.gain.setValueAtTime(out.gain.value, now()); out.gain.linearRampToValueAtTime(0, now() + 2.5);
    var c = crowd; crowd = null; setTimeout(function () { if (c) { try { c[0].stop(); c[1].stop(); } catch (e) {} } }, 2700);
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
