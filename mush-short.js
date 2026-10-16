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
    var m = s.getAttribute('data-m') || '', c = String(s.className), h = head(s);
    if (/hero/.test(m) || /hero/.test(c)) return 1;
    if (/studied-sec/.test(c + ' ' + m)) return 2;
    if (/^num-/.test(m)) return 3;
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
    [].forEach.call(P.querySelectorAll('section[data-ms="k"]'), function (s) {
      if (rank(s) !== 4) return;
      var links = [].filter.call(s.querySelectorAll('a'), function (a) { return a.closest('section') === s && a.innerText.trim().length > 20; });
      links.forEach(function (a, i) { var item = a.parentElement && a.parentElement !== s && a.parentElement.querySelectorAll('a').length === 1 ? a.parentElement : a;
        if (i >= 3) { if (item.style.getPropertyValue('display') !== 'none') item.style.setProperty('display', 'none', 'important'); } });
    });
  }
  function run() {
    [].forEach.call(document.querySelectorAll('[data-screen-label]'), function (P) {
      if (PAGES.indexOf(P.getAttribute('data-screen-label')) < 0) return;
      if (!MQ.matches) { if (P.hasAttribute('data-ms-page')) { P.removeAttribute('data-ms-page'); [].forEach.call(P.querySelectorAll('[data-ms]'), function (e) { e.removeAttribute('data-ms'); e.style.removeProperty('order'); }); } return; }
      if (!P.offsetHeight && !P.hasAttribute('data-ms-page')) return;
      P.setAttribute('data-ms-page', '');
      addWhy(P); place(P, 0); trimReading(P);
      // How It's Made reads at the same size on all three pages
      [].forEach.call(P.querySelectorAll('section[data-ms="k"] p'), function (p) { var s = p.closest('section'); if (rank(s) !== 5) return;
        if (p.style.getPropertyValue('font-size') !== '16px') { p.style.setProperty('font-size', '16px', 'important'); p.style.setProperty('line-height', '1.6', 'important'); } });
    });
  }
  setInterval(run, 1200); run(); addEventListener('resize', run);
})();
