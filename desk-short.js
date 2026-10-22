/* Oct 21 2026 (Scott): desktop mushroom pages were far too long and didn't match each other.
   Desktop now matches on all three pages, best of the best only:
     top photo, then the four boxes two by two (What It Is, Where Ours Comes From / How It's Made, What's Been Studied),
     then the numbers row (Turkey Tail keeps Gut Health after it), then the Coming Soon story box. Nothing under the story.
   Hidden on desktop: Further Reading, The Names It Goes By, No Scoop / Measured. Clean. band, How To Take It,
   The Lot Shipping Now, The Other Two, and Lion's Mane's Lock In / Steady Burn box.
   The full long version is saved on the branch backup-mushroom-pages-2026-10-21. Phone is untouched. */
(function () {
  var MQ = matchMedia('(min-width:768px)');
  var PAGES = ["Lion's Mane", 'Cordyceps', 'Turkey Tail'];
  var FOUR = [/^what it is$/i, /^where ours comes from$/i, /^how it.s made$/i, /^what.s\s*been studied$/i];
  var DROP = [/^further reading/i, /^the names it goes by/i, /^no scoop/i, /^measured\. clean/i, /^how to take it/i, /^the lot shipping now/i, /^the other two/i];
  function txt(e) { return (e.textContent || '').replace(/\s+/g, ' ').trim(); }
  function heads(P, res) {
    return [].filter.call(P.querySelectorAll('h1,h2,h3'), function (h) { var t = txt(h); return res.some(function (r) { return r.test(t); }); });
  }
  function boxOf(h, P) {   // the bordered card the heading sits in
    for (var x = h.parentElement; x && x !== P; x = x.parentElement) {
      var cs = getComputedStyle(x);
      if (parseFloat(cs.borderTopWidth) >= 1.5 && x.offsetWidth > 300) return x;
    }
    return null;
  }
  function hide(el) {   // inline, so no other script's inline display can bring it back
    if (!el) return;
    if (!el.hasAttribute('data-dk-hide')) el.setAttribute('data-dk-hide', '');
    if (el.style.getPropertyValue('display') !== 'none' || el.style.getPropertyPriority('display') !== 'important') el.style.setProperty('display', 'none', 'important');
  }
  function home(el) { if (!el.__dkHome) el.__dkHome = [el.parentNode, el.nextSibling]; }
  function apply(P) {
    var num = P.querySelector('section[data-m^="num-"]'); if (!num) return;
    // 1. the four boxes, two by two, just above the numbers
    var grid = P.querySelector('.dk-grid');
    if (!grid) { grid = document.createElement('div'); grid.className = 'dk-grid'; }
    if (grid.nextSibling !== num) num.parentNode.insertBefore(grid, num);
    FOUR.forEach(function (re, i) {
      var h = heads(P, [re]).filter(function (h) { return !h.closest('.dk-grid') || h.closest('.dk-grid') === grid; })[0];
      if (!h) return;
      var b = boxOf(h, P); if (!b) return;
      if (b.parentNode !== grid) {
        var oldSec = b.closest('section') || b.parentElement;
        home(b); grid.appendChild(b);
        if (oldSec && !oldSec.contains(grid) && txt(oldSec).length < 3) hide(oldSec);
      }
      b.style.order = i;
    });
    // empty leftovers of the old stacks
    [].forEach.call(P.querySelectorAll('section,.rcx-row2'), function (s) { if (!s.contains(grid) && !s.closest('.dk-grid') && s.offsetHeight > 20 && txt(s).length < 3 && !s.querySelector('img,video,iframe,form') && !/-hero$/.test(s.getAttribute('data-m') || '')) hide(s); });
    // 2. the story box last: after the numbers, or after Gut Health on Turkey Tail
    var sbox = P.querySelector('section[data-m="sbox"]');
    var anchor = P.querySelector('section[data-m="tt-gut"]') || num;
    if (sbox && anchor.nextSibling !== sbox) { home(sbox); anchor.parentNode.insertBefore(sbox, anchor.nextSibling); }
    // 3. nothing under the story
    heads(P, DROP).forEach(function (h) { hide(h.closest('section') || boxOf(h, P)); });
    [].forEach.call(P.querySelectorAll('[data-m="lm-whitewrap"],[data-m="tt-redwrap"],[data-m="lm-burn"],[data-rcx-burn]'), hide);
    // no magazine row here (the magazines live on the home page)
    [].forEach.call(P.querySelectorAll('.pr-row'), hide);
    [].forEach.call(P.querySelectorAll('.mx-press'), function (a) { var r = a.closest('.cx,.pr-row') || a.parentElement; if (r && !r.querySelector('.mx-box:not(.mx-press)')) hide(r); });
    // every box in the grid gets a dark backing so its words read on any page color
    [].forEach.call(grid.children, function (b) { if (getComputedStyle(b).backgroundImage === 'none' && b.style.getPropertyValue('background-color') !== 'rgba(0, 0, 0, 0.62)') b.style.setProperty('background-color', 'rgba(0,0,0,.62)', 'important'); });
    // Lion's Mane: the Lock In box that sat beside What It Is
    var lock = [].filter.call(P.querySelectorAll('.mx-tag,h2,h3,span'), function (e) { return /^lock in$/i.test(txt(e)); })[0];
    if (lock) { var lb = lock.closest('.mx-box') || boxOf(lock, P); if (lb && !lb.closest('.dk-grid')) hide(lb); }
    P.setAttribute('data-dk-page', '');
  }
  function undo(P) {
    [].forEach.call(P.querySelectorAll('[data-dk-hide]'), function (e) { e.removeAttribute('data-dk-hide'); e.style.removeProperty('display'); });
    var moved = [].slice.call(P.querySelectorAll('.dk-grid > *'));
    var sbox = P.querySelector('section[data-m="sbox"]'); if (sbox) moved.push(sbox);
    moved.forEach(function (el) { var h = el.__dkHome; if (h && h[0]) { h[0].insertBefore(el, h[1] && h[1].parentNode === h[0] ? h[1] : null); el.__dkHome = null; el.style.order = ''; } });
    var g = P.querySelector('.dk-grid'); if (g) g.remove();
    P.removeAttribute('data-dk-page');
  }
  function run() {
    [].forEach.call(document.querySelectorAll('[data-screen-label]'), function (P) {
      if (PAGES.indexOf(P.getAttribute('data-screen-label')) < 0) return;
      if (!MQ.matches) { if (P.hasAttribute('data-dk-page')) undo(P); return; }
      if (!P.offsetHeight) return;
      apply(P);
    });
  }
  setInterval(run, 1500); run(); addEventListener('resize', run);
})();
