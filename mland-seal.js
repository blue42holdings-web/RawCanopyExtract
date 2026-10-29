/* Oct 28 (Scott): the small seal at the top of the phone landing still spins its middle hexagon when tapped (same build as the big seal). */
(function () {
  var SRC = 'assets/seal-single-ingredient-organic.svg', txt = null;
  function monoOf(svg) { var k = [].filter.call(svg.children, function (e) { return e.tagName.toLowerCase() !== 'defs'; }); return k[k.length - 1]; }
  function mk() { var d = document.createElement('div'); d.innerHTML = txt; return d.firstElementChild; }
  function layer(el) { var d = document.createElement('div'); d.style.cssText = 'position:absolute;inset:0;backface-visibility:hidden'; d.appendChild(el); return d; }
  function build(n) {
    if (n.__spin || !txt) return; n.__spin = 1;
    var ring = mk(), mono = mk(), back = mk();
    monoOf(ring).remove();
    [mono, back].forEach(function (s) { var keep = monoOf(s); [].slice.call(s.children).forEach(function (e) { if (e !== keep && e.tagName.toLowerCase() !== 'defs') e.remove(); }); });
    [ring, mono, back].forEach(function (s) { s.removeAttribute('width'); s.removeAttribute('height'); s.style.cssText = 'width:100%;height:100%;display:block'; });
    n.innerHTML = ''; n.style.cursor = 'pointer'; n.setAttribute('role', 'button'); n.setAttribute('aria-label', 'Raw Canopy Extract seal, spin the monogram');
    var wrap = document.createElement('div'); wrap.style.cssText = 'position:absolute;inset:0;transform:scale(1.14)';
    var stage = document.createElement('div'); stage.style.cssText = 'position:absolute;inset:0;perspective:600px';
    var sp = document.createElement('div'); sp.style.cssText = 'position:absolute;inset:0;transform-style:preserve-3d;transition:transform 3s cubic-bezier(.16,.84,.28,1)';
    var f = layer(mono), b = layer(back); b.style.transform = 'rotateY(180deg)';
    sp.appendChild(f); sp.appendChild(b); stage.appendChild(sp);
    wrap.appendChild(layer(ring)); wrap.appendChild(stage); n.appendChild(wrap);
    var turns = 0, busy = false;
    function spin() { if (busy) return; busy = true; turns++; sp.style.transform = 'rotateY(' + (turns * 360) + 'deg)'; setTimeout(function () { busy = false; }, 3100); }
    n.addEventListener('click', function (e) { e.stopPropagation(); spin(); });
  }
  function run() { [].forEach.call(document.querySelectorAll('.mland-seal'), build); }
  fetch(SRC).then(function (r) { return r.text(); }).then(function (t) { txt = t; run(); setInterval(run, 800); }).catch(function () {});
})();
