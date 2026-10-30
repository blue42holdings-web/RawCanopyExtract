/* Oct 29 (Scott): the headline opens on Tear. Pour. Stir. and Stir. turns into a drink symbol (never the first or second line), then turns back.
   Coffee, tea and smoothie take turns, in Scott's own art, all in the same box, sitting on the same line as Tear and Pour.
   The rotator's third word is a private-use character; this turns that character into the symbol, colored like the words around it. */
(function(){
  var ICONS=['coffee','tea','smoothie'], next=0;
  var touched=[];   // styles this file set on the word slot, put back exactly when Stir. returns
  function put(el,p,v,pr){var o={el:el,p:p,v:el.style.getPropertyValue(p),pr:el.style.getPropertyPriority(p)};touched.push(o);el.style.setProperty(p,v,pr||'');}
  function undo(){touched.reverse().forEach(function(o){if(o.v)o.el.style.setProperty(o.p,o.v,o.pr);else o.el.style.removeProperty(o.p);if(o.p==='width'){var k=o.el.firstElementChild;if(k)o.el.style.width=k.getBoundingClientRect().width+'px';}});touched=[];}   // the slot's width is measured again from the word that came back
  var host=null;   // the headline lines, found once, so the 4 times a second check never walks the whole page
  function run(){
    if(host&&!host.isConnected)host=null;
    var found=false;
    (host||document).querySelectorAll('span').forEach(function(e){
      if(e.textContent!=='\uE000'||e.querySelector('span'))return;
      found=true;
      if(!host)host=e.closest('p')||null;
      var sl=e.parentNode;if(sl&&sl.style&&!sl.__mug){sl.__mug=1;put(sl,'width','1em','important');put(sl,'overflow','visible','important');}
      if(!e.__mug){e.__mug=1;put(e,'color','transparent','important');}
      for(var a=e.parentNode,n=0;a&&n<4;a=a.parentNode,n++){   // the word slot clips the sliding words; let the cup's handle show to the right
        if(!a.__mug&&getComputedStyle(a).overflow==='hidden'){a.__mug=1;put(a,'overflow','visible','important');put(a,'clip-path','inset(0 -.6em 0 0)','important');}
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
    if(!found&&touched.length){touched.forEach(function(o){o.el.__mug=0;});undo();}
  }
  // run inside the same tick as the word change (before the page measures the slot), so the cup is there with the first frame of the swap and Stir. gets its full width back at once
  try{new MutationObserver(function(){if(host)run();}).observe(document.body,{childList:true,subtree:true,characterData:true});}catch(x){}
  setInterval(run,250);run();
})();
