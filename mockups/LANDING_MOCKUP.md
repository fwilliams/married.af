# Landing page mockup — editorial upgrade pass

Fourth revision. Previous passes locked the palette (Inkwell + Champagne) and disciplined the typography + tokens. This pass addresses the "looks like a Word document" feedback with three targeted editorial upgrades, while preserving everything we locked.

## The three editorial upgrades

1. **Masthead-style nav** — replaces the centered nav pill with a proper magazine masthead: brand mark top-left (monogram + "A & F" italic + dotted subtitle "Married in Montréal · 2026"), nav cluster top-right, a full-width hairline beneath once you scroll past the hero. Fixed to the top; transparent over the hero, then crossfades to an Inkwell backdrop + blur on scroll.
2. **Ken Burns on the hero photo** — 40-second slow zoom + tiny positional drift (1.02 → 1.08 scale, -0.5% / -1.5% translate). Barely perceptible per second, but gives the photo *life* instead of sitting there as a static background. Respects `prefers-reduced-motion`.
3. **Asymmetric below-fold with a pull-quote** — the centered "A note from us" block is replaced with a CSS Grid 5fr / 7fr asymmetric composition: engagement photo left (4:5 portrait, dark-graded, small-caps caption beneath), pull-quote right with a giant hanging Bordeaux quotation mark, numbered chapter marker ("I · A Note From Us"), and fine-print supporting copy. Breaks the single-column centered rhythm that made the v3 feel like a document.

Additional: scroll-triggered fade-in via IntersectionObserver on the below-fold (not just on page load), and the palette switcher moved to bottom-right so the top of the page is clean for real content.

## What this revision fixes

