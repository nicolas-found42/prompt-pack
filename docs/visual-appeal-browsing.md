# Visual appeal of the browsing and reading experience: typography, color, cards, tree, controls

> Location note: this file lives in `docs/`, alongside
> `docs/visual-structure-scaling.md` (the structural/CSS-organization note whose
> format this file follows) and `docs/css-organization.md`. It is a
> READ-ONLY research note: it recommends changes but implements none of them.
> Read on 2026-10-21 against the current tree: `index.html` (139 lines),
> `styles/tokens.css` (66), `base.css` (105), `layout.css` (143), `tree.css`
> (126), `controls.css` (317), `cards.css` (293), `app/main.js` (509),
> `app/results.js` (53), `app/tree.js` (162), `app/featured.js` (28),
> `app/facets.js` (14), `data/featured.js` (37), `data/taxonomy.js` (943),
> `docs/visual-structure-scaling.md` (683). Baseline screenshots of the live
> site (`https://nicolas-found42.github.io/prompt-pack/`, served locally for
> capture) were taken by this note at 1440px and 390px, light and dark
> (real `prefers-color-scheme` emulation via CDP), plus a 320px reflow probe;
> they were used for analysis only and are not committed.

## Recommendation

The current browsing/reading experience is functional but visually flat:
cards are low-contrast, undifferentiated boxes; the type scale is a single
15px body with two hand-picked sizes; `--line` is too faint to read as a
boundary; the sticky controls bar is an opaque slab; and the card hover lift
is the only motion cue. The changes below are ranked by
(visual impact × reading-comfort impact) ÷ effort, and **every one satisfies
all five hard constraints** (no runtime deps/build, no external assets,
light+dark via `prefers-color-scheme` with both themes tokenized, WCAG 2.2
AA, no rebrand). Each item names the exact file and selector.

**Constraint check key** (applies to every item; restated per item briefly):
C1 no deps/build · C2 no external assets · C3 both themes tokenized · C4 WCAG
2.2 AA · C5 no rebrand.

### 1. Strengthen `--line` so cards and controls read as boundaries (biggest single win)

- **What:** darken `--line` in both themes so it clears the WCAG 2.2 SC 1.4.11
  3:1 non-text threshold against every surface it sits on.
  `styles/tokens.css:19` (light) and `styles/tokens.css:38` (dark).
- **Current state (measured):** `--line` is `#dfe3e9` (light) / `#2b313b`
  (dark). Script-computed contrast vs adjacent surfaces **FAILS 1.4.11** in
  both themes: light `1.29:1` on `--surface`, `1.21:1` on `--bg`, `1.14:1` on
  `--soft`; dark `1.28:1` / `1.40:1` / `1.15:1`. This is a provable,
  currently-failing pair. (Note: SC 1.4.11's operative test is "visual
  information _required to identify_ user interface components"; a purely
  decorative hairline is arguably exempt, but the card border, input borders,
  chip borders and the tree indent guide are all _boundaries the user must
  perceive to read the layout_, so treating them as in-scope is the safe
  reading. [8][9])
- **Proposal (script-verified, both themes):** light `--line: #7d8590`,
  dark `--line: #6d7683`. Computed ratios:

  | Pair (need 3:1, SC 1.4.11) | Light `#7d8590` | Dark `#6d7683`  |
  | -------------------------- | --------------- | --------------- |
  | on `--surface`             | **3.73:1 PASS** | **3.64:1 PASS** |
  | on `--bg`                  | **3.51:1 PASS** | **3.98:1 PASS** |
  | on `--soft`                | **3.29:1 PASS** | **3.27:1 PASS** |

  Derived values re-verified with these tokens: `.card:hover` border
  (`color-mix(in srgb, var(--muted) 45%, var(--line))`, `cards.css:111`) →
  light `#67717d` on surface **4.96:1 PASS**, dark `#88919e` on surface
  **5.25:1 PASS**; tree indent guide (`tree.css:11` `border-left`) → light
  **3.73:1**, dark **3.64:1** on the sidebar surface; controls-bar bottom
  border (`layout.css:75`) → light **3.51:1** on `--bg`, dark **3.98:1**.

