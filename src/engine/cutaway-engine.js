/*!
 * Building Wall Cutaway — Engine
 * Stable layer: frame sequence, scroll timeline, canvas render, image-space mapping.
 * The UI never touches the canvas. It listens to window.Cutaway events instead.
 *
 * Needs in the page:  #cw-track  >  #cw-stage  >  canvas#cw-cv
 * Needs before it:    window.CUTAWAY_FRAMES = { base: '...', files: ['...webp', ...] }
 */
(function () {
  'use strict';

  var ENGINE_VERSION = '1.0.0';

  /* ---------- config (override any key with window.CUTAWAY_CONFIG) ---------- */
  var C = Object.assign({
    imageW: 1920, imageH: 1080,       // size of every frame
    screens: 9,                        // scroll length, in viewport heights
    holdUntil: 0.7,                    // screens: building holds still
    openUntil: 3.2,                    // screens: cutaway opens
    pushUntil: 5.4,                    // screens: camera push to the detail
    frameStart: 10, frameOpen: 100,    // frame index at start / end of the opening
    smoothing: 0.12,                   // 0..1, higher = snappier scroll follow
    focusX: [960, 1010],               // desktop: image x kept centred, building -> detail
    narrowQuery: '(max-width:760px), (max-aspect-ratio:11/10)',
    narrowSpan: [1500, 860],           // phones: image width shown, building -> detail
    narrowFocusX: [960, 1245],
    narrowTop: [0.14, 0.07],           // phones: frame top as share of screen height
    narrowFade: ['rgba(223,230,236,1)', 'rgba(236,235,232,1)'], // fade into page colour above / below
    preloadStrides: [16, 8, 4, 2, 1],
    parallelLoads: 4
  }, window.CUTAWAY_CONFIG || {});

  var F = window.CUTAWAY_FRAMES || { base: '', files: [] };
  var N = F.files.length;
  var IW = C.imageW, IH = C.imageH, U = C.screens;

  var track = document.getElementById('cw-track');
  var stage = document.getElementById('cw-stage');
  var cv = document.getElementById('cw-cv');
  if (!track || !stage || !cv || !N) { console.warn('[Cutaway] missing markup or frames'); return; }
  var ctx = cv.getContext('2d');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  /* ---------- events ---------- */
  var ls = { frame: [], progress: [], ready: [] };
  function emit(e, d) { for (var i = 0; i < ls[e].length; i++) { try { ls[e][i](d); } catch (err) { console.error(err); } } }

  /* ---------- frames ---------- */
  var imgs = new Array(N), ok = new Array(N).fill(false), loaded = 0;
  function src(i) { return F.base + F.files[i]; }
  function load(i) {
    return new Promise(function (res) {
      var im = new Image(); im.decoding = 'async';
      im.onload = function () { ok[i] = true; loaded++; emit('progress', { loaded: loaded, total: N }); force = true; res(); };
      im.onerror = function () { loaded++; emit('progress', { loaded: loaded, total: N }); res(); };
      im.src = src(i); imgs[i] = im;
    });
  }
  function nearest(i) {
    if (ok[i]) return imgs[i];
    for (var d = 1; d < N; d++) {
      if (i - d >= 0 && ok[i - d]) return imgs[i - d];
      if (i + d < N && ok[i + d]) return imgs[i + d];
    }
    return null;
  }
  (function preload() {
    var first = Math.min(C.frameStart, N - 1);
    load(first).then(function () { return load(N - 1); }).then(function () {
      var q = [], seen = {}; seen[first] = seen[N - 1] = 1;
      C.preloadStrides.forEach(function (st) { for (var i = 0; i < N; i += st) if (!seen[i]) { seen[i] = 1; q.push(i); } });
      function run() { return q.length ? load(q.shift()).then(run) : Promise.resolve(); }
      var workers = []; for (var k = 0; k < C.parallelLoads; k++) workers.push(run());
      return Promise.all(workers);
    }).then(function () { emit('ready', { total: N }); });
  })();

  /* ---------- timeline: scroll position (screens) -> frame ---------- */
  function frameAt(u) {
    if (u < C.holdUntil) return C.frameStart;
    if (u < C.openUntil) return lerp(C.frameStart, C.frameOpen, ease((u - C.holdUntil) / (C.openUntil - C.holdUntil)));
    if (u < C.pushUntil) return lerp(C.frameOpen, N - 1, ease((u - C.openUntil) / (C.pushUntil - C.openUntil)));
    return N - 1;
  }

  /* ---------- view: where the frame sits on screen ---------- */
  var W = 0, H = 0, DPR = 1, narrow = false;
  function pushT(u) { return clamp((u - C.openUntil) / (C.pushUntil - C.openUntil), 0, 1); }
  function view(u) {
    var t = pushT(u);
    if (!narrow) {
      var s = Math.max(W / IW, H / IH), cx = lerp(C.focusX[0], C.focusX[1], t);
      var ox = clamp(W / 2 - cx * s, W - IW * s, 0);
      return { s: s, ox: ox, oy: (H - IH * s) / 2 };
    }
    var te = ease(t);
    var sp = lerp(C.narrowSpan[0], C.narrowSpan[1], te), ncx = lerp(C.narrowFocusX[0], C.narrowFocusX[1], te), ns = W / sp;
    var top = lerp(H * C.narrowTop[0], Math.max(56, H * C.narrowTop[1]), te);
    return { s: ns, ox: W / 2 - ncx * ns, oy: top };
  }

  /* ---------- scroll ---------- */
  var target = 0, cur = 0, force = true;
  function scrollMax() { return track.offsetHeight - innerHeight; }
  function readScroll() { target = clamp(scrollY / Math.max(1, scrollMax()), 0, 1) * U; }
  addEventListener('scroll', readScroll, { passive: true });

  function size() {
    W = stage.clientWidth; H = stage.clientHeight; DPR = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    narrow = matchMedia(C.narrowQuery).matches;
    track.style.height = (H * (U + 1)) + 'px';
    readScroll(); force = true;
  }
  addEventListener('resize', size);

  /* ---------- render ---------- */
  var lastKey = '';
  function render() {
    var v = view(cur), f = Math.round(frameAt(cur));
    var key = f + '|' + v.s.toFixed(4) + '|' + v.ox.toFixed(1) + '|' + v.oy.toFixed(1) + '|' + cur.toFixed(4);
    if (!force && key === lastKey) return;
    var redrawCanvas = force || key.split('|').slice(0, 4).join('|') !== lastKey.split('|').slice(0, 4).join('|');
    lastKey = key; force = false;
    if (redrawCanvas) {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
      var im = nearest(f);
      if (im) { ctx.imageSmoothingQuality = 'high'; ctx.drawImage(im, v.ox, v.oy, IW * v.s, IH * v.s); }
      if (narrow) {
        var y = v.oy + IH * v.s, g = ctx.createLinearGradient(0, y - 40, 0, y + 2);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, C.narrowFade[1]); ctx.fillStyle = g; ctx.fillRect(0, y - 40, W, 42);
        var g2 = ctx.createLinearGradient(0, v.oy - 2, 0, v.oy + 30);
        g2.addColorStop(0, C.narrowFade[0]); g2.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g2; ctx.fillRect(0, v.oy - 2, W, 32);
      }
    }
    api.state.u = cur; api.state.view = v; api.state.frame = f; api.state.narrow = narrow; api.state.W = W; api.state.H = H;
    emit('frame', api.state);
  }
  function tick(now) {
    var dt = Math.min(64, now - (tick.t || now)); tick.t = now;
    var d = target - cur, k = 1 - Math.pow(1 - C.smoothing, dt / 16.67);
    cur = reduce ? target : (Math.abs(d) < 0.0005 ? target : cur + d * k);
    render(); requestAnimationFrame(tick);
  }

  /* ---------- public API ---------- */
  var api = window.Cutaway = {
    version: ENGINE_VERSION,
    config: C,
    state: { u: 0, screens: U, frame: 0, view: null, narrow: false, W: 0, H: 0, imageW: IW, imageH: IH },
    on: function (e, fn) { if (ls[e]) ls[e].push(fn); if (e === 'frame' && api.state.view) fn(api.state); return api; },
    jumpTo: function (u) { scrollTo({ top: clamp(u, 0, U) / U * scrollMax(), behavior: reduce ? 'auto' : 'smooth' }); },
    refresh: function () { force = true; },
    project: function (x, y) { var v = api.state.view; return v ? { x: v.ox + x * v.s, y: v.oy + y * v.s } : null; },
    util: { lerp: lerp, clamp: clamp, ease: ease }
  };

  size(); cur = target; requestAnimationFrame(tick);
})();
