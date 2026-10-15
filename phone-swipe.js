/* Oct 15: PHONE ONLY. Shorter pages. Any run of boxes stacked one under another becomes a single
   row you swipe left and right, with "SWIPE FOR MORE" above it. Cards are wide and close to square,
   and a photo fills the whole card (no photo on top with black underneath). Carousel arrows are gone.
   Prose, the hero, the footer, the About story and the How To Use steps are left alone. */
(function () {
  var MQ = window.matchMedia('(max-width:767px)');
  var css = document.createElement('style'); css.id = 'phone-swipe-css';
  css.textContent =
    '.rit-arrow{display:none !important}' +
    '.rcx-sec-row{display:contents}' +
    'html body .rcx-filled.rcx-filled.rcx-filled.rcx-filled.rcx-filled.rcx-filled.rcx-filled{background-size:100% 100%,var(--fsz,cover) !important;background-position:0 0,var(--fps,center) !important;background-repeat:no-repeat !important}' +
    '.rcx-arrbar{display:flex;align-items:center;justify-content:center;gap:18px;margin:0 0 14px;font-family:"Bebas Neue",sans-serif;letter-spacing:.22em;font-size:16px;color:#D4A24A}' +
    '.rcx-arrbar button{width:44px;height:44px;border-radius:50%;border:2px solid #D4A24A;background:#0b0b0b;color:#E8B860;font-size:26px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0 0 3px}' +
    '.rcx-arrbar button:hover{background:#D4A24A;color:#111}' +
    '[data-screen-label="Receipts"] .rcx-arrbar{color:#9A6A1E}' +
    '@media (max-width:767px){.rcx-arrbar{display:none !important}}' +
    '@media (max-width:767px){.rcx-click-tag{display:none !important}' +
      'html body .mx-wrap .mx-grid.mx-grid.mx-grid{grid-template-rows:none !important;grid-auto-rows:auto !important;align-items:stretch !important;grid-auto-columns:80vw !important;grid-template-columns:none !important}' +
      'html body .mx-wrap .mx-grid.mx-grid.mx-grid>.mx-box.mx-box{width:80vw !important;max-width:80vw !important;height:auto !important;min-height:80vw !important}' +   /* Oct 15: closer to square */
    '}' +   /* desktop: the wrapper does nothing */
    '@media (max-width:767px){' +
      'html body .rcx-merge.rcx-sec-row.rcx-sec-row{align-items:stretch !important;background:#000 !important;padding:6px 7vw 28px !important}' +
      'html body .rcx-merge.rcx-sec-row.rcx-sec-row>section{display:block !important;flex:0 0 86vw !important;width:86vw !important;max-width:86vw !important;min-height:0 !important;margin:0 !important;padding:0 !important;border-radius:18px !important;overflow:hidden !important;border:0 !important;display:flex !important;flex-direction:column !important;scroll-snap-align:center;box-sizing:border-box !important;-webkit-mask-image:none !important;mask-image:none !important}' +
      'html body .rcx-merge.rcx-sec-row.rcx-sec-row>section *{max-width:100% !important}' +
      'html body .rcx-merge.rcx-sec-row.rcx-sec-row>section>div{margin:0 !important;flex:1 1 auto !important;width:100% !important;box-sizing:border-box !important}' +
      'html body .rcx-swipe-tag.rcx-has-t{background:#000 !important;margin:0 !important;padding:22px 0 10px !important}' +
    '}' +
    '.rcx-swipe-tag .rcx-row-t{display:block;font-size:22px;letter-spacing:.18em;color:#F1ECE1;margin-bottom:6px}' +
    '@media (max-width:767px){html body .rit-nav.rit-nav{display:none !important}}' +   /* one label style everywhere: ours */
    '@media (max-width:767px){' +
    'html body .rcx-swipe.rcx-swipe{display:flex !important;flex-direction:row !important;flex-wrap:nowrap !important;overflow-x:auto !important;overflow-y:hidden !important;' +
      'scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;gap:12px !important;padding:4px 6vw 12px !important;margin-left:0 !important;margin-right:0 !important;' +
      'grid-template-columns:none !important;scrollbar-width:none;max-width:none !important;width:auto !important;box-sizing:border-box}' +
    'html body .rcx-swipe.rcx-swipe::-webkit-scrollbar{display:none}' +
    'html body .rcx-swipe.rcx-swipe>*{flex:0 0 82vw !important;width:82vw !important;max-width:82vw !important;min-height:80vw !important;padding:22px 20px !important;margin:0 !important;' +
      'scroll-snap-align:center;box-sizing:border-box !important;display:flex !important;flex-direction:column !important;justify-content:center !important}' +
    'html body .cx-track>*{min-height:0}' +
    'html body .rcx-swipe.rcx-swipe>* p,html body .rcx-swipe.rcx-swipe>* li{font-size:15px !important;line-height:1.5 !important}' +
    'html body .rcx-swipe.rcx-swipe>* h2,html body .rcx-swipe.rcx-swipe>* h3{margin-bottom:10px !important}' +
    '.rcx-swipe-tag{display:block !important;flex:0 0 100% !important;grid-column:1/-1 !important;align-self:stretch !important;max-width:none !important;font-family:"Bebas Neue",sans-serif;letter-spacing:.22em;font-size:15px;line-height:1.2;color:#E8B860;text-align:center !important;margin:14px auto 10px !important;width:100%;pointer-events:none;text-shadow:0 1px 6px rgba(0,0,0,.6)}' +
    '.rcx-swipe-tag b{display:inline-block;font-weight:400;animation:rcxSwArr 1.8s ease-in-out infinite}' +
    '@keyframes rcxSwArr{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}' +
    /* Oct 15: two short rows of cards become one row (e.g. Home: 3 + 2 = 5) */
    'html body .rcx-merge.rcx-merge{display:flex !important;flex-direction:row !important;flex-wrap:nowrap !important;overflow-x:auto !important;overflow-y:hidden !important;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;gap:12px !important;padding:4px 6vw 12px !important;scrollbar-width:none;box-sizing:border-box}' +
    'html body .rcx-merge.rcx-merge::-webkit-scrollbar{display:none}' +
    'html body .rcx-merge.rcx-merge:not(.rcx-sec-row)>*{display:contents !important}' +
    'html body .rcx-merge.rcx-merge>.rcx-swipe-tag{display:none !important}' +
    'html body .rcx-merge.rcx-merge:not(.rcx-sec-row)>*>*{flex:0 0 80vw !important;width:80vw !important;max-width:80vw !important;min-height:80vw !important;margin:0 !important;scroll-snap-align:center;box-sizing:border-box !important}' +
    '}';
  document.head.appendChild(css);

  var SKIP = '.rcx-merge,footer,header,nav,form,[data-m="hero"],[data-m="steps"],.ab-grid,.mx-wrap,[data-m="why-invest"],[data-m="lm-burn"],.rcx-swipe,.cx-track,[data-tts-skip]';
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
      var tall = ch.some(function (c) { return c.getBoundingClientRect().height > c.getBoundingClientRect().width * 2; });
      if (tall) { el.classList.remove('rcx-swipe'); el.setAttribute('data-noswipe', '1'); continue; }   // text too long to make a near square card: leave it stacked
      if (!(el.previousElementSibling && el.previousElementSibling.classList.contains('rcx-swipe-tag'))) {
        el.parentNode.insertBefore(mkTag(), el); wrapParent(el.parentNode);
      }
    }
    label(root);
    fill(root);
    tighten(root);
  }
  // Oct 15 (Scott): no big empty gaps between boxes on the phone. Big top and bottom padding is cut down;
  // bands that show a photo keep a little more so the photo and its fade still read.
  function tighten(root) {
    var vw = innerWidth, all = root.querySelectorAll('section,div,ul,aside');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.hasAttribute('data-tight')) continue;
      var r = el.getBoundingClientRect(); if (!r.height || r.width < vw * 0.9) continue;
      if (r.top + scrollY < 640 || el.closest('header,nav,.rcx-swipe,.rcx-merge,.cx-track,[data-m="hero"]')) continue;
      var cs = getComputedStyle(el), photo = /url\(/.test(cs.backgroundImage), cap = photo ? 72 : 34;
      var pt = parseFloat(cs.paddingTop), pb = parseFloat(cs.paddingBottom), mt = parseFloat(cs.marginTop), mb = parseFloat(cs.marginBottom);
      if (pt > cap + 8) el.style.setProperty('padding-top', cap + 'px', 'important');
      if (pb > cap + 8) el.style.setProperty('padding-bottom', cap + 'px', 'important');
      if (mt > 40) el.style.setProperty('margin-top', '20px', 'important');
      if (mb > 40) el.style.setProperty('margin-bottom', '20px', 'important');
      if (!el.children.length && !(el.textContent || '').trim() && !photo && r.height > 50 && cs.position !== 'absolute' && cs.position !== 'fixed') el.style.setProperty('height', '24px', 'important');   // empty spacer
      el.setAttribute('data-tight', '');
    }
  }
  function wrapParent(par) {   // a label inside a side-by-side flex row would get squeezed to the left; let it sit on its own line
    var c = getComputedStyle(par);
    if (/flex/.test(c.display) && !/column/.test(c.flexDirection) && c.flexWrap === 'nowrap' && !par.classList.contains('rcx-swipe')) par.style.setProperty('flex-wrap', 'wrap', 'important');
  }
  function mkTag() { var t = document.createElement('div'); t.className = 'rcx-swipe-tag'; t.innerHTML = 'SWIPE FOR MORE <b>›</b>'; t.style.setProperty('display', 'block', 'important'); return t; }
  // every row that moves sideways says so, centered, right above it
  function label(root) {
    var all = root.querySelectorAll('div,section,ul');
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.closest('header,nav,.rcx-merge>*') ) continue;
      var cs = getComputedStyle(el);
      if (cs.overflowX !== 'auto' && cs.overflowX !== 'scroll') continue;
      if (el.scrollWidth <= el.clientWidth + 30 || el.clientHeight < 100) continue;
      var p = el.previousElementSibling;
      while (p && (p.classList.contains('rit-nav') || (getComputedStyle(p).display === 'none' && !p.classList.contains('rcx-swipe-tag')))) p = p.previousElementSibling;
      if (p && p.classList.contains('rcx-swipe-tag')) continue;
      var tg = mkTag();
      if (el.getAttribute('data-row-title')) { tg.innerHTML = '<span class="rcx-row-t">' + el.getAttribute('data-row-title') + '</span>' + tg.innerHTML; tg.classList.add('rcx-has-t'); }
      el.parentNode.insertBefore(tg, el);
      wrapParent(el.parentNode);
    }
  }
  // a photo fills the whole card: swap "photo on top, black underneath" for an even shade over the full photo
  function fill(root) {
    var cards = root.querySelectorAll('.rcx-swipe>*,.cx-track>*,.rcx-merge>*>*,.mx-grid>*,.rit-grid>*,.mx-box,.sr-grid>*,.rc-grid3>*');
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i], bg = getComputedStyle(c).backgroundImage;
      if (c.dataset.rcxFill === bg) continue;
      var m = bg.match(/url\([^)]*\)/g);
      if (!m || !/linear-gradient/.test(bg) || !/(0\.(8[5-9]|9\d*)\)|rgb\(0, 0, 0\))/.test(bg)) { c.dataset.rcxFill = bg; continue; }   // Oct 15: no black in a box, ever
      var nb = 'linear-gradient(rgba(0,0,0,.42),rgba(0,0,0,.42) 35%,rgba(0,0,0,.72) 100%),' + m[m.length - 1];
      // keep the photo's own zoom and framing (the trail rider, the cutout lifts line up with it); only fall back to
      // cover when the photo would not reach the bottom of the box
      var cs = getComputedStyle(c), sz = cs.backgroundSize.split(','), ps = cs.backgroundPosition.split(',');
      var psz = (sz[sz.length - 1] || 'cover').trim(), pps = (ps[ps.length - 1] || 'center').trim();
      c.style.setProperty('background-image', nb, 'important');
      c.style.setProperty('--fsz', psz); c.style.setProperty('--fps', pps); c.classList.add('rcx-filled');   // size and framing through a class, so page rules can still adjust them
      if (psz !== 'cover') coverCheck(c, m[m.length - 1], psz, pps);
      c.dataset.rcxFill = getComputedStyle(c).backgroundImage;
    }
  }
  function coverCheck(c, u, psz, pps) {
    var src = u.replace(/^url\(["']?/, '').replace(/["']?\)$/, ''), im = new Image();
    im.onload = function () {
      var r = c.getBoundingClientRect(), W = r.width, H = r.height, iw = im.naturalWidth, ih = im.naturalHeight, w, h;
      var a = psz.split(/\s+/);
      if (psz === 'contain') { var k = Math.min(W / iw, H / ih); w = iw * k; h = ih * k; }
      else { w = /%$/.test(a[0]) ? W * parseFloat(a[0]) / 100 : a[0] === 'auto' ? null : parseFloat(a[0]);
             h = a[1] && a[1] !== 'auto' ? (/%$/.test(a[1]) ? H * parseFloat(a[1]) / 100 : parseFloat(a[1])) : null;
             if (w == null && h == null) { w = iw; h = ih; } else if (h == null) h = w * ih / iw; else if (w == null) w = h * iw / ih; }
      if (w < W - 1 || h < H - 1) c.style.setProperty('--fsz', 'cover');
    };
    im.src = src;
  }
  var pend = 0;
  function soon() { if (pend) return; pend = setTimeout(function () { pend = 0; convert(); if (!MQ.matches) desk(); }, 400); }
  setInterval(function () { if (!MQ.matches) soon(); }, 2000);
  // desktop: photos fill their whole box, and the Home mushroom boxes say they can be clicked
  function desk() {
    fill(document);
    var gs = document.querySelectorAll('.mx-grid');
    for (var i = 0; i < gs.length; i++) {
      var g = gs[i]; if (!g.getBoundingClientRect().height || !g.querySelector('a.mx-box')) continue;
      var p = g.previousElementSibling; if (p && p.classList.contains('rcx-click-tag')) continue;
      var t = document.createElement('div'); t.className = 'rcx-click-tag'; t.textContent = 'CLICK ANY BOX FOR MORE INFO';
      g.parentNode.insertBefore(t, g);
    }
    // Cordyceps (Oct 15): the ballpark photo runs behind everything from under the top box down to the story box
    var cw = document.querySelector('div[data-screen-label="Cordyceps"]');
    if (cw && cw.getBoundingClientRect().height) {
      var hero = cw.querySelector('section[data-m="cdh-hero"]'), sb = cw.querySelector('section[data-m="sbox"]');
      if (hero && sb) {
        var bg = cw.querySelector(':scope > [data-rcx-cdbg]');
        if (!bg) { bg = document.createElement('div'); bg.setAttribute('data-rcx-cdbg', ''); bg.setAttribute('aria-hidden', 'true'); cw.insertBefore(bg, cw.firstChild); if (getComputedStyle(cw).position === 'static') cw.style.position = 'relative'; }
        var wr = cw.getBoundingClientRect(), t = hero.getBoundingClientRect().bottom - wr.top + 10, b = sb.getBoundingClientRect().top - wr.top;
        bg.style.top = Math.round(t) + 'px'; bg.style.height = Math.max(0, Math.round(b - t)) + 'px';
      }
    }
    // rows you click through left and right (Oct 15): an arrow bar sits right above the row
    var rows = document.querySelectorAll('[data-m="rc-read"] .rc-grid3,[data-screen-label="Shop"] [data-m="1col"],[data-desk-row]');
    for (var j = 0; j < rows.length; j++) arrows(rows[j]);
  }
  // Oct 15: Read Aloud sits in the top left corner of every page's top box on desktop
  var HEROES = '[data-screen-label="Shop"]>section:first-child,div[data-screen-label="Receipts"]>section:first-of-type,section[data-m="mush-hero"],div[data-screen-label="Why One Ingredient"]>section:first-of-type,section[data-m="how-top"],section[data-m="about-hero"],section[data-m="lm-hero"],section[data-m="cdh-hero"],section[data-m="tth-hero"]';
  function readAloud() {
    var hs = document.querySelectorAll(HEROES);
    for (var i = 0; i < hs.length; i++) {
      var h = hs[i], r = h.getBoundingClientRect(); if (!r.height) continue;
      var b = h.querySelector('div[data-tts-skip] button[aria-label]'); if (!b) continue;
      var d = b.closest('div[data-tts-skip]'); d.setAttribute('data-rcx-ra', '');
      var cs = getComputedStyle(h), bl = parseFloat(cs.borderLeftWidth) || 0, bt = parseFloat(cs.borderTopWidth) || 0;
      var tx = r.left + bl + 22, ty = r.top + bt + 20;
      if (h.matches('div[data-screen-label="Receipts"]>section')) { tx = r.left + 8 + 3 + 22; ty = r.top + 8 + 3 + 20; }
      for (var pass = 0; pass < 2; pass++) {   // place it, measure where it landed, correct
        var q = d.getBoundingClientRect(), L = parseFloat(d.style.left) || 0, T = parseFloat(d.style.top) || 0;
        if (Math.abs(q.left - tx) > 1) d.style.setProperty('left', Math.round(L + tx - q.left) + 'px', 'important');
        if (Math.abs(q.top - ty) > 1) d.style.setProperty('top', Math.round(T + ty - q.top) + 'px', 'important');
      }
    }
  }
  // (Oct 15) placement is done by the Read Aloud script in site-extras.js; readAloud() kept for reference
  function arrows(row) {
    if (!row.getBoundingClientRect().height || row.scrollWidth <= row.clientWidth + 20) return;
    var p = row.previousElementSibling; if (p && p.classList.contains('rcx-arrbar')) return;
    var bar = document.createElement('div'); bar.className = 'rcx-arrbar';
    bar.innerHTML = '<button type="button" aria-label="Previous">&#8249;</button><span>CLICK FOR MORE</span><button type="button" aria-label="Next">&#8250;</button>';
    var bs = bar.querySelectorAll('button');
    function go(d) {
      var k = row.children[0], step = k ? k.getBoundingClientRect().width + 18 : row.clientWidth;
      var max = row.scrollWidth - row.clientWidth;
      if (d > 0 && row.scrollLeft >= max - 4) row.scrollTo({ left: 0, behavior: 'smooth' });
      else if (d < 0 && row.scrollLeft <= 4) row.scrollTo({ left: max, behavior: 'smooth' });
      else row.scrollBy({ left: d * step, behavior: 'smooth' });
    }
    bs[0].addEventListener('click', function (e) { e.preventDefault(); go(-1); });
    bs[1].addEventListener('click', function (e) { e.preventDefault(); go(1); });
    if (!MQ.matches) bar.style.setProperty('display', 'flex', 'important');
    row.parentNode.insertBefore(bar, row);
  }
  new MutationObserver(soon).observe(document.documentElement, { childList: true, subtree: true });
  addEventListener('load', soon); setTimeout(soon, 1500); setTimeout(soon, 4000);
  if (MQ.addEventListener) MQ.addEventListener('change', soon);
})();