- **Why:** this one token change lifts the perceived structure of the entire
  grid, the sidebar, the chips and the sticky bar at once. It is the cheapest
  large visual win available.
- **Effort:** 2 lines. **Risk:** low — `--line` is consumed in ~30 places but
  all read as "hairline boundary"; a slightly stronger hairline does not change
  meaning. Verify the dark value is not too heavy at 1px (it is a blue-gray,
  not pure gray, to stay on-brand).
- **Constraints:** C1 (token edit only), C2 (no asset), C3 (both themes
  defined, in the existing `@media (prefers-color-scheme: dark)` block),
  C4 (ratios above, SC 1.4.11), C5 (same neutral blue-gray identity).

### 2. Refine `--muted` and `--link` for more headroom (reading comfort)

- **What:** nudge `--muted` darker in light / lighter in dark, and `--link`
  toward a touch more saturation, keeping every text pair ≥ 4.5:1.
  `styles/tokens.css:18,21` (light) and `:37,40` (dark).
- **Current state (measured):** all current text pairs already **PASS** SC
  1.4.3 (light: muted 6.00/5.65/5.30, link 6.06/5.70/5.34/5.12 on
  surface/bg/soft/link-soft; dark: muted 6.62/7.24/5.94, link
  7.68/8.40/6.89/5.97). So this is _refinement_, not a fix — the current
  muted is a touch washed-out on `--soft` (5.30:1 light, the floor of the
  set), and the light `--link` (`#1d5fc2`, 5.12:1 on `--link-soft`) is the
  weakest link in the palette.
- **Proposal (script-verified):**

  | Token     | Light (current → proposed) | Dark (current → proposed) |
  | --------- | -------------------------- | ------------------------- |
  | `--muted` | `#5a6472` → `#4d5866`      | `#9aa4b0` → `#a8b2be`     |
  | `--link`  | `#1d5fc2` → `#1a56b0`      | `#85b2f2` → `#9cc0f7`     |

  Computed ratios for the proposed values (need 4.5:1, SC 1.4.3):

  | Pair              | Light proposed | Dark proposed |
  | ----------------- | -------------- | ------------- |
  | muted on surface  | **7.23:1**     | **7.78:1**    |
  | muted on bg       | **6.81:1**     | **8.52:1**    |
  | muted on soft     | **6.38:1**     | **6.99:1**    |
  | link on surface   | **7.00:1**     | **8.99:1**    |
  | link on bg        | **6.58:1**     | **9.84:1**    |
  | link on soft      | **6.17:1**     | **8.07:1**    |
  | link on link-soft | **5.92:1**     | **6.99:1**    |

  Derived tints re-verified with the proposed tokens: selected `.node-count`
  bg (`color-mix(in srgb, var(--link) 14%, var(--surface))`, `tree.css:105`)
  → light link-on-it **5.62:1**, dark **6.66:1**; search focus ring
  (`color-mix(in srgb, var(--link) 18%, transparent)`, `controls.css:117`) →
  link border vs ring **5.30:1** light / **6.08:1** dark (non-text 3:1);
  `::selection` (`color-mix(in srgb, var(--link) 25%, transparent)`,
  `base.css:71`) → ink-on-selection **10.76:1** light / **7.90:1** dark.
  All PASS.

- **Why:** more headroom on the two most-read secondary colors (purpose lines,
  meta rows, hints) measurably reduces reading fatigue, and a slightly deeper
  light link reads as more confident. Both stay within the existing neutral
  blue-gray identity.
- **Effort:** 4 lines. **Risk:** low. **Constraints:** C1–C5 as item 1.

### 3. Typography: enable kerning + common ligatures, and a fluid type scale

