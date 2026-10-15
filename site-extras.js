/* Oct 11: brushed-metal sheen on the dark red, laid in as a soft layer that fades out at its edges
   (never a hard line where it starts or stops). */
window.__rcxMetal = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='900' height='600' preserveAspectRatio='none'><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='0.0025 0.9' numOctaves='2' seed='5' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 0.86  0 0 0 0 0.86  0 0 0 .24 -.08'/></filter><rect width='100%' height='100%' filter='url(%23m)'/></svg>\") 0 0/900px 260px repeat,linear-gradient(112deg,rgba(255,255,255,0) 18%,rgba(255,200,200,.10) 34%,rgba(255,255,255,0) 48%,rgba(255,215,215,.07) 66%,rgba(255,255,255,0) 82%)";
(function () {
  var T = [
    ['.home-bgwrap>[data-m="mx-rit"]', 'linear-gradient(transparent 0,#000 160px,#000 calc(100% - 170px),transparent 100%)', 0, 0],
    ['[data-m="red-wrap"]', 'linear-gradient(transparent 0,#000 var(--redFull,200px),#000 calc(100% - 120px),transparent 100%)', 0, 0],
    ['[data-screen-label="Shop"] section[data-m="pack-sec"]', 'linear-gradient(transparent 0,#000 200px,#000 calc(100% - 120px),transparent 100%)', 0, 0],
    ['[data-m="more-research"]', 'linear-gradient(#000 0,#000 30%,transparent 85%)', 0, 0],
    ['[data-m="other-two-red"]', 'linear-gradient(transparent 0,#000 200px,#000 calc(100% - 140px),transparent 100%)', 0, 0],
    ['[data-m="cd-bottom-red"]', 'linear-gradient(#000 0,#000 calc(100% - 140px),transparent 100%)', 0, 0],
    ['div[data-screen-label="About"]', 'linear-gradient(#000 0,#000 300px,transparent 760px)', 0, 900]
  ];
  function run() {
    T.forEach(function (t) {
      document.querySelectorAll(t[0]).forEach(function (el) {
        if (el.__mt && el.__mt.isConnected) return;
        if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
        el.style.isolation = 'isolate';
        var d = document.createElement('div'); d.setAttribute('aria-hidden', 'true'); d.setAttribute('data-red-metal', '');
        d.style.cssText = 'position:absolute;left:0;right:0;top:0;' + (t[3] ? 'height:' + t[3] + 'px;' : 'bottom:0;') + 'z-index:-1;pointer-events:none;background:' + window.__rcxMetal + ';-webkit-mask-image:' + t[1] + ';mask-image:' + t[1];
        el.insertBefore(d, el.firstChild); el.__mt = d;
      });
    });
  }
  setInterval(run, 1000); run();
})();

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
    en.forEach(function (e) { if (e.isIntersecting) { var d = e.target.__dk; if (d) d.style.opacity = '0'; io.unobserve(e.target); } });
  }, { rootMargin: '-38% 0px -38% 0px', threshold: 0 }) : null;   // Oct 11: stays dark until it reaches about the middle of the screen

  function busy(el) {
    if (el.hasAttribute('data-lift-bg') || el.hasAttribute('data-lift-once') || el.closest('[data-lift-bg]')) return true;
    if (el.closest('.rit-card,.hero-box,[data-m="hero"],[data-m="steps-wrap"],[data-m="bgstack"]')) return true;
    var cs = getComputedStyle(el);
    if (cs.animationName && cs.animationName !== 'none') return true;
    var pb = getComputedStyle(el, '::before'), pa = getComputedStyle(el, '::after');
    if ((pb.animationName && pb.animationName !== 'none') || (pa.animationName && pa.animationName !== 'none')) return true;
    if (/background|filter|--/.test(cs.transitionProperty) && parseFloat(cs.transitionDuration) > 0) return true;
    if (el.classList.contains('cd-lit') || el.matches('[data-ph="summit-arms-out"],[data-m="cd-fbox"],section.clean-band')) return true;
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
  window.__rcxMarble = marble;
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
    document.querySelectorAll('[data-pack-stage="box"],.pk-tile.pk-box').forEach(function (e) {
      if (e.__sv) return; e.__sv = 1;
      e.style.setProperty('background', slate(ns++, .55), 'important');
    });
    // any black clickable box or button, phone and desktop
    document.querySelectorAll('main button, main a, main label, main [role="button"], main [role="link"], main [onclick]').forEach(function (b) {
      if (b.__sv || b.__sl || b.closest('header,footer,nav,[data-m="player"],[data-ambient-btn],[data-m^="nav"],.mx-tabs,.shoptg-bar')) return;   // two-way switches style themselves
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

/* Oct 11: About page on phone. One background behind About the Brand (no lava), and the compost
   area is fully white marble before its heading, fading in from black and back out at the bottom. */
(function () {
  var MQ = matchMedia('(max-width:767px)');
  function run() {
    var c = document.querySelector('[data-screen-label="About"] section[data-m="about-compost"]');
    if (!c) return;
    if (c.__mb) return;
    c.__mb = 1;
    // Oct 11 (later): a Pacific Northwest beach at dusk instead of white marble
    c.style.setProperty('background', 'linear-gradient(#000 0,rgba(0,0,0,.45) 140px,rgba(0,0,0,.5) calc(100% - 220px),rgba(0,0,0,.7) calc(100% - 90px),#000 100%),url("assets/photo/about-beach-seastack.jpg") 50% 40%/cover no-repeat', 'important');
  }
  setInterval(run, 1000); run();
})();

/* Oct 11: no hard lines between backgrounds, anywhere. Wherever a full-width block with its own
   background meets the next one, a soft blurred band is laid over the seam (only in the empty space
   between boxes and words, so nothing readable gets blurred). */
(function () {
  if (!('backdropFilter' in document.documentElement.style) && !('webkitBackdropFilter' in document.documentElement.style)) return;
  var layer = null, sig = '';
  function hasBg(el) {
    var cs = getComputedStyle(el);
    if (cs.backgroundImage && cs.backgroundImage !== 'none') return true;
    var m = cs.backgroundColor.match(/[\d.]+/g);
    if (m && (m.length < 4 || +m[3] > 0.05)) return true;
    var b = getComputedStyle(el, '::before'), a = getComputedStyle(el, '::after');
    return (b.content !== 'none' && b.backgroundImage !== 'none') || (a.content !== 'none' && a.backgroundImage !== 'none');
  }
  function contentRects(root) {
    var out = [];
    root.querySelectorAll('h1,h2,h3,h4,p,li,a,button,img,svg,video,input,label,article,figure,[class*="box"],[class*="card"],[data-ph],.rit-nav,.cx-track > *').forEach(function (e) {
      var r = e.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      var cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || +cs.opacity === 0) return;
      if (r.width >= innerWidth - 4 && !/^(H\d|P|A|BUTTON|IMG|LI|LABEL|svg|SVG)$/.test(e.tagName) && !/box|card/.test(e.className)) return; // full-width wrappers are backgrounds, not content
      out.push([r.top + scrollY, r.bottom + scrollY]);
    });
    // Oct 12: a box border is never blurred or faded. Any element with a visible border counts as content,
    // so a seam band can never land on (or near) a box edge.
    root.querySelectorAll('*').forEach(function (e) {
      var cs = getComputedStyle(e);
      var bw = Math.max(parseFloat(cs.borderTopWidth) || 0, parseFloat(cs.borderBottomWidth) || 0, parseFloat(cs.borderLeftWidth) || 0);
      if (bw < 1 || cs.borderTopStyle === 'none' && cs.borderBottomStyle === 'none' && cs.borderLeftStyle === 'none') return;
      if (/rgba\([^)]*,\s*0\)|transparent/.test(cs.borderTopColor + cs.borderBottomColor)) return;
      var r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return;
      out.push([r.top + scrollY - 6, r.bottom + scrollY + 6]);
    });
    return out;
  }
  function run() {
    var page = [].slice.call(document.querySelectorAll('[data-screen-label]')).filter(function (e) { var r = e.getBoundingClientRect(); return r.height > 200 && r.width >= innerWidth - 4; })[0];
    var H = document.documentElement.scrollHeight;
    var s = (page ? page.getAttribute('data-screen-label') : '') + '|' + H + '|' + innerWidth;
    if (s === sig) return; sig = s;
    if (!layer) { layer = document.createElement('div'); layer.setAttribute('aria-hidden', 'true'); layer.setAttribute('data-seams', ''); layer.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:0;pointer-events:none;z-index:2147482000'; document.body.appendChild(layer); }
    layer.innerHTML = '';
    var main = document.querySelector('main') || document.body;
    var blocks = [].slice.call(main.querySelectorAll('section,div,footer')).filter(function (e) {
      var r = e.getBoundingClientRect();
      return r.height > 120 && r.width >= innerWidth - 4 && !e.closest('header,nav,[data-m="player"]') && hasBg(e);
    });
    var edges = [];
    blocks.forEach(function (e) { var r = e.getBoundingClientRect(); edges.push(r.top + scrollY, r.bottom + scrollY); });
    edges = edges.filter(function (y) { return y > 90 && y < H - 40; }).sort(function (a, b) { return a - b; });
    var uniq = []; edges.forEach(function (y) { if (!uniq.length || y - uniq[uniq.length - 1] > 24) uniq.push(y); });
    var cr = contentRects(main);
    // Oct 12: nothing ever blurs over the home seal; skip every seam within the hero section
    var hero = document.querySelector('section[data-m="hero"]'), hr = hero ? hero.getBoundingClientRect() : null;
    if (hr && hr.height) uniq = uniq.filter(function (y) { return y < hr.top + scrollY - 100 || y > hr.bottom + scrollY + 100; });
    uniq.forEach(function (y) {
      // largest free gap around the seam, up to 90px each side
      var up = 90, dn = 90;
      cr.forEach(function (c) {
        if (c[1] <= y && y - c[1] < up) up = y - c[1];
        if (c[0] >= y && c[0] - y < dn) dn = c[0] - y;
        if (c[0] < y && c[1] > y) { up = 0; dn = 0; }
      });
      var h = Math.min(up, dn);
      if (h < 18) return;
      var d = document.createElement('div');
      d.style.cssText = 'position:absolute;left:0;right:0;top:' + (y - h) + 'px;height:' + (2 * h) + 'px;backdrop-filter:blur(' + Math.round(h / 3.2) + 'px);-webkit-backdrop-filter:blur(' + Math.round(h / 3.2) + 'px);-webkit-mask-image:linear-gradient(transparent 0,#000 50%,transparent 100%);mask-image:linear-gradient(transparent 0,#000 50%,transparent 100%)';
      layer.appendChild(d);
    });
  }
  setInterval(run, 1500); setTimeout(run, 600);
  addEventListener('resize', function () { sig = ''; });
})();

/* Oct 11: About the Brand: white marble section (its own variation), black wet slate box, soft fades in and out */
(function () {
  function run() {
    var c = document.querySelector('[data-screen-label="About"] section[data-m="about-brand"]');
    if (!c) return;
    var ph = matchMedia('(max-width:767px)').matches;
    if (c.__mb !== (ph ? 2 : 1)) {
      c.__mb = ph ? 2 : 1;
      // Oct 11 (later): Mount Shasta with its lenticular clouds instead of white marble: where the brand began
      c.style.setProperty('background', 'linear-gradient(#000 0,rgba(0,0,0,.35) 150px,rgba(0,0,0,.4) calc(100% - 160px),#000 100%),url("assets/photo/about-shasta-clouds.jpg") 50% 50%/cover no-repeat', 'important');
    }
    var b = c.querySelector('.ab-brand-box');
    if (b && !b.__sl) { b.__sl = 1; b.style.setProperty('background', 'linear-gradient(rgba(0,0,0,.66),rgba(0,0,0,.78)),url("assets/photo/about-dogs-trio.jpg") 50% 40%/cover no-repeat', 'important'); }   // Oct 15 (Scott): his dogs, no waterfall walkers
  }
  setInterval(run, 1000); run();
})();



/* Oct 11: every magazine box gets its own blurred, color-boosted magazine rack photo under a dark filter */
(function () {
  var n = 0;
  var PRESS = [['nationalgeographic','natgeo'],['aol.com/lifestyle','parade'],['aol.com/articles','ny-post'],['forbes.com','forbes'],['womanandhome','woman-home'],['esquireindia','esquire'],['thehealthy','readers-digest'],['countryandtownhouse','country-town'],['dailymaverick','daily-maverick'],['newsweek','newsweek'],['popsci','popular-science'],['bloomberg','bloomberg'],['vault.si.com','sports-illustrated'],['outsideonline','outside'],['mensfitness','mens-fitness'],['which.co.uk','which'],['time.com','time']];
  function run() {
    document.querySelectorAll('a.mx-press').forEach(function (b) {
      if (b.__mr) return; b.__mr = 1;
      var k = (n++ % 10) + 1, h = b.getAttribute('href') || '', img = 'assets/photo/mag-rack-' + k + '.jpg', sh = '.5),rgba(0,0,0,.62)';
      // Oct 15: each box gets the painted, blurred feel of its own magazine's cover instead of a rack photo
      for (var i = 0; i < PRESS.length; i++) if (h.indexOf(PRESS[i][0]) >= 0) { img = 'assets/press/' + PRESS[i][1] + '.webp'; sh = '.16),rgba(0,0,0,.34)'; break; }
      b.style.setProperty('background', 'linear-gradient(rgba(0,0,0,' + sh + '),url("' + img + '") center/cover no-repeat', 'important');
    });
  }
  setInterval(run, 1000); run();
})();

/* Oct 11: every photo added on Oct 10 and 11 starts darker and slowly comes up to full brightness
   once it scrolls into view (background photos and plain pictures alike). */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var NEW = /assets\/photo\/(about-beach-seastack|about-shasta-clouds|dodge03-diver|lab-hand-closeup|lab-mushroom-extraction|lab-powder-coat|lab-reishi-weighing|lab-soxhlet-extraction|lab-steel-tanks|lm-grandma-girl-puzzle|lm-grandma-puzzle|lm-grandpa-football-park|lm-grandpa-kickoff|lm-grandpa-puzzle|lm-powder-pile|mag-rack-\d+|mess-counter|mess-counter-v2|mess-floor|mess-swirl|mtb-rider-side|cd-studied-clubs|a-freediver-surfacing-at-sunset|coffee-made-at-camp|how-mossy-tree|camp-adventure|thermos-pour-sunrise|map-mug-camera|kettle-tripod-camp|kitchen-shake|reef-aerial-aqua|reef-aerial-sky|tr-[a-z-]+|tt-airport-crowd|tt-airport-security-line|tt-baggage-claim-crowd|tt-feet-in-line|tt-queue-feet|tt-train-crowd|yoga-vertical)\./;
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (e.isIntersecting) {
        var d = e.target.__nk; if (d) requestAnimationFrame(function () { d.style.opacity = '0'; }); io.unobserve(e.target);
      }
    });
  }, { rootMargin: '-38% 0px -38% 0px', threshold: 0 }) : null;   // stays dark until about the middle of the screen
  // at the very bottom of a page nothing more can reach the middle, so whatever is on screen lights up
  addEventListener('scroll', function () { if (innerHeight + scrollY < document.documentElement.scrollHeight - 4) return; document.querySelectorAll('[data-new-dim]').forEach(function (d) { var r = d.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) d.style.opacity = '0'; }); }, { passive: true });
  function shade(css) { var d = document.createElement('div'); d.setAttribute('aria-hidden', 'true'); d.setAttribute('data-new-dim', ''); d.style.cssText = css + 'pointer-events:none;background:#000;opacity:.55;transition:opacity 11s cubic-bezier(.3,.1,.3,1) .5s'; return d; }
  function bg(el) {
    if (el.__nk || el.__nkSkip) return;
    var b = getComputedStyle(el).backgroundImage; if (!b || !NEW.test(b)) return;
    var r = el.getBoundingClientRect(); if (r.width < 100 || r.height < 80) return;
    if (el.__dk) { el.__dk.remove(); el.__dk = null; }  // the general dim is lighter; this one replaces it
    el.__skip = 1;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.isolation = 'isolate';
    var d = shade('position:absolute;inset:0;z-index:-1;border-radius:inherit;');
    el.insertBefore(d, el.firstChild); el.__nk = d;
    if (io) io.observe(el); else d.style.opacity = '0';
  }
  function img(im) {
    if (im.__nk || im.__nkSkip) return;
    var s = im.currentSrc || im.getAttribute('src') || ''; if (!NEW.test(s)) return;
    var p = im.parentElement; if (!p || im.offsetWidth < 100) return;
    if (getComputedStyle(p).position === 'static') p.style.position = 'relative';
    var d = shade('position:absolute;left:' + im.offsetLeft + 'px;top:' + im.offsetTop + 'px;width:' + im.offsetWidth + 'px;height:' + im.offsetHeight + 'px;border-radius:' + getComputedStyle(im).borderRadius + ';');
    p.insertBefore(d, im.nextSibling); im.__nk = d;
    if (io) io.observe(im); else d.style.opacity = '0';
  }
  function scan() {
    document.querySelectorAll('[style*="url("],[data-ph],[data-m],section,article,.mx-box,.cx-card,a[class],div[class]').forEach(bg);
    document.querySelectorAll('img').forEach(img);
  }
  setInterval(scan, 1200); scan();
})();

