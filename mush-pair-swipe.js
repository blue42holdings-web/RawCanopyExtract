/* Oct 22 2026 (Scott): The Mushrooms page, phone. Under "Nature did the work", the Best Form box (fruiting body)
   and the Botanical Science box sit side by side in one row you swipe left and right, not stacked.
   Desktop puts them back exactly where they were. */
(function () {
  var css = document.createElement('style');
  css.textContent = '@media (max-width:767px){' +
    'html body .mp-row.mp-row{display:flex !important;flex-direction:row !important;flex-wrap:nowrap !important;overflow-x:auto !important;overflow-y:hidden !important;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;gap:12px !important;padding:4px 7vw 20px !important;align-items:stretch !important;scrollbar-width:none;box-sizing:border-box;width:100% !important;max-width:none !important;margin:0 !important}' +
    'html body .mp-row.mp-row::-webkit-scrollbar{display:none}' +
    'html body .mp-row.mp-row>section{flex:0 0 86vw !important;width:86vw !important;max-width:86vw !important;margin:0 !important;padding:0 !important;scroll-snap-align:center;box-sizing:border-box !important;display:flex !important;flex-direction:column !important;min-height:0 !important}' +
    'html body .mp-row.mp-row>section>*:not([data-m="bf-shade"]){flex:1 1 auto !important;margin:0 !important;width:100% !important;max-width:none !important;box-sizing:border-box !important}' +
    'html body .mp-row.mp-row [data-m="diag-box"]{display:flex !important;flex-direction:column !important;justify-content:center !important}' +
    'html body .mp-tag+.rcx-swipe-tag{display:none !important}' +
    'html body .mp-tag{display:block;font-family:"Bebas Neue",sans-serif;letter-spacing:.22em;font-size:15px;line-height:1.2;color:#E8B860;text-align:center;margin:6px auto 10px;pointer-events:none}' +
    'html body .mp-tag b{display:inline-block;font-weight:400;animation:rcxSwArr 1.8s ease-in-out infinite}' +
    '}@media (min-width:768px){.mp-tag{display:none !important}}';
  document.head.appendChild(css);
  var row = null, tag = null, marks = [];
  function vis(e) { return e && e.offsetParent !== null; }
  function run() {
    var phone = innerWidth < 768;
    if (!phone) {
      if (row) {   // desktop: put both boxes back where they came from
        [].forEach.call(row.querySelectorAll('*'), function (k) { if (k.__mp) { k.__mp = 0; k.style.removeProperty('margin-left'); k.style.removeProperty('margin-right'); } });
        marks.forEach(function (m) { if (m.mark.parentNode) m.mark.parentNode.insertBefore(m.el, m.mark), m.mark.remove(); });
        marks = []; row.remove(); if (tag) tag.remove(); row = tag = null;
      }
      return;
    }
    if (row && row.isConnected && row.children.length === 2) { tidy(); return; }
    var P = [].filter.call(document.querySelectorAll('[data-screen-label="The Mushrooms"]'), function (e) { return e.offsetHeight > 0; })[0];
    if (!P) return;
    var bf = P.querySelector('section[data-m="bestform-sec"]'), dg = P.querySelector('section[data-m="diag-sec"]');
    if (!bf || !dg) return;
    marks = [bf, dg].map(function (el) { var m = document.createComment('mp-home'); el.parentNode.insertBefore(m, el); return { el: el, mark: m }; });
    tag = document.createElement('div'); tag.className = 'mp-tag'; tag.innerHTML = 'SWIPE FOR MORE <b>›</b>';
    row = document.createElement('div'); row.className = 'mp-row'; row.setAttribute('data-noswipe', '1');
    bf.parentNode.insertBefore(tag, bf); bf.parentNode.insertBefore(row, bf);
    row.appendChild(bf); row.appendChild(dg); tidy();
  }
  function tidy() {
    // one label only: drop the generic swipe label another script adds next to ours
    for (var n = tag && tag.nextElementSibling; n && n !== row; n = n.nextElementSibling) if (n.classList.contains('rcx-swipe-tag')) n.style.setProperty('display', 'none', 'important');
    // each box fills its card edge to edge (some boxes carry an inline side margin)
    [].forEach.call(row.children, function (s) {
      [].forEach.call(s.children, function (k) {
        if (k.getAttribute('data-m') === 'bf-shade' || getComputedStyle(k).display === 'none') return;
        ['margin-left', 'margin-right'].forEach(function (p) { if (k.style.getPropertyValue(p) !== '0px') k.style.setProperty(p, '0px', 'important'); });
        k.__mp = 1;
      });
    });
  }
  setInterval(run, 1000); addEventListener('resize', run); run();
})();
