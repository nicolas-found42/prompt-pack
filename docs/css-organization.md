# Splitting one CSS file into several on a no-build static site

> Location note: this repo has no existing notes/docs convention, so this file
> lives in a new `docs/` directory. Read on 2026-10-20.

## Recommendation

For this site (one `index.html`, one 505-line `styles.css`, a `scripts/build-pages.mjs`
that only copies files into `_site/`, and a README that promises no bundler and no
build step), the best split is **multiple `<link rel="stylesheet">` tags in
`index.html`, one per responsibility, loaded in dependency order** — not `@import`,
and not a bundler. Concretely: `tokens.css` (custom properties, including the dark-theme
overrides), then `base.css` (reset + element styles), then `layout.css`, then one file
per component area (`tree.css`, `controls.css`, `cards.css`, …). Primary sources agree:
web.dev explicitly says to avoid `@import` and to use `<link>` elements, which browsers
download concurrently; the CSS cascade spec confirms that stylesheets linked later are
treated as if concatenated in linking order, so equal-specificity conflicts resolve to
the later file. Put all visual decisions (colors, spacing, radii) into custom properties
in `tokens.css` so that changing the site's appearance means editing one file. Skip
`@layer` for now: its one gotcha — unlayered styles beat layered styles — is a trap for
a hand-rolled multi-file setup.

## Q1 — `<link>` per file vs `@import` vs bundler

| Approach                               | What primary sources say                                                                                                                                                                                                                                                                                                                                                                                                   | Verdict for this site                                                                             |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Multiple `<link rel="stylesheet">`     | web.dev: "Avoid CSS `@import` declarations… `link` elements allow style sheets to be downloaded concurrently and reduces overall load time. In most cases, you can replace the `@import` by using a `link` element." CSS is render-blocking either way (web.dev Learn: Performance).                                                                                                                                       | **Recommended.** Files are discovered by the HTML preload scanner in parallel.                    |
| `@import` in CSS                       | MDN: an `@import` rule "must be defined at the top of the stylesheet, before any other at-rule (except `@charset` and `@layer`) and style declarations, or it will be ignored." web.dev: `@import` creates a request chain — the browser must download the first CSS file before it can even discover the imported one; imported sheets are late-discovered render-blocking resources that the preload scanner cannot see. | Avoid. Serializes requests and adds a hard ordering constraint.                                   |
| Build-time bundler (PostCSS/Vite/Sass) | MDN (Organizing your CSS): preprocessors let you split into many files and compile to one; "when a CSS preprocessor encounters `@import` declarations, the referenced files are bundled… avoiding the consecutive request penalty." Sass Guidelines: splitting files in development and compiling to a single stylesheet is "perfectly safe (and actually recommended)" — but it requires a build step.                    | Ruled out by the repo constraint (no build step, no bundler). The build script only copies files. |

**Cascade/ordering rules that apply.** CSS Cascading and Inheritance Level 6,
§2.1 "Cascade Sorting Order" lists the criteria in precedence order: origin & importance
→ context → style attribute → **layers** → **specificity** → scope proximity →
**order of appearance**. For "order of appearance" the spec says: "Declarations from
style sheets independently linked by the originating document are treated as if they
were concatenated in linking order, as determined by the host document language." So
when two rules have equal specificity, equal layer, and same origin, **the rule in the
later-linked file wins**. MDN's "Organizing your CSS" says the same in prose: "You can
link to multiple stylesheets from one page, and the normal rules of the cascade apply,
with rules in stylesheets linked later coming after rules in stylesheets linked
earlier."

**Performance characteristics.**

- All CSS is render-blocking: the browser will not paint until the CSSOM is built
  (web.dev, "Optimize resource loading" and "Defer non-critical CSS"; this is what
  prevents FOUC).
- Each `<link>` is a separate HTTP request, but they are fetched concurrently; each
  `@import` is discovered only after its parent file loads (a request chain).
- Keeping every file in `<head>` as a plain `rel="stylesheet"` link is the simplest
  correct pattern; the file sizes here (a few KB each) make request count a non-issue
  over HTTP/2. [UNVERIFIED: no measured benchmark was run for this site; the
  concurrency claim is from web.dev's description of browser behavior, not a local
  measurement.]

## Q2 — `@layer` (CSS Cascading and Inheritance Level 5)

What the spec/MDN say it does:

- `@layer` creates a **cascade layer**: a sub-origin priority bucket. Within the author
  origin, normal declarations are ordered first-layer-created → last-layer-created →
  **unlayered styles last** (css-cascade-5 §6.4; MDN `@layer` reference).
- A statement form fixes the order up front: `@layer reset, base, layout, components;`
  — later layers win over earlier ones **regardless of specificity** (MDN `@layer`).
