/* Oct 28 (Scott): the little mug from the packaging stands in for the third word, so the headline reads Tear. Pour. [mug].
   The rotator's third word is a private-use character; this turns that character into the packaging mug, colored like the words around it. */
(function(){
  var svg="<svg xmlns='http://www.w3.org/2000/svg' viewBox='2.8 3.8 17 16.4'><path d='M3 5.2Q3 4 5 3.8H12.5Q14.5 4 14.5 5.2V17Q14.5 20.2 11.4 20.2H6.1Q3 20.2 3 17Z'/><path d='M14 6.8H16.2A3.4 3.4 0 0 1 16.2 14.4H14Z'/></svg>";
  var url='url("data:image/svg+xml;utf8,'+encodeURIComponent(svg)+'")';
  function run(){
    document.querySelectorAll('span').forEach(function(e){
      if(e.children.length||e.textContent!=='\u2003\u200C')return;
      var st=e.style;
      st.setProperty('color','transparent','important');
      st.setProperty('position','relative','important');
      
      var m=e.querySelector('[data-mug]');
      if(!m){m=document.createElement('i');m.setAttribute('data-mug','');e.appendChild(m);
        var c=m.style;c.position='absolute';c.left='0';c.width='1em';c.top='-.02em';c.height='1.02em';c.pointerEvents='none';
        c.backgroundColor='#F1ECE1';c.webkitMaskImage=url;c.maskImage=url;c.webkitMaskRepeat='no-repeat';c.maskRepeat='no-repeat';
        c.webkitMaskPosition='center';c.maskPosition='center';c.webkitMaskSize='contain';c.maskSize='contain';}
      var col=getComputedStyle(e.parentNode.parentNode.firstElementChild||e).color;
    });
  }
  setInterval(run,150);run();
})();
