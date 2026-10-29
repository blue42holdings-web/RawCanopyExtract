/* Oct 29 (Scott): the third word of the headline (Tear. Pour. ___) lands on a drink symbol, never the first or second line.
   Coffee, tea and smoothie take turns, in Scott's own art, all in the same box, sitting on the same line as Tear and Pour.
   The rotator's third word is a private-use character; this turns that character into the symbol, colored like the words around it. */
(function(){
  var ICONS=['coffee','tea','smoothie'], next=0;
  var host=null;   // the headline lines, found once, so the 4 times a second check never walks the whole page
  function run(){
    if(host&&!host.isConnected)host=null;
    (host||document).querySelectorAll('span').forEach(function(e){
      if(e.textContent!=='\uE000'||e.querySelector('span'))return;
      if(!host)host=e.closest('p')||null;
      var sl=e.parentNode;if(sl&&sl.style){sl.style.setProperty('width','1em','important');sl.style.setProperty('overflow','visible','important');}
      e.style.setProperty('color','transparent','important');
      for(var a=e.parentNode,n=0;a&&n<4;a=a.parentNode,n++){   // the word slot clips the sliding words; let the cup's handle show to the right
        if(getComputedStyle(a).overflow==='hidden'){a.style.setProperty('overflow','visible','important');a.style.setProperty('clip-path','inset(0 -.6em 0 0)','important');}
      }
      if(e.querySelector('[data-mug]'))return;
      var u='url("assets/icons/drink/'+ICONS[next++%ICONS.length]+'.png")';
      var m=document.createElement('i');m.setAttribute('data-mug','');e.insertBefore(m,e.firstChild);   // zero size, bottom edge sits on the text line
      var h=m.style;h.display='inline-block';h.verticalAlign='baseline';h.width='0';h.height='0';h.position='relative';h.overflow='visible';h.pointerEvents='none';
      var d=document.createElement('b');m.appendChild(d);
      var c=d.style;c.position='absolute';c.left='.02em';c.bottom='-.08em';c.width='.96em';c.height='.86em';
      c.backgroundColor='#F1ECE1';c.webkitMaskImage=u;c.maskImage=u;c.webkitMaskRepeat='no-repeat';c.maskRepeat='no-repeat';
      c.webkitMaskPosition='center bottom';c.maskPosition='center bottom';c.webkitMaskSize='contain';c.maskSize='contain';
    });
  }
  setInterval(run,250);run();
})();
