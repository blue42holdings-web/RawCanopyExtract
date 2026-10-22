/* Oct 22 2026 (Scott): new edgier lines for LuAnne's phase two review. One gold box per page:
   home under the brand paragraph, each mushroom page right under its top photo. Desktop and phone. */
(function () {
  var NB = ' ';
  function j(s) { return s.replace(/ (\S+)$/, NB + '$1'); } // keep the last two words together
  var LINES = {
    home: { h: 'Caffeine free. Nutrient rich. No fillers.', s: ['A clean, single ingredient nootropic for your morning cup.'], i: 'For the chronic stress of a world that won’t slow down.' },
    lm: { h: 'Brain Horsepower', s: ['Fuel for the mind. Sustained focus. No jitter.', 'Chronic stress. Constant noise. Real support.*'], i: 'Inspired by the neuroscience on lion’s mane.' },
    cd: { h: 'Pre workout. No crash.', s: ['No caffeine. No sugar spike. Sustained energy for the whole workout.*'], i: 'For the days the couch is winning.' },
    tt: { h: 'Keeps things moving.', s: ['Supports healthy digestion. Keeps you regular.*'], i: 'Built for a world of processed food.' }
  };
  function box(k) {
    var L = LINES[k], d = document.createElement('section');
    d.className = 'pl-box pl-hero pl-k-' + k;   // 'hero' in the class keeps mush-short.js from hiding it; it sorts right after the top photo 
    var html = '<div class="pl-h">' + L.h.split(/(?<=\.) /).map(function (t) { return '<span class="pl-ph">' + t + '</span>'; }).join(' ') + '</div>';   // headline only breaks between phrases
    L.s.forEach(function (t) { html += '<div class="pl-s">' + j(t) + '</div>'; });
    html += '<div class="pl-i">' + j(L.i) + '</div>';
    d.innerHTML = html; return d;
  }
  function paint(b) {   // inline, so the cream and red desktop page rules can't clear the black box
    if (b.style.getPropertyValue('background-color') !== 'rgb(11, 11, 11)') { b.style.setProperty('background-color', '#0b0b0b', 'important'); b.style.setProperty('background-image', 'none', 'important'); }
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
    var h = homeAnchor(); if (h) place('home', h);
    [['lm', 'lm-hero'], ['cd', 'cdh-hero'], ['tt', 'tth-hero']].forEach(function (a) {
      var e = [].filter.call(document.querySelectorAll('[data-m="' + a[1] + '"]'), vis)[0];
      if (e) place(a[0], e);
    });
    // a box left behind by a re-render sits next to nothing: drop it
    [].forEach.call(document.querySelectorAll('.pl-box'), function (b) {
      var pv = b.previousElementSibling; if (!pv) { b.remove(); return; }
      var want = (pv && vis(pv)) ? 'block' : 'none';
      if (b.style.getPropertyValue('display') !== want) b.style.setProperty('display', want, 'important');
    });
  }
  setInterval(run, 1000); run(); addEventListener('resize', run);
})();
