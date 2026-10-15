/* Oct 15: PHONE ONLY. Shorter pages. Any run of boxes stacked one under another becomes a single
   row you swipe left and right, with "SWIPE FOR MORE" above it. Cards are wide and close to square,
   and a photo fills the whole card (no photo on top with black underneath). Carousel arrows are gone.
   Prose, the hero, the footer, the About story and the How To Use steps are left alone. */
(function () {
  var MQ = window.matchMedia('(max-width:767px)');
  var css = document.createElement('style'); css.id = 'phone-swipe-css';
  css.textContent =
    '.rit-arrow{display:none !important}' +
    '@media (max-width:767px){' +
    'html body .rcx-swipe.rcx-swipe{display:flex !important;flex-direction:row !important;flex-wrap:nowrap !important;overflow-x:auto !important;overflow-y:hidden !important;' +
      'scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;gap:12px !important;padding:4px 6vw 12px !important;margin-left:0 !important;margin-right:0 !important;' +
      'grid-template-columns:none !important;scrollbar-width:none;max-width:none !important;width:auto !important;box-sizing:border-box}' +
    'html body .rcx-swipe.rcx-swipe::-webkit-scrollbar{display:none}' +
    'html body .rcx-swipe.rcx-swipe>*{flex:0 0 88vw !important;width:88vw !important;max-width:88vw !important;min-height:80vw !important;padding:22px 20px !important;margin:0 !important;' +
      'scroll-snap-align:center;box-sizing:border-box !important;display:flex !important;flex-direction:column !important;justify-content:center !important}' +
    'html body .cx-track>*{min-height:0}' +
    'html body .rcx-swipe.rcx-swipe>* p,html body .rcx-swipe.rcx-swipe>* li{font-size:15px !important;line-height:1.5 !important}' +
    'html body .rcx-swipe.rcx-swipe>* h2,html body .rcx-swipe.rcx-swipe>* h3{margin-bottom:10px !important}' +
    '.rcx-swipe-tag{font-family:"Bebas Neue",sans-serif;letter-spacing:.2em;font-size:14px;color:#D4A24A;text-align:center;margin:6px 0 8px;pointer-events:none}' +
    '}';
  document.head.appendChild(css);

  var SKIP = 'footer,header,nav,form,[data-m="hero"],[data-m="steps"],.ab-grid,.mx-wrap,[data-m="why-invest"],[data-m="lm-burn"],.rcx-swipe,.cx-track,[data-tts-skip]';
  function isBox(c) {
    var cs = getComputedStyle(c);
    if (/^(P|H1|H2|H3|H4|H5|H6|SPAN|LI|UL|OL|BR|IMG)$/.test(c.tagName)) return false;
    return parseFloat(cs.borderTopWidth) >= 1 || parseFloat(cs.borderTopLeftRadius) >= 8 || /url\(/.test(cs.backgroundImage) || /^(ARTICLE|A|BUTTON)$/.test(c.tagName);
  }
  function convert() {
    if (!MQ.matches) return;
    var root = document.getElementById('dc-root') || document.body, vw = innerWidth;
    var all = root.querySelectorAll('div,section,ul');
    for (var i = all.length - 1; i >= 0; i--) {
      var el = all[i];
      if (el.classList.contains('rcx-swipe') || el.hasAttribute('data-noswipe') || el.closest(SKIP) || el.querySelector('.rcx-swipe')) continue;
      var ch = [].filter.call(el.children, function (c) {
        if (c.classList.contains('rcx-swipe-tag')) return false;
        var r = c.getBoundingClientRect(), cs = getComputedStyle(c);
        return r.height > 140 && r.width > vw * 0.6 && cs.display !== 'none' && cs.position !== 'absolute' && cs.position !== 'fixed' && (c.innerText || '').trim().length > 15;
      });
      if (ch.length < 2 || ch.length !== [].filter.call(el.children, function (c) { return !c.classList.contains('rcx-swipe-tag') && getComputedStyle(c).display !== 'none'; }).length) continue;
      if (!ch.every(isBox)) continue;
      var rs = ch.map(function (c) { return c.getBoundingClientRect(); }), ok = true, tot = 0;
      for (var k = 0; k < rs.length; k++) { tot += rs[k].height; if (k && rs[k].top < rs[k - 1].bottom - 5) ok = false; }
      if (!ok || tot < 450) continue;
      el.classList.add('rcx-swipe');
      var tall = ch.some(function (c) { return c.getBoundingClientRect().height > c.getBoundingClientRect().width * 1.6; });
      if (tall) { el.classList.remove('rcx-swipe'); el.setAttribute('data-noswipe', '1'); continue; }   // text too long to make a near square card: leave it stacked
      if (!(el.previousElementSibling && el.previousElementSibling.classList.contains('rcx-swipe-tag'))) {
        var t = document.createElement('div'); t.className = 'rcx-swipe-tag'; t.textContent = 'SWIPE FOR MORE ›';
        el.parentNode.insertBefore(t, el);
      }
    }
    fill(root);
  }
  // a photo fills the whole card: swap "photo on top, black underneath" for an even shade over the full photo
  function fill(root) {
    var cards = root.querySelectorAll('.rcx-swipe>*,.cx-track>*');
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i], bg = getComputedStyle(c).backgroundImage;
      if (c.dataset.rcxFill === bg) continue;
      var m = bg.match(/url\([^)]*\)/g);
      if (!m || !/linear-gradient/.test(bg) || !/0\.9\d?\)/.test(bg)) { c.dataset.rcxFill = bg; continue; }
      var nb = 'linear-gradient(rgba(0,0,0,.42),rgba(0,0,0,.42) 35%,rgba(0,0,0,.72) 100%),' + m[m.length - 1];
      c.style.setProperty('background-image', nb, 'important');
      c.style.setProperty('background-size', 'cover', 'important');
      c.style.setProperty('background-position', 'center', 'important');
      c.style.setProperty('background-repeat', 'no-repeat', 'important');
      c.dataset.rcxFill = getComputedStyle(c).backgroundImage;
    }
  }
  var pend = 0;
  function soon() { if (pend) return; pend = setTimeout(function () { pend = 0; convert(); }, 400); }
  new MutationObserver(soon).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('load', soon); setTimeout(soon, 1500); setTimeout(soon, 4000);
  if (MQ.addEventListener) MQ.addEventListener('change', soon);
})();
