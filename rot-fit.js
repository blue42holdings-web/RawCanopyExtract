/* Oct 28 (Scott): on the phone landing, Tear. Pour. Stir. runs large; every other word set is sized down so the whole line fits on the page, then it grows again when Tear. Pour. Stir. comes back. */
(function () {
  var BIG = 33, MIN = 17, timer = null, node = null;
  function slots(p) { return [].slice.call(p.children); }
  function natural(p) {   // width of the words at the current font size, not the animated slot widths
    var w = 0, kids = slots(p);
    kids.forEach(function (s) { var i = s.firstElementChild; if (i) w += i.getBoundingClientRect().width; });
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
    if (Math.abs(want - cur) < 1) return;
    p.style.setProperty('transition', 'font-size .35s ease');
    p.style.setProperty('font-size', want + 'px', 'important');
    [200, 420].forEach(function (d) { setTimeout(function () {   // the slot boxes follow the new text width
      slots(p).forEach(function (s) { var i = s.firstElementChild; if (i) s.style.width = i.getBoundingClientRect().width + 'px'; });
    }, d); });
    setTimeout(schedule, 450);
  }
  function schedule() { if (!timer) timer = setTimeout(fit, 80); }
  function attach() {
    var p = document.querySelector('[data-rcx-rotator]');
    if (!p || p === node) return;
    node = p;
    new MutationObserver(schedule).observe(p, { subtree: true, childList: true, characterData: true });
    schedule();
  }
  setInterval(function () { attach(); schedule(); }, 700);
})();
