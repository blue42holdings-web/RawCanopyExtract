/* Oct 15 (night), Scott: pages were glitching and freezing. About sixty layout scripts re-check the page
   every 0.15 to 1.2 seconds forever. This paces them: full speed for a few seconds after the page opens,
   a click, a key or a resize (when things actually change), then about every 3 seconds, and never in the
   middle of a scroll. Sound (ambient.js) and anything started later are left alone. Load this first. */
(function () {
  var PACED = /\/(site-extras|species-desk|desk-rows|nav-extras|mushroom-reveal|swipe-even|about-photos|phone-swipe|cutout-lift)\.js/;
  var IDLE = 3000, BUSY_MS = 7000, busyUntil = 0, lastScroll = 0;
  var oSet = window.setInterval, oClear = window.clearInterval, oTo = window.setTimeout, oCt = window.clearTimeout;
  function busy() { busyUntil = Date.now() + BUSY_MS; }
  busy();
  ['click', 'keydown', 'touchend', 'resize', 'hashchange', 'popstate'].forEach(function (ev) { addEventListener(ev, busy, { passive: true, capture: true }); });
  addEventListener('load', busy);
  addEventListener('scroll', function () { lastScroll = Date.now(); }, { passive: true, capture: true });
  var seq = 9e8, live = {};
  window.setInterval = function (fn, d) {
    var s = document.currentScript, src = s && s.src || '';
    if (typeof fn !== 'function' || !PACED.test(src)) return oSet.apply(window, arguments);
    d = +d || 0;
    var id = ++seq, args = [].slice.call(arguments, 2);
    function loop() {
      var now = Date.now();
      if (now - lastScroll < 250) { live[id] = oTo(loop, 300); return; }   // wait for the scroll to settle
      try { fn.apply(window, args); } catch (e) { setTimeout(function () { throw e; }); }
      if (live[id] === undefined) return;
      live[id] = oTo(loop, now < busyUntil ? d : Math.max(d, IDLE));
    }
    live[id] = oTo(loop, d);
    return id;
  };
  window.clearInterval = function (id) {
    if (live[id] !== undefined) { oCt(live[id]); delete live[id]; return; }
    return oClear.apply(window, arguments);
  };
})();
