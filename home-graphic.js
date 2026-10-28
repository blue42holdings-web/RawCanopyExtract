/* Oct 22 2026 (Scott): PHONE home. The brand paragraph box becomes a graphic:
   box one, on the erupting volcano: what's in their "functional" mushroom scoop (15 labeled pieces, the mushroom a glowing sliver) vs our one clean packet.
   box two, on the river forest: Uncompromising, by design (four tiles), Tear > Pour > Build your honest blend.
   Desktop keeps the paragraph for now. */
(function () {
  var ING = [['RICE FLOUR', '#7a1f1f'], ['MALTODEXTRIN', '#5b4a44'], ['NATURAL FLAVORS', '#9b2c2c'], ['XANTHAN GUM', '#6e3b2e'], ['CORN STARCH', '#4a4440'], ['GUAR GUM', '#a8432e'], ['SILICA', '#3f3a37'], ['MUSHROOM', ''], ['SUCRALOSE', '#8c2a2a'], ['DEXTROSE', '#6a5a52'], ['CARAMEL COLOR', '#b0472f'], ['SOY LECITHIN', '#4d3b35'], ['MAGNESIUM STEARATE', '#7d2424'], ['CARRAGEENAN', '#5e5550'], ['CANE SUGAR', '#963528']];
  var css = document.createElement('style'); css.id = 'home-graphic-css';
  css.textContent = [
    '.hg{padding:6px 0 4px;font-family:Oswald,sans-serif;text-align:left}',
    '.hg *{box-sizing:border-box}',
    '.hg-box{border:3px solid #D4A24A;border-radius:18px;padding:20px 16px 18px;margin:0 0 16px}',
    '.hg-b1{background:linear-gradient(rgba(8,6,6,.42),rgba(8,6,6,.72)),url("assets/photo/volcano-fountain-flop.jpg") 55% 40%/auto 115% no-repeat #000}',
    '.hg-b2{background:linear-gradient(rgba(4,22,12,.55),rgba(4,18,10,.78)),url("assets/photo/own-river-forest.jpg") center 40%/cover no-repeat #000}',
    '.hg-q{font-family:"Bebas Neue",sans-serif;color:#F1ECE1;letter-spacing:.04em;line-height:1.08;white-space:nowrap;text-align:center;margin:0 0 4px;font-weight:400}',
    '.hg-lab{display:flex;justify-content:space-between;align-items:baseline;font-family:"Bebas Neue",sans-serif;letter-spacing:.1em;font-size:20px;color:#F1ECE1;margin:16px 0 6px}',
    '.hg-lab span:last-child{font-size:15px;letter-spacing:.06em}',
    '.hg-who{display:flex;align-items:center;gap:14px;margin:18px 0 8px}',
    '.hg-them .hg-who{margin-bottom:26px}',
    'html body .hg .hg-big{font-family:"Bebas Neue",sans-serif;font-size:64px !important;line-height:.85;letter-spacing:.04em;color:#F1ECE1}',
    'html body .hg .hg-sub{font-family:"Bebas Neue",sans-serif;font-size:20px !important;line-height:1.1;letter-spacing:.08em;color:#F1ECE1;opacity:.92;border-left:2px solid rgba(241,236,225,.5);padding-left:12px}',
    '.hg-us .hg-big{color:#F6D58E !important}',
    'html body .hg .hg-them .hg-bar{height:165px !important}',
    'html body .hg .hg-them .hg-bar em{font-size:12px !important;line-height:1 !important;letter-spacing:.05em !important}',
    'html body .hg .hg-them .hg-bar i.hg-m em{font-size:13.5px !important}',
    '.hg-bar{display:flex;border-radius:6px}',
    '.hg-them .hg-bar{height:150px;gap:2px}',
    '.hg-them .hg-bar i{flex:1;display:flex;align-items:center;justify-content:center;overflow:hidden;font-style:normal}',
    '.hg-them .hg-bar i:first-child{border-radius:6px 0 0 6px}.hg-them .hg-bar i:last-child{border-radius:0 6px 6px 0}',
    '.hg-them .hg-bar em{font-style:normal;writing-mode:vertical-rl;transform:rotate(180deg);font-size:12.5px;letter-spacing:.06em;color:#EDE6D8;white-space:nowrap}',
    '.hg-them .hg-bar i.hg-m{margin:-16px 0;border-radius:5px;background:linear-gradient(180deg,#F6D58E,#D4A24A 30%,#c9973c);box-shadow:0 0 16px rgba(246,213,142,.75),0 0 2px #fff;position:relative;z-index:2}',
    '.hg-them .hg-bar i.hg-m em{color:#111;font-size:14px;font-weight:600;letter-spacing:.1em}',
    '.hg-us .hg-bar{height:50px;align-items:center;justify-content:center;font-family:"Bebas Neue",sans-serif;font-size:19px;letter-spacing:.08em;color:#111;background:linear-gradient(100deg,#b8862f 0%,#E8B860 30%,#F6D58E 48%,#E8B860 62%,#c9973c 100%);box-shadow:0 0 18px rgba(212,162,74,.35)}',
    '.hg-hint{font-family:"Bebas Neue",sans-serif;letter-spacing:.2em;font-size:15px;color:#F6D58E;text-align:center;margin:0 0 2px}',
    '.hg-hint b{display:inline-block;font-weight:400;animation:rcxSwArr 1.8s ease-in-out infinite}',
    'html body .hg .hg-rail{display:flex !important;overflow-x:auto !important;overflow-y:hidden !important;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;gap:6px;align-items:center;height:230px;margin:0 -16px;padding-top:26px !important;padding:0 calc(50% - 32px) !important}',
    '.hg-rail::-webkit-scrollbar{display:none}',
    'html body .hg .hg-ing{flex:0 0 64px !important;width:64px !important;height:150px;border-radius:8px;display:flex;align-items:center;justify-content:center;scroll-snap-align:center;transform-origin:50% 50%;transition:transform .12s linear,opacity .12s linear;font-style:normal}',
    'html body .hg .hg-ing em{font-style:normal;writing-mode:vertical-rl;transform:rotate(180deg);font-family:"Bebas Neue",sans-serif;font-size:20px !important;letter-spacing:.08em;color:#F1ECE1;white-space:nowrap;line-height:1 !important}',
    'html body .hg .hg-ing.hg-m{background:linear-gradient(180deg,#F6D58E,#D4A24A 30%,#c9973c);box-shadow:0 0 18px rgba(246,213,142,.8),0 0 2px #fff}',
    'html body .hg .hg-ing.hg-m em{color:#111}',
    'html body .hg .rcx-swipe-tag{display:none !important}',
    '@media (min-width:768px){html body .hg.hg-desk{display:block !important;width:calc(100% - 40px) !important;margin:26px auto 0 !important}html body .hg.hg-desk>*{width:100% !important;max-width:none !important}html body .hg.hg-desk .hg-tiles{grid-template-columns:repeat(4,1fr) !important;gap:14px !important}html body .hg.hg-desk .hg-b2{padding:26px 28px 24px}html body .hg.hg-desk .hg-q{font-size:34px !important}html body .hg.hg-desk .hg-t{padding:18px 12px}html body .hg.hg-desk .hg-flow{font-size:22px}}',
    'html body [data-m="rl-list"] .rcx-row:nth-child(1) a.rcx-logo{animation:rcxBeckon 6s ease-in-out 1.5s infinite}',
    'html body [data-m="rl-list"] .rcx-row:nth-child(2) a.rcx-logo{animation:rcxBeckon 6s ease-in-out 3.5s infinite}',
    'html body [data-m="rl-list"] .rcx-row:nth-child(3) a.rcx-logo{animation:rcxBeckon 6s ease-in-out 5.5s infinite}',
    'html body [data-m="rl-list"] a.rcx-logo:hover{animation-play-state:paused;transform:scale(1.08);box-shadow:0 0 0 2px #F6D58E,0 0 22px rgba(246,213,142,.75)}',
    '@keyframes rcxBeckon{0%,30%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(246,213,142,0)}10%{transform:scale(1.09);box-shadow:0 0 0 2px #F6D58E,0 0 24px rgba(246,213,142,.85)}20%{transform:scale(1);box-shadow:0 0 0 1px rgba(246,213,142,.4),0 0 10px rgba(246,213,142,.3)}}',
    'html body .hg-shop{font-family:"Bebas Neue",sans-serif;letter-spacing:.16em;font-size:20px;color:#F6D58E;text-align:center;margin:2px 0 10px;text-shadow:0 0 8px rgba(246,213,142,.55),0 1px 3px #000;width:100%}',
    'html body .hg-shop span{color:#F1ECE1;margin:0 4px}html body .hg-shop b{display:inline-block;font-weight:400;animation:rcxSwArr 1.8s ease-in-out infinite}',
    '@media (max-width:767px){html body .hg{margin-top:9px !important}}',   // Oct 23 (Scott): the casino stays put, leaving black under the buttons
    'html body .hg .hg-slot{display:block;width:100%;height:1750px;border:0;margin:0 0 16px;background:transparent;overflow:hidden}',
    '.hg-marq{position:relative;margin:4px auto 2px;padding:9px 10px 7px;border-radius:10px;background:#1a0606;text-align:center;font-family:"Bebas Neue",sans-serif;letter-spacing:.1em;font-size:19px;white-space:nowrap;color:#F6D58E;text-shadow:0 0 8px rgba(246,213,142,.8);border:2px solid #D4A24A}',
    '.hg-marq:before{content:"";position:absolute;inset:-6px;border-radius:13px;background:radial-gradient(circle,#FFE7A8 0 2.2px,transparent 2.6px) 0 0/14px 14px;-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;padding:4px;animation:hgBulb 0.9s steps(2) infinite;pointer-events:none}',
    '@keyframes hgBulb{0%{opacity:1}50%{opacity:.35}}',
    '.hg-wheel{position:relative}',
    '.hg-wheel:before{content:"";position:absolute;left:50%;top:2px;transform:translateX(-50%);border:11px solid transparent;border-top:15px solid #F6D58E;filter:drop-shadow(0 0 6px rgba(246,213,142,.9));z-index:5;pointer-events:none}',
    '.hg-spinrow{display:flex;flex-direction:column;align-items:center;gap:6px;margin:2px 0 4px}',
    'html body .hg .hg-spin{font-family:"Bebas Neue",sans-serif;letter-spacing:.14em;font-size:20px !important;color:#1a0606;background:linear-gradient(180deg,#F6D58E,#D4A24A 55%,#b8862f);border:2px solid #FFE7A8;border-radius:999px;padding:9px 26px 7px;box-shadow:0 4px 0 #7a5418,0 0 16px rgba(246,213,142,.55);cursor:pointer}',
    'html body .hg .hg-spin:active{transform:translateY(3px);box-shadow:0 1px 0 #7a5418}',
    'html body .hg .hg-spin[disabled]{opacity:.7}',
    'html body .hg .hg-res{font-family:"Bebas Neue",sans-serif;letter-spacing:.08em;font-size:17px !important;color:#F1ECE1;text-align:center;min-height:20px}',
    'html body .hg .hg-res.win{color:#F6D58E;text-shadow:0 0 10px rgba(246,213,142,.9)}',

    '@media (max-width:767px){html body .home-bgwrap .mx-group .mx-sec:not([data-m="mx-mags"]) .mx-title{display:grid !important;grid-template-columns:auto 1fr;column-gap:0;row-gap:0;align-items:stretch;justify-items:stretch;text-align:center !important;width:100%;max-width:100%;box-sizing:border-box;margin:0 auto 16px !important;border:2px solid #D4A24A;border-radius:14px;background:rgba(0,0,0,.45);overflow:hidden}',
    'html body .home-bgwrap .mx-group .mx-sec:not([data-m="mx-mags"]) .mx-title>a.mx-ic-link{grid-row:1 / span 2;grid-column:1;margin:0 !important;width:auto !important;display:flex !important;align-items:center;border-right:2px solid #D4A24A}',
    'html body .home-bgwrap .mx-group .mx-sec:not([data-m="mx-mags"]) .mx-title>a.mx-ic-link>img{height:52px !important;padding:16px 18px !important;border:0 !important;border-radius:0 !important;background:transparent !important;box-shadow:none !important}',
    'html body .home-bgwrap .mx-group .mx-sec:not([data-m="mx-mags"]) .mx-title h2{grid-column:2;align-self:end;font-size:clamp(22px,6.6vw,29px) !important;letter-spacing:.06em !important;text-align:center !important;line-height:1.05;margin:0 !important;padding:12px 10px 2px !important}',
    'html body .home-bgwrap .mx-group .mx-sec:not([data-m="mx-mags"]) .mx-title p{grid-column:2;align-self:start;font-size:clamp(16px,4.7vw,20px) !important;line-height:1.2 !important;text-wrap:balance;text-align:center !important;margin:0 !important;padding:0 10px 12px !important}}',
    '@media (max-width:767px){html body .home-bgwrap>.mx-group.mx-group.mx-group.mx-group{background:linear-gradient(#000 0,#000 var(--hgfade,560px),rgba(0,0,0,.6) calc(var(--hgfade,560px) + 170px),rgba(0,0,0,.66) calc(100% - 24px),#000 100%),url("assets/photo/home-bg-coast-dusk.jpg") center / cover no-repeat #000 !important}}',   // Oct 27 (Scott): the magazines and Meet the three sit on pure black; the ocean fades up just under the Life / Proof switch of Lion's Mane
    'html body .hg-press{padding-bottom:2px !important}html body .hg-meet{padding-top:6px !important}',   // Oct 27 (Scott): remove the space under IN THE MAGAZINES and above MEET THE THREE
    'html body section.mx-sec[data-m="mx-mags"]{padding-top:2px !important;padding-bottom:0 !important}',
    '/* Oct 28 (Scott): the whole home page is plain black for now, no beach photo, no red glow */html body .home-bgwrap.home-bgwrap.home-bgwrap,html body .home-bgwrap>.mx-group.mx-group.mx-group.mx-group.mx-group{background:#000 !important;background-image:none !important}html body .home-bgwrap.home-bgwrap::before,html body .home-bgwrap.home-bgwrap::after,html body .home-bgwrap>.mx-group>div[style*=\"z-index:-1\"]{background:none !important;background-image:none !important;display:none !important}',
    'html body .home-bgwrap>section[data-m=\"mx-rit\"][data-m=\"mx-rit\"][data-m=\"mx-rit\"]{background:#000 !important;background-image:none !important}html body .home-bgwrap>section[data-m=\"mx-rit\"]::before,html body .home-bgwrap>section[data-m=\"mx-rit\"]::after{background:none !important;background-image:none !important}',
    'html body .home-bgwrap>section[data-m=\"mx-rit\"][data-m=\"mx-rit\"][data-m=\"mx-rit\"]{padding-top:0 !important}html body .home-bgwrap>section[data-m=\"mx-rit\"][data-m=\"mx-rit\"][data-m=\"mx-rit\"]>div:first-child{background-image:none !important;background:none !important}',
    'html body .hg-press,html body .hg-meet{position:relative;z-index:1}',
    'html body .hg .hg-title,html body .hg-press,html body .hg-meet{font-family:"Bebas Neue",sans-serif;color:#D4A24A;font-size:34px;letter-spacing:.06em;line-height:1.02;text-transform:uppercase;text-align:center;white-space:nowrap;margin:0;padding:19px 0 17px;overflow:visible}',   // Oct 27 (Scott): same look as the "Three nutrient rich / functional mushroom extracts" heading, one line, above the slot machines
    '.hg-cap{margin:8px 0 0;font-size:17px;color:#F1ECE1;line-height:1.35;text-align:left}',
    '.hg-them .hg-cap{margin-top:8px}',
    '.hg-cap b{color:#D4A24A;font-weight:500}',
    '.hg-tiles{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}',
    '.hg-t{border:1.5px solid rgba(212,162,74,.65);border-radius:12px;padding:12px 8px;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center}',
    '.hg-t:nth-child(1){background:rgba(20,60,36,.66)}.hg-t:nth-child(2){background:rgba(14,52,60,.62)}.hg-t:nth-child(3){background:rgba(70,48,14,.62)}.hg-t:nth-child(4){background:rgba(64,20,26,.6)}',
    '.hg-ic{height:46px;display:flex;align-items:center;justify-content:center;gap:4px;margin-bottom:6px}',
    '.hg-ic img{height:44px;width:auto}.hg-ic.hg-sp img{height:40px}',
    '.hg-tt{font-family:"Bebas Neue",sans-serif;font-size:19px;letter-spacing:.05em;color:#F1ECE1;line-height:1.05}',
    '.hg-ts{font-size:14px;color:#EFE8D8;line-height:1.3;margin-top:4px}',
    '.hg-flow{margin-top:14px;display:flex;justify-content:center;align-items:center;gap:4px;font-family:"Bebas Neue",sans-serif;letter-spacing:.07em;font-size:17px;color:#111;white-space:nowrap}',
    '.hg-flow span{background:#D4A24A;border-radius:6px;padding:6px 7px 4px}.hg-flow b{color:#D4A24A;font-weight:400;font-size:22px}',
    'html body .hg .hg-q{white-space:nowrap !important;text-wrap:nowrap !important;max-width:none !important;width:100% !important}',
    'html body .hg .hg-cap{font-size:17px !important;line-height:1.35 !important;max-width:none !important}',
    'html body .hg .hg-ts{font-size:14px !important;line-height:1.3 !important}',
    'html body .hg .hg-end{font-size:22px !important;line-height:1.25 !important;white-space:normal !important;text-wrap:balance;padding:0 6px}',
    '.hg [data-hg-go]{cursor:pointer;transition:transform .15s,box-shadow .15s}.hg [data-hg-go]:active{transform:scale(.97)}@media (hover:hover){.hg [data-hg-go]:hover{box-shadow:0 0 0 2px #D4A24A,0 0 18px rgba(212,162,74,.45)}}',
    '.hg-end{margin-top:14px;text-align:center;color:#F1ECE1;font-family:"Playfair Display",serif;font-style:italic;font-size:17px;line-height:1.35}',
    'html body .hg-two{margin-top:0 !important;padding-top:8px !important}',
    'html body .hg-two .hg-box{margin-bottom:0}',
    'html body .hg:not(.hg-two){margin-top:0 !important;padding-top:0 !important}'
  ].join('\n');
  document.head.appendChild(css);

  function html() {
    var segs = ING.map(function (x) { return x[1] ? '<i class="hg-ing" style="background:' + x[1] + '"><em>' + x[0] + '</em></i>' : '<i class="hg-ing hg-m"><em>' + x[0] + '</em></i>'; }).join('');
    var qr = '<svg viewBox="-1 -1 27 27" width="52" height="52" aria-hidden="true"><rect x="-1" y="-1" width="27" height="27" rx="2" fill="#000"/><g fill="#D4A24A"><path d="M0 0h7v1h-7zM8 0h2v1h-2zM11 0h1v1h-1zM13 0h2v1h-2zM16 0h1v1h-1zM18 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM8 1h4v1h-4zM13 1h2v1h-2zM18 1h1v1h-1zM24 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM9 2h1v1h-1zM11 2h1v1h-1zM13 2h4v1h-4zM18 2h1v1h-1zM20 2h3v1h-3zM24 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM9 3h1v1h-1zM12 3h1v1h-1zM14 3h3v1h-3zM18 3h1v1h-1zM20 3h3v1h-3zM24 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM9 4h2v1h-2zM12 4h2v1h-2zM16 4h1v1h-1zM18 4h1v1h-1zM20 4h3v1h-3zM24 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM12 5h1v1h-1zM14 5h2v1h-2zM18 5h1v1h-1zM24 5h1v1h-1zM0 6h7v1h-7zM8 6h3v1h-3zM15 6h1v1h-1zM18 6h7v1h-7zM10 7h1v1h-1zM13 7h1v1h-1zM15 7h1v1h-1zM3 8h2v1h-2zM6 8h5v1h-5zM12 8h3v1h-3zM16 8h2v1h-2zM22 8h3v1h-3zM2 9h5v1h-5zM8 9h4v1h-4zM18 9h1v1h-1zM23 9h2v1h-2zM0 10h1v1h-1zM2 10h11v1h-11zM15 10h5v1h-5zM22 10h3v1h-3zM0 11h3v1h-3zM4 11h2v1h-2zM8 11h1v1h-1zM10 11h1v1h-1zM15 11h3v1h-3zM21 11h2v1h-2zM4 12h1v1h-1zM6 12h5v1h-5zM13 12h1v1h-1zM17 12h5v1h-5zM0 13h1v1h-1zM3 13h1v1h-1zM8 13h2v1h-2zM11 13h1v1h-1zM14 13h2v1h-2zM18 13h3v1h-3zM23 13h1v1h-1zM2 14h1v1h-1zM4 14h2v1h-2zM10 14h1v1h-1zM13 14h4v1h-4zM18 14h3v1h-3zM22 14h2v1h-2zM1 15h1v1h-1zM6 15h4v1h-4zM11 15h2v1h-2zM15 15h1v1h-1zM19 15h1v1h-1zM21 15h2v1h-2zM3 16h1v1h-1zM8 16h1v1h-1zM10 16h1v1h-1zM15 16h6v1h-6zM24 16h1v1h-1zM8 17h5v1h-5zM16 17h1v1h-1zM20 17h2v1h-2zM24 17h1v1h-1zM0 18h7v1h-7zM10 18h1v1h-1zM12 18h2v1h-2zM16 18h1v1h-1zM18 18h1v1h-1zM20 18h3v1h-3zM24 18h1v1h-1zM0 19h1v1h-1zM6 19h1v1h-1zM8 19h2v1h-2zM11 19h1v1h-1zM13 19h4v1h-4zM20 19h1v1h-1zM23 19h1v1h-1zM0 20h1v1h-1zM2 20h3v1h-3zM6 20h1v1h-1zM10 20h3v1h-3zM14 20h8v1h-8zM24 20h1v1h-1zM0 21h1v1h-1zM2 21h3v1h-3zM6 21h1v1h-1zM8 21h1v1h-1zM12 21h2v1h-2zM15 21h2v1h-2zM20 21h1v1h-1zM22 21h1v1h-1zM24 21h1v1h-1zM0 22h1v1h-1zM2 22h3v1h-3zM6 22h1v1h-1zM8 22h1v1h-1zM11 22h2v1h-2zM14 22h7v1h-7zM22 22h1v1h-1zM24 22h1v1h-1zM0 23h1v1h-1zM6 23h1v1h-1zM8 23h4v1h-4zM14 23h2v1h-2zM17 23h1v1h-1zM19 23h2v1h-2zM22 23h1v1h-1zM0 24h7v1h-7zM9 24h1v1h-1zM13 24h5v1h-5zM19 24h3v1h-3z"/></g></svg>';
    return '<div class="hg-title"><span>WHY WE\u2019RE DIFFERENT</span></div>' +
      '<iframe class="hg-slot" src="find-the-mushroom.html?embed=1&s=5" title="Find the mushroom: a slot machine game" scrolling="no" loading="lazy"></iframe>' +
      '<div class="hg-box hg-b2"><div class="hg-q" role="heading" aria-level="2">UNCOMPROMISING, BY DESIGN</div><div class="hg-tiles">' +
      '<div class="hg-t" role="link" tabindex="0" data-hg-go="shop|shop-research"><div class="hg-ic hg-sp"><img src="assets/icons/species/rcx-sym-lions-mane-gold.svg" alt=""><img src="assets/icons/species/rcx-sym-cordyceps-gold.svg" alt=""><img src="assets/icons/species/rcx-sym-turkey-tail-gold.svg" alt=""></div><div class="hg-tt">Backed by published research</div><div class="hg-ts">Three organic mushrooms.<br>Nature’s raw harvest.</div></div>' +
      '<div class="hg-t" role="link" tabindex="0" data-hg-go="home|packet"><div class="hg-ic"><img src="assets/icons/extracted.svg" alt=""></div><div class="hg-tt">Scientifically extracted</div><div class="hg-ts">Unlocked so your body can actually absorb it.</div></div>' +
      '<div class="hg-t" role="link" tabindex="0" data-hg-go="how|"><div class="hg-ic"><img src="assets/icons/single-ingredient.svg" alt=""></div><div class="hg-tt">Measured so you don’t have to</div><div class="hg-ts">One clean, single ingredient packet.</div></div>' +
      '<div class="hg-t" role="link" tabindex="0" data-hg-go="receipts|"><div class="hg-ic">' + qr + '</div><div class="hg-tt">Scan the lab report</div><div class="hg-ts">Scan the QR for the independent lab report.</div></div>' +
      '</div><div class="hg-flow"><span>TEAR</span><b>›</b><span>POUR</span><b>›</b><span>BUILD YOUR HONEST BLEND</span></div>' +
      '<div class="hg-end">Prescription free. Sugar free. Guilt free.</div></div>';
  }
  function rail() {   // the box in the middle is the big one
    var r = g && g.querySelector('.hg-rail'); if (!r) return;
    [].forEach.call(g.querySelectorAll('.rcx-swipe-tag'), function (t) { t.remove(); });   // our own hint says it; no second label
    if (!r.__hg) { r.__hg = 1; r.addEventListener('scroll', function () { if (!r.__raf) r.__raf = requestAnimationFrame(function () { r.__raf = 0; scale(r); }); }, { passive: true }); }
    var btn = g.querySelector('.hg-spin'); if (btn && !btn.__hg) { btn.__hg = 1; btn.addEventListener('click', function () { spin(r, btn); }); }
    scale(r);
  }
  function spin(r, btn) {
    var res = g.querySelector('.hg-res'), items = [].slice.call(r.children);
    var pos = function (i) { var k = items[i]; return k.offsetLeft + k.offsetWidth / 2 - r.clientWidth / 2; };
    var target = Math.floor(Math.random() * items.length), max = r.scrollWidth - r.clientWidth;
    var from = r.scrollLeft, to = Math.max(0, Math.min(max, pos(target)));
    // a few passes back and forth across the row, then settle on the target
    var legs = [from, max, 0, max, to], L = 0, segs = [];
    for (var n = 1; n < legs.length; n++) { var len = Math.abs(legs[n] - legs[n - 1]); segs.push([legs[n - 1], legs[n], L, len]); L += len; }
    r.__rcxTouched = 1; btn.disabled = true; res.classList.remove('win'); res.textContent = 'SPINNING...';
    r.style.scrollSnapType = 'none'; r.style.scrollBehavior = 'auto';
    var t0 = performance.now(), dur = 3200;
    (function step(now) {
      var p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3), s = e * L, x = to;
      for (var q = 0; q < segs.length; q++) { var sg = segs[q]; if (s <= sg[2] + sg[3] || q === segs.length - 1) { var f = sg[3] ? (s - sg[2]) / sg[3] : 1; x = sg[0] + (sg[1] - sg[0]) * Math.min(1, f); break; } }
      r.scrollLeft = x; scale(r);
      if (p < 1) requestAnimationFrame(step);
      else {
        r.style.removeProperty('scroll-snap-type'); r.style.removeProperty('scroll-behavior'); btn.disabled = false;
        var name = items[target].textContent;
        if (items[target].classList.contains('hg-m')) { res.classList.add('win'); res.textContent = 'JACKPOT! YOU HIT THE MUSHROOM. 1 IN 15.'; }
        else res.textContent = 'YOU GOT ' + name + '. SPIN AGAIN?';
      }
    })(t0);
  }
  function scale(r) {
    var c = r.getBoundingClientRect(), mid = c.left + c.width / 2;
    [].forEach.call(r.children, function (k) {
      var b = k.getBoundingClientRect(), dx = (b.left + b.width / 2 - mid) / 70, d = Math.abs(dx), t = Math.max(0, 1 - d), dd = Math.min(d, 3.2);
      k.style.transform = 'translateY(' + (dd * dd * 7).toFixed(1) + 'px) rotate(' + Math.max(-38, Math.min(38, dx * 11)).toFixed(1) + 'deg) scale(' + (0.86 + 0.34 * t).toFixed(3) + ')';
      k.style.opacity = (0.55 + 0.45 * t).toFixed(2);
      k.style.zIndex = t > 0.5 ? 2 : 1;
    });
  }
  function vis(e) { return e && e.offsetHeight > 0; }
  function anchor() {   // the bordered box holding the brand paragraph
    var p = [].filter.call(document.querySelectorAll('.sq-para'), function (e) { return e.offsetParent !== null || e.__hgHid; })[0];
    if (!p) return null;
    for (var x = p; x && x !== document.body; x = x.parentElement) { var cs = getComputedStyle(x); if (parseFloat(cs.borderTopWidth) >= 1.5 && x.offsetWidth > 280) return x; }
    return null;
  }
  var g = null, g2 = null, hidden = null;
  function fitTitle() {   // Oct 27 (Scott): bigger, fills the line; the press heading copies its size
    var t = document.querySelector('.hg .hg-title'); if (!t || !t.offsetWidth) return;
    t.style.setProperty('font-size', '40px', 'important');
    var w = t.clientWidth, need = t.firstChild.getBoundingClientRect().width;
    if (need > 0) t.style.setProperty('font-size', Math.max(24, Math.min(64, Math.floor(40 * w / need * 0.84))) + 'px', 'important');
    [].forEach.call(document.querySelectorAll('.hg-press,.hg-meet'), function (p) {
    if (p && p.offsetWidth) {
      p.style.setProperty('font-size', t.style.getPropertyValue('font-size'), 'important');
      var pw = p.clientWidth, pn = p.firstChild.getBoundingClientRect().width;
      if (pn > pw) p.style.setProperty('font-size', Math.floor(parseFloat(t.style.getPropertyValue('font-size')) * pw / pn * 0.98) + 'px', 'important');
    }
    });
  }
  function placeMeet() {   // Oct 27 (Scott): a gold line that introduces the three mushrooms underneath it
    var m = [].filter.call(document.querySelectorAll('[data-m="mx-lm"]'), function (e) { return e.offsetHeight > 0 && e.parentNode.classList.contains('mx-group'); })[0];
    if (!m) return;
    var pv = m.previousElementSibling; if (pv && pv.classList.contains('hg-meet')) return;
    [].forEach.call(document.querySelectorAll('.hg-meet'), function (o) { o.remove(); });
    var d = document.createElement('div'); d.className = 'hg-meet'; d.setAttribute('data-noswipe', '1');
    d.innerHTML = '<span>MEET THE THREE</span>';
    m.parentNode.insertBefore(d, m);
  }
  function setFade() {   // distance from the top of the group to just under the Lion's Mane Life / Proof switch
    var g = document.querySelector('.home-bgwrap>.mx-group'); if (!g || !g.offsetHeight) return;
    var t = g.querySelector('[data-m="mx-lm"] .mx-tabs'); if (!t || !t.offsetHeight) return;
    var y = Math.round(t.getBoundingClientRect().bottom - g.getBoundingClientRect().top) + 6;
    if (g.__fy !== y) { g.__fy = y; g.style.setProperty('--hgfade', y + 'px'); }
  }
  function placePress() {   // Oct 27 (Scott): a gold line above the magazines
    var m = [].filter.call(document.querySelectorAll('[data-m="mx-mags"]'), function (e) { return e.offsetHeight > 0; })[0];
    if (!m || !m.parentNode) return;
    var pv = m.previousElementSibling; if (pv && pv.classList.contains('hg-press')) return;
    [].forEach.call(document.querySelectorAll('.hg-press'), function (o) { o.remove(); });
    var d = document.createElement('div'); d.className = 'hg-press'; d.setAttribute('data-noswipe', '1');
    d.innerHTML = '<span>IN THE MAGAZINES</span>';
    m.parentNode.insertBefore(d, m);
  }
  function fit() {
    fitTitle();   // both headings on one line, the same size
    if (!g) return;
    var hs = [].slice.call(document.querySelectorAll('.hg .hg-q')), m = 30;
    hs.forEach(function (h) { h.style.setProperty('font-size', '30px', 'important'); });
    hs.forEach(function (h) { var w = h.clientWidth; if (h.scrollWidth > w && w > 0) m = Math.min(m, Math.floor(30 * w / h.scrollWidth * 0.98)); });
    hs.forEach(function (h) { h.style.setProperty('font-size', m + 'px', 'important'); });
  }
  function rlWrap() {   // the row of three mushrooms with the white buttons, as it sits next to us
    var rl = [].filter.call(document.querySelectorAll('[data-m="rl-list"]'), function (e) { return e.offsetHeight > 0; })[0];
    for (var x = rl; x && g && x !== document.body; x = x.parentNode) if (x.parentNode === g.parentNode) return x;
    return null;
  }
  function noShopTag() { [].forEach.call(document.querySelectorAll('.hg-shop'), function (o) { o.remove(); }); }   // Oct 23 (Scott): no "shop now" wording; the icons invite the click instead
  function shopTag() {   // Oct 22 (Scott): tell people the mushroom buttons are where you buy
    var rl = [].filter.call(document.querySelectorAll('[data-m="rl-list"]'), function (e) { return e.offsetHeight > 0; })[0];
    if (!rl || (rl.previousElementSibling && rl.previousElementSibling.classList.contains('hg-shop'))) return;
    [].forEach.call(document.querySelectorAll('.hg-shop'), function (o) { o.remove(); });
    var t = document.createElement('div'); t.className = 'hg-shop'; t.innerHTML = 'SHOP NOW <span>\u00B7</span> CLICK A MUSHROOM <b>\u203A</b>';
    rl.parentNode.insertBefore(t, rl);
  }
  function place() {   // order: the three white mushroom buttons, the green box (Oct 27, Scott), then the slot machines
    var w = g && rlWrap(); if (!w) return;
    var p = w.parentNode;
    if (g2 && g2.previousElementSibling !== w) p.insertBefore(g2, w.nextSibling);
    var t = g2 || w; if (g.previousElementSibling !== t) p.insertBefore(g, t.nextSibling);
  }

  function run() {
    placePress(); placeMeet(); setFade();
    var phone = innerWidth < 768;   // Oct 22 (Scott): desktop gets the same new top as phone
    if (g && g.__phone !== undefined && g.__phone !== phone) { g.remove(); g = null; }
    if (g && g.isConnected && hidden && hidden.isConnected && hidden.style.getPropertyValue('display') === 'none') { place(); noShopTag(); fit(); rail(); return; }
    var a = hidden && hidden.isConnected ? hidden : anchor(); if (!a) return;
    if (!g || !g.isConnected) {
      [].forEach.call(document.querySelectorAll('.hg'), function (o) { o.remove(); });
      g = document.createElement('div'); g.className = 'hg' + (phone ? '' : ' hg-desk'); g.__phone = phone; g.setAttribute('data-noswipe', '1'); g.innerHTML = phone ? html() : html().replace('embed=1', 'embed=1&wide=1');
      [].forEach.call(g.querySelectorAll('div'), function (d) { d.setAttribute('data-noswipe', '1'); });
      var cs = getComputedStyle(a); g.style.maxWidth = (phone ? a.offsetWidth : 1300) + 'px'; g.style.marginLeft = cs.marginLeft === '0px' ? 'auto' : cs.marginLeft; g.style.marginRight = g.style.marginLeft === 'auto' ? 'auto' : cs.marginRight;
      a.parentNode.insertBefore(g, a.nextSibling);
      // Oct 27 (Scott): the green "Uncompromising, by design" box lives right under the three packets (see place2)
      var b2 = g.querySelector('.hg-b2');
      g2 = document.createElement('div'); g2.className = 'hg hg-two' + (phone ? '' : ' hg-desk'); g2.setAttribute('data-noswipe', '1'); g2.__phone = phone; g2.style.maxWidth = g.style.maxWidth;
      if (b2) g2.appendChild(b2);
      [].forEach.call(g2.querySelectorAll('div'), function (d) { d.setAttribute('data-noswipe', '1'); });
      place();
      new MutationObserver(function () { [].forEach.call(g.querySelectorAll('.rcx-swipe-tag'), function (t) { t.remove(); }); }).observe(g, { childList: true, subtree: true });
    }
    a.style.setProperty('display', 'none', 'important'); hidden = a;
    noShopTag(); fit(); rail();
  }

  /* Oct 23 (Scott): each of the four squares takes you to its place on the site */
  function hgGo(t) {
    var v = (t.getAttribute('data-hg-go') || '').split('|'), pgn = v[0], at = v[1];
    var sel = at === 'packet' ? '#packet p' : at ? '[data-m="' + at + '"]' : '';
    if (pgn !== 'home') { var l = document.querySelector('[data-page="' + pgn + '"]'); if (l) l.click(); }
    if (!sel) return;
    var yOf = function (e) { return e.getBoundingClientRect().top + scrollY - 80; };
    var n = 0, iv = setInterval(function () {
      var e = document.querySelector(sel);
      if (e && e.offsetHeight) {
        clearInterval(iv); scrollTo(0, yOf(e));
        // photos and rows above it keep loading and push it down; follow it for a moment so it lands right
        var k = 0, fix = setInterval(function () { var d = yOf(e) - scrollY; if (Math.abs(d) > 4) scrollTo(0, yOf(e)); if (++k > 12) clearInterval(fix); }, 150);
        var stop = function () { clearInterval(fix); removeEventListener('touchstart', stop); removeEventListener('wheel', stop); };
        addEventListener('touchstart', stop, { passive: true }); addEventListener('wheel', stop, { passive: true });
      } else if (++n > 40) clearInterval(iv);
    }, pgn === 'home' ? 10 : 150);
  }
  document.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('.hg [data-hg-go]'); if (t) { e.preventDefault(); hgGo(t); } });
  document.addEventListener('keydown', function (e) { if (e.key !== 'Enter' && e.key !== ' ') return; var t = e.target.closest && e.target.closest('.hg [data-hg-go]'); if (t) { e.preventDefault(); hgGo(t); } });
  addEventListener('message', function (e) { if (e.data && e.data.fmHeight && g) { var f = g.querySelector('.hg-slot'); if (f && e.source === f.contentWindow) f.style.height = e.data.fmHeight + 'px'; } });
  addEventListener('resize', function () { run(); fit(); });
  setInterval(run, 1000); run();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
