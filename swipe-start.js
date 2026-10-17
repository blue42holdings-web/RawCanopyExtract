/* Oct 17 (Scott): on phone, every "swipe for more" row opens with its FIRST box in start position, dead center on the screen.
   Each row gets enough side padding to center its first and last box, boxes snap to center, and the row is set to box one
   until the visitor touches it. */
(function () {
  if (window.__rcxSwipeStart) return; window.__rcxSwipeStart = 1;
  function boxes(row) { return [].filter.call(row.children, function (k) { return k.offsetWidth > 80 && k.offsetHeight > 60 && getComputedStyle(k).position !== 'absolute' && getComputedStyle(k).display !== 'none'; }); }
  function left(k, row) { return k.offsetParent === row ? k.offsetLeft : k.offsetLeft - row.offsetLeft; }   // layout position, ignoring reveal animations
  function fix() {
    if (innerWidth >= 768) return;
    [].forEach.call(document.querySelectorAll('*'), function (row) {
      if (row.__rcxTouched) return;
      var c = getComputedStyle(row);
      if (!(c.overflowX === 'auto' || c.overflowX === 'scroll')) return;
      if (row.scrollWidth <= row.clientWidth + 20) return;
      var rr = row.getBoundingClientRect(); if (rr.height < 100 || rr.width < 200) return;
      var b = boxes(row); if (b.length < 2) return;
      if (c.justifyContent !== 'flex-start' && c.justifyContent !== 'normal' && c.justifyContent !== 'start') row.style.setProperty('justify-content', 'flex-start', 'important');   // centered overflow hides box one off the left edge
      if (!row.__rcxLocked) {   // lock every box at its natural width first, so the added side room never squeezes the boxes
        row.__rcxLocked = 1;
        var ws = b.map(function (k) { return k.offsetWidth; });
        b.forEach(function (k, i) { var w = ws[i] + 'px'; ['width', 'min-width', 'max-width', 'flex-basis'].forEach(function (pr) { k.style.setProperty(pr, w, 'important'); }); k.style.setProperty('flex-grow', '0', 'important'); k.style.setProperty('flex-shrink', '0', 'important'); });
        if (c.display === 'grid' || c.display === 'inline-grid') row.style.setProperty('grid-auto-columns', 'max-content', 'important');
      }
      var cw = row.clientWidth, f = b[0], l = b[b.length - 1];
      var fw = f.offsetWidth, lw = l.offsetWidth;
      var pl = Math.max(0, Math.round((cw - fw) / 2)), pr = Math.max(0, Math.round((cw - lw) / 2));
      if (row.__rcxPl !== pl) { row.__rcxPl = pl; row.style.setProperty('padding-left', pl + 'px', 'important'); row.style.setProperty('padding-right', pr + 'px', 'important'); row.style.setProperty('scroll-padding-left', '0px', 'important'); row.style.setProperty('scroll-padding-right', '0px', 'important'); }
      b.forEach(function (k) { if (k.style.getPropertyValue('scroll-snap-align') !== 'center') k.style.setProperty('scroll-snap-align', 'center', 'important'); });
      var want = Math.max(0, Math.round(left(f, row) + fw / 2 - cw / 2 - (parseFloat(getComputedStyle(row).borderLeftWidth) || 0)));
      if (Math.abs(want - row.scrollLeft) > 1) { row.style.setProperty('scroll-behavior', 'auto', 'important'); row.scrollLeft = want; }
      if (!row.__rcxWatch) { row.__rcxWatch = 1; ['touchstart', 'pointerdown', 'wheel'].forEach(function (ev) { row.addEventListener(ev, function () { row.__rcxTouched = 1; }, { passive: true }); }); }
    });
  }
  var n = 0, t = setInterval(function () { fix(); if (++n > 40) { clearInterval(t); t = 0; } }, 250);
  function again() { n = 0; if (!t) t = setInterval(function () { fix(); if (++n > 24) { clearInterval(t); t = 0; } }, 250); }
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-page]')) { [].forEach.call(document.querySelectorAll('*'), function (r) { if (r.__rcxTouched && !document.contains(r)) r.__rcxTouched = 0; }); setTimeout(again, 300); } }, true);
  addEventListener('resize', function () { again(); });
})();
