/**
 * main.js — vanilla, deferred, respects prefers-reduced-motion.
 *
 * Three behaviours:
 *  1. Masthead scroll-collapse (adds .is-scrolled past 60px)
 *  2. Hero parallax (~35% of scroll speed, via requestAnimationFrame)
 *  3. IntersectionObserver reveal (.on-scroll → .is-visible)
 *
 * Bundle weight: ~1.2 KB minified. No dependencies.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -------- Masthead scroll-collapse --------
  (function mastheadScroll() {
    var masthead = document.getElementById('masthead');
    if (!masthead) return;
    var ticking = false;
    function update() {
      masthead.classList.toggle('is-scrolled', window.scrollY > 60);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  })();

  // -------- Hero parallax --------
  // Subtle: hero photo moves at <factor>% of scroll speed while hero is on-screen.
  // Factor is mutable at runtime via window.__heroParallaxFactor so the Tweaks
  // panel can tune it live. Default 0.35. Paired with Ken Burns for layered
  // motion. Disabled under reduced-motion.
  (function heroParallax() {
    if (reduceMotion) return;
    var hero = document.querySelector('.hero');
    var layer = document.querySelector('.hero-parallax');
    if (!hero || !layer) return;

    var ticking = false;
    function getFactor() {
      if (window.__heroParallaxFactor != null) return window.__heroParallaxFactor;
      // Mobile viewports get a much lighter parallax so the framed photo
      // doesn't scroll its way out of the visible crop.
      return window.matchMedia('(max-width: 720px)').matches ? 0.10 : 0.35;
    }

    function update() {
      var heroRect = hero.getBoundingClientRect();
      if (heroRect.bottom < -200 || heroRect.top > window.innerHeight + 200) {
        ticking = false;
        return;
      }
      var offset = window.scrollY * getFactor();
      layer.style.transform = 'translate3d(0, ' + (-offset) + 'px, 0)';
      ticking = false;
    }
    // Expose a way for the Tweaks panel to nudge an immediate update.
    window.__heroParallaxUpdate = function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  })();

  // -------- Mobile nav sheet (toggle / close / Esc / focus) --------
  (function navSheet() {
    var toggle = document.getElementById('nav-toggle');
    var sheet  = document.getElementById('nav-sheet');
    var close  = document.getElementById('nav-close');
    if (!toggle || !sheet) return;

    var lastFocus = null;

    function openSheet() {
      lastFocus = document.activeElement;
      sheet.classList.add('is-open');
      sheet.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      // Move focus into the sheet (first link)
      var first = sheet.querySelector('a, button');
      if (first) first.focus();
    }
    function closeSheet() {
      sheet.classList.remove('is-open');
      sheet.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      // Return focus to the trigger
      if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
      } else {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') closeSheet();
      else openSheet();
    });
    if (close) close.addEventListener('click', closeSheet);

    // Esc closes; also Tab cycles within the sheet (simple focus trap)
    document.addEventListener('keydown', function (e) {
      if (!sheet.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); closeSheet(); return; }
      if (e.key === 'Tab') {
        var focusables = sheet.querySelectorAll('a, button');
        if (!focusables.length) return;
        var first = focusables[0];
        var last  = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Clicking a link closes the sheet before navigation (snappier UX on fast pages)
    sheet.querySelectorAll('.nav-sheet__list a').forEach(function (a) {
      a.addEventListener('click', closeSheet);
    });

    // Close if window grows past the mobile breakpoint while sheet is open
    var mq = window.matchMedia('(min-width: 721px)');
    if (mq.addEventListener) {
      mq.addEventListener('change', function (e) {
        if (e.matches && sheet.classList.contains('is-open')) closeSheet();
      });
    }
  })();

  // -------- Scroll-triggered reveal --------
  (function onScrollReveal() {
    var targets = document.querySelectorAll('.on-scroll');
    if (!targets.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -5% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  })();

})();
