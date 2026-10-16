/* Oct 15 (late): About page photos, phone and desktop. Only Scott's own photos and his story; one dog photo;
   no divers, no beach girl, no reef, no highway. Set inline so no older rule can bring the old photos back. */
(function () {
  // Oct 15 (late, Scott): the boxes tell the story in order: the loaded car in the garage, the stuffed cargo up close, kayaks on the roof,
  // on the road, the Shasta road, and home. No dog photo up here; all three dogs go in Compost The Box.
  var BOX = ['own-loaded-hatch.jpg', 'about-loaded-car-clean.webp', 'about-kayaks.jpg', 'own-steamers-car.jpg', 'own-shasta-road.jpg', 'about-house.jpg'];
  var POS = ['center 35%', 'center 40%', 'center 40%', 'center 60%', 'center 60%', 'center 92%'];
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
    if (boxes[5] && innerWidth >= 768) boxes[5].style.setProperty('background-size', '100% 100%,150% auto', 'important');
    // Scott's backyard, the wide shot with Buddy coming up the hill, behind the story boxes and on down behind About The Brand as one picture
    var sh = A.querySelector('section[data-m="shasta"]'), br = A.querySelector('section[data-m="about-brand"]');
    if (br && innerWidth < 768) {   // Oct 15 (late, Scott): phone, cream from About The Brand on down (his photo stays in the box)
      var CW = 'linear-gradient(#000 0,' + CREAM + ' 36px,' + CREAM + ' 100%)';
      if (br.style.getPropertyValue('background-image') !== CW) { br.style.setProperty('background', 'none', 'important'); br.style.setProperty('background-image', CW, 'important'); br.style.setProperty('background-color', CREAM, 'important'); br.classList.add('rcx-abx', 'rcx-abwhite'); }
      [].forEach.call(br.children, function (k) { if (k.tagName === 'DIV' && !k.textContent.trim() && k.style.display !== 'none') k.style.setProperty('display', 'none', 'important'); });
      var bk = br.querySelector('.ab-brand-k'); if (bk) bk.style.setProperty('color', '#7a5a1e', 'important');
      var cs2 = A.querySelector('section[data-m="about-compost"]'); if (cs2) cs2.style.setProperty('background-image', 'none', 'important');
      // and white all the way up behind the story boxes too
      if (sh && sh.style.getPropertyValue('background-image') !== CW) { sh.style.setProperty('background', 'none', 'important'); sh.style.setProperty('background-image', CW, 'important'); sh.style.setProperty('background-color', CREAM, 'important'); sh.classList.add('rcx-abx'); }
      if (sh) [].forEach.call(sh.children, function (k) { if (k.tagName === 'DIV' && !k.textContent.trim() && k.style.display !== 'none') k.style.setProperty('display', 'none', 'important'); });
      if (br.style.getPropertyValue('background-image') !== 'none') { br.style.setProperty('background-image', 'none', 'important'); }
    }
    if (sh && br && innerWidth >= 768) {
      var W = sh.offsetWidth, H1 = sh.offsetHeight, H2 = br.offsetHeight, k = Math.max(W / 2000, (H1 + H2) / 1500), iw = Math.ceil(2000 * k), ih = Math.ceil(1500 * k), x = Math.round((W - iw) / 2), y0 = Math.round((H1 + H2 - ih) / 2);
      [[sh, y0], [br, y0 - H1]].forEach(function (z) {
        var v = 'linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0)),linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.55)),url("assets/photo/own-oregon-coast.jpg")', ps = '0 0,0 0,' + x + 'px ' + z[1] + 'px', sz = '100% 100%,100% 100%,' + iw + 'px ' + Math.round(ih) + 'px';
        if (z[0].__yk === v + ps + sz && z[0].style.getPropertyValue('background-image')) return; z[0].__yk = v + ps + sz;
        z[0].style.setProperty('background', 'none', 'important');
        z[0].style.setProperty('background-image', v, 'important'); z[0].style.setProperty('background-size', sz, 'important');
        z[0].style.setProperty('background-position', ps, 'important'); z[0].style.setProperty('background-repeat', 'no-repeat', 'important');
        z[0].style.setProperty('background-color', '#1b1610', 'important'); z[0].classList.add('rcx-abx');
        [].forEach.call(z[0].children, function (kd) { if (kd.tagName === 'DIV' && !kd.textContent.trim() && /url\(/.test(getComputedStyle(kd).backgroundImage)) kd.style.setProperty('display', 'none', 'important'); });
      });
    }
    var bb = A.querySelector('.ab-brand-box:not(.cmp-box)'); if (bb) photo(bb, 'own-scott-wildman.jpg', 'center 40%', .6);   // Scott, the wild man in his backyard, behind About The Brand
    var cb = A.querySelector('.cmp-box'); if (cb) photo(cb, 'about-three-dogs-2.webp', innerWidth < 768 ? '21% 50%' : 'center 0%', .45);   // phone: the two labs, all heads in   // all three dogs in one photo
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

/* Oct 15 (late): About top box, desktop. The vane cutout was sized against a bigger box than the photo, so two vanes showed.
   Pin the cutout to exactly where the photo is drawn. Headline in the middle of the box. */
(function () {
  var IW = 0, IH = 0, im = new Image(); im.onload = function () { IW = im.naturalWidth; IH = im.naturalHeight; }; im.src = 'assets/photo/about-colestin-windvane-flip.jpg';
  function run() {
    if (innerWidth < 768 || !IW) return;
    var s = document.querySelector('section[data-m="about-hero"]'); if (!s || !s.offsetHeight) return;
    var ph = [].filter.call(s.children, function (k) { return !k.hasAttribute('data-lift-layer') && /windvane/.test(getComputedStyle(k).backgroundImage); })[0] || s;
    var layer = s.querySelector('[data-lift-layer]'); if (!layer) return;
    var cut = layer.lastElementChild; if (!cut) return;
    var pr = ph.getBoundingClientRect(), lr = layer.getBoundingClientRect();
    var k = Math.max(pr.width / IW, pr.height / IH), w = IW * k, h = IH * k, x = (pr.width - w) * 0.5 + (pr.left - lr.left), y = (pr.height - h) * 0.28 + (pr.top - lr.top);
    var sz = w.toFixed(1) + 'px ' + h.toFixed(1) + 'px', ps = x.toFixed(1) + 'px ' + y.toFixed(1) + 'px';
    if (cut.style.backgroundSize !== sz) cut.style.backgroundSize = sz;
    if (cut.style.backgroundPosition !== ps) cut.style.backgroundPosition = ps;
  }
  setInterval(run, 300);
})();
