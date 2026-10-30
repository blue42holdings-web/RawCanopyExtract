/* Keeps the gold section headers (Why we're different, In the magazines, The holy trinity of fungi) on one line by shrinking the type if a phone is narrow. */
(function () {
  function fitH() {
    [].forEach.call(document.querySelectorAll('.hg-title,.hg-press,.hg-meet'), function (e) {
      if (!e.offsetWidth) return;
      e.style.setProperty('white-space', 'nowrap', 'important'); e.style.removeProperty('font-size');
      var fs = parseFloat(getComputedStyle(e).fontSize), n = 0;
      while (e.scrollWidth > e.clientWidth + 1 && fs > 14 && n++ < 30) { fs -= 1; e.style.setProperty('font-size', fs + 'px', 'important'); }
    });
  }
  setInterval(fitH, 1500); fitH(); addEventListener('resize', fitH);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitH);
})();
