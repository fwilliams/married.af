# Typography audit — 2026-04-17

A full pass over every text style on the site. The token system in
`_sass/_tokens.scss` is in good shape overall — almost every value traces
back to a token — so this is mostly about consolidation, inconsistencies,
and one or two substantive hierarchy issues.

Ordered by impact. Each item includes what to do.

---

## High-impact

### H1. Body copy is at tier-3 color (too faded to read)

File: `_sass/_components.scss`

```scss
.body-copy {
  font-family: var(--type-body);
  font-weight: var(--w-regular);
  font-size: var(--ts-body);
  line-height: var(--lh-body);
  color: var(--ink-muted);   // <-- tier 3, ~5.9:1 contrast
  max-width: 44ch;
}
```

`--ink-muted` (`#978B7C`) is designed for eyebrows, chapter markers, and
fine print. It's too faded for paragraphs people actually *read*. The
below-fold copy ("This site will grow as we finalize the weekend...")
currently uses `.body-copy` and sits at this washed-out tier.

**Fix:** switch to `--ink-whisper` (`#BFB5A4`, tier 2, ~8.6:1). Keep
`--ink-muted` strictly for labels and eyebrows.

---

### H2. Text-shadow string duplicated 8 times

The same string appears verbatim on 8 selectors:

```scss
text-shadow: 0 1px 2px rgba(20, 17, 15, 0.85),
             0 2px 24px rgba(20, 17, 15, 0.55);
```

Used on: `.masthead__brand`, `.nav a`, `.names`, `.date-line`, `.tagline`,
`.teaser-label`, `.teaser-line`, `.nav-toggle`.

**Fix:** add `--text-shadow-hero` to `_tokens.scss` and reference it
everywhere. If we ever retune contrast over the photo, it's a one-line
change.

---

### H3. `padding-left: var(--tracking-label)` used inconsistently

This hack visually re-centers letter-spaced caps so the trailing tracking
doesn't make the text look right-leaning. It's **correct on
center-aligned text** and **wrong on left-aligned text** — exactly the
bug we just fixed on `.masthead__sub`.

Current state:

| Selector | Alignment | Padding applied? | Correct? |
|---|---|---|---|
| `.footer__line` | centered | yes | ✓ |
| `.date-line` | centered (in centerpiece) | yes | ✓ |
| `.teaser-label` | centered (in teaser) | yes | ✓ |
| `.coming-soon__label` | centered | yes | ✓ |
| `.nav-sheet__list a` | centered | yes | ✓ |
| `.label-lg / md / sm` utilities | depends on use | yes (in base) | risky |
| `.chapter-marker` utility | depends on use | yes (inherited) | risky |
| `.figure-portrait figcaption` | left (under left-aligned image) | yes | ✗ probably wrong |
| `.nav-toggle__label` | right edge of masthead | yes | ✗ probably wrong |
| `.masthead__sub` | left | removed | ✓ fixed |

**Fix:** make the re-centering opt-in. Drop the padding from `.label-lg`,
`.label-md`, `.label-sm`, `.chapter-marker` in `_sass/_base.scss`. Add a
separate `.label--centered` modifier that adds
`padding-left: var(--tracking-label)`. Apply it only where the label is
actually centered.

This is a refactor, so worth doing once and being careful.

---

## Medium-impact

### M1. Hardcoded font-sizes that should be tokens

Five sizes live outside the scale:

| Selector | Current value | Notes |
|---|---|---|
| `.masthead__title` | `1.5rem` | equals `--ts-note` already; just not using the token |
| `.masthead__title` (mobile) | `1.25rem` | no token |
| `.pull-quote` | `clamp(1.5rem, 2.8vw, 2.25rem)` | no token |
| `.pull-quote__mark` | `4.5em` | no token |
| `.coming-soon__title` | `clamp(2rem, 5vw, 3.5rem)` | no token |

**Fix:** add to `_tokens.scss`:

```scss
--ts-masthead:     1.5rem;
--ts-masthead-sm:  1.25rem;
--ts-pullquote:    clamp(1.5rem, 2.8vw, 2.25rem);
--ts-section-hd:   clamp(2rem, 5vw, 3.5rem);
--ts-quotemark:    4.5em;   // the oversized opening " in pull-quotes
```

