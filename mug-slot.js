/* Oct 29 (Scott): the headline opens on Tear. Pour. Stir. and Stir. turns into a drink symbol (never the first or second line), then turns back.
   Coffee, tea and smoothie take turns, in Scott's own art, all in the same box, sitting on the same line as Tear and Pour.
   The rotator's third word is a private-use character; this turns that character into the symbol, colored like the words around it. */
(function(){
  var ICONS=['coffee','tea','smoothie'];   // \uE000 coffee, \uE001 tea, \uE002 smoothie
  var touched=[];   // styles this file set on the word slot, put back exactly when Stir. returns
  function put(el,p,v,pr,g){var o={g:g||el,el:el,p:p,v:el.style.getPropertyValue(p),pr:el.style.getPropertyPriority(p)};touched.push(o);el.style.setProperty(p,v,pr||'');}
  function undo(g){var keep=[];touched.reverse().forEach(function(o){if(g&&o.g!==g){keep.push(o);return;}o.el.__mug=0;if(o.v)o.el.style.setProperty(o.p,o.v,o.pr);else o.el.style.removeProperty(o.p);if(o.p==='width'){var k=o.el.firstElementChild;if(k)o.el.style.width=k.offsetWidth+'px';}});touched=keep.reverse();}   // the slot's width is measured again from the word that came back
  var host=null;   // the headline lines, found once, so the 4 times a second check never walks the whole page
  function run(){
    if(host&&!host.isConnected)host=null;
    if(!host)host=document.querySelector('[data-rcx-rotator]');   // the headline itself, so the very first cup is placed the moment the word changes
    var found=false,live=[];
    (host||document).querySelectorAll('span').forEach(function(e){
      if(!/^[\uE000-\uE002]$/.test(e.textContent)||e.querySelector('span'))return;
      found=true;live.push(e.parentNode);
      if(!host)host=e.closest('p')||null;
      var sl=e.parentNode;if(sl&&sl.style&&!sl.__mug){sl.__mug=1;put(sl,'width',(e.textContent.charCodeAt(0)===0xE002?'.76em':'1em'),'important',sl);put(sl,'overflow','visible','important',sl);if(e.textContent.charCodeAt(0)===0xE002)put(sl,'text-align','left','important',sl);}
      if(!e.__mug){e.__mug=1;put(e,'color','transparent','important',sl);}
      for(var a=e.parentNode,n=0;a&&n<4;a=a.parentNode,n++){   // the word slot clips the sliding words; let the cup's handle show to the right
        if(!a.__mug&&getComputedStyle(a).overflow==='hidden'){a.__mug=1;put(a,'overflow','visible','important',sl);put(a,'clip-path','inset(0 -.6em 0 0)','important',sl);}
      }
      if(e.querySelector('[data-mug]'))return;
      var u='url("assets/icons/drink/'+ICONS[e.textContent.charCodeAt(0)-0xE000]+'.png")';
      var m=document.createElement('i');m.setAttribute('data-mug','');e.insertBefore(m,e.firstChild);   // zero size, bottom edge sits on the text line
      var h=m.style;h.display='inline-block';h.verticalAlign='baseline';h.width='0';h.height='0';h.position='relative';h.overflow='visible';h.pointerEvents='none';
      var bl=e.textContent.charCodeAt(0)===0xE002;var d=document.createElement('b');m.appendChild(d);
      if(bl){var dot=document.createElement('b');var q=dot.style;q.position='absolute';q.left='.63em';q.bottom='.04em';q.width='.12em';q.height='.12em';q.borderRadius='50%';q.backgroundColor='#F1ECE1';m.appendChild(dot);}   // a drawn dot, not text, so the symbol check still sees one private character}   // Oct 29 (Scott): the blender reads as a word, with its own period after it
      var c=d.style;c.position='absolute';c.left=bl?'0':'.02em';c.bottom='-.08em';c.width=bl?'.6em':'.96em';c.height=bl?'.98em':'.86em';
      c.backgroundColor='#F1ECE1';c.webkitMaskImage=u;c.maskImage=u;c.webkitMaskRepeat='no-repeat';c.maskRepeat='no-repeat';
      c.webkitMaskPosition=bl?'left bottom':'center bottom';c.maskPosition=bl?'left bottom':'center bottom';c.webkitMaskSize='contain';c.maskSize='contain';
    });
    var gone=[];touched.forEach(function(o){if(live.indexOf(o.g)<0&&gone.indexOf(o.g)<0)gone.push(o.g);});gone.forEach(function(g){g.__mug=0;undo(g);});
  }
  // run inside the same tick as the word change (before the page measures the slot), so the cup is there with the first frame of the swap and Stir. gets its full width back at once
  try{new MutationObserver(function(){if(host)run();}).observe(document.body,{childList:true,subtree:true,characterData:true});}catch(x){}
  setInterval(run,250);run();
})();