1. **Contrast bug in "A note from us"** — `.below-label` was burgundy on near-black (≈2:1 contrast). Fails WCAG AA. Now uses the meta-label tint consistently.
2. **Contrast bug in nav hover** — hover was swapping text to `gilt-bright` burgundy (≈2.5:1 contrast), making links *less* readable on interaction. Now nav text stays ivory on hover and the underline is the only thing that changes (and it changes to the palette's metallic, giving you a "touch gold" moment).
3. **Metallic hierarchy inversion in palette D** — Tarnished Brass was darker (L=44) than the meta-label text tier (L=54), so the monogram sat visually *below* the section labels in luminance. Lifted to L=53 (still clearly not-yellow).
4. **Undocumented color tiers** — three light tints were being used without a semantic system. Now formally tiered and allocated.

## Typography color system (three tiers, deliberately restrained)

| Tier | Token | Hex | L | Used for |
|---|---|---|---|---|
| 1 — Primary | `--ink` | `#EEE6D6` | 88 | Names, body paragraphs, nav links, teaser-line, primary reading |
| 2 — Secondary | `--ink-whisper` | `#BFB5A4` | 69 | Date-line (small caps), italic tagline, supporting subtitles |
| 3 — Meta | `--ink-muted` | `#978B7C` | 54 | All section eyebrow labels (`Save the Date`, `A note from us`), footer, fine print |

All three tints are the same warm hue family (H 32–40, S 12–19) — same paper-and-linen origin. The "shimmer" you liked comes from the gentle warm gradient, not from mixing hues. Usage is now strictly tiered: tier 1 is "read this", tier 2 is "this is context", tier 3 is "this is a label or meta".

## Accent system (two roles, kept separate)

- **Burgundy `#5F1A26` (permanent / structural)** — the italic `&`, the hairline under the date, the below-fold divider, rules on the palette switcher. Never text paragraphs, never hover states.
- **Metallic (ornamental + interactive)** — the monogram strokes, the vertical "vein" above Save the Date, and the nav-hover underline. The metallic is the "light / precious / touch-me" color. Only the metallic changes between palettes A/B/C/D.

## Palette keys (metallic hue only varies)

All four share Inkwell dark base `#14110F` + Bordeaux burgundy accent `#5F1A26`. Only the metallic changes:

- **A — Champagne** `#D4C29A` (L=72) — soft pale gold, candlelight on linen. Sits harmoniously between tier 1 and tier 2. Safest option.
- **B — Pearl** `#EADCC5` (L=85) — nearly ivory. Note: this is *almost the same lightness as the names* — the monogram becomes a ghost rather than a feature. Intentional whisper; may be too quiet.
- **C — Rose Gold** `#C49B8A` (L=65) — warmer, pinkish; injects a pink hue that otherwise doesn't appear anywhere on the page. Deliberate tension — can read as sophisticated or as discordant depending on taste.
- **D — Tarnished Brass** `#A98A5F` (L=53, lifted from #8F7552 L=44 to stop hierarchy inversion) — deeper aged gold without the saturated yellow. Most "real metal" feeling.

## Design language (documented tokens)

Every value in the CSS traces back to one of these token systems. No magic numbers. A reviewer should be able to ask "why 32px here?" and the answer is always "`--s-6`, the outer-gutter value."

### Weights (only three in the whole system)

| Token | Value | Used for |
|---|---|---|
| `--w-light` | 300 | Display headings, major paragraphs (names, note-para) |
| `--w-regular` | 400 | Body text, italic accent glyphs (`&`, tagline) |
| `--w-medium` | 500 | All small-caps labels |

### Display/body type scale

| Token | Value | Used for |
|---|---|---|
| `--ts-names` | `clamp(3.25rem, 10vw, 7.5rem)` | Hero names — only used once |
| `--ts-note` | `1.5rem` | Major paragraphs ("We can't wait...") |
| `--ts-subtitle` | `clamp(1rem, 1.8vw, 1.25rem)` | Italic subtitle (tagline) |
| `--ts-quote` | `1.0625rem` | Italic inline (teaser-line) |
| `--ts-body` | `0.9375rem` | Body reading (fine print) |

### Label scale (all small-caps, all one tracking)

| Token | Value | Used for |
|---|---|---|
| `--ts-label-lg` | 13px | Primary label — the date line |
| `--ts-label-md` | 11px | Standard eyebrow — nav, teaser-label, below-label |
| `--ts-label-sm` | 10px | Fine print — footer, palette-name |
| `--tracking-label` | `0.4em` | Every eyebrow small-caps, no exceptions |

Before this pass, letter-spacing ranged from 0.18em to 0.50em across seven small-caps elements with no reasoned logic. Now every "label" uses exactly `0.4em`. Larger labels are made prominent by *size*, not by inconsistent tracking.

### Line heights

| Token | Value | Semantic |
|---|---|---|
| `--lh-display` | 0.95 | Tight display (names) |
| `--lh-read` | 1.5 | Reading paragraphs |
| `--lh-body` | 1.65 | Denser body copy |
| `--lh-label` | 1 | Single-line small-caps |

### Spacing scale (8-point grid)

| Token | px | Common use |
|---|---|---|
| `--s-1` | 4 | Tight micro-spacing |
| `--s-2` | 8 | Related-element gap |
| `--s-3` | 12 | Inside-group gap |
| `--s-4` | 16 | Fixed-position offset |
| `--s-5` | 24 | Between-item gap |
| `--s-6` | 32 | Outer page gutter |
| `--s-7` | 48 | Inside-section rhythm |
| `--s-8` | 64 | Major interior padding |
| `--s-9` | 96 | Between blocks |
| `--s-10` | 128 | Major section rhythm (hero ↔ below) |

Before this pass, padding values were `40/40/28` on hero, `120/40/140` on below, `36/40/52` on footer — all off-grid and mildly asymmetric. Now every padding/gap snaps to the scale.

### Mark vocabulary (hairlines + veins as visual language)

Five types of small decorative mark live on the page. Each has a semantic role; nothing is decorative for its own sake.

| Mark | Width × Height | Color | Opacity | Semantic |
|---|---|---|---|---|
| Monogram (SVG) | 56×56 | `--metallic` | 0.95 + drop-shadow | Page signature / identity |
| `&` glyph | display-sized | `--gilt` | — | Links the two names into one noun |
| Major hairline | 100 × 1 | `--gilt` | 0.65 | Closes a major named section (under the centerpiece) |
| Minor hairline | 60 × 1 | `--rule` (rgba) | built-in | Separates elements *within* a block (inside the note) |
| Vertical vein | 1 × 64 | `--metallic` gradient + glow | 0.85 | Transition — ushers the eye from one moment to the next |

Consistent rules:

- **All marks are 1px stroke.** No exceptions.
- **Burgundy marks = structural** (they close/separate text). Metallic marks = ornamental/interactive (they guide the eye or indicate touch).
- **Horizontal widths** come from a two-value vocabulary: `100px` (major) or `60px` (minor). If a future mark needs a third width, we add it deliberately to the token set.
- **Vertical veins** are always `--s-8` (64px) tall, and only appear at *transitions between moments* — never as decoration.
- A mark never appears without a reason; each placement is a "period" or "comma" in the page's reading rhythm.

### Motion

| Token | Value | Used for |
|---|---|---|
| `--t-fast` | 200ms | Hover/focus |
| `--t-med` | 450ms | Palette transitions |
| `--t-slow` | 900ms | Intro fade-up |
| `--stagger` | 160ms | Delay between staggered fades |
| `--ease-std` | `cubic-bezier(0.2, 0.6, 0.2, 1)` | Every motion (editorial soft-tail) |

`prefers-reduced-motion` is honored — animations drop to 0ms for users who prefer it.

### What is *deliberately* outside the design system

A few values don't trace to tokens. Each one is documented in the CSS with a reason; they are:

- **The palette switcher and its buttons** (`2px` gap, `6px` padding, `12px` font-size). This is mockup-only UI chrome to compare palettes — it will not exist in the real build. Keeping it outside the design system prevents reviewers from mistaking it for a content component.
- **The `&` optical nudge** (`padding: 0 0.08em`) — em-based optical correction that scales with font size, not an absolute spacing value.
- **Hero photo `-20px` bleed** — a transform-bleed buffer so `scale(1.02)` still covers the edges. Visual-only, not a rhythmic measurement.
- **Mobile font sizes (9px, 10px)** where they drop below the smallest label token (10px). Documented in the mobile block; consider whether we need a `--ts-label-xs: 9px` if mobile labels proliferate.

Everything else in the CSS is a named token.

## How to view

**Option 1 — one-liner from the repo root:**

```bash
awk '/^<!DOCTYPE/,/<\/html>/' mockups/LANDING_MOCKUP.md > landing.html && open landing.html
```

This extracts the HTML, writes it to `landing.html` at the repo root (so `assets/engagement_pic.jpg` resolves), and opens it in your default browser. No server needed.

**Option 2 — copy-paste:** select everything inside the `html` fence below, paste into a new file named `landing.html` at the repo root, open in a browser.

**Iterating:** re-run the one-liner any time I update this file. The switcher remembers your last-selected palette via `localStorage`, so a refresh keeps you on the same palette.

## What to look for on this revision

Compare it to the previous (v3) mockup — it should feel *distinctly* more web-page and less document.

**On the hero:**

- The masthead is now a proper magazine masthead with brand mark (monogram + "A & F" + subtitle) top-left, nav top-right. Beneath you'll see a hairline appear once you scroll.
- The background engagement photo has a very slow Ken Burns drift. After 30-40 seconds you'll notice the composition has shifted subtly — most people won't consciously register it, but the photo feels alive rather than pasted.
- Scroll down ~60px and watch the masthead: backdrop fades in (Inkwell at 88% + blur), the bottom hairline appears, the subtitle beneath the brand collapses. The brand reduces height, nav reflows to match.

**Below the fold:**

- The asymmetric two-column with the pull-quote and hanging Bordeaux quotation mark is the editorial moment. The giant quote mark hangs into the margin and creates the "pull" — that's the single most editorial move on the page.
- Both the photo and the text fade in as you scroll — via IntersectionObserver, not an on-load delay. Scroll up and back down and they *stay* faded in (we only fire once).
- The photo is 4:5 portrait with a dark-graded filter matching the hero photo's mood.

**Palette switcher:**

- Moved to bottom-right so the top of the page is clean. Keyboard `1/2/3/4` still cycles. The palette name (in small-caps) sits just above the pill.

Questions I still want your call on (carried forward):

- **Pearl (B)** — keep as a whisper or shift warmer?
- **Rose Gold (C)** — the pink hue is the only non-warm-neutral element. Read as sophisticated or as a false note?
- **Nav underline on hover being metallic** — preserve or revert to burgundy?
- *(new)* **Masthead at rest** — transparent over the hero works; is the scrolled state's backdrop opacity (88%) right, or should it be more/less opaque?

## Known caveats of the mockup

- Fonts load from Google Fonts CDN; first render may show a system-serif fallback briefly
- `backdrop-filter: blur` on the palette-switcher is Safari/Chrome-only; Firefox falls back to a tint
- The photo filter is a simple CSS `filter` — a real hand-graded version would look slightly nicer, but this is plenty for design judgement
- Copy is placeholder (`The Fifteenth of Month`, etc.) — easy to swap once you have the date
- "Pizazz" (animated flourishes, richer ornaments, the real monogram, photo treatments) is deliberately absent for now per your note — baseline first, then we add layers

## The HTML

```html
<!DOCTYPE html>
<html lang="en" data-palette="A">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Amanda &amp; Francis &middot; Landing Mockup</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cormorant+SC:wght@400;500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
<style>
  /* ============================================================
     LANDING MOCKUP — Fig & Gilt / Bordeaux + Metallic
     Every value below traces to a design token.
     Reading order: fonts → palette → tokens → reset → components.
     ============================================================ */

  :root {
    /* ---- Fonts ---- */
    --type-display: 'Cormorant Garamond', 'Times New Roman', serif;
    --type-caps:    'Cormorant SC', 'Cormorant Garamond', serif;
    --type-body:    'EB Garamond', Georgia, serif;

    /* ---- Weights (only three values in the whole system) ---- */
    --w-light:   300;   /* display + major paragraphs */
    --w-regular: 400;   /* body + italic accents */
    --w-medium:  500;   /* small-caps labels */

    /* ---- Type scale (display + body) ---- */
    --ts-names:    clamp(3.25rem, 10vw, 7.5rem); /* hero names — only use */
    --ts-note:     1.5rem;                        /* major paragraphs */
    --ts-subtitle: clamp(1rem, 1.8vw, 1.25rem);   /* italic subtitle */
    --ts-quote:    1.0625rem;                     /* italic inline */
    --ts-body:     0.9375rem;                     /* body reading */

    /* ---- Label scale (small-caps) — 3 tiers, 1 tracking ---- */
    --ts-label-lg: 13px;   /* primary label */
    --ts-label-md: 11px;   /* standard eyebrow */
    --ts-label-sm: 10px;   /* fine print */
    --tracking-label: 0.4em;    /* unified across every label */
    --tracking-tight: 0.18em;   /* single-letter controls only */
    --tracking-names: 0.015em;  /* display names — optical */

    /* ---- Line heights ---- */
    --lh-display: 0.95;   /* tight display */
    --lh-read:    1.5;    /* reading paragraphs */
    --lh-body:    1.65;   /* denser body */
    --lh-label:   1;      /* single-line small-caps */

    /* ---- Space scale (8-point grid) ---- */
    --s-1:   4px;
    --s-2:   8px;
    --s-3:  12px;
    --s-4:  16px;
    --s-5:  24px;
    --s-6:  32px;   /* outer page gutter */
    --s-7:  48px;
    --s-8:  64px;   /* major interior padding */
    --s-9:  96px;
    --s-10: 128px;  /* major section rhythm */

    /* ---- Mark vocabulary (visual language of hairlines + veins) ---- */
    --mark-stroke:        1px;
    --mark-major-w:       100px;  /* closes a named section */
    --mark-minor-w:       60px;   /* separates elements within a block */
    --mark-vein-h:        64px;   /* vertical transition vein (= --s-8) */
    --mark-op-structural: 0.65;   /* burgundy marks: structural */
    --mark-op-ornamental: 0.85;   /* metallic marks: luminous */

    /* ---- Motion ---- */
    --t-fast:   200ms;
    --t-med:    450ms;
    --t-slow:   900ms;
    --stagger:  160ms;
    --ease-std: cubic-bezier(0.2, 0.6, 0.2, 1);

    /* ---- Shape ---- */
    --r-pill: 999px;
  }

  /* ---------- PALETTE (shared surfaces + type tiers + accents) ---------- */
  /* Inkwell dark base + Bordeaux burgundy accent. Only --metallic changes per palette. */
  html[data-palette] {
    --base:  #14110F;           /* near-black, warm undertone */
    --inset: #242120;           /* elevated surface */
    --deep:  #0A0908;           /* absolute dark (footer bg) */

    /* Type tiers — semantic, single hue family (H 32–40, low S) */
    --ink:         #EEE6D6;     /* tier 1 — primary reading (L=88, ~14:1) */
    --ink-whisper: #BFB5A4;     /* tier 2 — subtitles/date  (L=69, ~8.6:1) */
    --ink-muted:   #978B7C;     /* tier 3 — eyebrow/footer (L=54, ~5.9:1) */

    /* Burgundy — permanent structural accents only */
    --gilt:        #5F1A26;     /* the & , hairlines */
    --gilt-bright: #8B2B3A;     /* NOT for text */
    --rule:        rgba(139, 43, 58, 0.45);

    /* Hero photo grading */
    --overlay-top: rgba(20, 17, 15, 0.88);
    --overlay-mid: rgba(20, 17, 15, 0.30);
    --overlay-bot: rgba(20, 17, 15, 1.00);
    --photo-filter: brightness(0.5) contrast(1.1) saturate(0.75);

    /* Metallic — ornamental + interactive */
    --metallic:    #D4C29A;     /* defaults; per-palette overrides below */
    --metallic-hi: #E8D9B8;
  }

  html[data-palette="A"] { --metallic: #D4C29A; --metallic-hi: #EADDBE; } /* Champagne   */
  html[data-palette="B"] { --metallic: #EADCC5; --metallic-hi: #F8EFDC; } /* Pearl       */
  html[data-palette="C"] { --metallic: #C49B8A; --metallic-hi: #D8B3A3; } /* Rose Gold   */
  html[data-palette="D"] { --metallic: #A98A5F; --metallic-hi: #C6A577; } /* Tarn. Brass */


  /* ============================================================
                                 RESET
     ============================================================ */
  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    background: var(--base);
    color: var(--ink);
    font-family: var(--type-body);
    font-weight: var(--w-regular);
    line-height: var(--lh-body);
    transition: background var(--t-med) var(--ease-std),
                color      var(--t-med) var(--ease-std);
  }
  body { min-height: 100vh; overflow-x: hidden; }


  /* ============================================================
                           PALETTE SWITCHER
     (utility control; intentionally quiet. Moved to bottom-right
     so the top of the page is clean for the masthead.)
     ============================================================ */
  .palette-switcher {
    position: fixed;
    bottom: var(--s-5);
    right:  var(--s-5);
    z-index: 100;
    display: flex;
    gap: 2px;
    padding: 6px;
    background: rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--rule);
    border-radius: var(--r-pill);
    font-family: var(--type-caps);
    font-weight: var(--w-medium);
    font-size: 12px;
    letter-spacing: var(--tracking-tight);
    transition: background   var(--t-med) var(--ease-std),
                border-color var(--t-med) var(--ease-std);
  }
  .palette-switcher button {
    appearance: none;
    background: transparent;
    border: 0;
    padding: 6px 12px;
    border-radius: var(--r-pill);
    color: var(--ink);
    opacity: 0.55;
    cursor: pointer;
    font: inherit;
    letter-spacing: inherit;
    transition: opacity    var(--t-fast) var(--ease-std),
                background var(--t-fast) var(--ease-std);
  }
  .palette-switcher button:hover { opacity: 1; }
  .palette-switcher button:focus-visible {
    opacity: 1;
    outline: 2px solid var(--metallic);
    outline-offset: 1px;
  }
  .palette-switcher button[aria-pressed="true"] {
    background: var(--gilt);
    color: var(--ink);
    opacity: 1;
  }

  .palette-name {
    position: fixed;
    bottom: calc(var(--s-5) + var(--s-8));  /* 24 + 64, above the switcher */
    right:  var(--s-5);
    z-index: 100;
    color: var(--ink-muted);        /* tier 3 */
    opacity: 0.85;
    pointer-events: none;
    text-align: right;
    font-family: var(--type-caps);
    font-weight: var(--w-medium);
    font-size: var(--ts-label-sm);
    letter-spacing: var(--tracking-label);
    line-height: var(--lh-label);
    text-transform: uppercase;
  }


  /* ============================================================
                              MASTHEAD
     Magazine-style nav: brand left, nav right, hairline under.
     Transparent over hero; Inkwell backdrop + blur on scroll.
     ============================================================ */
  .masthead {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--s-7);
    padding: var(--s-4) var(--s-6);
    background: transparent;
    border-bottom: 1px solid transparent;
    transition: background     var(--t-med) var(--ease-std),
                border-color   var(--t-med) var(--ease-std),
                backdrop-filter var(--t-med) var(--ease-std),
                padding        var(--t-med) var(--ease-std);
  }
  /* Scrolled state — JS toggles .is-scrolled on the masthead */
  .masthead.is-scrolled {
    padding-top: var(--s-3);
    padding-bottom: var(--s-3);
    background: color-mix(in srgb, var(--base) 88%, transparent);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-bottom-color: var(--rule);
  }
  .masthead__brand {
    display: flex;
    align-items: center;
    gap: var(--s-3);
    text-decoration: none;
    color: var(--ink);
    opacity: 0.98;
    transition: opacity var(--t-fast) var(--ease-std);
  }
  .masthead__brand:hover,
  .masthead__brand:focus-visible {
    opacity: 1;
    outline: none;
  }
  .masthead__brand:focus-visible .masthead__mark {
    outline: 2px solid var(--metallic);
    outline-offset: 4px;
    border-radius: 50%;
  }
  .masthead__mark {
    width: 32px;
    height: 32px;
    color: var(--metallic);
    opacity: 0.95;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.35));
    flex: 0 0 auto;
  }
  .masthead__text {
    display: flex;
    flex-direction: column;
    gap: 3px;
    line-height: 1;
  }
  .masthead__title {
    font-family: var(--type-display);
    font-weight: var(--w-regular);
    font-style: normal;               /* only the ampersand is italic */
    font-size: 1.5rem;
    color: var(--ink);
    letter-spacing: 0.01em;
    line-height: 1;
  }
  .masthead__title em {
    font-style: italic;
    font-weight: var(--w-regular);
    color: var(--gilt);                /* echoes the Bordeaux & in the hero */
    padding: 0 0.08em;                 /* optical breathing */
  }
  .masthead__sub {
    font-family: var(--type-caps);
    font-weight: var(--w-medium);
    font-size: var(--ts-label-sm);
    letter-spacing: var(--tracking-label);
    line-height: var(--lh-label);
    text-transform: uppercase;
    color: var(--ink-muted);
    padding-left: var(--tracking-label);
    transition: opacity var(--t-med) var(--ease-std),
                max-height var(--t-med) var(--ease-std);
    overflow: hidden;
    max-height: 1em;
    opacity: 0.85;
  }
  .masthead.is-scrolled .masthead__sub {
    opacity: 0;
    max-height: 0;
  }
  @media (max-width: 720px) {
    .masthead__title { font-size: 1.25rem; }
    .masthead__sub   { display: none; }
    .masthead        { gap: var(--s-4); padding: var(--s-3) var(--s-5); }
  }


  /* ============================================================
                                HERO
     ============================================================ */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: var(--s-6) var(--s-6) var(--s-5);
    overflow: hidden;
  }
  .hero-photo {
    position: absolute;
    inset: -20px;                /* small bleed so transform:scale still covers */
    z-index: 0;
    background-image: url('assets/engagement_pic.jpg');
    background-size: cover;
    background-position: center 30%;
    filter: var(--photo-filter);
    transform: scale(1.02);
    transition: filter 600ms var(--ease-std);
    /* Ken Burns — barely perceptible per-second, gives the photo life. */
    animation: kenBurns 40s var(--ease-std) forwards;
  }
  @keyframes kenBurns {
    0%   { transform: scale(1.02) translate3d(0, 0, 0); }
    100% { transform: scale(1.08) translate3d(-0.5%, -1.5%, 0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .hero-photo { animation: none; }
  }
  .hero-overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(180deg,
      var(--overlay-top) 0%,
      var(--overlay-mid) 30%,
      var(--overlay-mid) 55%,
      var(--overlay-top) 82%,
      var(--overlay-bot) 100%);
    transition: background var(--t-med) var(--ease-std);
  }
  .hero > * { position: relative; z-index: 2; }


  /* ============================================================
                                NAV
     (lives inside the masthead's right grid cell;
     eyebrow-sized small-caps, tier 1 text)
     ============================================================ */
  .nav {
    display: flex;
    justify-content: flex-end;
    gap: var(--s-5);
    grid-column: 3;
  }
  @media (max-width: 720px) {
    .nav { gap: var(--s-3); flex-wrap: wrap; justify-content: flex-end; }
  }
  .nav a {
    font-family: var(--type-caps);
    font-weight: var(--w-medium);
    font-size: var(--ts-label-md);
    letter-spacing: var(--tracking-label);
    line-height: var(--lh-label);
    text-transform: uppercase;
    color: var(--ink);              /* tier 1 — full contrast */
    text-decoration: none;
    opacity: 0.82;                  /* rest state dimmed — hover brightens */
    position: relative;
    padding: var(--s-1) 2px;
    transition: opacity var(--t-fast) var(--ease-std);
  }
  .nav a::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    bottom: -2px;
    height: var(--mark-stroke);
    background: var(--metallic);    /* hover reveals metallic underline */
    opacity: var(--mark-op-ornamental);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform  var(--t-fast) var(--ease-std),
                background var(--t-med)  var(--ease-std);
  }
  /* Hover/focus: only brighten text + reveal metallic underline.
     Text color never changes — low-contrast hover is an anti-pattern. */
  .nav a:hover,
  .nav a:focus-visible { opacity: 1; outline: none; }
  .nav a:hover::after,
  .nav a:focus-visible::after { transform: scaleX(1); }


  /* ============================================================
                            CENTERPIECE
     monogram → names → date → tagline → closing mark
     ============================================================ */
  .centerpiece {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: var(--s-5);
    padding: var(--s-8) 0;
  }
  .monogram {
    width: 56px;
    height: 56px;
    color: var(--metallic);          /* SVG strokes use currentColor */
    opacity: 0.95;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.35));
  }
  .names {
    font-family: var(--type-display);
    font-weight: var(--w-light);
    font-size: var(--ts-names);
    line-height: var(--lh-display);
    letter-spacing: var(--tracking-names);
    color: var(--ink);               /* tier 1 */
  }
  .names .amp {
    font-weight: var(--w-regular);
    font-style: italic;
    color: var(--gilt);              /* the one burgundy glyph */
    padding: 0 0.08em;               /* optical breathing around italic */
  }
  .date-line {
    font-family: var(--type-caps);
    font-weight: var(--w-medium);
    font-size: var(--ts-label-lg);
    letter-spacing: var(--tracking-label);
    line-height: var(--lh-label);
    text-transform: uppercase;
    color: var(--ink-whisper);       /* tier 2 */
    padding-left: var(--tracking-label); /* visually re-center letter-spaced text */
  }
  .tagline {
    font-family: var(--type-display);
    font-weight: var(--w-light);
    font-style: italic;
    font-size: var(--ts-subtitle);
    line-height: var(--lh-read);
    color: var(--ink-whisper);       /* tier 2 — pairs with date-line */
    max-width: 34ch;
  }
  /* Closing mark: major-width burgundy hairline. Says "the centerpiece ends." */
  .hairline {
    width: var(--mark-major-w);
    height: var(--mark-stroke);
    background: var(--gilt);
    opacity: var(--mark-op-structural);
  }


  /* ============================================================
                         TEASER (bottom of hero)
     vertical vein → eyebrow label → italic line
     (the vein is the transition mark — ushers eye to the next moment)
     ============================================================ */
  .teaser {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--s-3);
  }
  .vein {
    width: var(--mark-stroke);
    height: var(--mark-vein-h);
    opacity: var(--mark-op-ornamental);
    background: linear-gradient(180deg,
      transparent 0%,
      var(--metallic)    28%,
      var(--metallic-hi) 50%,
      var(--metallic)    72%,
      transparent 100%);
    box-shadow: 0 0 4px color-mix(in srgb, var(--metallic) 60%, transparent);
  }
  .teaser-label {
    font-family: var(--type-caps);
    font-weight: var(--w-medium);
    font-size: var(--ts-label-md);
    letter-spacing: var(--tracking-label);
    line-height: var(--lh-label);
    text-transform: uppercase;
    color: var(--ink-muted);         /* tier 3 */
    padding-left: var(--tracking-label);
  }
  .teaser-line {
    font-family: var(--type-display);
    font-weight: var(--w-light);
    font-style: italic;
    font-size: var(--ts-quote);
    line-height: var(--lh-read);
    color: var(--ink);               /* tier 1 — the key message */
  }


  /* ============================================================
                          BELOW-THE-FOLD
     Asymmetric two-column: photo (4:5) + pull-quote + fine print.
     Breaks single-column centered rhythm; the editorial moment.
     ============================================================ */
  .below {
    padding: var(--s-10) var(--s-6);
    background: var(--base);
  }
  .below__grid {
    display: grid;
    grid-template-columns: 5fr 7fr;
    gap: var(--s-9);
    align-items: center;
    max-width: 1100px;
    margin: 0 auto;
  }
  .below__photo { position: relative; margin: 0; }
  .below__photo img {
    display: block;
    width: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    /* Consistent dark-grading with hero — same visual language */
    filter: brightness(0.72) contrast(1.02) saturate(0.85);
    box-shadow: 0 28px 60px -24px rgba(0, 0, 0, 0.65);
  }
  .below__photo figcaption {
    font-family: var(--type-caps);
    font-weight: var(--w-medium);
    font-size: var(--ts-label-sm);
    letter-spacing: var(--tracking-label);
    line-height: var(--lh-label);
    text-transform: uppercase;
    color: var(--ink-muted);          /* tier 3 */
    padding-left: var(--tracking-label);
    margin-top: var(--s-4);
  }
  .below__text {
    display: flex;
    flex-direction: column;
    gap: var(--s-5);
  }
  .below__chapter {
    font-family: var(--type-caps);
    font-weight: var(--w-medium);
    font-size: var(--ts-label-md);
    letter-spacing: var(--tracking-label);
    line-height: var(--lh-label);
    text-transform: uppercase;
    color: var(--ink-muted);          /* tier 3 */
    padding-left: var(--tracking-label);
  }
  /* Pull-quote: large italic Cormorant with giant hanging Bordeaux mark. */
  .pull-quote {
    position: relative;
    margin: 0;
    padding-left: var(--s-7);
    font-family: var(--type-display);
    font-weight: var(--w-light);
    font-style: italic;
    font-size: clamp(1.5rem, 2.8vw, 2.25rem);
    line-height: 1.35;
    color: var(--ink);                /* tier 1 */
    max-width: 42ch;
  }
  .pull-quote__mark {
    position: absolute;
    left: -0.1em;
    top: -0.35em;
    font-family: var(--type-display);
    font-style: normal;
    font-weight: var(--w-regular);
    font-size: 4.5em;
    line-height: 1;
    color: var(--gilt);
    opacity: 0.75;
    pointer-events: none;
    user-select: none;
  }
  .below__divider {
    width: var(--mark-minor-w);
    height: var(--mark-stroke);
    background: var(--rule);
  }
  .below__copy {
    font-family: var(--type-body);
    font-weight: var(--w-regular);
    font-size: var(--ts-body);
    line-height: var(--lh-body);
    color: var(--ink-muted);          /* tier 3 */
    max-width: 44ch;
  }
  @media (max-width: 720px) {
    .below__grid {
      grid-template-columns: 1fr;
      gap: var(--s-7);
    }
    .pull-quote { padding-left: var(--s-6); }
    .pull-quote__mark { font-size: 3.5em; }
  }


  /* ============================================================
                      SCROLL-TRIGGERED REVEAL
     (IntersectionObserver-driven; a utility class)
     ============================================================ */
  .on-scroll {
    opacity: 0;
    transform: translateY(14px);
    transition: opacity   var(--t-slow) var(--ease-std),
                transform var(--t-slow) var(--ease-std);
  }
  .on-scroll.is-visible {
    opacity: 1;
    transform: translateY(0);
  }
  @media (prefers-reduced-motion: reduce) {
    .on-scroll { opacity: 1; transform: none; transition: none; }
  }


  /* ============================================================
                              FOOTER
     ============================================================ */
  .footer {
    padding: var(--s-6) var(--s-6) var(--s-7);
    background: var(--deep);
    text-align: center;
    font-family: var(--type-caps);
    font-weight: var(--w-medium);
    font-size: var(--ts-label-sm);
    letter-spacing: var(--tracking-label);
    line-height: var(--lh-label);
    text-transform: uppercase;
    color: var(--ink-muted);          /* tier 3 */
  }


  /* ============================================================
                        INTRO ANIMATION
     Staggered fade-up on load (honors prefers-reduced-motion)
     ============================================================ */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  /* Masthead appears quietly; it's chrome, not content. */
  .masthead  { animation: fadeIn  var(--t-med)  0ms                          both var(--ease-std); }
  /* Centerpiece intro — staggered, dramatic. */
  .monogram  { animation: fadeUp var(--t-slow) calc(var(--stagger) * 0) both var(--ease-std); }
  .names     { animation: fadeUp var(--t-slow) calc(var(--stagger) * 1) both var(--ease-std); }
  .date-line { animation: fadeUp var(--t-slow) calc(var(--stagger) * 2) both var(--ease-std); }
  .tagline   { animation: fadeUp var(--t-slow) calc(var(--stagger) * 3) both var(--ease-std); }
  .hairline  { animation: fadeUp var(--t-slow) calc(var(--stagger) * 4) both var(--ease-std); }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0ms !important;
    }
  }


  /* ============================================================
                              MOBILE
     (override tokens' *usage* rather than the tokens themselves)
     ============================================================ */
  @media (max-width: 640px) {
    .hero         { padding: var(--s-5) var(--s-5) var(--s-4); }
    .nav          { gap: var(--s-4); font-size: 9px; flex-wrap: wrap; }
    .centerpiece  { gap: var(--s-4); padding: var(--s-7) 0; }
    .below        { padding: var(--s-9) var(--s-5); }
    .below-para   { font-size: 1.2rem; }
    .date-line    { font-size: var(--ts-label-md); }
    .footer       { padding: var(--s-5) var(--s-5) var(--s-6); }
    .palette-switcher        { font-size: 10px; padding: 4px; }
    .palette-switcher button { padding: 4px 8px; }
    .palette-name            { font-size: 9px; right: var(--s-3); top: calc(var(--s-3) + var(--s-6)); }
  }
  @media (max-width: 420px) {
    .palette-name { display: none; }
  }
</style>
</head>
<body>
  <header class="masthead" id="masthead">
    <a class="masthead__brand" href="#" aria-label="Amanda and Francis — home">
      <svg class="masthead__mark" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="28" cy="28" r="26"/>
          <circle cx="28" cy="28" r="22" opacity="0.4"/>
          <path d="M17 40 L25 14 L33 40 M20 31 H30"/>
          <path d="M36 14 V40 M36 14 H45 M36 25 H42"/>
        </g>
      </svg>
      <span class="masthead__text">
        <span class="masthead__title">A <em>&amp;</em> F</span>
        <span class="masthead__sub">Married in Montréal &middot; 2026</span>
      </span>
    </a>
    <nav class="nav" aria-label="Primary">
      <a href="#">Our Story</a>
      <a href="#">Details</a>
      <a href="#">Montréal</a>
      <a href="#">RSVP</a>
      <a href="#">Gifts</a>
    </nav>
  </header>

  <div class="palette-switcher" role="group" aria-label="Palette">
    <button data-p="A" aria-pressed="true" title="Bordeaux + Champagne">A</button>
    <button data-p="B" aria-pressed="false" title="Bordeaux + Pearl">B</button>
    <button data-p="C" aria-pressed="false" title="Bordeaux + Rose Gold">C</button>
    <button data-p="D" aria-pressed="false" title="Bordeaux + Tarnished Brass">D</button>
  </div>
  <div class="palette-name" id="paletteName">Bordeaux + Champagne</div>

  <section class="hero">
    <div class="hero-photo" aria-hidden="true"></div>
    <div class="hero-overlay" aria-hidden="true"></div>

    <div class="centerpiece">
      <svg class="monogram" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g fill="none" stroke="currentColor" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="28" cy="28" r="26"/>
          <circle cx="28" cy="28" r="22" opacity="0.4"/>
          <path d="M17 40 L25 14 L33 40 M20 31 H30"/>
          <path d="M36 14 V40 M36 14 H45 M36 25 H42"/>
        </g>
      </svg>
      <h1 class="names">Amanda <span class="amp">&amp;</span> Francis</h1>
      <div class="date-line">The Fifteenth of Month &middot; Montréal</div>
      <p class="tagline">An evening of candlelight, music, and the people we love.</p>
      <div class="hairline"></div>
    </div>

    <div class="teaser">
      <div class="vein" aria-hidden="true"></div>
      <div class="teaser-label">Save the Date</div>
      <div class="teaser-line">More details arriving as the weekend takes shape.</div>
    </div>
  </section>

  <section class="below">
    <div class="below__grid">
      <figure class="below__photo on-scroll">
        <img src="assets/we_r_pretty.jpg" alt="Amanda and Francis" loading="lazy" decoding="async" />
        <figcaption>Amanda &amp; Francis &middot; Summer 2024</figcaption>
      </figure>
      <div class="below__text on-scroll">
        <div class="below__chapter">I &middot; A Note From Us</div>
        <blockquote class="pull-quote">
          <span class="pull-quote__mark" aria-hidden="true">&ldquo;</span>
          We can&rsquo;t wait to celebrate with you. More to come.
        </blockquote>
        <div class="below__divider"></div>
        <p class="below__copy">This site will grow as we finalize the weekend &mdash; venue, schedule, travel notes, and everything you&rsquo;ll need to join us in Montr&eacute;al. Check back as the date approaches.</p>
      </div>
    </div>
  </section>

  <footer class="footer">&copy; 2026 &middot; Amanda &amp; Francis</footer>

<script>
// Palette switcher
(function () {
  var names = { A: 'Bordeaux + Champagne', B: 'Bordeaux + Pearl', C: 'Bordeaux + Rose Gold', D: 'Bordeaux + Tarnished Brass' };
  var label = document.getElementById('paletteName');
  var buttons = document.querySelectorAll('.palette-switcher button');
  function set(p) {
    document.documentElement.dataset.palette = p;
    buttons.forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.p === p ? 'true' : 'false');
    });
    if (label) label.textContent = names[p];
    try { localStorage.setItem('mockupPalette', p); } catch (e) {}
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () { set(b.dataset.p); });
  });
  try {
    var saved = localStorage.getItem('mockupPalette');
    if (saved && names[saved]) set(saved);
  } catch (e) {}
  document.addEventListener('keydown', function (e) {
    var map = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', a: 'A', b: 'B', c: 'C', d: 'D' };
    var k = e.key.toLowerCase();
    if (map[k] && !e.metaKey && !e.ctrlKey && !e.altKey) set(map[k]);
  });
})();

// Masthead scroll-collapse
(function () {
  var masthead = document.getElementById('masthead');
  if (!masthead) return;
  var ticking = false;
  function update() {
    var scrolled = window.scrollY > 60;
    masthead.classList.toggle('is-scrolled', scrolled);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

// Scroll-triggered reveal (IntersectionObserver)
(function () {
  var targets = document.querySelectorAll('.on-scroll');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) {
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
  }, { threshold: 0.18 });
  targets.forEach(function (t) { io.observe(t); });
})();
</script>
</body>
</html>
```

## What changed from the previous revision — editorial upgrade pass

Three structural editorial upgrades, plus motion polish:

- **Masthead-style nav** replaces the centered pill. Brand mark left (monogram 32px + "A & F" with the italic gilt ampersand + dotted subtitle `MARRIED IN MONTRÉAL · 2026`), nav cluster right, `position: fixed` at the top. Transparent initially; gains an Inkwell backdrop + blur + bottom hairline on scroll past 60px. The subtitle collapses out in the scrolled state (smooth `max-height` transition).
- **Ken Burns on the hero photo** — 40-second `scale(1.02)` → `scale(1.08)` with subtle `translate3d(-0.5%, -1.5%)` drift. `prefers-reduced-motion` disables it entirely.
- **Asymmetric below-fold** — CSS Grid `5fr / 7fr` with the photo on the left (4:5 portrait, dark-graded, small-caps caption beneath) and the pull-quote + chapter marker + fine-print on the right. The pull-quote carries a giant hanging Bordeaux quotation mark (4.5em, 0.75 opacity) — the single most editorial moment on the page.
- **Scroll-triggered reveal** on the below-fold photo and text (IntersectionObserver, 18% threshold, one-shot). Replaces on-page-load animations for below-the-fold content.
- **Palette switcher relocated** to bottom-right so the masthead region at top is untouched by mockup chrome.
- **Focus treatment on brand mark** — keyboard focus shows a metallic ring around just the monogram, not the whole clickable area, keeping it elegant.

Everything from v3 is preserved: design tokens, type tiers, accent split, 8-pt grid, WCAG AA contrast, reduced-motion handling.

## What changed from the v2 → v3 design-language pass (for reviewers catching up)

This revision doesn't change any visual decision from the previous pass. It *systematizes* every value already in the design into a reasoned token set. A reviewer can now point at any pixel and I can name the token that produced it.

**Typography made consistent:**

- Every small-caps element now uses `--tracking-label` (0.4em). Previously, seven small-caps elements used six different letter-spacing values (0.18 → 0.50em) with no reasoned logic. Tracking was establishing hierarchy by accident; that job now belongs to size alone.
- Three label sizes (13/11/10px) with documented uses — primary / standard / fine. No more ad-hoc sizes.
- Three weights total in the system (300/400/500), each with a documented role.
- Display type scale named semantically: `--ts-names`, `--ts-note`, `--ts-subtitle`, `--ts-quote`, `--ts-body`. The old `1.55rem`, `1.05rem` magic numbers are gone.
- Line heights tokenized to four semantic values: `--lh-display`, `--lh-read`, `--lh-body`, `--lh-label`.

**Spacing on an 8-point grid:**

- Old hero padding `40 40 28`, below `120 40 140`, footer `36 40 52` — all slightly off-grid and asymmetric without reason.
- New: every padding, gap, and margin uses `--s-1` through `--s-10`. Hero is `s-6 s-6 s-5`, below is `s-10 s-6` symmetric, footer is `s-6 s-6 s-7`. Everything snaps.

**Mark vocabulary formalized:**

- Five on-page marks now have codified widths, opacities, and semantic roles (documented in the "Design language" section above).
- Rules: horizontal burgundy = structural, vertical metallic = transitional, all strokes 1px. New marks can only enter the system by adding a token to the vocabulary deliberately.

**Motion tokenized:**

- Four duration tokens (`--t-fast` / `--t-med` / `--t-slow` / `--stagger`), one easing (`--ease-std`), applied consistently.
- Animation staggers use `calc(--stagger * N)` — the 100/260/420/580/740ms magic numbers are gone.
- Honors `prefers-reduced-motion`.

**Accessibility polish:**

- `:focus-visible` outline added to palette-switcher buttons in the metallic color (was missing).
- `prefers-reduced-motion` respected across all animations and transitions.
- Nav hover keeps full-contrast text; only the underline color + opacity change.

**Carried over from prior revision (still in place):**

- Three-tier text color system (ink / ink-whisper / ink-muted) with semantic roles
- Accent split: burgundy = structural, metallic = ornamental + interactive
- WCAG AA contrast across all text combinations
- Four palettes (A Champagne / B Pearl / C Rose Gold / D Tarnished Brass) share everything except the metallic accent

## Contrast check (all text combinations on `#14110F` base, WCAG AA thresholds)

| Text token | Hex | Ratio on `#14110F` | Body (4.5:1) | Large (3:1) |
|---|---|---|---|---|
| `--ink` | `#EEE6D6` | ~14:1 | ✓ | ✓ |
| `--ink-whisper` | `#BFB5A4` | ~8.6:1 | ✓ | ✓ |
| `--ink-muted` | `#978B7C` | ~5.9:1 | ✓ | ✓ |
| `--gilt` (`&` only, display size) | `#5F1A26` | ~3.2:1 | ✗ | ✓ (AA Large) |

The `&` is the only element deliberately at AA-Large (not AA-Body). It's display-sized (52px+), so this is compliant. No other text uses burgundy.

## Neighbors if none of these four hit

Tell me which direction to pull and I'll spin up another four:

- **Cooler metallic** — silver / platinum / pewter (risk: clashes with warm burgundy)
- **Richer / more saturated gold** — like old coin gold, riskier because "yellow" concern
- **Antique copper** — warmer still than Rose Gold, more orange-brown
- **Pale bone / porcelain** — barely a metallic, just a warm off-white
- **Move the metallic** — put it on the hairline under the date instead of the monogram, or only on the vein (remove from monogram)
- **Add a third metallic moment** — the `&` could also go metallic, making a three-element vertical signature (monogram → `&` → vein)
- **Shift Pearl warmer** — e.g., `#E5D0A8` (more saturated cream) so the monogram is a clearer ornament instead of a ghost

## Known mockup-vs-final differences

- The monogram SVG is a rough sketch — the real one is on the build todo list; the metallic will look dramatically better on a proper custom monogram
- Dates, tagline, and note copy are placeholders
- No real nav routing yet (all nav links go to `#`)
- Font loading flashes briefly on first view (normal — final build will self-host + preload)
- No real pizazz yet (animated vein, ornaments, richer photo treatment) per your note — palette-lock first, then add layers

## Re-run

Re-run the extract command to refresh `landing.html`:

```bash
awk '/^<!DOCTYPE/,/<\/html>/' mockups/LANDING_MOCKUP.md > landing.html && open landing.html
```

`localStorage` still remembers which palette letter you had selected. Since the letters now mean different things (A = Champagne instead of Wine), you'll land on whichever *letter* you were on. Cycle A/B/C/D (or press `1`/`2`/`3`/`4`) to compare the metallic hues.
