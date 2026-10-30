/* Oct 29 2026 (Scott): the gold headers down the website get a short gold dash on the left and right, like the lines on the packaging.
   Only centered one-line gold Bebas headers qualify, and only when there is room for the dashes. The middle line of the home headline
   gets its dashes outside the line (see the css), so the rectangle of three lines stays exact. */
(function () {
  var css = document.createElement('style');
  css.textContent = [
    'html body .gd::before,html body .gd::after{content:"";display:inline-block;width:1.5em;height:2px;background:#D4A24A;vertical-align:middle;position:relative;top:-.06em}',
    'html body .gd::before{margin-right:.7em}html body .gd::after{margin-left:.7em}',
    'html body .hg .hg-title,html body .hg-press,html body .hg-meet{display:flex !important;align-items:center;justify-content:center;gap:12px}',
    'html body .hg .hg-title::before,html body .hg .hg-title::after,html body .hg-press::before,html body .hg-press::after,html body .hg-meet::before,html body .hg-meet::after{content:"";flex:0 0 auto;width:28px;height:2px;background:#D4A24A;position:relative;top:-.04em}',
    '@media (max-width:600px){html body .hg .hg-title,html body .hg-press,html body .hg-meet{font-size:29px !important;gap:10px}html body .hg .hg-title::before,html body .hg .hg-title::after,html body .hg-press::before,html body .hg-press::after,html body .hg-meet::before,html body .hg-meet::after{width:22px}}',
  ].join('\n');
  document.head.appendChild(css);
  var SKIP = 'header,nav,button,a,label,input,textarea,[data-tts-skip],.mx-tabs,.rcx-marble,.hg-t,.hg-flow,.hg-shop,[data-rcx-rotator],.hg-title,.hg-press,.hg-meet,.mland-box,.pl-h';
  function scan() {
    [].forEach.call(document.querySelectorAll('p,h1,h2,h3,div,span'), function (e) {
      if (e.__gd !== undefined) return;
      if (!e.offsetWidth || e.children.length > 1) return;
      var t = (e.textContent || '').trim(); if (t.length < 3 || t.length > 48) return;
      if (e.closest(SKIP)) return;
      var cs = getComputedStyle(e);
      if (cs.color !== 'rgb(212, 162, 74)' || !/Bebas/i.test(cs.fontFamily) || cs.textAlign !== 'center' || parseFloat(cs.fontSize) < 14) { if (e.offsetHeight) e.__gd = false; return; }
      if (!/^(block|flex|grid|list-item)$/.test(cs.display) && e.tagName === 'SPAN') return;
      e.classList.add('gd'); e.__gd = true;
      if (e.scrollWidth > e.clientWidth + 1 || e.getBoundingClientRect().height > parseFloat(cs.lineHeight || 99) * 1.9) { e.classList.remove('gd'); e.__gd = false; }
    });
  }
  setInterval(scan, 1500); scan();
})();
