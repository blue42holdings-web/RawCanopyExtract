/* RCX motion: wheel carousels, tap-to-center, How To Use timeline glow. Oct 9 2026 */
(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function wheel(track){
    if(track.__rcxWheel) return; track.__rcxWheel = true;
    track.classList.add('rcx-wheel');
    var raf = 0;
    function paint(){
      raf = 0;
      var tr = track.getBoundingClientRect(), mid = tr.left + tr.width/2;
      var cards = track.children;
      for(var i=0;i<cards.length;i++){
        var c = cards[i], r = c.getBoundingClientRect();
        if(!r.width) continue;
        var d = (r.left + r.width/2 - mid) / r.width;           /* -1 left neighbor, 0 center, 1 right neighbor */
        var a = Math.max(-1.6, Math.min(1.6, d));
        var abs = Math.abs(a);
        c.style.transform = 'perspective(1100px) rotateY(' + (-a*32).toFixed(2) + 'deg) scale(' + (1 - Math.min(abs,1)*0.13).toFixed(3) + ')';
        c.style.opacity = (1 - Math.min(abs,1)*0.42).toFixed(3);
        c.style.zIndex = String(100 - Math.round(abs*10));
        c.classList.toggle('rcx-center', abs < 0.5);
      }
    }
    function req(){ if(!raf) raf = requestAnimationFrame(paint); }
    track.addEventListener('scroll', req, {passive:true});
    window.addEventListener('resize', req);
    /* Tap a side card: spin it to the center instead of opening it */
    track.addEventListener('click', function(e){
      var card = e.target.closest ? e.target.closest('.rcx-wheel > *') : null;
      if(!card || card.parentNode !== track || card.classList.contains('rcx-center')) return;
      e.preventDefault(); e.stopPropagation();
      var tr = track.getBoundingClientRect(), r = card.getBoundingClientRect();
      track.scrollBy({left: (r.left + r.width/2) - (tr.left + tr.width/2), behavior: reduce ? 'auto' : 'smooth'});
    }, true);
    req(); setTimeout(req, 300); setTimeout(req, 1200);
  }
  function timeline(steps){
    if(steps.__rcxLine) return; steps.__rcxLine = true;
    steps.classList.add('rcx-timeline');
    var kids = [].slice.call(steps.children);
    if(!('IntersectionObserver' in window)){ kids.forEach(function(k){k.classList.add('rcx-lit')}); return; }
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('rcx-lit'); io.unobserve(en.target); } });
    }, {rootMargin:'0px 0px -25% 0px'});
    kids.forEach(function(k){ io.observe(k); });
  }
  function scan(){
    var t = document.querySelectorAll('.cx-track'); for(var i=0;i<t.length;i++) wheel(t[i]);
    var s = document.querySelectorAll('[data-m="steps"]'); for(var j=0;j<s.length;j++) timeline(s[j]);
  }
  var pending = 0;
  new MutationObserver(function(){ if(!pending) pending = setTimeout(function(){ pending = 0; scan(); }, 120); })
    .observe(document.documentElement, {childList:true, subtree:true});
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan); else scan();
})();
