/* Oct 28 (Scott): pastel mushroom buttons, straight, gold framed, claim fills the box, gold shimmer, black and gold icon tile that pops */
(function(){
var P={'mx-lm':{bg:'#D3E6F7',bg2:'#BFD9F2',deep:'#1B3F6B',ink:'#000',glow:'#8EC5F5'},
'mx-cd':{bg:'#D9F0D6',bg2:'#BFE5BA',deep:'#1F6B36',ink:'#000',glow:'#8FD39A'},
'mx-tt':{bg:'#E3D9F4',bg2:'#D2C3EE',deep:'#4B2A8A',ink:'#000',glow:'#C6AEF2'}};
var R={'m-lm':'mx-lm','m-cd':'mx-cd','m-rs':'mx-tt'};
var GOLD='#D4A24A';
var FONT='"Bebas Neue","Oswald",sans-serif';
function rules(B,N,C,T,I,c){ /* B box, N name span, C claim span, T text p, I icon tile, c colors */
var t='';
t+=B+'{background:'+c.bg+' !important;background-image:none !important;border:3px solid '+GOLD+' !important;border-radius:22px !important;transform:none !important;outline:0 !important;position:relative !important;overflow:hidden !important;padding:8px 12px !important;text-align:center !important;box-shadow:none !important}';
t+=B+'::before{display:none !important}';
t+=B+'::after{display:none !important;content:none !important}';
t+=B+' > *{position:relative;z-index:2}';t+=T+'{font-size:0 !important;line-height:0 !important;text-align:center !important;width:100%}';
t+=N+'{display:block !important;font-family:'+FONT+' !important;font-size:clamp(16px,'+c.nv+'vw,'+c.nm+'px) !important;letter-spacing:.09em !important;white-space:nowrap !important;color:'+c.ink+' !important;-webkit-text-fill-color:'+c.ink+' !important;line-height:1.2 !important;padding-bottom:4px !important;margin:0 auto 6px !important;width:84% !important;border-bottom:2px solid '+GOLD+' !important}';
t+=C+'{display:block !important;font-family:'+FONT+' !important;font-weight:400 !important;text-transform:uppercase !important;font-size:clamp(24px,'+c.cv+'vw,'+c.cm+'px) !important;line-height:1.0 !important;letter-spacing:.03em !important;text-align:center !important;color:#000 !important;-webkit-text-fill-color:#000 !important;-webkit-text-stroke:0 !important;paint-order:normal !important;background:none !important;padding:0 !important;text-wrap:balance}';
return t}
function css(){if(document.getElementById('pastel-btn-css'))return;var s=document.createElement('style');s.id='pastel-btn-css';
var t='@keyframes rcxShimmer{0%{left:-60%}55%,100%{left:130%}}@media (prefers-reduced-motion:reduce){html body *::after{animation:none !important}}';
for(var k in P){var c=P[k],M='html body .mx-group.mx-group.mx-group.mx-group .mx-sec[data-m="'+k+'"] .mx-title.mx-title.mx-title[data-dc-tpl][data-dc-tpl][data-dc-tpl]';
c=Object.assign({},c,{nv:5,nm:23,cv:7.6,cm:32});t+=rules(M,M+' p[data-dc-tpl] span[data-m="rl-name"]',M+' p[data-dc-tpl] span:not([data-m="rl-name"])',M+' p[data-dc-tpl]',M+' a.mx-ic-link',c);
t+=M+' h2,'+M+' h2 span{color:#000 !important;-webkit-text-fill-color:#000 !important;-webkit-text-stroke:0 !important;text-align:center}';}
for(var pg in R){var c2=P[R[pg]],B='html body .rcx-row.rcx-row.rcx-row > .rcx-marble.rcx-txt[data-page="'+pg+'"][data-dc-tpl][data-dc-tpl]',I='html body .rcx-row.rcx-row.rcx-row:has(> .rcx-marble[data-page="'+pg+'"]) > a.rcx-logo.rcx-metal';
c2=Object.assign({},c2,{nv:4.2,nm:17,cv:6.1,cm:26});t+=rules(B,B+' p[data-dc-tpl] span[data-m="rl-name"]',B+' p[data-dc-tpl] span:not([data-m="rl-name"])',B+' p[data-dc-tpl]',I,c2);
t+=B+'{display:flex !important;flex-direction:column !important;justify-content:center !important;height:92px !important;min-height:92px !important;max-height:92px !important;padding:4px 10px !important;box-sizing:border-box !important}'+B+' p[data-dc-tpl] span[data-m="rl-name"]{padding-bottom:2px !important;margin:0 auto 3px !important}'+B+' p[data-dc-tpl] span:not([data-m="rl-name"]){line-height:.96 !important}';t+='html body .rcx-row.rcx-row.rcx-row{align-items:stretch !important}'+I+'{align-self:center !important;height:92px !important;width:92px !important;min-width:92px !important;max-width:92px !important;aspect-ratio:1/1 !important;flex:0 0 92px !important;padding:14px !important;overflow:hidden !important;box-sizing:border-box !important}';}
s.textContent=t;document.body.appendChild(s)}
function setBg(e,c){var pr=document.createElement('i');pr.style.setProperty('background-color',c.bg);if(e.style.backgroundColor!==pr.style.backgroundColor||e.style.backgroundImage!=='none'){e.style.setProperty('background-image','none','important');e.style.setProperty('background-color',c.bg,'important');}if(e.style.boxShadow!=='none'){e.style.setProperty('box-shadow','none','important')}}
function paint(){css();for(var k in P){document.querySelectorAll('.mx-sec[data-m="'+k+'"] .mx-title').forEach(function(e){setBg(e,P[k])})}
document.querySelectorAll('.rcx-row > .rcx-marble.rcx-txt').forEach(function(e){var c=P[R[e.getAttribute('data-page')]];if(c)setBg(e,c)})}
paint();setInterval(paint,200);
})();