- **What:** in `styles/base.css` `body` (`:48-63`), add
  `font-kerning: normal; font-variant-ligatures: common-ligatures;` and
  `font-optical-sizing: auto;` (computed value is already `auto`, so this is
  a no-op today but future-proofs variable system fonts — CSS Fonts 4 [6]).
  Then introduce a fluid type scale in `styles/tokens.css` (shared block,
  `:53-66`) and consume it in `cards.css` / `layout.css`:

  ```css
  /* tokens.css, shared block */
  --type-body: clamp(0.94rem, 0.9rem + 0.2vw, 1rem); /* ~15px → 16px */
  --type-title: clamp(1.05rem, 1rem + 0.4vw, 1.2rem);
  --type-h1: clamp(1.45rem, 1.3rem + 1vw, 1.9rem);
  --leading-body: 1.6;
  --leading-tight: 1.3;
  ```

  Apply: `body { font-size: var(--type-body); line-height: var(--leading-body); }`
  (`base.css`), `.title { font-size: var(--type-title); line-height: var(--leading-tight); }`
  (`cards.css:149`), `h1 { font-size: var(--type-h1); }` (`layout.css:57`,
  replacing the fixed `--type-h1: 1.45rem`).

- **Why:** the body is a flat 15px/1.55 everywhere (`base.css:55-56`); titles
  are 1.02rem (16.3px) — barely larger than body. A fluid scale gives the
  reading column a real hierarchy without a single media query. Kerning and
  common ligatures are on by default in most engines but are not guaranteed;
  CSS Fonts 4 defines them and all Baseline browsers implement them [6][7].
  `font-optical-sizing: auto` lets variable system fonts pick the right
  optical size (no-op today, free tomorrow).
- **Current state (measured):** `bodyFontFeature: normal`,
  `bodyFontOptical: auto`, `titleFontSize 16.32px`, `titleLineHeight 22.03px`
  (≈1.35), `textFontSize 14.72px`, `textLineHeight 23.55px` (≈1.6).
- **Effort:** ~10 lines across 3 files. **Risk:** low — `clamp()` is Baseline
  widely available [10]; the scale is conservative. **Constraints:** C1 (pure
  CSS), C2 (system font stack unchanged — `base.css:55-63`), C3 (tokens in
  the shared block, no per-theme value), C4 (no contrast change; line-height
  ≥1.5 preserved), C5 (same system sans, same neutral identity).

### 4. Reading measure + ragged-right balance on card text

- **What:** in `styles/cards.css`:
  - `.title` (`:149`): add `text-wrap: balance;`
  - `.purpose` (`:155`): add `text-wrap: pretty;`
  - `.text` (`:157`): keep `max-width: 72ch` (good — within the 45–75ch
    reading range), add `hyphens: auto;` + `overflow-wrap: break-word;`
    (the prompt bodies contain long tokens/URLs).
- **Why:** `text-wrap: balance` evens out short headings (card titles, bucket
  labels) so the grid reads as a grid; `text-wrap: pretty` avoids short last
  lines in the purpose line. `hyphens: auto` + `overflow-wrap` stops long
  unbroken tokens in prompt bodies from overflowing the `.text` block on
  narrow cards. `text-wrap` is Baseline **widely available** (MDN marks the
  property Baseline widely available; `balance` shipped Chrome 114 / Safari
  17.5 / Firefox 121, `pretty` is newer — Chrome 117, Firefox not yet, so
  `pretty` degrades gracefully to normal wrapping where unsupported). [1][2]
  `hyphens` and `overflow-wrap` are universally supported. [3][4]
- **Current state (measured):** `titleTextWrap: wrap`, `purposeTextWrap: wrap`
  (i.e. no balancing today).
- **Effort:** 4 declarations. **Risk:** low — all are progressive
  enhancements that no-op where unsupported. **Constraints:** C1–C5 trivially
  (pure CSS, no color, no asset).

### 5. Card grid + card internals: rhythm, equal heights, focus state, no layout shift

