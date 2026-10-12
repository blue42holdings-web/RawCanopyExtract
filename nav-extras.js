/* Oct 11
   1. The gold line with the plus shows on every page. The plus slides down the line as you scroll.
      Tap it and a quick menu opens: Shop, the three mushrooms, Receipts, Back to top.
   2. The back button works inside the site: every page you open is remembered, so Back takes you
      to the page you came from, at the spot you were reading.
   3. Links to outside sites open in the same tab, so the phone's Back arrow brings you straight back
      to the same page and the same spot. */
(function () {
  var restoring = false;
  var r = document.getElementById('rcx-rail');
  function pageNow() {
    var v = [].slice.call(document.querySelectorAll('[data-screen-label]')).filter(function (e) { var b = e.getBoundingClientRect(); return b.height > 300; })[0];
    return v ? v.getAttribute('data-screen-label') : '';
  }
  function goTo(p) {
    var a = [].slice.call(document.querySelectorAll('[data-page="' + p + '"]'));
    var v = a.filter(function (e) { return e.getBoundingClientRect().height > 0; })[0] || a[0];
    if (v) { v.click(); return true; }
    // the mushroom pages are only linked from The Mushrooms page and the home page, so hop through it
    var hub = document.querySelector('[data-page="mushrooms"]') || document.querySelector('[data-page="home"]');
    if (hub && p !== 'mushrooms') {
      var was = restoring; restoring = true;
      hub.click();
      var n = 0, t = setInterval(function () {
        var b = [].slice.call(document.querySelectorAll('[data-page="' + p + '"]'))[0];
        if (b) { clearInterval(t); b.click(); scrollTo(0, 0); restoring = was; } else if (++n > 20) { clearInterval(t); restoring = was; }
      }, 60);
      return true;
    }
    return false;
  }
  /* ---- rail ---- */
  if (r) {
    var btn = r.querySelector('button');
    function tick() {
      var y = scrollY, H = document.documentElement.scrollHeight - innerHeight;
      r.classList.toggle('on', y > innerHeight * 0.35 || r.classList.contains('open'));
      var f = H > 0 ? Math.min(1, Math.max(0, y / H)) : 0;
      r.style.setProperty('--rr', (6 + f * 88).toFixed(1) + '%');
    }
    addEventListener('scroll', tick, { passive: true }); setInterval(tick, 700); tick();
    btn.addEventListener('click', function (e) { e.stopPropagation(); r.classList.toggle('open'); tick(); });
    r.querySelectorAll('.rr-menu a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation(); r.classList.remove('open');
        var g = a.getAttribute('data-go');
        if (g === 'top') { try { scrollTo({ top: 0, behavior: 'smooth' }); } catch (x) { scrollTo(0, 0); } return; }
        if (goTo(g)) scrollTo(0, 0);
      });
    });
    document.addEventListener('click', function (e) { if (!r.contains(e.target)) r.classList.remove('open'); });
  }
  /* ---- in-site history ---- */
  var cur = 'home';
  try { history.scrollRestoration = 'manual'; } catch (x) {}
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-page]');
    if (!el || restoring || (r && r.contains(el))) return;
    var p = el.getAttribute('data-page'); if (!p || p === cur) return;
    try { history.replaceState({ p: cur, y: scrollY }, '', '#' + cur); history.pushState({ p: p, y: 0 }, '', '#' + p); } catch (x) {}
    cur = p;
  }, true);
  if (r) r.addEventListener('click', function (e) {
    var a = e.target.closest('.rr-menu a'); if (!a) return; var p = a.getAttribute('data-go'); if (p === 'top' || p === cur) return;
    try { history.replaceState({ p: cur, y: scrollY }, '', '#' + cur); history.pushState({ p: p, y: 0 }, '', '#' + p); } catch (x) {}
    cur = p;
  }, true);
  function restore(p, y) {
    restoring = true;
    if (p && p !== cur) goTo(p);
    cur = p || 'home';
    var n = 0, t = setInterval(function () { scrollTo(0, y || 0); if (++n > 8) { clearInterval(t); restoring = false; } }, 120);
  }
  addEventListener('popstate', function (e) {
    var st = e.state || {}; var p = st.p || (location.hash || '#home').slice(1);
    restore(p, st.y || 0);
  });
  /* ---- outside links: same tab, remember where we were ---- */
  function external(a) { try { var u = new URL(a.href, location.href); return /^https?:$/.test(u.protocol) && u.host !== location.host; } catch (x) { return false; } }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var a = e.target.closest && e.target.closest('a[href]'); if (!a || !external(a)) return;
    a.removeAttribute('target');
    try { history.replaceState({ p: cur, y: scrollY }, '', '#' + cur); sessionStorage.setItem('rcxBack', JSON.stringify({ p: cur, y: scrollY })); } catch (x) {}
  }, true);
  /* coming back (or opening a link with #page) */
  function boot() {
    var st = null; try { st = history.state || JSON.parse(sessionStorage.getItem('rcxBack') || 'null'); } catch (x) {}
    var p = (location.hash || '').slice(1) || (st && st.p) || '';
    if (!p || p === 'home') { if (st && st.y) restore('home', st.y); return; }
    var tries = 0, t = setInterval(function () {
      if (document.querySelector('[data-page="' + p + '"]')) { clearInterval(t); restore(p, st && st.p === p ? st.y : 0); }
      else if (++tries > 40) clearInterval(t);
    }, 150);
  }
  if (document.readyState === 'complete') setTimeout(boot, 300); else addEventListener('load', function () { setTimeout(boot, 300); });
  addEventListener('pageshow', function (e) { if (e.persisted) { var st = history.state; if (st) restore(st.p, st.y); } });
})();

