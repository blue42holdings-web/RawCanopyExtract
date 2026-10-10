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
      box.style.setProperty('background', 'transparent', 'important');
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
      if (e.hasAttribute('data-sd-hero')) return;
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
    if (cfg.key === 'lm') bg = 'linear-gradient(#000 0,#000 ' + (sEnd - 200) + 'px,' + WHITE + ' ' + (sEnd + 40) + 'px,' + WHITE + ' 100%)';
    else if (cfg.key === 'cd') bg = 'linear-gradient(#000 0,#000 ' + h1 + 'px,' + RED + ' ' + (h1 + 120) + 'px,' + RED + ' ' + (sEnd - 200) + 'px,' + WHITE + ' ' + (sEnd + 40) + 'px,' + WHITE + ' 100%)';
    else bg = 'linear-gradient(#000 0,#000 ' + h1 + 'px,' + OLIVE + ' ' + (h1 + 120) + 'px,' + OLIVE + ' ' + (sTop + 40) + 'px,#141414 ' + (sTop + 160) + 'px,#141414 ' + (sEnd - 60) + 'px,' + RED + ' ' + (sEnd + 160) + 'px,' + RED + ' 100%)';
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
      W.style.setProperty('background', 'linear-gradient(rgba(0,0,0,.5) 0,rgba(0,0,0,.42) 900px,rgba(36,66,94,0) 1500px),linear-gradient(transparent 0,transparent 1100px,' + BLUE + ' 1650px,' + BLUE + ' 100%),url("assets/photo/why-sunrise.webp") 50% 500px/100% auto no-repeat,' + BLUE, 'important');
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
      hero.style.setProperty('background', 'linear-gradient(rgba(0,0,0,.38),rgba(0,0,0,.5)),url("assets/photo/why-tent.jpg") center 45%/cover no-repeat', 'important');
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
        var dk = function (o) { mb.style.setProperty('background', 'linear-gradient(rgba(0,0,0,' + o + '),rgba(0,0,0,' + (o + 0.08) + ')),url("assets/photo/beach-fire-moka.jpg") center 30%/cover no-repeat', 'important'); };
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
      W.style.setProperty('background',
        'linear-gradient(#F1ECE1 0,#F1ECE1 ' + (rt - 260) + 'px,rgba(241,236,225,0) ' + (rt + 10) + 'px,rgba(0,0,0,0) ' + (rt + 760) + 'px,' + SAND + ' ' + (rt + 1100) + 'px,' + SAND + ' 100%),' +
        'linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url("assets/photo/receipts-beach-camp.jpg") 50% ' + (rt - 260) + 'px/100% auto no-repeat,' + SAND, 'important');
      W.style.setProperty('background-size', '100% 100%,100% 100%,100% auto', 'important');
      W.style.setProperty('background-position', '0 0,0 0,50% ' + (rt - 260) + 'px', 'important');
      W.style.setProperty('background-repeat', 'no-repeat', 'important');
      // everything between the hero and the lab report guide sits on the white
      var n = hero.nextElementSibling;
      while (n && n !== read) { n.style.setProperty('background', 'transparent', 'important'); n.querySelectorAll(':scope > section').forEach(function (x) { x.style.setProperty('background', 'transparent', 'important'); }); n = n.nextElementSibling; }
      [read].concat([].slice.call(W.querySelectorAll('[data-m="rc-files"],[data-m="rc-dodges"],[data-m="rc-research"]'))).forEach(function (x) { x.style.setProperty('background', 'transparent', 'important'); });
      // climber hero, same as the Shop top
      hero.style.setProperty('position', 'relative', 'important'); hero.style.setProperty('overflow', 'hidden', 'important');
      hero.style.setProperty('background', '#000', 'important');
      if (!hero.querySelector('[data-rc-climb]')) {
        var bg = document.createElement('div'); bg.setAttribute('data-rc-climb', 'bg');
        bg.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none;background:url("assets/photo/coffee-asset.webp") 86% 58%/cover no-repeat;transform-origin:50% 58%;transform:scaleX(-1);animation:shopPush 16s cubic-bezier(.25,.1,.25,1) .3s forwards,shopRock 16s ease-out .3s forwards';
        var cut = document.createElement('div'); cut.setAttribute('data-rc-climb', 'cut');
        cut.style.cssText = 'position:absolute;inset:0;z-index:1;pointer-events:none;background:url("assets/cutouts/coffee-asset-cutout.webp") 86% 58%/cover no-repeat;transform-origin:50% 58%;transform:scaleX(-1);filter:brightness(.45);animation:shopClimber 14s cubic-bezier(.25,.1,.25,1) 1.3s forwards';
        var fade = document.createElement('div'); fade.setAttribute('data-rc-climb', 'fade');
        fade.style.cssText = 'position:absolute;left:0;right:0;bottom:0;height:200px;z-index:1;pointer-events:none;background:linear-gradient(rgba(241,236,225,0),#F1ECE1)';
        hero.insertBefore(fade, hero.firstChild); hero.insertBefore(cut, hero.firstChild); hero.insertBefore(bg, hero.firstChild);
        [].forEach.call(hero.children, function (c) { if (!c.hasAttribute('data-rc-climb')) { c.style.position = c.style.position || 'relative'; c.style.zIndex = '2'; } });
      }
      var intro = hero.querySelector('[data-m="rc-intro"]');
      var ih = intro ? intro.getBoundingClientRect().top - hero.getBoundingClientRect().top : hero.offsetHeight;
      hero.querySelectorAll('[data-rc-climb="bg"],[data-rc-climb="cut"]').forEach(function (l) { l.style.bottom = 'auto'; l.style.height = (ih + 20) + 'px'; });
      var fd = hero.querySelector('[data-rc-climb="fade"]'); if (fd) { fd.style.bottom = 'auto'; fd.style.top = Math.max(0, ih - 170) + 'px'; fd.style.height = '200px'; }
      hero.style.setProperty('background', 'linear-gradient(#000 0,#000 ' + ih + 'px,#F1ECE1 ' + ih + 'px)', 'important');
    });
  }
  setInterval(run, 700); run();
})();
