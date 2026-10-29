/* Oct 28 (Scott): the mushroom pages were far too long. Each is now: top photo, the claim, four evidence cards
   (evidence lives here), how it's made, then a shop button. No magazines (they live on the front page only),
   no further reading, no second swipe row of extras. */
(function () {
  var KEEP = {
    "Lion's Mane": [/^WHAT.S BEEN STUDIED/, /^LAB REPORT.{0,4}HUMAN/, /^THE 12 WEEK/, /^LAB REPORT.{0,4}PUBMED/],
    'Cordyceps': [/^WHAT.S BEEN STUDIED/, /^LAB REPORT.{0,4}HUMAN/, /^THE LONG HAUL/, /^THE REACTION TIME/],
    'Turkey Tail': [/^THE GUT STUDY/, /^WHAT.S BEEN STUDIED/, /^THE DOUBLE BLIND/, /^LAB REPORT.{0,4}PUBMED/]
  };
  var NAME = { "Lion's Mane": "LION'S MANE", 'Cordyceps': 'CORDYCEPS', 'Turkey Tail': 'TURKEY TAIL' };
  function hide(el, on) { if (!el) return; var v = on ? 'x' : ''; if ((el.getAttribute('data-lean') || '') !== v) { if (on) el.setAttribute('data-lean', 'x'); else el.removeAttribute('data-lean'); } }
  function run() {
    [].forEach.call(document.querySelectorAll('[data-screen-label]'), function (P) {
      var L = P.getAttribute('data-screen-label'); if (!KEEP[L] || !P.offsetHeight) return;
      var num = P.querySelector('section[data-m^="num-"]'); if (!num) return;
      var main = [].filter.call(num.querySelectorAll('.cx-track'), function (t) { return !t.closest('.pr-row'); })[0];
      if (main) [].forEach.call(main.children, function (k) {
        var t = (k.innerText || '').replace(/\s+/g, ' ').trim().toUpperCase(); if (!t) return;
        hide(k, !KEEP[L].some(function (r) { return r.test(t); }));
      });
      // magazines: the press row and its "swipe for the proof" line
      [].forEach.call(num.querySelectorAll('.pr-row'), function (r) { hide(r, true); var s = r.previousElementSibling; if (s && /swipe/i.test(s.innerText || '') ) hide(s, true); });
      [].forEach.call(num.querySelectorAll('.cx-track'), function (t) { if (t !== main && t.closest('.pr-row') == null && /NATIONAL|FORBES|NEW YORK|TIME|WIRED|HEALTH|CNN|BBC/i.test(t.innerText || '')) { hide(t, true); var p = t.parentElement; if (p && p !== num) hide(p, true); } });
      var wrap = P.querySelector(':scope > .ms-wrap');
      if (wrap && !wrap.querySelector('.ml-shop')) {
        var d = document.createElement('div'); d.className = 'ml-shop';
        d.innerHTML = '<button type="button" class="rcx-metal rcx-btn">SHOP ' + NAME[L] + '</button>';
        d.firstChild.addEventListener('click', function (e) { e.preventDefault(); var n = document.querySelector('header [data-page="shop"],[data-page="shop"]'); if (n) n.click(); });
        wrap.appendChild(d);
      }
    });
  }
  setInterval(run, 1200); run();
  new MutationObserver(function () { run(); }).observe(document.body, { childList: true, subtree: true });
})();
