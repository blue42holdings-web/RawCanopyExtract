/* Oct 22 2026 (Scott): PHONE home. The brand paragraph box becomes a graphic:
   box one, on the erupting volcano: what's in their "functional" mushroom scoop (15 labeled pieces, the mushroom a glowing sliver) vs our one clean packet.
   box two, on the river forest: Uncompromising, by design (four tiles), Tear > Pour > Build your honest blend.
   Desktop keeps the paragraph for now. */
(function () {
  var ING = [['RICE FLOUR', '#7a1f1f'], ['MALTODEXTRIN', '#5b4a44'], ['NATURAL FLAVORS', '#9b2c2c'], ['XANTHAN GUM', '#6e3b2e'], ['MCT POWDER', '#4a4440'], ['GUAR GUM', '#a8432e'], ['SILICA', '#3f3a37'], ['MUSHROOM', ''], ['STEVIA', '#8c2a2a'], ['CACAO', '#6a5a52'], ['CINNAMON', '#b0472f'], ['SUNFLOWER LECITHIN', '#4d3b35'], ['TURMERIC', '#7d2424'], ['ASHWAGANDHA', '#5e5550'], ['BLACK PEPPER', '#963528']];
  var css = document.createElement('style'); css.id = 'home-graphic-css';
  css.textContent = [
    '.hg{padding:6px 0 4px;font-family:Oswald,sans-serif;text-align:left}',
    '.hg *{box-sizing:border-box}',
    '.hg-box{border:3px solid #D4A24A;border-radius:18px;padding:20px 16px 18px;margin:0 0 16px}',
    '.hg-b1{background:linear-gradient(rgba(8,6,6,.42),rgba(8,6,6,.72)),url("assets/photo/volcano-fountain-flop.jpg") 55% 40%/auto 115% no-repeat #000}',
    '.hg-b2{background:linear-gradient(rgba(4,22,12,.55),rgba(4,18,10,.78)),url("assets/photo/own-river-forest.jpg") center 40%/cover no-repeat #000}',
    '.hg-q{font-family:"Bebas Neue",sans-serif;color:#F1ECE1;letter-spacing:.04em;line-height:1.08;white-space:nowrap;text-align:center;margin:0 0 4px;font-weight:400}',
    '.hg-lab{display:flex;justify-content:space-between;align-items:baseline;font-family:"Bebas Neue",sans-serif;letter-spacing:.1em;font-size:20px;color:#F1ECE1;margin:16px 0 6px}',
    '.hg-lab span:last-child{font-size:15px;letter-spacing:.06em}',
    '.hg-who{display:flex;align-items:center;gap:14px;margin:18px 0 8px}',
    '.hg-them .hg-who{margin-bottom:26px}',
    'html body .hg .hg-big{font-family:"Bebas Neue",sans-serif;font-size:64px !important;line-height:.85;letter-spacing:.04em;color:#F1ECE1}',
    'html body .hg .hg-sub{font-family:"Bebas Neue",sans-serif;font-size:20px !important;line-height:1.1;letter-spacing:.08em;color:#F1ECE1;opacity:.92;border-left:2px solid rgba(241,236,225,.5);padding-left:12px}',
    '.hg-us .hg-big{color:#F6D58E !important}',
    'html body .hg .hg-them .hg-bar{height:165px !important}',
    'html body .hg .hg-them .hg-bar em{font-size:12px !important;line-height:1 !important;letter-spacing:.05em !important}',
    'html body .hg .hg-them .hg-bar i.hg-m em{font-size:13.5px !important}',
    '.hg-bar{display:flex;border-radius:6px}',
    '.hg-them .hg-bar{height:150px;gap:2px}',
    '.hg-them .hg-bar i{flex:1;display:flex;align-items:center;justify-content:center;overflow:hidden;font-style:normal}',
    '.hg-them .hg-bar i:first-child{border-radius:6px 0 0 6px}.hg-them .hg-bar i:last-child{border-radius:0 6px 6px 0}',
    '.hg-them .hg-bar em{font-style:normal;writing-mode:vertical-rl;transform:rotate(180deg);font-size:12.5px;letter-spacing:.06em;color:#EDE6D8;white-space:nowrap}',
    '.hg-them .hg-bar i.hg-m{margin:-16px 0;border-radius:5px;background:linear-gradient(180deg,#F6D58E,#D4A24A 30%,#c9973c);box-shadow:0 0 16px rgba(246,213,142,.75),0 0 2px #fff;position:relative;z-index:2}',
    '.hg-them .hg-bar i.hg-m em{color:#111;font-size:14px;font-weight:600;letter-spacing:.1em}',
    '.hg-us .hg-bar{height:50px;align-items:center;justify-content:center;font-family:"Bebas Neue",sans-serif;font-size:19px;letter-spacing:.08em;color:#111;background:linear-gradient(100deg,#b8862f 0%,#E8B860 30%,#F6D58E 48%,#E8B860 62%,#c9973c 100%);box-shadow:0 0 18px rgba(212,162,74,.35)}',
    '.hg-hint{font-family:"Bebas Neue",sans-serif;letter-spacing:.2em;font-size:15px;color:#F6D58E;text-align:center;margin:0 0 2px}',
    '.hg-hint b{display:inline-block;font-weight:400;animation:rcxSwArr 1.8s ease-in-out infinite}',
    'html body .hg .hg-rail{display:flex !important;overflow-x:auto !important;overflow-y:hidden !important;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;gap:6px;align-items:center;height:230px;margin:0 -16px;padding-top:26px !important;padding:0 calc(50% - 32px) !important}',
    '.hg-rail::-webkit-scrollbar{display:none}',
    'html body .hg .hg-ing{flex:0 0 64px !important;width:64px !important;height:150px;border-radius:8px;display:flex;align-items:center;justify-content:center;scroll-snap-align:center;transform-origin:50% 50%;transition:transform .12s linear,opacity .12s linear;font-style:normal}',
    'html body .hg .hg-ing em{font-style:normal;writing-mode:vertical-rl;transform:rotate(180deg);font-family:"Bebas Neue",sans-serif;font-size:20px !important;letter-spacing:.08em;color:#F1ECE1;white-space:nowrap;line-height:1 !important}',
    'html body .hg .hg-ing.hg-m{background:linear-gradient(180deg,#F6D58E,#D4A24A 30%,#c9973c);box-shadow:0 0 18px rgba(246,213,142,.8),0 0 2px #fff}',
    'html body .hg .hg-ing.hg-m em{color:#111}',
    'html body .hg .rcx-swipe-tag{display:none !important}',
    '.hg-marq{position:relative;margin:4px auto 2px;padding:9px 10px 7px;border-radius:10px;background:#1a0606;text-align:center;font-family:"Bebas Neue",sans-serif;letter-spacing:.1em;font-size:19px;white-space:nowrap;color:#F6D58E;text-shadow:0 0 8px rgba(246,213,142,.8);border:2px solid #D4A24A}',
    '.hg-marq:before{content:"";position:absolute;inset:-6px;border-radius:13px;background:radial-gradient(circle,#FFE7A8 0 2.2px,transparent 2.6px) 0 0/14px 14px;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;padding:4px;animation:hgBulb 0.9s steps(2) infinite;pointer-events:none}',
    '@keyframes hgBulb{0%{opacity:1}50%{opacity:.35}}',
    '.hg-wheel{position:relative}',
    '.hg-wheel:before{content:"";position:absolute;left:50%;top:2px;transform:translateX(-50%);border:11px solid transparent;border-top:15px solid #F6D58E;filter:drop-shadow(0 0 6px rgba(246,213,142,.9));z-index:5;pointer-events:none}',
    '.hg-spinrow{display:flex;flex-direction:column;align-items:center;gap:6px;margin:2px 0 4px}',
    'html body .hg .hg-spin{font-family:"Bebas Neue",sans-serif;letter-spacing:.14em;font-size:20px !important;color:#1a0606;background:linear-gradient(180deg,#F6D58E,#D4A24A 55%,#b8862f);border:2px solid #FFE7A8;border-radius:999px;padding:9px 26px 7px;box-shadow:0 4px 0 #7a5418,0 0 16px rgba(246,213,142,.55);cursor:pointer}',
    'html body .hg .hg-spin:active{transform:translateY(3px);box-shadow:0 1px 0 #7a5418}',
    'html body .hg .hg-spin[disabled]{opacity:.7}',
    'html body .hg .hg-res{font-family:"Bebas Neue",sans-serif;letter-spacing:.08em;font-size:17px !important;color:#F1ECE1;text-align:center;min-height:20px}',
    'html body .hg .hg-res.win{color:#F6D58E;text-shadow:0 0 10px rgba(246,213,142,.9)}',

    '.hg-cap{margin:8px 0 0;font-size:17px;color:#F1ECE1;line-height:1.35;text-align:left}',
    '.hg-them .hg-cap{margin-top:8px}',
    '.hg-cap b{color:#D4A24A;font-weight:500}',
    '.hg-tiles{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}',
    '.hg-t{border:1.5px solid rgba(212,162,74,.65);border-radius:12px;padding:12px 8px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center}',
    '.hg-t:nth-child(1){background:rgba(20,60,36,.66)}.hg-t:nth-child(2){background:rgba(14,52,60,.62)}.hg-t:nth-child(3){background:rgba(70,48,14,.62)}.hg-t:nth-child(4){background:rgba(64,20,26,.6)}',
    '.hg-ic{height:46px;display:flex;align-items:center;justify-content:center;gap:4px;margin-bottom:6px}',
    '.hg-ic img{height:44px;width:auto}.hg-ic.hg-sp img{height:40px}',
    '.hg-tt{font-family:"Bebas Neue",sans-serif;font-size:19px;letter-spacing:.05em;color:#F1ECE1;line-height:1.05}',
    '.hg-ts{font-size:14px;color:#EFE8D8;line-height:1.3;margin-top:4px}',
    '.hg-flow{margin-top:14px;display:flex;justify-content:center;align-items:center;gap:4px;font-family:"Bebas Neue",sans-serif;letter-spacing:.07em;font-size:17px;color:#111;white-space:nowrap}',
    '.hg-flow span{background:#D4A24A;border-radius:6px;padding:6px 7px 4px}.hg-flow b{color:#D4A24A;font-weight:400;font-size:22px}',
    'html body .hg .hg-q{white-space:nowrap !important;text-wrap:nowrap !important;max-width:none !important;width:100% !important}',
    'html body .hg .hg-cap{font-size:17px !important;line-height:1.35 !important;max-width:none !important}',
    'html body .hg .hg-ts{font-size:14px !important;line-height:1.3 !important}',
    'html body .hg .hg-end{font-size:16px !important;white-space:nowrap !important}',
    '.hg-end{margin-top:14px;text-align:center;color:#F1ECE1;font-family:"Playfair Display",serif;font-style:italic;font-size:17px;line-height:1.35}'
  ].join('\n');
  document.head.appendChild(css);

  function html() {
    var segs = ING.map(function (x) { return x[1] ? '<i class="hg-ing" style="background:' + x[1] + '"><em>' + x[0] + '</em></i>' : '<i class="hg-ing hg-m"><em>' + x[0] + '</em></i>'; }).join('');
    var qr = '<svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true"><g fill="#D4A24A"><path d="M3 3h7v7H3zM5 5v3h3V5zM14 3h7v7h-7zM16 5v3h3V5zM3 14h7v7H3zM5 16v3h3v-3zM14 14h3v3h-3zM18 14h3v3h-3zM14 18h3v3h-3zM18 18h3v3h-3z"/></g></svg>';
    return '<div class="hg-box hg-b1"><div class="hg-q" role="heading" aria-level="2">WHAT’S REALLY IN YOUR “FUNCTIONAL” MUSHROOM SCOOP?</div>' +
      '<div class="hg-them"><div class="hg-who"><span class="hg-big">THEM</span><span class="hg-sub">The messy scoop<br>15 ingredients</span></div><div class="hg-marq"><span>STOP GAMBLING WITH YOUR HEALTH</span></div><div class="hg-wheel"><div class="hg-rail" data-noswipe="1" aria-label="A typical blend: fifteen ingredients, the mushroom is one of them">' + segs + '</div></div><div class="hg-spinrow"><button type="button" class="hg-spin">SPIN THEIR SCOOP</button><div class="hg-res">1 in 15 chance you land on the mushroom.</div></div>' +
      '<p class="hg-cap">Fifteen ingredients, one messy scoop, cut for profit. The <b>mushroom</b> is a sliver of a “proprietary blend.” How much? They won’t tell us.</p></div>' +
      '<div class="hg-us"><div class="hg-who"><span class="hg-big">US</span><span class="hg-sub">One clean packet<br>1 ingredient</span></div><div class="hg-bar">100% ORGANIC MUSHROOM EXTRACT</div>' +
      '<p class="hg-cap">No fillers. No carriers. Just the raw, uncut truth.</p></div></div>' +
      '<div class="hg-box hg-b2"><div class="hg-q" role="heading" aria-level="2">UNCOMPROMISING, BY DESIGN</div><div class="hg-tiles">' +
      '<div class="hg-t"><div class="hg-ic hg-sp"><img src="assets/icons/species/rcx-sym-lions-mane-gold.svg" alt=""><img src="assets/icons/species/rcx-sym-cordyceps-gold.svg" alt=""><img src="assets/icons/species/rcx-sym-turkey-tail-gold.svg" alt=""></div><div class="hg-tt">Backed by published research</div><div class="hg-ts">Three organic mushrooms.<br>Nature’s raw harvest.</div></div>' +
      '<div class="hg-t"><div class="hg-ic"><img src="assets/icons/extracted.svg" alt=""></div><div class="hg-tt">Scientifically extracted</div><div class="hg-ts">Unlocked so your body can actually absorb it.</div></div>' +
      '<div class="hg-t"><div class="hg-ic"><img src="assets/icons/single-ingredient.svg" alt=""></div><div class="hg-tt">Measured so you don’t have to</div><div class="hg-ts">One clean, single ingredient packet.</div></div>' +
      '<div class="hg-t"><div class="hg-ic">' + qr + '</div><div class="hg-tt">Check the receipts</div><div class="hg-ts">Scan the QR for the independent lab report.</div></div>' +
      '</div><div class="hg-flow"><span>TEAR</span><b>›</b><span>POUR</span><b>›</b><span>BUILD YOUR HONEST BLEND</span></div>' +
      '<div class="hg-end">Prescription free. Caffeine free. Forest to cup.</div></div>';
  }
  function rail() {   // the box in the middle is the big one
    var r = g && g.querySelector('.hg-rail'); if (!r) return;
    [].forEach.call(g.querySelectorAll('.rcx-swipe-tag'), function (t) { t.remove(); });   // our own hint says it; no second label
    if (!r.__hg) { r.__hg = 1; r.addEventListener('scroll', function () { if (!r.__raf) r.__raf = requestAnimationFrame(function () { r.__raf = 0; scale(r); }); }, { passive: true }); }
    var btn = g.querySelector('.hg-spin'); if (btn && !btn.__hg) { btn.__hg = 1; btn.addEventListener('click', function () { spin(r, btn); }); }
    scale(r);
  }
  function spin(r, btn) {
    var res = g.querySelector('.hg-res'), items = [].slice.call(r.children);
    var pos = function (i) { var k = items[i]; return k.offsetLeft + k.offsetWidth / 2 - r.clientWidth / 2; };
    var target = Math.floor(Math.random() * items.length), max = r.scrollWidth - r.clientWidth;
    var from = r.scrollLeft, to = Math.max(0, Math.min(max, pos(target)));
    // a few passes back and forth across the row, then settle on the target
    var legs = [from, max, 0, max, to], L = 0, segs = [];
    for (var n = 1; n < legs.length; n++) { var len = Math.abs(legs[n] - legs[n - 1]); segs.push([legs[n - 1], legs[n], L, len]); L += len; }
    r.__rcxTouched = 1; btn.disabled = true; res.classList.remove('win'); res.textContent = 'SPINNING...';
    r.style.scrollSnapType = 'none'; r.style.scrollBehavior = 'auto';
    var t0 = performance.now(), dur = 3200;
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3), s = e * L, x = to;
      for (var q = 0; q < segs.length; q++) { var sg = segs[q]; if (s <= sg[2] + sg[3] || q === segs.length - 1) { var f = sg[3] ? (s - sg[2]) / sg[3] : 1; x = sg[0] + (sg[1] - sg[0]) * Math.min(1, f); break; } }
      r.scrollLeft = x; scale(r);
      if (p < 1) requestAnimationFrame(step);
      else {
        r.style.removeProperty('scroll-snap-type'); r.style.removeProperty('scroll-behavior'); btn.disabled = false;
        var name = items[target].textContent;
        if (items[target].classList.contains('hg-m')) { res.classList.add('win'); res.textContent = 'JACKPOT! YOU HIT THE MUSHROOM. 1 IN 15.'; }
        else res.textContent = 'YOU GOT ' + name + '. SPIN AGAIN?';
      }
    })(t0);
  }
  function scale(r) {
    var c = r.getBoundingClientRect(), mid = c.left + c.width / 2;
    [].forEach.call(r.children, function (k) {
      var b = k.getBoundingClientRect(), dx = (b.left + b.width / 2 - mid) / 70, d = Math.abs(dx), t = Math.max(0, 1 - d), dd = Math.min(d, 3.2);
      k.style.transform = 'translateY(' + (dd * dd * 7).toFixed(1) + 'px) rotate(' + Math.max(-38, Math.min(38, dx * 11)).toFixed(1) + 'deg) scale(' + (0.86 + 0.34 * t).toFixed(3) + ')';
      k.style.opacity = (0.55 + 0.45 * t).toFixed(2);
      k.style.zIndex = t > 0.5 ? 2 : 1;
    });
  }
  function vis(e) { return e && e.offsetHeight > 0; }
  function anchor() {   // the bordered box holding the brand paragraph
    var p = [].filter.call(document.querySelectorAll('.sq-para'), function (e) { return e.offsetParent !== null || e.__hgHid; })[0];
    if (!p) return null;
    for (var x = p; x && x !== document.body; x = x.parentElement) { var cs = getComputedStyle(x); if (parseFloat(cs.borderTopWidth) >= 1.5 && x.offsetWidth > 280) return x; }
    return null;
  }
  var g = null, hidden = null;
  function fit() {   // both headings on one line, the same size
    if (!g) return;
    var hs = [].slice.call(g.querySelectorAll('.hg-q')), m = 30;
    hs.forEach(function (h) { h.style.setProperty('font-size', '30px', 'important'); });
    hs.forEach(function (h) { var w = h.clientWidth; if (h.scrollWidth > w && w > 0) m = Math.min(m, Math.floor(30 * w / h.scrollWidth * 0.98)); });
    hs.forEach(function (h) { h.style.setProperty('font-size', m + 'px', 'important'); });
  }
  function run() {
    var phone = innerWidth < 768;
    if (!phone) { if (g) { g.remove(); g = null; } if (hidden) { hidden.style.removeProperty('display'); hidden = null; } return; }
    if (g && g.isConnected && hidden && hidden.isConnected && hidden.style.getPropertyValue('display') === 'none') { fit(); rail(); return; }
    var a = hidden && hidden.isConnected ? hidden : anchor(); if (!a) return;
    if (!g || !g.isConnected) {
      [].forEach.call(document.querySelectorAll('.hg'), function (o) { o.remove(); });
      g = document.createElement('div'); g.className = 'hg'; g.setAttribute('data-noswipe', '1'); g.innerHTML = html();
      [].forEach.call(g.querySelectorAll('div'), function (d) { d.setAttribute('data-noswipe', '1'); });
      var cs = getComputedStyle(a); g.style.maxWidth = a.offsetWidth + 'px'; g.style.marginLeft = cs.marginLeft === '0px' ? 'auto' : cs.marginLeft; g.style.marginRight = g.style.marginLeft === 'auto' ? 'auto' : cs.marginRight;
      a.parentNode.insertBefore(g, a.nextSibling);
      new MutationObserver(function () { [].forEach.call(g.querySelectorAll('.rcx-swipe-tag'), function (t) { t.remove(); }); }).observe(g, { childList: true, subtree: true });
    }
    a.style.setProperty('display', 'none', 'important'); hidden = a;
    fit(); rail();
  }
  addEventListener('resize', function () { run(); fit(); });
  setInterval(run, 1000); run();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
