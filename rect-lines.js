/* Oct 29 2026 (Scott): the three home headline lines form one rectangle. Each line gets the font size that makes it exactly as wide as the block,
   so the middle line (the longest) is smaller than the lines above and below it. Phone: the h1 in the mobile landing. Desktop: the .pl-h box.
   Widths come from an off-screen copy at 100px, so the word-by-word shine on the page never throws the measurement off. */
(function () {
  var dcss = document.createElement('style');   // Oct 30 (Scott): a short gold dash left of the first word and right of the last word of the top line
  dcss.textContent = 'html body .mland-box h1 span[data-rl]:first-child,html body .pl-k-home .pl-ph:first-child{position:relative;width:max-content !important;max-width:none !important;margin-left:auto !important;margin-right:auto !important}' +
    'html body .mland-box h1 span[data-rl]:first-child::before,html body .mland-box h1 span[data-rl]:first-child::after,html body .pl-k-home .pl-ph:first-child::before,html body .pl-k-home .pl-ph:first-child::after{content:"";position:absolute;top:52%;width:22px;height:2px;background:#D4A24A}' +
    'html body .mland-box h1 span[data-rl]:first-child::before,html body .pl-k-home .pl-ph:first-child::before{right:100%;margin-right:8px}' +
    'html body .mland-box h1 span[data-rl]:first-child::after,html body .pl-k-home .pl-ph:first-child::after{left:100%;margin-left:8px}' +
    '@media (min-width:768px){html body .pl-k-home .pl-ph:first-child::before,html body .pl-k-home .pl-ph:first-child::after{width:44px;height:3px;margin-left:16px;margin-right:16px}}';
  document.head.appendChild(dcss);
  var SEL = '.mland-box h1, .pl-k-home .pl-h', meas = null;
  function width100(el, text, ratio) {
    var cs = getComputedStyle(el);
    if (!meas) { meas = document.createElement('span'); document.body.appendChild(meas); }
    meas.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;font-family:' + cs.fontFamily + ';font-weight:' + cs.fontWeight + ';font-style:' + cs.fontStyle + ';letter-spacing:' + ratio + 'em;text-transform:' + cs.textTransform + ';font-size:100px';
    meas.textContent = text;
    var w = meas.getBoundingClientRect().width;
    return w;
  }
  function fit(box, isPh) {
    var ls = [].slice.call(box.children).filter(function (c) { return c.tagName === 'SPAN'; });
    if (ls.length < 2) return;
    var W = Math.round(0.8 * Math.min(box.clientWidth - 2, isPh ? 9999 : 980)); if (W <= 0) return;   // Oct 29 (Scott): the whole block is 20% smaller
    var bs = getComputedStyle(box), ratio = parseFloat(bs.letterSpacing) / parseFloat(bs.fontSize); if (!isFinite(ratio)) ratio = .05;   // the box's letter spacing as a fraction of its size
    var fs = ls.map(function (l) { var w = width100(l, l.textContent.replace(/\s+/g, ' ').trim(), ratio); return w > 0 ? W * 100 / w : 0; });
    ls.forEach(function (l, i) {
      if (!fs[i]) return;
      l.style.setProperty('display', 'block', 'important'); l.style.setProperty('white-space', 'nowrap', 'important');
      l.style.setProperty('font-size', fs[i].toFixed(2) + 'px', 'important'); l.style.setProperty('line-height', '1.12', 'important');
      l.style.setProperty('letter-spacing', ratio + 'em', 'important');
    });
  }
  function run() {
    [].forEach.call(document.querySelectorAll(SEL), function (b) {
      if (!b.offsetWidth) return;
      var isPh = b.tagName === 'H1';
      if (isPh && !b.querySelector('[data-rl]') && b.querySelector('br')) { b.innerHTML = b.innerHTML.split(/<br[^>]*>/).map(function (t) { return '<span data-rl>' + t + '</span>'; }).join(''); }
      fit(b, isPh);
    });
  }
  setInterval(run, 500); run();
  addEventListener('resize', run);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
})();
