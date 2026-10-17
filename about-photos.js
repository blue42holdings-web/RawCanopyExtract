/* Oct 15 (late): About page photos, phone and desktop. Only Scott's own photos and his story; one dog photo;
   no divers, no beach girl, no reef, no highway. Set inline so no older rule can bring the old photos back. */
(function () {
  // Oct 15 (late, Scott): the boxes tell the story in order: the loaded car in the garage, the stuffed cargo up close, kayaks on the roof,
  // on the road, the Shasta road, and home. No dog photo up here; all three dogs go in Compost The Box.
  // Oct 16 (Scott): his selfie looking down, hair hanging (the original About photo of him), opens the story instead of two car shots back to back; home loses its sky
  var BOX = ['about-selfie.webp', 'about-loaded-car-clean.webp', 'about-kayaks.jpg', 'own-car-shop-lift.jpg', 'own-river.jpg', 'about-house-level.jpg'];
  var POS = ['center 56%', 'center 40%', 'center 40%', 'center 60%', 'center 60%', 'center 50%'];   // Oct 17 (Scott): house straightened, sky and ground even
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
    if (grid && innerWidth < 768) {
      // Oct 16 (Scott), phone: the story reads as one block of normal paragraphs; behind it the six photos
      // stack at equal heights (the story's height divided by six)
      grid.classList.add('ab-onestory'); grid.style.setProperty('padding', '26px 22px 8px', 'important');
      [].forEach.call(boxes, function (b) { var q = b.querySelector('p'); if (q) q.style.setProperty('margin', '0 0 18px', 'important'); });
      [].forEach.call(boxes, function (b) { if (b.__abv) { b.__abv = 0; b.style.removeProperty('background-image'); } b.style.setProperty('background', 'none', 'important'); });
      var st = grid.querySelector(':scope > .ab-strip');
      if (!st) {
        st = document.createElement('div'); st.className = 'ab-strip'; st.setAttribute('aria-hidden', 'true');
        BOX.forEach(function (f, i) { var d = document.createElement('div'); var dk = i === 0 ? .62 : .5;
          d.style.backgroundImage = 'linear-gradient(rgba(0,0,0,' + dk + '),rgba(0,0,0,' + (dk + .12) + ')),url("assets/photo/' + f + '")';
          d.style.backgroundSize = '100% 100%,cover'; d.style.backgroundPosition = '0 0,' + POS[i]; st.appendChild(d); });
        grid.insertBefore(st, grid.firstChild);
      }
    } else {
      if (grid) { grid.classList.remove('ab-onestory'); grid.style.removeProperty('padding'); var st2 = grid.querySelector(':scope > .ab-strip'); if (st2) st2.remove(); }
      [].forEach.call(boxes, function (b, i) { if (BOX[i]) photo(b, BOX[i], POS[i], i === 0 ? .62 : .5); });   // Oct 16 (Scott): his selfie a little darker
    }
    if (boxes[5] && innerWidth >= 768) boxes[5].style.setProperty('background-size', '100% 100%,150% auto', 'important');
    // Scott's backyard, the wide shot with Buddy coming up the hill, behind the story boxes and on down behind About The Brand as one picture
    var sh = A.querySelector('section[data-m="shasta"]'), br = A.querySelector('section[data-m="about-brand"]');
    if (br && innerWidth < 768) {   // Oct 15 (late, Scott): phone, cream from About The Brand on down (his photo stays in the box)
      var CW = 'linear-gradient(#000,#000)';   // Oct 16 (Scott): no white at the top of About; black behind the top box and the story boxes
      if (br.style.getPropertyValue('background-image') !== CW) { br.style.setProperty('background', 'none', 'important'); br.style.setProperty('background-image', CW, 'important'); br.style.setProperty('background-color', CREAM, 'important'); br.classList.add('rcx-abx', 'rcx-abwhite'); }
      [].forEach.call(br.children, function (k) { if (k.tagName === 'DIV' && !k.textContent.trim() && k.style.display !== 'none') k.style.setProperty('display', 'none', 'important'); });
      var bk = br.querySelector('.ab-brand-k'); if (bk) bk.style.setProperty('color', '#7a5a1e', 'important');
      var cs2 = A.querySelector('section[data-m="about-compost"]'); if (cs2) cs2.style.setProperty('background-image', 'none', 'important');
      // and white all the way up behind the story boxes too
      if (sh && !sh.__skyThru) { sh.__skyThru = 1; sh.style.setProperty('background', 'transparent', 'important'); sh.style.setProperty('background-image', 'none', 'important'); sh.style.setProperty('background-color', 'transparent', 'important'); sh.classList.add('rcx-abx'); }   // Oct 16 (Scott): the pink sky runs down behind the story boxes, then fades to black
      if (sh) [].forEach.call(sh.children, function (k) { if (k.tagName === 'DIV' && !k.textContent.trim() && k.style.display !== 'none') k.style.setProperty('display', 'none', 'important'); });
      if (br.style.getPropertyValue('background-image') !== 'none') { br.style.setProperty('background-image', 'none', 'important'); }
      // Oct 17 (Scott): phone, the pink sky runs the full length of the story boxes, fading to black right where About The Brand begins
      var bsec = A.querySelector('section[data-m="about-brand"]'); if (bsec && bsec.style.getPropertyValue('margin-top') !== '140px') bsec.style.setProperty('margin-top', '140px', 'important');
      var carL = [].filter.call(A.querySelectorAll('div,section,figure'), function (e) { return e.offsetHeight > 50 && getComputedStyle(e).backgroundImage.indexOf('own-car-shop-lift') >= 0; })[0];   // Oct 17 (Scott, 4:52pm): phone, sky zoomed out and fades to black under the second car photo
      if (sh && carL) { var skyH = Math.round(carL.getBoundingClientRect().bottom - A.getBoundingClientRect().top) + 60; if (skyH > 600 && A.__skyH !== skyH) { A.__skyH = skyH; A.style.setProperty('--abSky', skyH + 'px'); } }   // Oct 17 (Scott, later): the sky runs 190px past the story box and dissolves to black there, so it never ends on a hard line
    }
    if (sh && br && innerWidth >= 768) {
      // Oct 16 (Scott): the Oregon coast photo is never used; the pink sky behind the top runs down behind these instead
      [sh, br].forEach(function (z) {
        if (z.__noCoast) return; z.__noCoast = 1;
        z.style.setProperty('background', 'transparent', 'important');
        z.style.setProperty('background-image', 'none', 'important');
        z.style.setProperty('background-color', 'transparent', 'important'); z.classList.add('rcx-abx');
        [].forEach.call(z.children, function (kd) { if (kd.tagName === 'DIV' && !kd.textContent.trim() && /url\(/.test(getComputedStyle(kd).backgroundImage)) kd.style.setProperty('display', 'none', 'important'); });
      });
    }
    var bb = A.querySelector('.ab-brand-box:not(.cmp-box)'); if (bb) photo(bb, 'own-scott-wildman.jpg', 'center 40%', .6);   // Scott, the wild man in his backyard, behind About The Brand
    var cb = A.querySelector('.cmp-box'); if (cb) photo(cb, innerWidth >= 768 ? 'about-three-dogs-wide.jpg' : 'own-two-labs-hill.jpg', innerWidth >= 768 ? 'center 0%' : 'center 30%', .5);   // Oct 17: desktop zoomed all the way out, sides filled softly, no black bars   // Oct 16 (Scott): his two labs on the hill, towel painted out; one photo, never a collage   // Oct 15 (night): phone, all three dogs, one above the other to fit the tall box   // phone: the two labs, all heads in   // all three dogs in one photo
    var cs = A.querySelector('section[data-m="about-compost"]');
    if (cs) {
      // white (cream) behind the compost box and on down behind the spinning seal; short fades only
      var W1 = 'linear-gradient(#000,#000)';   // Oct 16 (Scott): black behind Compost The Box, above the heading too
      if (cs.style.getPropertyValue('background-image') !== W1) { cs.style.setProperty('background', 'none', 'important'); cs.style.setProperty('background-image', W1, 'important'); cs.style.setProperty('background-color', '#000', 'important'); }
      cs.classList.add('rcx-abx');
      [].forEach.call(cs.children, function (k) { if (k.tagName === 'DIV' && !k.textContent.trim() && k.style.display !== 'none') k.style.setProperty('display', 'none', 'important'); });
      var k = cs.querySelector('.ab-brand-k'); if (k) k.style.setProperty('color', '#D4A24A', 'important');
      var nx = cs.nextElementSibling;
      if (nx && nx.tagName === 'SECTION') {
        var W2 = 'linear-gradient(#000,#000)';   // Oct 16 (Scott): no white behind the seal at the bottom; a short fade from the compost white into black   // white holds, then a very quick fade (long fades are only for photo to photo)
        if (nx.style.getPropertyValue('padding-bottom') !== '64px') nx.style.setProperty('padding-bottom', '64px', 'important');
        // the seal block sat about 90px right of center; center it under the boxes above
        var sv = [].slice.call(nx.querySelectorAll('svg')).sort(function (a, b) { return b.getBoundingClientRect().width - a.getBoundingClientRect().width; })[0]; for (var q = sv, n = 0; q && q !== nx && n < 7; q = q.parentElement, n++) { if (parseFloat(getComputedStyle(q).marginLeft) > 40 && q.offsetWidth < nx.offsetWidth - 40) { q.style.setProperty('margin-left', 'auto', 'important'); q.style.setProperty('margin-right', 'auto', 'important'); } if (parseFloat(getComputedStyle(q).left) > 10 && getComputedStyle(q).position === 'relative') q.style.setProperty('left', '0px', 'important'); }
        if (nx.style.getPropertyValue('padding-left') !== '0px') { nx.style.setProperty('padding-left', '0px', 'important'); nx.style.setProperty('padding-right', '0px', 'important'); }
        // Oct 16 (Scott, later): plain black behind the seal; the pink sky moved to the top of the page
        if (nx.style.getPropertyValue('background-image') !== W2) { nx.style.setProperty('background-image', W2, 'important'); nx.style.setProperty('background-color', '#000', 'important'); nx.classList.add('rcx-abx', 'rcx-abseal'); }
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
