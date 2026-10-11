/* Oct 10:
   1. Every left/right arrow row under a carousel gets a matching row above it.
   2. Background photos that don't already animate start a little dark and
      brighten very slowly once they scroll into view. */
(function () {
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. top arrow rows ---------- */
  function topNav(nav) {
    if (nav.__top || nav.hasAttribute('data-top-nav')) return;
    var anchor = nav.previousElementSibling;
    if (!anchor) return;
    while (anchor.previousElementSibling && anchor.previousElementSibling.tagName === 'SC-IF') anchor = anchor.previousElementSibling;
    var copy = nav.cloneNode(true);
    copy.setAttribute('data-top-nav', '');
    copy.removeAttribute('onclick');
    copy.style.margin = '0 0 16px';
    var orig = nav.querySelectorAll('button'), mine = copy.querySelectorAll('button');
    mine.forEach(function (b, i) {
      b.removeAttribute('onclick');
      b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); var o = nav.querySelectorAll('button')[i]; if (o) o.click(); });
    });
    anchor.parentNode.insertBefore(copy, anchor);
    nav.__top = copy;
    nav.classList.add('rit-hide-bottom');
  }
  function syncLabels() {
    document.querySelectorAll('.rit-nav:not([data-top-nav])').forEach(function (nav) {
      var c = nav.__top; if (!c) return;
      if (!c.isConnected) { nav.__top = null; return; }
      var a = nav.querySelector('span'), b = c.querySelector('span');
      if (a && b && a.textContent !== b.textContent) b.textContent = a.textContent;
    });
  }

  /* ---------- 2. slow brighten on still background photos ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting && (e.intersectionRatio >= 0.25 || e.intersectionRect.height > innerHeight * 0.35)) { var d = e.target.__dk; if (d) d.style.opacity = '0'; io.unobserve(e.target); } });
  }, { threshold: [0, 0.05, 0.1, 0.25] }) : null;

  function busy(el) {
    if (el.hasAttribute('data-lift-bg') || el.hasAttribute('data-lift-once') || el.closest('[data-lift-bg]')) return true;
    if (el.closest('.rit-card,.hero-box,[data-m="hero"],[data-m="steps-wrap"],[data-m="bgstack"]')) return true;
    var cs = getComputedStyle(el);
    if (cs.animationName && cs.animationName !== 'none') return true;
    var pb = getComputedStyle(el, '::before'), pa = getComputedStyle(el, '::after');
    if ((pb.animationName && pb.animationName !== 'none') || (pa.animationName && pa.animationName !== 'none')) return true;
    if (/background|filter|--/.test(cs.transitionProperty) && parseFloat(cs.transitionDuration) > 0) return true;
    if (el.classList.contains('cd-lit') || el.matches('[data-ph="summit-arms-out"],[data-m="cd-fbox"]')) return true;
    return false;
  }
  function dim(el) {
    if (el.__dk) {
      // a painter later took the photo off this element (desktop mushroom pages): drop the dark layer so it can't grey a light page
      if (!/url\([^)]*assets\/photo\//.test(getComputedStyle(el).backgroundImage)) { el.__dk.remove(); el.__dk = null; el.__skip = 1; }
      return;
    }
    if (el.__skip) return;
    var bg = getComputedStyle(el).backgroundImage;
    if (!bg || !/url\([^)]*assets\/photo\//.test(bg)) return;
    var r = el.getBoundingClientRect();
    if (r.width < 120 || r.height < 90) return;
    if (busy(el)) { el.__skip = 1; return; }
    var cs = getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';
    el.style.isolation = 'isolate';
    var d = document.createElement('div');
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = 'position:absolute;inset:0;z-index:-1;pointer-events:none;border-radius:inherit;background:#000;opacity:.38;transition:opacity 14s cubic-bezier(.25,.1,.25,1) .6s';
    el.insertBefore(d, el.firstChild);
    el.__dk = d;
    if (io) io.observe(el); else d.style.opacity = '0';
  }

  function scan() {
    document.querySelectorAll('.rit-nav:not([data-top-nav])').forEach(topNav);
    syncLabels();
    if (!RM) document.querySelectorAll('[style*="url("],[data-ph],.mx-box,.ab-box,.ab-brand-box,.hw-box,section,article').forEach(dim);
  }
  setInterval(scan, 900); scan();
})();

/* Oct 11: every white marble surface gets its own variation of the stone (same look, different veins),
   and every black box or button you can click, plus the refill box stages, gets a different blurred wet slate. */