/* Oct 11: the Read Aloud button sits inside the gold frame, 18px in from the top and the right, with photo
   showing above it and beside it, never on the border. Same spot on every page. */
(function () {
  var IN = 18;
  function fix() {
    document.querySelectorAll('[data-screen-label] [data-tts-skip]:not([data-m="hdr-tts"])').forEach(function (d) {
      if (d.closest('[data-story-titleblock]') || getComputedStyle(d).position !== 'absolute' || !d.offsetHeight) return;
      var op = d.offsetParent, frame = null; if (!op) return;
      for (var p = d.parentElement, n = 0; p && n < 8 && !p.hasAttribute('data-screen-label'); p = p.parentElement, n++) {
        var c = getComputedStyle(p), bw = parseFloat(c.borderRightWidth); if (bw > 1.5 && bw < 10 && c.borderRightStyle !== 'none' && !/rgba\([^)]*,\s*0\)|transparent/.test(c.borderRightColor)) { frame = p; break; }
      }
      if (!frame) return;
      var fc = getComputedStyle(frame), fr = frame.getBoundingClientRect(), oc = getComputedStyle(op), orr = op.getBoundingClientRect();
      // Oct 15 (Scott): top LEFT corner on every page now
      var fTop = fr.top + parseFloat(fc.borderRightWidth), fLeft = fr.left + parseFloat(fc.borderLeftWidth);
      var oTop = orr.top + parseFloat(oc.borderTopWidth), oLeft = orr.left + parseFloat(oc.borderLeftWidth);
      var t = (IN + fTop - oTop).toFixed(1) + 'px', l = (IN + 4 + fLeft - oLeft).toFixed(1) + 'px';
      if (d.style.top !== t) d.style.setProperty('top', t, 'important');
      if (d.style.left !== l) d.style.setProperty('left', l, 'important');
      if (d.style.right !== 'auto') d.style.setProperty('right', 'auto', 'important');
      // keep the opening words clear of the button: they start below it
      var host = d.parentElement, br = d.getBoundingClientRect(), first = null;
      for (var k = host.firstElementChild; k; k = k.nextElementSibling) { if (k === d || k.contains(d) || !k.offsetHeight || getComputedStyle(k).position === 'absolute') continue; first = k; break; }
      if (first) { var fb = first.getBoundingClientRect(); if (fb.left < br.right && fb.right > br.left) { var gap = fb.top - br.bottom; if (gap < 14) { var pt = parseFloat(getComputedStyle(host).paddingTop) || 0; host.style.setProperty('padding-top', (pt + 14 - gap) + 'px', 'important'); } } }
    });
  }
  setInterval(fix, 1000); fix();
})();

