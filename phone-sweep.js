/* Oct 14: phone only. The page sweeps itself: all the way down, a five second stop, all the way up,
   a five second stop, and round again. A finger on the screen pauses it for a moment so the reader
   is never fought. Desktop is untouched.
   Oct 15: steady slow speed. No speed-up on long pages, gentle start and stop, waits before the first move. */
(function () {
  var MQ = window.matchMedia('(max-width:767px)');
  var PAUSE = 5000, SPEED = 40, RAMP = 1.5, FIRST = 6000; /* px per second, seconds to reach speed */
  var raf = 0, timer = 0, running = false, holdUntil = 0;
  function maxY() { return Math.max(0, document.documentElement.scrollHeight - window.innerHeight); }
  function glide(dir, done) {
    var last = null, started = null, pos = window.scrollY;
    function step(now) {
      if (!running) return;
      if (now < holdUntil) { last = null; started = null; pos = window.scrollY; raf = requestAnimationFrame(step); return; }
      if (last === null) { last = now; started = now; pos = window.scrollY; }
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      var goal = dir > 0 ? maxY() : 0, left = Math.abs(goal - pos);
      var v = SPEED * Math.min(1, (now - started) / 1000 / RAMP) * Math.min(1, left / (SPEED * RAMP) + 0.15);
      pos += dir * Math.min(left, v * dt);
      window.scrollTo(0, pos);
      if (left - v * dt <= 0.5) { done(); return; }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
  }
  var target = 'down';
  function cycle() {
    if (!running) return;
    if (target === 'down') {
      glide(1, function () { target = 'up'; timer = setTimeout(cycle, PAUSE); });
    } else {
      glide(-1, function () { target = 'down'; timer = setTimeout(cycle, PAUSE); });
    }
  }
  function stop() { running = false; cancelAnimationFrame(raf); clearTimeout(timer); }
  function start() { if (running) return; running = true; timer = setTimeout(cycle, FIRST); }
  function touched() { holdUntil = performance.now() + 4000; }
  function sync() { if (MQ.matches) start(); else stop(); }
  ['touchstart', 'wheel', 'mousedown', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, touched, { passive: true });
  });
  if (MQ.addEventListener) MQ.addEventListener('change', sync); else MQ.addListener(sync);
  sync();
})();
