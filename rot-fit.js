/* Oct 28 (Scott): on the phone landing, Open. Pour. Stir. runs large; every other word set is sized down so the whole line fits on the page, then it grows again when Open. Pour. Stir. comes back. */
(function () {
  var BIG = 33, MIN = 17, timer = null, node = null;
  function slots(p) { return [].slice.call(p.children).filter(function (c) { return !c.classList.contains('hero-dks'); }); }   // Nov 8: the drink icons line under the words is not a word
  function natural(p) {   // width of the words at the current font size, not the animated slot widths
    var w = 0, kids = slots(p);
    kids.forEach(function (s) { var i = s.firstElementChild; if (i) w += i.offsetWidth; });
    var gap = parseFloat(getComputedStyle(p).columnGap) || 0;
    return w + gap * Math.max(0, kids.length - 1);
  }
  function fit() {
    timer = null;
    var p = document.querySelector('[data-rcx-rotator]');
    if (!p || !p.offsetParent || innerWidth >= 768) return;
    var text = p.innerText.replace(/\s+/g, ' ').trim();
    var avail = p.clientWidth - 44;   // the line keeps 22px either side
    var cur = parseFloat(getComputedStyle(p).fontSize) || 30;
    var nat = natural(p);
    if (!nat || avail <= 0) return;
    var want = Math.max(MIN, Math.min(BIG, Math.floor(cur * avail / nat * 0.97)));
    want = Math.min(BIG, Math.floor(cur * avail / nat * 0.97));
    if (Math.abs(want - cur) < 1) { slots(p).forEach(function (s) { var i = s.firstElementChild; if (i) s.style.width = i.offsetWidth + 'px'; }); return; }
    p.style.setProperty('transition', 'none');   // Oct 29: instant, so the word slots are measured at the final size and never clip a word or its period
    p.style.setProperty('font-size', want + 'px', 'important');
    [0, 60, 150, 300, 600].forEach(function (d) { setTimeout(function () {   // the slot boxes follow the new text width
      slots(p).forEach(function (s) { var i = s.firstElementChild; if (i) s.style.width = i.offsetWidth + 'px'; });
    }, d); });
    setTimeout(schedule, 450);
  }
  // Nov 8 (Scott): each drink icon sits under its word of OPEN. POUR. STIR. (desktop: mug and blender move out to the period after OPEN and the S of STIR, evenly spaced either side of the cup): the mug under the middle of OPEN, the cup between the O and U of POUR, the blender under the middle of STIR.
  // Measured from the letters themselves (periods left out), only while those three words show; the icons stay put while other words rotate through.
  function mid(t, a, b) { var tx = t && t.firstChild; if (!tx || tx.nodeType !== 3) return null; var r = document.createRange(); r.setStart(tx, a); r.setEnd(tx, b); var q = r.getBoundingClientRect(); return q.width ? q.left + q.width / 2 : null; }
  function icons() {
    var p = document.querySelector('[data-rcx-rotator]'); if (!p || !p.offsetParent) return;
    var d = p.querySelector('.hero-dks'); if (!d) return;
    var w = slots(p).map(function (s) { return s.firstElementChild; });
    if (w.length < 3 || !w[0] || !/^open\.?$/i.test(w[0].textContent.trim()) || !/^pour\.?$/i.test(w[1].textContent.trim()) || !/^stir\.?$/i.test(w[2].textContent.trim())) return;
    var c = [mid(w[0], 0, 4), mid(w[1], 0, 4) === null ? null : (function () { var tx = w[1].firstChild, r = document.createRange(); r.setStart(tx, 1); r.setEnd(tx, 2); var o = r.getBoundingClientRect(); r.setStart(tx, 2); r.setEnd(tx, 3); var u = r.getBoundingClientRect(); return (o.left + u.right) / 2; })(), mid(w[2], 0, 4)];
    if (c.some(function (x) { return x === null; })) return;
    if (innerWidth >= 768) {   // desktop: equal spacing either side of the cup, from the period after OPEN and the S of STIR
      var dot = mid(w[0], 4, 5), s = mid(w[2], 0, 1);
      if (dot !== null && s !== null) { var step = ((c[1] - dot) + (s - c[1])) / 2; c[0] = c[1] - step; c[2] = c[1] + step; }
    }
    var L = d.getBoundingClientRect().left, ic = d.querySelectorAll('.dk');
    for (var i = 0; i < 3 && i < ic.length; i++) { var v = (c[i] - L - ic[i].offsetWidth / 2).toFixed(1) + 'px'; if (ic[i].style.left !== v) ic[i].style.left = v; }
  }
  addEventListener('resize', function () { setTimeout(icons, 50); });
  function schedule() { if (!timer) timer = setTimeout(fit, 0); }
  function attach() {
    var p = document.querySelector('[data-rcx-rotator]');
    if (!p || p === node) return;
    node = p;
    new MutationObserver(schedule).observe(p, { subtree: true, childList: true, characterData: true });
    schedule();
  }
  setInterval(function () { attach(); schedule(); icons(); }, 700);
})();