- **What (all in `styles/cards.css`):**
  1. `.card` (`:88`): add `height: 100%;` so cards in a grid row stretch to
     equal height (the grid already stretches items by default; making it
     explicit plus `min-width: 0` prevents a long `.path` from forcing
     overflow). Add `scroll-margin-top` is not needed here (see item 7 for
     the bar).
  2. Vertical rhythm: the card uses `gap: var(--space-1)` (4px, `:94`) —
     too tight between `.title` / `.purpose` / `.prompt` / `.copy`. Switch
     to a slightly larger internal gap (`gap: var(--space-2)` = 8px) and drop
     the per-element `margin` hacks (`.purpose { margin: 4px 0 8px }` `:155`,
     `.copy { margin-top: var(--space-3) }` `:191`) in favour of the flex gap,
     so the internal spacing is one mechanism.
  3. `.card:focus-within` (new rule): mirror `.card:hover` (`:108`) —
     `box-shadow: var(--shadow-lift); border-color: color-mix(in srgb,
var(--muted) 45%, var(--line));` — so keyboard users get the same
     affordance as mouse users. (The card itself is not focusable; the
     disclosure `<summary>` and `.copy` button inside it are.)
  4. `html { scrollbar-gutter: stable; }` in `styles/base.css:9` — reserves
     the scrollbar lane so expanding a card (or the page growing past the
     viewport) never shifts the grid horizontally. `scrollbar-gutter` is
     Baseline **newly available** (Chrome 94 / Firefox 97 / Safari 18.2,
     Dec 2024). [5]
- **Why:** measured collapsed card heights vary **304–369px** across the
  grid (a 65px spread) because cards do not equalize; the 4px internal gap
  makes `.title`/`.purpose`/`.copy` feel cramped; and there is **no
  `:focus-within` state** on cards, so a keyboard user tabbing to "Show
  prompt" or "Copy" gets no card-level cue. `scrollbar-gutter: stable`
  removes the classic expand/collapse layout shift. The global
  `prefers-reduced-motion` rule (`base.css:97`) already kills the
  `transform: translateY(-2px)` hover lift for reduced-motion users, so the
  existing motion is compliant.
- **Effort:** ~8 lines. **Risk:** low. `height: 100%` on a grid item is
  safe (the row track sizes to the tallest). **Constraints:** C1 (pure CSS),
  C2, C3 (no color), C4 (focus-within uses the same already-passing
  `--muted`/`--line` mix; `scrollbar-gutter` is layout only), C5.

### 6. Tree: stronger selected state, count-badge contrast, hover on rows

- **What (in `styles/tree.css`):**
  1. `li.selected > .node-row` (`:96`): the current selected state is
     `background: var(--link-soft)` + `inset 3px 0 0 var(--link)`. Keep it,
     but also set `color: var(--ink)` so the selected label reads as primary
     text (today it inherits body ink — fine — but the row's `.node-count`
     already switches to `--link`; make the label weight 600 → already is).
     Net: no change needed here beyond what item 2 buys.
  2. `.node-count` (`:52`): its background is `var(--soft)` and text
     `var(--muted)`. With the refined `--muted` (item 2) the badge text
     reaches 6.38:1 light / 6.99:1 dark on `--soft` — PASS. No further
     change.
  3. `.node-row:hover` (`:38`) already uses `var(--soft)`; with item 1's
     stronger `--line`, the indent guides (`.tree ul`, `:11`) become
     actually visible, which is the single biggest tree readability win.
  4. Optional polish: `.twisty` (`:44`) is `color: var(--muted)` at 10px —
     bump to `font-size: 11px` and `color: var(--ink)` at 60% only if it reads
     too faint after item 1 (leave as-is otherwise; do not over-tune).
- **Why:** the tree is the primary navigation; today its indent guides are
  sub-1.3:1 and effectively invisible, so the hierarchy reads as a flat list.
  Making the guides visible (item 1) plus the already-correct selected/hover
  states is the whole job.
- **Effort:** 0–3 lines (mostly inherited from item 1). **Risk:** none.
  **Constraints:** C1–C5 trivially.

### 7. Controls bar: translucent surface + backdrop blur (the "frosted" sticky bar)

- **What (in `styles/layout.css` `.controls-bar`, `:67-76`):** change the
  opaque `background: var(--bg)` to a translucent surface plus a backdrop
  blur, tokenized so both themes get it:

  ```css
  /* tokens.css, per-theme (light :14, dark :33) */
  --bar-bg: rgb(247 248 250 / 82%); /* light */
  --bar-bg: rgb(18 21 26 / 82%); /* dark  */

  /* layout.css .controls-bar */
  background: var(--bar-bg);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  ```

