/* Oct 15 (later): desktop mushroom pages. Boxes that were stacked one under another sit side by side:
   Lion's Mane What It Is + The Steady Burn; Turkey Tail What It Is, Where Ours Comes From, How It's Made,
   What's Been Studied; Turkey Tail Further Reading + The Names It Goes By. Desktop only. */
(function () {
  var MQ = matchMedia('(min-width:768px)');
  var GROUPS = {
    "Lion's Mane": [['[data-ph="elder-camp-chair-mug"]', '[data-rcx-burn]']],
    'Turkey Tail': [['[data-ph="meditation-sunset-hands"]', '[data-ph="palm-jungle-sun"]', '[data-ph="tank-lab"]', '[data-ph="reef-snorkel"]'],
                    ['[data-ph="waterfall-stones"]', '[data-ph="herb-jars-book"]']]
  };
  function page(label) { return [].filter.call(document.querySelectorAll('[data-screen-label]'), function (e) { return e.getAttribute('data-screen-label') === label && e.offsetHeight; })[0]; }
  function run() {
    if (!MQ.matches) return;
    var lm = page("Lion's Mane");
    if (lm) {
      var b = lm.querySelector('section[data-m="lm-burn"] > div'); if (b && !b.hasAttribute('data-rcx-burn')) b.setAttribute('data-rcx-burn', '');
      // other scripts strip these two boxes' backgrounds inline; put Scott's photos back the same way
      [[b, 'own-oregon-coast.jpg', 'center'], [lm.querySelector('[data-ph="elder-camp-chair-mug"]'), 'own-yosemite-domes.jpg', 'center 40%']].forEach(function (x) {
        if (!x[0] || !x[0].parentElement.classList.contains('rcx-row2')) return;
        var v = 'linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.6)),url("assets/photo/' + x[1] + '")';
        if (x[0].style.getPropertyValue('background-image').indexOf(x[1]) < 0) {
          x[0].style.setProperty('background-image', v, 'important'); x[0].style.setProperty('background-size', '100% 100%,cover', 'important');
          x[0].style.setProperty('background-position', '0 0,' + x[2], 'important'); x[0].style.setProperty('background-repeat', 'no-repeat', 'important');
        }
      });
    }
    ['Lion\'s Mane', 'Cordyceps', 'Turkey Tail'].forEach(function (L) {
      var w = page(L); if (!w) return;
      w.querySelectorAll('[data-ph],[data-m="cd-fbox"],[data-rcx-burn]').forEach(function (e) { e.classList.add('rcx-x'); });
      (GROUPS[L] || []).forEach(function (g) {
        var els = g.map(function (s) { return w.querySelector(s); });
        if (els.some(function (e) { return !e; }) || els[0].parentElement.classList.contains('rcx-row2')) return;
        var row = document.createElement('div'); row.className = 'rcx-row2'; row.setAttribute('data-n', String(els.length));
        var firstSec = els[0].closest('section') || els[0].parentElement;
        firstSec.parentNode.insertBefore(row, firstSec);
        els.forEach(function (e) {
          var sec = e.closest('section');
          row.appendChild(e);
          if (sec && !sec.querySelector('[data-ph],h2,h3,p,a,button')) sec.setAttribute('data-rcx-emptied', '');
        });
      });
    });
  }
  setInterval(run, 1000); run();
})();

/* Oct 15 (late): desktop How To Use. The four steps stack in one narrow gold column (like the phone),
   diving down one after another, with one of Scott's photos on each side. The four boxes below each get
   their own photo. */
