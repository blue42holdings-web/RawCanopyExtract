/* Photo licensing overlay (Scott's private working view before launch), Nov 13 2026.
   Replaces license-x.js and license-label.js.
   Every photo that is not Scott's own gets a black box with gold text naming its status.
   A red X is added only when the photo can NOT simply be bought: email for permission,
   unknown owner, must be replaced, or not traced yet.
   Overlays are clipped to the part of the photo actually visible, so hidden slides get none.
   To remove before launch: delete this file and its <script> line in index.html. */
(function () {
  var B = "BUY", E = "EMAIL", U = "UNKNOWN", R = "REPLACE", N = "NOT TRACED YET";
  var L = {
    /* BUY: stock photos. Label only, no X */
    "shop-climber-wide": [B, "iStock, gregepperson (rock climber)"],
    "coffee-asset": [B, "iStock, gregepperson (rock climber)"],
    "f-mossy-tree": [B, "iStock, Tim Delmar. Same photo is also used on How To Use"],
    "how-mossy-tree": [B, "iStock, Tim Delmar. Same photo is also used on the home page"],
    "stock-outdoor-photo": [B, "iStock 1044535438, LumiNola"],
    "lake-tea-laugh": [B, "iStock 928724400"],
    "shop-tennis-handshake-nobrand": [B, "iStock 511350939"],
    "lab-soxhlet-extraction": [B, "iStock, also Shutterstock 1255763041 (Soxhlet extractor)"],
    "lm-grandpa-football-park": [B, "Probably iStock. Exact listing not found yet"],
    "a-cup-beside-dried-mushrooms-and-coffee": [B, "iStock"],
    "c-press-coast": [B, "Adobe Stock 410646536, BublikHaus. Confirm it is the same photo"],
    "lm-powder-scoop": [B, "Dreamstime, maca powder photo, edited. Confirm before buying"],
    "why-tent": [B, "Stocksy 2637817, Kike Arnaiz"],
    "first-cup-backpacker-clean": [B, "Adobe Stock, Jens Ottoson"],
    /* EMAIL for permission */
    "a-diver-signalling-underwater-alongside-a-shark": [E, "Hawaii Adventure Diving, Oahu | OpenWaterSharkDive@gmail.com | 808-829-2203"],
    "how-freediver-line": [E, "Mitch Brown Photo Freediving, Oahu | info@mitchbrownphotofreediving.com | 808-308-8311"],
    "how-freediver-dark": [E, "Mitch Brown Photo Freediving, Oahu | info@mitchbrownphotofreediving.com | 808-308-8311"],
    "h-van-forest": [E, "Tiffin Motorhomes (GH1 press photo) | call 256-356-8661, ask for marketing | contact@tiffinmotorhomes.com (unconfirmed)"],
    "van-rainier-stripes26": [E, "Jessica Carpenter, My Feet Will Lead Me blog | jessica@myfeetwillleadme.com"],
    "lm-skagit-valley": [E, "Benj Drummond, photographer | mail@benjandsara.com"],
    "how-kayak-whitewater": [E, "Confluence Outdoor | form at confluenceoutdoor.com/pages/contact, pick Media Inquiries"],
    "lab-extraction-rig": [E, "Alibaba seller hzlymachine | Contact Supplier on Alibaba listing 10000012035177"],
    "cd-hero-clubs": [E, "Mushroaming, Daniel Winkler | info@mushroaming.com"],
    "tt-hero-habitat": [E, "Wild Food UK | admin@wildfooduk.com"],
    "turkey-tail-card": [E, "Barbora Batokova, Fungiwoman | form at fungiwoman.com/pages/contact | hello@fungiwoman.com"],
    "lab-lm-grow-room": [E, "Below Farm, Abu Dhabi | info@below.farm"],
    "cordyceps-forest": [E, "Moksha Chocolate, Boulder | jen@mokshachocolate.com | looks AI made"],
    "tt-right-form-log": [E, "DailyNutra | support@DailyNutra.com | looks AI made"],
    "about-beach-seastack": [E, "Jess Wandering blog, jesswandering.com (contact not found yet)"],
    /* UNKNOWN owner */
    "shop-river-canyon": [U, "Wuyi Mountain. Largest copy on China Daily, credit not found"],
    "rs-changbai": [U, "Changbai. Only on TripAdvisor traveler photos. Replace"],
    "receipts-airport-line": [U, "On Travel + Leisure, credit not read yet (maybe Getty)"],
    "why-rv-desk-nopen": [U, "Looks like stock, seller not found"],
    "why-rv-desk-nopen-v2": [U, "Looks like stock, seller not found"],
    "friends-workout": [U, "Looks like stock, seller not found"],
    "lm-grandpa-reading": [U, "Looks like stock, seller not found"],
    "lions-mane": [U, "Stock. Maybe Shutterstock, IgorCheri. Confirm before buying"],
    "lm-hero-cluster": [U, "Stock. Maybe Shutterstock, IgorCheri. Confirm before buying"],
    "lm-hero-cluster-phone": [U, "Stock. Maybe Shutterstock, IgorCheri. Confirm before buying"],
    "lm-white": [U, "No source found"],
    "a-cup-in-the-woods": [U, "No clear owner found"],
    "a-freediver-rising-over-the-sand-flats": [U, "No clear owner found"],
    "og-seal-camp-v2": [U, "Camp photo behind the seal, no match found"],
    "how-gym-coffee-crop": [U, "No owner found, looks AI made"],
    "why-sunrise": [U, "No owner, looks AI made"],
    "tt-fest-wristbands": [U, "No owner, AI image from StockCake"],
    "about-kayaks": [U, "No match anywhere online. Probably yours?"],
    /* REPLACE: can't be fixed with permission */
    "receipts-tennis-noblog": [R, "News photo of a real tennis player"],
    "receipts-tennis-wide": [R, "News photo of a real tennis player"],
    "tt-fest-big-crowd": [R, "News photo full of real faces"],
    "receipts-football-training-crop-v2": [R, "Real club players"],
    "tt-tube-boarding": [R, "London news photo, real commuters"],
    "faq-camp-table-tin": [R, "Shows the steel tin"]
  };
  var NT = ["cd-paddleboard-group","cd-relay-college","cd-xc-skier","cd-yunnan-hoodoos","coconut-palm-up","couple-tent-beach","desk-journal-coffee","dodge03-diver","e-tent-dusk","ginger-root","hero-stove-pour-ridge-v11","home-bg-coast-dusk","honeycomb","kitchen-blender-greens","kitchen-shake","lab-hand-closeup","lab-powder-coat","lab-steel-tanks","lm-family-reading","lm-how-made-desk","lm-kickoff-fishing-sunset","lm-macro-closeup","lm-office-red-mugs","measured-hiker-sunset-flip","mess-floor","mtb-rider-side","orange-slices","pineapple-smoothie","ski-crew-ridge","tt-airport-crowd","tt-concert-lasers","two-figures-stretching-against-a-sunset-sea","why-desk-coffee","why-pour","yoga-vertical"];
  NT.forEach(function (s) { if (!L[s]) L[s] = [N, "Source not checked yet"]; });

  var RE = /assets\/(?:photo|cutouts)\/(?:faq\/)?([^\/?#"')]+?)\.(?:jpe?g|webp|png|avif)/i;
  function info(s) {
    if (!s) return null;
    var m = s.match(RE); if (!m) return null;
    var k = m[1].replace(/-cutout$/, "");
    return L[k] || L[k.replace(/-v\d+$/, "")] || null;
  }
  function find(el) {
    if (el.tagName === "IMG") { var i = info(el.currentSrc || el.src); if (i) return i; }
    var cs = getComputedStyle(el), r;
    if (cs.backgroundImage !== "none" && (r = info(cs.backgroundImage))) return r;
    var b = getComputedStyle(el, "::before").backgroundImage;
    if (b && b !== "none" && (r = info(b))) return r;
    var a = getComputedStyle(el, "::after").backgroundImage;
    if (a && a !== "none" && (r = info(a))) return r;
    return null;
  }
  /* visible part of an element: its box clipped by every ancestor that clips overflow */
  function visibleRect(el) {
    var r = el.getBoundingClientRect(), x0 = r.left, y0 = r.top, x1 = r.right, y1 = r.bottom;
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) {
      var cs = getComputedStyle(e);
      if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) return null;
      if (e !== el && (cs.overflowX !== "visible" || cs.overflowY !== "visible")) {
        var p = e.getBoundingClientRect();
        x0 = Math.max(x0, p.left); y0 = Math.max(y0, p.top); x1 = Math.min(x1, p.right); y1 = Math.min(y1, p.bottom);
      }
      if (x1 - x0 < 30 || y1 - y0 < 20) return null;
    }
    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
  }
  var XSVG = '<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style="position:absolute;inset:0;display:block">' +
    '<line x1="0" y1="0" x2="100" y2="100" stroke="#ff2a2a" stroke-width="2" vector-effect="non-scaling-stroke"/>' +
    '<line x1="100" y1="0" x2="0" y2="100" stroke="#ff2a2a" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>';
  var layer, marks = new Map();
  function make(st) {
    var d = document.createElement("div");
    d.style.cssText = "position:absolute;pointer-events:none;overflow:hidden";
    var needX = st[0] !== B;
    var lab = document.createElement("div");
    lab.style.cssText = "position:absolute;left:0;top:0;right:0;background:rgba(0,0,0,.88);color:#D4A24A;" +
      "font:600 12px/1.35 Arial,Helvetica,sans-serif;padding:6px 8px;box-sizing:border-box;" +
      "border-bottom:1px solid #D4A24A;white-space:normal;word-break:break-word;text-align:left;z-index:2";
    lab.textContent = st[0] + ": " + st[1];
    if (st[0] === R || st[0] === N || st[0] === U) lab.style.color = "#ff6a5a";
    d.innerHTML = needX ? XSVG : "";
    d.appendChild(lab);
    return d;
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
      var st = null;
      try { st = find(el); } catch (e) {}
      if (st && !marks.has(el)) { var d = make(st); layer.appendChild(d); marks.set(el, d); }
      else if (!st && marks.has(el)) { marks.get(el).remove(); marks.delete(el); }
    }
    place();
  }
  function place() {
    marks.forEach(function (d, el) {
      if (!el.isConnected) { d.remove(); marks.delete(el); return; }
      var v = null;
      try { v = visibleRect(el); } catch (e) {}
      if (!v) { d.style.display = "none"; return; }
      d.style.display = "block";
      d.style.left = (v.x + scrollX) + "px"; d.style.top = (v.y + scrollY) + "px";
      d.style.width = v.w + "px"; d.style.height = v.h + "px";
    });
  }
  var ticking = false;
  function onMove() { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; place(); }); } }
  function start() { scan(); setInterval(scan, 4000); setInterval(place, 400); addEventListener("scroll", onMove, { passive: true }); addEventListener("resize", onMove); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
