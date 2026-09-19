/**
 * hero-picker-panel.js — DEV ONLY. The control panel behind /picker/.
 *
 * Two iframes show the real homepage (loaded with ?hero-picker) at laptop and
 * phone sizes; this panel pushes state to them via postMessage. The page-side
 * half is assets/js/hero-picker.js. State is kept in localStorage so a
 * standalone /?hero-picker tab follows along, and is encoded into the "open"
 * links so it can travel to another device.
 *
 * Framing model: background-position X/Y in %, and a zoom multiplier over
 * `cover` that is written back as CSS — `cover` at 1.00×, `auto N%` when the
 * photo is height-limited in its box, `N% auto` when width-limited. The box is
 * the live .hero-photo's: the frame plus a 40px bleed on top and sides and
 * 50vh below it for parallax. On iOS Safari 100vh is the toolbar-hidden
 * viewport, so each phone preset carries that height (lvh) and the phone
 * iframe gets the matching --hero-photo-bottom, making its box device-exact.
 */
(function () {
  'use strict';

  var KEY = 'hero-picker-state';
  var KB_START = 1.03;   // kenBurns keyframe 0% — the resting frame the crop math uses

  // What _sass/_layouts.scss ships today, so "Reset all" reproduces the live site.
  var LIVE = { dx: 72, dy: 30, dz: 1, dsLit: 'cover', mx: 81, my: 30, mz: 1, msLit: 'cover' };

  // Starting framings per candidate (position %, zoom over cover), eyeballed so
  // faces land in frame, plus the aspect ratio so the first paint never guesses
  // the axis. Anything not listed starts centered at cover.
  var DEFAULTS = {
    'A7R04456.jpg': { label: 'Taormina at dusk',           a: 1.5,   d: [40, 50, 1], m: [36, 50, 1] },
    'DSC04168.jpg': { label: 'Between the columns',        a: 1.5,   d: [50, 30, 1], m: [46, 30, 1] },
    'DSC04316.jpg': { label: 'Chapel — seated I',          a: 0.667, d: [50, 40, 1], m: [50, 40, 1] },
    'DSC04318.jpg': { label: 'Chapel — seated II',         a: 0.667, d: [50, 45, 1], m: [50, 45, 1] },
    'DSC04324.jpg': { label: 'Chapel — over the shoulder', a: 1.5,   d: [40, 30, 1], m: [36, 30, 1] },
    'DSC04332.jpg': { label: 'Chapel — at the rail',       a: 0.667, d: [50, 55, 1], m: [50, 55, 1] },
    'DSC04519.jpg': { label: 'Terrace — looking out',      a: 1.5,   d: [72, 30, 1], m: [81, 30, 1] },
    'DSC04533.jpg': { label: 'Terrace — the walk',         a: 1.5,   d: [62, 50, 1], m: [67, 50, 1] },
    'DSC04554.jpg': { label: 'Balcony kiss',               a: 1.5,   d: [52, 32, 1], m: [53, 32, 1] },
    'DSC04679.jpg': { label: 'Kiss — black and white',     a: 1.5,   d: [55, 30, 1], m: [57, 30, 1] },
    'DSC04688.jpg': { label: 'Embrace over the bay',       a: 1.5,   d: [45, 30, 1], m: [43, 30, 1] },
    'DSC05010.jpg': { label: 'Red room I',                 a: 1.5,   d: [58, 36, 1], m: [61, 36, 1] },
    'DSC05014.jpg': { label: 'Red room II',                a: 1.5,   d: [60, 32, 1], m: [64, 32, 1] }
  };

  var CURRENT = window.HP_CURRENT || { file: 'DSC04519.jpg', path: '/assets/DSC04519.jpg' };
  CURRENT.label = 'Current hero';
  CURRENT.current = true;
  CURRENT.a = (DEFAULTS[CURRENT.file] || {}).a || 1.5;

  var PHOTOS = [CURRENT].concat((window.HP_PHOTOS || []).slice()
    .filter(function (p) { return p.file !== CURRENT.file; })   // the live photo is listed once, as Current
    .sort(function (a, b) { return a.file < b.file ? -1 : a.file > b.file ? 1 : 0; })
    .map(function (p) { var d = DEFAULTS[p.file] || {}; return { file: p.file, path: p.path, label: d.label || p.file, a: d.a || null }; }));
  var byFile = {};
  PHOTOS.forEach(function (p) { byFile[p.file] = p; });

  var dims = {};   // file -> { w, h } natural pixels, measured as thumbnails load (persisted with the state)
  function aspectOf(P) { var d = dims[P.file]; return d ? d.w / d.h : (P.a || 1.5); }

  // ---------- DOM ----------
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var el = {
    grid: $('[data-grid]'), meta: $('[data-meta]'),
    preview: $('[data-preview]'), previewImg: $('[data-preview-img]'), cropD: $('[data-crop="d"]'), cropM: $('[data-crop="m"]'),
    frames: $('[data-frames]'), frameD: $('[data-frame="d"]'), frameM: $('[data-frame="m"]'),
    wrapD: $('[data-wrap="d"]'), scaleD: $('[data-scale]'),
    presetD: $('[data-preset="d"]'), presetM: $('[data-preset="m"]'),
    css: $('[data-css]'), copy: $('[data-copy]'), status: $('[data-status]'),
    open: $$('[data-open]'), phoneUrl: $('[data-phone-url]'),
    noteD: $('[data-note="d"]'), noteM: $('[data-note="m"]'),
    resetPhoto: $('[data-reset="photo"]'), resetAll: $('[data-reset="all"]'),
    pin: $('[data-pin]'), pinned: $('[data-pinned]'), pinnedFrame: $('[data-frame="pin"]'), pinnedCap: $('[data-cap="pin"]'), unpin: $('[data-unpin]'),
    motion: $('[data-motion]')
  };
  var sliders = {};
  ['dx', 'dy', 'dz', 'mx', 'my', 'mz'].forEach(function (k) {
    sliders[k] = { input: $('[data-slider="' + k + '"]'), out: $('[data-out="' + k + '"]'), row: $('[data-row="' + k + '"]') };
  });
  var toggles = { grade: $('[data-toggle="grade"]'), text: $('[data-toggle="text"]') };

  // ---------- Geometry ----------
  function boxOf(f) { return { w: f.w + 80, h: f.h + 40 + (f.lvh || f.h) * 0.5 }; }
  function cover(aspect, box) {
    var b = box.w / box.h;
    return aspect > b ? { w: box.h * aspect, h: box.h, axis: 'h' } : { w: box.w, h: box.w / aspect, axis: 'w' };
  }
  function sizeCss(c, z) {
    if (Math.abs(z - 1) < 0.005) return 'cover';
    var pct = Math.round(z * 100);
    return c.axis === 'h' ? 'auto ' + pct + '%' : pct + '% auto';
  }
  // The zoom a literal background-size amounts to in a given box (for the slider readout).
  function zFromCss(lit, c, box) {
    if (!lit || lit === 'cover') return 1;
    var m;
    if ((m = /^auto\s+([\d.]+)%$/.exec(lit))) return (parseFloat(m[1]) / 100 * box.h) / c.h;
    if ((m = /^([\d.]+)%(\s+auto)?$/.exec(lit))) return (parseFloat(m[1]) / 100 * box.w) / c.w;
    return 1;
  }
  // Where the photo lands: its edges in hero px (after the Ken Burns start
  // scale about the box centre), and the visible hero as fractions of the photo.
  function geom(frame, box, c, z, px, py) {
    var imgW = c.w * z, imgH = c.h * z;
    var offX = (box.w - imgW) * px / 100, offY = (box.h - imgH) * py / 100;   // photo top-left, box coords
    var cx = box.w / 2, cy = box.h / 2;
    function toHero(v, cc) { return cc + (v - cc) * KB_START - 40; }
    function toImgX(hx) { return ((hx + 40 - cx) / KB_START + cx - offX) / imgW; }
    function toImgY(hy) { return ((hy + 40 - cy) / KB_START + cy - offY) / imgH; }
    return {
      imgW: imgW, imgH: imgH,
      edges: { l: toHero(offX, cx), t: toHero(offY, cy), r: toHero(offX + imgW, cx), b: toHero(offY + imgH, cy) },
      crop: { l: toImgX(0), t: toImgY(0), r: toImgX(frame.w), b: toImgY(frame.h) },
      inertX: z >= 0.995 && Math.abs(imgW - box.w) < 0.5,
      inertY: z >= 0.995 && Math.abs(imgH - box.h) < 0.5
    };
  }
  function round2(n) { return Math.round(n * 100) / 100; }
  function parsePreset(v) { var p = v.split('x').map(Number); return { w: p[0], h: p[1], lvh: p[2] || p[1] }; }
  function presetValue(f) { return f.w + 'x' + f.h + (f.lvh && f.lvh !== f.h ? 'x' + f.lvh : ''); }

  // ---------- State ----------
  function defaultsFor(file) {
    if (file === CURRENT.file) return Object.assign({}, LIVE);
    var d = DEFAULTS[file];
    return d ? { dx: d.d[0], dy: d.d[1], dz: d.d[2], mx: d.m[0], my: d.m[1], mz: d.m[2] }
             : { dx: 50, dy: 50, dz: 1, mx: 50, my: 50, mz: 1 };
  }
  function fresh() {
    var s = {};
    PHOTOS.forEach(function (p) { s[p.file] = defaultsFor(p.file); });
    return { photo: CURRENT.file, grade: true, text: true, motion: 'on',
             frames: { d: parsePreset('1440x800'), m: parsePreset('390x664x750') }, s: s };
  }
  function load() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      if (!v || !v.s) return null;
      var base = fresh();
      // A saved entry replaces the default wholesale: merging would resurrect the
      // live literals (dsLit/msLit) that moving a zoom slider deliberately deletes.
      Object.keys(base.s).forEach(function (f) {
        var sv = v.s[f];
        if (sv && typeof sv.dx === 'number') base.s[f] = Object.assign({}, sv);
      });
      base.photo = byFile[v.photo] ? v.photo : CURRENT.file;   // the selected file may have been removed
      ['grade', 'text'].forEach(function (k) { if (typeof v[k] === 'boolean') base[k] = v[k]; });
      if (v.motion === 'on' || v.motion === 'start' || v.motion === 'end') base.motion = v.motion;
      else if (typeof v.motion === 'boolean') base.motion = v.motion ? 'on' : 'start';
      if (v.frames && v.frames.d && v.frames.m) {
        base.frames = v.frames;
        if (!base.frames.d.lvh) base.frames.d.lvh = base.frames.d.h;
        if (!base.frames.m.lvh) base.frames.m.lvh = base.frames.m.h + 86;
      }
      if (v.dims && typeof v.dims === 'object') {
        Object.keys(v.dims).forEach(function (f) { var d = v.dims[f]; if (byFile[f] && d && d.w > 0 && d.h > 0) dims[f] = d; });
      }
      return base;
    } catch (e) { return null; }
  }
  var state = load() || fresh();
  var pinnedState = null;

  // ---------- Derived values ----------
  function derive() {
    var P = byFile[state.photo];
    var cur = state.s[P.file];
    var a = aspectOf(P);
    var bD = boxOf(state.frames.d), bM = boxOf(state.frames.m);
    var cD = cover(a, bD), cM = cover(a, bM);
    var dz = cur.dsLit ? zFromCss(cur.dsLit, cD, bD) : cur.dz;
    var mz = cur.msLit ? zFromCss(cur.msLit, cM, bM) : cur.mz;
    var ds = cur.dsLit || sizeCss(cD, dz);
    var ms = cur.msLit || sizeCss(cM, mz);
    var gD = geom(state.frames.d, bD, cD, dz, cur.dx, cur.dy);
    var gM = geom(state.frames.m, bM, cM, mz, cur.mx, cur.my);
    return {
      P: P, cur: cur, a: a, ds: ds, ms: ms, dz: dz, mz: mz, gD: gD, gM: gM,
      applied: { photo: P.path, ds: ds, dx: cur.dx, dy: cur.dy, ms: ms, mx: cur.mx, my: cur.my,
                 grade: state.grade, motion: state.motion, text: state.text }
    };
  }
  function noteFor(frame, g, z, size, wideName) {
    var seams = [];
    if (g.edges.t > 0.5) seams.push(Math.round(g.edges.t) + ' px from the top');
    if (g.edges.b < frame.h - 0.5) seams.push(Math.round(frame.h - g.edges.b) + ' px from the bottom');
    if (g.edges.l > 0.5) seams.push(Math.round(g.edges.l) + ' px from the left');
    if (g.edges.r < frame.w - 0.5) seams.push(Math.round(frame.w - g.edges.r) + ' px from the right');
    if (seams.length) return 'The photo does not fill its box — a tile seam shows ' + seams.join(', ') + ' (at Ken Burns start; the live CSS tiles the same way).';
    if (z < 0.995) return 'The photo is smaller than its box, but every seam sits outside the visible hero at Ken Burns start (the 1.13× end pushes them further out).';
    if (g.inertY) return 'At this zoom the photo is exactly as tall as its box, so Vertical has no effect. Zoom in to pan vertically.';
    if (g.inertX) return 'At this zoom the photo is exactly as wide as its box, so Horizontal has no effect. Zoom in to pan horizontally.';
    if (/^\d+% auto$/.test(size)) return 'Width-based size: on tablet-portrait screens (721–1024 px, which use the laptop rule) the photo may not reach the bottom of its box. Check an iPad preset.';
    if (/^auto \d+%$/.test(size)) return 'Height-based size: on very wide screens the photo may not reach the sides of its box. Check the ' + wideName + ' preset.';
    return '';
  }
  function scss(v) {
    var P = v.P, cur = v.cur;
    var out = ['// _sass/_layouts.scss — replace the .hero-photo fallbacks   (' + P.label + ')'];
    if (!P.current) out.push('// copy tentative_images/' + P.file + ' to assets/' + P.file + ' first');
    return out.concat([
      '.hero-photo {',
      "  background-image: var(--hero-photo, url('/assets/" + P.file + "'));",
      '  background-size: var(--desktop-bg-size, ' + v.ds + ');',
      '  background-position: var(--desktop-bg-x, ' + cur.dx + '%) var(--desktop-bg-y, ' + cur.dy + '%);',
      '}',
      '@media (max-width: 720px) {',
      '  .hero-photo {',
      '    background-size: var(--mobile-bg-size, ' + v.ms + ');',
      '    background-position: var(--mobile-bg-x, ' + cur.mx + '%) var(--mobile-bg-y, ' + cur.my + '%);',
      '  }',
      '}'
    ]).join('\n');
  }
  function queryFor(applied, extra) {
    var q = new URLSearchParams();
    q.set('hero-picker', '1');
    var all = Object.assign({}, applied, extra || {});
    Object.keys(all).forEach(function (k) {
      var val = all[k];
      q.set(k, typeof val === 'boolean' ? (val ? '1' : '0') : String(val));
    });
    return '/?' + q.toString();
  }
  function phoneBleed() { return -(state.frames.m.lvh / 2) + 'px'; }

  // ---------- Render ----------
  function render() {
    var v = derive();

    $$('[data-thumb]', el.grid).forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-thumb') === v.P.file); });
    renderMeta(v);
    renderPreview(v);

    setSlider('dx', v.cur.dx, v.cur.dx + '%', v.gD.inertX);
    setSlider('dy', v.cur.dy, v.cur.dy + '%', v.gD.inertY);
    setSlider('dz', round2(v.dz), v.dz.toFixed(2) + '×', false);
    setSlider('mx', v.cur.mx, v.cur.mx + '%', v.gM.inertX);
    setSlider('my', v.cur.my, v.cur.my + '%', v.gM.inertY);
    setSlider('mz', round2(v.mz), v.mz.toFixed(2) + '×', false);
    el.noteD.textContent = noteFor(state.frames.d, v.gD, v.dz, v.ds, 'ultrawide');
    el.noteM.textContent = noteFor(state.frames.m, v.gM, v.mz, v.ms, 'Pro Max');

    toggles.grade.checked = state.grade; toggles.text.checked = state.text;
    el.motion.value = state.motion;
    el.presetD.value = presetValue(state.frames.d);
    el.presetM.value = presetValue(state.frames.m);

    el.css.textContent = scss(v);
    var q = queryFor(v.applied);
    el.open.forEach(function (a) { a.href = q; });
    el.phoneUrl.textContent = location.protocol + '//' + location.host + q;

    // Push to the frames (the phone one also gets the device-exact bleed) and to any standalone tabs.
    if (el.frameD.contentWindow) el.frameD.contentWindow.postMessage({ type: 'hero-picker', state: v.applied }, location.origin);
    if (el.frameM.contentWindow) el.frameM.contentWindow.postMessage({ type: 'hero-picker', state: Object.assign({}, v.applied, { mb: phoneBleed() }) }, location.origin);
    try { localStorage.setItem(KEY, JSON.stringify(Object.assign({}, state, { applied: v.applied, dims: dims }))); } catch (e) { /* private mode */ }
  }
  function renderMeta(v) {
    var d = dims[v.P.file];
    var html = '<b>' + esc(v.P.label) + '</b><br>' + esc(v.P.file);
    if (d) {
      html += ' <span>· ' + d.w + ' × ' + d.h + ' · ' + (v.a >= 1 ? 'landscape' : 'portrait') + '</span>';
      // Source pixels vs device pixels at the tight end of Ken Burns (1.13), 3× phone / 2× laptop.
      var upPhone = (v.gM.imgW * 1.13 * 3) / d.w, upLaptop = (v.gD.imgW * 1.13 * 2) / d.w;
      if (upPhone > 1.2 || upLaptop > 1.2) {
        html += '<br><span class="soft">Upscaled ~' + upPhone.toFixed(1) + '× on a 3× phone, ~' + upLaptop.toFixed(1) + '× on a 2× laptop — will look soft; a larger export would help.</span>';
      }
    } else {
      html += ' <span>· ' + (v.a >= 1 ? 'landscape' : 'portrait') + '</span>';
    }
    el.meta.innerHTML = html;
  }
  function renderPreview(v) {
    if (el.previewImg.getAttribute('src') !== v.P.path) el.previewImg.setAttribute('src', v.P.path);
    el.preview.style.aspectRatio = v.a;
    placeCrop(el.cropD, v.gD.crop);
    placeCrop(el.cropM, v.gM.crop);
  }
  function placeCrop(box, c) {
    var l = Math.max(0, Math.min(1, c.l)), t = Math.max(0, Math.min(1, c.t));
    var r = Math.max(0, Math.min(1, c.r)), b = Math.max(0, Math.min(1, c.b));
    box.style.left = (l * 100) + '%'; box.style.top = (t * 100) + '%';
    box.style.width = ((r - l) * 100) + '%'; box.style.height = ((b - t) * 100) + '%';
  }
  function setSlider(k, value, label, inert) {
    var s = sliders[k];
    s.input.value = value;   // safe mid-drag: the value coming back is the one the drag just set
    s.out.textContent = label;
    s.input.disabled = !!inert;
    s.row.classList.toggle('is-inert', !!inert);
  }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ---------- Frames ----------
  function sizeFrames() {
    var d = state.frames.d, m = state.frames.m;
    [[el.frameD, d], [el.frameM, m]].forEach(function (pair) {
      var f = pair[0], s = pair[1];
      f.width = s.w; f.height = s.h; f.style.width = s.w + 'px'; f.style.height = s.h + 'px';
    });
    // The phone sections must be exactly as wide as their iframe or their caption row decides the wrap.
    $$('.frame--phone').forEach(function (sec) { sec.style.width = m.w + 'px'; });
    $('[data-cap="d"]').textContent = 'Laptop · ' + d.w + ' × ' + d.h;
    $('[data-cap="m"]').textContent = 'Phone · ' + m.w + ' × ' + m.h + ' (100vh = ' + m.lvh + ')';
    fit();
  }
  // Scale the laptop frame to sit beside the phone frame(s); below 40% let them wrap under it instead.
  function fit() {
    var W = Math.floor(el.frames.getBoundingClientRect().width);
    var d = state.frames.d, m = state.frames.m;
    var phones = (m.w + 32) * (pinnedState ? 2 : 1);
    var s = Math.min(1, (W - phones - 1) / d.w);   // 1px slack so an exact fit never wraps on rounding
    if (s < 0.4) s = Math.min(1, W / d.w);
    el.wrapD.style.width = Math.floor(d.w * s) + 'px';
    el.wrapD.style.height = Math.floor(d.h * s) + 'px';
    el.frameD.style.transform = 'scale(' + s + ')';
    el.scaleD.textContent = Math.round(s * 100) + '%';
  }

  // Pin a frozen copy of the phone frame so two candidates can be compared side by side.
  function pin() {
    var v = derive();
    pinnedState = { label: v.P.label, file: v.P.file };
    el.pinnedFrame.width = state.frames.m.w; el.pinnedFrame.height = state.frames.m.h;
    el.pinnedFrame.style.width = state.frames.m.w + 'px'; el.pinnedFrame.style.height = state.frames.m.h + 'px';
    el.pinnedFrame.src = queryFor(v.applied, { mb: phoneBleed(), frozen: 1 });
    el.pinnedCap.textContent = 'Pinned · ' + v.P.label;
    el.pinned.hidden = false;
    fit();
  }
  function unpin() {
    pinnedState = null;
    el.pinnedFrame.removeAttribute('src');
    el.pinned.hidden = true;
    fit();
  }

  // ---------- Events ----------
  function buildGrid() {
    el.grid.innerHTML = '';
    PHOTOS.forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'thumb'; b.setAttribute('data-thumb', p.file);
      b.title = p.file; b.setAttribute('aria-label', p.label);
      var img = document.createElement('img');
      img.src = p.path; img.alt = ''; img.decoding = 'async';
      img.addEventListener('load', function () {
        dims[p.file] = { w: img.naturalWidth, h: img.naturalHeight };
        if (state.photo === p.file) render();
      });
      b.appendChild(img);
      if (p.current) { var t = document.createElement('span'); t.className = 'tag'; t.textContent = 'Current'; b.appendChild(t); }
      b.addEventListener('click', function () { state.photo = p.file; render(); });
      el.grid.appendChild(b);
    });
  }

  Object.keys(sliders).forEach(function (k) {
    sliders[k].input.addEventListener('input', function (e) {
      var cur = state.s[state.photo];
      var val = parseFloat(e.target.value);
      if (k === 'dz') { cur.dz = val; delete cur.dsLit; }
      else if (k === 'mz') { cur.mz = val; delete cur.msLit; }
      else cur[k] = val;
      render();
    });
  });
  Object.keys(toggles).forEach(function (k) {
    toggles[k].addEventListener('change', function (e) { state[k] = e.target.checked; render(); });
  });
  el.motion.addEventListener('change', function (e) { state.motion = e.target.value; render(); });
  el.presetD.addEventListener('change', function (e) { state.frames.d = parsePreset(e.target.value); sizeFrames(); render(); });
  el.presetM.addEventListener('change', function (e) { state.frames.m = parsePreset(e.target.value); sizeFrames(); render(); });
  el.resetPhoto.addEventListener('click', function () { state.s[state.photo] = defaultsFor(state.photo); render(); });
  el.resetAll.addEventListener('click', function () {
    if (!window.confirm('Reset every photo’s framing, the viewport presets and the layers to what the live site ships?')) return;
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    state = fresh(); sizeFrames(); render();
  });
  el.copy.addEventListener('click', function () {
    var text = el.css.textContent;
    function ok() { el.status.textContent = 'Copied to clipboard.'; }
    function fallback() {
      // No async clipboard (plain http over the LAN): select the block and try the legacy command.
      var sel = window.getSelection(), r = document.createRange();
      r.selectNodeContents(el.css); sel.removeAllRanges(); sel.addRange(r);
      var done = false;
      try { done = document.execCommand('copy'); } catch (e) { done = false; }
      el.status.textContent = done ? 'Copied to clipboard.' : 'Clipboard blocked — the CSS is selected, press ⌘C.';
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
      else fallback();
    } catch (e) { fallback(); }
  });
  el.pin.addEventListener('click', pin);
  el.unpin.addEventListener('click', unpin);
  window.addEventListener('message', function (e) {
    if (e.origin !== location.origin) return;
    if (e.data && e.data.type === 'hero-picker-ready') render();
  });
  window.addEventListener('resize', fit);

  // ---------- Go ----------
  buildGrid();
  sizeFrames();
  var first = derive();
  el.frameD.src = queryFor(first.applied);                        // first paint is already right;
  el.frameM.src = queryFor(first.applied, { mb: phoneBleed() });  // postMessage keeps it live after that
  render();
})();
