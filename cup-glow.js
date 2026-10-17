/* Oct 17 (Scott): the white enamel cup in the hand behind the home description is cut out and slowly glows on.
   Just the cup. The cut-out layer copies the photo's own size and position, so it sits exactly on the cup on phone and desktop. */
(function () {
  if (window.__cupGlow) return; window.__cupGlow = 1;
  var CUT = 'assets/cutouts/map-mug-cup-only.webp';
  var css = document.createElement('style');
  css.textContent = '@keyframes rcxCupGlow{0%{opacity:0;filter:brightness(1) drop-shadow(0 0 0 rgba(255,226,170,0))}' +
    '35%{opacity:1;filter:brightness(1.25) drop-shadow(0 0 6px rgba(255,226,170,.55)) drop-shadow(0 0 18px rgba(255,210,140,.35))}' +
    '100%{opacity:1;filter:brightness(1.45) drop-shadow(0 0 10px rgba(255,230,180,.8)) drop-shadow(0 0 30px rgba(255,205,130,.5))}}' +
    '@keyframes rcxCupBreath{0%,100%{filter:brightness(1.45) drop-shadow(0 0 10px rgba(255,230,180,.8)) drop-shadow(0 0 30px rgba(255,205,130,.5))}' +
    '50%{filter:brightness(1.3) drop-shadow(0 0 7px rgba(255,230,180,.6)) drop-shadow(0 0 20px rgba(255,205,130,.35))}}' +
    '[data-cup-glow]{position:absolute;inset:0;pointer-events:none;z-index:0;background-repeat:no-repeat;border-radius:inherit;opacity:0}' +
    '[data-cup-glow].on{animation:rcxCupGlow 4.5s ease-out 1s forwards,rcxCupBreath 5s ease-in-out 5.5s infinite}' +
    '@media (prefers-reduced-motion:reduce){[data-cup-glow].on{animation:none;opacity:1;filter:brightness(1.35) drop-shadow(0 0 10px rgba(255,230,180,.7))}}';
  document.head.appendChild(css);
  function split(v) { var o = [], d = 0, c = ''; for (var i = 0; i < v.length; i++) { var ch = v[i]; if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && d === 0) { o.push(c.trim()); c = ''; } else c += ch; } o.push(c.trim()); return o; }
  function run() {
    var els = document.querySelectorAll('[data-screen-label="Home — mushrooms"] div, [data-m="home-para"]');
    for (var i = 0; i < els.length; i++) {
      var e = els[i]; if (!e.offsetHeight) continue;
      var cs = getComputedStyle(e), bi = cs.backgroundImage; if (bi.indexOf('map-mug-camera') < 0) continue;
      var L = split(bi), k = -1; for (var j = 0; j < L.length; j++) if (L[j].indexOf('map-mug-camera') >= 0) k = j; if (k < 0) continue;
      var sz = split(cs.backgroundSize), ps = split(cs.backgroundPosition), S = sz[k % sz.length], P = ps[k % ps.length];
      var g = e.__cup;
      if (!g || !g.isConnected) {
        if (cs.position === 'static') e.style.position = 'relative';
        [].forEach.call(e.children, function (c) { var cc = getComputedStyle(c); if (cc.position === 'static') { c.style.position = 'relative'; c.style.zIndex = '1'; } else if (cc.zIndex === 'auto') c.style.zIndex = '1'; });
        g = document.createElement('div'); g.setAttribute('data-cup-glow', ''); g.style.backgroundImage = 'url("' + CUT + '")';
        e.insertBefore(g, e.firstChild); e.__cup = g;
        (function (g, e) { var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { g.classList.add('on'); io.disconnect(); } }); }, { threshold: 0.35 }); io.observe(e); })(g, e);
      }
      if (g.__s !== S + '|' + P) { g.__s = S + '|' + P; g.style.backgroundSize = S; g.style.backgroundPosition = P; }
    }
  }
  setInterval(run, 700); addEventListener('resize', run); run();
})();
