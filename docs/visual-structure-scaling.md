# Visual structure as the deck grows: CSS organization, tokens, theming and responsive layout

> Location note: this file lives in `docs/`, alongside `docs/css-organization.md`
> (the earlier, narrower note on splitting one `styles.css` into six files). Read
> on 2026-10-20 against the current tree: `styles/tokens.css` (84 lines),
> `base.css` (93), `layout.css` (138), `tree.css` (120), `controls.css` (226),
> `cards.css` (209), all linked in `index.html`; `scripts/build-pages.mjs` copies
> `styles/` via `SITE_DIRS`. This note validates that earlier recommendation
> point by point and extends it to the questions that only appear once the deck
> has more components, more contributors and more themes.

## Recommendation

The existing split is still the right shape. Keep it, fix the places where the
cascade is already being violated, and add six rules that make it survive
growth:

1. **Keep multiple `<link rel="stylesheet">` tags, in one fixed order, and keep
   `@import` out.** web.dev documents both the request-chain cost of `@import`
   and the fact that imported sheets are invisible to the preload scanner;
   MDN's "Organizing your CSS" explicitly endorses one global sheet plus smaller
   per-area sheets, and notes this reduces source-control conflicts between
   contributors. [1][8]
2. **Keep skipping `@layer` — the earlier note's reason holds, and now it is the
   _only_ reason that matters.** Support has stopped being a question: cascade
   layers have been Baseline _widely available_ since 2024-09-14. What remains is
   that a _mixed_ layered/unlayered sheet is worse than link order for
   hand-edited CSS (unlayered normal rules beat every layered rule), so layers
   are only worth adopting as a single all-at-once migration. [3][4][38][39]
3. **Keep all six files render-blocking in `<head>`**, and add
   `<meta name="color-scheme" content="light dark">` _before_ the first
   stylesheet so the browser paints form controls and the canvas in the right
   scheme before CSS arrives. [8][13]
4. **Grow `tokens.css` in place until it hurts, then split it by token family**
   (`tokens/color.css`, `tokens/space.css`, `tokens/type.css`) — not per
   component. Group prefixes (`--color-*`, `--space-*`, `--radius-*`,
   `--type-*`, `--shadow-*`) are the naming convention that keeps a 22-token
   file readable at 100 tokens. Semantic names stay the default; the raw scale
   gets scale names. [10][17][18][19][20][21][23]
5. **One component lives in one file, and its selectors are scoped by its block
   class.** That is closer to CUBE CSS than to BEM, and it is what the code
   already mostly does (`.card .top`, `.prompt summary`). BEM's value — global
   collision avoidance and searchability — is delivered by a _namespace_ instead
   (`.card__title` or `.card .title`), and GOV.UK's own answer is to combine a
   namespace with BEM and a strict "each class has a single purpose" rule. [21][22][42]
6. **Responsive layout: one shell breakpoint, component queries only where a
   component is genuinely reused in different widths.** The card grid already
   reflows with `repeat(auto-fill, minmax(...))`; container queries are for the
   detail pane or a future sidebar card, not a blanket replacement for media
   queries. [24][26][27]

Three defects found while validating the current files are worth fixing in the
same change (details in Q1.4, Q1.5 and Q5.3):

| Found                                                                | File                                   | Effect                                                                                                                                             |
| -------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `::focus-visible { … }` (double colon)                               | `styles/base.css:90`                   | The rule is an invalid selector, so the global 2px focus outline never applies; only the per-widget `:focus-visible` rules do.                     |
| `.grid { grid-template-columns: 1fr }` inside the ≤900px media query | `styles/layout.css:135`                | Loses the equal-specificity tie to `.grid` in `cards.css:3`, which loads _later_; the "one column on small screens" override is dead code.         |
| Card grid minimum track `320px` with `12px` side padding             | `styles/cards.css:5`, `layout.css:129` | At a 320 CSS px viewport the content box is 296px, so a 320px minimum track overflows horizontally — the case WCAG 1.4.10 Reflow names explicitly. |

## Point-by-point verdict on `docs/css-organization.md`

| Existing point                                         | Verdict                                                              | Why (with source)                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------ | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Multiple `<link>` tags, one per responsibility         | **Confirm**                                                          | web.dev: `<link>` sheets download concurrently; MDN: multiple sheets are fine and later links cascade later; multiple smaller sheets also reduce edit conflicts. [1][8]                                                                                                                                                                                          |
| Not `@import`                                          | **Confirm, strengthen**                                              | `@import` creates a request chain and is late-discovered by the preload scanner; it also must precede all rules except `@charset`/`@layer` statements, an easy mistake with no visible symptom. [2][8]                                                                                                                                                           |
| Skip `@layer` "for now"                                | **Confirm — and the stated reason is now the only one that matters** | Support is universal (Baseline widely available 2024-09-14). The remaining hazard is the mixed-mode trap: unlayered normal declarations always beat layered ones, and `!important` inverts layer order. MDN's own lesson frames layers as a tool for CSS from "multiple sources … plugins, and development teams", which this site does not have. [3][4][38][39] |
| Tokens in `tokens.css`, semantic names                 | **Confirm**                                                          | MDN: custom properties remove duplicated values and semantic names (`--main-text-color`) beat raw hex; GOV.UK forbids copying hex values and exposes purpose-named functional colours. [10][20]                                                                                                                                                                  |
| Keep everything render-blocking in `<head>`            | **Confirm**                                                          | CSS is render-blocking by design to prevent FOUC; moving sheets to async patterns reintroduces the flash. Total payload here is 16.5 KB raw / ≈5.8 KB gzipped, so request count is not a factor. [8]                                                                                                                                                             |
| Update `scripts/build-pages.mjs` for new CSS files     | **Already satisfied, downgrade to a note**                           | `SITE_DIRS` already contains `"styles"` (and `app`, `data`, `assets`, `images`, `fonts`), so new files inside `styles/` ship automatically; only a _new top-level directory_ would need a change.                                                                                                                                                                |
| Order is the API (tokens → base → layout → components) | **Confirm — and it is already being violated**                       | The `.grid` override in `layout.css` loses to `cards.css` for exactly the reason the note predicts. [6][1]                                                                                                                                                                                                                                                       |

