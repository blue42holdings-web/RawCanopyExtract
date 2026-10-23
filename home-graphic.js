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
    '.hg-them .hg-lab{margin-bottom:24px}',
    '.hg-bar{display:flex;border-radius:6px}',
    '.hg-them .hg-bar{height:150px;gap:2px}',
    '.hg-them .hg-bar i{flex:1;display:flex;align-items:center;justify-content:center;overflow:hidden;font-style:normal}',
    '.hg-them .hg-bar i:first-child{border-radius:6px 0 0 6px}.hg-them .hg-bar i:last-child{border-radius:0 6px 6px 0}',
    '.hg-them .hg-bar em{font-style:normal;writing-mode:vertical-rl;transform:rotate(180deg);font-size:12.5px;letter-spacing:.06em;color:#EDE6D8;white-space:nowrap}',
    '.hg-them .hg-bar i.hg-m{margin:-16px 0;border-radius:5px;background:linear-gradient(180deg,#F6D58E,#D4A24A 30%,#c9973c);box-shadow:0 0 16px rgba(246,213,142,.75),0 0 2px #fff;position:relative;z-index:2}',
    '.hg-them .hg-bar i.hg-m em{color:#111;font-size:14px;font-weight:600;letter-spacing:.1em}',
    '.hg-us .hg-bar{height:50px;align-items:center;justify-content:center;font-family:"Bebas Neue",sans-serif;font-size:19px;letter-spacing:.08em;color:#111;background:linear-gradient(100deg,#b8862f 0%,#E8B860 30%,#F6D58E 48%,#E8B860 62%,#c9973c 100%);box-shadow:0 0 18px rgba(212,162,74,.35)}',
    '.hg-cap{margin:8px 0 0;font-size:17px;color:#F1ECE1;line-height:1.35;text-align:left}',
    '.hg-them .hg-cap{margin-top:26px}',
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
    var segs = ING.map(function (x) { return x[1] ? '<i style="background:' + x[1] + '"><em>' + x[0] + '</em></i>' : '<i class="hg-m"><em>' + x[0] + '</em></i>'; }).join('');
    var qr = '<svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true"><g fill="#D4A24A"><path d="M3 3h7v7H3zM5 5v3h3V5zM14 3h7v7h-7zM16 5v3h3V5zM3 14h7v7H3zM5 16v3h3v-3zM14 14h3v3h-3zM18 14h3v3h-3zM14 18h3v3h-3zM18 18h3v3h-3z"/></g></svg>';
    return '<div class="hg-box hg-b1"><div class="hg-q" role="heading" aria-level="2">WHAT’S REALLY IN YOUR “FUNCTIONAL” MUSHROOM SCOOP?</div>' +
      '<div class="hg-them"><div class="hg-lab"><span>THEM · THE MESSY SCOOP</span><span>15 INGREDIENTS</span></div><div class="hg-bar" role="img" aria-label="A typical blend: fifteen ingredients, the mushroom is one of them">' + segs + '</div>' +
      '<p class="hg-cap">Fifteen ingredients, one messy scoop, cut for profit. The <b>mushroom</b> is a sliver of a “proprietary blend.” How much? They won’t tell us.</p></div>' +
      '<div class="hg-us"><div class="hg-lab"><span>US · ONE CLEAN PACKET</span><span>1 INGREDIENT</span></div><div class="hg-bar">100% ORGANIC MUSHROOM EXTRACT</div>' +
      '<p class="hg-cap">No fillers. No carriers. Just the raw, uncut truth.</p></div></div>' +
      '<div class="hg-box hg-b2"><div class="hg-q" role="heading" aria-level="2">UNCOMPROMISING, BY DESIGN</div><div class="hg-tiles">' +
      '<div class="hg-t"><div class="hg-ic hg-sp"><img src="assets/icons/species/rcx-sym-lions-mane-gold.svg" alt=""><img src="assets/icons/species/rcx-sym-cordyceps-gold.svg" alt=""><img src="assets/icons/species/rcx-sym-turkey-tail-gold.svg" alt=""></div><div class="hg-tt">Backed by published research</div><div class="hg-ts">Three organic mushrooms.<br>Nature’s raw harvest.</div></div>' +
      '<div class="hg-t"><div class="hg-ic"><img src="assets/icons/extracted.svg" alt=""></div><div class="hg-tt">Scientifically extracted</div><div class="hg-ts">Unlocked so your body can actually absorb it.</div></div>' +
      '<div class="hg-t"><div class="hg-ic"><img src="assets/icons/single-ingredient.svg" alt=""></div><div class="hg-tt">Measured so you don’t have to</div><div class="hg-ts">One clean, single ingredient packet.</div></div>' +
      '<div class="hg-t"><div class="hg-ic">' + qr + '</div><div class="hg-tt">Check the receipts</div><div class="hg-ts">Scan the QR for the independent lab report.</div></div>' +
      '</div><div class="hg-flow"><span>TEAR</span><b>›</b><span>POUR</span><b>›</b><span>BUILD YOUR HONEST BLEND</span></div>' +
      '<div class="hg-end">Prescription free. Caffeine free. Forest to cup.</div></div>';
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
    if (g && g.isConnected && hidden && hidden.isConnected && hidden.style.getPropertyValue('display') === 'none') return;
    var a = hidden && hidden.isConnected ? hidden : anchor(); if (!a) return;
    if (!g || !g.isConnected) {
      [].forEach.call(document.querySelectorAll('.hg'), function (o) { o.remove(); });
      g = document.createElement('div'); g.className = 'hg'; g.setAttribute('data-noswipe', '1'); g.innerHTML = html();
      [].forEach.call(g.querySelectorAll('div'), function (d) { d.setAttribute('data-noswipe', '1'); });
      var cs = getComputedStyle(a); g.style.maxWidth = a.offsetWidth + 'px'; g.style.marginLeft = cs.marginLeft === '0px' ? 'auto' : cs.marginLeft; g.style.marginRight = g.style.marginLeft === 'auto' ? 'auto' : cs.marginRight;
      a.parentNode.insertBefore(g, a.nextSibling);
    }
    a.style.setProperty('display', 'none', 'important'); hidden = a;
    fit();
  }
  addEventListener('resize', function () { run(); fit(); });
  setInterval(run, 1000); run();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
