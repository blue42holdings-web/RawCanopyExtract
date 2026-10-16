/* Oct 15 (night), Scott: on the phone every box in a swipe row starts at the same darkness
   and comes up to the same lightness together, when its row scrolls into view.
   Same photo shade on every box (lab cards included), no box left dark off to the side. */
(function () {
  var MQ = matchMedia('(max-width:767px)');
  var SHADE = 'linear-gradient(rgba(0,0,0,.38),rgba(0,0,0,.38) 35%,rgba(0,0,0,.7) 100%)';
  var MUSH = ["Lion's Mane", 'Cordyceps', 'Turkey Tail'];
  function pageOf(el) { var c = el.closest('[data-screen-label]'); return c ? c.getAttribute('data-screen-label') : ''; }
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting) { e.target.setAttribute('data-lit', ''); io.unobserve(e.target); } });
  }, { rootMargin: '-25% 0px -25% 0px', threshold: 0 }) : null;
  function run() {
    if (!MQ.matches) return;
    document.querySelectorAll('.cx-track').forEach(function (t) {
      if (!t.__se) { t.__se = 1; if (io) io.observe(t); else t.setAttribute('data-lit', ''); }
      Array.prototype.forEach.call(t.children, function (b) {
        if (!b.classList.contains('mx-box') || b.classList.contains('mx-press') || MUSH.indexOf(pageOf(b)) >= 0) return;   // the mushroom pages have their own reveal (mushroom-reveal.js)
        var bi = b.style.getPropertyValue('background-image') || getComputedStyle(b).backgroundImage;
        var m = bi && bi.match(/url\([^)]*\)/g); if (!m) return;
        var want = SHADE + ',' + m[m.length - 1];
        if (b.__seV !== want) { b.__seV = want; b.style.setProperty('background-image', want, 'important'); }
      });
    });
    // at the very bottom of a page a row may never reach the middle, so light what is on screen
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) document.querySelectorAll('.cx-track:not([data-lit])').forEach(function (t) { var r = t.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) t.setAttribute('data-lit', ''); });
  }
  addEventListener('scroll', run, { passive: true });
  setInterval(run, 900); run();
})();
