/* Oct 15 (later): desktop mushroom pages. Boxes that were stacked one under another sit side by side:
   Lion's Mane What It Is + The Steady Burn; Turkey Tail What It Is, Where Ours Comes From, How It's Made,
   What's Been Studied; Turkey Tail Further Reading + The Names It Goes By. Desktop only. */
(function () {
  var MQ = matchMedia('(min-width:768px)');
  var GROUPS = {
    "Lion's Mane": [['[data-ph="elder-camp-chair-mug"]', '[data-rcx-burn]']],
    'Turkey Tail': [['[data-ph="meditation-sunset-hands"]', '[data-ph="palm-jungle-sun"]', '[data-ph="tank-lab"]', '[data-ph="reef-snorkel"]'],
                    ['[data-ph="waterfall-stones"]', '[data-ph="herb-jars-book"]']]
  };
  function page(label) { return [].filter.call(document.querySelectorAll('[data-screen-label]'), function (e) { return e.getAttribute('data-screen-label') === label && e.offsetHeight; })[0]; }
  function run() {
    if (!MQ.matches) return;
    var lm = page("Lion's Mane");
    if (lm) {
      var b = lm.querySelector('section[data-m="lm-burn"] > div'); if (b && !b.hasAttribute('data-rcx-burn')) b.setAttribute('data-rcx-burn', '');
      // other scripts strip these two boxes' backgrounds inline; put Scott's photos back the same way
      [[b, 'own-oregon-coast.jpg', 'center'], [lm.querySelector('[data-ph="elder-camp-chair-mug"]'), 'own-yosemite-domes.jpg', 'center 40%']].forEach(function (x) {
        if (!x[0] || !x[0].parentElement.classList.contains('rcx-row2')) return;
        var v = 'linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.6)),url("assets/photo/' + x[1] + '")';
        if (x[0].style.getPropertyValue('background-image').indexOf(x[1]) < 0) {
          x[0].style.setProperty('background-image', v, 'important'); x[0].style.setProperty('background-size', '100% 100%,cover', 'important');
          x[0].style.setProperty('background-position', '0 0,' + x[2], 'important'); x[0].style.setProperty('background-repeat', 'no-repeat', 'important');
        }
      });
    }
    ['Lion\'s Mane', 'Cordyceps', 'Turkey Tail'].forEach(function (L) {
      var w = page(L); if (!w) return;
      w.querySelectorAll('[data-ph],[data-m="cd-fbox"],[data-rcx-burn]').forEach(function (e) { e.classList.add('rcx-x'); });
      (GROUPS[L] || []).forEach(function (g) {
        var els = g.map(function (s) { return w.querySelector(s); });
        if (els.some(function (e) { return !e; }) || els[0].parentElement.classList.contains('rcx-row2')) return;
        var row = document.createElement('div'); row.className = 'rcx-row2'; row.setAttribute('data-n', String(els.length));
        var firstSec = els[0].closest('section') || els[0].parentElement;
        firstSec.parentNode.insertBefore(row, firstSec);
        els.forEach(function (e) {
          var sec = e.closest('section');
          row.appendChild(e);
          if (sec && !sec.querySelector('[data-ph],h2,h3,p,a,button')) sec.setAttribute('data-rcx-emptied', '');
        });
      });
    });
  }
  setInterval(run, 1000); run();
})();
