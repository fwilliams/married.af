/**
 * hero-picker.js — DEV ONLY. Never loaded in normal browsing.
 *
 * default.html injects this only in non-production builds and only when the
 * URL carries ?hero-picker. It drives the hero photo through the custom
 * properties _layouts.scss already reads (--hero-photo, --desktop-bg-*,
 * --mobile-bg-*, --hero-photo-bottom), so what renders is the production CSS
 * with different values — nothing else about the page changes.
 *
 * State arrives, in priority order for the first paint: the URL query
 * (?photo=…&ds=…&dx=…), then localStorage (the last state /picker/ saved).
 * After that, live updates come from /picker/ via postMessage (when this page
 * is one of its iframes) or via the storage event (when it's a standalone tab).
 * ?frozen=1 keeps the first paint and ignores later updates (pinned frames).
 */
(function () {
  'use strict';

  var KEY = 'hero-picker-state';
  var FIELDS = ['photo', 'ds', 'dx', 'dy', 'ms', 'mx', 'my', 'mb', 'grade', 'motion', 'text'];
  var photo, hero;

  // Layer toggles — the picker's only additions to the page's CSS. The two
  // frozen Ken Burns states are the animation's own keyframes (_motion.scss).
  var style = document.createElement('style');
  style.textContent =
    '.hero.hp-nograde .hero-overlay,.hero.hp-nograde::before{display:none}' +
    '.hero.hp-nograde .hero-photo{filter:none}' +
    '.hero.hp-still .hero-photo{animation:none;transform:scale(1.03)}' +
    '.hero.hp-end .hero-photo{animation:none;transform:scale(1.13) translate3d(-1.5%,-2.5%,0)}' +
    '.hp-notext .masthead,.hero.hp-notext .centerpiece,.hero.hp-notext .teaser{visibility:hidden}';
  document.head.appendChild(style);

  function off(v) { return v === false || v === 0 || v === '0' || v === 'false'; }
  function pct(v) { return (v == null || v === '') ? null : String(v).replace('%', '') + '%'; }
  function setOr(st, name, v) { if (v == null || v === '') st.removeProperty(name); else st.setProperty(name, v); }

  function apply(s) {
    if (!photo || !s) return;
    var st = photo.style;
    if (s.photo) st.setProperty('--hero-photo', 'url("' + s.photo + '")'); else st.removeProperty('--hero-photo');
    setOr(st, '--desktop-bg-size', s.ds);
    setOr(st, '--desktop-bg-x', pct(s.dx));
    setOr(st, '--desktop-bg-y', pct(s.dy));
    setOr(st, '--mobile-bg-size', s.ms);
    setOr(st, '--mobile-bg-x', pct(s.mx));
    setOr(st, '--mobile-bg-y', pct(s.my));
    // Only the picker's phone iframe sends this: it makes the iframe's photo box
    // as tall as a real iPhone's, where 100vh is the toolbar-hidden viewport.
    if ('mb' in s) setOr(st, '--hero-photo-bottom', s.mb);
    var motion = off(s.motion) ? 'start' : (s.motion || 'on');
    hero.classList.toggle('hp-nograde', off(s.grade));
    hero.classList.toggle('hp-still', motion === 'start');
    hero.classList.toggle('hp-end', motion === 'end');
    hero.classList.toggle('hp-notext', off(s.text));
    document.documentElement.classList.toggle('hp-notext', off(s.text));
  }

  function fromQuery() {
    var q = new URLSearchParams(location.search);
    if (!q.has('photo') && !q.has('ds')) return null;
    var s = {};
    FIELDS.forEach(function (k) { if (q.has(k)) s[k] = q.get(k); });
    return s;
  }
  function fromStorage() {
    try { var v = JSON.parse(localStorage.getItem(KEY)); return v && v.applied ? v.applied : null; }
    catch (e) { return null; }
  }

  function init() {
    photo = document.querySelector('.hero-photo');
    hero  = document.querySelector('.hero');
    if (!photo || !hero) return;

    apply(fromQuery() || fromStorage());
    if (new URLSearchParams(location.search).get('frozen') === '1') return;

    window.addEventListener('message', function (e) {
      if (e.origin !== location.origin) return;
      var d = e.data;
      if (d && d.type === 'hero-picker') apply(d.state);
    });
    if (window.parent !== window) {
      // Embedded in /picker/: driven by postMessage alone. Tell the panel we exist
      // so it pushes its current state straight away.
      window.parent.postMessage({ type: 'hero-picker-ready' }, location.origin);
    } else {
      // Standalone tab: follow whatever /picker/ last saved.
      window.addEventListener('storage', function (e) {
        if (e.key === KEY) apply(fromStorage());
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
