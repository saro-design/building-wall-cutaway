/*!
 * Building Wall Cutaway — UI
 * Everything the visitor sees on top of the animation: chapter copy, layer labels,
 * the layer card, the cost bar, progress rail and loader.
 * This is the layer that changes with each design iteration. It reads the engine
 * through window.Cutaway and the content through window.CUTAWAY_LAYERS.
 */
(function () {
  'use strict';

  var UI_VERSION = '1.0.0';
  var E = window.Cutaway, D = window.CUTAWAY_LAYERS;
  if (!E || !D) { console.warn('[Cutaway UI] engine or layer data missing'); return; }
  var lerp = E.util.lerp, clamp = E.util.clamp, ease = E.util.ease;
  var L = D.items, NL = L.length, U = E.state.screens, IW = E.state.imageW, IH = E.state.imageH;
  var TOTAL = L.reduce(function (a, b) { return a + b.cost; }, 0);
  var LAY0 = D.revealStart, STEP = D.revealStep, LX = D.labelX;
  var CUR = D.currency, UNIT = D.unit;

  function $(id) { return document.getElementById('cw-' + id); }
  var stage = $('stage'), ov = $('ov'), side = $('side'), wash = $('wash'), card = $('card'), bar = $('bar');
  var chaps = [].slice.call(document.querySelectorAll('.cw-chap'));
  var pad = function (n) { return String(n).padStart(2, '0'); };
  function revealAt(u, i) { return clamp((u - LAY0 - i * STEP) / (STEP * 1.1), 0, 1); }

  /* ---------- overlay, locked to image space ---------- */
  ov.style.cssText += ';position:absolute;left:0;top:0;transform-origin:0 0;pointer-events:none;width:' + IW + 'px;height:' + IH + 'px';
  var NS = 'http://www.w3.org/2000/svg';
  var svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 ' + IW + ' ' + IH); ov.appendChild(svg);

  var parts = L.map(function (l, i) {
    var x = l.anchor[0], y = l.anchor[1], ly = l.labelY;
    var pl = document.createElementNS(NS, 'polyline');
    pl.setAttribute('points', (LX + 14) + ',' + ly + ' ' + x + ',' + ly + ' ' + x + ',' + y);
    pl.setAttribute('class', 'cw-ld');
    var len = Math.abs(x - LX - 14) + Math.abs(y - ly); pl.style.strokeDasharray = len; pl.style.strokeDashoffset = len;
    var ring = document.createElementNS(NS, 'circle'); ring.setAttribute('cx', x); ring.setAttribute('cy', y); ring.setAttribute('r', 14); ring.setAttribute('class', 'cw-ring');
    var dot = document.createElementNS(NS, 'circle'); dot.setAttribute('cx', x); dot.setAttribute('cy', y); dot.setAttribute('r', 11); dot.setAttribute('class', 'cw-dot');
    svg.appendChild(pl); svg.appendChild(ring); svg.appendChild(dot);

    var lbl = document.createElement('button'); lbl.type = 'button'; lbl.className = 'cw-lbl';
    lbl.style.left = LX + 'px'; lbl.style.top = ly + 'px';
    lbl.innerHTML = '<span class="cw-n">' + pad(i + 1) + '</span>' + l.label;
    lbl.setAttribute('aria-label', l.name + ', layer ' + (i + 1) + ' of ' + NL);
    var hit = document.createElement('button'); hit.type = 'button'; hit.className = 'cw-hit'; hit.tabIndex = -1;
    hit.style.left = x + 'px'; hit.style.top = y + 'px'; hit.setAttribute('aria-label', l.name);
    var num = document.createElement('button'); num.type = 'button'; num.className = 'cw-num';
    num.style.left = x + 'px'; num.style.top = y + 'px'; num.textContent = i + 1; num.setAttribute('aria-label', l.name);
    [lbl, hit, num].forEach(function (el) { el.addEventListener('click', function () { select(i); }); ov.appendChild(el); });
    return { pl: pl, len: len, ring: ring, dot: dot, lbl: lbl, hit: hit, num: num };
  });

  /* ---------- cost bar ---------- */
  var segs = L.map(function (l, i) {
    var s = document.createElement('button'); s.type = 'button';
    s.style.flex = l.cost; s.style.background = l.colour;
    s.title = l.name + ' · ' + CUR + l.cost + UNIT; s.setAttribute('aria-label', l.name + ', ' + CUR + l.cost + ' per square metre');
    s.addEventListener('click', function () { select(i); }); bar.appendChild(s); return s;
  });

  /* ---------- selection ---------- */
  var sel = -1;
  function mark(i) {
    parts.forEach(function (p, j) {
      var on = j === i;
      [p.pl, p.dot, p.ring].forEach(function (el) { el.classList.toggle('cw-on', on); });
      p.lbl.classList.toggle('cw-on', on); p.num.classList.toggle('cw-on', on); segs[j].classList.toggle('cw-on', on);
    });
  }
  function select(i) {
    sel = i; var l = L[i]; card.hidden = false;
    $('cIdx').textContent = pad(i + 1) + ' / ' + NL;
    $('cName').textContent = l.name; $('cSw').style.background = l.colour; $('cDesc').textContent = l.description;
    $('cSpec').innerHTML = l.spec.map(function (p) { return '<dt>' + p[0] + '</dt><dd>' + p[1] + '</dd>'; }).join('');
    $('cCost').innerHTML = CUR + l.cost + '<small>' + UNIT + '</small>';
    $('cShare').textContent = Math.round(l.cost / TOTAL * 100) + '% of wall cost';
    $('cPrev').style.visibility = i === 0 ? 'hidden' : 'visible';
    $('cNext').style.visibility = i === NL - 1 ? 'hidden' : 'visible';
    mark(i);
    if (E.state.u < U - 0.3) E.jumpTo(U);   // exploring means every layer should be named
  }
  function deselect() { sel = -1; card.hidden = true; mark(-1); }
  $('cClose').onclick = deselect;
  $('cPrev').onclick = function () { select(Math.max(0, sel - 1)); };
  $('cNext').onclick = function () { select(Math.min(NL - 1, sel + 1)); };
  $('skip').onclick = function () { E.jumpTo(U); };
  addEventListener('keydown', function (e) {
    if (sel < 0) return;
    if (e.key === 'Escape') deselect();
    if ((e.key === 'ArrowDown' || e.key === 'ArrowRight') && sel < NL - 1) { e.preventDefault(); select(sel + 1); }
    if ((e.key === 'ArrowUp' || e.key === 'ArrowLeft') && sel > 0) { e.preventDefault(); select(sel - 1); }
  });

  /* ---------- loader ---------- */
  var loadEl = $('load');
  E.on('progress', function (p) {
    loadEl.textContent = 'Loading frames ' + p.loaded + ' / ' + p.total;
    if (p.loaded >= 26) loadEl.style.opacity = 0;   // first coarse pass is enough to scroll
  });

  /* ---------- per-frame UI update ---------- */
  E.on('frame', function (s) {
    var u = s.u, v = s.view;
    ov.style.transform = 'translate(' + v.ox + 'px,' + v.oy + 'px) scale(' + v.s + ')';
    stage.style.setProperty('--cw-img-bottom', (v.oy + IH * v.s) + 'px');
    var inv = 1 / v.s;
    parts.forEach(function (p) { p.num.style.transform = 'translate(-50%,-50%) scale(' + inv + ')'; });

    chaps.forEach(function (c) {
      var a = +c.dataset.in, b = +c.dataset.out;
      var fin = a < 0 ? 1 : clamp((u - a) / 0.35, 0, 1), fout = clamp((b - u) / 0.35, 0, 1), op = Math.min(fin, fout);
      c.style.opacity = op; c.style.transform = 'translateY(' + ((1 - fin) * 24 - (1 - fout) * 24) + 'px)';
      c.style.visibility = op < 0.01 ? 'hidden' : 'visible';
    });

    var named = 0, sum = 0;
    parts.forEach(function (p, i) {
      var r = revealAt(u, i); if (r >= 1) named++; if (r >= 0.9) sum += L[i].cost;
      p.pl.style.strokeDashoffset = p.len * (1 - ease(r));
      p.dot.style.opacity = r > 0.85 ? 1 : 0;
      p.lbl.style.opacity = clamp((r - 0.2) / 0.5, 0, 1); p.lbl.style.visibility = r > 0 ? 'visible' : 'hidden';
      p.hit.style.visibility = r >= 0.9 ? 'visible' : 'hidden';
      p.num.style.opacity = clamp(r * 1.6, 0, 1); p.num.style.visibility = r > 0 ? 'visible' : 'hidden';
      segs[i].classList.toggle('cw-seen', r >= 0.9);
    });

    side.classList.toggle('cw-off', u <= LAY0 - 0.25);
    var w = u < 3.2 ? 1 : u < LAY0 - 0.4 ? lerp(1, 0.55, clamp((u - 3.2) / 0.6, 0, 1)) : lerp(0.55, 1, clamp((u - (LAY0 - 0.4)) / 0.5, 0, 1));
    wash.style.setProperty('--cw-wash', w);
    $('sum').textContent = CUR + sum + ' ' + UNIT;
    if (named < NL) { $('headT').textContent = named + ' of ' + NL + ' named'; $('headH').textContent = 'Keep scrolling to name each layer, outside to inside.'; }
    else { $('headT').textContent = 'Outside to inside'; $('headH').textContent = 'Select any layer for what it does and what it costs.'; }
    $('rail').style.width = (u / U * 100) + '%';
  });

  window.CutawayUI = { version: UI_VERSION, select: select, deselect: deselect };
})();