- It is mainly aimed at mixing styles from many sources (frameworks, third parties,
  teams) without specificity wars (MDN Learn: "Cascade layers").

Gotchas, all confirmed by MDN/spec:

- **Unlayered styles beat layered styles** (normal declarations). Any rule you forget to
  put in a layer silently outranks everything layered — the classic surprise.
- `!important` **inverts** layer order: important declarations in the _first_ layer
  beat later layers and unlayered important styles.
- Layer order is set by **first declaration**; appending rules to an existing layer does
  not change its position.

Is it useful for organising styles across multiple files here? Marginally. `@layer`
really pays off when styles come from independent sources you don't control. In a
hand-authored, single-owner multi-file setup, the `<link>` order already gives you a
deterministic cascade, and layers add a second, subtler ordering mechanism to keep in
your head. If adopted, the safe pattern is: declare the order once in the first file
(`@layer reset, base, layout, components;` — allowed before any other rule) and wrap
every file's rules in its layer. Note the current `styles.css` already uses `:root`,
`@media (prefers-color-scheme: dark)`, and a `[data-theme="dark"]` override without any
layers; introducing layers now would demote all existing unlayered rules unless they are
all wrapped.

## Q3 — Design tokens / CSS custom properties

- **Why tokens:** MDN ("Using CSS custom properties"): custom properties let "a value
  [be] defined in one place, then referenced in multiple other places"; without them,
  "changing a color that's been duplicated in many places requires a search and replace
  across all rules and CSS files." web.dev ("Custom properties"): they "allow you to
  organize and reuse values in your CSS, so that your styles are more flexible and
  easier to understand."
- **Where to scope them:** MDN: "a common practice is to define custom properties on
  the `:root` pseudo-class, so that it can be referenced globally"; web.dev notes the
  same `:root` pattern. Custom properties inherit and participate in the cascade, so a
  more specific selector can override them for a subtree (MDN; css-variables-1).
- **Theming:** web.dev ("Theming") shows exactly this site's technique: define
  `--page-color`/`--ink-color` on `html`, override them inside
  `@media (prefers-color-scheme: dark)`, and never duplicate per-component rules.
  MDN (`color-scheme`) adds `color-scheme: light dark` on `:root` so form controls,
  scrollbars, and the canvas follow the theme, and mentions `light-dark()` as a compact
  alternative. The site already does this (`:root` tokens + `prefers-color-scheme` +
  `[data-theme="dark"]` overrides in `styles.css` lines 1–32).
- **Why a separate tokens file makes appearance changes easier:** all color/spacing/
  radius decisions live in one file; components only reference `var(--…)`; a rebrand or
  a new theme is a one-file edit (MDN; web.dev Theming; USWDS "Design tokens": tokens
  are "a limited set of discrete options… from which we base all our visual design").
