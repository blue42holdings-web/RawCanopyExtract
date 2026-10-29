/* Oct 28 (Scott), second pass: each mushroom page is the history and folklore, then four boxes of evidence that each open the real study,
   then how it's made, then a shop button. No magazines (front page only). The old "What's been studied" box is gone. */
(function () {
  var PM = function (t) { return 'https://pubmed.ncbi.nlm.nih.gov/?term=' + t; };
  var DATA = {
    "Lion's Mane": { name: "LION'S MANE", cards: [
      { img: 'lm-skagit-valley.jpg', h: 'HISTORY AND FOLKLORE', hist: ["Lion's mane has been gathered and prepared in East Asia for centuries, in kitchens as much as anywhere else, and it is one of the few mushrooms people recognize on sight without being told.", "It is named for the yamabushi, mountain monks whose robes carried tufted pom-poms. It is also called monkey head and bearded tooth, and every name is about the spines. Erinaceus is Latin for hedgehog.", "In traditional herbal practice it is counted among the adaptogens, the plants and mushrooms people have long turned to for steady, everyday balance, and for the days when brain fog sets in."] },
      { img: 'lm-kickoff-fishing-sunset.jpg', h: '16 WEEK HUMAN TRIAL', big: '16 WEEKS', t: 'Thirty adults aged 50 to 80 took lion’s mane daily. Scores kept climbing through sixteen weeks of daily use.', s: 'Phytotherapy Research, 2009', u: 'https://pubmed.ncbi.nlm.nih.gov/18844328/', b: 'READ THE STUDY' },
      { img: 'lm-grandpa-reading.jpg', h: 'HEALTHY ADULTS, EVERY DAY', big: 'PLACEBO', t: 'Healthy adults scored on cognitive tests against a placebo group.', s: 'Biomedical Research, Japan, 2019', u: 'https://www.jstage.jst.go.jp/article/biomedres/40/4/40_125/_article', b: 'READ THE STUDY' },
      { img: 'two-figures-stretching-against-a-sunset-sea.jpg', h: 'SEARCH IT YOURSELF', big: 'PUBMED', t: 'Every published paper on Hericium erinaceus, the species in your packet, from the U.S. National Library of Medicine.', s: 'Searched October 2026', u: PM('%22Hericium+erinaceus%22'), b: 'OPEN THE SEARCH' }
    ] },
    'Cordyceps': { name: 'CORDYCEPS', cards: [
      { img: 'how-forest-trail.webp', h: 'HISTORY AND FOLKLORE', hist: ["Cordyceps is the cultivated relative of the high-altitude Himalayan species that has been collected by hand for generations and priced accordingly. In some circles it is affectionately known as “the hiker’s chewing gum” for its energy producing qualities.", "Cordyceps means club-head, from the Greek and Latin, and militaris means soldierly. In the wild, Cordyceps militaris fruits as small orange clubs, brighter than anything else on a forest floor, across temperate Asia, Europe and North America.", "Herbalists have long grouped cordyceps with the adaptogens, the herbs and mushrooms traditionally taken for stamina and staying power. Ours is grown in trays, not gathered."] },
      { img: 'cd-relay-college.jpg', h: 'MORE OXYGEN, MORE TIME', big: '3 WEEKS', t: 'Recreationally active adults took a mushroom blend with Cordyceps militaris daily. After three weeks, oxygen uptake was up.', s: 'JISSN, 2015', u: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4594151/', b: 'READ THE STUDY' },
      { img: 'cd-stadium-sunset.webp', h: 'TESTED WITH IT AND WITHOUT IT', big: 'CROSSOVER', t: 'The same people, tested twice. Oxygen uptake and reaction time were measured.', s: 'PLOS One, via the National Library of Medicine', u: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0351725', b: 'READ THE STUDY' },
      { img: 'cd-golf-cliff.jpg', h: 'SEARCH IT YOURSELF', big: 'PUBMED', t: 'Every published paper on Cordyceps militaris, the species in your packet, from the U.S. National Library of Medicine.', s: 'Searched October 2026', u: PM('%22Cordyceps+militaris%22'), b: 'OPEN THE SEARCH' }
    ] },
    'Turkey Tail': { name: 'TURKEY TAIL', cards: [
      { img: 'tt-fest-cheer.jpg', h: 'HISTORY AND FOLKLORE', hist: ["In China, turkey tail is Yún zhī, the cloud mushroom, for the way its bands swirl across the cap. In Japan it is Kawaratake. Its use in China is documented back at least two thousand years, and it was written into the Compendium of Materia Medica during the Ming Dynasty.", "It is too tough to eat, so it has always been prepared: simmered, steeped, extracted. The English name is plain description. A banded fan, spread open, really does look like a wild turkey’s tail.", "It grows in overlapping layers on fallen wood in temperate forests. Versicolor means of several colors, and no two fans agree on which."] },
      { img: 'tt-airport-crowd.jpg', h: 'NOBODY KNEW WHO GOT WHAT', big: 'DOUBLE BLIND', t: 'Healthy adults. Immune markers were measured against placebo, and nobody knew who got what.', s: 'International Immunopharmacology', u: 'https://www.sciencedirect.com/science/article/abs/pii/S156757690300290X', b: 'READ THE STUDY' },
      { img: 'tt-concert-blue.jpg', h: 'THE GUT STUDY', big: 'PSP', t: 'How the polysaccharopeptide in turkey tail affects the bacteria that live in the gut, in healthy volunteers.', s: 'Pallav et al., Gut Microbes, 2014', u: 'https://pubmed.ncbi.nlm.nih.gov/25006989/', b: 'READ THE STUDY' },
      { img: 'tt-subway-car.jpg', h: 'SEARCH IT YOURSELF', big: 'PUBMED', t: 'Every published paper on Trametes versicolor, the species in your packet, from the U.S. National Library of Medicine.', s: 'Searched October 2026', u: PM('%22Trametes+versicolor%22+OR+%22Coriolus+versicolor%22'), b: 'OPEN THE SEARCH' }
    ] }
  };
  function esc(x) { return String(x).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function im(c) { return c.img ? '<div class="ml-img" style="background-image:url(assets/photo/' + c.img + ')"></div>' : ''; }
  function card(c) {
    if (c.hist) return '<div class="ml-card ml-hist">' + im(c) + '<h3>' + c.h + '</h3><div class="ml-clip">' + c.hist.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div><button type="button" class="ml-btn ml-more">READ MORE</button></div>';
    return '<div class="ml-card">' + im(c) + '<h3>' + c.h + '</h3><div class="ml-big">' + c.big + '</div><p>' + esc(c.t) + '</p><div class="ml-src">' + esc(c.s) + '</div><a class="ml-btn" target="_blank" rel="noopener" href="' + c.u + '">' + c.b + ' →</a></div>';
  }
  function run() {
    [].forEach.call(document.querySelectorAll('[data-screen-label]'), function (P) {
      var L = P.getAttribute('data-screen-label'), D = DATA[L]; if (!D || !P.offsetHeight) return;
      var num = P.querySelector('section[data-m^="num-"]'); if (!num) return;
      var main = [].filter.call(num.querySelectorAll('.cx-track'), function (t) { return !t.closest('.pr-row'); })[0];
      if (main) {
        [].forEach.call(main.children, function (k) { if (!k.classList.contains('ml-card') && k.getAttribute('data-lean') !== 'x') k.setAttribute('data-lean', 'x'); });
        if (!main.querySelector('.ml-card')) {
          var tmp = document.createElement('div'); tmp.innerHTML = D.cards.map(card).join('');
          [].slice.call(tmp.children).forEach(function (n) { main.appendChild(n); });
          [].forEach.call(main.querySelectorAll('.ml-more'), function (b) { b.addEventListener('click', function () { var c = b.closest('.ml-card'); var o = c.classList.toggle('ml-open'); b.textContent = o ? 'SHOW LESS' : 'READ MORE'; }); });
          main.scrollLeft = 0;
        }
      }
      // magazines and the extras row: front page only
      [].forEach.call(num.querySelectorAll('.pr-row'), function (r) { r.setAttribute('data-lean', 'x'); var s = r.previousElementSibling; if (s && /swipe/i.test(s.innerText || '')) s.setAttribute('data-lean', 'x'); });
      var wrap = P.querySelector(':scope > .ms-wrap');
      if (wrap && !wrap.querySelector('.ml-shop')) {
        var d = document.createElement('div'); d.className = 'ml-shop';
        d.innerHTML = '<button type="button" class="rcx-metal rcx-btn">SHOP ' + D.name + '</button>';
        d.firstChild.addEventListener('click', function (e) { e.preventDefault(); var n = document.querySelector('[data-page="shop"]'); if (n) n.click(); });
        wrap.appendChild(d);
      }
    });
  }
  setInterval(run, 1200); run();
  new MutationObserver(function () { run(); }).observe(document.body, { childList: true, subtree: true });
})();