## Q1 — Is the multiple-`<link>` split still right?

### 1.1 `<link>` per file: unchanged

The cascade rule the earlier note relies on is still in the spec: declarations
from style sheets "independently linked by the originating document are treated
as if they were concatenated in linking order", and order of appearance is the
last sorting criterion — after origin/importance, context, style attribute,
layers, specificity and scope proximity. [6] web.dev's performance module
recommends `<link>` over `@import` because linked sheets are discovered in the
HTML and downloaded concurrently. [8]

Two practical refinements for a growing deck:

- **Do not split by route or by media.** MDN notes that a `<link>` with a
  non-matching media query _still downloads_ (at lower priority). Splitting
  `cards.css` behind `media="(min-width: 900px)"` therefore buys nothing except
  a second copy of the cascade to reason about. The only legitimate `media`
  split is `media="print"`. [9]
- **Do not inline critical CSS.** web.dev recommends inlining only after
  measuring; the whole deck's CSS is ~5.8 KB gzipped, and inlined CSS is not
  cached across navigations. [8] [UNVERIFIED: no Lighthouse or field data was
  run for this site; the size figure is `gzip -c styles/*.css | wc -c`.]

### 1.2 `@import`: still no

MDN: an `@import` must be "defined at the top of the stylesheet, before any
other at-rule (except `@charset` and `@layer`) and style declarations, or it will
be ignored." web.dev: because the browser must download the importing sheet
before it discovers the import, `@import` produces a request chain and defeats
the preload scanner. [2][8] Nothing in the current CSS uses it.

### 1.3 `@layer`: "skip" survives, and its stated reason is now the decisive one

What has changed since the earlier note was written:

- **Availability is settled.** Chrome 99, Firefox 97, Safari 15.4 shipped
  layers in early 2022; the WebDX Baseline data marks `cascade-layers` _widely
  available_ with a low date of 2022-03-14 and a high date of 2024-09-14. [39][40][41]
- **The guidance has not changed in substance.** MDN's cascade-layers lesson
  still says layers are "most relevant when you're working with CSS from
  multiple sources when there are conflicting CSS selectors and competing
  specificities, or when you're considering using `!important`." A single-owner,
  hand-authored site has neither problem. [4]

What has _not_ changed, and is the actual reason to keep skipping it:

- Unlayered normal declarations always override layered ones — MDN states this
  in the first paragraph of the `@layer` reference, and Chrome's guide calls it
  "Rule 2". The normative wording in CSS Cascading and Inheritance Level 6 §3.1
  is: "for normal rules the declaration whose cascade layer is latest in the
  layer order wins", with unlayered declarations forming an implicit final
  layer. [3][6][41]
- `!important` inverts layer order; layer order is fixed by the _first_
  occurrence of each name, so a late `@layer` statement silently no-ops. Layer
  ordering is defined in CSS Cascading and Inheritance Level 5 (Candidate
  Recommendation) and carried forward into Level 6, so neither edition changes
  the conclusion. [3][7][41]
- The repo already has six unlayered files. Introducing layers "for the new
  component only" would demote every existing rule relative to it, which is a
  strictly worse failure mode than the link-order mistake described in Q1.4.

**Revised rule for new code:** don't add a layer block to one file. If layers
are ever wanted, migrate in one commit: a single statement at the top of
`tokens.css` (`@layer reset, tokens, base, layout, components;`), every file's
rules wrapped, and the statement treated as the new "order is the API" comment.
Until then, link order remains the only ordering mechanism, which is the
simplest thing a non-expert can hold in their head.

`@scope` is worth watching but not adopting: Baseline _newly available_ on
2026-03-24, and it changes specificity semantics again — scoped rules are sorted
by proximity after specificity, and `&` inside `@scope` behaves like
`:where(:scope)` rather than like nesting. It solves the "donut" case (style an
element inside a subtree but not inside a nested component), which this deck
does not yet have. [39][44]

### 1.4 The order problem is already real, not hypothetical

Two live examples from the current files:

1. `styles/layout.css:135` sets `.grid { grid-template-columns: 1fr }` inside
   `@media (max-width: 900px)`. `styles/cards.css:3` sets
   `.grid { grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)) }`.
   Both selectors are `0-1-0`; media queries do not add specificity; `cards.css`
   is linked last, so it wins. The mobile override never takes effect. [5][6]
2. `.copy:hover` is styled in `styles/controls.css:68` while `.copy` itself is
   defined in `styles/cards.css:105`. A future edit to `.copy` in `cards.css`
   will not obviously reach the hover state.