- **Naming conventions:** MDN/web.dev don't prescribe a naming scheme. The DTCG Design
  Tokens Format Module (W3C Community Group report) defines token names as
  dot-separated groups (`color.text.primary`) but that's a JSON interchange format, not
  a CSS naming rule — in CSS you'd write `--color-text-primary`. Design-system docs
  converge on **semantic, purpose-based names**: USWDS uses token keys like
  `primary-vivid`, `body`, `card-lg` consumed via functions/mixins; the Open Components
  token-path convention names CSS custom properties `--{group}--{name}` (e.g.
  `--color--primary`) precisely so names are unambiguous and tool-checkable, and argues
  for semantic names ("`--color--primary` still makes sense after a rebrand and in
  dark mode, while `--color--indigo-600` doesn't"). The site's current names
  (`--bg`, `--ink`, `--muted`, `--line`, `--soft`, `--link`) are already semantic.
  Recommendation: keep semantic names, optionally grouped as `--color-*`, `--space-*`,
  `--radius-*` if the token count grows. [UNVERIFIED: there is no single
  standards-body naming convention for CSS custom properties; the above are
  first-party design-system/docs conventions, not a spec requirement.]
- Optional hardening: `@property` can register a token with a type, initial value, and
  inheritance flag (MDN "Registering custom properties"), but it is not needed for a
  site this size.

## Q4 — File organisation and naming conventions

What primary/first-party sources use:

- **MDN ("Organizing your CSS")**: break large stylesheets into smaller ones, one
  global sheet plus smaller sheets per section; order sections "general styles →
  utilities → sitewide → specific components", and keep section comments (`/* || … */`)
  so you can jump between them.
- **Sass Guidelines (Hugo Giraudel), "The 7-1 pattern"**: 7 folders + one entry file —
  `abstracts/` (variables/mixins, no CSS output), `vendors/`, `base/` (reset,
  typography), `layout/` (header/footer/sidebar/grid), `components/` (widgets),
  `pages/`, `themes/` — imported in exactly that order. It's a preprocessor pattern; the
  _order_ (abstracts → base → layout → components → pages → themes) is the transferable
  part, and the author notes Sass avoids glob imports because "CSS is known to be
  order-dependant", i.e. explicit order is deliberate.
- **ITCSS (Harry Roberts, itcss.io / Creative Bloq article)**: "Inverted Triangle CSS",
  layers ordered generic→explicit, low→high specificity, far-reaching→localised:
  Settings → Tools → Generic (reset) → Elements/Base → Objects → Components → Trumps.
  "Not using a preprocessor? Remove the Settings and Tools layers." That last sentence
  is directly applicable here.
- **CUBE CSS (cube.fyi)**: Composition → Utility → Block → Exception; tool-agnostic and
  explicitly designed to work without a build step, but it's a class-naming/layout
  philosophy more than a file split.
- **GOV.UK Frontend** (`packages/govuk-frontend/src/README.md`): a layered structure
  "loosely following the conventions of ITCSS": Settings, Tools, Helpers, Core, Objects,
  Components, Utilities, Overrides. **USWDS** organizes by packages (`uswds-core` holds
  "all the functions, mixins, placeholders, tokens, and fonts"; one package per
  component). Both are Sass-based, so their folder trees need a compiler; the shared
  idea is: tokens/settings first, reset/base next, layout, then components, overrides
  last.

Common thread: **tokens → reset/base → layout → components → (themes/overrides)**, in
that load order. That order is not aesthetic; it mirrors the cascade (later, more
specific rules win ties), so overrides land where they can win.

## Q5 — Practical guidance for this site

Constraints from the repo: no bundler/build step for the site (`npm run build` only
copies `index.html`, `styles.css`, `app/`, `data/` into `_site/` via
`scripts/build-pages.mjs` — note `SITE_FILES` is a hard-coded list, so new CSS files
must be added there or copied via a new directory), served on GitHub Pages (HTTP/2),
dev tooling is Prettier/ESLint only.

Recommended split, mapped from the existing `styles.css` sections (which are already
comment-delimited: `:root` tokens, base, Layout, Tree, Controls, Facets, Breadcrumb,
Cards, Drawer):

```
styles/
  tokens.css     ← :root custom properties + prefers-color-scheme/[data-theme] overrides
  base.css       ← universal box-sizing, html, body, form-control resets
  layout.css     ← .app grid, .sidebar, .main, .masthead, .scrim
  tree.css       ← taxonomy tree styles
  controls.css   ← search input, sort select, buttons, facets, breadcrumbs
  cards.css      ← .grid, prompt cards, drawer (small screens)
```

Load order in `index.html` `<head>` (each a plain `<link rel="stylesheet">`):

```html
<link rel="stylesheet" href="styles/tokens.css" />
<link rel="stylesheet" href="styles/base.css" />
<link rel="stylesheet" href="styles/layout.css" />
<link rel="stylesheet" href="styles/tree.css" />
<link rel="stylesheet" href="styles/controls.css" />
<link rel="stylesheet" href="styles/cards.css" />
```

Rules of thumb:

1. **Order is the API.** Later files win equal-specificity ties (css-cascade-6 §2.1).
   Keep tokens → base → layout → components; never reorder without checking overrides.
2. **Change appearance via tokens.** Edit `tokens.css` only; components reference
   `var(--…)` and never hard-code colors (MDN custom properties guide).
3. **Don't introduce `@layer` casually** — unlayered rules would silently outrank any
   layered rule you add later (MDN `@layer`).
4. **Don't use `@import`** — serial request chain + must precede all other rules
   (web.dev; MDN `@import`).
5. **Keep every stylesheet render-blocking in `<head>`** — that's what prevents FOUC
   (web.dev); don't move non-critical CSS to `media="print"` tricks or async-loading
   patterns for a ~9 KB total payload.
6. Update `scripts/build-pages.mjs` so the new files reach `_site/` (add a
   `styles/` directory entry to `SITE_DIRS`, or list the files in `SITE_FILES`).

## Risks and how to avoid them

| Risk                                   | Why it happens                                                                                                                                                                                 | Avoidance                                                                                                                                                                             |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FOUC** (flash of unstyled content)   | CSS is render-blocking by design to prevent this; loading CSS asynchronously or at the end of `<body>` reintroduces the flash (web.dev "Optimize resource loading", "Defer non-critical CSS"). | Keep all `<link rel="stylesheet">` in `<head>`; don't use preload+onload swap or bottom-of-body links.                                                                                |
| **Ordering mistakes**                  | With multiple files, the cascade tie-break is link order; a wrong order silently changes which rule wins (css-cascade-6 §2.1; MDN "Organizing your CSS").                                      | Fix the order once (tokens → base → layout → components), comment it in `index.html`, and never insert a file in the middle without reviewing overrides.                              |
| **Specificity surprises across files** | Equal specificity → later file wins; higher specificity in an earlier file still wins its ties (css-cascade-6 §2.1).                                                                           | Keep selectors uniformly low-specificity (single class), so file order — not specificity — decides conflicts; MDN recommends avoiding overly-specific selectors.                      |
| **`@import` placed after rules**       | An `@import` not at the very top of a stylesheet is invalid and ignored (MDN `@import`; css-cascade-5 §2).                                                                                     | Don't use `@import` at all; use `<link>` tags.                                                                                                                                        |
| **Layer trap**                         | Unlayered normal styles beat all layered styles; `!important` inverts layer order (MDN `@layer`; css-cascade-5 §6.4).                                                                          | If layers are ever adopted, declare `@layer …;` order in the first file and wrap every rule; otherwise don't mix layered and unlayered CSS.                                           |
| **Theme flash / wrong theme**          | Token overrides depend on `prefers-color-scheme` and `[data-theme]`; a missing `color-scheme` leaves form controls/scrollbars in the wrong scheme (MDN `color-scheme`; web.dev "Theming").     | Keep the existing `:root` token block + dark overrides together in `tokens.css`, keep `color-scheme: light dark` behavior, and don't split the dark override from the light defaults. |
| **Build misses new files**             | `scripts/build-pages.mjs` copies a hard-coded `SITE_FILES` list and `SITE_DIRS` dirs; a new CSS file outside them never reaches `_site/`.                                                      | Add the new files/dir to the build script in the same change; run `npm run build` and check `_site/`.                                                                                 |
| **Too many requests**                  | Each `<link>` is one request.                                                                                                                                                                  | Irrelevant at this size (6 small files, HTTP/2 on GitHub Pages, all render-blocking and parallel). Revisit only if the file count grows large. [UNVERIFIED: not benchmarked locally.] |
| **Prettier/ESLint gate**               | CI runs `npm run check` (prettier --check + eslint) and blocks deploy on failure.                                                                                                              | Run `npm run format` on the new CSS files before committing.                                                                                                                          |

## Sources

All read on 2026-10-20.

1. MDN — `@import` CSS at-rule: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@import
2. MDN — `@layer` CSS at-rule: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40layer
3. MDN — Learn: Cascade layers: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers
4. MDN — Learn: Organizing your CSS: https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Organizing
5. MDN — Using CSS custom properties (variables): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties
6. MDN — Custom properties (`--*`): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/--*
7. MDN — `var()` function: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/var
8. MDN — Registering custom properties (`@property`): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Properties_and_values_API/Registering_properties
9. MDN — `color-scheme` property: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/color-scheme
10. W3C — CSS Cascading and Inheritance Level 5 (CR): https://www.w3.org/TR/css-cascade-5/ (§2 `@import`, §6.4 Cascade Layers)
11. W3C — CSS Cascading and Inheritance Level 6 (WD, §2.1 Cascade Sorting Order): https://www.w3.org/TR/css-cascade-6/
12. web.dev — Optimize resource loading (render-blocking CSS, avoid `@import`, preload scanner): https://web.dev/articles/optimize-resource-loading (also https://web.dev/learn/performance/optimize-resource-loading)
13. web.dev — Defer non-critical CSS: https://web.dev/articles/defer-non-critical-css
14. web.dev — Custom properties: https://web.dev/learn/css/custom-properties
15. web.dev — Theming: https://web.dev/learn/design/theming
16. Sass Guidelines (Hugo Giraudel) — Architecture / 7-1 pattern: https://github.com/KittyGiraudel/sass-guidelines/blob/main/pages/en/_architecture.md (published at https://sass-guidelin.es/#architecture)
17. Harry Roberts — "Manage large CSS projects with ITCSS" (Creative Bloq, first-party methodology description): https://www.creativebloq.com/web-design/manage-large-css-projects-itcss-101517528 ; ITCSS site: https://itcss.io/
18. CUBE CSS (Andy Bell, first-party): https://cube.fyi/ and https://bell.bz/cube-css/
19. GOV.UK Frontend — `src/` structure README (ITCSS-like layers): https://github.com/alphagov/govuk-frontend/blob/main/packages/govuk-frontend/src/README.md ; CSS/Sass style guide: https://github.com/alphagov/govuk-frontend/blob/main/docs/contributing/coding-standards/css.md
20. USWDS — Design tokens: https://designsystem.digital.gov/design-tokens/ ; Packages: https://designsystem.digital.gov/components/packages/
21. W3C Design Tokens Community Group — Design Tokens Format Module: https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/
22. Open Components — Design tokens naming (token paths): https://opencomponents.dev/docs/foundations/design-tokens

Repo files consulted: `README.md`, `index.html`, `styles.css` (505 lines),
`scripts/build-pages.mjs`, `package.json`.