(function () {
  var MQ = matchMedia('(min-width:900px)');
  var BOX = [['pineapple-smoothie.jpg', 'center 50%'], ['kettle-rocks-fire.jpg', 'center 50%'], ['kitchen-blender-greens.jpg', 'center 45%'], ['own-palm-sunset.jpg', 'center 62%']];
  function paint(e, f, pos, k) {
    var v = 'linear-gradient(rgba(0,0,0,' + k + '),rgba(0,0,0,' + (k + .1) + ')),url("assets/photo/' + f + '")';
    if (e.style.getPropertyValue('background-image') === v.replace(/"/g, '"')) return;
    if ((e.style.getPropertyValue('background-image') || '').indexOf(f) >= 0) return;
    e.style.setProperty('background-image', v, 'important'); e.style.setProperty('background-size', '100% 100%,cover', 'important');
    e.style.setProperty('background-position', '0 0,' + pos, 'important'); e.style.setProperty('background-repeat', 'no-repeat', 'important');
    e.style.setProperty('background-color', '#000', 'important');
  }
  function run() {
    if (!MQ.matches) return;
    var H = [].filter.call(document.querySelectorAll('[data-screen-label="How To Use"]'), function (e) { return e.offsetHeight; })[0]; if (!H) return;
    var sec = H.querySelector('[data-m="how-steps-sec"]'); if (!sec) return;
    if (!sec.querySelector('.rcx-howcol')) {
      var col = document.createElement('div'); col.className = 'rcx-howcol';
      ['[data-m="how-label"]', '[data-m="how-intro"]', '[data-m="steps"]'].forEach(function (q) { var e = sec.querySelector(':scope > ' + q); if (e) col.appendChild(e); });
      var L = document.createElement('div'); L.className = 'rcx-howside'; L.setAttribute('data-side', 'l'); L.setAttribute('aria-hidden', 'true');
      var R = L.cloneNode(); R.setAttribute('data-side', 'r');
      var g = document.createElement('div'); g.className = 'rcx-howgrid'; g.appendChild(L); g.appendChild(col); g.appendChild(R);
      sec.insertBefore(g, sec.firstChild);
      var st = col.querySelectorAll('[data-m="steps"] > div');
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('rcx-dive-on'); io.unobserve(x.target); } }); }, { threshold: 0.35 });
        [].forEach.call(st, function (d, i) { d.classList.add('rcx-dive'); d.style.setProperty('--dd', (i * 260) + 'ms'); io.observe(d); });
      }
    }
    var fb = H.querySelector('[data-fb="42"]'); if (!fb) return;
    if (fb.style.getPropertyValue('padding-bottom') !== '90px') fb.style.setProperty('padding-bottom', '90px', 'important');
    var boxes = [].filter.call(fb.children, function (e) { return e.classList.contains('hw-box') || e.classList.contains('cb-in'); });
    boxes.forEach(function (b, i) { if (BOX[i]) paint(b, BOX[i][0], BOX[i][1], .5); });
  }
  setInterval(run, 1000); run();
})();

/* Oct 15 (late): desktop photo framing that has to be set inline, because other scripts write these boxes inline.
   Home: the Clean No Mess cards and the Cordyceps four (same darkness, slowly moving forward).
   Receipts: File 01 kettle and File 02 tent. */