- **Why:** the sticky bar currently paints an opaque slab of `--bg` over the
  scrolling cards; a translucent + blurred bar lets the grid ghost through,
  which reads as more crafted and keeps context visible while scrolling.
  `backdrop-filter` is Baseline **newly available** (Chrome 76 / Edge 79 /
  Firefox 103 / Safari 9 with `-webkit-` prefix; unprefixed in Safari 18).
  [11][12] Both prefixed and unprefixed are supplied.
- **Contrast (C4):** the bar's _text_ sits on `--bar-bg` over `--bg`. The
  effective background is `--bg` lightened/darkened by 82% opacity over
  itself ≈ `--bg`; the bar's text colors (`--ink`, `--muted`, `--link`) are
  unchanged and already pass on `--bg` (item 2 table). The input/select
  controls inside keep their opaque `var(--surface)` background
  (`controls.css:99`), so their text contrast is untouched. **No new text
  pair is created.** The `border-bottom: 1px solid var(--line)` becomes
  visible via item 1.
- **Effort:** 2 token lines + 3 CSS lines. **Risk:** low — `backdrop-filter`
  degrades to the translucent tint where unsupported (the 82% alpha keeps it
  readable). **Constraints:** C1 (pure CSS), C2 (no asset), C3 (token in both
  theme blocks), C4 (see above), C5 (same neutral palette, just
  translucent).

### 8. Pattern chips + search: clearer selected state, visible focus ring

- **What (in `styles/controls.css`):**
  1. `.chip[aria-pressed="true"]` (`:243`): today `border-color: var(--link);
color: var(--link); background: var(--link-soft)`. Add
     `box-shadow: inset 0 0 0 1px var(--link);` so the selected chip has a
     solid 1px+ ring (the border alone at 1px on `--link-soft` is subtle).
     The ring is `--link` on `--link-soft` = **5.12:1** light / **5.97:1**
     dark (current tokens) — PASS SC 1.4.11. With item 2's refined `--link`
     it becomes **5.92:1 / 6.99:1**.
  2. `input[type="search"]:focus-visible, select:focus-visible` (`:114`):
     already `border-color: var(--link); box-shadow: 0 0 0 3px
color-mix(in srgb, var(--link) 18%, transparent); outline: none;`. This
     is good; keep it. The 3px ring is `--link`-tinted over `--surface` —
     the _border_ (1px `--link`) against the ring reads **4.63:1** light /
     **5.37:1** dark (current) → **5.30:1 / 6.08:1** (refined) — PASS.
  3. `.kbd-hint` (`:190`): `color: var(--muted)` on `var(--soft)` — with
     refined muted, **6.38:1 / 6.99:1** PASS.
- **Why:** the chips are the second-most-used control; a crisper selected
  state reduces mis-clicks. The focus ring already passes; this item is
  mostly "keep + verify".
- **Effort:** 1 line. **Risk:** none. **Constraints:** C1–C5 trivially.

### 9. Featured "Start here" buckets: equal height + hover lift parity with cards

- **What (in `styles/cards.css` `.bucket`, `:36-61`):**
  1. `.buckets` (`:30`) uses `repeat(auto-fill, minmax(min(100%, 240px), 1fr))`
     — reflow-safe already (same `min(100%, …)` guard as the card grid).
     Add `align-items: stretch` (default) and give `.bucket` `height: 100%`
     so the 6 buckets in a row equalize (today their heights vary with hint
     length).
  2. `.bucket:hover` (`:53`) uses `border-color: var(--muted); box-shadow:
var(--shadow-card)` but no lift. Add `transform: translateY(-2px)` to
     match `.card:hover` (`:109`), and add the matching `.bucket:focus-visible`
     rule (buckets are `<button>`s, so the global `:focus-visible` outline
     already applies — `base.css:91` — but a lift parity is nice). The
     global `prefers-reduced-motion` rule (`base.css:97`) kills the
     transform for reduced-motion users.
- **Why:** the buckets are the first thing a new visitor sees in the reading
  column; equal heights + the same hover language as the cards makes the
  default view feel designed rather than stacked.
- **Effort:** 3 lines. **Risk:** low. **Constraints:** C1–C5 trivially
  (motion guarded by the existing global reduced-motion rule).

