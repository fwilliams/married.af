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

  // -------- Section parallax (generic; honors reduced-motion) --------
  // Any [data-parallax="N"] element drifts at intensity N against scroll.
  (function sectionParallax() {
    if (reduceMotion) return;
    var items = [].slice.call(document.querySelectorAll('[data-parallax]'));
    if (!items.length) return;
    var ticking = false;
    function update() {
      var vh = window.innerHeight;
      for (var i = 0; i < items.length; i++) {
        var el = items[i];
        var rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) continue;
        var center = rect.top + rect.height / 2;
        var delta = (center - vh / 2) / vh;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.1;
        el.style.transform = 'translate3d(0,' + (delta * speed * -100).toFixed(2) + 'px,0)';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  // -------- Countdown (Days / Hours / Minutes / Seconds) --------
  (function countdown() {
    var grid = document.getElementById('countdown');
    if (!grid) return;
    var target = new Date(grid.dataset.target).getTime();
    if (isNaN(target)) return;
    var els = {
      days:    grid.querySelector('[data-unit="days"]'),
      hours:   grid.querySelector('[data-unit="hours"]'),
      minutes: grid.querySelector('[data-unit="minutes"]'),
      seconds: grid.querySelector('[data-unit="seconds"]')
    };
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        els.days.textContent = '0'; els.hours.textContent = '00'; els.minutes.textContent = '00';
        if (els.seconds) els.seconds.textContent = '00';
        return;
      }
      var s = Math.floor(diff / 1000);
      els.days.textContent    = Math.floor(s / 86400);
      els.hours.textContent   = pad(Math.floor((s % 86400) / 3600));
      els.minutes.textContent = pad(Math.floor((s % 3600) / 60));
      if (els.seconds) els.seconds.textContent = pad(s % 60);
    }
    tick();
    setInterval(tick, 1000);
  })();

  // -------- Add to Calendar — universal .ics (Apple / Google / Outlook) --------
  (function addToCalendar() {
    var links = [document.getElementById('addToCal'), document.getElementById('saveTheDate')].filter(Boolean);
    var cd = document.getElementById('countdown');
    if (!links.length || !cd) return;
    var start = new Date(cd.dataset.target);
    if (isNaN(start.getTime())) return;
    var hours = parseInt(cd.dataset.duration, 10) || 10;   // 5 PM → 3 AM
    var end = new Date(start.getTime() + hours * 3600 * 1000);
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function fmt(d) {
      return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' +
             pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + '00Z';
    }
    var ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//married.af//Amanda & Francis//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:amanda-francis-2027@married.af',
      'DTSTAMP:' + fmt(new Date()),
      'DTSTART:' + fmt(start),
      'DTEND:' + fmt(end),
      'SUMMARY:Amanda & Francis — Wedding',
      'DESCRIPTION:An evening of candlelight, music, and the people we love. married.af',
      'LOCATION:Crew Collective\\, 360 Rue Saint-Jacques\\, Old Montréal\\, QC',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    var href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
    links.forEach(function (a) { a.href = href; });
  })();

})();