(function () {
  var MQ = matchMedia('(min-width:900px)'), G = 'linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.45) 35%,rgba(0,0,0,.7) 100%)';
  function urlOf(e) { var m = getComputedStyle(e).backgroundImage.match(/url\([^)]*\)/g); return m ? m[m.length - 1] : null; }
  function set(e, img, sz, pos) {
    var key = img + '|' + sz + '|' + pos; if (e.__rcxSet === key) return; e.__rcxSet = key;
    e.style.setProperty('background-image', img, 'important');
    e.style.setProperty('background-size', sz, 'important'); e.style.setProperty('background-position', pos, 'important');
    e.style.setProperty('background-repeat', 'no-repeat', 'important');
    var l = sz.split(','), p = pos.split(','); e.style.setProperty('--fsz', l[l.length - 1].trim()); e.style.setProperty('--fps', p[p.length - 1].trim());
  }
  function forward(e) {
    // one slow push in, using pixel sizes so it can animate (cover can't)
    if (e.__fwd || e.hasAttribute('data-lift-bg') || e.classList.contains('mx-lab')) return; var u = urlOf(e); if (!u) return; e.__fwd = 1;
    var im = new Image(); im.onload = function () {
      var r = e.getBoundingClientRect(), k = Math.max(r.width / im.naturalWidth, r.height / im.naturalHeight), w = Math.ceil(im.naturalWidth * k), h = Math.ceil(im.naturalHeight * k);
      var cs = getComputedStyle(e), ps = cs.backgroundPosition.split(','), pos = ps[ps.length - 1].trim();
      set(e, G + ',' + u, '100% 100%,' + w + 'px ' + h + 'px', '0 0,' + pos);
      e.style.setProperty('transition', 'background-size 11s cubic-bezier(.35,.1,.35,1),box-shadow 5s ease-in-out', 'important');
      var io = new IntersectionObserver(function (es) { if (!es[0].isIntersecting) return; io.disconnect();
        setTimeout(function () { e.__rcxSet = ''; set(e, G + ',' + u, '100% 100%,' + Math.ceil(w * 1.16) + 'px ' + Math.ceil(h * 1.16) + 'px', '0 0,' + pos); }, 600); }, { threshold: 0.3 });
      io.observe(e);
    }; im.src = u.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
  }
  function run() {
    if (!MQ.matches) return;
    // Home, Clean No Mess
    var home = document.querySelector('section[data-m="mx-rit"]');
    if (home && home.offsetHeight) {
      var a = home.querySelector('[data-show-mess]'); if (a && a.offsetHeight) set(a, G + ',url("assets/photo/mess-floor.jpg")', '100% 100%,auto 128%', '0 0,30% 85%');
      var d = home.querySelector('[data-rcx-dogs]'); if (d && d.offsetHeight) set(d, G + ',url("assets/photo/own-dogs-car.jpg")', '100% 100%,auto 132%', '0 0,82% 100%');
      var t = home.querySelector('[data-lift-bg*="a-rider-pausing"]');
      if (t && t.offsetHeight) set(t, 'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3) 40%,rgba(0,0,0,.75) 62%,#000 72%),url("assets/photo/a-rider-pausing-on-a-granite-ridge.webp")', '100% 100%,auto 70%', '0 0,100% 0');
      [].forEach.call(home.querySelectorAll('.rit-card'), function (c) { if (c === a || c === d || c === t || !c.offsetHeight) return; var u = urlOf(c); if (u) set(c, G + ',' + u, getComputedStyle(c).backgroundSize, getComputedStyle(c).backgroundPosition); });
    }
    // Home, Cordyceps four
    var q = document.querySelector('[data-rcx-cdq]');
    if (q && q.offsetHeight) {
      set(q, G + ',url("assets/photo/stock-outdoor-photo.jpg")', '100% 100%,cover', '0 0,12% 50%');
      [].forEach.call(q.parentElement.children, function (c) { if (c !== q && c.offsetHeight) forward(c); });
    }
    // Receipts files
    var f = document.querySelector('section[data-m="rc-files"]');
    if (f && f.offsetHeight) {
      [].forEach.call(f.querySelectorAll('.mx-box'), function (b) {
        var tag = (b.querySelector('.mx-tag') || {}).textContent || '';
        if (/FILE 01/.test(tag)) set(b, G + ',url("assets/photo/coffee-made-at-camp.jpg")', '100% 100%,auto 125%', '0 0,24% 82%');
        if (/FILE 02/.test(tag)) set(b, G + ',url("assets/photo/tent-dock-lake.jpg")', '100% 100%,auto 130%', '0 0,50% 95%');
      });
    }
  }
  setInterval(run, 1000); run();
})();

/* Oct 15 (late): desktop boxes found by their heading, given one real photo each (inline, so no page rule can turn them
   back into a flat tan or purple box). */
