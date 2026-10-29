/* Oct 29 (Scott): the third word of the headline (Tear. Pour. ___) lands on a drink symbol, never the first or second line.
   Coffee, tea and smoothie take turns, in Scott's own art, all in the same box, sitting on the same line as Tear and Pour.
   The rotator's third word is a private-use character; this turns that character into the symbol, colored like the words around it. */
(function(){
  var ICONS=['coffee','tea','smoothie'], next=0;
  function run(){
    document.querySelectorAll('span').forEach(function(e){
      if(e.textContent!=='\uE000'||e.querySelector('span'))return;
      var sl=e.parentNode;if(sl&&sl.style){sl.style.setProperty('width','1em','important');sl.style.setProperty('overflow','visible','important');}
      e.style.setProperty('color','transparent','important');
      if(e.querySelector('[data-mug]'))return;
      var u='url("assets/icons/drink/'+ICONS[next++%ICONS.length]+'.png")';
      var m=document.createElement('i');m.setAttribute('data-mug','');e.insertBefore(m,e.firstChild);   // zero size, bottom edge sits on the text line
      var h=m.style;h.display='inline-block';h.verticalAlign='baseline';h.width='0';h.height='0';h.position='relative';h.overflow='visible';h.pointerEvents='none';
      var d=document.createElement('b');m.appendChild(d);
      var c=d.style;c.position='absolute';c.left='.02em';c.bottom='0';c.width='.96em';c.height='.86em';
      c.backgroundColor='#F1ECE1';c.webkitMaskImage=u;c.maskImage=u;c.webkitMaskRepeat='no-repeat';c.maskRepeat='no-repeat';
      c.webkitMaskPosition='center bottom';c.maskPosition='center bottom';c.webkitMaskSize='contain';c.maskSize='contain';
    });
  }
  setInterval(run,150);run();
})();
