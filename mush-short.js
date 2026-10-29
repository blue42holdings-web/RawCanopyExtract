/* Oct 16 (Scott): the phone mushroom pages were far too long. On the phone each mushroom page is now:
   the top photo, then the evidence (what's been studied, the numbers and lab reports, the magazines and research),
   then how it's made (and why ours is made that way when most products are not), then the story box, then the fine print.
   Everything else is hidden on the phone only. Desktop keeps the full, in-depth page.
   */
(function () {
  var MQ = matchMedia('all');   // Oct 21 (Scott): desktop uses the same short mushroom pages as the phone
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
  // Oct 21 (Scott): photos for the How It's Made, Further Reading and What's Been Studied cards, phone and desktop.
  // Each photo sits on its own layer inside the box so no other script can swap it. Lion's Mane: the ski lesson runs
  // through both boxes as one photo, the teacher in the right box (no diver with the shark, ever).
  var CARD = {
    "Lion's Mane": { span: ['lm-ski-lesson.jpg', 1.0, 0.72] },   // Oct 22 (Scott): skier moved a little right so more kids show in the left box
    'Cordyceps': { studied: ['cd-relay-college.jpg', '55% 40%'], studiedDesk: ['friends-workout.webp', '84% 40%'],   // Oct 22 (Scott): fill the box, centered on the woman on the right
                   fr: ['mushrooms-baseball-lights.webp', '60% 100%', 'auto 130%'] },   // Oct 22: zoomed in on home plate
    'Turkey Tail': { fr: ['tt-fest-wristbands.jpg', '42% 50%'] }   // Oct 28 (Scott): the concert wristbands replace the hiker
  };
  var dims = {};
  function nat(u, cb) { if (dims[u]) return cb(dims[u]); var im = new Image(); im.onload = function () { dims[u] = [im.naturalWidth, im.naturalHeight]; cb(dims[u]); }; im.src = 'assets/photo/' + u; }
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
  function cardPhotos(P, how, fr) {
    var c = CARD[P.getAttribute('data-screen-label')]; if (!c) return;
    var st = P.querySelector('[data-ms-card="studied"]');
    var sp = (c.studiedDesk && innerWidth >= 768) ? c.studiedDesk : c.studied;
    if (sp && st) layer(boxIn(st), sp[0], sp[2] || 'cover', sp[1], sp[3]);
    if (c.fr && fr) layer(boxIn(fr), c.fr[0], c.fr[2] || 'cover', c.fr[1]);
    if (c.span && how && fr) {
      var a = boxIn(how), b = boxIn(fr); if (!a || !b || !a.offsetWidth) return;
      nat(c.span[0], function (n) {
        var x0 = a.offsetLeft, W = b.offsetLeft + b.offsetWidth - x0, H = Math.max(a.offsetHeight, b.offsetHeight);
        var k = Math.max(W / n[0], H / n[1]) * c.span[1], iw = Math.round(n[0] * k), ih = Math.round(n[1] * k), y = Math.round((H - ih) / 2), x = Math.min(0, Math.max(W - iw, Math.round(0.75 * W - c.span[2] * iw)));
        layer(a, c.span[0], iw + 'px ' + ih + 'px', (x - (a.offsetLeft - x0)) + 'px ' + y + 'px');
        layer(b, c.span[0], iw + 'px ' + ih + 'px', (x - (b.offsetLeft - x0)) + 'px ' + y + 'px');
      });
    }
  }
  // Oct 16 (Scott): no box after box. Row one: what it's believed to do, then the proof (What's Been Studied leads the numbers row).
  // Row two: the magazines. Row three: How It's Made, then swipe for Further Reading. Same on all three pages.
  function home(el) { if (!el.__msHome) el.__msHome = [el.parentNode, el.nextSibling]; }
  // Oct 22 (Scott): Cordyceps, Game Night (the golfer) and the stadium box trade places in the numbers row
  function swapCards(P) {
    if (P.getAttribute('data-screen-label') !== 'Cordyceps') return;
    var num = P.querySelector('section[data-m^="num-"]'); if (!num) return;
    var t = [].filter.call(num.querySelectorAll('.cx-track'), function (x) { return !x.closest('.pr-row'); })[0]; if (!t) return;
    var kids = [].slice.call(t.children), a = -1, b = -1;
    kids.forEach(function (k, i) { var tx = (k.innerText || '').trim().toUpperCase(); if (/^GAME NIGHT/.test(tx)) a = i; if (/^THE REACTION TIME/.test(tx)) b = i; });
    if (a < 0 || b < 0) return;
    kids.forEach(function (k, i) { var o = String(i === a ? b : i === b ? a : i); if (k.style.getPropertyValue('order') !== o) k.style.setProperty('order', o, 'important'); });
  }
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
      // Oct 22 (Scott): Turkey Tail's Gut Health box joins this swipe row, first, so the row ends on Further Reading
      var gut = P.querySelector('section[data-m="tt-gut"]');
      if (gut && gut.parentNode !== row) { home(gut); gut.setAttribute('data-ms-card', 'gut'); row.insertBefore(gut, how); }
      if (gut && gut.nextSibling !== how) row.insertBefore(gut, how);
      if (fr.parentNode !== row) { home(fr); fr.setAttribute('data-ms-card', 'fr'); row.appendChild(fr); }
      if (!row.__ms0) { row.__ms0 = 1; row.scrollLeft = 0; }
      cardPhotos(P, how, fr);
    }
  }
  function unrows(P) {   // desktop: everything goes back where it came from
    ['how', 'fr', 'studied'].forEach(function (k) { var el = P.querySelector('[data-ms-card="' + k + '"]'); if (!el) return;
      var h = el.__msHome; if (h && h[0]) h[0].insertBefore(el, h[1] && h[1].parentNode === h[0] ? h[1] : null);
      el.removeAttribute('data-ms-card'); el.__msHome = null; });
    var w = P.querySelector(':scope > .ms-wrap'); if (w) w.remove();
  }
  function run() {
    [].forEach.call(document.querySelectorAll('[data-screen-label]'), function (P) {
      if (PAGES.indexOf(P.getAttribute('data-screen-label')) < 0) return;
      if (!MQ.matches) { if (P.hasAttribute('data-ms-page')) { unrows(P); P.removeAttribute('data-ms-page'); [].forEach.call(P.querySelectorAll('[data-ms]'), function (e) { e.removeAttribute('data-ms'); e.style.removeProperty('order'); }); } return; }
      if (!P.offsetHeight && !P.hasAttribute('data-ms-page')) return;
      P.setAttribute('data-ms-page', '');
      rows(P); swapCards(P); place(P, 0); trimReading(P);
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
