/* Oct 11
   1. The gold line with the plus shows on every page. The plus slides down the line as you scroll.
      Tap it and a quick menu opens: Shop, the three mushrooms, Receipts, Back to top.
   2. The back button works inside the site: every page you open is remembered, so Back takes you
      to the page you came from, at the spot you were reading.
   3. Links to outside sites open in the same tab, so the phone's Back arrow brings you straight back
      to the same page and the same spot. */
(function () {
  var restoring = false;
  var r = document.getElementById('rcx-rail');
  function pageNow() {
    var v = [].slice.call(document.querySelectorAll('[data-screen-label]')).filter(function (e) { var b = e.getBoundingClientRect(); return b.height > 300; })[0];
    return v ? v.getAttribute('data-screen-label') : '';
  }
  function goTo(p) {
    var a = [].slice.call(document.querySelectorAll('[data-page="' + p + '"]'));
    var v = a.filter(function (e) { return e.getBoundingClientRect().height > 0; })[0] || a[0];
    if (v) { v.click(); return true; }
    // the mushroom pages are only linked from The Mushrooms page and the home page, so hop through it
    var hub = document.querySelector('[data-page="mushrooms"]') || document.querySelector('[data-page="home"]');
    if (hub && p !== 'mushrooms') {
      var was = restoring; restoring = true;
      hub.click();
      var n = 0, t = setInterval(function () {
        var b = [].slice.call(document.querySelectorAll('[data-page="' + p + '"]'))[0];
        if (b) { clearInterval(t); b.click(); scrollTo(0, 0); restoring = was; } else if (++n > 20) { clearInterval(t); restoring = was; }
      }, 60);
      return true;
    }
    return false;
  }
  /* ---- rail ---- */
  if (r) {
    var btn = r.querySelector('button');
    function tick() {
      var y = scrollY, H = document.documentElement.scrollHeight - innerHeight;
      r.classList.toggle('on', y > innerHeight * 0.35 || r.classList.contains('open'));
      var f = H > 0 ? Math.min(1, Math.max(0, y / H)) : 0;
      r.style.setProperty('--rr', (6 + f * 88).toFixed(1) + '%');
    }
    addEventListener('scroll', tick, { passive: true }); setInterval(tick, 700); tick();
    btn.addEventListener('click', function (e) { e.stopPropagation(); r.classList.toggle('open'); tick(); });
    r.querySelectorAll('.rr-menu a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault(); e.stopPropagation(); r.classList.remove('open');
        var g = a.getAttribute('data-go');
        if (g === 'top') { try { scrollTo({ top: 0, behavior: 'smooth' }); } catch (x) { scrollTo(0, 0); } return; }
        if (goTo(g)) scrollTo(0, 0);
      });
    });
    document.addEventListener('click', function (e) { if (!r.contains(e.target)) r.classList.remove('open'); });
  }
  /* ---- in-site history ---- */
  var cur = 'home';
  try { history.scrollRestoration = 'manual'; } catch (x) {}
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-page]');
    if (!el || restoring || (r && r.contains(el))) return;
    var p = el.getAttribute('data-page'); if (!p || p === cur) return;
    try { history.replaceState({ p: cur, y: scrollY }, '', '#' + cur); history.pushState({ p: p, y: 0 }, '', '#' + p); } catch (x) {}
    cur = p;
  }, true);
  if (r) r.addEventListener('click', function (e) {
    var a = e.target.closest('.rr-menu a'); if (!a) return; var p = a.getAttribute('data-go'); if (p === 'top' || p === cur) return;
    try { history.replaceState({ p: cur, y: scrollY }, '', '#' + cur); history.pushState({ p: p, y: 0 }, '', '#' + p); } catch (x) {}
    cur = p;
  }, true);
  function restore(p, y) {
    restoring = true;
    if (p && p !== cur) goTo(p);
    cur = p || 'home';
    var n = 0, t = setInterval(function () { scrollTo(0, y || 0); if (++n > 8) { clearInterval(t); restoring = false; } }, 120);
  }
  addEventListener('popstate', function (e) {
    var st = e.state || {}; var p = st.p || (location.hash || '#home').slice(1);
    restore(p, st.y || 0);
  });
  /* ---- outside links: same tab, remember where we were ---- */
  function external(a) { try { var u = new URL(a.href, location.href); return /^https?:$/.test(u.protocol) && u.host !== location.host; } catch (x) { return false; } }
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var a = e.target.closest && e.target.closest('a[href]'); if (!a || !external(a)) return;
    a.removeAttribute('target');
    try { history.replaceState({ p: cur, y: scrollY }, '', '#' + cur); sessionStorage.setItem('rcxBack', JSON.stringify({ p: cur, y: scrollY })); } catch (x) {}
  }, true);
  /* coming back (or opening a link with #page) */
  function boot() {
    var st = null; try { st = history.state || JSON.parse(sessionStorage.getItem('rcxBack') || 'null'); } catch (x) {}
    var p = (location.hash || '').slice(1) || (st && st.p) || '';
    if (!p || p === 'home') { if (st && st.y) restore('home', st.y); return; }
    var tries = 0, t = setInterval(function () {
      if (document.querySelector('[data-page="' + p + '"]')) { clearInterval(t); restore(p, st && st.p === p ? st.y : 0); }
      else if (++tries > 40) clearInterval(t);
    }, 150);
  }
  if (document.readyState === 'complete') setTimeout(boot, 300); else addEventListener('load', function () { setTimeout(boot, 300); });
  addEventListener('pageshow', function (e) { if (e.persisted) { var st = history.state; if (st) restore(st.p, st.y); } });
})();