The fix is structural, not cosmetic: **a component's rules live in the file that
owns the component, and a file never reaches into another file's component to
add a state.** Put the `.grid` responsive rule in `cards.css` next to `.grid`, or
move `.grid` into `layout.css` as a layout object. GOV.UK's style guide makes the
same argument for "single responsibility" classes: styles can be added or
removed without fear of breaking another component. [21]

### 1.5 A selector-level bug in `base.css`

It is the kind of thing a non-expert cannot see by reading the CSS, and it sits
in the file everyone is told to edit last:

1. **`::focus-visible` is not a selector.** `:focus-visible` is a pseudo-class
   (one colon); `::focus-visible` would name a pseudo-element, which does not
   exist, so the selector is invalid and the whole rule — the global 2px focus
   outline at `base.css:90` — is dropped. MDN: double colons are for
   pseudo-elements, and only `::before`, `::after`, `::first-line` and
   `::first-letter` support the legacy single-colon form; the inverse
   (`::` on a pseudo-class) is simply invalid. Because a selector list is
   dropped wholesale if any selector in it is invalid, this is also the failure
   mode to remember when adding `:has()`/`:where()` fallbacks. [35][36]
2. **`::selection` and `::before` are correctly written with two colons** and
   need no change. They are noted only because legitimate `::` selectors in the
   same file make the `::focus-visible` typo harder to spot when skimming.

The focus fix is one character, but its effect is large: with the rule live, every
focusable element gets a consistent outline, the thing keyboard-only users rely
on in a two-pane layout, and the visible indicator WCAG 2.4.7 (Focus Visible, AA)
requires. [46] Verify by tabbing from the skip link through the tree and
controls, not by reading the file.

## Q2 — Token organization as the token count grows

Current state: **22 distinct custom properties** (`--bg`, `--surface`, `--ink`,
`--muted`, `--line`, `--soft`, `--link`, `--link-soft`, `--mark-bg`,
`--mark-ink`, three shadows, two radii, five spacing steps, two type sizes),
consumed by **162 `var(--…)` references** across the five component sheets
(grep counts). The file is 84 lines and comfortably single-file.

### 2.1 One `tokens.css` or a `tokens/` directory?

Stay single-file now. Split when any of these becomes true:

- more than ~60–80 declarations, or more than two themes;
- a second contributor needs to edit tokens at the same time as you;
- a group of tokens has a different lifecycle (e.g. a brand palette that is
  regenerated, next to spacing that is hand-tuned).

[UNVERIFIED: the 60–80 figure is a judgement call. The _direction_ is sourced:
MDN recommends breaking large stylesheets into smaller ones precisely because
"if multiple people are working on the CSS, you will have fewer situations where
two people need to work on the same stylesheet at once, leading to conflicts in
source control."] [1]

When the split happens, split **by token family, not by component**:

```
styles/tokens/color.css    ← semantic colours + light/dark overrides
styles/tokens/space.css    ← --space-*
styles/tokens/type.css     ← --type-*, font stacks, line heights
styles/tokens/effects.css  ← --radius-*, --shadow-*
```

loaded in that order before `base.css`. No build change is needed: `cpSync` is
recursive, so a `styles/tokens/` subdirectory ships with the rest of `styles/`
(`scripts/build-pages.mjs` copies `SITE_DIRS` entries with `recursive: true`).
This mirrors how the design systems
that actually publish tokens organize them: USWDS documents separate token sets
for color, spacing units, and typesetting (font family, size, measure), and
GOV.UK keeps "colour palettes and spacing and typography scales" together in a
`settings` layer that "should not output any CSS". [17][19][22]

A tempting alternative — one file per component with its own local custom
properties — is the wrong axis here: it hides the shared vocabulary that makes
`--space-3` mean the same thing in `cards.css` and `controls.css`. CUBE CSS is
explicit that tokens are the "single source of truth" and that utilities exist to
extend them, not to duplicate them per block. [42]

### 2.2 Naming: semantic first, grouped by family

Keep the existing semantic names. MDN's argument is exactly this: custom
properties exist so that "changing a color that's been duplicated in many places"
is a one-line edit, and names like `--main-text-color` are "easier to understand
than the hexadecimal color" because they carry meaning. [10]

The one inconsistency to fix as the file grows: **colours are the only family
without a prefix.** Spacing (`--space-*`), radii (`--radius*`), type
(`--type-*`) and shadows (`--shadow-*`) are already grouped; colours are `--bg`,
`--ink`, `--muted`, `--line`, `--soft`, `--link`. Rename them to
`--color-bg`, `--color-ink`, `--color-muted`, `--color-line`, `--color-soft`,
`--color-surface`, `--color-link`, `--color-link-soft`, `--color-mark-bg`,
`--color-mark-ink` when you next touch each one (or add the prefixed name as the
definition and keep the old name as an alias for one release). At 22 tokens the
rename is a find-and-replace in six files; at 100 it is a project.

Why grouping matters more than the exact prefix: it makes duplicate or
near-duplicate tokens visible, and it gives the future `tokens/` split a
mechanical boundary. The DTCG format module makes groups first-class for the
same reason — groups are "a set of tokens belonging to a specific category", and
`$type` may be declared once on a group and inherited by its tokens. [23]

Two conventions to avoid:

- **Don't name tokens after values** (`--blue-500`) for anything a component
  consumes. GOV.UK's colour guidance is blunt: "Do not copy the specific
  hexadecimal (hex) colour values … use `govuk-functional-colour("brand")`
  rather than `#1d70b8`", so a palette update propagates. [20]
- **Don't build a two-tier alias chain** (primitive → semantic → component) at
  this size. It is how large systems reconcile palettes with themes, but every
  extra tier is a hop a non-expert has to follow in DevTools. USWDS only
  introduces the system→theme indirection because it ships 24 colour families;
  its theme tokens are the small role-based subset projects actually use. [17][18]

### 2.3 DTCG format: not now, and not without a build step

The Design Tokens Community Group's Format Module 2025.10 is a _Final Community
Group Report_ — explicitly "not a W3C Standard nor … on the W3C Standards
Track" — defining a JSON interchange format (`$value`, `$type`,
`$description`, `.tokens.json`). Its stated purpose is moving tokens between
design tools, translation tools and documentation tools. [23]

