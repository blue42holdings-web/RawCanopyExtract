/* Oct 15 (night), Scott: on the phone every box in a swipe row starts at the same darkness
   and comes up to the same lightness together, when its row scrolls into view.
   Same photo shade on every box (lab cards included), no box left dark off to the side. */
(function () {
  var MQ = matchMedia('(max-width:767px)');
  var SHADE = 'linear-gradient(rgba(0,0,0,.34),rgba(0,0,0,.48))';   // same as a lit box on the mushroom pages
  // rows of boxes that swipe sideways on the phone
  var ROWS = '.cx-track,.rit-grid,.rcx-swipe,.mx-grid';
  // phone framing for single photos Scott flagged (Oct 15 night): less sky, the people bigger
  var FRAME = [[/^YOUR WORKOUT ROUTINE/, null, 'auto 190%', '14% 64%'], [/^ON THE TRAIL/, 'a-rider-pausing-on-a-granite-ridge-ph-crop.jpg', 'auto 150%', '83% 72%'],
    [/^THE BLEND TRICK/, 'mushroom-cabinet.jpg', 'cover', '50% 50%'],
    [/^WHAT TO PUT IT IN/, 'own-waterfall-arms.jpg', 'cover', '50% 30%'], [/^HOW MUCH/, 'cd-golf-woman-sky.jpg', 'cover', '50% 50%'], [/^HOW TO MIX IT/, 'hero-stove-packets.jpg', 'cover', '45% 50%']];   // How To Use: Josh at the waterfall, golf, the camp stove pour
  var MUSH = ["Lion's Mane", 'Cordyceps', 'Turkey Tail'];
  function pageOf(el) { var c = el.closest('[data-screen-label]'); return c ? c.getAttribute('data-screen-label') : ''; }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { e.target.setAttribute('data-lit', ''); io.unobserve(e.target); } });
  }, { rootMargin: '-25% 0px -25% 0px', threshold: 0 }) : null;
  function run() {
    if (!MQ.matches) return;
    document.querySelectorAll(ROWS).forEach(function (t) {
      if (t.scrollWidth <= t.clientWidth + 30 && !t.classList.contains('cx-track')) return;   // only rows that actually swipe
      if (!t.__se) { t.__se = 1; t.setAttribute('data-se-row', ''); if (io) io.observe(t); else t.setAttribute('data-lit', ''); }
      Array.prototype.forEach.call(t.children, function (b) {
        if (!(b.classList.contains('mx-box') || b.classList.contains('hw-box')) || b.classList.contains('mx-press') || MUSH.indexOf(pageOf(b)) >= 0) return;   // the mushroom pages have their own reveal (mushroom-reveal.js)
        var bi = b.style.getPropertyValue('background-image') || getComputedStyle(b).backgroundImage;
        var m = bi && bi.match(/url\([^)]*\)/g), tx = (b.innerText || '').trim().toUpperCase();
        if (!m) { if (!FRAME.some(function (f) { return f[1] && f[0].test(tx); })) return; m = ['none']; }   // a box with no photo can still get one
        var u = m[m.length - 1];
        for (var i = 0; i < FRAME.length; i++) if (FRAME[i][0].test(tx)) {
          if (FRAME[i][1]) { u = 'url("assets/photo/' + FRAME[i][1] + '")'; [].forEach.call(b.children, function (k) { if (/assets\/photo\//.test(getComputedStyle(k).backgroundImage) && k.tagName === 'DIV' && !k.children.length) k.style.setProperty('display', 'none', 'important'); }); }
          if (!b.__seF) { b.__seF = 1; b.style.setProperty('--fsz', FRAME[i][2]); b.style.setProperty('--fps', FRAME[i][3]); b.style.setProperty('background-size', '100% 100%,' + FRAME[i][2], 'important'); b.style.setProperty('background-position', '0 0,' + FRAME[i][3], 'important'); }
          break;
        }
        var want = (b.classList.contains('hw-box') ? 'linear-gradient(rgba(0,0,0,.58),rgba(0,0,0,.66))' : SHADE) + ',' + u;   // the How To Use cards are long reads
        if (b.__seV !== want) { b.__seV = want; b.style.setProperty('background-image', want, 'important'); }
      });
    });
    // at the very bottom of a page a row may never reach the middle, so light what is on screen
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) document.querySelectorAll('[data-se-row]:not([data-lit])').forEach(function (t) { var r = t.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) t.setAttribute('data-lit', ''); });
  }
  // phone photo swaps for single boxes (Oct 15 night, Scott): keep each box's own shade, change only the photo
  var BOX = [["Lion's Mane", '[data-ph="vintage-bottles-labels"]', 'lm-grandpa-fishing.jpg', '50% 35%'],
             ["Lion's Mane", '[data-ph="lab-people"]', 'lab-steel-tanks.jpg', 'center']];   // lab-people was showing twice on the page
  function boxes() {
    if (!MQ.matches) return;
    BOX.forEach(function (x) {
      document.querySelectorAll('[data-screen-label] ' + x[1]).forEach(function (el) {
        if (pageOf(el) !== x[0]) return;
        var bi = getComputedStyle(el).backgroundImage; if (!bi || bi === 'none' || bi.indexOf(x[2]) >= 0) return;
        var g = bi.replace(/,?\s*url\([^)]*\)/g, ''); g = g && g !== 'none' ? g + ',' : '';
        el.style.setProperty('background-image', g + 'url("assets/photo/' + x[2] + '")', 'important');
        el.style.setProperty('background-size', (g ? '100% 100%,' : '') + 'cover', 'important');
        el.style.setProperty('background-position', (g ? '0 0,' : '') + x[3], 'important');
      });
    });
  }
  setInterval(boxes, 1000); boxes();
  // desktop home: hand each mushroom-row box its own photo through --hb-img so one shared shade applies to all of them
  function homeBoxes() {
    if (MQ.matches) return;
    document.querySelectorAll('.home-bgwrap .mx-sec .mx-grid > .mx-box:not(.mx-press)').forEach(function (b) {
      var bi = b.style.getPropertyValue('background-image') || getComputedStyle(b).backgroundImage, m = bi && bi.match(/url\([^)]*\)/g);
      if (!m) return; var u = m[m.length - 1]; if (b.__hb !== u) { b.__hb = u; b.style.setProperty('--hb-img', u); }
    });
  }
  setInterval(homeBoxes, 1000); homeBoxes();
  addEventListener('scroll', run, { passive: true });
  setInterval(run, 900); run();
})();
