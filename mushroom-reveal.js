/* Oct 15 (Scott): the three mushroom pages on the phone, made uniform.
   Every photo box: the photo is always visible and in full color, starts a little darker, then slowly gets
   lighter and drifts forward when it comes into view. The old extra dark layers are switched off here. */
(function () {
  var MQ = matchMedia('(max-width:767px)'), RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAGES = ["Lion's Mane", 'Cordyceps', 'Turkey Tail'];
  var css = document.createElement('style');
  css.textContent = '@property --rk{syntax:"<number>";inherits:false;initial-value:.6}' +
    '@media (max-width:767px){' +
    '.rcx-rv.rcx-rv.rcx-rv.rcx-rv.rcx-rv{background-image:linear-gradient(rgba(0,0,0,var(--rk)),rgba(0,0,0,calc(var(--rk) + .14))),var(--rimg) !important;background-size:100% 100%,var(--rsz) !important;background-position:0 0,var(--rpos) !important;background-repeat:no-repeat !important;filter:none !important;--rk:.6;transition:--rk 9s cubic-bezier(.25,.1,.25,1) .4s,background-size 24s linear .4s !important}' +
    '.rcx-rv.rcx-on.rcx-on.rcx-on.rcx-on.rcx-on{--rk:.34;background-size:100% 100%,var(--rsz2) !important}' +
    '.rcx-rv > .rcx-dk{display:none !important}' +
    '}';
  document.head.appendChild(css);
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('rcx-on'); io.unobserve(e.target); } });
  }, { rootMargin: '-25% 0px -25% 0px' }) : null;
  var cache = {};
  function size(url, cb) { if (cache[url]) return cb(cache[url]); var im = new Image(); im.onload = function () { cache[url] = [im.naturalWidth, im.naturalHeight]; cb(cache[url]); }; im.src = url; }
  function prep(el, page) {
    if (el.__rv) return;
    var cs = getComputedStyle(el), m = cs.backgroundImage.match(/url\(["']?([^"')]*assets\/photo\/[^"')]+)["']?\)/);
    if (!m) return;
    var r = el.getBoundingClientRect(); if (r.width < 200 || r.height < 150) return;
    el.__rv = 1;
    // the extra black dimmer layers other scripts put inside the box
    [].forEach.call(el.children, function (k) { if (k.getAttribute('aria-hidden') === 'true' && /rgb\(0, 0, 0\)/.test(getComputedStyle(k).backgroundColor) && !k.children.length) k.classList.add('rcx-dk'); });
    var url = m[1], ps = cs.backgroundPosition.split(','), pos = (ps[ps.length - 1] || 'center').trim();
    if (page === 'Turkey Tail') pos = '50% 62%';   // close on the people, no headroom
    size(url, function (s) {
      var W = el.offsetWidth, H = el.offsetHeight, k = Math.max(W / s[0], H / s[1]) * (page === 'Turkey Tail' ? 1.12 : 1);
      var w = Math.ceil(s[0] * k), h = Math.ceil(s[1] * k);
      el.style.setProperty('--rimg', 'url("' + url + '")');
      el.style.setProperty('--rsz', w + 'px ' + h + 'px');
      el.style.setProperty('--rsz2', Math.ceil(w * (RM ? 1 : 1.08)) + 'px ' + Math.ceil(h * (RM ? 1 : 1.08)) + 'px');
      el.style.setProperty('--rpos', pos);
      el.classList.add('rcx-rv');
      if (io) io.observe(el); else el.classList.add('rcx-on');
    });
  }
  function run() {
    if (!MQ.matches) return;
    PAGES.forEach(function (p) {
      var w = [].filter.call(document.querySelectorAll('[data-screen-label]'), function (e) { return e.getAttribute('data-screen-label') === p && e.offsetHeight; })[0];
      if (!w) return;
      w.querySelectorAll('[data-ph],.mx-box,.cx-track > *,[data-m="made-box"],[data-m="cd-fbox"]').forEach(function (el) { if (!el.closest('section[data-m$="-hero"]')) prep(el, p); });
      w.querySelectorAll('[data-ph] > div,.mx-box > div,.cx-track > * > div').forEach(function (el) { if (/assets\/photo\//.test(getComputedStyle(el).backgroundImage) && el.offsetHeight > 150) { el.style.setProperty('display', 'none', 'important'); } });
    });
  }
  setInterval(run, 1200); run();
})();
