/* Oct 16 (Scott): the phone mushroom pages were far too long. On the phone each mushroom page is now:
   the top photo, then the evidence (what's been studied, the numbers and lab reports, the magazines and research),
   then how it's made (and why ours is made that way when most products are not), then the story box, then the fine print.
   Everything else is hidden on the phone only. Desktop keeps the full, in-depth page.
   The full phone version is saved in backups/index-before-short-mushroom-2026-10-16.html. */
(function () {
  var MQ = matchMedia('(max-width:767px)');
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
    if (/studied-sec/.test(c + ' ' + m)) return 2;
    if (/^num-/.test(m)) return 3;
    if (m === 'tt-gut') return 3;   // Oct 17 (Scott): Gut Health stays on the phone, right after the numbers
    if (/^FURTHER READING/.test(h)) return 4;
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
  // How It's Made also says why: copy the page's own "part used" explanation (what most products are) under it
  function addWhy(P) {
    var how = [].filter.call(P.querySelectorAll('section'), function (s) { return rank(s) === 5; })[0];
    if (!how || how.querySelector('.ms-add')) return;
    var src = null;
    [].forEach.call(P.querySelectorAll('p'), function (p) { if (/^\s*A fruiting body is the mushroom itself|most commercial .mushroom. products/i.test(p.innerText) && (!src || p.innerText.length > src.innerText.length)) src = p; });
    if (!src) return;
    var paras = [].filter.call(how.querySelectorAll('p'), function (p) { return p.closest('section') === how; });
    var last = paras[paras.length - 1]; if (!last) return;
    var n = last.cloneNode(false); n.className = (n.className ? n.className + ' ' : '') + 'ms-add'; n.textContent = src.innerText.trim();
    last.parentNode.insertBefore(n, last.nextSibling);
  }
  function trimReading(P) {
    [].forEach.call(P.querySelectorAll('[data-ms-card="fr"]'), function (s) {
      var links = [].filter.call(s.querySelectorAll('a'), function (a) { return a.closest('section') === s && a.innerText.trim().length > 20; });
      links.forEach(function (a, i) { var item = a.parentElement && a.parentElement !== s && a.parentElement.querySelectorAll('a').length === 1 ? a.parentElement : a;
        if (i >= 3) { if (item.style.getPropertyValue('display') !== 'none') item.style.setProperty('display', 'none', 'important'); } });
    });
  }
  // Oct 16 (Scott): no box after box. Row one: what it's believed to do, then the proof (What's Been Studied leads the numbers row).
  // Row two: the magazines. Row three: How It's Made, then swipe for Further Reading. Same on all three pages.
  function home(el) { if (!el.__msHome) el.__msHome = [el.parentNode, el.nextSibling]; }
  function rows(P) {
    var all = [].slice.call(P.querySelectorAll('section'));
    var studied = P.querySelector('[data-ms-card="studied"]') || all.filter(function (x) { return rank(x) === 2; })[0];
    var how = P.querySelector('[data-ms-card="how"]') || all.filter(function (x) { return rank(x) === 5; })[0];
    var fr = P.querySelector('[data-ms-card="fr"]') || all.filter(function (x) { return rank(x) === 4; })[0];
    var num = all.filter(function (x) { return rank(x) === 3; })[0];
    if (num && studied) {
      var track = [].filter.call(num.querySelectorAll('.cx-track'), function (t) { return !t.closest('.pr-row'); })[0];
      if (track && studied.parentNode !== track) { addWhy(P); home(studied); studied.setAttribute('data-ms-card', 'studied'); track.insertBefore(studied, track.firstChild); track.scrollLeft = 0; setTimeout(function () { track.scrollLeft = 0; }, 400); }
      var box = track && track.querySelector('.mx-box');
      if (box && box.offsetWidth) { studied.style.setProperty('--msw', box.offsetWidth + 'px'); studied.style.setProperty('--msh', box.offsetHeight + 'px'); }
      [].forEach.call(studied.querySelectorAll('p'), function (q) { var t = (q.innerText || '').trim(); if (t.length > 140 && t[0] !== '*') { q.setAttribute('data-ms-long', ''); } });
    }
    if (how && fr) {
      if (!how.hasAttribute('data-ms-card')) addWhy(P);
      var wrap = P.querySelector(':scope > .ms-wrap');
      if (!wrap) { wrap = document.createElement('div'); wrap.className = 'ms-wrap';
        wrap.innerHTML = '<div class="rcx-swipe-tag">SWIPE FOR MORE <b>›</b></div><div class="ms-row"></div>'; P.appendChild(wrap); }
      var row = wrap.querySelector('.ms-row');
      if (how.parentNode !== row) { home(how); how.setAttribute('data-ms-card', 'how'); row.appendChild(how); }
      if (fr.parentNode !== row) { home(fr); fr.setAttribute('data-ms-card', 'fr'); row.appendChild(fr); }
      if (!row.__ms0) { row.__ms0 = 1; row.scrollLeft = 0; }
      // Lion's Mane How It's Made: no red box, the diver beside the shark instead (phone)
      var mb = P.getAttribute('data-screen-label') === "Lion's Mane" && how.querySelector('[data-m="made-box"]');
      var LMB = 'linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.68)),url("assets/photo/a-diver-signalling-underwater-alongside-a-shark.jpg")';
      if (mb && mb.style.getPropertyValue('background-image') !== LMB) { mb.style.setProperty('background-image', LMB, 'important'); mb.style.setProperty('background-color', '#000', 'important'); mb.style.setProperty('background-size', 'cover', 'important'); mb.style.setProperty('background-position', '30% center', 'important'); }
    }
  }
  function unrows(P) {   // desktop: everything goes back where it came from
    ['how', 'fr', 'studied'].forEach(function (k) { var el = P.querySelector('[data-ms-card="' + k + '"]'); if (!el) return;
      var h = el.__msHome; if (h && h[0]) h[0].insertBefore(el, h[1] && h[1].parentNode === h[0] ? h[1] : null);
      el.removeAttribute('data-ms-card'); el.__msHome = null; });
    var w = P.querySelector(':scope > .ms-wrap'); if (w) w.remove();
    var mb = P.querySelector('[data-m="made-box"]'); if (mb && /shark/.test(mb.style.getPropertyValue('background-image'))) ['background-image', 'background-color', 'background-size', 'background-position'].forEach(function (k) { mb.style.removeProperty(k); });
  }
  function run() {
    [].forEach.call(document.querySelectorAll('[data-screen-label]'), function (P) {
      if (PAGES.indexOf(P.getAttribute('data-screen-label')) < 0) return;
      if (!MQ.matches) { if (P.hasAttribute('data-ms-page')) { unrows(P); P.removeAttribute('data-ms-page'); [].forEach.call(P.querySelectorAll('[data-ms]'), function (e) { e.removeAttribute('data-ms'); e.style.removeProperty('order'); }); } return; }
      if (!P.offsetHeight && !P.hasAttribute('data-ms-page')) return;
      P.setAttribute('data-ms-page', '');
      rows(P); place(P, 0); trimReading(P);
      // How It's Made reads at the same size on all three pages
      [].forEach.call(P.querySelectorAll('[data-ms-card] p'), function (p) {
        if (p.style.getPropertyValue('font-size') !== '16px') { p.style.setProperty('font-size', '16px', 'important'); p.style.setProperty('line-height', '1.6', 'important'); } });
    });
  }
  setInterval(run, 1200); run(); addEventListener('resize', run);
})();