### 10. Motion audit: one guard already covers everything (keep it that way)

- **What:** do **not** add new motion. The site already has exactly one
  global reduced-motion rule (`styles/base.css:97-104`) that kills every
  `transition`/`animation`/`scroll-behavior` under
  `@media (prefers-reduced-motion: reduce)`. There are 10 `transition`
  declarations across the 5 sheets (measured: base 3, layout 4, tree 1,
  controls 4, cards 4 — some are multi-property). **Any new transition added
  by items 5/7/9 is automatically covered by this rule.** Verify after
  implementing: no new `@media (prefers-reduced-motion)` block is needed.
- **Why:** WCAG 2.2 SC 2.3.3 (Animation from Interactions) is Level AAA, but
  the site already honors it, and the hard constraint requires it. [13]
- **Effort:** 0 (verification only). **Risk:** none.
- **Constraints:** C4 satisfied by the existing guard.

### 11. Verified: the 320px reflow defect is ALREADY FIXED

- **Claim to verify:** `docs/visual-structure-scaling.md` (Q5.3 / Risks table)
  flags a 320px-min grid track overflowing at a 320px viewport (WCAG 1.4.10).
- **Current state (measured at 320×800, both themes, via CDP):**
  `docScrollW == docClientW == 320`, `hasHorizScroll: false`. The grid track
  resolves to **296px** (the content box after the 12px side padding), i.e.
  `minmax(min(100%, 320px), 1fr)` (`cards.css:83`) correctly clamps to 100%
  and does **not** overflow. The dead `.grid { grid-template-columns: 1fr }`
  override in `layout.css:135` flagged by the earlier note is **gone** — the
  current `layout.css` (143 lines) has no `.grid` rule at all (verified by
  grep).
- **Verdict:** the historical 1.4.10 defect is **fixed** in the current
  tree. No action needed; do not re-introduce a hard `320px` minimum. The
  `min(100%, 320px)` pattern is the correct one and items 5/9 keep it.
- **Cite:** WCAG 2.2 SC 1.4.10 Reflow (320 CSS px, no two-dimensional
  scrolling). [14]

### 12. Optional: express the refined tokens in `oklch()` for perceptual uniformity

- **What:** once items 1–2 land, the four role tokens (`--ink`, `--muted`,
  `--link`, `--line`) _may_ be re-expressed in `oklch()` so the light/dark
  pair is perceptually even (equal lightness steps). `oklch()` and
  `color-mix()` are Baseline **widely available** (Chrome 111 / Safari 16.2 /
  Firefox 113 for `oklch`; `color-mix` Chrome 111 / Safari 16.2 / Firefox 113).
  [15][16]
- **Script-verified `oklch()` equivalents (sRGB hex shown for the ratio
  math):**

  | Token           | oklch proposal          | sRGB hex  | on surface  | on soft    |
  | --------------- | ----------------------- | --------- | ----------- | ---------- |
  | light `--ink`   | `oklch(0.26 0.016 255)` | `#1f252c` | **15.45:1** | —          |
  | light `--muted` | `oklch(0.44 0.016 255)` | `#4d535b` | **7.77:1**  | **6.86:1** |
  | light `--link`  | `oklch(0.47 0.13 250)`  | `#065da0` | **6.82:1**  | —          |
  | dark `--ink`    | `oklch(0.91 0.008 255)` | `#dee2e7` | **12.85:1** | —          |
  | dark `--muted`  | `oklch(0.72 0.012 255)` | `#a0a5ac` | **6.74:1**  | **6.05:1** |
  | dark `--link`   | `oklch(0.80 0.09 250)`  | `#91c3f6` | **9.03:1**  | —          |

  All PASS 4.5:1.

- **Verdict:** **optional, low priority.** The hex values in items 1–2 are
  already verified and are simpler to diff. Adopt `oklch()` only if a future
  palette is generated in a perceptual space; do not migrate purely for
  uniformity — the gain is invisible at these contrast levels. Tagged
  `[INFERENCE]`: the perceptual-uniformity benefit is real per CSS Color 4
  [15] but the _visible_ improvement at AA-passing ratios is marginal.
