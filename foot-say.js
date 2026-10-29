/* Oct 28 (Scott): the saying under the seal at the bottom of every page rotates through the main taglines, one per page. */
(function () {
  var SAY = ['NOTHING HIDDEN. EVERYTHING GAINED.', 'ONE INGREDIENT. NOTHING ELSE.', 'MEASURED PROPORTION.'];
  var n = 0;
  function el() { return document.querySelector('footer p[data-keep-one-line]'); }
  function apply() { var p = el(); if (p && p.textContent !== SAY[n % SAY.length]) p.textContent = SAY[n % SAY.length]; }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-page],.rr-menu a')) { n++; setTimeout(apply, 50); setTimeout(apply, 400); }
  }, true);
  setInterval(apply, 800);
  apply();
})();
