/* Photo ownership labels, Nov 12 2026 (Scott, private working view before launch).
   Puts a black box with gold text on top of each photo that needs a permission email
   or whose owner is unknown. Stock photos he can simply buy are left alone.
   Pure overlay: changes no layout. To remove: delete this file and its <script> line in index.html. */
(function () {
  var L = {
    /* EMAIL FOR PERMISSION */
    "a-diver-signalling-underwater-alongside-a-shark": "EMAIL: Hawaii Adventure Diving, Oahu | OpenWaterSharkDive@gmail.com | 808-829-2203",
    "how-freediver-line": "EMAIL: Mitch Brown Photo Freediving, Oahu | info@mitchbrownphotofreediving.com | 808-308-8311",
    "how-freediver-dark": "EMAIL: Mitch Brown Photo Freediving, Oahu | info@mitchbrownphotofreediving.com | 808-308-8311",
    "h-van-forest": "EMAIL: Tiffin Motorhomes (GH1 press photo) | call 256-356-8661, ask for marketing | contact@tiffinmotorhomes.com (unconfirmed)",
    "van-rainier-stripes26": "EMAIL: Jessica Carpenter, My Feet Will Lead Me blog | jessica@myfeetwillleadme.com",
    "lm-skagit-valley": "EMAIL: Benj Drummond, photographer | mail@benjandsara.com",
    "how-kayak-whitewater": "EMAIL: Confluence Outdoor | form at confluenceoutdoor.com/pages/contact, pick Media Inquiries",
    "lab-extraction-rig": "EMAIL: Alibaba seller hzlymachine | Contact Supplier on Alibaba listing 10000012035177",
    "cd-hero-clubs": "EMAIL: Mushroaming, Daniel Winkler | info@mushroaming.com",
    "tt-hero-habitat": "EMAIL: Wild Food UK | admin@wildfooduk.com",
    "turkey-tail-card": "EMAIL: Barbora Batokova, Fungiwoman | form at fungiwoman.com/pages/contact | hello@fungiwoman.com",
    "lab-lm-grow-room": "EMAIL: Below Farm, Abu Dhabi | info@below.farm",
    "cordyceps-forest": "EMAIL: Moksha Chocolate, Boulder | jen@mokshachocolate.com | looks AI made",
    "tt-right-form-log": "EMAIL: DailyNutra | support@DailyNutra.com | looks AI made",
    /* UNKNOWN OWNER */
    "shop-river-canyon": "UNKNOWN: Wuyi Mountain. Largest copy on China Daily, credit not found",
    "rs-changbai": "UNKNOWN: Changbai. Only on TripAdvisor traveler photos. Replace",
    "receipts-airport-line": "UNKNOWN: on Travel + Leisure, credit not read yet (maybe Getty)",
    "why-rv-desk-nopen": "UNKNOWN: looks like stock, seller not found",
    "friends-workout": "UNKNOWN: looks like stock, seller not found",
    "lm-grandpa-reading": "UNKNOWN: looks like stock, seller not found",
    "lions-mane": "UNKNOWN: stock. Maybe Shutterstock, IgorCheri. Confirm before buying",
    "lm-hero-cluster": "UNKNOWN: stock. Maybe Shutterstock, IgorCheri. Confirm before buying",
    "lm-hero-cluster-phone": "UNKNOWN: stock. Maybe Shutterstock, IgorCheri. Confirm before buying",
    "lm-white": "UNKNOWN: no source found"
  };
  var RE = /assets\/(?:photo|cutouts)\/(?:faq\/)?([^\/?#"')]+?)\.(?:jpe?g|webp|png|avif)/i;
  function stem(s) { var m = s && s.match(RE); return m ? m[1].replace(/-cutout$/, "") : null; }
  function label(el) {
    if (el.tagName === "IMG") { var s = stem(el.currentSrc || el.src); if (s && L[s]) return L[s]; }
    var cs = getComputedStyle(el), k;
    if (cs.backgroundImage !== "none" && (k = stem(cs.backgroundImage)) && L[k]) return L[k];
    var b = getComputedStyle(el, "::before").backgroundImage, a = getComputedStyle(el, "::after").backgroundImage;
    if (b && b !== "none" && (k = stem(b)) && L[k]) return L[k];
    if (a && a !== "none" && (k = stem(a)) && L[k]) return L[k];
    return null;
  }
  function hidden(el) {
    for (var i = 0, e = el; e && e.nodeType === 1 && i < 8; i++, e = e.parentElement) {
      var cs = getComputedStyle(e);
      if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) return true;
    }
    return false;
  }
  var layer, marks = new Map();
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
      var t = null;
      try { t = label(el); } catch (e) {}
      if (t && !marks.has(el)) {
        var d = document.createElement("div");
        d.style.cssText = "position:absolute;pointer-events:none;background:rgba(0,0,0,.88);color:#D4A24A;" +
          "font:600 12px/1.35 Arial,Helvetica,sans-serif;padding:6px 8px;box-sizing:border-box;" +
          "border-bottom:1px solid #D4A24A;white-space:normal;word-break:break-word;text-align:left";
        d.textContent = t;
        layer.appendChild(d);
        marks.set(el, d);
      } else if (!t && marks.has(el)) { marks.get(el).remove(); marks.delete(el); }
    }
    place();
  }
  function place() {
    marks.forEach(function (d, el) {
      if (!el.isConnected) { d.remove(); marks.delete(el); return; }
      var r = el.getBoundingClientRect();
      if (r.width < 40 || r.height < 20 || hidden(el)) { d.style.display = "none"; return; }
      d.style.display = "block";
      d.style.left = (r.left + scrollX) + "px"; d.style.top = (r.top + scrollY) + "px";
      d.style.width = r.width + "px";
    });
  }
  var ticking = false;
  function onMove() { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; place(); }); } }
  function start() { scan(); setInterval(scan, 4000); setInterval(place, 400); addEventListener("scroll", onMove, { passive: true }); addEventListener("resize", onMove); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
