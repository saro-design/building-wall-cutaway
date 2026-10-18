/*!
 * Building Cutaway — UI 1.2.0 (Figma V1 design system)
 * Everything the visitor sees on top of the animation: frost hero, chapter captions,
 * layer chips, leader lines, markers, the layer card and the contact hand-off.
 * Reads the engine through window.Cutaway and the content through window.CUTAWAY_LAYERS.
 */
(function () {
  'use strict';

  var UI_VERSION = '1.2.1';
  var E = window.Cutaway, D = window.CUTAWAY_LAYERS;
  if (!E || !D) { console.warn('[Cutaway UI] engine or layer data missing'); return; }
  var clamp = E.util.clamp, ease = E.util.ease;
  var L = D.items, NL = L.length, IH = E.state.imageH;
  var TOTAL = L.reduce(function (a, b) { return a + b.cost; }, 0);
  var LAY0 = D.revealStart, STEP = D.revealStep;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* story timing, in screens */
  var FROST_END = 0.9, HERO_END = 0.7, WASH = [0.3, 0.9], FRAME = [4.4, 5.6];
  var FADE = 0.3, RISE_IN = 24, RISE_OUT = 40, DRIFT = 17;   // drift ≈ 3px per prototype step

  function $(id) { return document.getElementById('cw-' + id); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function pad(n) { return String(n).padStart(2, '0'); }
  function revealAt(u, i) { return clamp((u - LAY0 - i * STEP) / (STEP * 1.1), 0, 1); }

  var track = $('track'), stage = $('stage'), ui = $('ui'), frost = $('frost'), wash = $('wash'), hero = $('hero');
  var card = $('card'), svg = $('leaders'), sideL = $('sideL'), sideR = $('sideR');
  var scrollCue = $('scroll');
  var originalNarrowSpan = E.config.narrowSpan.slice();

  /* ---------- chapter captions ---------- */
  var chaps = D.chapters.map(function (c) {
    var s = el('section', 'cw-chap' + (c.top ? ' cw-top' : ''));
    var eb = el('p', 'cw-eyebrow'); var bar = el('i'); bar.setAttribute('aria-hidden', 'true'); eb.appendChild(bar); eb.appendChild(document.createTextNode(c.eyebrow));
    s.appendChild(eb); s.appendChild(el('h2', 'cw-dl', c.title)); s.appendChild(el('p', 'cw-bl', c.body));
    $('chaps').appendChild(s);
    return { el: s, a: c['in'], b: c.out == null ? Infinity : c.out, drift: !c.top };
  });

  /* ---------- chips, markers, leaders ---------- */
  var order = L.map(function (l, i) { return i; }).sort(function (a, b) { return L[a].labelY - L[b].labelY; });
  var rank = []; order.forEach(function (i, r) { rank[i] = r; });

  var parts = L.map(function (l, i) {
    var chip = el('button', 'cw-chip'); chip.type = 'button';
    chip.setAttribute('aria-pressed', 'false');
    chip.setAttribute('aria-label', l.name + ', layer ' + (i + 1) + ' of ' + NL);
    chip.appendChild(el('span', 'cw-n', pad(i + 1))); chip.appendChild(el('span', '', l.label));

    var mk = el('button', 'cw-mk'); mk.type = 'button'; mk.tabIndex = -1;   // the chips are the keyboard route
    mk.setAttribute('aria-label', l.name);
    ['d', 'a'].forEach(function (k) {
      var im = el('img', 'cw-' + k); im.src = 'assets/marker-' + (k === 'd' ? 'default' : 'active') + '.svg';
      im.width = im.height = 44; im.alt = ''; mk.appendChild(im);
    });

    var g = document.createElementNS(SVGNS, 'g');
    var halo = document.createElementNS(SVGNS, 'polyline'); halo.setAttribute('class', 'cw-halo');
    var line = document.createElementNS(SVGNS, 'polyline'); line.setAttribute('class', 'cw-line');
    g.appendChild(halo); g.appendChild(line); svg.appendChild(g);

    [chip, mk].forEach(function (b) { b.addEventListener('click', function () { select(sel === i ? -1 : i); }); });
    $('markers').appendChild(mk);
    return { chip: chip, mk: mk, g: g, halo: halo, line: line, w: 0, h: 0 };
  });
  order.forEach(function (i) { $('chips').appendChild(parts[i].chip); });   // DOM = visual order, top to bottom

  /* chips sit on the image: right-aligned at labelX, each on its own labelY row,
     so every leader runs straight across and then up or down to its anchor without crossing */
  var narrow = false, maxW = 0;
  function layout() {
    narrow = matchMedia(E.config.narrowQuery).matches; maxW = 0;
    parts.forEach(function (p) {
      p.w = p.chip.offsetWidth; p.h = p.chip.offsetHeight; maxW = Math.max(maxW, p.w);
      if (narrow) p.chip.style.transform = '';
    });
    /* Reserve actual reading/control space before sizing the image band.
       The engine still owns projection, frames and timing; its public config
       lets the UI fit that projection to phones and near-square windows. */
    if (narrow) {
      var width = stage.clientWidth, height = stage.clientHeight;
      var chapterHeight = chaps.reduce(function (h, ch) {
        return Math.max(h, ch.el.classList.contains('cw-top') ? 0 : ch.el.offsetHeight);
      }, 0);
      var reserve = Math.max($('chips').offsetHeight + 16, chapterHeight + 44) + 24;
      E.config.narrowSpan = originalNarrowSpan.map(function (span, i) {
        var top = i === 0 ? height * E.config.narrowTop[0] : Math.max(56, height * E.config.narrowTop[1]);
        var imageHeight = Math.max(80, height - top - reserve);
        return Math.max(span, width * IH / imageHeight);
      });
    } else E.config.narrowSpan = originalNarrowSpan.slice();
    E.refresh();
  }
  addEventListener('resize', function () { requestAnimationFrame(layout); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

  /* ---------- selection ---------- */
  var sel = -1;
  function select(i) {
    if (i < 0) return deselect();
    sel = i; var l = L[i];
    $('cEye').textContent = 'Layer ' + pad(i + 1) + ' of ' + NL + (i === 0 ? ' · outermost' : i === NL - 1 ? ' · innermost' : '');
    $('cName').textContent = l.name;
    $('cDesc').textContent = l.description;
    var dl = $('cSpec'); dl.textContent = '';
    l.spec.forEach(function (p) { var row = el('div'); row.appendChild(el('dt', 'cw-ls', p[0])); row.appendChild(el('dd', '', p[1])); dl.appendChild(row); });
    $('cCost').textContent = D.currency + l.cost;
    $('cUnit').textContent = D.unit + ' · ' + Math.round(l.cost / TOTAL * 100) + '% of build-up';
    $('cPrev').disabled = i === 0; $('cNext').disabled = i === NL - 1;
    card.hidden = false;
    mark();
  }
  function deselect() {
    var was = sel, restoreFocus = card.contains(document.activeElement);
    sel = -1; card.hidden = true; mark();
    if (was >= 0 && restoreFocus) parts[was].chip.focus({ preventScroll: true });
  }
  function mark() {
    parts.forEach(function (p, j) {
      var on = j === sel;
      p.chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      p.mk.classList.toggle('cw-on', on);
      p.g.classList.toggle('cw-on', on);
    });
    paint();
  }
  $('cClose').onclick = deselect;
  $('cPrev').onclick = function () { if (sel > 0) select(sel - 1); };
  $('cNext').onclick = function () { if (sel < NL - 1) select(sel + 1); };
  addEventListener('keydown', function (e) {
    if (sel < 0 || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'Escape') deselect();
    else if (e.key === 'ArrowLeft' && sel > 0) { e.preventDefault(); select(sel - 1); }
    else if (e.key === 'ArrowRight' && sel < NL - 1) { e.preventDefault(); select(sel + 1); }
  });

  /* ---------- paint: called on every engine frame and on scroll past the track ---------- */
  function contactT() {
    var end = track.offsetHeight - innerHeight;
    return clamp((scrollY - end) / (innerHeight * 0.8), 0, 1);
  }
  function show(node, on) { node.style.visibility = on ? 'visible' : 'hidden'; }

  function paint() {
    var s = E.state; if (!s.view) return;
    var u = s.u, c = contactT();
    if (s.narrow !== narrow) layout();

    /* frost + hero: opacity and blur fall together, no hard edge; frost returns for contact */
    var fh = reduce ? (u < FROST_END / 2 ? 1 : 0) : 1 - ease(clamp(u / FROST_END, 0, 1));
    var fc = reduce ? (c > 0.5 ? 1 : 0) : ease(c);
    var f = Math.max(fh, fc);
    frost.style.opacity = f;
    var blur = 'blur(' + (64 * f).toFixed(1) + 'px)';
    frost.style.backdropFilter = frost.style.webkitBackdropFilter = blur;
    show(frost, f > 0.004);

    var ht = reduce ? (u < HERO_END / 2 ? 0 : 1) : ease(clamp(u / HERO_END, 0, 1));
    hero.style.opacity = 1 - ht;
    hero.style.transform = reduce ? '' : 'translateY(' + (-56 * ht).toFixed(1) + 'px)';
    show(hero, ht < 0.995);
    scrollCue.style.opacity = 1 - ht;
    show(scrollCue, ht < 0.995);

    /* left wash for text legibility */
    wash.style.opacity = reduce ? (u > WASH[0] ? 1 : 0) : clamp((u - WASH[0]) / (WASH[1] - WASH[0]), 0, 1);

    /* side frost frames the cutaway from left and right as the camera pushes in */
    var fr = reduce ? (u > FRAME[0] ? 1 : 0) : ease(clamp((u - FRAME[0]) / (FRAME[1] - FRAME[0]), 0, 1));
    sideL.style.opacity = sideR.style.opacity = fr;
    show(sideL, fr > 0.004); show(sideR, fr > 0.004);

    /* whole overlay steps back as the contact section arrives */
    ui.style.opacity = c > 0 ? 1 - fc : '';
    show(ui, fc < 0.99);

    /* chapter captions: fade + 24px rise in, fade + 40px rise out, slow drift while visible */
    chaps.forEach(function (ch) {
      var fin = clamp((u - ch.a) / FADE, 0, 1), fout = ch.b === Infinity ? 1 : clamp((ch.b - u) / FADE, 0, 1);
      var op, y = 0;
      if (reduce) op = u >= ch.a + FADE / 2 && u < ch.b - FADE / 2 ? 1 : 0;
      else {
        var ei = ease(fin), eo = ease(fout);
        op = Math.min(ei, eo);
        y = (1 - ei) * RISE_IN - (1 - eo) * RISE_OUT - (ch.drift ? Math.max(0, u - ch.a) * DRIFT : 0);
      }
      ch.el.style.opacity = op;
      ch.el.style.transform = y ? 'translateY(' + y.toFixed(1) + 'px)' : '';
      show(ch.el, op > 0.01);
    });

    /* exploring: chips one per step, leaders draw in, markers pop */
    if (sel >= 0 && u < LAY0 - 0.2) deselect();
    var anyOn = sel >= 0;
    stage.style.setProperty('--cw-img-bottom', (s.view.oy + IH * s.view.s) + 'px');
    parts.forEach(function (p, i) {
      var r = revealAt(u, i);
      if (reduce) r = r > 0 ? 1 : 0;
      var a = E.project(L[i].anchor[0], L[i].anchor[1]);

      var co = clamp((r - 0.2) / 0.5, 0, 1) * (anyOn && i !== sel ? 0.8 : 1);
      p.chip.style.opacity = co; show(p.chip, r > 0.2);

      var mo = clamp((r - 0.8) / 0.2, 0, 1);
      p.mk.style.opacity = mo;
      p.mk.style.transform = 'translate(' + (a.x - 22).toFixed(1) + 'px,' + (a.y - 22).toFixed(1) + 'px) scale(' + (0.6 + 0.4 * ease(mo)).toFixed(3) + ')';
      show(p.mk, mo > 0);

      if (narrow) return;
      var lb = E.project(D.labelX, L[i].labelY);
      var right = Math.max(lb.x, maxW + 16);                 // never push a chip off the left edge
      p.chip.style.transform = 'translate(' + Math.round(right - p.w) + 'px,' + Math.round(lb.y - p.h / 2) + 'px)';
      var x0 = right + 12, y0 = lb.y.toFixed(1);
      var pts = x0.toFixed(1) + ',' + y0 + ' ' + a.x.toFixed(1) + ',' + y0 + ' ' + a.x.toFixed(1) + ',' + a.y.toFixed(1);
      var len = Math.abs(a.x - x0) + Math.abs(a.y - lb.y);
      var off = (len * (1 - ease(r))).toFixed(1);
      [p.halo, p.line].forEach(function (pl) {
        pl.setAttribute('points', pts);
        pl.style.strokeDasharray = len.toFixed(1); pl.style.strokeDashoffset = off;
      });
      p.g.style.visibility = r > 0 ? 'visible' : 'hidden';
    });
  }

  E.on('frame', paint);
  addEventListener('scroll', function () { if (track.offsetHeight - innerHeight < scrollY + 2) requestAnimationFrame(paint); }, { passive: true });
  layout();

  window.CutawayUI = { version: UI_VERSION, select: select, deselect: deselect };
})();
