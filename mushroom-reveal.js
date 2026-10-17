/* Oct 15 (Scott): the three mushroom pages on the phone, made uniform.
   Every photo box: the photo is always visible and in full color, starts a little darker, then slowly gets
   lighter and drifts forward when it comes into view. The old extra dark layers are switched off here. */
(function () {
  var MQ = matchMedia('(max-width:767px)'), RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAGES = ["Lion's Mane", 'Cordyceps', 'Turkey Tail'];
  // Oct 15 (night): phone photo swaps in the swipe rows, keyed by the box's first line. Scott's new photos, for variety.
  var SWAP = {
    'Turkey Tail': [[/^DATA/, 'tt-fest-big-crowd.jpg', '50% 30%'], [/^THE COMMUTE/, 'tt-subway-car.jpg', '50% 50%'], [/^THE DOUBLE BLIND/, 'tt-concert-blue.jpg', '50% 40%'],
      [/^LAB REPORT/, 'lab-soxhlet-chrome.jpg', '50% 50%'], [/^THE GUT STUDY/, 'tt-fest-wristbands.jpg', '50% 30%'], [/^RUSH HOUR/, 'tt-tube-boarding.jpg', '50% 50%']],
    'Cordyceps': [[/^GAME NIGHT/, 'cd-golf-sea.jpg', '60% 50%'], [/^THE RIVER/, 'how-kayak-whitewater.jpg', '50% 45%'], [/^THE LONG HAUL/, 'cd-marathon.jpg', '50% 40%'], [/^THE TRACK/, 'cd-track-runner.jpg', '50% 40%']]
  };
  window.__rcxPhoneSwap = SWAP;   // Oct 17: nav-extras leaves these boxes alone on the phone, so nothing flashes underneath
  var css = document.createElement('style');
  css.textContent = '@property --rk{syntax:"<number>";inherits:false;initial-value:.6}' +
    '@media (max-width:767px){' +
    '.rcx-rv.rcx-rv.rcx-rv.rcx-rv.rcx-rv{background-image:linear-gradient(rgba(0,0,0,var(--rk)),rgba(0,0,0,calc(var(--rk) + .14))),var(--rimg) !important;background-size:100% 100%,var(--rsz) !important;background-position:0 0,var(--rpos) !important;background-repeat:no-repeat !important;filter:none !important;--rk:.6;transition:--rk 9s cubic-bezier(.25,.1,.25,1) .4s,background-size 24s linear .4s !important}' +
    '.rcx-rv.rcx-on.rcx-on.rcx-on.rcx-on.rcx-on{--rk:.34;background-size:100% 100%,var(--rsz2) !important}' +
    '.rcx-rv > .rcx-dk{display:none !important}' +
    '}';
  document.head.appendChild(css);
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('rcx-on'); io.unobserve(e.target);
      // Oct 15 (night): a swipe row lights up all together, so boxes off to the side don't stay dark
      var t = e.target.closest('.cx-track'); if (t) [].forEach.call(t.children, function (c) { c.classList.add('rcx-on'); }); } });
  }, { rootMargin: '-25% 0px -25% 0px' }) : null;
  var cache = {};
  function size(url, cb) { if (cache[url]) return cb(cache[url]); var im = new Image(); im.onload = function () { cache[url] = [im.naturalWidth, im.naturalHeight]; cb(cache[url]); }; im.src = url; }
  function prep(el, page) {
    if (el.__rv || el.hasAttribute('data-ms-card')) return;
    var cs = getComputedStyle(el), m = cs.backgroundImage.match(/url\(["']?([^"')]*assets\/photo\/[^"')]+)["']?\)/);
    var L0 = SWAP[page], t0 = (el.innerText || '').trim().toUpperCase();
    if (!m && L0 && el.closest('.cx-track')) for (var j = 0; j < L0.length; j++) if (L0[j][0].test(t0)) { m = [0, 'assets/photo/' + L0[j][1]]; break; }   // a box with no photo yet gets one
    if (!m) return;
    var r = el.getBoundingClientRect(); if (r.width < 200 || r.height < 150) return;
    el.__rv = 1;
    // the extra black dimmer layers other scripts put inside the box
    [].forEach.call(el.children, function (k) { if (k.getAttribute('aria-hidden') === 'true' && /rgb\(0, 0, 0\)/.test(getComputedStyle(k).backgroundColor) && !k.children.length) k.classList.add('rcx-dk'); });
    var url = m[1], ps = cs.backgroundPosition.split(','), pos = (ps[ps.length - 1] || 'center').trim();
    if (page === 'Turkey Tail') pos = '50% 62%';   // close on the people, no headroom
    var L = SWAP[page], tx = (el.innerText || '').trim().toUpperCase();
    if (L && el.closest('.cx-track')) for (var i = 0; i < L.length; i++) if (L[i][0].test(tx)) { url = 'assets/photo/' + L[i][1]; pos = L[i][2]; break; }
    size(url, function (s) {
      var W = el.offsetWidth, H = el.offsetHeight, k = Math.max(W / s[0], H / s[1]) * (page === 'Turkey Tail' ? 1.12 : 1);
      var w = Math.ceil(s[0] * k), h = Math.ceil(s[1] * k);
      el.style.setProperty('--rimg', 'url("' + url + '")');
      el.style.setProperty('--rsz', w + 'px ' + h + 'px');
      el.style.setProperty('--rsz2', Math.ceil(w * (RM ? 1 : 1.08)) + 'px ' + Math.ceil(h * (RM ? 1 : 1.08)) + 'px');
      el.style.setProperty('--rpos', pos);
      el.style.removeProperty('background-image');   // a fixed shade stamped on by another script would block the lightening
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
      w.querySelectorAll('[data-ph] > div,.mx-box > div,.cx-track > * > div').forEach(function (el) { if (el.closest('[data-ms-card]')) return; if (/assets\/photo\//.test(getComputedStyle(el).backgroundImage) && el.offsetHeight > 150) { el.style.setProperty('display', 'none', 'important'); } });
    });
  }
  setInterval(run, 1200); run();
})();
