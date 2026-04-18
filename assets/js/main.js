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
  // Subtle: hero photo moves at 35% of scroll speed while hero is on-screen.
  // Paired with Ken Burns for layered motion. Disabled under reduced-motion.
  (function heroParallax() {
    if (reduceMotion) return;
    var hero = document.querySelector('.hero');
    var layer = document.querySelector('.hero-parallax');
    if (!hero || !layer) return;

    var ticking = false;
    var factor = 0.35;

    function update() {
      var heroRect = hero.getBoundingClientRect();
      // Only drive parallax while the hero is in or near the viewport.
      if (heroRect.bottom < -200 || heroRect.top > window.innerHeight + 200) {
        ticking = false;
        return;
      }
      var offset = window.scrollY * factor;
      // Translate the parallax wrapper; Ken Burns runs independently on .hero-photo.
      layer.style.transform = 'translate3d(0, ' + (-offset) + 'px, 0)';
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