Relevance here:

- **It is not a CSS format.** You would still ship `tokens.css`; the JSON would
  be an authoring source that generates it, i.e. a codegen step, which the
  no-build constraint rules out for now.
- **Adopt it only when a design tool is the source of truth.** That is a real
  future trigger (a designer maintaining the palette in Figma). Until then the
  cost is a second copy of the tokens that can drift.
- **Borrow the ideas, not the file.** Hierarchical groups and `$type`
  inheritance map cleanly onto grouped custom properties and the `tokens/`
  directory split above. [23]

### 2.4 `@property`: only for tokens that need type checking

`@property` requires `syntax` and `inherits`, and (unless `syntax: "*"`) an
`initial-value`; registering a token as `<color>` means an invalid value falls
back to the initial value rather than being ignored, which can hide mistakes.
It also enables animating the token itself. None of the current 22 tokens is
animated or interpolated, so registration buys nothing today. Add it only if a
token becomes animatable (e.g. a progress or skeleton shimmer). [11]

## Q3 — Component CSS conventions for non-expert contributors

### 3.1 What the methodologies actually claim

- **BEM** encodes block/element/modifier in the class name (`.block__element--modifier`).
  GOV.UK Frontend uses BEM plus a `govuk-` namespace "to reduce the likelihood of
  conflicting with existing classes" and to make it obvious where a style comes
  from; it pairs that with a single-responsibility rule per class. [21]
- **CUBE CSS** deliberately drops formal element syntax: by the time you reach a
  block, "most of the work has already been done" by global, composition and
  utility layers, so a block is just a small set of rules scoped by its root
  class; the block class adds "one extra specificity point". It also warns
  blocks should stay under roughly 80–100 lines and solve one contextual
  problem. [42]
- **MDN** declines to pick a winner: consistency matters more than the specific
  convention, and heavyweight methodologies "can seem overly complex,
  especially for smaller projects." [1]

### 3.2 What fits this repo

The existing code is already CUBE-shaped: one root class per component and
descendant selectors inside it (`.card .top`, `.prompt summary`, `.chip-count`,
`.node-row`). That is the lowest-learning-curve option for a non-expert: to
change a card, you find `.card` and edit the rules underneath it; you never have
to rename a class in `results.js` to match a new BEM element.

Keep that, and add two mechanical rules:

1. **A component's root class must not be a bare English word that another
   component could plausibly use.** Current offenders: `.title`, `.text`,
   `.tag`, `.copy`, `.count`, `.grid`, `.empty`. They are global names defined in
   `cards.css` and `controls.css` and consumed from the other file
   (`.copy:hover`, `.empty .ghost`). Either scope them (`.card .title`,
   `.card .text`) or rename them with the block as a prefix
   (`.card-title`, `.card-text`, `.card-tag`, `.card-copy`). Prefixing is the
   cheaper diff and matches the GOV.UK namespace argument. [21]
2. **No utility classes for layout spacing.** A `.mt-3`-style layer only pays off
   when many authors compose pages in HTML; here the HTML is generated by
   `app/results.js`, so a utility class is invisible to the person editing CSS
   and adds a second vocabulary. CUBE's own utility layer is token-generated and
   intended for design systems that ship a class per token — a codegen step this
   repo does not have. [42]

BEM remains a reasonable choice **if** the team grows to several CSS authors and
wants the naming to be externally recognizable. If you adopt it, adopt it
everywhere at once; a half-BEM file is worse than either convention, and the
same is true of nesting — CSS nesting is now Baseline _widely available_
(Chrome 120, Firefox 117, Safari 17.2) but `&` carries `:is()`-like specificity
(highest specificity in the selector list), which is a trap for occasional
contributors. [34][39] Recommend: keep selectors flat and one class deep.

### 3.3 Comments are part of the convention

