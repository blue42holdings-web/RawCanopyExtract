/* Oct 16 (Scott): the phone mushroom pages were far too long. On the phone each mushroom page is now:
   the top photo, then the evidence (what's been studied, the numbers and lab reports, the magazines and research),
   then how it's made (and why ours is made that way when most products are not), then the story box, then the fine print.
   Nov 5: everything that used to be hidden here has been deleted from the page itself.
   */
(function () {
  var PAGES = ["Lion's Mane", 'Cordyceps', 'Turkey Tail'];
  function head(s) {   // the section's own first heading
    var hs = s.querySelectorAll('h1,h2,h3');
    for (var i = 0; i < hs.length; i++) if (hs[i].closest('section') === s) return hs[i].innerText.replace(/\s+/g, ' ').trim().toUpperCase();
    return '';
  }
  function rank(s) {
    if (s.hasAttribute('data-ms-card')) return 0;
    var m = s.getAttribute('data-m') || '', c = String(s.className), h = head(s);
    if (/hero/.test(m) || /hero/.test(c)) return 1;
    if (/^num-/.test(m)) return 3;
    if (/^HOW IT.S MADE/.test(h)) return 5;
    if (/(^|\s)sbox(\s|$)/.test(c + ' ' + m)) return 6;
    return 0;
  }
  function hasKept(el) { var a = el.querySelectorAll('section'); for (var i = 0; i < a.length; i++) if (rank(a[i])) return true; return false; }
  function mark(el, v, ord) {
    if (el.getAttribute('data-ms') !== v) el.setAttribute('data-ms', v);
    var dv = v === 'x' ? 'none' : v === 'flat' ? 'contents' : '';   // inline so no other script can bring a hidden box back
    if (dv) { if (el.style.getPropertyValue('display') !== dv) el.style.setProperty('display', dv, 'important'); }
    else if (/^(none|contents)$/.test(el.style.getPropertyValue('display'))) el.style.removeProperty('display');
    if (ord) { if (el.style.getPropertyValue('order') !== String(ord)) el.style.setProperty('order', ord, 'important'); }
    else if (el.style.getPropertyValue('order')) el.style.removeProperty('order');
  }
  // walk the page: keep the chosen sections, flatten any wrapper that holds one, hide the rest
  function place(el, inherit) {
    [].forEach.call(el.children, function (k) {
      if (k.tagName === 'SCRIPT' || k.tagName === 'STYLE') return;
      if (k.classList.contains('ms-wrap')) { mark(k, 'k', 5); return; }
      var r = k.tagName === 'SECTION' ? rank(k) : 0, inner = hasKept(k);
      if (r && !(inner && [].some.call(k.querySelectorAll('section'), function (q) { var x = rank(q); return x && x !== r; }))) { mark(k, 'k', r); return; }
      if (inner) { mark(k, 'flat'); place(k, r || inherit); return; }
      var pos = getComputedStyle(k).position;
      if (inherit && pos !== 'absolute' && pos !== 'fixed') mark(k, 'k', inherit); else mark(k, 'x');
    });
  }
  // Oct 21 (Scott): photos for the How It's Made card, phone and desktop. Each photo sits on its own layer inside the box so no other script can swap it.
  var CARD = {
    "Lion's Mane": { how: ['lm-kickoff-fishing-sunset.jpg', '-380px 0', '970px auto', 'linear-gradient(rgba(0,0,0,.2),rgba(0,0,0,.45))'] },   // Oct 22 (Scott): skier moved a little right so more kids show in the left box
    'Turkey Tail': { how: ['tt-concert-lasers.jpg', '50% 50%'] }   // Oct 28 (Scott): the concert wristbands replace the hiker
  };
  function boxIn(sec) { return sec && ([].filter.call(sec.children, function (k) { return k.tagName === 'DIV' && k.offsetHeight > 100; })[0] || sec); }
  function layer(box, u, size, pos, grad) {
    if (!box) return;
    [].forEach.call(box.querySelectorAll('div'), function (k) {   // old photo layers inside the box
      if (k.className === 'rcx-mph' || k.innerText.trim() || k.querySelector('a,p,h2,h3,img')) return;
      if (/assets\/photo\//.test(getComputedStyle(k).backgroundImage) && k.style.getPropertyValue('display') !== 'none') k.style.setProperty('display', 'none', 'important');
    });
    var L = box.querySelector(':scope > .rcx-mph');
    if (!L) { L = document.createElement('div'); L.className = 'rcx-mph'; L.setAttribute('aria-hidden', 'true'); box.insertBefore(L, box.firstChild); }
    var v = (grad || 'linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.68))') + ',url("assets/photo/' + u + '")';
    if (L.__v !== v + size + pos) { L.__v = v + size + pos; L.style.setProperty('background-image', v, 'important'); L.style.setProperty('background-size', '100% 100%,' + size, 'important'); L.style.setProperty('background-position', '0 0,' + pos, 'important'); L.style.setProperty('background-repeat', 'no-repeat', 'important'); }
  }
  function cardPhotos(P, how) {
    var c = CARD[P.getAttribute('data-screen-label')]; if (!c) return;
    if (c.how && how) layer(boxIn(how), c.how[0], c.how[2] || 'cover', c.how[1]);
  }
  // Nov 5 (Scott): How It's Made sits in its own row under the numbers, with the shop button (mush-lean.js). The old hidden sections are deleted from the page.
  function home(el) { if (!el.__msHome) el.__msHome = [el.parentNode, el.nextSibling]; }
  function rows(P) {
    var all = [].slice.call(P.querySelectorAll('section'));
    var how = P.querySelector('[data-ms-card="how"]') || all.filter(function (x) { return rank(x) === 5; })[0];
    if (how) {
      var wrap = P.querySelector(':scope > .ms-wrap');
      if (!wrap) { wrap = document.createElement('div'); wrap.className = 'ms-wrap';
        wrap.innerHTML = '<div class="rcx-swipe-tag">SWIPE FOR MORE <b>›</b></div><div class="ms-row"></div>'; P.appendChild(wrap); }
      var row = wrap.querySelector('.ms-row');
      if (how.parentNode !== row) { home(how); how.setAttribute('data-ms-card', 'how'); row.appendChild(how); }
      if (!row.__ms0) { row.__ms0 = 1; row.scrollLeft = 0; }
      cardPhotos(P, how);
    }
  }
  function run() {
    [].forEach.call(document.querySelectorAll('[data-screen-label]'), function (P) {
      if (PAGES.indexOf(P.getAttribute('data-screen-label')) < 0) return;
      if (!P.offsetHeight && !P.hasAttribute('data-ms-page')) return;
      P.setAttribute('data-ms-page', '');
      rows(P); place(P, 0);
      // How It's Made reads at the same size on all three pages
      [].forEach.call(P.querySelectorAll('[data-ms-card] p'), function (p) {
        if (p.style.getPropertyValue('font-size') !== '16px') { p.style.setProperty('font-size', '16px', 'important'); p.style.setProperty('line-height', '1.6', 'important'); } });
    });
  }
  setInterval(run, 1200); run(); addEventListener('resize', run);
  // Oct 21 (Scott): run the moment a mushroom page is drawn, before the screen paints, so the long page never flashes up first
  var busy = false;
  new MutationObserver(function (ms) {
    if (busy) return;
    for (var i = 0; i < ms.length; i++) {
      var t = ms[i].target; var el = t.nodeType === 1 ? t : t.parentElement;
      var P = el && el.closest && el.closest('[data-screen-label]');
      var L = P && P.getAttribute('data-screen-label');
      if (PAGES.indexOf(L) >= 0 || (ms[i].addedNodes.length && [].some.call(ms[i].addedNodes, function (n) { return n.nodeType === 1 && (n.matches('[data-screen-label]') || n.querySelector('[data-screen-label]')); }))) {
        busy = true; try { run(); } finally { busy = false; } return;
      }
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
