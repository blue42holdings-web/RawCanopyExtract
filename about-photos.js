/* Oct 15 (late): About page photos, phone and desktop. Only Scott's own photos and his story; one dog photo;
   no divers, no beach girl, no reef, no highway. Set inline so no older rule can bring the old photos back. */
(function () {
  // Oct 15 (late, Scott): the boxes tell the story in order: the loaded car in the garage, the stuffed cargo up close, kayaks on the roof,
  // on the road, the Shasta road, and home. No dog photo up here; all three dogs go in Compost The Box.
  var BOX = ['own-loaded-hatch.jpg', 'about-loaded-car-clean.webp', 'about-kayaks.jpg', 'own-steamers-car.jpg', 'own-shasta-road.jpg', 'about-house.jpg'];
  var POS = ['center 35%', 'center 40%', 'center 40%', 'center 60%', 'center 60%', 'center'];
  var CREAM = 'rgb(244,240,231)';
  function photo(e, f, pos, dark) {
    var v = 'linear-gradient(rgba(0,0,0,' + dark + '),rgba(0,0,0,' + (dark + .12) + ')),url("assets/photo/' + f + '")';
    if (e.style.getPropertyValue('background-image') === v.replace(/"/g, '"') && e.__abv === v) return; e.__abv = v;
    e.style.setProperty('background-image', v, 'important'); e.style.setProperty('background-size', '100% 100%,cover', 'important');
    e.style.setProperty('background-position', '0 0,' + pos, 'important'); e.style.setProperty('background-repeat', 'no-repeat', 'important');
    e.classList.add('rcx-abx');
    [].forEach.call(e.children, function (k) { if (k.tagName === 'DIV' && !k.textContent.trim() && /url\(/.test(getComputedStyle(k).backgroundImage)) k.style.setProperty('display', 'none', 'important'); });
  }
  function run() {
    var A = [].filter.call(document.querySelectorAll('[data-screen-label="About"]'), function (e) { return e.offsetHeight; })[0]; if (!A) return;
    var grid = A.querySelector('.ab-grid');
    if (grid && innerWidth >= 768 && grid.style.getPropertyValue('grid-template-columns') !== 'repeat(2, minmax(0px, 1fr))') {
      grid.style.setProperty('grid-template-columns', 'repeat(2, minmax(0px, 1fr))', 'important'); grid.style.setProperty('max-width', '1100px', 'important');
      grid.style.setProperty('margin-left', 'auto', 'important'); grid.style.setProperty('margin-right', 'auto', 'important');
    }
    // the top photo starts dark and slowly comes up every time the page opens, like the other pages
    var hero = A.querySelector('section[data-m="about-hero"]');
    if (hero) {
      var vis = hero.getBoundingClientRect().height > 0;
      if (vis && !hero.__fadeOn) { hero.__fadeOn = 1; hero.classList.remove('rcx-abfade-on'); hero.classList.add('rcx-abfade'); void hero.offsetWidth; setTimeout(function () { hero.classList.add('rcx-abfade-on'); }, 600); }
      if (!vis) hero.__fadeOn = 0;
    }
    var boxes = A.querySelectorAll('.ab-grid .ab-box');
    [].forEach.call(boxes, function (b, i) { if (BOX[i]) photo(b, BOX[i], POS[i], .5); });
    // Scott's backyard, the wide shot with Buddy coming up the hill, behind the story boxes and on down behind About The Brand as one picture
    var sh = A.querySelector('section[data-m="shasta"]'), br = A.querySelector('section[data-m="about-brand"]');
    if (sh && br) {
      var W = sh.offsetWidth, H1 = sh.offsetHeight, H2 = br.offsetHeight, k = Math.max(W / 1350, (H1 + H2) / 1800), iw = Math.ceil(1350 * k), ih = Math.ceil(1800 * k), x = Math.round((W - iw) / 2), y0 = Math.round((H1 + H2 - ih) / 2);
      [[sh, y0], [br, y0 - H1]].forEach(function (z) {
        var v = 'linear-gradient(rgba(0,0,0,.42),rgba(0,0,0,.5)),url("assets/photo/own-yard-hill.jpg")', ps = '0 0,' + x + 'px ' + z[1] + 'px', sz = '100% 100%,' + iw + 'px ' + ih + 'px';
        if (z[0].__yk === v + ps + sz && z[0].style.getPropertyValue('background-image')) return; z[0].__yk = v + ps + sz;
        z[0].style.setProperty('background', 'none', 'important');
        z[0].style.setProperty('background-image', v, 'important'); z[0].style.setProperty('background-size', sz, 'important');
        z[0].style.setProperty('background-position', ps, 'important'); z[0].style.setProperty('background-repeat', 'no-repeat', 'important');
        z[0].style.setProperty('background-color', '#1b1610', 'important'); z[0].classList.add('rcx-abx');
        [].forEach.call(z[0].children, function (kd) { if (kd.tagName === 'DIV' && !kd.textContent.trim() && /url\(/.test(getComputedStyle(kd).backgroundImage)) kd.style.setProperty('display', 'none', 'important'); });
      });
    }
    var bb = A.querySelector('.ab-brand-box:not(.cmp-box)'); if (bb) photo(bb, 'own-scott-wildman.jpg', 'center 40%', .36);   // Scott, the wild man in his backyard, behind About The Brand
    var cb = A.querySelector('.cmp-box'); if (cb) photo(cb, 'about-three-dogs-2.webp', 'center 45%', .45);   // all three dogs in one photo
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
        var W2 = 'linear-gradient(' + CREAM + ' 0,' + CREAM + ' calc(100% - 10px),#000 100%)';   // white holds, then a very quick fade (long fades are only for photo to photo)
        if (nx.style.getPropertyValue('padding-bottom') !== '64px') nx.style.setProperty('padding-bottom', '64px', 'important');
        // the seal block sat about 90px right of center; center it under the boxes above
        var sv = [].slice.call(nx.querySelectorAll('svg')).sort(function (a, b) { return b.getBoundingClientRect().width - a.getBoundingClientRect().width; })[0]; for (var q = sv, n = 0; q && q !== nx && n < 7; q = q.parentElement, n++) { if (parseFloat(getComputedStyle(q).marginLeft) > 40 && q.offsetWidth < nx.offsetWidth - 40) { q.style.setProperty('margin-left', 'auto', 'important'); q.style.setProperty('margin-right', 'auto', 'important'); } if (parseFloat(getComputedStyle(q).left) > 10 && getComputedStyle(q).position === 'relative') q.style.setProperty('left', '0px', 'important'); }
        if (nx.style.getPropertyValue('padding-left') !== '0px') { nx.style.setProperty('padding-left', '0px', 'important'); nx.style.setProperty('padding-right', '0px', 'important'); }
        if (nx.style.getPropertyValue('background-image') !== W2) { nx.style.setProperty('background-image', W2, 'important'); nx.style.setProperty('background-color', CREAM, 'important'); nx.classList.add('rcx-abx', 'rcx-abseal'); }
      }
    }
  }
  setInterval(run, 900); run();
})();