(function () {
  var MQ = matchMedia('(min-width:900px)'), G = 'linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.5) 40%,rgba(0,0,0,.72) 100%)';
  var MAP = {
    "Lion's Mane": [[/^NO SCOOP/, 'mess-floor.jpg', 'cover', 'center'], [/^THE KICKOFF/, 'lm-grandpa-kickoff.jpg', 'cover', 'center 30%'],
      [/^THE OTHER TWO/, 'lm-grandma-puzzle.jpg', 'cover', 'center 40%'], [/^THE LOT SHIPPING/, 'lm-grandpa-football-park.jpg', 'cover', 'center 35%'],
      [/^LAB REPORT . HUMAN TRIAL/, 'elder-camp-chair-mug.jpg', 'cover', 'center 35%'], [/^LAB REPORT . PUBMED/, 'parent-and-child-outdoors.jpg', 'cover', 'center 40%']],
    'Cordyceps': [[/^WHAT'S BEEN STUDIED/, null, 'auto 175%', '50% 92%'], [/^LAB REPORT/, 'own-river.jpg', 'cover', 'center 55%'],
      [/^GAME NIGHT/, 'why-ballfield-dusk-vignette-v2.jpg', 'cover', 'center'], [/^THE RIVER/, 'how-paddleboard-river.webp', 'cover', 'center'],
      [/^MEASURED/, 'mess-floor.jpg', 'cover', 'center'], [/^HOW TO TAKE IT/, 'cd-golf-coast.jpg', 'cover', 'center 60%'], [/^THE LOT SHIPPING/, 'cd-golf-coast.jpg', 'cover', 'center 60%']],
    'Turkey Tail': [[/^NO SCOOP|^NOTHING TO MEASURE|^PRE-MEASURED/, 'mess-floor.jpg', 'cover', 'center'], [/^HOW TO TAKE IT/, 'tt-airport-crowd.jpg', 'cover', 'center 40%'],
      [/^THE LOT SHIPPING/, 'tt-feet-in-line.jpg', 'cover', 'center 60%']]
  };
  function norm(t) { return t.replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim().toUpperCase(); }
  function boxFor(root, re) {
    var els = root.querySelectorAll('h2,h3,h4,.mx-tag,.cb-tag,.lab-tag,span,p');
    for (var i = 0; i < els.length; i++) {
      var e = els[i], t = norm(e.textContent); if (t.length > 70 || !re.test(t) || !e.offsetHeight) continue;
      for (var p = e, n = 0; p && p !== root && n < 7; p = p.parentElement, n++) { var c = getComputedStyle(p); if (parseFloat(c.borderTopWidth) > 1.5 && c.borderTopStyle !== 'none' && p.offsetWidth > 300) return p; }
    }
    return null;
  }
  function run() {
    if (!MQ.matches) return;
    // every mushroom page's pre-measured box sits on the powder mess
    [].forEach.call(document.querySelectorAll('section.clean-band[data-cb="lions-mane"] .cb-in,section.clean-band[data-cb="cordyceps"] .cb-in,section.clean-band[data-cb="turkey-tail"] .cb-in'), function (b) {
      if (!b.offsetHeight || (b.style.getPropertyValue('background-image') || '').indexOf('mess-floor') >= 0) return;
      b.style.setProperty('background-image', 'linear-gradient(rgba(0,0,0,.42),rgba(0,0,0,.58)),url("assets/photo/mess-floor.jpg")', 'important');
      b.style.setProperty('background-size', '100% 100%,cover', 'important'); b.style.setProperty('background-position', '0 0,center', 'important');
      b.style.setProperty('background-repeat', 'no-repeat', 'important'); b.style.setProperty('background-color', '#000', 'important');
      b.style.setProperty('border', '3px solid #D4A24A', 'important');
    });
    Object.keys(MAP).forEach(function (L) {
      var root = [].filter.call(document.querySelectorAll('[data-screen-label]'), function (e) { return e.getAttribute('data-screen-label') === L && e.offsetHeight; })[0]; if (!root) return;
      MAP[L].forEach(function (m) {
        var b = boxFor(root, m[0]); if (!b) return;
        var u = m[1] ? 'url("assets/photo/' + m[1] + '")' : (b.__rcxU || ((getComputedStyle(b).backgroundImage.match(/url\([^)]*\)/g) || []).pop()));
        if (!u) return; b.__rcxU = u;
        var key = u + m[2] + m[3]; if (b.__boxKey === key && (b.style.getPropertyValue('background-image') || '').indexOf('url') >= 0) return; b.__boxKey = key;
        b.style.setProperty('background-image', G + ',' + u, 'important'); b.style.setProperty('background-size', '100% 100%,' + m[2], 'important');
        b.style.setProperty('background-position', '0 0,' + m[3], 'important'); b.style.setProperty('background-repeat', 'no-repeat', 'important');
        b.style.setProperty('background-color', '#000', 'important'); b.style.setProperty('--fsz', m[2]); b.style.setProperty('--fps', m[3]);
        b.setAttribute('data-rcx-boxph', '');
      });
    });
    // one photo running down through two stacked boxes, so you can see what is going on in it
    var PAIRS = { "Lion's Mane": [[/^HOW IT'S MADE/, /^WHAT'S BEEN STUDIED/, 'lm-grandma-girl-puzzle.jpg', 612, 408], [/^FURTHER READING/, /^THE NAMES IT GOES BY/, 'lm-how-made-desk.jpg', 1200, 671]] };
    Object.keys(PAIRS).forEach(function (L) {
      var root = [].filter.call(document.querySelectorAll('[data-screen-label]'), function (e) { return e.getAttribute('data-screen-label') === L && e.offsetHeight; })[0]; if (!root) return;
      PAIRS[L].forEach(function (pr) {
        var a = boxFor(root, pr[0]), b = boxFor(root, pr[1]); if (!a || !b) return;
        var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(), W = Math.max(ra.width, rb.width), H = rb.bottom - ra.top;
        var k = Math.max(W / pr[3], H / pr[4]), iw = Math.ceil(pr[3] * k), ih = Math.ceil(pr[4] * k), x = Math.round((W - iw) / 2), y0 = Math.round((H - ih) / 2);
        [[a, y0], [b, y0 - (rb.top - ra.top)]].forEach(function (z) {
          var v = 'linear-gradient(rgba(0,0,0,.42),rgba(0,0,0,.55)),url("assets/photo/' + pr[2] + '")', key = v + iw + 'x' + ih + '@' + x + ',' + z[1];
          if (z[0].__pk === key && z[0].style.getPropertyValue('background-image')) return; z[0].__pk = key; z[0].setAttribute('data-rcx-boxph', '');
          z[0].style.setProperty('background-image', v, 'important'); z[0].style.setProperty('background-size', '100% 100%,' + iw + 'px ' + ih + 'px', 'important');
          z[0].style.setProperty('background-position', '0 0,' + x + 'px ' + z[1] + 'px', 'important'); z[0].style.setProperty('background-repeat', 'no-repeat', 'important');
          z[0].style.setProperty('background-color', '#000', 'important');
          [].forEach.call(z[0].querySelectorAll(':scope > div'), function (d) { if (!d.textContent.trim() && /url\(/.test(getComputedStyle(d).backgroundImage)) d.style.setProperty('display', 'none', 'important'); });
        });
      });
    });
  }
  setInterval(run, 1000); run();
})();

/* Oct 15 (late): Shop, desktop. The tennis players behind the products light up on their own: their cutout sits exactly
   on the photo, moves with it, and glows on in color (no second copy). */
(function () {
  var MQ = matchMedia('(min-width:768px)');
  function run() {
    if (!MQ.matches) return;
    var S = [].filter.call(document.querySelectorAll('[data-screen-label="Shop"]'), function (e) { return e.offsetHeight; })[0]; if (!S) return;
    var sec = S.querySelectorAll(':scope > section')[1]; if (!sec) return;
    var ps = getComputedStyle(sec, '::before'); if (!/shop-tennis-handshake/.test(ps.backgroundImage)) return;
    var d = sec.querySelector(':scope > .rcx-tcut');
    if (!d) { d = document.createElement('div'); d.className = 'rcx-tcut'; d.setAttribute('aria-hidden', 'true'); sec.insertBefore(d, sec.firstChild); }
    var g = [ps.top, ps.left, ps.width, ps.height].join('|');
    if (d.__g !== g) { d.__g = g; d.style.cssText = 'position:absolute;top:' + ps.top + ';left:' + ps.left + ';width:' + ps.width + ';height:' + ps.height + ';z-index:-1;pointer-events:none;background:url("assets/cutouts/shop-tennis-handshake-nobrand-cutout.webp") ' + ps.backgroundPosition.split(',').pop() + '/' + ps.backgroundSize.split(',').pop() + ' no-repeat;transform-origin:' + ps.transformOrigin + ';animation:rcxTennisFwd 30s ease-out .5s both,rcxTennisOn 6s ease-in-out 1.5s both;'; }
  }
  setInterval(run, 1200); run();
})();

/* Oct 15 (late): How To Use and The Mushrooms top photos start dark and come up every time the page opens */
(function () {
  function run() {
    ['div[data-m="how-hero"]', 'section[data-m="mush-hero"]'].forEach(function (q) {
      [].forEach.call(document.querySelectorAll(q), function (e) {
        var vis = e.getBoundingClientRect().height > 0;
        if (vis && !e.__hk) { e.__hk = 1; e.classList.add('rcx-hk0'); void e.offsetWidth; setTimeout(function () { e.classList.remove('rcx-hk0'); }, 500); }
        if (!vis) e.__hk = 0;
      });
    });
  }
  setInterval(run, 300); run();
})();


/* Oct 15 (late, Scott): Home, desktop. Every photo box starts a little darker (you can still see it) and comes up brighter
   as it comes into view. Stress And Age zoomed in a touch. Training Day framed on the players. */
(function () {
  var MQ = matchMedia('(min-width:900px)');
  function run() {
    if (!MQ.matches) return;
    var home = [].filter.call(document.querySelectorAll('.mx-wrap,.rit-grid'), function (e) { return e.offsetHeight; });
    home.forEach(function (w) {
      [].forEach.call(w.querySelectorAll('.mx-box,.rit-card'), function (b) {
        if (b.__lit || !b.offsetHeight || !/url\(/.test(getComputedStyle(b).backgroundImage)) return;
        b.__lit = 1;
        var base = getComputedStyle(b).boxShadow; base = base === 'none' ? '' : base + ',';
        b.style.setProperty('box-shadow', base + 'inset 0 0 0 3000px rgba(0,0,0,.34)', 'important');
        var tr = b.style.getPropertyValue('transition'); b.style.setProperty('transition', (tr ? tr + ',' : '') + 'box-shadow 5s ease-in-out', 'important');
        var io = new IntersectionObserver(function (es) { if (!es[0].isIntersecting) return; io.disconnect();
          setTimeout(function () { b.style.setProperty('box-shadow', base + 'inset 0 0 0 3000px rgba(0,0,0,0)', 'important'); }, 400); }, { threshold: 0.3 });
        io.observe(b);
      });
    });
    [].forEach.call(document.querySelectorAll('.mx-box'), function (b) {
      if (!b.offsetHeight) return; var t = (b.querySelector('.mx-tag') || {}).textContent || '';
      if (/STRESS AND AGE/i.test(t) && !b.__sa) { b.__sa = 1; var r = b.getBoundingClientRect(), k = Math.max(r.width / 612, r.height / 408) * 1.14;
        b.style.setProperty('background-size', '100% 100%,' + Math.ceil(612 * k) + 'px ' + Math.ceil(408 * k) + 'px', 'important'); b.style.setProperty('background-position', '0 0,60% 30%', 'important'); }
    });
    var wk = document.querySelector('section[data-m="mx-rit"] a[aria-label="Athletes training on a field"]');
    if (wk && wk.offsetHeight && !wk.__wk) { wk.__wk = 1; wk.style.setProperty('background-size', '100% 100%,auto 160%', 'important'); wk.style.setProperty('background-position', '0 0,50% 64%', 'important'); }
  }
  setInterval(run, 1200); run();
})();
