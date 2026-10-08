(function(){
if(window.__cutoutLiftInit) return; window.__cutoutLiftInit=true;
if(!window.matchMedia) return;
var HOVER=matchMedia('(hover: hover) and (pointer: fine)').matches;
if(!HOVER&&(matchMedia('(prefers-reduced-motion: reduce)').matches||!matchMedia('(pointer: coarse)').matches)) return;
var MAP={"a-kettle-over-the-fire.jpg":"assets/cutouts/a-kettle-over-the-fire-cutout.webp","lab-extraction-rig.jpg":"assets/cutouts/lab-extraction-rig-cutout.webp","lm-powder-scoop.jpg":"assets/cutouts/lm-powder-scoop-cutout.webp","shop-tennis-handshake-nobrand.jpg":"assets/cutouts/shop-tennis-handshake-nobrand-cutout.webp","coconut-palm-up.webp":"assets/cutouts/coconut-palm-up-cutout.webp","ginger-root.webp":"assets/cutouts/ginger-root-cutout.webp","coffee-pack-in-camp.webp":"assets/cutouts/coffee-pack-in-camp-cutout.webp","receipts-tennis-noblog.jpg":"assets/cutouts/receipts-tennis-noblog-cutout.webp","kettle-tent-mist.jpg":"assets/cutouts/kettle-tent-mist-cutout.webp","lm-white.jpg":"assets/cutouts/lm-white-cutout.webp","cordyceps-forest.webp":"assets/cutouts/cordyceps-forest-cutout.webp","turkey-tail-card.jpg":"assets/cutouts/turkey-tail-card-cutout.webp","a-diver-signalling-underwater-alongside-a-shark.jpg":"assets/cutouts/a-diver-signalling-underwater-alongside-a-shark-cutout.webp","a-surfer-deep-in-the-barrel.jpg":"assets/cutouts/a-surfer-deep-in-the-barrel-cutout.webp","a-freediver-rising-over-the-sand-flats.jpg":"assets/cutouts/a-freediver-rising-over-the-sand-flats-cutout.webp","lm-how-made-desk.jpg":"assets/cutouts/lm-how-made-desk-cutout.webp","tt-autumn-fans.jpg":"assets/cutouts/tt-autumn-fans-cutout.webp","why-desk-coffee.jpg":"assets/cutouts/why-desk-coffee-cutout.webp","stillness-in-the-forest.jpg":"assets/cutouts/stillness-in-the-forest-cutout.webp","about-loaded-car-clean.webp":"assets/cutouts/about-loaded-car-clean-cutout.webp","about-kayaks.jpg":"assets/cutouts/about-kayaks-cutout.webp","c-press-coast.jpg":"assets/cutouts/c-press-coast-cutout.webp","h-van-forest.webp":"assets/cutouts/h-van-forest-cutout.webp","van-rainier-stripes26.jpg":"assets/cutouts/van-rainier-stripes26-cutout.webp","two-figures-stretching-against-a-sunset-sea.jpg":"assets/cutouts/two-figures-stretching-against-a-sunset-sea-cutout.webp","tent-mug-zoom.jpg":"assets/cutouts/tent-mug-zoom-cutout.webp","lions-mane.jpg":"assets/cutouts/lions-mane-cutout.webp","tt-right-form-log.webp":"assets/cutouts/tt-right-form-log-cutout.webp","measured-hiker-sunset-flip.jpg":"assets/cutouts/measured-hiker-sunset-flip-cutout.webp"};
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
  if(el.hasAttribute('data-nolift-ph')&&matchMedia('(max-width:767px)').matches) return null;
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
var WAIT=1000;
function on(st){ clearTimeout(st.t); clearTimeout(st.w); if(RM) return; st.w=setTimeout(function(){ st.ready.then(function(){ requestAnimationFrame(function(){ requestAnimationFrame(function(){
  if(active!==st) return;
  st.lit=true; st.cut.style.opacity='1'; st.cut.style.transform=LIFT; st.blur.style.backdropFilter=bl(st); st.blur.style.webkitBackdropFilter=bl(st);
}); }); }); }, WAIT); }
window.addEventListener('scroll',function(){ if(active&&!active.lit) on(active); },{passive:true,capture:true});
function off(st){
  clearTimeout(st.w); st.lit=false;
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
var center=function(){ if(document.hidden) return; px=innerWidth/2; py=innerHeight/2; var pr=document.querySelectorAll('[data-lift-probe]'); for(var pi=0;pi<pr.length;pi++){ var rr=pr[pi].getBoundingClientRect(); if(rr.width&&rr.top<=py&&rr.bottom>=py&&(rr.left>px||rr.right<px)){ px=(rr.left+rr.right)/2; break; } if(rr.width&&rr.bottom<py&&rr.top>=0&&scrollY<40){ px=(rr.left+rr.right)/2; py=(rr.top+rr.bottom)/2; break; } } if(!queued){ queued=true; requestAnimationFrame(tick); } };
window.addEventListener('scroll',center,{passive:true,capture:true}); window.addEventListener('load',center); setInterval(center,600); center();
}
if(HOVER) window.addEventListener('blur',function(){ px=-1; setActive(null); });
/* phone only: camper photo behind the opening paragraph gets its own slow, once-only cutout (holds 1.5s, then 6s together with the shade) */
(function(){
  if(RM||!matchMedia('(max-width:767px)').matches||!window.IntersectionObserver) return;
  var CK='why-rv-desk-nopen.jpg', CSRC='assets/cutouts/why-rv-desk-nopen-cutout-v2.webp', CT=function(p){ return p+' 6000ms ease-in-out 1500ms'; };
  function arm(el){
    if(el.__camperLift) return; el.__camperLift=true;
    var cs=getComputedStyle(el), r=el.getBoundingClientRect();
    var box=mk('position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden;');
    var blur=mk('position:absolute;inset:0;backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);transition:'+CT('backdrop-filter')+','+CT('-webkit-backdrop-filter')+';');
    var cut=mk('position:absolute;inset:0;background-repeat:no-repeat;background-size:'+cs.backgroundSize+';background-position:'+cs.backgroundPosition+';opacity:0;transform:none;transform-origin:50% 60%;will-change:transform,opacity;transition:'+CT('opacity')+','+CT('transform')+';');
    box.appendChild(blur); box.appendChild(cut); el.insertBefore(box,el.firstChild);
    var ready=feathered(CSRC,r.width,r.height,FEATHER).then(function(u){ cut.style.backgroundImage='url("'+u+'")'; });
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(!e.isIntersecting) return; io.disconnect();
      ready.then(function(){ requestAnimationFrame(function(){ requestAnimationFrame(function(){ cut.style.opacity='1'; cut.style.transform=LIFT; blur.style.backdropFilter=BLUR; blur.style.webkitBackdropFilter=BLUR; }); }); }); }); },{threshold:0.25});
    io.observe(el);
  }
  setInterval(function(){ var z=document.querySelectorAll('[data-m="camper-zone"]'); for(var i=0;i<z.length;i++) if(key2(z[i])) arm(z[i]); },500);
  function key2(el){ var bi=getComputedStyle(el).backgroundImage; return bi&&bi.indexOf(CK)>=0; }
})();
/* phone only: photos marked data-lift-once get the cutout lift once when they scroll into view (for background photos the tap/centre probe can't reach) */
(function(){
  if(RM||!matchMedia('(max-width:767px)').matches||!window.IntersectionObserver) return;
  function pos(el,box){ var o=box.style; o.left=el.offsetLeft+'px'; o.top=el.offsetTop+'px'; o.width=el.offsetWidth+'px'; o.height=el.offsetHeight+'px'; }
  function arm(el){
    el.setAttribute('data-lift-armed','');
    var cs=getComputedStyle(el), src=el.getAttribute('data-lift-once');
    var box=mk('position:absolute;pointer-events:none;z-index:0;overflow:hidden;-webkit-mask-image:'+cs.webkitMaskImage+';mask-image:'+(cs.maskImage||cs.webkitMaskImage)+';');
    var blur=mk('position:absolute;inset:0;backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);transition:'+TR('backdrop-filter')+','+TR('-webkit-backdrop-filter')+';');
    var cut=mk('position:absolute;inset:0;background-repeat:no-repeat;background-size:cover;background-position:'+cs.objectPosition+';filter:'+cs.filter+';opacity:0;transform:none;transform-origin:50% 60%;will-change:transform,opacity;transition:'+TR('opacity')+','+TR('transform')+';');
    box.appendChild(blur); box.appendChild(cut); el.parentElement.appendChild(box); pos(el,box);
    addEventListener('resize',function(){ pos(el,box); });
    var ready=feathered(src,el.offsetWidth,el.offsetHeight,FEATHER).then(function(u){ cut.style.backgroundImage='url("'+u+'")'; });
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(!e.isIntersecting||e.intersectionRect.height<(el.hasAttribute('data-lift-small')?el.offsetHeight*0.6:innerHeight*0.4)) return; io.disconnect(); pos(el,box);
      setTimeout(function(){ ready.then(function(){ requestAnimationFrame(function(){ requestAnimationFrame(function(){ cut.style.opacity='1'; cut.style.transform=LIFT; blur.style.backdropFilter=BLUR; blur.style.webkitBackdropFilter=BLUR; }); }); }); },WAIT); }); },{threshold:[0,.1,.2,.3,.4,.5]});
    io.observe(el);
  }
  setInterval(function(){ var z=document.querySelectorAll('img[data-lift-once]:not([data-lift-armed])'); for(var i=0;i<z.length;i++) if(z[i].offsetWidth&&z[i].complete) arm(z[i]); },500);
})();
/* phone only: hero background photos marked data-lift-bg get a slow, once-only cutout lift in step with their shade (holds 1.5s, then 6s) */
(function(){
  if(RM||!matchMedia('(max-width:767px)').matches||!window.IntersectionObserver) return;
  var CT=function(p){ return p+' 6000ms ease-in-out 1500ms'; };
  function arm(el){
    el.setAttribute('data-lift-armed','');
    var cs=getComputedStyle(el), r=el.getBoundingClientRect(), sz=splitList(cs.backgroundSize), ps=splitList(cs.backgroundPosition), M='linear-gradient(to top,transparent 0,#000 14%)';
    var box=mk('position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden;-webkit-mask-image:'+M+';mask-image:'+M+';');
    var blur=mk('position:absolute;inset:0;backdrop-filter:blur(0px);-webkit-backdrop-filter:blur(0px);transition:'+CT('backdrop-filter')+','+CT('-webkit-backdrop-filter')+';');
    var cut=mk('position:absolute;inset:0;background-repeat:no-repeat;background-size:'+sz[sz.length-1]+';background-position:'+ps[ps.length-1]+';opacity:0;transform:none;transform-origin:50% 60%;will-change:transform,opacity;transition:'+CT('opacity')+','+CT('transform')+';');
    box.appendChild(blur); box.appendChild(cut); el.insertBefore(box,el.firstChild);
    var ready=feathered(el.getAttribute('data-lift-bg'),r.width,r.height,SOFT_BG).then(function(u){ cut.style.backgroundImage='url("'+u+'")'; });
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(!e.isIntersecting) return; io.disconnect();
      ready.then(function(){ requestAnimationFrame(function(){ requestAnimationFrame(function(){ cut.style.opacity='1'; cut.style.transform=LIFT; blur.style.backdropFilter=BLUR; blur.style.webkitBackdropFilter=BLUR; }); }); }); }); },{threshold:0.25});
    io.observe(el);
  }
  var SOFT_BG=3;
  setInterval(function(){ var z=document.querySelectorAll('[data-lift-bg]:not([data-lift-armed])'); for(var i=0;i<z.length;i++) if(z[i].offsetWidth) arm(z[i]); },500);
})();
function reflow(){ states.forEach(function(st){ if(!st.el.isConnected){ teardown(st); if(active===st) active=null; return; } if(st.info.kind==='img') place(st); }); if(!queued&&px>=0){ queued=true; requestAnimationFrame(tick); } }
window.addEventListener('scroll',reflow,{passive:true,capture:true}); window.addEventListener('resize',reflow);
})();
/* slow, subtle brighten for darkened background photos that have no other animation */
(function(){
if(window.__rcxBrightenInit) return; window.__rcxBrightenInit=true;
if(!window.matchMedia||!window.IntersectionObserver) return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
var SKIP=["roar-wet-slate","why-rv-desk-nopen","hero-stove-pour-ridge-v10","why-grow-houses-crop","a-kettle-over-the-fire","lab-extraction-rig","lm-powder-scoop","shop-tennis-handshake-nobrand","coconut-palm-up","ginger-root","coffee-pack-in-camp","receipts-tennis-noblog","kettle-tent-mist","lm-white","cordyceps-forest","turkey-tail-card","a-diver-signalling-underwater-alongside-a-shark","a-surfer-deep-in-the-barrel","a-freediver-rising-over-the-sand-flats","lm-how-made-desk","tt-autumn-fans","why-desk-coffee","stillness-in-the-forest","about-loaded-car-clean","about-kayaks","c-press-coast","h-van-forest","van-rainier-stripes26","two-figures-stretching-against-a-sunset-sea","tent-mug-zoom","lions-mane","tt-right-form-log","measured-hiker-sunset-flip","ff9c1d42-4950-4209-a52b-8724a5a9d0f2-mtowbr1j-ab5x","tent-mug-graded-v2","turkey-tail-right-form","packs-thermos-flip","f35da25a7d452e00dca21f34a0b13609227243dc-mtopujei-faey","20230805032805_1410005693_16559_0-mtp1wpe0-5mms","images-mu06k4kb-4kxl","800-mu06hufv-nq2u","cd-rower-scull","forest-meditation-peace-stockcake-185201-mtopvt0i-6w18","coffee-makers","unwind_at_the_best_yoga_retreats_in_asia-mtzins5h-ix8f","tt-right-form-forest","measured-hiker-sunset","measured-paddleboard-river","measured-paddleboard-river-flip"];
var LIFT=0.1, DELAY=1000, FADE_IN=2600, FADE_OUT=1200;
var BOOST={'lm-skagit-valley':0.22,'cd-yunnan-hoodoos':0.22,'rs-changbai':0.22};
function split(v){ var out=[],d=0,cur=''; for(var i=0;i<v.length;i++){ var ch=v[i]; if(ch==='(')d++; if(ch===')')d--; if(ch===','&&d===0){ out.push(cur.trim()); cur=''; } else cur+=ch; } out.push(cur.trim()); return out; }
function stemOf(u){ var f=u.split('?')[0].split('#')[0].split('/').pop(); try{ f=decodeURIComponent(f); }catch(e){} return f.replace(/\.(jpe?g|png|webp|avif)$/i,''); }
var items=new Map(), visible=new Set(), timer=0;
function candidate(el){
  if(el.hasAttribute('data-lift-layer')||el.hasAttribute('data-bright-layer')||el.closest('[data-lift-layer]')) return null;
  var cs=getComputedStyle(el), bi=cs.backgroundImage; if(!bi||bi.indexOf('url(')<0||bi.indexOf('gradient')<0) return null;
  if(cs.animationName&&cs.animationName!=='none') return null;
  var L=split(bi); if(!/^(linear|radial)-gradient\(.*rgba?\(0, 0, 0/.test(L[0])) return null;
  for(var i=0;i<L.length;i++){ var m=L[i].match(/url\(["']?([^"')]+)["']?\)/); if(m){ if(/\.svg/i.test(m[1])) return null; if(SKIP.indexOf(stemOf(m[1]))>=0) return null; return {i:i,url:m[1],lift:BOOST[stemOf(m[1])]||LIFT}; } }
  return null;
}
function sync(it){
  var cs=getComputedStyle(it.el), pick=function(v){ var a=split(v); return a[it.i%a.length]; };
  var s=it.layer.style; s.backgroundImage='url("'+it.url+'")';
  s.backgroundSize=pick(cs.backgroundSize); s.backgroundPosition=pick(cs.backgroundPosition);
  s.backgroundRepeat=pick(cs.backgroundRepeat); s.backgroundAttachment=pick(cs.backgroundAttachment);
}
function add(el,info){
  var cs=getComputedStyle(el), saved=[];
  if(cs.position==='static'){ saved.push(['position',el.style.position]); el.style.position='relative'; }
  if(cs.isolation!=='isolate'){ saved.push(['isolation',el.style.isolation]); el.style.isolation='isolate'; }
  var d=document.createElement('div'); d.setAttribute('data-bright-layer',''); d.setAttribute('aria-hidden','true');
  d.style.cssText='position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:0;border-radius:inherit;transition:opacity '+FADE_OUT+'ms ease;';
  el.insertBefore(d,el.firstChild);
  var it={el:el,i:info.i,url:info.url,lift:info.lift,layer:d,saved:saved}; sync(it); items.set(el,it); io.observe(el);
}
function remove(it){ io.unobserve(it.el); if(it.layer.parentNode) it.layer.parentNode.removeChild(it.layer); it.saved.forEach(function(s){ it.el.style[s[0]]=s[1]; }); visible.delete(it.el); items.delete(it.el); }
var io=new IntersectionObserver(function(es){ es.forEach(function(e){ var it=items.get(e.target); if(!it) return;
  if(e.isIntersecting&&e.intersectionRatio>=0.35) visible.add(e.target); else { visible.delete(e.target); dim(it); } }); arm(); },{threshold:[0,0.35,0.6]});
function lit(it){ sync(it); it.layer.style.transition='opacity '+FADE_IN+'ms cubic-bezier(.4,0,.2,1)'; it.layer.style.opacity=String(it.lift||LIFT); }
function dim(it){ it.layer.style.transition='opacity '+FADE_OUT+'ms ease'; it.layer.style.opacity='0'; }
function arm(){ clearTimeout(timer); timer=setTimeout(function(){ visible.forEach(function(el){ var it=items.get(el); if(it) lit(it); }); },DELAY); }
function scan(){
  items.forEach(function(it){ if(!it.el.isConnected||!candidate(it.el)&&!it.el.contains(it.layer)) remove(it); });
  var all=document.querySelectorAll('body *');
  for(var k=0;k<all.length;k++){ var el=all[k]; if(items.has(el)) continue; var info=candidate(el); if(info) add(el,info); }
}
var q=0; function later(){ clearTimeout(q); q=setTimeout(scan,250); }
new MutationObserver(function(ms){ for(var i=0;i<ms.length;i++){ var n=ms[i]; if(n.type==='childList'){ var a=[].slice.call(n.addedNodes).concat([].slice.call(n.removedNodes)); if(a.some(function(x){ return !(x.nodeType===1&&(x.hasAttribute('data-bright-layer')||x.hasAttribute('data-lift-layer'))); })){ later(); return; } } } }).observe(document.body,{childList:true,subtree:true});
window.addEventListener('scroll',arm,{passive:true,capture:true});
window.addEventListener('resize',function(){ items.forEach(sync); });
if(document.readyState==='complete') scan(); else window.addEventListener('load',scan); setTimeout(scan,1500);
})();
