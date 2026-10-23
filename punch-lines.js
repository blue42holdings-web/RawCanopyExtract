/* Oct 22 2026 (Scott): new edgier lines for LuAnne's phase two review. One gold box per page:
   home under the brand paragraph, each mushroom page right under its top photo. Desktop and phone. */
(function () {
  var NB = ' ';
  function j(s) { return s.replace(/ (\S+)$/, NB + '$1'); } // keep the last two words together
  var LINES = {
    home: { h: 'Three nutrient rich|functional mushroom extracts.', s: ['A clean, single ingredient nootropic. Add it to your morning cup.'], i: 'For the chronic stress of a world that won\u2019t slow down.' },
    lm: { h: 'For your noggin', s: ['Losing focus? Brain nutrition, straight from the forest.', 'Sustained focus. No jitter.', 'Chronic stress. Constant noise. Real support.*'], i: 'Inspired by the neuroscience on lion\u2019s mane.' },
    cd: { h: 'Pre workout. No crash.', s: ['No caffeine. No sugar spike. Sustained energy that lasts the whole session.*'], i: 'For the days the couch is winning.' },
    tt: { h: 'Made for the crowd.', s: ['Long flights. Packed terminals. A world that keeps changing.', 'Supports a healthy immune system.*', 'Keeps things moving, too. Supports healthy digestion.*'], i: 'Built for a world of processed food.' }
  };
  var st = document.createElement('style');   // another script balances the lines; that would wrap a line we want whole
  st.textContent = 'html body section.pl-box .pl-ph{text-wrap:nowrap !important;white-space:nowrap !important}';
  document.head.appendChild(st);
  function box(k) {
    var L = LINES[k], d = document.createElement('section');
    d.className = 'pl-box pl-hero pl-k-' + k;   // 'hero' in the class keeps mush-short.js from hiding it; it sorts right after the top photo 
    var two = L.h.indexOf('|') > -1;   // a "|" in the headline is a forced line break: two lines, each on its own
    var html = '<div class="pl-h">' + (two ? L.h.split('|') : L.h.split(/(?<=\.) /)).map(function (t) { return '<span class="pl-ph"' + (two ? ' style="display:block"' : '') + '>' + t + '</span>'; }).join(two ? '' : ' ') + '</div>';   // headline only breaks between phrases
    L.s.forEach(function (t) { html += '<div class="pl-s">' + j(t) + '</div>'; });
    html += '<div class="pl-i">' + j(L.i) + '</div>';
    d.innerHTML = html; return d;
  }
  var HEX = 'linear-gradient(rgba(3,3,3,.8),rgba(3,3,3,.8)),url("assets/pattern-honeycomb-seamless.svg")';   // Oct 22 (Scott): super dark, with a design: the brand honeycomb
  var STEEL = 'linear-gradient(115deg,rgba(255,255,255,.035) 0%,rgba(255,255,255,0) 30%,rgba(255,255,255,.02) 55%,rgba(255,255,255,0) 78%),' +   // Oct 22 (Scott): very black, with a faint brushed grain
    'repeating-linear-gradient(0deg,rgba(255,255,255,.012) 0px,rgba(255,255,255,.012) 1px,rgba(0,0,0,0) 1px,rgba(0,0,0,0) 3px),' +
    'linear-gradient(180deg,#070707 0%,#020202 60%,#060606 100%)';
  function fitOne(b) {   // every headline on one line: shrink it only as much as it needs
    var h = b.querySelector('.pl-h'); if (!h || !h.offsetWidth) return;
    var w = h.clientWidth; if (h.__w === w && h.scrollWidth <= w + 1) return; h.__w = w;   // also re-fit when a late font makes it overflow
    h.style.removeProperty('font-size'); h.style.setProperty('white-space', 'nowrap', 'important');
    var fs = parseFloat(getComputedStyle(h).fontSize), need = h.scrollWidth;
    if (need > w) h.style.setProperty('font-size', Math.floor(fs * w / need * 0.98) + 'px', 'important');
  }
  function paint(b) {   // inline, so the cream and red desktop page rules can't clear the black box
    var hex = b.classList.contains('pl-k-home');
    if (b.__steel === (hex ? 3 : 2)) return; b.__steel = hex ? 3 : 2;
    b.style.setProperty('background-color', '#030303', 'important');
    b.style.setProperty('border', '3px solid #D4A24A', 'important'); b.style.setProperty('border-radius', '18px', 'important');   // the gold box, inline so no page rule can take it off
    b.style.setProperty('background-image', hex ? HEX : STEEL, 'important');
    if (hex) { b.style.setProperty('background-size', '100% 100%, 33px auto', 'important'); b.style.setProperty('background-repeat', 'no-repeat, repeat', 'important'); b.style.setProperty('background-position', 'center top, center top', 'important'); }
  }
  function fit(b, a) {
    paint(b);   // phone and home: same width as the box above it; desktop mushroom pages: a centered 1100px box under the wide photo
    if (innerWidth >= 768 && !b.classList.contains('pl-k-home')) { if (b.style.maxWidth !== '1100px') { b.style.maxWidth = '1100px'; b.style.width = 'calc(100% - 40px)'; b.style.marginLeft = 'auto'; b.style.marginRight = 'auto'; } return; }
    var cs = getComputedStyle(a), w = a.offsetWidth + 'px';
    if (b.style.maxWidth !== w) { b.style.maxWidth = w; b.style.width = '100%'; b.style.marginLeft = cs.marginLeft === '0px' && a.parentNode && getComputedStyle(a.parentNode).display !== 'flex' ? 'auto' : cs.marginLeft; b.style.marginRight = b.style.marginLeft === 'auto' ? 'auto' : cs.marginRight; }
  }
  function vis(e) { return e && e.offsetHeight > 0; }
  function place(k, anchor) {
    if (!anchor || !anchor.parentNode) return;
    var nx = anchor.nextElementSibling;
    if (nx && nx.classList && nx.classList.contains('pl-k-' + k)) { fit(nx, anchor); return; }
    [].forEach.call(document.querySelectorAll('.pl-k-' + k), function (o) { if (o.parentNode === anchor.parentNode) o.remove(); });
    var b = box(k); anchor.parentNode.insertBefore(b, anchor.nextSibling); fit(b, anchor);
    [].forEach.call(document.querySelectorAll('.pl-k-' + k), function (o) { if (o !== b && o.previousElementSibling === null) o.remove(); });
  }
  function homeAnchor() {
    var p = [].filter.call(document.querySelectorAll('.sq-para'), vis)[0]; if (!p) return null;
    for (var x = p; x && x !== document.body; x = x.parentElement) {
      var cs = getComputedStyle(x);
      if (parseFloat(cs.borderTopWidth) >= 1.5 && x.offsetWidth > 280) return x;
    }
    return null;
  }
  function run() {
    // home, desktop: the box goes inside the row under the paragraph (the packets photo and the three mushrooms),
    // spanning the full row at the top. Another script always keeps the paragraph right before that row, so
    // putting the box between them made the two fight and the box jumped above and below (Oct 22, Scott).
    var rl = [].filter.call(document.querySelectorAll('[data-m="rl-list"]'), vis)[0];
    var grid = null; for (var x = rl; x && x !== document.body; x = x.parentElement) { if (getComputedStyle(x).display === 'grid') { grid = x; break; } }
    if (innerWidth >= 768 && grid) {
      var hb = grid.querySelector(':scope > .pl-k-home');
      if (!hb) { [].forEach.call(document.querySelectorAll('.pl-k-home'), function (o) { o.remove(); }); hb = box('home'); grid.insertBefore(hb, grid.firstChild); }
      paint(hb); hb.style.setProperty('grid-column', '1 / -1', 'important'); hb.style.setProperty('order', '-5', 'important');
      hb.style.setProperty('max-width', 'none', 'important'); hb.style.setProperty('width', 'auto', 'important'); hb.style.setProperty('margin', '0 0 24px', 'important');
    } else if (innerWidth < 768) {
      // phone: right above the slot machines, so people read what we make before they play (Oct 22, Scott)
      var g = document.querySelector('.hg');
      if (g && g.parentNode) {
        var pv0 = g.previousElementSibling, hb0 = pv0 && pv0.classList && pv0.classList.contains('pl-k-home') ? pv0 : null;
        if (!hb0) { [].forEach.call(document.querySelectorAll('.pl-k-home'), function (o) { o.remove(); }); hb0 = box('home'); g.parentNode.insertBefore(hb0, g); }
        fit(hb0, g); hb0.style.setProperty('margin-bottom', '16px', 'important'); hb0.style.setProperty('display', 'block', 'important');
      } else { var h = rl || homeAnchor(); if (h) place('home', h); }
    }
    [['lm', 'lm-hero'], ['cd', 'cdh-hero'], ['tt', 'tth-hero']].forEach(function (a) {
      var e = [].filter.call(document.querySelectorAll('[data-m="' + a[1] + '"]'), vis)[0];
      if (e) place(a[0], e);
    });
    [].forEach.call(document.querySelectorAll('.pl-box'), function (b) { if (vis(b)) fitOne(b); });
    // Lion's Mane top photo: BRAIN HORSEPOWER where FOR YOUR NOGGIN was (Oct 22, Scott)
    [].forEach.call(document.querySelectorAll('[data-m="lm-hero"] *'), function (e) { if (e.children.length === 0 && /^\s*FOR YOUR NOGGIN\s*$/i.test(e.textContent)) e.textContent = 'BRAIN HORSEPOWER'; });
    // a box left behind by a re-render sits next to nothing: drop it
    [].forEach.call(document.querySelectorAll('.pl-box'), function (b) {
      if (b.classList.contains('pl-k-home') && innerWidth >= 768) return;   // desktop home box lives inside the row
      if (b.classList.contains('pl-k-home') && b.nextElementSibling && b.nextElementSibling.classList.contains('hg')) return;   // phone: sits above the game
      var pv = b.previousElementSibling; if (!pv) { b.remove(); return; }
      var want = (pv && vis(pv)) ? 'block' : 'none';
      if (b.style.getPropertyValue('display') !== want) b.style.setProperty('display', want, 'important');
    });
  }
  setInterval(run, 1000); run(); addEventListener('resize', run);
})();
