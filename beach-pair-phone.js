/* Oct 22 2026 (Scott): Mushrooms page, phone. The beach photo behind Check the Receipts and More Research
   reads as one picture through both boxes: zoomed in a little, slid toward the grass and the moka pot,
   and lined up so the dune grass rises across the gap from the lower box into the top one. */
(function () {
  var IW = 640, IH = 426;
  var Z = 1.15;        // zoom past "just covers"
  var CX = 0.6;        // across the photo: a bit right of center, between the fire and the grass
  var GAP_Y = 240;     // photo row that sits in the gap between the boxes: the grass tips poke up past it
  var PROPS = ['background-size', 'background-position'];
  function vis(e) { return e && e.offsetHeight > 0; }
  function run() {
    var a = [].filter.call(document.querySelectorAll('[data-ph="beach-fire-moka"][data-m="cta3"]'), vis)[0];
    var b = [].filter.call(document.querySelectorAll('[data-mush-mr][data-m="more-research"] > div[style]'), function (e) { return vis(e) && !e.hasAttribute('aria-hidden'); })[0];
    if (!a || !b) return;
    if (innerWidth >= 768) { [a, b].forEach(function (e) { if (e.__bp) { e.__bp = 0; PROPS.forEach(function (p) { e.style.removeProperty(p); }); } }); return; }
    var p = a.getBoundingClientRect(), q = b.getBoundingClientRect();
    if (p.width < 10 || q.width < 10) return;
    var L = Math.min(p.left, q.left), T = Math.min(p.top, q.top);
    var W = Math.max(p.right, q.right) - L, H = Math.max(p.bottom, q.bottom) - T;
    var s = Math.max(H / IH, W / IW) * Z, w = IW * s, h = IH * s;
    var ox = Math.min(0, Math.max(W - w, W / 2 - CX * w));
    var gap = (p.bottom + q.top) / 2 - T;
    var oy = Math.min(0, Math.max(H - h, gap - GAP_Y * s));
    [a, b].forEach(function (e) {
      var r = e.getBoundingClientRect(), bw = parseFloat(getComputedStyle(e).borderLeftWidth) || 0, bt = parseFloat(getComputedStyle(e).borderTopWidth) || 0;
      var size = '100% 100%,' + w.toFixed(1) + 'px ' + h.toFixed(1) + 'px';
      var pos = '0 0,' + (ox - (r.left - L) - bw).toFixed(1) + 'px ' + (oy - (r.top - T) - bt).toFixed(1) + 'px';
      if (e.style.getPropertyValue('background-size') !== size) e.style.setProperty('background-size', size, 'important');
      if (e.style.getPropertyValue('background-position') !== pos) e.style.setProperty('background-position', pos, 'important');
      e.__bp = 1;
    });
  }
  addEventListener('resize', run); setInterval(run, 800); run();
})();