(function () {
  function marble(i) {
    var s1 = 11 + i * 7, s2 = 4 + i * 5;
    var f1 = (0.0035 + (i % 4) * 0.0006).toFixed(4) + ' ' + (0.016 + (i % 3) * 0.003).toFixed(3);
    var f2 = (0.010 + (i % 3) * 0.002).toFixed(3) + ' ' + (0.005 + (i % 4) * 0.0008).toFixed(4);
    var a1 = 104 + (i * 23) % 40, a2 = 52 + (i * 17) % 36, a0 = 25 + (i * 13) % 30;
    var hx = 12 + (i * 29) % 70, hy = 8 + (i * 11) % 30;
    return "repeating-linear-gradient(" + a0 + "deg,rgba(110,100,86,.022) 0 1px,rgba(0,0,0,0) 1px 9px)," +
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='520' height='360' preserveAspectRatio='none'><filter id='a' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='" + f1 + "' numOctaves='5' seed='" + s1 + "'/><feColorMatrix values='0 0 0 0 0.42  0 0 0 0 0.39  0 0 0 0 0.34  0 0 0 -11 5.2'/><feGaussianBlur stdDeviation='3.2'/></filter><rect width='100%' height='100%' filter='url(%23a)' opacity='.8'/></svg>\") 0 0/100% 100% no-repeat," +
      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='380' height='300' preserveAspectRatio='none'><filter id='b' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='" + f2 + "' numOctaves='4' seed='" + s2 + "'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.47  0 0 0 0 0.42  0 0 0 -14 6.6'/><feGaussianBlur stdDeviation='3.2'/></filter><rect width='100%' height='100%' filter='url(%23b)' opacity='.65'/></svg>\") 0 0/100% 100% no-repeat," +
      "radial-gradient(120% 90% at " + hx + "% " + hy + "%,rgba(255,255,255,.95) 0%,rgba(255,255,255,0) 55%)," +
      "radial-gradient(90% 70% at " + (100 - hx) + "% 92%,rgba(120,112,100,.18) 0%,rgba(120,112,100,0) 60%)," +
      "linear-gradient(" + a1 + "deg,rgba(0,0,0,0) 38%,rgba(150,140,126,.22) 41%,rgba(0,0,0,0) 45%)," +
      "linear-gradient(" + a2 + "deg,rgba(0,0,0,0) 55%,rgba(150,140,126,.16) 58%,rgba(0,0,0,0) 62%)," +
      "linear-gradient(160deg,#FBFAF6 0%,#F1EEE6 46%,#FFFFFF 70%,#E9E5DA 100%)";
  }
  var POS = ['20% 40%', '70% 60%', '40% 80%', '85% 25%', '10% 70%', '55% 35%', '30% 15%', '75% 85%', '50% 50%', '35% 65%'];
  function slate(i, dark) {
    var k = i % 10;
    return 'linear-gradient(rgba(3,3,3,' + dark + '),rgba(3,3,3,' + dark + ')),url("assets/photo/slate-blur-' + (k + 1) + '.jpg?v=2") ' + POS[k] + '/cover no-repeat';
  }
  var nm = 0, ns = 0;
  function run() {
    document.querySelectorAll('.rcx-marble,[data-pack-stage="tin"],.pk-tile.pk-tin,.mx-press-w').forEach(function (e) {
      if (e.__mv) return; e.__mv = 1;
      e.style.setProperty('background', marble(nm++), 'important');
    });
    document.querySelectorAll('[data-pack-stage="box"],.pk-tile.pk-box,.mx-press-k').forEach(function (e) {
      if (e.__sv) return; e.__sv = 1;
      e.style.setProperty('background', slate(ns++, .55), 'important');
    });
    // any black clickable box or button, phone and desktop
    document.querySelectorAll('main button, main a, main label, main [role="button"], main [role="link"], main [onclick]').forEach(function (b) {
      if (b.__sv || b.__sl || b.closest('header,footer,nav,[data-m="player"],[data-ambient-btn],[data-m^="nav"]')) return;
      var r = b.getBoundingClientRect(); if (r.width < 30 || r.height < 26) return;
      var cs = getComputedStyle(b);
      if (cs.backgroundImage !== 'none') return;
      var m = cs.backgroundColor.match(/[\d.]+/g); if (!m) return;
      var a = m.length > 3 ? +m[3] : 1;
      if (!(+m[0] < 30 && +m[1] < 30 && +m[2] < 30 && a > 0.5)) return;
      b.__sv = 1;
      b.style.setProperty('background', slate(ns++, .82), 'important');
      b.style.setProperty('background-color', '#050505', 'important');
    });
  }
  setInterval(run, 1000); run();
})();
