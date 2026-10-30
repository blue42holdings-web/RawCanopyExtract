/* Oct 15 (later): desktop mushroom pages. Boxes that were stacked one under another sit side by side:
   Lion's Mane What It Is + The Steady Burn; Turkey Tail What It Is, Where Ours Comes From, How It's Made,
   What's Been Studied; Turkey Tail Further Reading + The Names It Goes By. Desktop only. */
(function () {
  var MQ = matchMedia('(min-width:768px)');
  var GROUPS = {
    "Lion's Mane": [['[data-ph="elder-camp-chair-mug"]', '[data-rcx-burn]'], ['[data-ph="vintage-bottles-labels"]', '[data-ph="desk-lm"]']],
    // Oct 15 (night, Scott): Further Reading beside The Names It Goes By on all three pages, each with its own photo
    'Cordyceps': [['[data-ph="backpacker-smile"]', '[data-ph="apothecary-shop"]']],
    'Turkey Tail': [['[data-ph="meditation-sunset-hands"]', '[data-ph="palm-jungle-sun"]', '[data-ph="tank-lab"]', '[data-ph="reef-snorkel"]'],
                    ['[data-ph="waterfall-stones"]', '[data-ph="herb-jars-book"]']]
  };
  function page(label) { return [].filter.call(document.querySelectorAll('[data-screen-label]'), function (e) { return e.getAttribute('data-screen-label') === label && e.offsetHeight; })[0]; }
  function run() {
    return;   // Oct 21 (Scott): desktop mushroom pages now use the phone layout (mush-short.js)
    if (!MQ.matches) return;
    var lm = page("Lion's Mane");
    if (lm) {
      var b = lm.querySelector('section[data-m="lm-burn"] > div'); if (b && !b.hasAttribute('data-rcx-burn')) b.setAttribute('data-rcx-burn', '');
      // other scripts strip these two boxes' backgrounds inline; put Scott's photos back the same way
      [[b, 'lm-lockin-golf.jpg', '65% 30%'],   // Oct 17 (Scott): Lock In is the college golfer
        [lm.querySelector('[data-ph="elder-camp-chair-mug"]'), 'own-yosemite-domes.jpg', 'center 40%']].forEach(function (x) {
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
  var BOX = [['pineapple-smoothie.jpg', 'center 50%'], ['own-mountain-sky.jpg', 'center 60%'], ['kitchen-blender-greens.jpg', 'center 45%'], ['own-palm-sunset.jpg', 'center 62%']];
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
    // Oct 15 (late, Scott): How To Mix It top left (the woman at the blender, zoomed in), What To Put In It top right,
    // How Much bottom left (the kettle centered, zoomed out), Nothing To Measure bottom right
    var PL = [[/HOW TO MIX/, 'kitchen-blender-greens.jpg', '64% 88%', 1, 'auto 165%'], [/WHAT TO PUT/, 'pineapple-smoothie.jpg', 'center 50%', 2, 'cover'],
              [/HOW MUCH/, 'mug-dawn.jpg', 'center 60%', 3, 'cover'], [/NOTHING TO MEASURE/, 'own-palm-sunset.jpg', 'center 62%', 4, 'cover']];
    boxes.forEach(function (b) {
      var t = (b.querySelector('h2') || {}).textContent || '';
      PL.forEach(function (m) { if (!m[0].test(t.toUpperCase())) return;
        b.style.setProperty('order', String(m[3]), 'important');
        var v = 'linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.6)),url("assets/photo/' + m[1] + '")';
        if (b.__pl === v + m[2] + m[4]) return; b.__pl = v + m[2] + m[4];
        b.style.setProperty('background-image', v, 'important'); b.style.setProperty('background-size', '100% 100%,' + m[4], 'important');
        b.style.setProperty('background-position', '0 0,' + m[2], 'important'); b.style.setProperty('background-repeat', 'no-repeat', 'important');
        b.style.setProperty('background-color', '#000', 'important');
        if (false) {   // Oct 17: How Much is now the office red mugs photo, plain cover
          var r = b.getBoundingClientRect(), W = Math.round(r.width * 1.0), H = Math.round(W * 1600 / 1280);
          b.style.setProperty('background-size', '100% 100%,' + W + 'px ' + H + 'px', 'important');
          b.style.setProperty('background-position', '0 0,' + '0px ' + Math.round(r.height * 0.7 - H * 0.42) + 'px', 'important');
        }
      });
    });
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
    if (e.__fwd || e.hasAttribute('data-lift-bg') || e.classList.contains('mx-lab')) return; var u = urlOf(e); if (!u) return;
    if (!e.getClientRects().length) { if (!e.__fwdW && window.IntersectionObserver) { e.__fwdW = 1; var wio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { wio.disconnect(); e.__fwdW = 0; forward(e); } }); wio.observe(e); } return; }   // Oct 27: a hidden box must not download its photo
    e.__fwd = 1;
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
      if (t && !t.__still) { t.__still = 1; t.removeAttribute('data-lift-desktop'); t.querySelectorAll(':scope > [data-lift-layer]').forEach(function (l) { l.remove(); }); }   // Oct 17 (Scott): the biker shook while it zoomed; on desktop it holds still
      if (t && t.offsetHeight) set(t, 'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3) 40%,rgba(0,0,0,.75) 62%,#000 72%),url("assets/photo/a-rider-pausing-on-a-granite-ridge.webp")', '100% 100%,auto 70%', '0 0,100% 0');
      [].forEach.call(home.querySelectorAll('.rit-card'), function (c) { if (c === a || c === d || c === t || !c.offsetHeight) return; var u = urlOf(c); if (u) set(c, G + ',' + u, getComputedStyle(c).backgroundSize, getComputedStyle(c).backgroundPosition); });
    }
    // Home, Cordyceps four
    var q = document.querySelector('[data-rcx-cdq]');
    if (q && q.offsetHeight) {
      set(q, G + ',url("assets/photo/stock-outdoor-photo.jpg")', '100% 100%,cover', '0 0,12% 50%');
      [].forEach.call(q.parentElement.children, function (c) { if (c !== q && c.offsetHeight) forward(c); });
    }
  }
  setInterval(run, 1000); run();
})();