- **Constraints:** C1–C5 trivially (pure CSS, both themes, no asset).

## Out of scope / rejected

| Idea                                                         | Why rejected                                                                                                                                                                                                                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Webfont (e.g. Inter, system-ui alternative) for "nicer" type | Violates C2 (no external assets). The system stack (`base.css:55-63`) is the constraint-compliant choice.                                                                                                                                                          |
| Masthead/hero/first-impression redesign, logo, rebrand       | Explicitly out of scope per the brief; also C5 (no rebrand).                                                                                                                                                                                                       |
| Card grid → masonry / variable row spans                     | Breaks the equal-height reading rhythm this note recommends; `content-visibility: auto` (`cards.css:100`) already keeps rendering cheap; masonry would fight `minmax(min(100%,320px),1fr)` and risk 1.4.10.                                                        |
| Colorful per-pattern accent on `.tag` / `.chip`              | C5 (neutral utilitarian identity); also risks C4 (each new hue needs a full AA pass in both themes). Rejected.                                                                                                                                                     |
| Gradient borders / glows on cards                            | C5 (not neutral); glows read as decoration, not information. Rejected.                                                                                                                                                                                             |
| `light-dark()` to collapse the two theme blocks              | The site has no manual theme toggle; `light-dark()` follows `color-scheme`, and the existing `@media (prefers-color-scheme: dark)` block already works. Migrating adds risk for zero user-visible gain. Rejected for now (revisit if a toggle is ever added). [17] |
| `@layer` to scope new component styles                       | Per `docs/visual-structure-scaling.md` Q1.3: unlayered rules beat layered ones; introducing layers in one file demotes every existing rule. Rejected.                                                                                                              |
| Container queries for the card grid                          | The grid is a layout object sized by the viewport, not a component reused at different widths; media-query-free `auto-fill` already does the job. Rejected per the earlier note's Q6.                                                                              |
| `scrollbar-gutter: stable both-edges`                        | Reserves gutter on both sides, wasting reading width; `stable` alone is enough to stop the shift. Rejected.                                                                                                                                                        |
| Raising body text above 16px base                            | `clamp()` in item 3 already reaches 16px at desktop widths; a hard 16px floor would hurt the 320px reflow (C4 / 1.4.10). Rejected as a hard floor.                                                                                                                 |

## Current state vs proposals (summary)

**Verified current-state facts** (repo `file:line` + CDP measurement + script):

- All SC 1.4.3 text pairs PASS in both themes; the weakest are light
  `--muted` on `--soft` (5.30:1) and light `--link` on `--link-soft` (5.12:1).
