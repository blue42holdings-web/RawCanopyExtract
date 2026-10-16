/* Oct 15 (late): About page photos, phone and desktop. Only Scott's own photos and his story; one dog photo;
   no divers, no beach girl, no reef, no highway. Set inline so no older rule can bring the old photos back. */
(function () {
  var BOX = ['own-dogs-window.jpg', 'about-kayaks.jpg', 'about-dogs-trio.jpg', 'own-loaded-hatch.jpg', 'own-shasta-road.jpg', 'about-house.jpg'];
  var POS = ['center 45%', 'center', 'center 40%', 'center', 'center 60%', 'center'];
  var CREAM = 'rgb(244,240,231)';
  function photo(e, f, pos, dark) {
    var v = 'linear-gradient(rgba(0,0,0,' + dark + '),rgba(0,0,0,' + (dark + .12) + ')),url("assets/photo/' + f + '")';
    if (e.__abv === v) return; e.__abv = v;
    e.style.setProperty('background-image', v, 'important'); e.style.setProperty('background-size', '100% 100%,cover', 'important');
    e.style.setProperty('background-position', '0 0,' + pos, 'important'); e.style.setProperty('background-repeat', 'no-repeat', 'important');
    e.classList.add('rcx-abx');
    [].forEach.call(e.children, function (k) { if (k.tagName === 'DIV' && !k.textContent.trim() && /url\(/.test(getComputedStyle(k).backgroundImage)) k.style.setProperty('display', 'none', 'important'); });
  }
  function run() {
    var A = [].filter.call(document.querySelectorAll('[data-screen-label="About"]'), function (e) { return e.offsetHeight; })[0]; if (!A) return;
    var boxes = A.querySelectorAll('.ab-grid .ab-box');
    [].forEach.call(boxes, function (b, i) { if (BOX[i]) photo(b, BOX[i], POS[i], .5); });
    var sh = A.querySelector('section[data-m="shasta"]'); if (sh) photo(sh, 'own-backyard-valley.jpg', 'center 55%', .45);
    var br = A.querySelector('section[data-m="about-brand"]'); if (br) photo(br, 'own-yard-hill.jpg', 'center 45%', .45);
    var bb = A.querySelector('.ab-brand-box:not(.cmp-box)'); if (bb) photo(bb, 'own-scott-wildman.jpg', 'center 25%', .4);   // Scott, the wild man in his backyard, behind About The Brand
    var cb = A.querySelector('.cmp-box'); if (cb) photo(cb, 'own-yard-dirt.jpg', 'center', .55);
    var cs = A.querySelector('section[data-m="about-compost"]');
    if (cs) {
      // white (cream) behind the compost box and on down behind the spinning seal; short fades only
      var W1 = 'linear-gradient(#000 0,' + CREAM + ' 36px,' + CREAM + ' 100%)';
      if (cs.style.getPropertyValue('background-image') !== W1) { cs.style.setProperty('background', 'none', 'important'); cs.style.setProperty('background-image', W1, 'important'); cs.style.setProperty('background-color', CREAM, 'important'); }
      cs.classList.add('rcx-abx');
      [].forEach.call(cs.children, function (k) { if (k.tagName === 'DIV' && !k.textContent.trim() && k.style.display !== 'none') k.style.setProperty('display', 'none', 'important'); });
      var k = cs.querySelector('.ab-brand-k'); if (k) k.style.setProperty('color', '#7a5a1e', 'important');
      var nx = cs.nextElementSibling;
      if (nx && nx.tagName === 'SECTION') {
        var W2 = 'linear-gradient(' + CREAM + ' 0,' + CREAM + ' calc(100% - 36px),#000 100%)';
        if (nx.style.getPropertyValue('background-image') !== W2) { nx.style.setProperty('background-image', W2, 'important'); nx.style.setProperty('background-color', CREAM, 'important'); nx.classList.add('rcx-abx', 'rcx-abseal'); }
      }
    }
  }
  setInterval(run, 900); run();
})();