/* Oct 11: mushroom page powder bands keep their white lead in and lead out (another script trims section padding) */
(function () {
  function fix() {
    document.querySelectorAll('section.clean-band[data-cb="lions-mane"],section.clean-band[data-cb="cordyceps"],section.clean-band[data-cb="turkey-tail"]').forEach(function (s) {
      if (s.style.getPropertyValue('padding-top') !== '130px') { s.style.setProperty('padding-top', '130px', 'important'); s.style.setProperty('padding-bottom', '130px', 'important'); s.style.setProperty('padding-left', '22px', 'important'); s.style.setProperty('padding-right', '22px', 'important'); }
    });
  }
  setInterval(fix, 1000); fix();
})();

/* Oct 11: Shop page. The arrow pair under the tins and boxes is gone; the same Steel Tins | Kraft Boxes switch
   from the top is repeated there instead, so you can flip between them from either end. */
(function () {
  function run() {
    var nav = document.querySelector('[data-screen-label="Shop"] .shoptg-nav');
    var bar = document.querySelector('[data-screen-label="Shop"] .shoptg-bar:not([data-bar-copy])');
    if (!nav || !bar) return;
    var prev = nav.previousElementSibling;
    if (prev && prev.hasAttribute('data-bar-copy')) return;
    var c = bar.cloneNode(true); c.setAttribute('data-bar-copy', ''); c.removeAttribute('data-dc-tpl');
    c.querySelectorAll('[data-dc-tpl]').forEach(function (e) { e.removeAttribute('data-dc-tpl'); });
    nav.parentNode.insertBefore(c, nav);
  }
  setInterval(run, 800); run();
})();