/* Oct 11: row arrows, smooth every frame. A tap glides one box (a page on a computer) with a slow,
   eased start and finish. Holding glides continuously, easing up to speed, and on release it eases
   into the next box instead of snapping. Phones only scroll in whole pixels, so the leftover fraction
   of a pixel is carried by a sub pixel shift of the boxes: no stepping, no jitter, no jump at the end. */
(function () {
  var st = document.createElement('style');
  st.textContent = '.cx .rit-arrow[data-d]{-webkit-user-select:none;user-select:none;-webkit-touch-callout:none;touch-action:none}' +
    '.cx-track[data-glide]>*{transform:translate3d(calc(var(--sub,0) * -1px),0,0)}';
  document.head.appendChild(st);
  var phone = function () { return innerWidth < 768; };
  var A = null, swallow = false, pressTimer = null, press = null;
  function snaps(t) {
    var tr = t.getBoundingClientRect(), cs = getComputedStyle(t), pl = parseFloat(cs.scrollPaddingLeft) || 0, out = [];
    [].forEach.call(t.children, function (k) {
      var r = k.getBoundingClientRect(), al = (getComputedStyle(k).scrollSnapAlign || '').split(' ').pop();
      var x = al === 'center' ? (r.left + r.width / 2) - tr.left + t.scrollLeft - t.clientWidth / 2
            : (r.left - tr.left) + t.scrollLeft - pl;
      out.push(Math.round(Math.max(0, Math.min(t.scrollWidth - t.clientWidth, x))));
    });
    return out.sort(function (p, q) { return p - q; });
  }
  function begin(t) {
    if (A && A.t !== t) end(A, true);
    if (!A) { A = { t: t, pos: t.scrollLeft }; t.style.scrollSnapType = 'none'; t.style.scrollBehavior = 'auto'; t.setAttribute('data-glide', ''); }
    return A;
  }
  function place(a, x) {
    var max = a.t.scrollWidth - a.t.clientWidth; x = Math.max(0, Math.min(max, x)); a.pos = x;
    var base = Math.floor(x); if (a.t.scrollLeft !== base) a.t.scrollLeft = base;
    a.t.style.setProperty('--sub', (x - a.t.scrollLeft).toFixed(3));
  }
  function end(a, keep) {
    cancelAnimationFrame(a.raf);
    a.t.style.setProperty('--sub', '0'); a.t.removeAttribute('data-glide');
    if (!keep) a.t.scrollLeft = Math.round(a.pos);
    a.t.style.scrollSnapType = ''; a.t.style.scrollBehavior = '';
    if (A === a) A = null;
  }
  function ease(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }   // slow in, slow out
  function glideTo(a, x, v0) {                     // eased move from where we are to x (v0: speed we are already moving at, px/s)
    cancelAnimationFrame(a.raf);
    var from = a.pos, dist = x - from; if (Math.abs(dist) < 0.5) { place(a, x); end(a); return; }
    var dur = Math.max(900, Math.min(1700, 900 + Math.abs(dist) * 2.2));            // slow and deliberate
    if (v0) dur = Math.max(400, Math.min(4500, 3 * Math.abs(dist) / Math.abs(v0) * 1000));   // ease out starts at the speed we were already going
    var t0 = performance.now();
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur);
      var e = v0 ? 1 - Math.pow(1 - p, 3) : ease(p);   // after a hold, keep the momentum and ease out
      place(a, from + dist * e);
      if (p < 1) a.raf = requestAnimationFrame(step); else end(a);
    })(t0);
  }
  function tap(t, d) {
    var a = begin(t), S = snaps(t), cur = a.pos, x;
    if (phone()) {
      x = d > 0 ? S.filter(function (s) { return s > cur + 2; })[0] : S.filter(function (s) { return s < cur - 2; }).pop();
      if (x === undefined) x = d > 0 ? t.scrollWidth - t.clientWidth : 0;
    } else {
      var want = cur + d * t.clientWidth * 0.92, best = want, bd = 1e9;
      S.forEach(function (s) { var dd = Math.abs(s - want); if (dd < bd) { bd = dd; best = s; } }); x = best;
    }
    glideTo(a, x);
  }
  function holdStart(t, d) {
    var a = begin(t); cancelAnimationFrame(a.raf);
    var t0 = performance.now(), last = t0, sdt = 1 / 60; a.v = 0; a.d = d; a.holding = true;
    var vmax = phone() ? 150 : 260;
    (function step(now) {
      if (!a.holding) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now; sdt += (dt - sdt) * 0.15;   // even out uneven frames
      var k = Math.min(1, (now - t0) / 1400); k = k * k * (3 - 2 * k);    // eases up to speed
      a.v = vmax * k; place(a, a.pos + d * a.v * sdt);
      a.raf = requestAnimationFrame(step);
    })(t0);
  }
  function holdEnd() {
    var a = A; if (!a || !a.holding) return; a.holding = false;
    var S = snaps(a.t), cur = a.pos, d = a.d;
    var room = Math.max(1, (a.v || 60) * 0.4);                                      // enough distance to slow down gently
    var x = d > 0 ? S.filter(function (s) { return s > cur + room; })[0] : S.filter(function (s) { return s < cur - room; }).pop();
    if (x === undefined) x = d > 0 ? a.t.scrollWidth - a.t.clientWidth : 0;
    glideTo(a, x, a.v || 60);
  }
  document.addEventListener('pointerdown', function (e) {
    var b = e.target.closest && e.target.closest('.cx .rit-arrow[data-d]');
    if (!b) { if (A && A.t.contains(e.target)) end(A); return; }     // a finger on the row takes over
    var t = b.closest('.cx').querySelector('.cx-track'); if (!t) return;
    press = { t: t, d: Number(b.dataset.d) || 1, held: false };
    clearTimeout(pressTimer);
    pressTimer = setTimeout(function () { if (press) { press.held = true; holdStart(press.t, press.d); } }, 280);
  }, true);
  function release() {
    clearTimeout(pressTimer);
    if (press && press.held) { holdEnd(); swallow = true; setTimeout(function () { swallow = false; }, 400); }
    press = null;
  }
  ['pointerup', 'pointercancel'].forEach(function (ev) { addEventListener(ev, release, true); });
  addEventListener('blur', function () { release(); if (A) end(A); });
  addEventListener('contextmenu', function (e) { if (e.target.closest && e.target.closest('.cx .rit-arrow')) e.preventDefault(); }, true);
  addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.cx .rit-arrow[data-d]');
    if (!b) return;
    e.stopPropagation(); e.stopImmediatePropagation(); e.preventDefault();       // our glide replaces the old jump
    if (swallow) { swallow = false; return; }
    var t = b.closest('.cx').querySelector('.cx-track'); if (t) tap(t, Number(b.dataset.d) || 1);
  }, true);
})();

