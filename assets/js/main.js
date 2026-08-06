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
  // -------- Add to Calendar — chooser modal (Google / Apple / Outlook / Office 365 / Yahoo) --------
  // There is no single universal "add to my calendar" link: Google/Outlook/Yahoo
  // each take their own pre-filled web URL, and Apple Calendar can only ingest an
  // .ics file. So we offer a chooser and build the right link per service from one
  // source of truth (the countdown's target + duration).
  (function addToCalendar() {
    var triggers = [document.getElementById('addToCal'), document.getElementById('saveTheDate')].filter(Boolean);
    var modal = document.getElementById('cal-modal');
    var cd = document.getElementById('countdown');
    if (!triggers.length || !modal || !cd) return;

    var start = new Date(cd.dataset.target);
    if (isNaN(start.getTime())) return;
    var hours = parseInt(cd.dataset.duration, 10) || 10;   // 5 PM → 3 AM
    var end = new Date(start.getTime() + hours * 3600 * 1000);

    var TITLE    = 'Amanda & Francis Wedding';
    var DETAILS  = 'Visit https://married.af for updates or email us at amandafrancis@married.af with any questions.';
    var LOCATION = 'Crew Collective, 360 Rue Saint-Jacques, Old Montréal, QC';

    var e = encodeURIComponent;
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    // Compact UTC stamp YYYYMMDDTHHMMSSZ — Google, Yahoo, and the .ics body.
    function stamp(d) {
      return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' +
             pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z';
    }
    // ISO-8601 UTC without milliseconds — Outlook / Office 365 deeplinks.
    function iso(d) { return d.toISOString().replace(/\.\d{3}Z$/, 'Z'); }
    // RFC 5545 text escaping for the .ics fields.
    function esc(s) { return String(s).replace(/[\\,;]/g, '\\$&').replace(/\n/g, '\\n'); }

    var ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//married.af//Amanda & Francis//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:amanda-francis-2027@married.af',
      'DTSTAMP:' + stamp(new Date()),
      'DTSTART:' + stamp(start),
      'DTEND:' + stamp(end),
      'SUMMARY:' + esc(TITLE),
      'DESCRIPTION:' + esc(DETAILS),
      'LOCATION:' + esc(LOCATION),
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    var icsHref = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);

    var compose = 'path=/calendar/action/compose&rru=addevent';
    var hrefs = {
      'cal-google': 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + e(TITLE) + '&dates=' + stamp(start) + '/' + stamp(end) +
        '&details=' + e(DETAILS) + '&location=' + e(LOCATION),
      'cal-apple': icsHref,
      'cal-outlook': 'https://outlook.live.com/calendar/0/deeplink/compose?' + compose +
        '&subject=' + e(TITLE) + '&startdt=' + e(iso(start)) + '&enddt=' + e(iso(end)) +
        '&body=' + e(DETAILS) + '&location=' + e(LOCATION),
      'cal-office365': 'https://outlook.office.com/calendar/0/deeplink/compose?' + compose +
        '&subject=' + e(TITLE) + '&startdt=' + e(iso(start)) + '&enddt=' + e(iso(end)) +
        '&body=' + e(DETAILS) + '&location=' + e(LOCATION),
      'cal-yahoo': 'https://calendar.yahoo.com/?v=60&title=' + e(TITLE) +
        '&st=' + stamp(start) + '&et=' + stamp(end) +
        '&desc=' + e(DETAILS) + '&in_loc=' + e(LOCATION)
    };
    Object.keys(hrefs).forEach(function (id) {
      var a = document.getElementById(id);
      if (!a) return;
      a.href = hrefs[id];
      if (id === 'cal-apple') a.setAttribute('download', 'amanda-and-francis.ics');
    });

    // ---- Modal open / close (mirrors navSheet) ----
    var closeBtn = document.getElementById('cal-modal-close');
    var lastFocus = null;
    function openModal() {
      lastFocus = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('cal-open');
      if (closeBtn) closeBtn.focus();
    }
    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('cal-open');
      if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    triggers.forEach(function (t) {
      t.setAttribute('aria-haspopup', 'dialog');
      t.addEventListener('click', function (ev) { ev.preventDefault(); openModal(); });
    });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    // Click on the backdrop (outside the card) closes.
    modal.addEventListener('click', function (ev) { if (ev.target === modal) closeModal(); });
    // Picking a calendar closes the chooser once the link has fired.
    modal.querySelectorAll('.cal-opt').forEach(function (a) {
      a.addEventListener('click', function () { window.setTimeout(closeModal, 0); });
    });
    // Esc closes; Tab cycles within the modal (simple focus trap).
    document.addEventListener('keydown', function (ev) {
      if (!modal.classList.contains('is-open')) return;
      if (ev.key === 'Escape') { ev.preventDefault(); closeModal(); return; }
      if (ev.key === 'Tab') {
        var f = modal.querySelectorAll('a, button');
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
        else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
      }
    });
  })();

  // -------- Footer staggered reveal (replays on scroll-back) --------
  (function footerReveal() {
    var footer = document.querySelector('.footer[data-reveal]');
    if (!footer) return;
    // No JS-animation path → show everything, skip the hidden state entirely.
    if (reduceMotion || !('IntersectionObserver' in window)) { footer.classList.add('is-revealed'); return; }
    footer.classList.add('is-armed'); // enables the CSS hidden start state
    function replayOn() { return document.documentElement.dataset.footReplay !== '0'; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.intersectionRatio >= 0.18) footer.classList.add('is-revealed');
        else if (!e.isIntersecting && replayOn()) footer.classList.remove('is-revealed');
        // partially visible (0–18%): hold current state (hysteresis)
      });
    }, { threshold: [0, 0.18] });
    io.observe(footer);
  })();

})();
