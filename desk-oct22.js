/* Oct 22 2026 (Scott): desktop notes.
   1. No "Swipe for more" on desktop where nothing swipes.
   2. Turkey Tail: the three boxes at the bottom sit centered, lined up under the magazines.
   3. Mushroom page endings, all three the same: the story box, then a fade to black, a beat of black,
      then the RCX field pattern cuts on hard. Lion's Mane's story box sits on the blue Mount Shasta photo.
   4. Lion's Mane story box says LIVE NOW (desktop and phone).
   5. Cordyceps: the Reaction Time box gets the college track photo.
   (6. About's two labs photo lives in about-photos.js.) */
(function () {
  var PAGES = ["Lion's Mane", 'Cordyceps', 'Turkey Tail'];
  function desk() { return innerWidth >= 768; }
  function vis(e) { return e && e.offsetHeight > 0; }
  function setI(el, prop, val) { if (el.style.getPropertyValue(prop) !== val || el.style.getPropertyPriority(prop) !== 'important') el.style.setProperty(prop, val, 'important'); }
  function txt(e) { return (e.textContent || '').replace(/\s+/g, ' ').trim(); }

  // 1. swipe labels: on desktop, hide any whose row doesn't scroll sideways
  function scroller(el) {
    var cands = [];   // the row can follow the label, or follow the arrow bar the label sits in
    for (var x = el, up = 0; x && up < 3; x = x.parentElement, up++)
      for (var s = x.nextElementSibling, k = 0; s && k < 3; s = s.nextElementSibling, k++) { cands.push(s); [].push.apply(cands, s.querySelectorAll('*')); }
    for (var i = 0; i < cands.length; i++) { var c = cands[i], ox = getComputedStyle(c).overflowX; if ((ox === 'auto' || ox === 'scroll') && c.offsetWidth > 200) return c; }
    return null;
  }
  function swipes() {
    var tags = [].filter.call(document.querySelectorAll('.rcx-swipe-tag, p, div, span'), function (e) {
      return e.children.length < 3 && /^\s*(‹\s*)?SWIPE FOR /i.test(e.textContent || '') && (e.textContent || '').length < 40 && !e.querySelector('.rcx-swipe-tag');
    });
    tags.forEach(function (t) {
      if (!desk()) { if (t.hasAttribute('data-dk-noswipe')) { t.removeAttribute('data-dk-noswipe'); t.style.removeProperty('display'); } return; }
      if (t.closest('.pl-box')) return;
      var sc = scroller(t), moves = sc && sc.scrollWidth > sc.clientWidth + 4;
      if (!moves) { t.setAttribute('data-dk-noswipe', ''); setI(t, 'display', 'none'); }
      else if (t.hasAttribute('data-dk-noswipe')) { t.removeAttribute('data-dk-noswipe'); t.style.removeProperty('display'); }
    });
  }

  // 2. Turkey Tail bottom row: three boxes the same width as the magazine row above
  function ttRow(P) {
    var row = P.querySelector('.ms-row'); if (!row) return;
    var cards = [].filter.call(row.children, vis);
    if (!desk() || cards.length < 3) { if (row.__dk) { row.__dk = 0; row.style.removeProperty('padding-left'); row.style.removeProperty('padding-right'); row.style.removeProperty('overflow-x'); cards.forEach(function (c) { ['flex', 'width', 'max-width'].forEach(function (p) { c.style.removeProperty(p); }); }); } return; }
    var mags = [].filter.call(P.querySelectorAll('.pr-row .mx-press, .pr-row .mx-box'), vis);
    if (!mags.length) return;
    var L = Infinity, R = -Infinity;
    mags.forEach(function (m) { var r = m.getBoundingClientRect(); L = Math.min(L, r.left); R = Math.max(R, r.right); });
    var rr = row.getBoundingClientRect(), gap = 24, n = cards.length, w = Math.floor((R - L - gap * (n - 1)) / n);
    if (w < 200) return;
    row.__dk = 1;
    setI(row, 'padding-left', Math.round(L - rr.left) + 'px'); setI(row, 'padding-right', Math.round(rr.right - R) + 'px'); setI(row, 'overflow-x', 'hidden'); setI(row, 'gap', gap + 'px');
    cards.forEach(function (c) { setI(c, 'flex', '0 0 ' + w + 'px'); setI(c, 'width', w + 'px'); setI(c, 'max-width', w + 'px'); });
  }

  // 3 + 4. story box endings
  function story(P) {
    var sb = [].filter.call(P.querySelectorAll('section[data-m="sbox"]'), vis)[0]; if (!sb) return;
    var lm = P.getAttribute('data-screen-label') === "Lion's Mane";
    if (lm && !sb.querySelector('.dk-live')) {   // LIVE NOW, right above the CLICK button's line
      var t = [].filter.call(sb.querySelectorAll('div,p,span,h2,h3'), function (e) { return /^THE FICTIONAL ORIGIN STORY/i.test(txt(e)) && e.children.length < 3; })[0];
      if (t) { var b = document.createElement('div'); b.className = 'dk-live'; b.textContent = 'LIVE NOW · WATCH THE STORY'; t.parentNode.insertBefore(b, t); }
    }
    if (!desk()) { if (sb.__dk) { sb.__dk = 0; sb.classList.remove('dk-end'); ['background-color', 'background-image', 'background-size', 'background-position', 'background-repeat', 'border-bottom'].forEach(function (q) { sb.style.removeProperty(q); }); sb.style.setProperty('background', 'rgb(0, 0, 0)'); } return; }
    sb.__dk = 1; sb.classList.add('dk-end'); if (lm) sb.classList.add('dk-end-lm');
    // inline, because older page rules force this section see-through (the cream page showed through as gray)
    setI(sb, 'background-color', '#000');
    setI(sb, 'background-image', lm ? 'linear-gradient(rgba(0,0,0,.5) 0%,rgba(0,0,0,.55) 55%,#000 100%),url("assets/photo/story-lm-poster-flip.jpg")' : 'none');
    setI(sb, 'background-size', '100% 100%,cover'); setI(sb, 'background-position', '0 0,center 40%'); setI(sb, 'background-repeat', 'no-repeat');
    setI(sb, 'border-bottom', '110px solid #000');
    // the textured layers inside the box dissolve into the black instead of ending on a hard line
    [].forEach.call(sb.querySelectorAll(':scope > *'), function (k) {
      if (k.offsetHeight < 300) return;
      if (/url\(|gradient/.test(getComputedStyle(k).backgroundImage)) { setI(k, '-webkit-mask-image', 'linear-gradient(#000 0%,#000 62%,transparent 100%)'); setI(k, 'mask-image', 'linear-gradient(#000 0%,#000 62%,transparent 100%)'); }
    });
    if (lm) [].forEach.call(sb.querySelectorAll('[data-m="sbox-shade"]'), function (d) { setI(d, 'display', 'none'); });
    // the RCX field behind the story box goes; the box ends in black
    [].forEach.call(sb.querySelectorAll('div'), function (d) { if (!d.textContent.trim() && /pattern-field/.test(getComputedStyle(d).backgroundImage)) setI(d, 'display', 'none'); });
  }

  // 5. Cordyceps Reaction Time box: the college track photo
  function cdReaction(P) {
    if (P.getAttribute('data-screen-label') !== 'Cordyceps') return;
    var box = [].filter.call(P.querySelectorAll('.mx-box'), function (b) { var tg = b.querySelector('.mx-tag'); return tg && /^THE REACTION TIME/i.test(txt(tg)); })[0];
    if (!box) return;
    if (!desk()) { if (box.__dk) { box.__dk = 0; box.style.removeProperty('background-image'); box.style.removeProperty('background-size'); box.style.removeProperty('background-position'); } return; }
    box.__dk = 1;
    setI(box, 'background-image', 'linear-gradient(rgba(0,0,0,.58),rgba(0,0,0,.72)),url("assets/photo/cd-relay-college.jpg")');
    setI(box, 'background-size', '100% 100%,cover'); setI(box, 'background-position', '0 0,center 40%');
  }

  // 7. Cordyceps top photo: a soft dark pool behind the words so the gold reads when the photo brightens
  function cdHero(P) {
    if (P.getAttribute('data-screen-label') !== 'Cordyceps') return;
    var h = [].filter.call(P.querySelectorAll('section[data-m="cdh-hero"]'), vis)[0]; if (!h) return;
    var tag = [].filter.call(h.querySelectorAll('*'), function (e) { return /^For your best efforts/i.test(txt(e)) && e.children.length < 2; })[0]; if (!tag) return;
    var col = tag.parentElement; if (!col) return;
    if (!desk()) { if (col.__dk) { col.__dk = 0; col.style.removeProperty('background-image'); } return; }
    col.__dk = 1;
    setI(col, 'background-image', 'radial-gradient(ellipse 62% 58% at 50% 58%,rgba(0,0,0,.62) 0%,rgba(0,0,0,.42) 45%,rgba(0,0,0,0) 78%)');
  }
  function run() {
    swipes();
    [].forEach.call(document.querySelectorAll('[data-screen-label]'), function (P) {
      if (PAGES.indexOf(P.getAttribute('data-screen-label')) < 0 || !vis(P)) return;
      if (P.getAttribute('data-screen-label') === 'Turkey Tail') ttRow(P);
      story(P); cdReaction(P); cdHero(P);
    });
  }
  setInterval(run, 1000); run(); addEventListener('resize', run);
})();
