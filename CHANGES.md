# Changes

Summary of design changes applied during this iteration session.

## Hero

- **Photo swapped to `we_r_pretty.jpg`** (sunset/formal portrait, both faces, Montreal skyline).
- **`.below` section deleted** ("I · A Note From Us" pull-quote, body copy, supporting figure) — the page is now hero → Section II → footer.
- Photo grading retuned for the new photo: `brightness(0.55) contrast(1.08) saturate(0.92) sepia(0.05) hue-rotate(0deg)`. Less sepia, no hue-rotate — golden hour photo is already warm.
- Hero focal point: `center 18%` to anchor faces.
- `.hero-photo` bottom buffer expands dynamically via `var(--hero-photo-bottom, -50vh)` so the parallax can't expose the dark hero base.
- `.hero-overlay` gains an oxblood-tinted top dome over the base linear darkening.
- Film grain layer over the hero via `.hero::before`.

## Mobile

- **Mobile media query (≤720px)** locks the photo to `background-size: 115%`, `background-position: 74% 20%` — keeps both faces in frame on portrait viewports.
- **Mobile parallax** reduced to `0.10` (vs `0.35` on desktop) via `window.matchMedia` in `main.js` so the photo doesn't scroll its way out of frame.
- Hero names stack as **Amanda / & / Francis** centered, with the ampersand glyph translated to land on the optical midline.

## Palette (Crew Collective vault tones)

- Replaced raspberry-pink `--gilt` (`#8B2B3A`) with **burnished brass** (`#B5894A`).
- Warmed surfaces: `--base #15110D`, `--inset #23170F`, `--deep #0A0705`.
- Travertine-cream type tier (`--ink #F1E6CC`, `--ink-whisper #C8B596`, `--ink-muted #998260`).
- New **oxblood** tokens: `--oxblood`, `--oxblood-deep`, `--oxblood-light`, `--oxblood-glow`.
- `::selection` swapped from brass to oxblood — the only place wedding-red surfaces by default.

## Masthead

- Title size bumped to `1.875rem` (was `1.5rem`), scrolled state shrinks back to `1.5rem`.
- Tagline removed from masthead chrome; new `wedding.masthead_sub` config key (defaults hidden).
- Optional `.masthead__mark` decorative-rule system under the A&F monogram (hairline / double / bracket / fleuron — disabled by default).

## Section II — "The Day"

- New fact grid (When / Where / Address), parallel small-caps labels, brass dividers.
- Detail rows mirror each primary as a temporal/geographic zoom-out:
  - When: "Saturday, August 7" → "Two Thousand Twenty-Seven"
  - Where: "Crew Collective" → "Est. 1928"
  - Address: "360 Rue Saint-Jacques" → "Old Montréal · Québec"

## Footer

- Replaced the bare two-line footer with a back-of-invitation signature: brass rule + italic `married.af` wordmark + venue address + contact + tiny copyright.

## Typography modes

- New body classes `italic-mode-italic` (default no-op), `italic-mode-roman`, `italic-mode-caps` for future typography iterations without code changes.

## JS

- `assets/js/main.js`: parallax factor is now mutable via `window.__heroParallaxFactor` (with `getFactor()` defaulting to `0.10` mobile / `0.35` desktop) and exposes `window.__heroParallaxUpdate` for live nudging.

## Dates

- Site-wide 2026 → 2027 sweep.
- New `wedding.date_year` config key for inline composition.

## Files touched

- `_config.yml`
- `_includes/footer.html` (rewrite)
- `_includes/masthead.html`
- `_sass/_base.scss` (selection color)
- `_sass/_components.scss` (masthead, names mobile, footer, Section II, hero-stamp, italic modes)
- `_sass/_layouts.scss` (hero-photo, hero-overlay, film grain, mobile reframing)
- `_sass/_tokens.scss` (palette, photo filter)
- `assets/js/main.js` (parallax mutability + viewport-conditional factor)
- `index.md` (Section II, names spans, footer copy, deleted `.below` section)