### M2. Line-height `1.35` isn't in the token set

Used once, on `.pull-quote`. Current named line-heights are
`--lh-display: 0.95`, `--lh-read: 1.5`, `--lh-body: 1.65`, `--lh-label:
1`. A 1.3–1.4 range is a useful tier for italic display blocks that are
more than one line.

**Fix:** add `--lh-quote: 1.35`.

### M3. `letter-spacing: 0.01em` on `.masthead__title` is hardcoded

Very close to `--tracking-names` (0.015em). Could consolidate to one
value or introduce `--tracking-wordmark` if the masthead genuinely wants
its own tracking. Minor.

---

## Low-impact / nice-to-have

### L1. Weight mismatch between brand and names (intentional)

- `.masthead__title` is `--w-regular` (400).
- `.names` (hero) is `--w-light` (300).

This is *correct* — small type reads better at regular, display sizes
look more elegant at light. But worth a comment in `_tokens.scss` so the
next contributor doesn't "fix" them to match.

### L2. `.tagline` uses `--lh-read` (1.5)

For a short one-line italic display snippet, 1.2–1.3 would feel more
display-y and less body-copy-y. Minor.

### L3. Max-widths vary (28ch / 34ch / 42ch / 44ch)

Per-context, deliberate. But worth a comment explaining the reasoning:

- `.prose` 28ch → short editorial blocks (narrow column)
- `.tagline` 34ch → hero one-liner
- `.body-copy` 44ch → supporting paragraph (editorial measure)
- `.coming-soon__note` 42ch → same pattern
- `.pull-quote` 42ch → block quote

Typical reading measure is 45–75ch. The design leans narrower everywhere
for editorial feel. OK, but document it.

### L4. `.prose` at `max-width: 28ch` is easy to misuse

The utility class is named generically, but its 28ch max implies
"short editorial intro block," not "paragraphs." Either rename to
`.prose--narrow` or raise to ~50ch.

---

## Proposed changes, summarized

When executing the pass, all of this can ship in one commit:

**`_sass/_tokens.scss`:**
- Add `--text-shadow-hero`, `--ts-masthead`, `--ts-masthead-sm`,
  `--ts-pullquote`, `--ts-section-hd`, `--ts-quotemark`, `--lh-quote`.
- Add a short comment near the weight block explaining the regular-vs-light choice (L1).

**`_sass/_base.scss`:**
- Remove the inline `padding-left: var(--tracking-label)` from
  `.label-lg / md / sm` (H3 refactor).
- Add a `.label--centered` modifier that adds it.

**`_sass/_components.scss`:**
- `.body-copy` → `color: var(--ink-whisper)` (H1).
- Replace all 8 text-shadow literals with `var(--text-shadow-hero)` (H2).
- Replace hardcoded font-sizes with tokens in: `.masthead__title`,
  `.masthead__title` mobile (in `_layouts.scss`), `.pull-quote`,
  `.pull-quote__mark`, `.coming-soon__title` (M1).
- `.pull-quote line-height` → `var(--lh-quote)` (M2).
- Apply `.label--centered` to `.footer__line`, `.date-line`,
  `.teaser-label`, `.coming-soon__label`, `.nav-sheet__list a` in markup
  (or leave in CSS if simpler — decide during implementation).
- Remove `padding-left` from `.figure-portrait figcaption` and
  `.nav-toggle__label` (H3 — these are left/right-aligned, not
  centered).

**`_sass/_layouts.scss`:**
- `.masthead__title` mobile size → `var(--ts-masthead-sm)`.

**Leave for now (opt-in):**
- L2 (`.tagline` line-height tweak)
- L3 (comment pass for max-widths)
- L4 (`.prose` rename — only matters when we actually start adding prose pages)

---

## Scope estimate

- H1 + H2 + M1 + M2: ~15 minutes of touch-up, all safe.
- H3 refactor: ~30 minutes, needs visual QA on every page that uses a
  label. Do this one carefully.

Total: under an hour, zero risk to the visual result — tokens and
utility refactors are pure DX improvements.
