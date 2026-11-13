/* Licensing marker, Nov 12 2026: draws a thin red X over every photo that is NOT an iStock photo,
   so Scott can see which ones still need replacing. Pure overlay: changes no layout.
   To remove: delete this file and its <script> line in index.html. */
(function () {
  var X = new Set(["a-cup-beside-dried-mushrooms-and-coffee","a-cup-in-the-woods","a-diver-signalling-underwater-alongside-a-shark","a-freediver-rising-over-the-sand-flats","c-press-coast","cd-hero-clubs","cd-paddleboard-group","cd-relay-college","cd-xc-skier","cd-yunnan-hoodoos","coconut-palm-up","cordyceps-forest","couple-tent-beach","desk-journal-coffee","dodge03-diver","e-tent-dusk","faq-camp-table-tin","first-cup-backpacker-clean","friends-workout","ginger-root","h-van-forest","hero-stove-pour-ridge-v11","home-bg-coast-dusk","honeycomb","how-freediver-dark","how-freediver-line","how-kayak-whitewater","kitchen-blender-greens","kitchen-shake","lab-extraction-rig","lab-hand-closeup","lab-lm-grow-room","lab-powder-coat","lab-steel-tanks","lions-mane","lm-family-reading","lm-grandpa-reading","lm-hero-cluster","lm-hero-cluster-phone","lm-how-made-desk","lm-kickoff-fishing-sunset","lm-macro-closeup","lm-office-red-mugs","lm-powder-scoop","lm-skagit-valley","lm-white","measured-hiker-sunset-flip","mess-floor","mtb-rider-side","orange-slices","pineapple-smoothie","receipts-airport-line","receipts-football-training-crop-v2","receipts-tennis-noblog","receipts-tennis-wide","rs-changbai","shop-river-canyon","ski-crew-ridge","tt-airport-crowd","tt-concert-lasers","tt-fest-big-crowd","tt-fest-wristbands","tt-hero-habitat","tt-right-form-log","tt-tube-boarding","turkey-tail-card","two-figures-stretching-against-a-sunset-sea","van-rainier-stripes26","why-desk-coffee","why-pour","why-rv-desk-nopen","why-sunrise","why-tent","yoga-vertical"]);
  var RE = /assets\/(?:photo|cutouts)\/(?:faq\/)?([^\/?#"')]+?)\.(?:jpe?g|webp|png|avif)/i;
  function stem(s) { var m = s && s.match(RE); return m ? m[1].replace(/-cutout$/, "") : null; }
  var layer, marks = new Map();
  var SVG = '<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="display:block">' +
    '<line x1="0" y1="0" x2="100" y2="100" stroke="#ff2a2a" stroke-width="2" vector-effect="non-scaling-stroke"/>' +
    '<line x1="100" y1="0" x2="0" y2="100" stroke="#ff2a2a" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>';
  function hidden(el) {
    for (var i = 0, e = el; e && e.nodeType === 1 && i < 8; i++, e = e.parentElement) {
      var cs = getComputedStyle(e);
      if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) return true;
    }
    return false;
  }
  function flagged(el) {
    if (el.tagName === "IMG" && X.has(stem(el.currentSrc || el.src))) return true;
    var cs = getComputedStyle(el);
    if (cs.backgroundImage !== "none" && X.has(stem(cs.backgroundImage))) return true;
    var b = getComputedStyle(el, "::before").backgroundImage, a = getComputedStyle(el, "::after").backgroundImage;
    return (b && b !== "none" && X.has(stem(b))) || (a && a !== "none" && X.has(stem(a)));
  }
  function scan() {
    if (!layer) {
      layer = document.createElement("div");
      layer.style.cssText = "position:absolute;left:0;top:0;width:0;height:0;pointer-events:none;z-index:2147483000";
      document.body.appendChild(layer);
    }
    var all = document.body.getElementsByTagName("*");
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el === layer || layer.contains(el)) continue;
      var on = false;
      try { on = flagged(el); } catch (e) {}
      if (on && !marks.has(el)) {
        var d = document.createElement("div");
        d.style.cssText = "position:absolute;pointer-events:none";
        d.innerHTML = SVG;
        layer.appendChild(d);
        marks.set(el, d);
      } else if (!on && marks.has(el)) { marks.get(el).remove(); marks.delete(el); }
    }
    place();
  }
  function place() {
    marks.forEach(function (d, el) {
      if (!el.isConnected) { d.remove(); marks.delete(el); return; }
      var r = el.getBoundingClientRect();
      if (r.width < 8 || r.height < 8 || hidden(el)) { d.style.display = "none"; return; }
      d.style.display = "block";
      d.style.left = (r.left + scrollX) + "px"; d.style.top = (r.top + scrollY) + "px";
      d.style.width = r.width + "px"; d.style.height = r.height + "px";
    });
  }
  var ticking = false;
  function onMove() { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; place(); }); } }
  function start() { scan(); setInterval(scan, 4000); setInterval(place, 400); addEventListener("scroll", onMove, { passive: true }); addEventListener("resize", onMove); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