MDN recommends section comments with a searchable marker (`/* || Section */`) so
you can jump between sections, and comments only where a decision needs
explaining. The existing files already do the second half well ("Load order is
the API…", "The search/sort bar stays pinned…"). Add one header line per file
naming its owner component, so the "which file?" question is answered without
reading CSS. [1]

## Q4 — Theming

### 4.1 The current pattern is correct

`tokens.css` defines light values on `:root`, overrides them inside
`@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme="light"])`,
and overrides again under `:root[data-theme="dark"]`. This is precisely the
technique web.dev's theming module teaches: put the colour values in custom
properties, update the properties inside `prefers-color-scheme`, and never write
the selectors twice. [15] MDN's `color-scheme` reference adds the missing piece
the file already has — `color-scheme: light` / `dark` on `:root` so form
controls, scrollbars and the canvas follow the theme. [12]

### 4.2 Should a manual toggle be added? Yes — or delete the hook

Today `data-theme` is **dead code**: no HTML attribute, no JS writes it (`grep`
over `app/` and `index.html` finds only the CSS selectors). A dormant hook is
worse than no hook, because it implies a feature that does not exist and invites
someone to "just set the attribute" without handling persistence or the
system-preference default.

Two honest options:

- **Remove** the `[data-theme]` selectors and keep pure `prefers-color-scheme`.
  Simplest, and fully honours the user's OS setting.
- **Implement a tri-state control** (System / Light / Dark) stored in
  `localStorage`, defaulting to System, with `data-theme` set on `<html>` only
  when the user has chosen explicitly. This is the option to prefer because the
  selector structure already exists.

Guidance to respect when implementing it:

- MDN's `light-dark()` page warns that forcing a scheme on a section "generally
  should not be done … If the user has made a preference, you generally should
  not override their preferences." A toggle is legitimate only because the user
  is the one overriding — so the default must remain "follow the OS". [14]
- Put the stored choice back on `<html>` in an inline script in `<head>`, before
  the first paint, or the page will flash the wrong theme. MDN recommends the
  `<meta name="color-scheme">` tag to prevent exactly this flash. [12][13]
- The toggle itself must be a real `<button>` with `aria-pressed` or a
  three-state control; the repo already uses `aria-pressed` for the pattern
  chips and "Expand all", so reuse that pattern. [45]

### 4.3 `light-dark()`: compatible, but optional

`light-dark()` (Baseline _newly available_ 2024-05-13; Chrome 123, Firefox 120,
Safari 17.5) returns one of two colours/images according to the used
`color-scheme`, and requires `color-scheme: light dark` on `:root`. It would
collapse each colour token from two declarations to one. The light/dark token
split it replaces is the pattern web.dev's "Building a color scheme" derives in
full (brand → text/surface/shadow per scheme), which is also the best argument
for keeping the current explicit blocks while the palette is still small: you
can read both themes side by side. [16]

```css
:root {
  color-scheme: light dark;
  --color-bg: light-dark(#f7f8fa, #12151a);
}
```

That is attractive, but it changes the theming model: the switch becomes
`color-scheme` rather than a duplicate token block, and a forced theme must set
`color-scheme` (which the current `[data-theme="dark"]` block already does via
its `color-scheme: dark` declaration). Recommendation: **do not migrate yet.**
The duplication is 10 colour lines per theme and easy to audit; migrating means
every contributor must learn that `light-dark()` follows `color-scheme`, not
`prefers-color-scheme`. Revisit if a third theme (high-contrast) appears, where
the two-value form stops scaling anyway. [12][14][39]

### 4.4 Add the `<meta name="color-scheme">` tag

`index.html` currently has no colour-scheme meta. MDN: include
`<meta name="color-scheme" content="light dark">` in `<head>`, "before any CSS
style information, to inform user agents about the preferred color scheme,
helping prevent unwanted screen flashes during the page load." [13] One line,
no risk.

### 4.5 Reduced motion is only half-covered

`styles/cards.css:31` disables the card hover transition under
`prefers-reduced-motion: reduce`. But there are **12 `transition` declarations**
across the six files (drawer transform and scrim opacity in `layout.css`,
buttons/chips/inputs in `controls.css`, tree rows in `tree.css`, skip link in
`base.css`). MDN: the feature exists to remove or replace "non-essential motion",
and animations such as scaling or panning can trigger vestibular discomfort. [29]

Move the guard into `base.css` as a single global rule:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

and delete the per-component one in `cards.css` (keeping the `transform: none`
on `.card:hover` if the lift is considered decorative motion rather than a state
cue). This is a `base.css` responsibility: it is the one file allowed to use
`*`. Note that this is the one place a `!important` is defensible — it is the
"override everything" layer in ITCSS terms, and GOV.UK's overrides layer does the
same. [22][43]

## Q5 — Responsive structure as components multiply

### 5.1 Keep the shell breakpoint

`layout.css` uses a single `@media (max-width: 900px)` to collapse the two-pane
grid into one column and turn the sidebar into an off-canvas drawer. That is the
right tool: media queries query the viewport, which is what a page shell is
sized by. MDN draws the distinction plainly — media queries apply styles "based
on viewport size or other device characteristics", container queries apply them
"based on certain attributes of its container". [24]

Two refinements:

- **Use a mobile-first or a single-direction breakpoint, not both.** The file
  currently has one `max-width` query, which is fine; keep it that way rather
  than adding a second `min-width` query for a tablet state.
- **Express the shell with `minmax(0, 1fr)`** (already done at `layout.css:5`)
  so long unbreakable strings in cards cannot blow out the grid track.

### 5.2 Container queries: for reused components, not for the page

Size container queries are Baseline _widely available_ — WebDX records the
feature as widely available with a low date of 2023-02-14 and a high date of
2025-08-14; Chrome 105, Firefox 110, Safari 16 shipped them. [27][39] They are
the right answer when **the same component appears at different widths in
different places** — MDN's example is a card that lays out one way in a sidebar
and another in a product grid. [24]

The deck has exactly one such reusable component today: the prompt card, and it
already adapts through the grid (`repeat(auto-fill, minmax(…))`) without any
query at all. So:

- **Do not** convert the shell or the card to container queries now.
- **Do** reach for them when the detail view lands (a card inside a wide reading
  column vs. inside a narrow drawer). The pattern is: `container-type:
inline-size` on the wrapper, `@container (width > 40rem) { … }` inside the
  component's own file. Note the containment side effect: `inline-size` applies
  style and inline-size containment, so the container's inline size can no
  longer depend on its children. [25]
- **Name the container** (`container: card / inline-size`) once more than one
  component uses queries in the same subtree, or an unnamed query will match the
  nearest ancestor and produce surprising results. [24][26]

### 5.3 Fix the 320px overflow

WCAG 1.4.10 requires content to reflow "at a width equivalent to 320 CSS pixels"
without two-dimensional scrolling. [31] At ≤900px, `.main` has
`padding: var(--space-4) var(--space-3) 72px` → 12px each side, so a 320px
viewport gives a 296px content box. The grid track minimum is a hard `320px`, so
the track overflows and the page scrolls horizontally by ~24px.

Fix with a clamped minimum (MDN documents `min()` for exactly this "at most /
at least" sizing):

```css
.grid {
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
}
```

`min(100%, 320px)` yields 296px at the 320px viewport, so the single column
fits. This also makes the dead `.grid` override in `layout.css` unnecessary —
delete it rather than moving it. The same WCAG understanding is the reason to
keep the type scale in `rem`: 1.4.4 makes resizing the user agent's job and the
author's job only to not prevent it, so a token scale locked in absolute units
(or a `clamp()` with a fixed `px` ceiling) works against it. [31][33][37]

While there: the `320px` track is a magic number duplicated nowhere else, so it
can stay literal; but the sidebar width `290px` and the drawer width
`min(320px, 86vw)` are the kind of values that become tokens (`--sidebar-width`,
`--drawer-width`) as soon as a second breakpoint needs them.

### 5.4 Rendering: let the browser skip offscreen cards

The grid currently renders every matching card — all 157 today, and every match
after any future data growth. `content-visibility: auto` lets the UA skip layout and paint for
off-screen cards while keeping them in the DOM, the accessibility tree and
find-in-page — the exact property web.dev measured at 7x faster initial render
on a long article page. The cost is one rule plus an intrinsic-size hint so the
scrollbar does not jump:

```css
.card {
  content-visibility: auto;
  contain-intrinsic-size: auto 220px; /* ~ one collapsed card; tune once */
}
```

`auto` in `contain-intrinsic-size` makes the browser remember each card's last
rendered height, so the placeholder only matters on first paint. Do **not** apply
this to `.sidebar` or `.controls-bar`: sticky positioning and `content-visibility`
interact badly (containment creates a new containing block), and those are
always on screen anyway. [28] [UNVERIFIED: no measurement was taken on this
site; the 7x figure is web.dev's travel-blog demo, not a local benchmark.]
[UNVERIFIED: "sticky positioning and `content-visibility` interact badly" is
reasoning from the containment definition (`content-visibility: auto` applies
layout/paint/style containment, and a contained element becomes a containing
block for positioned descendants), not a measured bug on this site. Verify in a
browser before applying `content-visibility` to any sticky ancestor.]

### 5.5 The mobile drawer needs four accessibility/robustness fixes

Current implementation: `.sidebar` becomes `position: fixed; transform:
translateX(-100%)` on small screens, `body.drawer-open` slides it in, a scrim
fades in, Escape closes it and returns focus to the opener
(`app/main.js:185-188, 328-352`).

1. **Closed drawer is still focusable.** A transformed element is still in the
   tab order and accessibility tree. `visibility: hidden` at the closed state
   (with a transition on `visibility`) or the `inert` attribute on the sidebar
   removes it from both. `inert` is Baseline _widely available_ (Chrome 102,
   Firefox 112, Safari 15.5) and MDN states it removes the element and its
   descendants "from the tab order and accessibility tree". Toggle
   `sidebar.inert = !open` in `setDrawer`. [30]
2. **`100vh` on mobile.** Both `.app { min-height: 100vh }` and
   `.sidebar { height: 100vh }` clip under a retracting browser toolbar. The
   dynamic viewport unit `100dvh` is Baseline _widely available_ (low
   2022-12-05) and tracks the visible viewport; use it for the drawer height. [39]
3. **Sticky header can cover the focus target.** `.controls-bar` is `position:
sticky; top: 0`, and `html` only has `scroll-padding-top: env(safe-area-inset-top)`.
   WCAG 2.4.11 (Focus Not Obscured, AA) and technique C43 require scroll padding
   so a focused element is not hidden behind sticky content. Set
   `scroll-padding-top: calc(env(safe-area-inset-top, 0px) + <controls-bar height>)`
   — measure once and record it as a token. This also fixes the skip link
   landing under the bar. [32]
4. **Drawer semantics.** It is a non-modal disclosure, not a dialog: the existing
   `aria-expanded` + `aria-controls` on the opener is the APG disclosure pattern,
   and Escape-to-close is the expected keyboard behaviour. Do not add
   `role="dialog"`/`aria-modal` without trapping focus; APG's disclosure pattern
   requires only `button` semantics, `aria-expanded`, and optionally
   `aria-controls`. [45]

One more structural note: `.grid` is defined in `cards.css` but its responsive
override lives in `layout.css`. Even after deleting the dead rule, the split is
a sign that `.grid` is really a layout object. Either move it to `layout.css`
(with the card rules referencing it) or leave it in `cards.css` and keep every
`.grid` rule there. Do not do both.

## Risks and how to avoid them

| Risk                                                | Why it happens                                                                                                                                                                        | Avoidance                                                                                                                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The order rule silently breaks again**            | Equal-specificity ties are decided by link order, and `@media` adds no specificity, so a rule in an earlier file appears correct but loses (this already happened to `.grid`). [5][6] | Keep the fixed order; put each component's responsive rules in the file that defines its base rule; add a one-line comment naming the owner at the top of every file. |
| **Mixed layered/unlayered CSS**                     | Unlayered normal rules beat every layered rule, and `!important` reverses layer order; layer order is fixed at first mention. [3][41]                                                 | Don't add `@layer` to individual files. If adopted, migrate all six files in one commit behind a single `@layer …;` statement.                                        |
| **Invalid selector kills a rule**                   | `::focus-visible` in `base.css:90` is a pseudo-_element_ selector, so the rule is dropped; the same failure applies to any comma list containing one invalid selector. [35][36]       | Use `:focus-visible` (one colon) and check with DevTools that the rule is applied, not struck through.                                                                |
| **Token rename churn**                              | Colour tokens lack the `--color-` prefix the other families use, so a future split cannot be mechanical.                                                                              | Rename on touch, or define prefixed names and alias the old ones for one release.                                                                                     |
| **Token directory sprawl**                          | Splitting per component hides the shared vocabulary and multiplies files.                                                                                                             | Split by family (colour/space/type/effects), never per component; follow USWDS/GOV.UK settings grouping. [17][22]                                                     |
| **Manual theme toggle fights the OS**               | A toggle that always sets `data-theme` overrides the user's system preference and can flash on load. [12][14]                                                                         | Tri-state control with System as default; restore the stored choice in a head script; add `<meta name="color-scheme" content="light dark">`. [13]                     |
| **Drawer traps or leaks focus**                     | A translated off-canvas panel stays focusable and in the a11y tree; `100vh` clips on mobile. [30]                                                                                     | `inert` the closed sidebar; `100dvh`; keep Escape-to-close and return focus to the opener.                                                                            |
| **Focus hidden under sticky chrome**                | Sticky `.controls-bar` and safe-area padding mean scroll-into-view can land behind the bar. [32]                                                                                      | `scroll-padding-top` that includes the bar height; verify with keyboard-only navigation at 400% zoom.                                                                 |
| **Horizontal scroll at 320px**                      | Hard 320px grid minimum inside a 296px content box. [31]                                                                                                                              | `minmax(min(100%, 320px), 1fr)`.                                                                                                                                      |
| **Motion guard only on cards**                      | The reduced-motion rule sits in `cards.css`, but 12 `transition` declarations are spread across the five files that emit CSS. [29]                                                    | One global reduced-motion rule in `base.css`; delete per-component copies.                                                                                            |
| **Container queries used as a blanket replacement** | They require containment, which changes sizing (a container's size cannot depend on its children). [25]                                                                               | Keep the shell on media queries; use named containers only for components reused at different widths.                                                                 |
| **`light-dark()` migration half-done**              | It follows `color-scheme`, not `prefers-color-scheme`; mixing both models produces a theme that ignores the toggle. [12][14]                                                          | Don't migrate now; if you do, make `color-scheme` the single switch and remove duplicated token blocks in the same commit.                                            |
| **Non-expert edits the wrong file**                 | Component classes leak across files (`.copy:hover`, `.empty .ghost`). [21]                                                                                                            | One component per file; prefix or scope generic class names; header comment naming the owner.                                                                         |

## Sources

All read on 2026-10-20.

1. MDN — Learn: Organizing your CSS (multiple sheets, section comments, methodologies, source-control conflicts): https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Organizing
2. MDN — `@import` at-rule (must precede all rules except `@charset`/`@layer`): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@import
3. MDN — `@layer` at-rule (unlayered beats layered; `!important` inversion; order fixed at first declaration): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer
4. MDN — Learn: Cascade layers (relevance to multi-source CSS): https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers
5. MDN — Specificity (`:is()`/nesting semantics; specificity compared only within one origin and layer): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascade/Specificity
6. W3C — CSS Cascading and Inheritance Level 6, §3.1 Cascade Sorting Order (linked sheets concatenated in linking order; later declaration wins): https://drafts.csswg.org/css-cascade-6/
7. W3C — CSS Cascading and Inheritance Level 5 (CR, 2022-01-13), layering: https://www.w3.org/TR/2022/CR-css-cascade-5-20220113/
8. web.dev — Learn Performance: Optimize resource loading (render blocking/FOUC, avoid `@import`, `<link>` concurrency, preload scanner): https://web.dev/learn/performance/optimize-resource-loading
9. MDN — Using media queries (a `<link>` with a non-matching media query still downloads): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Using
10. MDN — Using CSS custom properties (semantic names, `:root` scoping, one-place edits): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties
11. MDN — `@property` at-rule (`syntax`/`inherits`/`initial-value`, invalid values fall back): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@property
12. MDN — `color-scheme` property (UA chrome, form controls, `light-dark()`): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme
13. MDN — `<meta name="color-scheme">` (document-level scheme, prevents flash before CSS): https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/color-scheme
14. MDN — `light-dark()` (requires `color-scheme: light dark`; warning against overriding user preference): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark
15. web.dev — Learn Design: Theming (custom properties inside `prefers-color-scheme`; `color-scheme` for forms): https://web.dev/learn/design/theming
16. web.dev — Building a color scheme (light/dark token sets, surface/text/brand split): https://web.dev/articles/building/a-color-scheme
17. USWDS — Design tokens (limited discrete palettes; tokens consumed via functions/mixins/utilities): https://designsystem.digital.gov/design-tokens/
18. USWDS — Theme color tokens (role-based `base`/`primary`/`secondary`/`accent`, grade suffixes): https://designsystem.digital.gov/design-tokens/color/theme-tokens/
19. USWDS — Spacing units (8px-based numeric scale with named large sizes): https://designsystem.digital.gov/design-tokens/spacing-units/
20. GOV.UK Design System — Colour (functional colour names; "do not copy the specific hexadecimal values"): https://design-system.service.gov.uk/styles/colour/
21. GOV.UK Frontend — CSS and Sass style guide (BEM, `govuk-` namespace, single responsibility, no IDs, variables for colours): https://github.com/alphagov/govuk-frontend/blob/main/docs/contributing/coding-standards/css.md
22. GOV.UK Frontend — `src/` README (ITCSS-like layers; settings emit no CSS; overrides carry `!important`): https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/README.md
23. W3C Design Tokens Community Group — Design Tokens Format Module 2025.10 (Final CG Report; JSON, `$value`, `$type`, groups, aliases; not a W3C Standard): https://www.designtokens.org/TR/2025.10/format/
24. MDN — CSS container queries (viewport vs container; reuse across different placements; naming): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries
25. MDN — `container-type` (inline-size applies style and inline-size containment; size cannot depend on contents): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/container-type
26. MDN — `@container` at-rule (named containers, nearest ancestor matching): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@container
27. web.dev — Container queries land in stable browsers (Chrome 105 / Firefox 110 / Safari 16): https://web.dev/blog/cq-stable
28. MDN — `content-visibility` (skips offscreen rendering; keeps content in the a11y tree): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility
29. MDN — `prefers-reduced-motion` (reduce non-essential motion; vestibular triggers): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
30. MDN — `inert` global attribute (removes subtree from tab order and accessibility tree): https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert
31. W3C WAI — Understanding SC 1.4.10 Reflow (320 CSS px, no two-dimensional scrolling): https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
32. W3C WAI — Understanding SC 2.4.11 Focus Not Obscured (Minimum), including technique C43 `scroll-padding`: https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
33. W3C WAI — Understanding SC 1.4.4 Resize Text (200% text scaling): https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
34. MDN — Using CSS nesting (`&` specificity like `:is()`; compound selectors need `&`): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting/Using
35. MDN — Pseudo-elements (double colon for pseudo-elements; single-colon legacy only for the original four): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Pseudo-elements
36. MDN — `:focus-visible` (pseudo-class; UA heuristics; `:focus` vs `:focus-visible`): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible
37. MDN — `min()` (clamp a size against a fixed and a relative value): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/min
38. MDN — Baseline (compatibility) glossary (widely available = 2.5 years of consistent support): https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility
39. WebDX Community Group — Baseline feature data API (queried for `cascade-layers`, `container-queries`, `light-dark`, `nesting`, `scope`, `content-visibility`, viewport-unit variants): https://api.webstatus.dev/v1/features/
40. WebKit — "New WebKit Features in Safari 15.4" (cascade layers, containment): https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/
41. Chrome for Developers — "Cascade layers are coming to your browser" (Rules 1–5, including unlayered CSS winning and `!important` inversion): https://developer.chrome.com/blog/cascade-layers
42. CUBE CSS — Principles, Block, Utility (simplicity, no formal element syntax, token-generated utilities, 80–100 line blocks): https://cube.fyi/principles.html ; https://cube.fyi/block.html ; https://cube.fyi/utility.html
43. Harry Roberts — "Manage large CSS projects with ITCSS" (layers generic→explicit, low→high specificity, overrides/trumps): https://www.creativebloq.com/web-design/manage-large-css-projects-itcss-101517528 ; https://itcss.io/
44. MDN — `@scope` at-rule (scoped rules, specificity of `&` inside `@scope`): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@scope
45. W3C WAI-ARIA Authoring Practices — Disclosure (Show/Hide) pattern (`aria-expanded`, optional `aria-controls`): https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
46. W3C WAI — Understanding SC 2.4.7 Focus Visible (keyboard-operable interface has a visible focus indicator): https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html

Repo files consulted: `docs/css-organization.md`, `index.html`, `styles/tokens.css`,
`styles/base.css`, `styles/layout.css`, `styles/tree.css`, `styles/controls.css`,
`styles/cards.css`, `app/main.js`, `app/results.js`, `app/tree.js`,
`scripts/build-pages.mjs`, `README.md`, `package.json`.
