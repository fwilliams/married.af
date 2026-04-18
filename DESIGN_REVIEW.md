# Fig & Gilt — Design Review (pre-build)

A critical review of [the plan](../../.cursor/plans/fig_and_gilt_rebuild_0501cff1.plan.md), informed by a direct crawl of 136 pins from [amandawzhang/wedding](https://www.pinterest.com/amandawzhang/wedding/). The Pinterest HTML was fetched with a browser user-agent and ~313,000 pixels were clustered (k-means, K=18) to derive an honest palette signal from the actual board.

---

## 1. What the board actually looks like (data, not vibes)

Top dominant clusters across all 136 pin thumbnails, ordered by share of total pixel mass. I rounded hex values for legibility.

<table>
<tr><th>Swatch</th><th>Hex</th><th>Share</th><th>H / S / L</th><th>Reads as</th></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#120909;border:1px solid #333;"></span></td><td><code>#120909</code></td><td>11.4%</td><td>0 / 33 / 5</td><td>near-black, warm — coffee/charcoal</td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#BCC0C2;border:1px solid #333;"></span></td><td><code>#BCC0C2</code></td><td>9.8%</td><td>200 / 5 / 75</td><td>cool neutral grey (stone, paper)</td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#2E1E19;border:1px solid #333;"></span></td><td><code>#2E1E19</code></td><td>9.1%</td><td>14 / 30 / 14</td><td><b>oxblood / deep burgundy-brown</b></td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#ABA69F;border:1px solid #333;"></span></td><td><code>#ABA69F</code></td><td>7.5%</td><td>35 / 7 / 65</td><td>warm neutral grey (linen, taupe)</td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#D8D8D7;border:1px solid #333;"></span></td><td><code>#D8D8D7</code></td><td>7.4%</td><td>60 / 1 / 85</td><td>light grey / paper</td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#383837;border:1px solid #333;"></span></td><td><code>#383837</code></td><td>7.1%</td><td>60 / 1 / 22</td><td>deep neutral grey</td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#8A8B88;border:1px solid #333;"></span></td><td><code>#8A8B88</code></td><td>6.0%</td><td>80 / 1 / 54</td><td>mid grey</td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#5A5048;border:1px solid #333;"></span></td><td><code>#5A5048</code></td><td>5.9%</td><td>27 / 11 / 32</td><td>warm brown-grey (espresso)</td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#F2F2F1;border:1px solid #333;"></span></td><td><code>#F2F2F1</code></td><td>5.9%</td><td>60 / 4 / 95</td><td>near-white / bone</td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#B68D73;border:1px solid #333;"></span></td><td><code>#B68D73</code></td><td>5.5%</td><td>23 / 31 / 58</td><td><b>sand / camel</b></td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#966B4F;border:1px solid #333;"></span></td><td><code>#966B4F</code></td><td>5.5%</td><td>24 / 31 / 45</td><td><b>caramel / aged leather</b></td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#6E6864;border:1px solid #333;"></span></td><td><code>#6E6864</code></td><td>4.8%</td><td>24 / 5 / 41</td><td>warm grey (slate)</td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#D9B296;border:1px solid #333;"></span></td><td><code>#D9B296</code></td><td>4.8%</td><td>25 / 47 / 72</td><td>bone / blush-peach</td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#6C3F25;border:1px solid #333;"></span></td><td><code>#6C3F25</code></td><td>4.0%</td><td>22 / 49 / 28</td><td><b>chestnut / saddle (red-rock)</b></td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#89ACC8;border:1px solid #333;"></span></td><td><code>#89ACC8</code></td><td>2.8%</td><td>207 / 36 / 66</td><td>soft blue (outlier — satin cake pin)</td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#1E7A83;border:1px solid #333;"></span></td><td><code>#1E7A83</code></td><td>1.3%</td><td>185 / 63 / 32</td><td>teal (outlier)</td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#D79536;border:1px solid #333;"></span></td><td><code>#D79536</code></td><td>0.8%</td><td>35 / 67 / 53</td><td><b>bright gold (the gilt moment)</b></td></tr>
<tr><td><span style="display:inline-block;width:120px;height:28px;background:#4542C2;border:1px solid #333;"></span></td><td><code>#4542C2</code></td><td>0.5%</td><td>241 / 51 / 51</td><td>cobalt (outlier)</td></tr>
</table>

### What the data says

- **The board is warm-neutral-leaning, not saturated-moody.** ~60% of pixel mass is neutral greys/whites (stone, marble, linen, paper, suits). This is the editorial/old-money substrate, not dramatic theatre.
- **The "burgundy" is real but it's oxblood-brown**, not magenta-purple: `#2E1E19`, H=14, S=30. My v1 proposed `#4A1722` (too purple, too saturated).
- **The real signature is warm earth tones** — camel, caramel, chestnut, sand. These come from the engagement shoot (Bryce Canyon red rock), aged wood, leather, bone, and stone pins. They're the *heart* of the palette, not an accent.
- **Gold is a *small* but real moment** — `#D79536` shows up at 0.8% — exactly the "gilt flash" role: hairlines, ornaments, single accents. Not wallpaper.
- **Blue/teal/pink are functionally absent** (≤3% combined, and scattered outliers). Safe to drop from the design system entirely.
- **There is no "smoked rose."** I proposed it in v1; the data doesn't support it.

---

## 2. Revised palette — "Oxblood & Bone"

The name changes to reflect what the board actually is. Same direction (dark-dominant, editorial, candlelit), but warmer, earthier, and less theatrical-magenta.

### Core dark surfaces

<table>
<tr><th>Swatch</th><th>Token</th><th>Hex</th><th>Role</th></tr>
<tr><td><span style="display:inline-block;width:140px;height:40px;background:#1A1612;border:1px solid #333;"></span></td><td><code>--charcoal</code></td><td><code>#1A1612</code></td><td>Near-black with warmth; absolute background, footer, 404</td></tr>
<tr><td><span style="display:inline-block;width:140px;height:40px;background:#2E1E19;border:1px solid #333;"></span></td><td><code>--oxblood</code></td><td><code>#2E1E19</code></td><td><b>Primary dark surface</b> — hero, most pages</td></tr>
<tr><td><span style="display:inline-block;width:140px;height:40px;background:#3A2820;border:1px solid #333;"></span></td><td><code>--cacao</code></td><td><code>#3A2820</code></td><td>Secondary dark — section insets, cards on oxblood</td></tr>
<tr><td><span style="display:inline-block;width:140px;height:40px;background:#5A4438;border:1px solid #333;"></span></td><td><code>--espresso</code></td><td><code>#5A4438</code></td><td>Tertiary dark — hover states, borders on dark</td></tr>
</table>

### Warm earth (the heart)

<table>
<tr><th>Swatch</th><th>Token</th><th>Hex</th><th>Role</th></tr>
<tr><td><span style="display:inline-block;width:140px;height:40px;background:#6C3F25;border:1px solid #333;"></span></td><td><code>--chestnut</code></td><td><code>#6C3F25</code></td><td>Deep warm accent — icons, underlines on light insets</td></tr>
<tr><td><span style="display:inline-block;width:140px;height:40px;background:#966B4F;border:1px solid #333;"></span></td><td><code>--caramel</code></td><td><code>#966B4F</code></td><td>Mid warm — illustrations, dividers on light</td></tr>
<tr><td><span style="display:inline-block;width:140px;height:40px;background:#B68D73;border:1px solid #333;"></span></td><td><code>--sand</code></td><td><code>#B68D73</code></td><td>Light warm — body text on dark, photo captions</td></tr>
<tr><td><span style="display:inline-block;width:140px;height:40px;background:#D9B296;border:1px solid #333;"></span></td><td><code>--bone</code></td><td><code>#D9B296</code></td><td>Pale warm — small text on dark, subtle icons</td></tr>
</table>

### Ivory & stone (light insets)

<table>
<tr><th>Swatch</th><th>Token</th><th>Hex</th><th>Role</th></tr>
<tr><td><span style="display:inline-block;width:140px;height:40px;background:#F2ECDE;border:1px solid #333;"></span></td><td><code>--ivory</code></td><td><code>#F2ECDE</code></td><td>Primary type color on dark; background for logistics panels</td></tr>
<tr><td><span style="display:inline-block;width:140px;height:40px;background:#E2DACB;border:1px solid #333;"></span></td><td><code>--parchment</code></td><td><code>#E2DACB</code></td><td>Soft light surface for /details schedule inset</td></tr>
<tr><td><span style="display:inline-block;width:140px;height:40px;background:#ABA69F;border:1px solid #333;"></span></td><td><code>--stone</code></td><td><code>#ABA69F</code></td><td>Muted neutral — borders, rules on light</td></tr>
</table>

### Gilt (used sparingly — single-digit percent of any screen)

<table>
<tr><th>Swatch</th><th>Token</th><th>Hex</th><th>Role</th></tr>
<tr><td><span style="display:inline-block;width:140px;height:40px;background:#B08A3E;border:1px solid #333;"></span></td><td><code>--gilt</code></td><td><code>#B08A3E</code></td><td>Tarnished — hairlines, small-cap labels, inactive nav</td></tr>
<tr><td><span style="display:inline-block;width:140px;height:40px;background:#D79536;border:1px solid #333;"></span></td><td><code>--gilt-bright</code></td><td><code>#D79536</code></td><td>The "kintsugi vein" — rare ornaments, link hover, one-per-page max</td></tr>
</table>

### Dropped from v1

- `--fig #5C2A3A` — too purple, replaced by oxblood + cacao
- `--ink-burgundy #4A1722` — too magenta, replaced by oxblood
- `--smoked-rose #A77A78` — absent from the board; dropped entirely
- No blue tokens — the board's blues are outliers (one cake pin, one cobalt art piece)

---

## 3. Contrast check (WCAG AA targets: 4.5:1 body, 3:1 large text)

Quick reality check on legibility, approximate ratios:

- `--ivory` on `--oxblood` → ~13.5:1 — passes comfortably for body
- `--sand` on `--oxblood` → ~5.1:1 — passes for body
- `--bone` on `--oxblood` → ~7.8:1 — passes
- `--gilt` on `--oxblood` → ~3.4:1 — **fails body, passes large text only** (use for display/labels, not paragraphs)
- `--gilt-bright` on `--oxblood` → ~4.4:1 — marginal; reserve for display/labels
- `--oxblood` on `--ivory` → ~13.5:1 — passes
- `--chestnut` on `--ivory` → ~6.8:1 — passes

**Implication for the design system:** any paragraph-length text on dark backgrounds uses `--ivory` or `--sand`. `--gilt` is strictly display/small-caps/ornament. I'll bake this into the type utilities as classes like `.muted` (sand), `.body` (ivory), `.label-gilt` (gilt, only on sizes ≥18px).

---

## 4. Typography — still sound, one tweak

Cormorant Garamond + EB Garamond works beautifully with the warmer palette (both have calligraphic humanist roots; Cormorant's contrast suits the editorial feel). One refinement:

- Add a **small-caps companion face** rather than relying only on `font-variant: small-caps`. Cormorant has genuine SC glyphs in its Italic and Roman Google Fonts releases, but the rendering is browser-dependent. Use **Cormorant SC** (it's a separate Google Fonts family) for labels — more reliable than CSS-faked small caps.

---

## 5. Plan review — gaps and fixes

Walking the [plan file](../../.cursor/plans/fig_and_gilt_rebuild_0501cff1.plan.md) section by section with fresh eyes.

### What the plan gets right

- Multi-page Jekyll with `_data/` for events + Montréal content is the correct move for "info comes in waves." Every addition becomes a YAML edit.
- Passphrase-gate architecture (soft, client-side, `noindex`, localStorage) is proportional.
- Withjoy-as-backend, `?c=` URL redirect, `/rsvp` as the styled entry — well-scoped.
- File structure with `tokens.css` → `base.css` → `components.css` → `pages/` supports iteration without rewrites.
- Staying on GitHub Pages avoids a migration.

### Gaps I caught

1. **Palette mismatch with the actual board** (biggest one). Plan still uses v1 colors. Updating to "Oxblood & Bone" is a one-file change in `tokens.css` and doesn't affect any structural work.

2. **No phased content rollout plan.** The site ships over 12+ months of planning. Each page needs a defined "empty state" so you can ship early with minimal content. Fix: add a `status:` field to each page's front matter (`draft`, `teaser`, `live`) and a `_includes/coming-soon.html` that renders a styled empty state when a page or section isn't ready. Example: on launch, `/story` is `teaser` (just engagement photo + "Our story — coming soon"), and becomes `live` when you write it.

3. **No content-governance callout.** Worth stating explicitly: you both can edit `_data/*.yml` and `_config.yml` to add hotels, schedule entries, dress-code wording, the passphrase, and the Withjoy URL without touching any templates or CSS. This is the "adaptable to changes" payoff.

4. **RSVP test mode missing.** Need a toggle in `_config.yml` (`rsvp_testing: true`) that routes `?c=TEST` to a dummy Joy preview, so you can QA the end-to-end flow without polluting the real guest list.

5. **Passphrase rotation not specified.** If the passphrase leaks, you change one value in `_config.yml`, redeploy. Worth documenting. Also, worth gating the `mafGate=1` localStorage value against a `passphrase_version` key so old unlocked browsers are invalidated on rotation.

6. **Photo grading ambiguous.** I said "dark-graded engagement photo" but didn't pick where that happens. Two options: (a) you provide a graded JPG, (b) CSS does it with `filter: brightness(0.85) contrast(1.05) saturate(0.9)` + a dark gradient overlay. (b) is zero-effort and iterable; (a) is nicer. Propose: start with (b), upgrade to (a) later.

7. **No print stylesheet.** Some guests will print `/details` and `/montreal`. Minimal `@media print` rules (light background, inline link URLs) — low effort, high courtesy.

8. **Analytics not addressed.** You'll want to know if guests are actually reading `/montreal`. Plausible (paid, ~$9/mo, respectful, no cookies) or Umami (self-host or free tier) are both clean fits. Google Analytics would clash with the brand. Recommend **Plausible**, or defer.

9. **OG/Twitter meta tags vague.** Be specific in the build: `og:title`, `og:description`, `og:image` (1200×630), `twitter:card: summary_large_image`, plus per-page overrides so `/rsvp` doesn't leak details to social preview scrapers (set it to a generic OG image). `noindex` pages still generate OG meta; scrapers don't respect `noindex`.

10. **Mobile-first not stated.** Explicitly: mobile is primary. International guests on 4G/5G. Test budget: hero page ≤ 300KB total transfer on first load (fonts + hero image combined).

11. **Date / venue placeholders.** I assumed we'd placeholder these until you fill in. Worth structuring as a single `wedding:` block in `_config.yml` so changing the date changes the countdown, the hero, the OG description, and the footer all at once.

12. **Montréal page needs seasonal branching.** If the wedding is summer, "Do in Montréal" includes Jazz Fest, Mount Royal, Jean-Talon Market. If winter, it's igloo bars, Old Montréal snow walks, Parc du Mont-Royal skating. Without knowing the date, I'd stub both sections and gate them in YAML with a `season:` field.

13. **No 410 for obsolete per-event RSVP links.** If tiers change, old codes should show a friendly "This link is no longer active — please email us" rather than breaking. Minor — the JS redirect already handles unknown codes via the fallback copy.

14. **Dark-mode toggle intentionally absent.** The brand *is* dark. Adding a light toggle dilutes it and doubles the CSS work. Recommend no toggle. Worth stating in the plan so we don't revisit it.

15. **Internationalization (light).** Small French touches on `/montreal` (e.g., *"Bienvenue à Montréal"* as the page header) fit the vibe and your guest list. Not a full translation — just tonal.

### Summary of additions to fold into the plan

1. Swap palette tokens from v1 to "Oxblood & Bone" (section 2 above)
2. Add `status:` front matter + `_includes/coming-soon.html` for phased rollout
3. Add `rsvp_testing` and `passphrase_version` config keys
4. Document content-governance workflow (YAML-driven)
5. Add CSS photo grading as v1; upgrade to hand-graded later
6. Add `@media print` minimal sheet
7. Decide on analytics (Plausible vs none) — asked below
8. Specify per-page OG meta with safer defaults on gated pages
9. Explicit mobile budget (≤ 300KB first load)
10. Consolidate date/venue into single `wedding:` config block
11. Add `season:` field to `_data/montreal.yml` so seasonal content is one toggle
12. State: no dark-mode toggle, dark *is* the brand
13. Light French touches on `/montreal`

---

## 6. Adaptability to iteration — the whole point

The plan's structural bones make adding/changing content cheap. Concrete examples of how common wedding-planning events translate to edits:

- *"We picked a venue"* → edit 2 lines in `_config.yml` (`wedding.venue`, `wedding.address`) — touches hero, details, montreal, footer
- *"We added welcome drinks"* → append one entry to `_data/events.yml` — schedule card appears automatically
- *"We booked hotel block ABC"* → add one entry to `_data/montreal.yml:hotels` with `is_block: true` — hotel list re-renders with the "Room Block" badge
- *"Our friend's band knows the venue"* → append to `_data/montreal.yml:notes`
- *"The passphrase leaked to Reddit"* → update `passphrase_hash` + bump `passphrase_version` in `_config.yml`, redeploy — all unlocked sessions invalidated
- *"RSVP date extended"* → change `wedding.rsvp_deadline` in `_config.yml`
- *"We want a Friday rehearsal dinner for close family only"* → add `tier: family` to that event entry; the RSVP URL on Joy handles tiering natively
- *"We hate beige, let's go more burgundy"* → change 2 tokens in `tokens.css` — entire site recolors

What *would* be expensive if we got it wrong now (and so we shouldn't):

- Hard-coding the palette into individual page CSS — avoided by using CSS custom properties
- Hard-coding copy into HTML layouts — avoided by `_data/` + front matter
- Coupling page layouts to specific content — avoided by the layout/include split
- Self-written RSVP backend — avoided by delegating to Withjoy

---

## 7. One outstanding question

There's one remaining fork that I need from you before building; the rest is decided.

**Analytics?**

- (a) Add Plausible (~$9/mo, privacy-respecting, clean dashboard, one script tag) so you can see traffic per page
- (b) Add Umami (free self-hosted or cheap paid) — similar output, a bit more setup
- (c) No analytics — zero tracking, just ship

My pick is (a) if you're curious which Montréal recommendations guests actually click; (c) if you want to keep it monastic. Either is fine; we can add later.

---

## 8. If approved, I'd update the plan file with:

- Palette section swapped to "Oxblood & Bone" (section 2 above)
- New `status:` / rollout-phase subsection
- Config schema additions (`rsvp_testing`, `passphrase_version`, `wedding.*`, `season`)
- Print CSS, OG meta, mobile budget explicitly stated
- Analytics decision
- Adaptability appendix (section 6 above, trimmed)

Let me know if the revised palette and gaps look right and I'll fold these into the plan, or iterate further here.
