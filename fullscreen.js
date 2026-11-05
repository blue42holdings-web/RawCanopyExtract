/* Nov 5 (Scott): a full screen square on the story pages, like YouTube's. It only appears on phones and browsers that can
   really go full screen (Android, iPad, computers). Where they can't (most iPhones), there is no button, and the sideways
   view already shows the whole picture with thin black strips on the sides. Built outside the page builder on purpose. */
(function () {
  var de = document.documentElement;
  var req = de.requestFullscreen || de.webkitRequestFullscreen;
  var can = !!req && (document.fullscreenEnabled || document.webkitFullscreenEnabled);
  if (!can) return;
  function isOn() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  var b = document.createElement('button');
  b.type = 'button';
  b.setAttribute('aria-label', 'Full screen');
  b.setAttribute('data-no-pyramid', '');
  b.style.cssText = 'position:fixed;right:14px;top:calc(env(safe-area-inset-top,0px) + 86px);z-index:2147483000;width:44px;height:44px;border-radius:10px;border:2px solid #D4A24A;background:rgba(0,0,0,.72);display:none;align-items:center;justify-content:center;padding:0;cursor:pointer';
  var OPEN = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#D4A24A" stroke-width="2.2" stroke-linecap="round"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg>';
  var CLOSE = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#D4A24A" stroke-width="2.2" stroke-linecap="round"><path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5"/></svg>';
  function paint() { b.innerHTML = isOn() ? CLOSE : OPEN; b.setAttribute('aria-label', isOn() ? 'Exit full screen' : 'Full screen'); }
  function onStory() { return /^#s-/.test(location.hash); }
  function show() { b.style.display = onStory() || isOn() ? 'flex' : 'none'; }
  b.addEventListener('click', function (e) {
    e.preventDefault(); e.stopPropagation();
    if (isOn()) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
    try { var p = req.call(de, { navigationUI: 'hide' }); if (p && p.catch) p.catch(function () {}); } catch (err) {}
  });
  document.addEventListener('fullscreenchange', function () { paint(); show(); });
  document.addEventListener('webkitfullscreenchange', function () { paint(); show(); });
  addEventListener('hashchange', show);
  function mount() { document.body.appendChild(b); paint(); show(); setInterval(show, 1000); }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
})();
