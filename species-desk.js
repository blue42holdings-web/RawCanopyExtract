/* Desktop layout for the three mushroom pages (Oct 10).
   - The top mushroom photo runs down behind the "What it is" box (box photo removed, words glow so they read).
   - Background images behind the rows are removed; each page gets plain color behind the boxes:
     Lion's Mane: black to the story band, then white.  Cordyceps: red, then white under the story band.
     Turkey Tail: olive green down through the numbers, then red after the story band.
   - Rows sit close together; the three file boxes match in size. */
(function () {
  var MQ = matchMedia('(min-width:768px)');
  var PAGES = {
    "Lion's Mane": { key: 'lm' },
    'Cordyceps': { key: 'cd' },
    'Turkey Tail': { key: 'tt' }
  };
  var RED = '#5c1319', OLIVE = '#3a4524', WHITE = '#F1ECE1';

  function top(el, C) { return el.getBoundingClientRect().top - C.getBoundingClientRect().top; }

  function apply(C, cfg) {
    var hero = C.querySelector('section[data-m$="-hero"]'); if (!hero) return;
    var what = hero.nextElementSibling;
    while (what && (what.offsetHeight < 40 || !what.querySelector('[data-ph]'))) what = what.nextElementSibling;
    if (!what) return;
    var box = what.querySelector('[data-ph]');
    // hero photo: read it once, before our styles clear it
    if (!C.__sdImg) {
      [hero].concat([].slice.call(hero.querySelectorAll('div'))).forEach(function (d) {
        var m = getComputedStyle(d).backgroundImage.match(/url\("?([^")]+)"?\)/);
        if (m && /assets\/photo\//.test(m[1]) && !C.__sdImg) C.__sdImg = m[1];
      });
      if (!C.__sdImg) return;
    }
    var img = C.__sdImg;
    C.classList.add('sd-on', 'sd-' + cfg.key);
    hero.querySelectorAll('div').forEach(function (d) {
      var cs = getComputedStyle(d);
      if (/assets\/photo\//.test(cs.backgroundImage)) d.style.visibility = 'hidden';
      else if (cs.backgroundColor === 'rgb(0, 0, 0)' && d.offsetHeight < 60 && !d.querySelector('button,a')) d.style.setProperty('background', 'transparent', 'important');
    });
    hero.style.setProperty('box-shadow', 'none', 'important');
    what.style.setProperty('box-shadow', 'none', 'important');
    if (box) {
      box.classList.add('sd-what');
      if (!box.parentElement.classList.contains('rcx-row2')) box.style.setProperty('background', 'transparent', 'important'); else box.style.removeProperty('background');   // Oct 15: in the side by side row it keeps its own photo
      box.style.setProperty('box-shadow', 'none', 'important');
      box.querySelectorAll(':scope > div').forEach(function (d) { if (/url\(/.test(getComputedStyle(d).backgroundImage) || d.children.length === 0) d.style.setProperty('background', 'transparent', 'important'); });
    }
    var ov = C.querySelector(':scope > [data-sd-hero]');
    if (!ov) { ov = document.createElement('div'); ov.setAttribute('data-sd-hero', ''); ov.setAttribute('aria-hidden', 'true'); C.insertBefore(ov, C.firstChild); }
    var h0 = top(hero, C), h1 = top(what, C) + what.offsetHeight;
    var fadeTo = cfg.key === 'lm' ? '#000' : cfg.key === 'cd' ? RED : OLIVE;
    ov.style.cssText = 'position:absolute;left:0;right:0;top:' + h0 + 'px;height:' + (h1 - h0 + 160) + 'px;z-index:0;pointer-events:none;' +
      'background:linear-gradient(rgba(0,0,0,.5) 0,rgba(0,0,0,.38) 40%,rgba(0,0,0,.55) calc(100% - 260px),' + fadeTo + ' 100%),url("' + img + '") center 30%/cover no-repeat';
    // strip every background photo that is not inside a content box, and close the gaps
    C.querySelectorAll('*').forEach(function (e) {
      if (e.hasAttribute('data-sd-hero') || e.hasAttribute('data-rcx-burn') || e.hasAttribute('data-rcx-boxph') || e.closest('.rcx-row2,.cb-in')) return;
      var host = e.closest('[data-ph],section[data-m="sbox"],section[data-m$="-hero"],.cx,.mx-box,.mx-wrap,article,a,button');
      if (host && !(host === e && e.tagName === 'SECTION' && e.querySelector('[data-ph]'))) return;
      var cs = getComputedStyle(e), bb = getComputedStyle(e, '::before'), ba = getComputedStyle(e, '::after');
      if (/assets\/photo\//.test(cs.backgroundImage)) { e.style.setProperty('background-image', 'none', 'important'); e.style.setProperty('background-color', 'transparent', 'important'); }
      if (/assets\/photo\//.test(bb.backgroundImage) || /assets\/photo\//.test(ba.backgroundImage)) e.classList.add('sd-nopseudo');
      if (e.getAttribute('data-m') === 'bgstack' || (e.getAttribute('aria-hidden') === 'true' && e.querySelector('img'))) e.style.setProperty('display', 'none', 'important');
      if ((e.tagName === 'SECTION' || e.parentElement === C) && !e.querySelector('section[data-m="sbox"]')) { e.style.setProperty('min-height', '0', 'important'); }
      if (e.tagName === 'SECTION' && e.querySelector(':scope > [data-ph]')) { e.style.setProperty('padding-top', '10px', 'important'); e.style.setProperty('padding-bottom', '10px', 'important'); e.style.setProperty('display', 'block', 'important'); }
    });
    C.querySelectorAll('section > [data-ph]').forEach(function (bx) {
      if (bx.closest('section[data-m="sbox"],section[data-m$="-hero"]')) return;
      bx.style.setProperty('max-width', '1080px', 'important'); bx.style.setProperty('width', 'auto', 'important');
      bx.style.setProperty('margin', '0 auto', 'important'); bx.style.setProperty('min-height', '0', 'important');
      bx.querySelectorAll(':scope > div').forEach(function (d) { if (!d.children.length) d.style.setProperty('display', 'none', 'important'); });
    });
    if (cfg.key === 'tt') { var ot = C.querySelector('section > [data-ph="red-hanging-lab"]'); if (ot) ot.style.setProperty('background', 'linear-gradient(rgba(24,24,24,.92),rgba(24,24,24,.94))', 'important'); }
    // page color behind everything else
    var sbox = C.querySelector(':scope > section[data-m="sbox"]');
    var sTop = sbox ? top(sbox, C) : C.offsetHeight, sEnd = sbox ? sTop + sbox.offsetHeight : C.offsetHeight;
    var bg;
    // Oct 15 (Scott): Lion's Mane white below The Steady Burn; Cordyceps red; Turkey Tail red base with white and red sections
    // Oct 15 (later): one color under the top box, no black band. Lion's Mane white, Cordyceps and Turkey Tail red.
    var hEnd = h0 + hero.offsetHeight;
    // Oct 15 (late, Scott): no white on Lion's Mane. The Roar of the Mountain Shasta photo runs up behind the first two boxes,
    // and the beach photo sits behind the rest of the page.
    if (cfg.key === 'lm') {   // Oct 15 (late, Scott): Shasta, darkened evenly, down to the email box; a short slate blue band behind the numbers heading; then his beach photo to the bottom
      var LW = C.offsetWidth, inp = C.querySelector('section[data-m="sbox"] input'), num = C.querySelector('[data-m="num-lm"]');
      var shEnd = inp ? Math.round(top(inp, C) + 90) : sEnd, bStart = num ? Math.round(top(num, C) + 230) : shEnd + 300, TH = C.offsetHeight, rest = Math.max(400, TH - bStart);
      var shH = Math.round(LW * 2000 / 1500), shY = Math.round(shEnd - shH);
      var bw = Math.max(LW, Math.round(rest * 2000 / 1500)), bh = Math.round(bw * 1500 / 2000), bx = Math.round((LW - bw) / 2);
      bg = 'linear-gradient(#000 0,#000 ' + hEnd + 'px,rgba(0,0,0,.5) ' + (hEnd + 1) + 'px,rgba(0,0,0,.5) 100%),' +
        'linear-gradient(transparent 0,transparent ' + (shEnd - 50) + 'px,#24425e ' + shEnd + 'px,#24425e ' + bStart + 'px,transparent ' + (bStart + 60) + 'px,transparent 100%),' +
        'url("assets/photo/own-cannon-beach.jpg") ' + bx + 'px ' + bStart + 'px/' + bw + 'px ' + bh + 'px no-repeat,' +
        'url("assets/photo/own-shasta-peak.jpg") center ' + shY + 'px/' + LW + 'px ' + shH + 'px no-repeat,#24425e';
    }
    else if (cfg.key === 'tt') bg = 'linear-gradient(#000 0,#000 ' + hEnd + 'px,' + WHITE + ' ' + (hEnd + 1) + 'px,' + WHITE + ' ' + sTop + 'px,' + RED + ' ' + (sTop + 1) + 'px,' + RED + ' 100%)';   // Oct 15 (late): white above Coming Soon, red below
    else if (cfg.key === 'cd') bg = 'linear-gradient(#000 0,#000 ' + hEnd + 'px,' + RED + ' ' + (hEnd + 1) + 'px,' + RED + ' 100%)';
    else if (false) bg = 'linear-gradient(#000 0,#000 ' + h1 + 'px,' + RED + ' ' + (h1 + 120) + 'px,' + RED + ' ' + (sEnd - 200) + 'px,' + WHITE + ' ' + (sEnd + 40) + 'px,' + WHITE + ' 100%)';
    else bg = 'linear-gradient(#000 0,#000 ' + h1 + 'px,' + OLIVE + ' ' + (h1 + 120) + 'px,' + OLIVE + ' ' + (sTop + 40) + 'px,#141414 ' + (sTop + 160) + 'px,#141414 ' + (sEnd - 60) + 'px,' + RED + ' ' + (sEnd + 160) + 'px,' + RED + ' 100%)';
    var mt = C.querySelector(':scope > [data-sd-metal]');
    if (cfg.key !== 'lm') {
      var r0 = cfg.key === 'cd' ? h1 + 40 : sEnd - 40, r1 = cfg.key === 'cd' ? sEnd : C.offsetHeight;
      if (!mt) { mt = document.createElement('div'); mt.setAttribute('data-sd-metal', ''); mt.setAttribute('aria-hidden', 'true'); C.insertBefore(mt, C.firstChild); }
      C.style.isolation = 'isolate';
      mt.style.cssText = 'position:absolute;left:0;right:0;top:' + r0 + 'px;height:' + Math.max(0, r1 - r0) + 'px;z-index:-1;pointer-events:none;background:' + window.__rcxMetal + ';-webkit-mask-image:linear-gradient(transparent 0,#000 220px,#000 calc(100% - 220px),transparent 100%);mask-image:linear-gradient(transparent 0,#000 220px,#000 calc(100% - 220px),transparent 100%)';
    } else if (mt) mt.remove();
    C.style.setProperty('background', bg, 'important');
  }

  function off(C) {
    if (!C.classList.contains('sd-on')) return;
    C.classList.remove('sd-on', 'sd-lm', 'sd-cd', 'sd-tt');
    var ov = C.querySelector(':scope > [data-sd-hero]'); if (ov) ov.remove();
    C.style.removeProperty('background');
    C.querySelectorAll('section[data-m$="-hero"] div').forEach(function (d) { d.style.visibility = ''; });
  }

  function run() {
    Object.keys(PAGES).forEach(function (label) {
      document.querySelectorAll('div[data-screen-label="' + label + '"],div[data-screen-label="' + label.replace("'", "\\'") + '"]').forEach(function (C) {
        if (!C.querySelector('section[data-m$="-hero"]')) return;
        if (MQ.matches) apply(C, PAGES[label]); else off(C);
      });
    });
  }
  setInterval(run, 700); run();
})();

/* Desktop Why One Ingredient painter (Oct 10) */
(function () {
  var MQ = matchMedia('(min-width:768px)'), BLUE = '#24425e';
  function run() {
    if (!MQ.matches) return;
    document.querySelectorAll('div[data-screen-label="Why One Ingredient"]').forEach(function (W) {
      var hero = W.querySelector('section'); if (!hero || hero.getBoundingClientRect().height < 50) return;
      W.classList.add('sd-kill');
      // Oct 15 (late): the man with the mug sits behind the OURS card, lots of sunset sky above him,
      // the sunset red carries down to MAKE YOUR OWN BLEND, and the blue starts there.
      var wr = W.getBoundingClientRect(), ww = wr.width, oursEl = W.__ours, blendEl = W.__blend;
      if (!oursEl || !W.contains(oursEl)) { var o0 = [].filter.call(W.querySelectorAll('p,span,div'), function (e) { return /^OURS$/i.test(e.textContent.trim()) && !e.children.length; })[0]; oursEl = null; for (var q = o0, i = 0; q && i < 7; q = q.parentElement, i++) { if (parseFloat(getComputedStyle(q).borderTopWidth) > 1) { oursEl = q; break; } } W.__ours = oursEl; }
      if (!blendEl || !W.contains(blendEl)) { blendEl = [].filter.call(W.querySelectorAll('h2,h3'), function (e) { return /MAKE YOUR OWN BLEND/i.test(e.textContent); })[0]; W.__blend = blendEl; }
      var fx = ww * 0.8, fy = 1100, by = 2140;
      if (oursEl) { var orr = oursEl.getBoundingClientRect(); fx = orr.left - wr.left + orr.width / 2; fy = orr.top - wr.top + 110; }
      if (blendEl) by = blendEl.getBoundingClientRect().top - wr.top - 40;
      var S = Math.max(ww * 1.4, 1800), IH = S * 733 / 1100, ix = Math.round(Math.min(0, Math.max(ww - S, fx - 0.67 * S))), iy = Math.round(fy - 0.27 * IH), ib = iy + IH;
      var SKY = 'rgb(182,119,101)', RED = '#8e321f';
      var bgv = 'linear-gradient(rgba(0,0,0,.46) 0,rgba(0,0,0,.4) ' + (iy + 300) + 'px,rgba(0,0,0,.3) ' + (ib - 200) + 'px,rgba(0,0,0,0) ' + (ib + 40) + 'px),' +
        'linear-gradient(transparent 0,transparent ' + (ib - 320) + 'px,' + BLUE + ' ' + (ib - 20) + 'px,' + BLUE + ' 100%),' +   // Oct 15 (late): the sunset fades straight into the blue, no red band
        'linear-gradient(rgb(58,34,56) 0,rgb(140,86,90) ' + Math.round(iy * 0.6) + 'px,' + SKY + ' ' + iy + 'px,rgba(182,119,101,0) ' + (iy + 140) + 'px) 0 0/100% ' + (iy + 140) + 'px no-repeat,' +
        'url("assets/photo/why-sunrise.webp") ' + ix + 'px ' + iy + 'px/' + Math.round(S) + 'px auto no-repeat,' + BLUE;
      if (W.__bgv !== bgv) { W.__bgv = bgv; W.style.setProperty('background', bgv, 'important'); }
      W.querySelectorAll('*').forEach(function (e) {
        if (e.closest('[data-ph],.mx-box,article,.cx,[data-m="wy-split"] > *,[data-m="prove-box"],a,button')) return;
        var r = e.getBoundingClientRect(); if (r.width < 1100) return;
        var cs = getComputedStyle(e);
        if (/url\(/.test(cs.backgroundImage) || /rgba\(0, 0, 0, 0\.[5-9]/.test(cs.backgroundImage) || cs.backgroundColor === 'rgb(0, 0, 0)') { e.style.setProperty('background', 'transparent', 'important'); }
        e.classList.add('sd-kill');
      });
      // one gold box around the whole top, photo shown once
      hero.style.setProperty('margin', '14px 14px 0', 'important');
      hero.style.setProperty('border', '3px solid #D4A24A', 'important');
      hero.style.setProperty('border-radius', '22px', 'important');
      hero.style.setProperty('overflow', 'hidden', 'important');
      hero.style.setProperty('background', 'linear-gradient(rgba(0,0,0,var(--whk,.3)),rgba(0,0,0,calc(var(--whk,.3) + .12))),url("assets/photo/why-tent.jpg") center 68%/cover no-repeat', 'important');
      // Oct 15 (late, Scott): a background photo: she starts dark (still in color), slowly comes up, and lifts on as a cutout
      if (!hero.__whk) {
        hero.__whk = 1;
        hero.setAttribute('data-lift-bg', 'assets/cutouts/why-tent-cutout.webp'); hero.setAttribute('data-lift-desktop', '');
        hero.setAttribute('data-lift-dim', 'brightness(.92) saturate(1.05)'); hero.setAttribute('data-lift-scale', '1.06'); hero.setAttribute('data-lift-origin', '0.75 0.85');
        hero.setAttribute('data-lift-dur', '8000'); hero.setAttribute('data-lift-delay', '1500'); hero.setAttribute('data-lift-d-delay', '1500'); hero.setAttribute('data-lift-fade', '2500'); hero.setAttribute('data-lift-nomask', '');
      }
      // she starts dark (still in color) every time the page opens, then slowly comes up
      var vis = hero.getBoundingClientRect().height > 0;
      if (vis && !hero.__whkOn) {
        hero.__whkOn = 1;
        hero.style.setProperty('transition', 'none', 'important'); hero.style.setProperty('--whk', '.82'); void hero.offsetWidth;
        hero.style.setProperty('transition', '--whk 7s ease-in-out', 'important');
        setTimeout(function () { hero.style.setProperty('--whk', '.55'); }, 700);
      }
      if (!vis) hero.__whkOn = 0;
      hero.querySelectorAll('div').forEach(function (d) {
        if (d.contains(hero.querySelector('h1')) || /url\(/.test(getComputedStyle(d).backgroundImage)) {
          d.style.setProperty('background', 'transparent', 'important');
          d.style.setProperty('border', '0', 'important'); d.style.setProperty('box-shadow', 'none', 'important');
        }
      });
      // the More research section that follows the page: blue fading to black
      var mr = W.parentElement && W.parentElement.querySelector('[data-m="more-research"]');
      if (!mr) { var n = W.nextElementSibling; while (n && !mr) { if (n.matches && n.matches('[data-m="more-research"]')) mr = n; else if (n.querySelector) mr = n.querySelector('[data-m="more-research"]'); n = n.nextElementSibling; } }
      if (mr) mr.style.setProperty('background', 'linear-gradient(' + BLUE + ' 0,' + BLUE + ' 55%,#000 100%)', 'important');
      var mb = mr && mr.querySelector(':scope > div');
      if (mb) {
        var dk = function (o) { mb.style.setProperty('background', 'linear-gradient(rgba(0,0,0,' + o + '),rgba(0,0,0,' + (o + 0.08) + ')),url("assets/photo/own-yellowstone.jpg") 50% 100%/cover no-repeat', 'important'); };
        if (!mb.__hv) { mb.__hv = 1; mb.style.transition = 'background .6s ease'; mb.addEventListener('mouseenter', function () { mb.__on = 1; dk(0.3); }); mb.addEventListener('mouseleave', function () { mb.__on = 0; dk(0.66); }); }
        if (!mb.__on) dk(0.66);
      }
    });
  }
  setInterval(run, 700); run();
})();

/* Desktop Receipts painter (Oct 10): climber top like Shop, white down to "How to read a lab report", then the beach that scrolls and blends into sand color */
(function () {
  var MQ = matchMedia('(min-width:768px)'), SAND = '#2a2520';
  function run() {
    if (!MQ.matches) return;
    document.querySelectorAll('div[data-screen-label="Receipts"]').forEach(function (W) {
      var hero = W.querySelector(':scope > section'), read = W.querySelector('[data-m="rc-read"]');
      if (!hero || !read || hero.getBoundingClientRect().height < 50) return;
      W.classList.add('sd-kill');
      var h1 = hero.offsetHeight, rt = read.getBoundingClientRect().top - W.getBoundingClientRect().top;
      W.style.setProperty('background', '#fff', 'important');   // Oct 15 (Scott): white all the way down, no beach camp photo
      // everything between the hero and the lab report guide sits on the white
      var n = hero.nextElementSibling;
      while (n && n !== read) { n.style.setProperty('background', 'transparent', 'important'); n.querySelectorAll(':scope > section').forEach(function (x) { x.style.setProperty('background', 'transparent', 'important'); }); n = n.nextElementSibling; }
      [read].concat([].slice.call(W.querySelectorAll('[data-m="rc-files"],[data-m="rc-dodges"],[data-m="rc-research"]'))).forEach(function (x) { x.style.setProperty('background', 'transparent', 'important'); });
      // Oct 15: the top is now a gold framed photo box drawn by the page styles (heroes2-oct15); nothing painted here
      hero.querySelectorAll('[data-rc-climb]').forEach(function (l) { l.remove(); });
      hero.style.setProperty('background', '#fff', 'important');
    });
  }
  setInterval(run, 700); run();
})();

/* Desktop FAQ tiles light up under the cursor; desktop black buttons get the wet slate look (Oct 10) */
(function () {
  var MQ = matchMedia('(min-width:768px) and (hover:hover)');
  var cur = null;
  document.addEventListener('mousemove', function (e) {
    if (!MQ.matches) return;
    var hit = null;
    document.querySelectorAll('[data-screen-label="FAQ"] [data-m="faq-tiles"] img,[data-screen-label="FAQ"] [data-m="faq-tiles2"] img').forEach(function (im) {
      var r = im.getBoundingClientRect();
      if (r.width && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) hit = im;
    });
    if (hit === cur) return;
    if (cur) cur.style.filter = cur.__f || '';
    cur = hit;
    if (cur) { if (cur.__f === undefined) cur.__f = cur.style.filter || ''; cur.style.transition = (cur.style.transition ? cur.style.transition + ',' : '') + 'filter .7s ease'; cur.style.filter = 'brightness(1.15) saturate(1.05)'; /* Oct 15: was 2.4, which washed the photo out */ }
  }, { passive: true });
  var SL = ['wet-slate.jpeg', 'slate-v1.jpg', 'slate-v2.jpg', 'slate-v3.jpg', 'slate-v4.jpg', 'slate-v5.jpg', 'slate-v6.jpg', 'slate-v7.jpg', 'slate-v8.jpg', 'roar-wet-slate.jpg'];
  var POS = ['20% 40%', '70% 60%', '40% 80%', '85% 25%', '10% 70%', '55% 35%', '30% 15%', '75% 85%', '50% 50%', '35% 65%'];
  var n = 0;
  function slate() {
    if (!matchMedia('(min-width:768px)').matches) return;
    document.querySelectorAll('main button, main a, main [role="button"], main [role="link"]').forEach(function (b) {
      if (b.__sl || b.closest('header,footer,nav,[data-m="player"],[data-ambient-btn],[data-m^="nav"]')) return;
      var cs = getComputedStyle(b), r = b.getBoundingClientRect();
      if (r.width < 34 || r.height < 30) return;
      if (cs.backgroundImage !== 'none') return;
      var m = cs.backgroundColor.match(/\d+(\.\d+)?/g); if (!m) return;
      var a = m.length > 3 ? +m[3] : 1;
      if (!(+m[0] < 30 && +m[1] < 30 && +m[2] < 30 && a > 0.5)) return;
      if (!/212, 162, 74|233, 192, 121/.test(cs.borderTopColor) || parseFloat(cs.borderTopWidth) < 1) return;
      var i = n++ % SL.length; b.__sl = 1;
      // Oct 15: through a class, so a hover color can still take over (an inline !important background blocked it)
      b.style.setProperty('--slbg', 'linear-gradient(rgba(3,3,3,.82),rgba(3,3,3,.82)),url("assets/photo/slate-blur-' + (i + 1) + '.jpg?v=2") ' + POS[i] + '/cover no-repeat');
      b.classList.add('rcx-slate');
    });
  }
  setInterval(slate, 1200); slate();
})();

/* Home More research box: its own photo, filling the box (Oct 10) */
(function () {
  function run() {
    var home = document.querySelector('[data-screen-label="Home — hero"]');
    if (!home || !home.getBoundingClientRect().height) return;
    document.querySelectorAll('[data-m="more-research"] > div').forEach(function (d) {
      if (!d.getBoundingClientRect().height) return;
      d.style.setProperty('background', 'linear-gradient(rgba(0,0,0,.62),rgba(0,0,0,.72)),url("assets/photo/summit-silhouette-climb.jpg") 50% 40%/cover no-repeat', 'important');
    });
  }
  setInterval(run, 900); run();
})();

/* Desktop home: the "what we do" box from the phone layout, placed under the seal (Oct 10) */
(function () {
  function run() {
    var desk = matchMedia('(min-width:768px)').matches;
    var ex = document.querySelector('[data-desk-para]');
    if (!desk) { if (ex) ex.remove(); return; }
    var pk = document.querySelector('[data-m="pk-dup"]'); if (!pk || !pk.getBoundingClientRect().height) return;
    var src = document.querySelector('[data-m="home-para"] p'); if (!src) return;
    var grid = pk.parentElement;
    if (ex && ex.nextElementSibling === grid) return;
    if (ex) ex.remove();
    var box = document.createElement('div'); box.setAttribute('data-desk-para', '');
    box.style.cssText = 'display:block;grid-template-columns:none;position:relative;overflow:hidden;isolation:isolate;max-width:1080px;margin:0 auto 34px;border:3px solid #D4A24A;border-radius:22px;box-shadow:0 10px 28px rgba(0,0,0,.65);padding:40px 56px;text-align:center;background:#0b1d22';
    var bg = document.createElement('div');
    bg.style.cssText = 'position:absolute;inset:-14px;z-index:-1;background:linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.62)),url("assets/photo/map-mug-camera.jpg") 50% 50%/cover no-repeat';
    var p = src.cloneNode(true);
    p.style.cssText = 'margin:0;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:30px;line-height:1.45;font-weight:500;color:#fff;text-wrap:balance;max-width:none;width:100%;text-align:center';
    p.querySelectorAll('span').forEach(function (s) { if (s.hasAttribute('data-plain')) { s.style.color = '#FFFFFF'; return; } s.style.color = '#D4A24A'; s.style.fontWeight = '600'; });
    box.style.setProperty('display', 'block', 'important');
    box.appendChild(bg); box.appendChild(p);
    grid.parentNode.insertBefore(box, grid);
  }
  setInterval(run, 900); run();
})();

/* Oct 15 (late): when the Why page closes, reset so the top photo fades up from dark again next time it opens */
setInterval(function () { document.querySelectorAll('div[data-screen-label="Why One Ingredient"] > section').forEach(function (s) { if (s.getBoundingClientRect().height < 50) s.__whkOn = 0; }); }, 400);
