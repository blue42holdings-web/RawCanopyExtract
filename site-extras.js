/* Oct 10:
   1. Every left/right arrow row under a carousel gets a matching row above it.
   2. Background photos that don't already animate start a little dark and
      brighten very slowly once they scroll into view. */
(function () {
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. top arrow rows ---------- */
  function topNav(nav) {
    if (nav.__top || nav.hasAttribute('data-top-nav')) return;
    var anchor = nav.previousElementSibling;
    if (!anchor) return;
    while (anchor.previousElementSibling && anchor.previousElementSibling.tagName === 'SC-IF') anchor = anchor.previousElementSibling;
    var copy = nav.cloneNode(true);
    copy.setAttribute('data-top-nav', '');
    copy.removeAttribute('onclick');
    copy.style.margin = '0 0 16px';
    var orig = nav.querySelectorAll('button'), mine = copy.querySelectorAll('button');
    mine.forEach(function (b, i) {
      b.removeAttribute('onclick');
      b.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); var o = nav.querySelectorAll('button')[i]; if (o) o.click(); });
    });
    anchor.parentNode.insertBefore(copy, anchor);
    nav.__top = copy;
  }
  function syncLabels() {
    document.querySelectorAll('.rit-nav:not([data-top-nav])').forEach(function (nav) {
      var c = nav.__top; if (!c) return;
      if (!c.isConnected) { nav.__top = null; return; }
      var a = nav.querySelector('span'), b = c.querySelector('span');
      if (a && b && a.textContent !== b.textContent) b.textContent = a.textContent;
    });
  }

  /* ---------- 2. slow brighten on still background photos ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting && (e.intersectionRatio >= 0.25 || e.intersectionRect.height > innerHeight * 0.35)) { var d = e.target.__dk; if (d) d.style.opacity = '0'; io.unobserve(e.target); } });
  }, { threshold: [0, 0.05, 0.1, 0.25] }) : null;

  function busy(el) {
    if (el.hasAttribute('data-lift-bg') || el.hasAttribute('data-lift-once') || el.closest('[data-lift-bg]')) return true;
    if (el.closest('.rit-card,.hero-box,[data-m="hero"],[data-m="steps-wrap"],[data-m="bgstack"]')) return true;
    var cs = getComputedStyle(el);
    if (cs.animationName && cs.animationName !== 'none') return true;
    var pb = getComputedStyle(el, '::before'), pa = getComputedStyle(el, '::after');
    if ((pb.animationName && pb.animationName !== 'none') || (pa.animationName && pa.animationName !== 'none')) return true;
    if (/background|filter|--/.test(cs.transitionProperty) && parseFloat(cs.transitionDuration) > 0) return true;
    if (el.classList.contains('cd-lit') || el.matches('[data-ph="summit-arms-out"],[data-m="cd-fbox"]')) return true;
    return false;
  }
  function dim(el) {
    if (el.__dk) {
      // a painter later took the photo off this element (desktop mushroom pages): drop the dark layer so it can't grey a light page
      if (!/url\([^)]*assets\/photo\//.test(getComputedStyle(el).backgroundImage)) { el.__dk.remove(); el.__dk = null; el.__skip = 1; }
      return;
    }
    if (el.__skip) return;
    var bg = getComputedStyle(el).backgroundImage;
    if (!bg || !/url\([^)]*assets\/photo\//.test(bg)) return;
    var r = el.getBoundingClientRect();
    if (r.width < 120 || r.height < 90) return;
    if (busy(el)) { el.__skip = 1; return; }
    var cs = getComputedStyle(el);
    if (cs.position === 'static') el.style.position = 'relative';
    el.style.isolation = 'isolate';
    var d = document.createElement('div');
    d.setAttribute('aria-hidden', 'true');
    d.style.cssText = 'position:absolute;inset:0;z-index:-1;pointer-events:none;border-radius:inherit;background:#000;opacity:.38;transition:opacity 14s cubic-bezier(.25,.1,.25,1) .6s';
    el.insertBefore(d, el.firstChild);
    el.__dk = d;
    if (io) io.observe(el); else d.style.opacity = '0';
  }

  function scan() {
    document.querySelectorAll('.rit-nav:not([data-top-nav])').forEach(topNav);
    syncLabels();
    if (!RM) document.querySelectorAll('[style*="url("],[data-ph],.mx-box,.ab-box,.ab-brand-box,.hw-box,section,article').forEach(dim);
  }
  setInterval(scan, 900); scan();
})();