- SC 1.4.11 non-text `--line` pairs **FAIL** in both themes (1.14–1.40:1).
- The global `:focus-visible` rule is **live** (`base.css:91`, single colon;
  the earlier note's `::focus-visible` defect is fixed). Measured
  `focusVisibleSelectors` includes a bare `:focus-visible`.
- `text-wrap` is `wrap` everywhere (no balancing today).
- `body` font-feature-settings is `normal`; kerning/ligatures not pinned.
- Collapsed card heights vary 304–369px (no equalization).
- No `.card:focus-within` rule exists.
- `html` `scrollbar-gutter` is `auto` (expand/collapse can shift the grid).
- The sticky `.controls-bar` is opaque `var(--bg)` with `backdrop-filter: none`.
- 10 `transition` declarations; one global `prefers-reduced-motion: reduce`
  guard in `base.css:97`.
- 320px reflow: **no horizontal scroll** (1.4.10 satisfied); the old dead
  `.grid` override is gone from `layout.css`.

**Proposals** (items 1–10, 12): all are pure-CSS token/selector changes in
`styles/tokens.css`, `styles/base.css`, `styles/layout.css`,
`styles/tree.css`, `styles/controls.css`, `styles/cards.css`. Every proposed
color pair has a script-computed ratio shown above (≥4.5:1 text, ≥3:1
non-text). Every motion-touching item is covered by the existing global
reduced-motion guard.

## Method

- **Contrast math:** a throwaway Python script implemented the WCAG 2.2
  relative-luminance and contrast-ratio formulas
  (`(L1+0.05)/(L2+0.05)`, linearized sRGB, 0.2126/0.7152/0.0722 weights)
  exactly as WCAG 2.2 defines them [8][9], plus an OKLCH→sRGB converter
  (Ottosson, as specified by CSS Color 4 [15]) for the `oklch()` candidates.
  It computed every text/background pair the current `tokens.css` implies in
  both themes, plus the derived `color-mix()` tints the CSS actually uses
  (`::selection`, `.card:hover` border, selected `.node-count`, search focus
  ring), plus every proposed token. The script was not committed.
- **Live-site measurement:** the repo was served locally (`npx serve`) and
  driven over CDP (headless Chrome 155) with
  `Emulation.setEmulatedMedia` to set a _real_ `prefers-color-scheme`
  (light/dark), at 1440×900, 390×844 and 320×800. Computed styles, scroll
  widths, card heights and focus-rule presence were read via
  `Runtime.evaluate`. Screenshots were captured for analysis only and are not
  committed.
- **Support claims** checked against MDN's Baseline badges and web.dev
  Baseline pages, not caniuse blog summaries.

## References

All read on 2026-10-21.

1. MDN — `text-wrap` CSS property (Baseline: widely available; `balance`/`pretty` values): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-wrap
2. MDN browser-compat-data — `text-wrap: pretty` (Chrome 117, Safari 17.5, Firefox not yet shipped — degrades gracefully): https://github.com/mdn/browser-compat-data/issues/25394
3. MDN — `hyphens` CSS property: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/hyphens
4. MDN — `overflow-wrap` CSS property: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/overflow-wrap
5. web.dev — "CSS `scrollbar-gutter` and `scrollbar-width` are Baseline Newly available" (Chrome 94 / Firefox 97 / Safari 18.2): https://web.dev/blog/baseline-scrollbar-props
6. W3C — CSS Fonts Module Level 4 (`font-kerning`, `font-variant-ligatures`, `font-optical-sizing`): https://www.w3.org/TR/css-fonts-4/
7. MDN — OpenType font features guide (`font-variant-numeric`, ligatures): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Fonts/OpenType_fonts
8. W3C — WCAG 2.2, SC 1.4.3 Contrast (Minimum): 4.5:1 normal text, 3:1 large text (≥24px, or ≥18.66px bold); defines relative luminance and contrast ratio: https://www.w3.org/TR/WCAG22/#contrast-minimum
9. W3C — WCAG 2.2, SC 1.4.11 Non-text Contrast: 3:1 for UI-component boundaries and graphical objects; defines the contrast-ratio formula: https://www.w3.org/TR/WCAG22/#non-text-contrast
10. MDN — `clamp()` (Baseline widely available): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/clamp
11. MDN — `backdrop-filter` (Baseline newly available since 2024-09; Safari needs `-webkit-` prefix before 18): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter
12. web.dev — Interop 2025: "`backdrop-filter` has been Baseline Newly available since September 2024": https://web.dev/blog/interop-2025
13. MDN — `@media (prefers-reduced-motion)`: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
14. W3C WAI — Understanding SC 1.4.10 Reflow (320 CSS px, no two-dimensional scrolling): https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
15. W3C — CSS Color Module Level 4 (`oklch()`, `color-mix()`, relative color syntax): https://www.w3.org/TR/css-color-4/
16. MDN — `oklch()` / `color-mix()` browser support (Chrome 111 / Safari 16.2 / Firefox 113): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch ; https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/color-mix
17. MDN — `light-dark()` (follows `color-scheme`, not `prefers-color-scheme` directly): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark
18. MDN — `min()` (clamp a size against a fixed and a relative value): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/min

Repo files consulted: `index.html`, `styles/tokens.css`, `styles/base.css`,
`styles/layout.css`, `styles/tree.css`, `styles/controls.css`,
`styles/cards.css`, `app/main.js`, `app/results.js`, `app/tree.js`,
`app/featured.js`, `app/facets.js`, `data/featured.js`, `data/taxonomy.js`,
`docs/visual-structure-scaling.md`, `docs/css-organization.md`,
`README.md`, `package.json`.
