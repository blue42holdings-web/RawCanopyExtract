/* Nov 4 (Scott): centered text that wraps forms a pyramid. An upper line is never longer than the line
   below it, and no line is a single word left alone when it can be helped. Runs on every page and every
   screen size: it measures the words, then chooses the line breaks from the bottom up. */
(function () {
  var SEL = 'p, h1, h2, h3, h4, h5, div, .sh-l, .mx-head, .mx-text';
  var SKIP = 'header, nav, button, [data-m="player"], [data-ambient-btn], [data-m^="nav"], #rcx-rail, input, textarea, [contenteditable], [data-no-pyramid]';
  var busy = false, timer = 0;

  function clear(el) {
    var brs = el.querySelectorAll('br[data-pyr]');
    if (!brs.length) return;
    var parents = [];
    for (var i = 0; i < brs.length; i++) { var p = brs[i].parentNode; if (parents.indexOf(p) < 0) parents.push(p); p.removeChild(brs[i]); }
    for (var j = 0; j < parents.length; j++) parents[j].normalize();
  }

  function eligible(el) {
    if (el.closest(SKIP)) return false;
    var cs = getComputedStyle(el);
    if (cs.textAlign !== 'center' || /nowrap|pre/.test(cs.whiteSpace) || cs.display === 'none') return false;
    if (el.querySelector('br:not([data-pyr]), p, div, ul, ol, img, svg, video, button, input')) return false;
    var kids = el.querySelectorAll('*');
    for (var i = 0; i < kids.length; i++) { var d = getComputedStyle(kids[i]).display; if (d === 'block' || d === 'flex' || d === 'grid' || d === 'inline-block' || d === 'inline-flex') return false; }
    return el.textContent.trim().indexOf(' ') > 0;
  }

  function words(el) {
    var out = [], tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n, re = /[^ \t\n\r]+/g, m;
    while ((n = tw.nextNode())) {
      re.lastIndex = 0;
      while ((m = re.exec(n.data))) {
        var r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
        var rects = r.getClientRects(); if (!rects.length) continue;
        if (rects.length > 1) return null;   // a word already split across lines: leave this one alone
        var b = rects[0];
        if (out.length && out[out.length - 1].node === n && out[out.length - 1].end === m.index) { out[out.length - 1].w += b.width; out[out.length - 1].end = m.index + m[0].length; continue; }
        out.push({ node: n, start: m.index, end: m.index + m[0].length, w: b.width, left: b.left, right: b.right, top: b.top });
      }
    }
    return out;
  }

  function lineCount(ws) { var c = 0, t = null; for (var i = 0; i < ws.length; i++) { if (t === null || Math.abs(ws[i].top - t) > 2) { c++; t = ws[i].top; } } return c; }

  function spaceWidth(ws, el) {
    var g = [];
    for (var i = 1; i < ws.length; i++) if (Math.abs(ws[i].top - ws[i - 1].top) < 2) { var d = ws[i].left - ws[i - 1].right; if (d > 0 && d < 40) g.push(d); }
    if (g.length) { g.sort(function (a, b) { return a - b; }); return g[Math.floor(g.length / 2)]; }
    return parseFloat(getComputedStyle(el).fontSize) * 0.28;
  }

  function lineW(ws, a, b, sp) { var t = 0; for (var i = a; i < b; i++) t += ws[i].w + (i > a ? sp : 0); return t; }

  // fill lines from the bottom up, so the bottom line is the longest and the top line the shortest
  function fromBottom(ws, W, sp) {
    var starts = [], end = ws.length;
    while (end > 0) { var s = end - 1, used = ws[s].w; while (s > 0 && used + sp + ws[s - 1].w <= W) { s--; used += sp + ws[s].w; } starts.unshift(s); end = s; }
    return starts;
  }

  function ok(ws, starts, sp) {
    var widths = [];
    for (var i = 0; i < starts.length; i++) widths.push(lineW(ws, starts[i], i + 1 < starts.length ? starts[i + 1] : ws.length, sp));
    for (var j = 0; j + 1 < widths.length; j++) if (widths[j] > widths[j + 1] + 1) return false;
    var firstCount = (starts.length > 1 ? starts[1] : ws.length) - starts[0];
    return firstCount >= 2 || ws.length < 3;
  }

  function fix(el) {
    clear(el);
    if (!eligible(el)) return;
    var ws = words(el); if (!ws || ws.length < 2) return;
    var lines = lineCount(ws); if (lines < 2) return;
    var cs = getComputedStyle(el), box = cs.display === 'inline' ? el.parentElement : el, bs = getComputedStyle(box), W = box.clientWidth - parseFloat(bs.paddingLeft) - parseFloat(bs.paddingRight) - 1;
    var sp = spaceWidth(ws, el), best = null, bestScore = -1, seen = {};
    // try every width that keeps the same number of lines; among the ones that make a pyramid,
    // prefer the one whose line breaks fall at the end of sentences (after . ? !)
    for (var w = W; w >= W * 0.5; w -= 2) {
      var st = fromBottom(ws, w, sp);
      if (st.length > lines) break;
      if (st.length !== lines || seen[st.join(',')]) continue;
      seen[st.join(',')] = 1;
      if (!ok(ws, st, sp)) { if (!best && (st.length < 2 ? ws.length : st[1]) - st[0] >= 2) { best = st; bestScore = -1; } continue; }   // never fall back to a lone word on top
      var score = 1;
      for (var q = 1; q < st.length; q++) { var prev = ws[st[q] - 1], txt = prev.node.data.slice(prev.start, prev.end); if (/[.?!]["'”’)]*$/.test(txt)) score += 10; else if (/[,;:]$/.test(txt)) score += 3; }
      if (score > bestScore) { best = st; bestScore = score; }
    }
    if (!best) return;
    for (var k = best.length - 1; k >= 1; k--) {
      var wd = ws[best[k]], node = wd.node.splitText(wd.start), br = document.createElement('br');
      br.setAttribute('data-pyr', ''); node.parentNode.insertBefore(br, node);
    }
  }

  function run() {
    busy = true;
    try { var els = document.querySelectorAll(SEL); for (var i = 0; i < els.length; i++) { var r = els[i].getBoundingClientRect(); if (r.height > 0 && r.width > 0) fix(els[i]); } } catch (e) {}
    setTimeout(function () { busy = false; }, 0);
  }
  // throttle, not debounce: the site animates all the time, so waiting for a quiet moment would never run
  function soon(ms) { if (timer) return; timer = setTimeout(function () { timer = 0; run(); }, ms || 250); }
  var lastW = innerWidth;

  addEventListener('resize', function () { if (innerWidth !== lastW) { lastW = innerWidth; clearTimeout(timer); timer = 0; soon(200); } });
  addEventListener('orientationchange', function () { soon(300); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { soon(50); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { soon(300); }); else soon(300);
  new MutationObserver(function (list) {
    if (busy) return;
    for (var i = 0; i < list.length; i++) {
      var m = list[i], t = m.target; if (t.nodeType !== 1 || (t.closest && t.closest(SKIP))) continue;
      for (var k = 0; k < m.addedNodes.length; k++) { var a = m.addedNodes[k]; if (a.nodeType === 1 && a.tagName !== 'BR' && a.tagName !== 'SCRIPT' && a.tagName !== 'STYLE') { soon(600); return; } }
    }
  }).observe(document.body || document.documentElement, { childList: true, subtree: true });
})();