/* Oct 15 (late): desktop boxes found by their heading, given one real photo each (inline, so no page rule can turn them
   back into a flat tan or purple box). */
(function () {
  var MQ = matchMedia('(min-width:900px)'), G = 'linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.5) 40%,rgba(0,0,0,.72) 100%)', GTT = 'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.34) 40%,rgba(0,0,0,.58) 100%)';   // Oct 17 (Scott): Turkey Tail boxes all start lighter, one even darkness
  var MAP = {
    "Lion's Mane": [[/^NO SCOOP/, 'mess-floor.jpg', 'cover', 'center'], [/^THE KICKOFF/, 'lm-kickoff-fishing-sunset.jpg', 'cover', '62% center'],
      [/^THE GRANDPARENTS/, 'lm-grandpa-reading.jpg', 'cover', '62% center'],   // Oct 17 (Scott): grandpa reading with his grandson
      [/^FURTHER READING/, 'lm-ski-lesson.jpg', 'cover', 'center 45%'], [/^THE NAMES IT GOES BY/, 'lm-how-made-desk.jpg', 'cover', 'center'],
      [/^THE OTHER TWO/, 'lm-crate.jpg', 'cover', 'center 45%'], [/^THE LOT SHIPPING/, 'extraction-book.jpg', 'cover', 'center 40%'],
      [/^LAB REPORT . HUMAN TRIAL/, 'lm-hearts-sunset.jpg', 'cover', 'center 20%'], [/^LAB REPORT . PUBMED/, 'parent-and-child-outdoors.jpg', 'cover', 'center 40%']],
    'Cordyceps': [[/^FURTHER READING/, 'cd-relay-college.jpg', 'cover', 'center 30%'], [/^THE NAMES IT GOES BY/, 'friends-workout.webp', 'cover', 'center'], [/^THE TRACK/, 'cd-track-runner.jpg', 'cover', '60% center'], [/^THE LONG HAUL/, 'cd-golf-mountains.jpg', 'cover', '35% center'], [/^THE REACTION TIME/, 'cd-golf-woman-sky.jpg', 'cover', '62% center'], [/^LAB REPORT . HUMAN/, 'own-baseball.jpg', '125% auto', 'center 30%'],
      [/^GAME NIGHT/, 'why-ballfield-dusk-vignette-v2.jpg', 'cover', 'center'], [/^THE RIVER/, 'how-paddleboard-river.webp', 'auto 125%', 'center 80%'],
      [/^MEASURED/, 'mess-floor.jpg', 'cover', 'center']],
    'Turkey Tail': [[/^NO SCOOP|^NOTHING TO MEASURE|^PRE-MEASURED/, 'mess-floor.jpg', 'cover', 'center'],
      [/^WHAT IT IS/, 'tt-fest-cheer.jpg', 'cover', 'center 40%'], [/^FURTHER READING/, 'tt-fest-harbor-stage.jpg', 'cover', 'center'], [/^THE NAMES IT GOES BY/, 'tt-teal-7-train.jpg', 'cover', 'center'], [/^WHERE OURS COMES FROM/, 'tt-tube-boarding.jpg', 'cover', 'center 45%'],
      [/^HOW IT'S MADE/, 'lab-hand-closeup.jpg', 'cover', 'center'], [/^WHAT'S BEEN STUDIED/, 'tt-concert-lasers.jpg', 'cover', 'center 100%'],
      [/^THE COMMUTE/, 'tt-subway-car.jpg', 'cover', 'center'], [/^RUSH HOUR/, 'tt-14th-st-boarding.jpg', 'cover', '45% center'], [/^DATA . UNITED NATIONS/, 'tt-fest-aerial.jpg', 'cover', 'center'], [/^THE GUT STUDY/, 'tt-fest-wristbands.jpg', 'cover', 'center 40%'], [/^HOW TO TAKE IT/, 'tt-fest-dj-flames.jpg', 'cover', 'center 62%'], [/^RUSH HOUR/, 'tt-fest-big-crowd.jpg', 'cover', 'center 60%'], [/^THE DOUBLE BLIND/, 'tt-fest-cheer.jpg', 'cover', 'center 55%']]
  };
  window.__rcxBoxMap = MAP;   // nav-extras reads this so it never paints a box this map owns (that was the flash underneath)
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
    var MUSH = /^(Lion's Mane|Cordyceps|Turkey Tail)$/;   // Oct 21 (Scott): desktop mushroom pages use the phone photos (mushroom-reveal.js, mush-short.js)
    Object.keys(MAP).forEach(function (L) {
      if (MUSH.test(L)) return;
      var root = [].filter.call(document.querySelectorAll('[data-screen-label]'), function (e) { return e.getAttribute('data-screen-label') === L && e.offsetHeight; })[0]; if (!root) return;
      MAP[L].forEach(function (m) {
        var b = boxFor(root, m[0]); if (!b) return;
        var u = m[1] ? 'url("assets/photo/' + m[1] + '")' : (b.__rcxU || ((getComputedStyle(b).backgroundImage.match(/url\([^)]*\)/g) || []).pop()));
        if (!u) return; b.__rcxU = u;
        var key = u + m[2] + m[3]; if (b.__boxKey === key && (b.style.getPropertyValue('background-image') || '').indexOf('url') >= 0) return; b.__boxKey = key;
        b.style.setProperty('background-image', (/hearts-sunset/.test(u) ? 'linear-gradient(rgba(0,0,0,.05),rgba(0,0,0,.2) 40%,rgba(0,0,0,.55) 100%)' : /kickoff-fishing/.test(u) ? 'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.5))' : /kickoff|ski-lesson/.test(u) ? 'linear-gradient(rgba(0,0,0,.66),rgba(0,0,0,.76))' : L === 'Turkey Tail' ? GTT : G) + ',' + u, 'important'); b.style.setProperty('background-size', '100% 100%,' + m[2], 'important');
        b.style.setProperty('background-position', '0 0,' + m[3], 'important'); b.style.setProperty('background-repeat', 'no-repeat', 'important');
        b.style.setProperty('background-color', '#000', 'important'); b.style.setProperty('--fsz', m[2]); b.style.setProperty('--fps', m[3]);
        b.setAttribute('data-rcx-boxph', '');
      });
    });
    // one photo running down through two stacked boxes, so you can see what is going on in it
    var PAIRS = { "Lion's Mane": [[/^HOW IT'S MADE/, /^WHAT'S BEEN STUDIED/, 'lab-mushroom-extraction.jpg', 900, 550]],   // Oct 17 (Scott): one photo running through both boxes
      'Cordyceps': [[/^WHAT IT IS/, /^WHERE OURS COMES FROM/, 'cd-yunnan-hoodoos.webp', 1200, 675], [/^HOW IT'S MADE/, /^WHAT'S BEEN STUDIED/, 'lab-soxhlet-chrome.jpg', 800, 450],
        [/^HOW TO TAKE IT/, /^THE LOT SHIPPING/, 'cd-golf-orange.jpg', 1280, 854]],
      'Turkey Tail': [[/^THE LOT SHIPPING/, /^THE OTHER TWO/, 'tt-concert-blue.jpg', 940, 788]] };   // Oct 17 (Scott): DJ flames moves up to How To Take It; the concert runs down through the lower two   // Oct 17 (Scott): Lion's Mane What's Been Studied gets its own meditation photo, so How It's Made keeps its own
    Object.keys(PAIRS).forEach(function (L) {
      if (MUSH.test(L)) return;
      var root = [].filter.call(document.querySelectorAll('[data-screen-label]'), function (e) { return e.getAttribute('data-screen-label') === L && e.offsetHeight; })[0]; if (!root) return;
      PAIRS[L].forEach(function (pr) {
        var a = boxFor(root, pr[0]), b = boxFor(root, pr[1]); if (!a || !b) return;
        var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(), W = Math.max(ra.width, rb.width), H = rb.bottom - ra.top;
        var k = Math.max(W / pr[3], H / pr[4]), iw = Math.ceil(pr[3] * k), ih = Math.ceil(pr[4] * k), x = Math.round((W - iw) / 2), y0 = /puzzle/.test(pr[2]) ? Math.round(H - ih) : Math.round((H - ih) / 2);
        [[a, y0], [b, y0 - (rb.top - ra.top)]].forEach(function (z) {
          var v = (L === 'Turkey Tail' ? 'linear-gradient(rgba(0,0,0,.36),rgba(0,0,0,.5))' : 'linear-gradient(rgba(0,0,0,.58),rgba(0,0,0,.68))') + ',url("assets/photo/' + pr[2] + '")', key = v + iw + 'x' + ih + '@' + x + ',' + z[1];
          if (z[0].__pk === key && z[0].style.getPropertyValue('background-image')) return; z[0].__pk = key; z[0].setAttribute('data-rcx-boxph', '');
          z[0].style.setProperty('background-image', v, 'important'); z[0].style.setProperty('--x', v); z[0].style.setProperty('background-size', '100% 100%,' + iw + 'px ' + ih + 'px', 'important');
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
    if (wk && wk.offsetHeight && !wk.__wk) { wk.__wk = 1; wk.style.setProperty('background-size', '100% 100%,auto 160%', 'important'); wk.style.setProperty('background-position', '0 0,50% 92%', 'important'); }
  }
  setInterval(run, 1200); run();
})();

/* Oct 15 (late, round 3, Scott): desktop framing on Why One Ingredient and About, Shop tennis running down into the powder. */
(function () {
  var MQ = matchMedia('(min-width:900px)');
  function pg(L) { return [].filter.call(document.querySelectorAll('[data-screen-label]'), function (e) { return e.getAttribute('data-screen-label') === L && e.offsetHeight; })[0]; }
  function norm(t) { return t.replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim().toUpperCase(); }
  function box(root, re) {
    var els = root.querySelectorAll('h2,h3,h4,.mx-tag,.lab-tag,span,p');
    for (var i = 0; i < els.length; i++) { var e = els[i], t = norm(e.textContent); if (t.length > 70 || !re.test(t) || !e.offsetHeight) continue;
      for (var p = e, n = 0; p && p !== root && n < 7; p = p.parentElement, n++) { var c = getComputedStyle(p); if (parseFloat(c.borderTopWidth) > 1.5 && p.offsetWidth > 300) return p; } }
    return null;
  }
  function put(b, img, sz, pos, dark) {
    var v = 'linear-gradient(rgba(0,0,0,' + dark + '),rgba(0,0,0,' + (dark + .12) + ')),url("assets/photo/' + img + '")', k = v + sz + pos;
    if (b.__r3 === k && b.style.getPropertyValue('background-image')) return; b.__r3 = k; b.setAttribute('data-rcx-boxph', '');
    b.style.setProperty('background-image', v, 'important'); b.style.setProperty('background-size', '100% 100%,' + sz, 'important');
    b.style.setProperty('background-position', '0 0,' + pos, 'important'); b.style.setProperty('background-repeat', 'no-repeat', 'important');
    b.style.setProperty('--fsz', sz); b.style.setProperty('--fps', pos);
  }
  function coverPx(b, iw, ih, zoom) { var r = b.getBoundingClientRect(), k = Math.max(r.width / iw, r.height / ih) * (zoom || 1); return Math.ceil(iw * k) + 'px ' + Math.ceil(ih * k) + 'px'; }
  function run() {
    if (!MQ.matches) return;
    var W = pg('Why One Ingredient');
    if (W) {
      var b;
      if ((b = box(W, /^START HERE/))) put(b, 'faq-camp-table-tin.jpg', 'cover', '50% 78%', .4);
      if ((b = box(W, /^MAKE YOUR OWN COMBO/))) put(b, 'why-pour.webp', 'cover', '45% 50%', .42);
      if ((b = box(W, /^LAB DATA . NEARLY 100/))) put(b, 'lab-powder-coat.jpg', coverPx(b, 1218, 853, 1.45), '78% 100%', .5);
      // the three tall boxes share the one camping photo, running across all three
      var a = box(W, /^FRUITING BODY OR MYCELIUM/), m = box(W, /^HOW TO READ ANYONE'S LAB/), q = box(W, /^WHAT OUR QR CODE/);
      if (a && m && q) {
        var ra = a.getBoundingClientRect(), rq = q.getBoundingClientRect(), TW = rq.right - ra.left, TH = Math.max(ra.height, rq.height);
        var k = Math.max(TW / 1600, TH / 900), iw = Math.ceil(1600 * k), ih = Math.ceil(900 * k);
        [a, m, q].forEach(function (x) { var r = x.getBoundingClientRect(); put(x, 'grow-farm-valley.jpg', iw + 'px ' + ih + 'px', Math.round((TW - iw) / 2 - (r.left - ra.left)) + 'px ' + Math.round((TH - ih) / 2) + 'px', .5); });
      }
      var mr = W.parentElement && W.parentElement.querySelector('[data-m="more-research"] > div');
      if (!mr) mr = document.querySelector('[data-why-mr] > div');
      if (mr && mr.offsetHeight) put(mr, 'own-yellowstone.jpg', 'cover', '57% 88%', .45);   // the hot spring ring and its colors, no sky
      // 2 + 1: no wide gaps
      [].forEach.call(W.querySelectorAll('.mx-big'), function (e) { if (/2\s*\+\s*1/.test(e.textContent) && !e.__tight) { e.__tight = 1; e.style.setProperty('letter-spacing', '0', 'important'); e.style.setProperty('word-spacing', '-0.18em', 'important'); } });
    }
    var A = pg('About');
    if (A) {
      var bb = A.querySelector('.ab-brand-box:not(.cmp-box)'); if (bb) put(bb, 'own-scott-wildman.jpg', 'cover', 'center 40%', .6);
      // Oct 17: Compost The Box photo is set only in about-photos.js (his two labs); setting it here too made one flash under the other
    }
    // Shop: the colored tennis photo runs from the products all the way down behind the badges into the powder
    var S = pg('Shop');
    if (S) {
      var secs = S.querySelectorAll(':scope > section'), pk = secs[1], cbs = S.querySelector('section.clean-band');
      if (pk && cbs) {
        var top = pk.getBoundingClientRect().top + scrollY, bot = cbs.getBoundingClientRect().top + scrollY + 140;   // Oct 15 (night): runs on under the powder so the two blend
        var d = S.querySelector(':scope > .rcx-tennis-run');
        if (!d) { d = document.createElement('div'); d.className = 'rcx-tennis-run'; d.setAttribute('aria-hidden', 'true'); S.appendChild(d); }
        var sTop = S.getBoundingClientRect().top + scrollY, g = Math.round(top - sTop) + '|' + Math.round(bot - top);
        if (d.__g !== g) { d.__g = g; d.style.cssText = 'position:absolute;left:0;right:0;top:' + Math.round(top - sTop) + 'px;height:' + Math.round(bot - top) + 'px;z-index:-1;pointer-events:none;background:url("assets/photo/shop-tennis-handshake-nobrand.jpg") center 35%/cover no-repeat;-webkit-mask-image:linear-gradient(#000 calc(100% - 30px),transparent 100%);mask-image:linear-gradient(#000 calc(100% - 30px),transparent 100%);'; }
      }
    }
  }
  setInterval(run, 1000); run();
})();

/* Oct 15 (late): Shop top box, desktop. One climber, larger, filling the box (the second copy is gone), lifting on as a cutout. */
(function () {
  var MQ = matchMedia('(min-width:900px)');
  function run() {
    if (!MQ.matches) return;
    var s = [].filter.call(document.querySelectorAll('div[data-screen-label="Shop"] > section'), function (e) { return e.offsetHeight; })[0]; if (!s) return;
    // Oct 15 (night, Scott): she is smaller and off to the right; the words stay centered like every other page.
    // shop-climber-wide is the same photo with more sky on the left, so the box is filled with no gaps.
    var W = s.offsetWidth, H = s.offsetHeight, iw = Math.max(W, Math.round(H * 1.92)), ih = Math.round(iw / 1.919), x = Math.round(W - iw), y = Math.round((H - ih) * 0.4);
    var sz = '100% 100%,' + iw + 'px ' + ih + 'px', ps = '0 0,' + x + 'px ' + y + 'px';
    if (s.__cl !== sz + ps) {
      s.__cl = sz + ps;
      s.style.setProperty('background-image', 'linear-gradient(rgba(0,0,0,.42),rgba(0,0,0,.5)),url("assets/photo/shop-climber-wide.webp")', 'important');
      s.style.setProperty('background-size', sz, 'important'); s.style.setProperty('background-position', ps, 'important'); s.style.setProperty('background-repeat', 'no-repeat', 'important');
    }
    if (!s.hasAttribute('data-lift-bg')) {   // she lifts on by size and fade only (no brightness animation, no blur layer), which is what made it stutter
      s.setAttribute('data-lift-bg', 'assets/cutouts/shop-climber-wide-cutout.webp'); s.setAttribute('data-lift-desktop', ''); s.setAttribute('data-lift-nomask', ''); s.setAttribute('data-lift-noblur', '');
      s.setAttribute('data-lift-dim', 'none'); s.setAttribute('data-lift-scale', '1.02'); s.setAttribute('data-lift-origin', '0.7465 0.431'); s.setAttribute('data-lift-veil-any', '.35');   // Oct 17 (Scott): pinned on her chin so she grows forward from there and never doubles
      s.setAttribute('data-lift-dur', '8000'); s.setAttribute('data-lift-delay', '1200'); s.setAttribute('data-lift-d-delay', '1200'); s.setAttribute('data-lift-fade', '2000');
    }
  }
  setInterval(run, 700); run();
})();

/* Oct 15 (late, Scott): Receipts, desktop. The receipt reads like a real sheet of paper: room above the first species and
   more room between lines, so it runs long like a receipt. */
(function () {
  var MQ = matchMedia('(min-width:900px)');
  function run() {
    if (!MQ.matches) return;
    var R = [].filter.call(document.querySelectorAll('div[data-screen-label="Receipts"]'), function (e) { return e.offsetHeight; })[0]; if (!R) return;
    var papers = [].filter.call(R.querySelectorAll('div'), function (d) { return d.offsetWidth > 900 && getComputedStyle(d).backgroundColor === 'rgb(244, 241, 232)'; });
    papers.forEach(function (d, i) {
      if (d.__paper) return; d.__paper = 1;
      if (i === 0) d.style.setProperty('padding-top', '140px', 'important');

      d.style.setProperty('padding-bottom', '46px', 'important');
      if (i === papers.length - 1) { var t0 = papers[0].getBoundingClientRect().top, t1 = d.getBoundingClientRect().bottom, want = Math.round(d.offsetWidth * 11 / 8.5); if (t1 - t0 < want) { var ty = [].filter.call(d.querySelectorAll('p'), function (p) { return /THANK YOU FOR CHECKING/i.test(p.textContent); })[0]; if (ty) ty.style.setProperty('margin-top', (20 + want - (t1 - t0)) + 'px', 'important'); else d.style.setProperty('padding-bottom', (46 + want - (t1 - t0)) + 'px', 'important'); } }   // Oct 15 (night): the spare paper goes above the thank-you, so it is the last line on the sheet   // the whole sheet is letter size
      [].forEach.call(d.querySelectorAll('*'), function (k) { var lh = parseFloat(getComputedStyle(k).lineHeight); if (lh && k.children.length === 0) k.style.setProperty('line-height', Math.round(lh * 1.5) + 'px', 'important'); });
    });
  }
  setInterval(run, 1200); run();
})();


/* Oct 15 (late, Scott): species pages, desktop: every photo box starts at the same darkness and comes up as it comes into view */
(function () {
  var MQ = matchMedia('(min-width:900px)');
  function run() {
    if (!MQ.matches) return;
    ["Lion's Mane", 'Cordyceps', 'Turkey Tail'].forEach(function (L) {
      var R = [].filter.call(document.querySelectorAll('[data-screen-label]'), function (e) { return e.getAttribute('data-screen-label') === L && e.offsetHeight; })[0]; if (!R) return;
      [].forEach.call(R.querySelectorAll('[data-rcx-boxph],.rcx-row2 > *'), function (b) {
        if (b.__lit2 || !b.offsetHeight) return; b.__lit2 = 1;
        b.style.setProperty('box-shadow', 'inset 0 0 0 3000px rgba(0,0,0,.36)', 'important');
        b.style.setProperty('transition', 'box-shadow 5s ease-in-out', 'important');
        var io = new IntersectionObserver(function (es) { if (!es[0].isIntersecting) return; io.disconnect(); setTimeout(function () { b.style.setProperty('box-shadow', 'inset 0 0 0 3000px rgba(0,0,0,0)', 'important'); }, 400); }, { threshold: 0.3 });
        io.observe(b);
      });
    });
  }
  setInterval(run, 1200); run();
})();

/* Oct 15 (night, Scott): Lion's Mane desktop. The same dark filter and RCX pattern as The Roar of the Mountain run all the
   way up from that band to the line under the top photo, over the Shasta photo, so the two read as one piece. */
(function () {
  var MQ = matchMedia('(min-width:900px)');
  function run() {
    if (!MQ.matches) return;
    var C = document.querySelector('.sd-lm'); if (!C || !C.offsetHeight) return;
    var hero = C.querySelector(':scope > section[data-m$="-hero"]'), s = C.querySelector(':scope > section[data-m="sbox"]'); if (!hero || !s) return;
    // Oct 17 (Scott): the filter and pattern start right under the top box's gold line and run all the way down to the gold border of The Other Two
    var cr = C.getBoundingClientRect(), y0 = Math.round(hero.getBoundingClientRect().bottom - cr.top), y1 = C.__lmMid ? C.__lmMid + 40 : Math.round(s.getBoundingClientRect().bottom - cr.top + 300);   // Oct 17 (Scott): filter and pattern cover the Shasta photo only, fading out into the beach
    var d = C.querySelector(':scope > [data-lm-fill]');
    if (!d) { d = document.createElement('div'); d.setAttribute('data-lm-fill', ''); d.setAttribute('data-sd-hero', 'fill'); d.setAttribute('aria-hidden', 'true'); C.insertBefore(d, hero.nextSibling); }
    var g = y0 + '|' + y1;
    if (d.__g === g) return; d.__g = g;
    d.style.cssText = 'position:absolute;left:0;right:0;margin:0;top:' + y0 + 'px;height:' + Math.max(0, y1 - y0) + 'px;z-index:0;pointer-events:none;-webkit-mask-image:linear-gradient(#000 calc(100% - 300px),transparent 100%);mask-image:linear-gradient(#000 calc(100% - 300px),transparent 100%);' +
      'background:linear-gradient(100deg,rgba(0,0,0,.83) 0%,rgba(0,0,0,.63) 46%,rgba(0,0,0,.65) 70%,rgba(0,0,0,.79) 100%)';
    if (!d.firstChild) { var p = document.createElement('div'); d.appendChild(p); }
    var pp = d.firstChild; pp.style.cssText = 'position:absolute;inset:0;opacity:.3'; pp.style.setProperty('background', 'url("assets/pattern-field-bold.svg") 50% 0/33px auto repeat', 'important');   // Oct 17: the RCX pattern must cover the whole page, set so nothing can clear it
  }
  setInterval(run, 1200); run();
})();
