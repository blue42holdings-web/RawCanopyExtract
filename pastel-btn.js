/* Oct 28 (Scott): softer, friendlier look. Each mushroom button gets its own pastel, same words, deeper tone of the same color for the claim */
(function(){
var P={'mx-lm':{hl:'#8EC5F5',tilt:'-1.4deg',bg:'#D3E6F7',deep:'#1F4B7A',edge:'#9CC3E6',ink:'#22303F'},
'mx-cd':{hl:'#FFB68A',tilt:'1.2deg',bg:'#FCDCC8',deep:'#9A4416',edge:'#F0B393',ink:'#3A2A22'},
'mx-tt':{hl:'#C6AEF2',tilt:'-1deg',bg:'#E3D9F4',deep:'#58349A',edge:'#BDA9E3',ink:'#2E2640'}};
function css(){if(document.getElementById('pastel-btn-css'))return;var s=document.createElement('style');s.id='pastel-btn-css';var t='';
for(var k in P){var c=P[k],q='html body .mx-sec[data-m="'+k+'"] .mx-title.mx-title[data-dc-tpl]',Q='html body .mx-group.mx-group.mx-group.mx-group .mx-sec[data-m="'+k+'"] .mx-title.mx-title.mx-title[data-dc-tpl][data-dc-tpl][data-dc-tpl]';
t+=q+'{border-color:'+c.edge+' !important}';
t+=q+' h2,'+q+' h2 span{color:'+c.ink+' !important;-webkit-text-fill-color:'+c.ink+' !important;-webkit-text-stroke:0 !important}';
t+=q+' p[data-dc-tpl] span:not([data-m="rl-name"]),'+q+' span:not([data-m="rl-name"]),'+Q+' p[data-dc-tpl] span{color:'+c.deep+' !important;-webkit-text-fill-color:'+c.deep+' !important;-webkit-text-stroke:0 !important;paint-order:normal !important}';
t+=Q+' p[data-dc-tpl] span[data-m="rl-name"]{color:'+c.ink+' !important;-webkit-text-fill-color:'+c.ink+' !important}'+q+' p[data-dc-tpl] span[data-m="rl-name"]{color:'+c.ink+' !important;-webkit-text-fill-color:'+c.ink+' !important}';
t+=q+' a.mx-ic-link{background:'+c.edge+' !important;--slbg:none !important}';
t+=q+' a.mx-ic-link img{filter:brightness(0) opacity(.72) !important;background:transparent !important;background-color:transparent !important}';}
t+='';for(var k in P){var c=P[k],Q='html body .mx-group.mx-group.mx-group.mx-group .mx-sec[data-m="'+k+'"] .mx-title.mx-title.mx-title[data-dc-tpl][data-dc-tpl][data-dc-tpl]';
t+=Q+'{border:4px solid #fff !important;border-radius:30px !important;transform:rotate('+c.tilt+');box-shadow:0 10px 22px rgba(0,0,0,.4) !important}';
t+=Q+'::before,'+Q+'::after{display:none !important;background:none !important}';t+=Q+' a.mx-ic-link{border-radius:26px 0 0 26px !important}';
t+=Q+' p[data-dc-tpl] span:not([data-m="rl-name"]){display:inline !important;font-size:38px !important;line-height:1.12 !important;letter-spacing:.02em !important;background:linear-gradient(transparent 58%,'+c.hl+' 58%,'+c.hl+' 94%,transparent 94%) !important;-webkit-box-decoration-break:clone;box-decoration-break:clone;padding:0 4px}';
t+=Q+' p[data-dc-tpl] span[data-m="rl-name"]{font-size:15px !important;letter-spacing:.14em !important;display:block !important;margin-bottom:6px !important;opacity:.85}';}
s.textContent=t;document.body.appendChild(s)}
function paint(){css();for(var k in P){document.querySelectorAll('.mx-sec[data-m="'+k+'"] .mx-title').forEach(function(e){
var pr=document.createElement('i');pr.style.color=P[k].bg;if(e.style.backgroundColor!==pr.style.color||e.style.backgroundImage!=='none'){e.style.setProperty('background-image','none','important');e.style.setProperty('background-color',P[k].bg,'important');e.style.setProperty('box-shadow','0 8px 20px rgba(0,0,0,.35)','important')}})}}
paint();setInterval(paint,150);
})();
