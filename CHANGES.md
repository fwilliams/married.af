# Changes

Summary of design changes applied during this iteration session.

## Palette (Crew Collective vault tones)

- Replaced the raspberry-pink `--gilt` (`#8B2B3A`) with **burnished brass** (`#B5894A`).
- Warmed surfaces: `--base #15110D`, `--inset #23170F`, `--deep #0A0705`.
- Travertine-cream type tier (`--ink #F1E6CC`, `--ink-whisper #C8B596`, `--ink-muted #998260`).
- Introduced **oxblood** as a structural accent token (`--oxblood`, `--oxblood-deep`, `--oxblood-light`, `--oxblood-glow`).
- Reduced sepia and removed the cool hue-rotate from `--photo-filter` so the hero reads candlelit, not wintry.
- `::selection` swapped from brass to oxblood — the only place wedding-red surfaces by default.

## Hero

- `.hero-photo` bottom buffer extended via `var(--hero-photo-bottom, -50vh)` so the parallax can't expose the hero base on scroll.
- Mobile reframing: `background-position` shifts right (`70% 55%` ≤ 720px, `72% 60%` ≤ 420px) so both faces sit inside the portrait crop.
- `.hero-overlay` gains an oxblood-tinted top dome over the base linear darkening.
- `.hero::before` adds a subtle film-grain layer for material texture.

## Masthead

- Title bumped to `1.875rem` (was `1.5rem`), with a scrolled-state shrink back to `1.5rem`.
- Tagline removed from the masthead; introduced `wedding.masthead_sub` config key (defaults hidden).
- Added optional `.masthead__mark` decorative-rule system under the A&F monogram (hairline / double / bracket / fleuron — disabled by default).

## Names

- Hero names wrapped in `.names__word` spans so they can stack as three lines on narrow viewports.
- Mobile (≤520px) renders **Amanda / & / Francis** centered, with the ampersand glyph translated to land on the optical midline.

## Section II — "The Day"

- New fact grid (When / Where / Address), parallel small-caps labels, brass dividers.
- Detail rows mirror each primary as a temporal/geographic zoom-out:
  - When: "Saturday, August 7" → "Two Thousand Twenty-Seven"
  - Where: "Crew Collective" → "Est. 1928"
  - Address: "360 Rue Saint-Jacques" → "Old Montréal · Québec"

## Footer

- Replaced the bare two-line footer with a back-of-invitation signature: brass rule + italic `married.af` wordmark + venue address + contact + tiny copyright.

## Typography modes

- New body classes `italic-mode-italic` (default no-op), `italic-mode-roman`, and `italic-mode-caps` for future typography iterations without code changes.

## JS

- `assets/js/main.js`: parallax factor is now mutable via `window.__heroParallaxFactor` (default `0.35`) and exposes `window.__heroParallaxUpdate` for live nudging.

## Year + dates

- Site-wide 2026 → 2027 sweep.
- New `wedding.date_year` config key for inline composition.

## Files touched

- `_config.yml`
- `_includes/footer.html` (rewrite)
- `_includes/masthead.html`
- `_layouts/default.html` (no changes — kept for completeness)
- `_sass/_base.scss` (selection color)
- `_sass/_components.scss` (masthead, names mobile, footer, Section II, hero-stamp, italic modes)
- `_sass/_layouts.scss` (hero-photo, hero-overlay, film grain, mobile reframing)
- `_sass/_tokens.scss` (palette, photo filter)
- `assets/js/main.js` (parallax mutability)
- `index.md` (Section II, names spans, footer copy)

## Notes for review

- The tagline in `index.md` is "An evening of candlelight, music, and the people we love." — same as the committed version. (A separate phrase, "A candlelit celebration, across a border and two summers in the making," was present in an older `_site/` build; not adopted here.)
- The Tweaks panel and other preview-only files (`mobile.html`, `compare.html`, `wedding-tweaks.jsx`, etc.) are **not** part of this export. They lived only in the local design iteration sandbox.