/* Oct 11: every page drifts slowly down on its own. Touch, swipe, wheel or keys take over; after
   20 quiet seconds it carries on down from wherever they left it. At the bottom it rests, glides
   back to the top, then starts down again. Very slow to start, very slow to stop, and smooth every
   frame: phones only scroll in whole pixels, so the leftover fraction of a pixel is carried by a
   tiny sub pixel shift of the page (no stepping, no jitter). */
(function () {
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var phone = function () { return innerWidth < 768; };
  var DOWN = function () { return phone() ? 14 : 18; };   // px per second at full speed, very slow
  var UP = 380;                                            // px per second on the glide back to the top
  var IDLE = 20000, WAIT = 20000;                          // 20 seconds of stillness before it moves
  var RAMP_IN = 7000, EASE_OUT = 360;                      // 7 seconds to reach speed; slows over the last 360px
  var mode = 'wait', until = performance.now() + WAIT, pos = scrollY, last = 0, sdt = 1 / 60, ramp0 = 0;
  var frac = null, shifted = false;
  function root() { return document.getElementById('dc-root'); }
  function unshift() { if (shifted) { var r = root(); if (r) r.style.transform = ''; shifted = false; } }
  function user() { unshift(); mode = 'wait'; until = performance.now() + IDLE; }
  ['touchstart', 'touchmove', 'wheel', 'mousedown', 'keydown'].forEach(function (ev) { addEventListener(ev, user, { passive: true, capture: true }); });
  document.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-page],.rr-menu a')) { unshift(); mode = 'wait'; until = performance.now() + WAIT; } }, true);
  addEventListener('popstate', function () { unshift(); mode = 'wait'; until = performance.now() + WAIT; });
  function jump(y) { var h = document.documentElement, b = h.style.scrollBehavior; h.style.scrollBehavior = 'auto'; window.scrollTo(0, y); h.style.scrollBehavior = b; }
  function fixedInside() {   // the story player bar or the menu drawer are fixed inside the page; never shift the page under them
    var r = root(); if (!r) return true;
    var f = r.querySelectorAll('[data-m="player"],[style*="position:fixed"]');
    for (var i = 0; i < f.length; i++) { if (f[i].getBoundingClientRect().height > 0) return true; }
    return false;
  }
  function place(y) {
    if (frac === null) { var b0 = Math.floor(y); jump(b0 + 0.5); frac = (scrollY % 1) !== 0; }   // can this browser scroll by part of a pixel?
    if (frac || fixedInside()) { unshift(); jump(y); return; }
    var base = Math.floor(y), r = root();
    if (Math.round(scrollY) !== base) jump(base);
    if (r) { r.style.transform = 'translate3d(0,' + (-(y - base)).toFixed(3) + 'px,0)'; shifted = true; }
  }
  function blocked() {
    if (document.hidden) return true;
    var rail = document.getElementById('rcx-rail'); if (rail && rail.classList.contains('open')) return true;
    var a = document.activeElement; if (a && /^(INPUT|TEXTAREA|SELECT|IFRAME)$/.test(a.tagName)) return true;   // an iframe gets focus when someone taps play on an embedded video
    if (document.fullscreenElement || document.webkitFullscreenElement) return true;
    var st = window.__rcxAudio; if (st && !st.paused && !st.ended) return true;                                     // the story is playing and moving its own slides
    var vs = document.getElementsByTagName('video');
    for (var i = 0; i < vs.length; i++) { var v = vs[i]; if (!v.paused && !v.ended && (!v.muted || v.controls) && v.offsetHeight > 0) return true; }  // someone is watching a video
    var hs = getComputedStyle(document.documentElement).overflowY, bs = getComputedStyle(document.body).overflowY;
    if (hs === 'hidden' || bs === 'hidden') return true;            // a menu, cart or popup has locked the page
    var r = root(); if (r) { var d = r.querySelectorAll('[style*="position:fixed;inset"]'); for (var j = 0; j < d.length; j++) if (d[j].getBoundingClientRect().height > 0) return true; }   // the menu drawer is open
    return false;
  }
  function ss(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x * x * x * (x * (x * 6 - 15) + 10); }   // smootherstep: gentle at both ends
  function frame(now) {
    var dt = last ? Math.min(1 / 30, (now - last) / 1000) : 1 / 60; last = now;
    sdt += (dt - sdt) * 0.15;                                                   // smooth out uneven frame timing
    var H = document.documentElement.scrollHeight - innerHeight;
    if (H > 40 && !blocked()) {
      var real = scrollY + (shifted ? (pos - Math.floor(pos)) : 0);
      if (Math.abs(real - pos) > 3) pos = scrollY;                              // something else moved the page
      if (mode === 'wait' && now >= until) { mode = (scrollY >= H - 2) ? 'rest' : 'down'; until = now + 3500; ramp0 = now; }
      if (mode === 'down') {
        var k = ss((now - ramp0) / RAMP_IN) * Math.max(0.03, ss((H - pos) / EASE_OUT));
        pos = Math.min(H, pos + DOWN() * k * sdt);
        place(pos);
        if (pos >= H - 0.5) { pos = H; unshift(); jump(H); mode = 'rest'; until = now + 3500; }
      } else if (mode === 'rest' && now >= until) {
        mode = 'up'; ramp0 = now;
      } else if (mode === 'up') {
        var v = UP * ss((now - ramp0) / 2500) * Math.max(0.02, ss(pos / 700));
        pos = Math.max(0, pos - Math.max(4, v) * sdt);
        place(pos);
        if (pos <= 0) { pos = 0; unshift(); jump(0); mode = 'wait'; until = now + WAIT; }
      } else { unshift(); }
    } else { unshift(); pos = scrollY; }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

/* Oct 11: the gold line on the right comes alive now and then. A flare of light runs down the line
   (sometimes up), and the plus gives a little "tap me" pulse. */
(function () {
  var r = document.getElementById('rcx-rail'); if (!r) return;
  var st = document.createElement('style');
  st.textContent =
    '#rcx-rail .rr-flare{position:absolute;left:50%;width:3px;height:110px;margin-left:-1.5px;border-radius:3px;pointer-events:none;opacity:0;' +
    'background:linear-gradient(rgba(255,226,160,0),rgba(255,236,190,.95) 50%,rgba(255,226,160,0));box-shadow:0 0 10px 2px rgba(240,200,120,.55)}' +
    '#rcx-rail .rr-flare.dn{animation:rrFlareDn 1.9s cubic-bezier(.45,0,.35,1) forwards}' +
    '#rcx-rail .rr-flare.up{animation:rrFlareUp 1.9s cubic-bezier(.45,0,.35,1) forwards}' +
    '@keyframes rrFlareDn{0%{top:-110px;opacity:0}12%{opacity:1}88%{opacity:1}100%{top:100%;opacity:0}}' +
    '@keyframes rrFlareUp{0%{top:100%;opacity:0}12%{opacity:1}88%{opacity:1}100%{top:-110px;opacity:0}}' +
    '#rcx-rail button.rr-poke{animation:rrPoke 1.1s ease}' +
    '#rcx-rail button.rr-poke::after{content:"";position:absolute;inset:-2px;border-radius:50%;border:1.5px solid #E9C079;animation:rrRing 1.1s ease-out forwards;pointer-events:none}' +
    '@keyframes rrPoke{0%{transform:translateY(-50%) scale(1)}18%{transform:translateY(-50%) scale(1.28) rotate(90deg);background:#D4A24A;color:#000}' +
    '36%{transform:translateY(-50%) scale(.92) rotate(90deg)}54%{transform:translateY(-50%) scale(1.12) rotate(90deg);background:#D4A24A;color:#000}100%{transform:translateY(-50%) scale(1) rotate(90deg)}}' +
    '@keyframes rrRing{0%{transform:scale(1);opacity:.9}100%{transform:scale(2.4);opacity:0}}';
  document.head.appendChild(st);
  var f = document.createElement('span'); f.className = 'rr-flare'; r.insertBefore(f, r.firstChild);
  var btn = r.querySelector('button');
  function flare() {
    if (r.classList.contains('on') && !r.classList.contains('open')) {
      var up = Math.random() < 0.35;
      f.className = 'rr-flare'; void f.offsetWidth; f.className = 'rr-flare ' + (up ? 'up' : 'dn');
      if (Math.random() < 0.6) setTimeout(poke, 1500);
    }
    setTimeout(flare, 7000 + Math.random() * 9000);
  }
  function poke() {
    if (!btn || r.classList.contains('open') || !r.classList.contains('on')) return;
    btn.classList.remove('rr-poke'); void btn.offsetWidth; btn.classList.add('rr-poke');
    setTimeout(function () { btn.classList.remove('rr-poke'); }, 1200);
  }
  setTimeout(flare, 4000);
  setInterval(function () { if (Math.random() < 0.5) poke(); }, 13000);
})();

/* Oct 11: lab report boxes get photo backgrounds. Turkey Tail and crowd numbers: crowded airports,
   stations, lines. Extraction and filler talk: the lab. Every other numbers box: modern transport. */
(function () {
  var P = 'assets/photo/';
  var CROWD = ['tt-train-crowd.jpg', 'tt-baggage-claim-crowd.jpg', 'tt-airport-crowd.jpg', 'tt-airport-security-line.jpg', 'tt-feet-in-line.jpg'];
  var MOVE = ['tr-maglev.jpg', 'tr-bullet-tunnel.jpg', 'tr-future-train.jpg', 'tr-train-night.jpg', 'tr-rail-city.jpg', 'tr-bus-motion.jpg'];
  var LAB = ['lab-powder-coat.jpg', 'lab-steel-tanks.jpg'];
  function run() {
    var groups = new Map();
    document.querySelectorAll('a.mx-lab').forEach(function (b) {
      var g = b.closest('[data-screen-label]') || document.body;
      if (!groups.has(g)) groups.set(g, []); groups.get(g).push(b);
    });
    var pi = 0;
    groups.forEach(function (list) {
      var c = 0, m = (pi++) * 3, l = 0;
      list.forEach(function (b) {
        var t = ((b.querySelector('.lab-title') || {}).textContent || '').toUpperCase();
        var img;
        if (/TURKEY|TRAMETES|POPULATION/.test(t)) img = CROWD[c++ % CROWD.length];
        else if (/FILLER|MYCELIUM|EXTRACT/.test(t)) img = LAB[l++ % LAB.length];
        else img = MOVE[m++ % MOVE.length];
        if (b.__lab === img) return;
        b.__lab = img; b.__sv = 1;
        b.style.setProperty('background', 'linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.8)),url("' + P + img + '") center/cover no-repeat', 'important');
      });
    });
  }
  setInterval(run, 1200); run();
})();

/* Oct 11: the quick menu opens as a wheel. It always fits on screen wherever the plus is, the item in the
   middle is large and bright, the others shrink and dim, and sliding a thumb up or down rolls the wheel. */
(function () {
  var r = document.getElementById('rcx-rail'); if (!r) return;
  var m = r.querySelector('.rr-menu'), btn = r.querySelector('button'); if (!m || !btn) return;
  var IH = 42, VIS = 11;                                 // item height; window tall enough that every item always shows
  var st = document.createElement('style');
  st.textContent =
    '#rcx-rail .rr-menu.rr-wheel{position:fixed !important;right:46px !important;top:var(--rw-top,0px) !important;transform:translateX(12px) !important;height:' + (IH * VIS) + 'px;overflow-y:auto;scroll-snap-type:y mandatory;' +
      'overscroll-behavior:contain;-webkit-overflow-scrolling:touch;scrollbar-width:none;gap:0 !important;padding:' + (IH * 5) + 'px 6px;box-sizing:border-box;perspective:420px}' +
    '#rcx-rail.open .rr-menu.rr-wheel{transform:none !important}' +
    '#rcx-rail .rr-menu.rr-wheel::-webkit-scrollbar{display:none}' +
    '#rcx-rail .rr-menu.rr-wheel a{scroll-snap-align:center;height:' + (IH - 8) + 'px;margin:4px 0;box-sizing:border-box;display:flex !important;align-items:center;justify-content:flex-end;' +
      'transform-origin:100% 50%;transition:transform .12s linear,opacity .12s linear,background .2s,color .2s;will-change:transform,opacity}' +
    '#rcx-rail .rr-menu.rr-wheel a.rr-mid{background:#D4A24A !important;color:#000 !important}';
  document.head.appendChild(st);
  m.classList.add('rr-wheel');
  var items = [].slice.call(m.querySelectorAll('a'));
  function paint() {
    var c = m.scrollTop + m.clientHeight / 2, best = null, bd = 1e9;
    items.forEach(function (a) {
      var mid = a.offsetTop + a.offsetHeight / 2, d = Math.abs(mid - c) / IH;
      var sd = (mid - c) / IH;                                            // signed: above or below the middle
      var s = Math.max(0.5, 1.12 - d * 0.13), o = Math.max(0.3, 1 - d * 0.16);
      a.style.transform = 'rotateX(' + (-sd * 13).toFixed(1) + 'deg) scale(' + s.toFixed(3) + ')'; a.style.opacity = o.toFixed(3);   // like a wheel turned a little to the side
      if (d < bd) { bd = d; best = a; }
    });
    items.forEach(function (a) { a.classList.toggle('rr-mid', a === best); });
    if (best !== lastMid) { if (lastMid && r.classList.contains('open')) tick(); lastMid = best; }
  }
  // a soft dry click each time a new item rolls into the middle
  var lastMid = null, actx = null;
  function tick() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      if (!actx) actx = new AC(); if (actx.state === 'suspended') actx.resume();
      var t = actx.currentTime, n = Math.floor(actx.sampleRate * 0.012), b = actx.createBuffer(1, n, actx.sampleRate), d = b.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 4);
      var src = actx.createBufferSource(); src.buffer = b;
      var bp = actx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2600; bp.Q.value = 1.4;
      var g = actx.createGain(); g.gain.value = 0.22;
      src.connect(bp); bp.connect(g); g.connect(actx.destination); src.start(t);
    } catch (e) {}
  }
  m.addEventListener('scroll', function () { requestAnimationFrame(paint); }, { passive: true });
  function place() {
    var rr = r.getBoundingClientRect(), b = btn.getBoundingClientRect();
    var H = IH * VIS, want = b.top + b.height / 2 - H / 2;               // centered on the plus
    var minTop = 76, maxTop = innerHeight - H - 16;                      // but always fully on screen
    want = Math.max(minTop, Math.min(maxTop, want));
    r.style.setProperty('--rw-top', want + 'px');
  }
  function centerOn(i) {
    var a = items[i]; if (!a) return;
    m.style.scrollSnapType = 'none';
    m.scrollTop = a.offsetTop + a.offsetHeight / 2 - m.clientHeight / 2;
    requestAnimationFrame(function () { m.style.scrollSnapType = ''; paint(); });
  }
  new MutationObserver(function () {
    if (r.classList.contains('open')) {
      place();
      // start on the item that matches where you are on the page: near the top, the top of the list; further down, further down the list
      var H = document.documentElement.scrollHeight - innerHeight, f = H > 0 ? scrollY / H : 0;
      centerOn(Math.round(f * (items.length - 1)));
    }
  }).observe(r, { attributes: true, attributeFilter: ['class'] });
  addEventListener('resize', function () { if (r.classList.contains('open')) place(); });
  // a tap on a dim item first rolls it to the middle; a tap on the bright middle one goes there
  m.addEventListener('click', function (e) {
    var a = e.target.closest('a'); if (!a || a.classList.contains('rr-mid')) return;
    e.preventDefault(); e.stopImmediatePropagation(); e.stopPropagation();
    m.scrollTo({ top: a.offsetTop + a.offsetHeight / 2 - m.clientHeight / 2, behavior: 'smooth' });
  }, true);
  paint();
})();
