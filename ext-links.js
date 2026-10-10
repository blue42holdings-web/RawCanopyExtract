/* Keep visitors on the site: an outside link in the body of a page scrolls down to that page's research / further-reading area instead of leaving.
   Links inside that area (and in the footer) open normally. */
(function(){
  var KEEP='[data-research-links],[data-m="rc-research"],[data-m="shop-research"],footer,[data-m="footer"]';
  function external(a){ try{ var u=new URL(a.href,location.href); return /^https?:$/.test(u.protocol)&&u.host!==location.host; }catch(e){ return false; } }
  document.addEventListener('click',function(e){
    if(e.defaultPrevented||e.button>0||e.metaKey||e.ctrlKey||e.shiftKey) return;
    var a=e.target.closest&&e.target.closest('a[href]'); if(!a||!external(a)||a.closest(KEEP)) return;
    var tgt=document.querySelector('[data-research-links],[data-m="rc-research"],[data-m="shop-research"]');
    if(!tgt) return;
    e.preventDefault();
    var top=tgt.getBoundingClientRect().top+window.pageYOffset-90;
    try{ window.scrollTo({top:top,behavior:'smooth'}); }catch(x){ window.scrollTo(0,top); }
    tgt.style.transition='box-shadow .4s'; tgt.style.boxShadow='inset 0 0 0 3px #D4A24A';
    setTimeout(function(){ tgt.style.boxShadow=''; },1800);
  },true);
})();
