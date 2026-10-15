/* Oct 14: phone only. The page sweeps itself: all the way down, a five second stop, all the way up,
   a five second stop, and round again. A finger on the screen pauses it for a moment so the reader
   is never fought. Desktop is untouched. */
(function () {
  var MQ = window.matchMedia('(max-width:767px)');
  var PAUSE = 5000, SPEED = 200;          /* px per second, a slow read */
  var raf = 0, timer = 0, running = false, holdUntil = 0;
  function maxY() { return Math.max(0, document.documentElement.scrollHeight - window.innerHeight); }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function glide(to, done) {
    var from = window.scrollY, dist = Math.abs(to - from);
    if (dist < 2) { done(); return; }
    var dur = Math.max(4000, Math.min(90000, dist / SPEED * 1000)), t0 = null;
    function step(now) {
      if (!running) return;
      if (now < holdUntil) { t0 = null; from = window.scrollY; to = to; raf = requestAnimationFrame(step); return; }
      if (t0 === null) { t0 = now; from = window.scrollY; dist = Math.abs(to - from); dur = Math.max(4000, Math.min(90000, dist / SPEED * 1000)); }
      var p = Math.min(1, (now - t0) / dur);
      window.scrollTo(0, from + (to - from) * ease(p));
      if (p < 1) raf = requestAnimationFrame(step); else done();
    }
    raf = requestAnimationFrame(step);
  }
  var target = 'down';
  function cycle() {
    if (!running) return;
    if (target === 'down') {
      glide(maxY(), function () { target = 'up'; timer = setTimeout(cycle, PAUSE); });
    } else {
      glide(0, function () { target = 'down'; timer = setTimeout(cycle, PAUSE); });
    }
  }
  function stop() { running = false; cancelAnimationFrame(raf); clearTimeout(timer); }
  function start() { if (running) return; running = true; timer = setTimeout(cycle, 2500); }
  function touched() { holdUntil = performance.now() + 4000; }
  function sync() { if (MQ.matches) start(); else stop(); }
  ['touchstart', 'wheel', 'mousedown', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, touched, { passive: true });
  });
  if (MQ.addEventListener) MQ.addEventListener('change', sync); else MQ.addListener(sync);
  sync();
})();
