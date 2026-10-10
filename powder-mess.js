/* Kitchen card: powder pouring from the scoop and spilling everywhere (Oct 10).
   Draws on a canvas over the "In your kitchen" card, in the photo's own pixel
   coordinates (kitchen-shake.jpg is 1279x720, shown with cover/center). */
(function () {
  var IMG_W = 1279, IMG_H = 720;
  var LIP = { x: 556, y: 405 };          // front edge of the scoop
  var CUP = { l: 494, r: 600, y: 468 };  // blender rim
  var COUNTER_Y = 700;                   // counter surface near the cup base
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setup(card) {
    if (card.__pm) return; card.__pm = 1;
    var cv = document.createElement('canvas');
    cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none;' +
      'transform-origin:53.5% 95.1%;transform:scale(1);border-radius:inherit';
    card.insertBefore(cv, card.firstChild);
    var ctx = cv.getContext('2d');
    var parts = [], puffs = [], pile = [], running = false, t0 = 0, raf = 0;
    var W = 0, H = 0, s = 1, ox = 0, oy = 0, dpr = Math.min(2, window.devicePixelRatio || 1);

    function fit() {
      var r = card.getBoundingClientRect(); W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      s = Math.max(W / IMG_W, H / IMG_H); ox = (W - IMG_W * s) / 2; oy = (H - IMG_H * s) / 2;
    }
    function X(x) { return ox + x * s; } function Y(y) { return oy + y * s; }

    function spawn(n) {
      for (var i = 0; i < n; i++) {
        var miss = Math.random() < 0.45, x0 = LIP.x + (Math.random() - 0.5) * 16;
        var tx = miss ? (Math.random() < 0.5 ? CUP.l - 4 - Math.random() * 30 : CUP.r + 4 + Math.random() * 30) : x0 + (Math.random() - 0.5) * 20;
        parts.push({
          x: x0, y: LIP.y + Math.random() * 6, miss: miss,
          vx: (tx - x0) / 34 + (Math.random() - 0.5) * 0.15,
          vy: 0.4 + Math.random() * 0.8, r: 0.7 + Math.random() * 1.3, a: 0.6 + Math.random() * 0.35,
          land: 668 + Math.random() * 20
        });
      }
    }
    function puff(x, y, big) {
      if (puffs.length > 40) return; puffs.push({ x: x, y: y, r: big ? 5 : 3, g: big ? 0.5 : 0.35, a: big ? 0.35 : 0.25 });
    }

    function step(now) {
      if (!running) return;
      var el = now - t0;
      // follow the card's lift: scale 1 -> 1.08 over 9s after 1.5s
      var p = Math.min(1, Math.max(0, (el - 1500) / 9000)); p = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      cv.style.transform = 'scale(' + (1 + 0.08 * p).toFixed(4) + ')';
      if (el > 1800) spawn(el < 2600 ? 4 : 9);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      // spotlight: darken everything except around the pour
      var g = ctx.createRadialGradient(X(548), Y(540), 30 * s, X(548), Y(540), 330 * s);
      var k = Math.min(1, Math.max(0, (el - 1800) / 2500));
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,' + (0.32 * k).toFixed(3) + ')');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // settled powder on the counter
      ctx.fillStyle = 'rgba(232,212,176,.7)';
      for (var i = 0; i < pile.length; i++) { var q = pile[i]; ctx.beginPath(); ctx.ellipse(X(q.x), Y(q.y), q.r * s * 1.9, q.r * s * 0.6, 0, 0, 6.283); ctx.fill(); }

      // the main stream from the scoop into the cup
      if (el > 1800) { var sg = ctx.createLinearGradient(0, Y(LIP.y), 0, Y(CUP.y)); sg.addColorStop(0, 'rgba(236,214,178,.6)'); sg.addColorStop(1, 'rgba(236,214,178,.3)');
        ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(X(LIP.x - 10), Y(LIP.y)); ctx.quadraticCurveTo(X(LIP.x - 6), Y(LIP.y + 30), X(LIP.x - 4), Y(CUP.y));
        ctx.lineTo(X(LIP.x + 6), Y(CUP.y)); ctx.quadraticCurveTo(X(LIP.x + 8), Y(LIP.y + 30), X(LIP.x + 10), Y(LIP.y)); ctx.closePath(); ctx.fill(); }
      // falling powder, glowing so it reads
      ctx.shadowColor = 'rgba(255,236,200,.5)'; ctx.shadowBlur = 2;
      ctx.fillStyle = 'rgb(236,214,176)';
      for (var j = parts.length - 1; j >= 0; j--) {
        var o = parts[j]; o.vy += 0.16; o.x += o.vx; o.y += o.vy;
        var inCup = !o.miss;
        if (o.y >= CUP.y && o.y - o.vy < CUP.y && inCup) { if (Math.random() < 0.03) puff(o.x, CUP.y - 4, false); parts.splice(j, 1); continue; }
        if (o.y >= CUP.y && o.y - o.vy < CUP.y && !inCup) { o.vx *= 0.25; if (Math.random() < 0.12) puff(o.x, CUP.y, false); }
        if (o.y >= o.land) {
          if (pile.length < 700) pile.push({ x: o.x + (Math.random() - 0.5) * 34, y: o.y + (Math.random() - 0.5) * 6, r: 1.6 + Math.random() * 2.6 });
          if (Math.random() < 0.05) puff(o.x, o.y - 4, true);
          parts.splice(j, 1); continue;
        }
        ctx.globalAlpha = o.a; ctx.beginPath(); ctx.arc(X(o.x), Y(o.y), o.r * s * 1.4, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;

      // dust clouds
      for (var m = puffs.length - 1; m >= 0; m--) {
        var u = puffs[m]; u.r += u.g; u.a *= 0.95; u.y -= 0.15;
        if (u.a < 0.02) { puffs.splice(m, 1); continue; }
        var pg = ctx.createRadialGradient(X(u.x), Y(u.y), 0, X(u.x), Y(u.y), u.r * s * 3);
        pg.addColorStop(0, 'rgba(245,226,192,' + u.a.toFixed(3) + ')'); pg.addColorStop(1, 'rgba(245,226,192,0)');
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(X(u.x), Y(u.y), u.r * s * 3, 0, 6.283); ctx.fill();
      }
      raf = requestAnimationFrame(step);
    }
    function start() { if (running || RM) return; fit(); parts = []; puffs = []; pile = []; running = true; t0 = performance.now(); raf = requestAnimationFrame(step); }
    function stop() { running = false; cancelAnimationFrame(raf); }
    addEventListener('resize', function () { if (running) fit(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) start(); else stop(); }); }, { threshold: 0.4 }).observe(card);
    } else start();
  }
  function scan() {
    document.querySelectorAll('a.rit-card[aria-label="A woman making a smoothie in her kitchen"]').forEach(setup);
  }
  setInterval(scan, 900); scan();
})();
