(function(){
if(window.__cutoutLiftInit) return; window.__cutoutLiftInit=true;
if(!window.matchMedia) return;
var HOVER=matchMedia('(hover: hover) and (pointer: fine)').matches;
if(!HOVER&&(matchMedia('(prefers-reduced-motion: reduce)').matches||!matchMedia('(pointer: coarse)').matches)) return;
var MAP={"a-kettle-over-the-fire.jpg":"assets/cutouts/a-kettle-over-the-fire-cutout.webp","lab-extraction-rig.jpg":"assets/cutouts/lab-extraction-rig-cutout.webp","lm-powder-scoop.jpg":"assets/cutouts/lm-powder-scoop-cutout.webp","shop-tennis-handshake-nobrand.jpg":"assets/cutouts/shop-tennis-handshake-nobrand-cutout.webp","coconut-palm-up.webp":"assets/cutouts/coconut-palm-up-cutout.webp","ginger-root.webp":"assets/cutouts/ginger-root-cutout.webp","coffee-pack-in-camp.jpg":"assets/cutouts/coffee-pack-in-camp-cutout.webp","receipts-tennis-noblog.jpg":"assets/cutouts/receipts-tennis-noblog-cutout.webp","kettle-tent-mist.jpg":"assets/cutouts/kettle-tent-mist-cutout.webp","lm-white.jpg":"assets/cutouts/lm-white-cutout.webp","cordyceps-forest.webp":"assets/cutouts/cordyceps-forest-cutout.webp","turkey-tail-card.jpg":"assets/cutouts/turkey-tail-card-cutout.webp","a-diver-signalling-underwater-alongside-a-shark.jpg":"assets/cutouts/a-diver-signalling-underwater-alongside-a-shark-cutout.webp","a-surfer-deep-in-the-barrel.jpg":"assets/cutouts/a-surfer-deep-in-the-barrel-cutout.webp","a-freediver-rising-over-the-sand-flats.jpg":"assets/cutouts/a-freediver-rising-over-the-sand-flats-cutout.webp","lm-how-made-desk.jpg":"assets/cutouts/lm-how-made-desk-cutout.webp","tt-autumn-fans.jpg":"assets/cutouts/tt-autumn-fans-cutout.webp","why-desk-coffee.jpg":"assets/cutouts/why-desk-coffee-cutout.webp","stillness-in-the-forest.jpg":"assets/cutouts/stillness-in-the-forest-cutout.webp","about-loaded-car-clean.jpg":"assets/cutouts/about-loaded-car-clean-cutout.webp","about-kayaks.jpg":"assets/cutouts/about-kayaks-cutout.webp","c-press-coast.jpg":"assets/cutouts/c-press-coast-cutout.webp","h-van-forest.webp":"assets/cutouts/h-van-forest-cutout.webp","van-rainier-stripes26.jpg":"assets/cutouts/van-rainier-stripes26-cutout.webp","two-figures-stretching-against-a-sunset-sea.jpg":"assets/cutouts/two-figures-stretching-against-a-sunset-sea-cutout.webp","tent-mug-zoom.jpg":"assets/cutouts/tent-mug-zoom-cutout.webp","lions-mane.jpg":"assets/cutouts/lions-mane-cutout.webp","tt-right-form-log.webp":"assets/cutouts/tt-right-form-log-cutout.webp","measured-hiker-sunset-flip.jpg":"assets/cutouts/measured-hiker-sunset-flip-cutout.webp"};
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches, DUR=1200, EASE='cubic-bezier(.45,0,.55,1)';
var SOFT={'stillness-in-the-forest.jpg':3,'kettle-tent-mist.jpg':3,'lm-how-made-desk.jpg':3,'measured-hiker-sunset-flip.jpg':3,'tt-right-form-log.webp':3,'lab-extraction-rig.jpg':3,'lions-mane.jpg':3,'tent-mug-zoom.jpg':40,'receipts-tennis-noblog.jpg':3};
var DIM={'receipts-tennis-noblog.jpg':'brightness(.3)','receipts-tennis-noblog.png':'brightness(.3)','lab-extraction-rig.jpg':'brightness(.3)','lab-extraction-rig.png':'brightness(.3)','tt-autumn-fans.jpg':'brightness(.45)','tt-autumn-fans.png':'brightness(.45)'};
var LIFT=RM?'none':'scale(1.02)', BLUR='blur(7px)', FEATHER=24;
var TIGHT={'a-kettle-over-the-fire.jpg':1,'two-figures-stretching-against-a-sunset-sea.jpg':1,'coconut-palm-up.webp':1}, TBLUR='blur(3px)', TFEATHER=6;
function bl(st){ return TIGHT[st.info.k]?TBLUR:BLUR; }
function key(u){ if(!u) return null; var f; try{ f=decodeURIComponent(u.split('?')[0].split('#')[0].split('/').pop()); }catch(e){ return null; } return MAP[f]?f:null; }
function splitList(v){ var out=[],d=0,cur=''; for(var i=0;i<v.length;i++){ var c=v[i]; if(c==='(')d++; if(c===')')d--; if(c===','&&d===0){ out.push(cur.trim()); cur=''; } else cur+=c; } out.push(cur.trim()); return out; }
function match(el){
  if(el.nodeType!==1||el.hasAttribute('data-lift-layer')) return null;
  if(el.tagName==='IMG'){ var k=key(el.currentSrc||el.getAttribute('src')); return k?{kind:'img',k:k}:null; }
  var cs=getComputedStyle(el), bi=cs.backgroundImage; if(!bi||bi==='none'||bi.indexOf('url(')<0) return null;
  var layers=splitList(bi); for(var i=0;i<layers.length;i++){ var m=layers[i].match(/url\(["']?([^"')]+)["']?\)/); if(m){ var k2=key(m[1]); if(k2){ var sz=splitList(cs.backgroundSize), ps=splitList(cs.backgroundPosition); return {kind:'bg',k:k2,size:sz[i%sz.length],pos:ps[i%ps.length]}; } } }
  return null;
}
var imgCache={}, featherCache={};
function loadImg(src){ if(!imgCache[src]) imgCache[src]=new Promise(function(res,rej){ var im=new Image(); im.onload=function(){res(im);}; im.onerror=rej; im.src=src; }); return imgCache[src]; }
function feathered(src,boxW,boxH,FEATHER){
  return loadImg(src).then(function(im){
    var iw=im.naturalWidth, ih=im.naturalHeight, s=Math.max(boxW/iw,boxH/ih)||1;
    var c=Math.min(1,(HOVER?2000:1200)/Math.max(iw,ih)), cw=Math.round(iw*c), ch=Math.round(ih*c);
    var f=Math.max(2,Math.round(FEATHER*c/s)), ck=src+'|'+f;
    if(featherCache[ck]) return featherCache[ck];
    return featherCache[ck]=new Promise(function(res){
      var A=document.createElement('canvas'); A.width=cw; A.height=ch; var a=A.getContext('2d'); a.drawImage(im,0,0,cw,ch);
      var sig=f/2, pad=Math.ceil(sig*3), B=document.createElement('canvas'); B.width=cw+pad*2; B.height=ch+pad*2; var b=B.getContext('2d');
      b.filter='blur(2px)'; var hasF=b.filter==='blur(2px)'; b.filter='none';
      b.drawImage(A,0,0,cw,1,pad,0,cw,pad); b.drawImage(A,0,ch-1,cw,1,pad,ch+pad,cw,pad);
      b.drawImage(A,0,0,1,ch,0,pad,pad,ch); b.drawImage(A,cw-1,0,1,ch,cw+pad,pad,pad,ch);
      b.drawImage(A,pad,pad);
      var M=document.createElement('canvas'); M.width=B.width; M.height=B.height; var m=M.getContext('2d');
      if(hasF){ m.filter='blur('+sig+'px)'; m.drawImage(B,0,0); }
      else { var k=Math.max(1,sig/2), T=document.createElement('canvas'); T.width=Math.max(1,Math.round(B.width/k)); T.height=Math.max(1,Math.round(B.height/k)); var t=T.getContext('2d'); t.imageSmoothingQuality='high'; t.drawImage(B,0,0,T.width,T.height); m.imageSmoothingQuality='high'; m.drawImage(T,0,0,M.width,M.height); }
      var md=m.getImageData(pad,pad,cw,ch).data, id=a.getImageData(0,0,cw,ch), d=id.data;
      for(var i=3;i<d.length;i+=4){ var v=(md[i]/255-.5)*2; v=v<0?0:v>1?1:v; v=v*v*(3-2*v); d[i]=Math.round(d[i]*v); }
      a.putImageData(id,0,0);
      A.toBlob(function(bl){ res(bl?URL.createObjectURL(bl):src); },'image/png');
    });
  }).catch(function(){ return src; });
}
var states=new Map(), active=null;
function mk(css){ var d=document.createElement('div'); d.setAttribute('data-lift-layer',''); d.style.cssText=css; return d; }
function clipOf(el){ for(var p=el.parentElement;p&&p!==document.body;p=p.parentElement){ var c=getComputedStyle(p); if(c.overflow!=='visible'||c.overflowX!=='visible'||c.overflowY!=='visible') return p.getBoundingClientRect(); } return null; }
function place(st){ var r=st.el.getBoundingClientRect(), c=clipOf(st.el)||r; var L=Math.max(r.left,c.left), T=Math.max(r.top,c.top), R=Math.min(r.right,c.right), B=Math.min(r.bottom,c.bottom); var o=st.box.style; o.left=L+'px'; o.top=T+'px'; o.width=Math.max(0,R-L)+'px'; o.height=Math.max(0,B-T)+'px'; if(st.cut){ var s=st.cut.style; s.inset='auto'; s.left=(r.left-L)+'px'; s.top=(r.top-T)+'px'; s.width=r.width+'px'; s.height=r.height+'px'; } }
var TR=function(p){ return p+' '+DUR+'ms '+EASE; };
function build(el,info){
  var st={el:el,info:info,saved:[]}; var r=el.getBoundingClientRect(), cs=getComputedStyle(el);
  var blurCss='position:absolute;inset:0;backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);transition:'+TR('backdrop-filter')+','+TR('-webkit-backdrop-filter')+';';
  var cutCss='position:absolute;inset:0;background-repeat:no-repeat;opacity:0;transform:none;transition:'+TR('opacity')+','+TR('transform')+';will-change:transform,opacity;transform-origin:50% 60%;';
  if(info.kind==='img'){
    var fit=cs.objectFit, size= fit==='contain'?'contain': fit==='fill'?'100% 100%': fit==='none'?'auto': fit==='scale-down'?'contain':'cover';
    st.box=mk('position:fixed;pointer-events:none;z-index:30;overflow:hidden;border-radius:'+cs.borderRadius+';');
    st.cut=mk(cutCss+'background-size:'+size+';background-position:'+cs.objectPosition+';'+(DIM[info.k]?'filter:'+DIM[info.k]+';':''));
    document.body.appendChild(st.box); place(st);
  } else {
    if(cs.position==='static'){ st.saved.push([el,'position',el.style.position]); el.style.position='relative'; }
    st.box=mk('position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden;border-radius:inherit;');
    st.cut=mk(cutCss+'background-size:'+info.size+';background-position:'+info.pos+';'+(DIM[info.k]?'filter:'+DIM[info.k]+';':''));
    [].slice.call(el.children).forEach(function(c){ var cc=getComputedStyle(c); if(cc.position==='static'){ st.saved.push([c,'position',c.style.position],[c,'zIndex',c.style.zIndex]); c.style.position='relative'; c.style.zIndex='1'; } else if(cc.zIndex==='auto'){ st.saved.push([c,'zIndex',c.style.zIndex]); c.style.zIndex='1'; } });
    el.insertBefore(st.box, el.firstChild);
  }
  st.blur=mk(blurCss); st.box.appendChild(st.blur); st.box.appendChild(st.cut); if(info.kind==='img') place(st);
  st.ready=feathered(MAP[info.k],r.width,r.height,(SOFT[info.k]||(TIGHT[info.k]?TFEATHER:FEATHER))).then(function(u){ st.cut.style.backgroundImage='url("'+u+'")'; });
  return st;
}
function on(st){ clearTimeout(st.t); st.ready.then(function(){ requestAnimationFrame(function(){ requestAnimationFrame(function(){
  if(active!==st) return;
  st.cut.style.opacity='1'; st.cut.style.transform=LIFT; st.blur.style.backdropFilter=bl(st); st.blur.style.webkitBackdropFilter=bl(st);
}); }); }); }
function off(st){
  st.cut.style.opacity='0'; st.cut.style.transform='none'; st.blur.style.backdropFilter='blur(0px)'; st.blur.style.webkitBackdropFilter='blur(0px)';
  clearTimeout(st.t); st.t=setTimeout(function(){ teardown(st); }, DUR+80);
}
function teardown(st){ if(st.box&&st.box.parentNode) st.box.parentNode.removeChild(st.box); st.saved.reverse().forEach(function(s){ s[0].style[s[1]]=s[2]; }); states.delete(st.el); }
function setActive(el,info){
  if(active&&active.el===el) return;
  if(active){ off(active); active=null; }
  if(!el) return;
  var st=states.get(el); if(!st){ st=build(el,info); states.set(el,st); }
  active=st; on(st);
}
var px=-1,py=-1,queued=false;
function tick(){ queued=false; if(px<0){ setActive(null); return; }
  var els=document.elementsFromPoint(px,py), hit=null, info=null;
  for(var i=0;i<els.length;i++){ var e=els[i]; if(e===document.body||e===document.documentElement) break; var m=match(e); if(m){ hit=e; info=m; break; } }
  setActive(hit,info);
}
if(HOVER){
document.addEventListener('mousemove',function(e){ px=e.clientX; py=e.clientY; if(!queued){ queued=true; requestAnimationFrame(tick); } },{passive:true});
document.addEventListener('mouseleave',function(){ px=-1; setActive(null); });
} else {
/* touch devices: play whichever image sits at the middle of the screen; reset when it scrolls away */
var center=function(){ if(document.hidden) return; px=innerWidth/2; py=innerHeight/2; if(!queued){ queued=true; requestAnimationFrame(tick); } };
window.addEventListener('scroll',center,{passive:true,capture:true}); window.addEventListener('load',center); setInterval(center,600); center();
}
if(HOVER) window.addEventListener('blur',function(){ px=-1; setActive(null); });
function reflow(){ states.forEach(function(st){ if(!st.el.isConnected){ teardown(st); if(active===st) active=null; return; } if(st.info.kind==='img') place(st); }); if(!queued&&px>=0){ queued=true; requestAnimationFrame(tick); } }
window.addEventListener('scroll',reflow,{passive:true,capture:true}); window.addEventListener('resize',reflow);
})();