/* Oct 12: receipts files row: each card keeps its own photo under the lighter shade */
(function () {
  function run() {
    document.querySelectorAll('section[data-m="rc-files"] .cx-track>.mx-box').forEach(function (b) {
      if (b.__rc) return; var m = (b.getAttribute('style') || '').match(/url\(["'&quot;]*([^"'&)]+?\.(?:jpe?g|png|webp))/); if (!m) return;
      b.__rc = 1; b.style.setProperty('--rcimg', "url('" + m[1] + "')");
    });
  }
  setInterval(run, 1000); run();
})();

/* Oct 12: magazine cards: keep each cover photo under the lighter shade */
(function () {
  function run() {
    document.querySelectorAll('a.mx-box.mx-press[style*="mag-rack"]').forEach(function (b) {
      if (b.__mg) return; var m = (b.getAttribute('style') || '').match(/mag-rack-\d+\.jpg/); if (!m) return;
      b.__mg = 1; b.style.setProperty('--mag', "url('assets/photo/" + m[0] + "')");
    });
  }
  setInterval(run, 1000); run();
})();

/* Oct 12: desktop rows scroll by dragging with the mouse, the way they swipe on a phone */
(function () {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  var t = null, x0 = 0, s0 = 0, moved = 0;
  document.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    var el = e.target.closest && e.target.closest('.cx-track'); if (!el || el.scrollWidth <= el.clientWidth + 4) return;
    t = el; x0 = e.clientX; s0 = el.scrollLeft; moved = 0; e.preventDefault();
  });
  addEventListener('mousemove', function (e) {
    if (!t) return; var dx = e.clientX - x0; moved = Math.max(moved, Math.abs(dx));
    if (moved > 4) t.classList.add('rcx-dragging');
    t.scrollLeft = s0 - dx;
  });
  addEventListener('mouseup', function () {
    if (!t) return; var el = t; t = null;
    setTimeout(function () { el.classList.remove('rcx-dragging'); }, 0);
    if (moved > 4) { var kids = [].slice.call(el.children), best = null, bd = 1e9, L = el.getBoundingClientRect().left;
      kids.forEach(function (k) { var d = Math.abs(k.getBoundingClientRect().left - L - 10); if (d < bd) { bd = d; best = k; } });
      if (best) el.scrollTo({ left: el.scrollLeft + best.getBoundingClientRect().left - L - 10, behavior: 'smooth' }); }
  });
  document.addEventListener('click', function (e) { if (moved > 4 && e.target.closest && e.target.closest('.cx-track')) { e.preventDefault(); e.stopPropagation(); moved = 0; } }, true);
})();

/* Oct 12: About story boxes hand their photo to a layer under the text so the words flow without gaps */
(function () {
  function run() {
    var boxes = document.querySelectorAll('[data-screen-label="About"] .ab-grid .ab-box');
    for (var i = 0; i < boxes.length; i++) {
      var b = boxes[i]; if (b.classList.contains('ab-tight')) continue;
      var c = getComputedStyle(b), first = i === 0;
      var pos = c.backgroundPosition.split(',').map(function (p) {
        var t = p.trim().split(/\s+/); if (first || t.length < 2 || p.trim() === '0px 0px') return p.trim();
        var y = t[1]; if (/px$/.test(y)) y = (parseFloat(y) + 120) + 'px'; return t[0] + ' ' + y; }).join(',');
      b.style.setProperty('--abg', c.backgroundImage); b.style.setProperty('--abs', c.backgroundSize); b.style.setProperty('--abp', pos);
      b.classList.add('ab-tight');
    }
  }
  setInterval(run, 800); run();
})();
