# Repository Instructions for Agents

Universal Agent Prompt Deck (`prompt-pack`): static, dependency-free HTML/CSS/JS deck of 237 agent prompts with native ES modules, token-driven theming, and an ARIA-compliant taxonomy tree.

## Operating in this repository

### Verification before done

Never yield without real smoke verification. Run the automated check suite:

```bash
npm test        # runs check:data, check:tokens, check:contrast, check:arch, format:check, lint, and smoke-test
```

A pass requires all six checks green and the headless browser smoke test confirming live DOM rendering without console errors. Tests alone without exercising the runtime path are not proof.

### Lifecycle protocol

1. **Never edit `main` directly.** Always work on a descriptive topic branch (`feat/...`, `fix/...`, `docs/...`).
2. **Run full checks locally before pushing:** `npm run check` must be completely clean.
3. **Open a Pull Request with structured evidence:**
   - **Summary**: Concise bullet points of what changed and why.
   - **Evidence**: Explicit "Before" vs "After" metrics, command outputs, or computed styles.
   - **Merge Danger**: Door type (one-way vs two-way) and blast radius assessment.
4. **Address automated and peer reviews:** Check Greptile review comments before merging. Fix all valid issues directly on the branch; never dismiss a valid defect.
5. **Clean up**: Delete merged topic branches and stale worktrees once merged into `main`.

---

## Core Engineering Invariants

### 1. Error handling conventions

- **Fail closed on data validation**: Ingestion and validation scripts (`scripts/check-data.mjs`, `scripts/check-tokens.mjs`, `scripts/check-contrast.mjs`, `scripts/check-architecture.mjs`) must validate 100% of corpus records. Never default to empty arrays or silently swallow discrepancies. Exit non-zero and print the exact file, record ID, or line number for every violation.
- **Fail-safe, defensive browser runtime operations**: Asynchronous browser APIs (e.g. `navigator.clipboard.writeText`) can fail or be denied by user-agent permissions. Never produce unhandled promise rejections. Implement a working fallback (`document.execCommand`), return boolean success flags, and announce the outcome to the user through live regions (`announce()`) or visible feedback (e.g., "Copy blocked").
- **Never mask or hide failures**: Never append `; echo OK`, `|| true`, or ignore exit codes in scripts, shell commands, or CI workflows. Embedded shell pipelines operate under `pipefail`.
- **Preserve state and telemetry on failure paths**: If a background process, run, or search operation fails or times out, preserve the error reason, elapsed duration, and diagnostics. Never clear or report zero for work that occurred.
- **Account for the side-effect crash gap**: Any external side effect (network action, disk mutation) must be reconciled with durable state records so retries cannot produce duplicate operations or orphaned records.

### 2. State ownership rules

- **Single mutable state**: `app/state.js` owns the canonical view state (`state`). No UI component, tree element, or DOM node may maintain its own independent shadow state.
- **Pure renderers**: Rendering functions (`app/results.js`, `app/facets.js`, `app/featured.js`, `app/tree.js`) are pure renderers. They receive read-only data arguments and write to the provided DOM root. They must **never** import `state.js`, mutate state directly, or call URL/history APIs.
- **Centralized mutation functions**: State transitions happen only through exported mutation functions (`selectPath`, `togglePattern`, `clearPatterns`) or explicit property updates in `app/main.js` followed by a single top-level `render()`.
- **Read from State, write to DOM**: Never read state back out of the DOM to make application decisions.
- **Bi-directional URL synchronization**:
  - `app/url.js` serializes state to hash and parses hash to state.
  - Deep links strictly override default views: any URL hash (path, pattern, query) hides the default "Start here" section.
  - User-driven navigation (selecting a tree node, clicking a crumb, clicking a facet chip) uses `history.pushState`.
  - Filter typing, sort changes, and search scopes use `history.replaceState`.
- **Single source of truth for prompt data**: Prompt records are authored in per-category modules (`data/prompts/<category>.js`) and re-exported through `data/prompts/index.js`. `app/catalog.js` indexes this corpus into lookup maps once at boot. Do not invent ad-hoc secondary indices.

### 3. Naming boundaries and token contracts

- **Token contract preservation**: Custom properties in `styles/tokens.css` are a public API contract across all stylesheets. **Never** delete or rename a custom property without checking every consumer across `styles/`, `app/`, and `index.html`.
- **Theme symmetry**: Every color custom property defined in `:root` (light theme) must have an explicit override defined in `@media (prefers-color-scheme: dark)` (dark theme), and vice versa. Missing overrides cause dark mode contrast failures and theme leakage.
- **Semantic tokens over literal values**: Component stylesheets (`cards.css`, `layout.css`, `tree.css`, `controls.css`, `base.css`) must **never** contain hardcoded hex colors (`#...`). All visual colors must use `var(--token)`.
- **File responsibility boundaries**:
  - `styles/tokens.css`: Custom properties and theme overrides only.
  - `styles/base.css`: Global resets, box-sizing, typography standards, accessibility skip link, reduced-motion overrides.
  - `styles/layout.css`: Shell grid (`.app`), sidebar, masthead, main container, drawer scrim.
  - `styles/tree.css`: Taxonomy tree, guide lines, selection highlights, pill count badges.
  - `styles/controls.css`: Search input, sort dropdown, chips, buttons, breadcrumbs.
  - `styles/cards.css`: Result cards, disclosure details/summary, copy button, Start-here buckets.
  - `app/`: Single-responsibility modules (state machine, catalog indexing, search engine, URL synchronization, component renderers).
- **Identifier taxonomy**:
  - Prompt IDs: strictly formatted as `<category_index>.<prompt_number>` (e.g. `1.1`, `9.15`, `10.5`).
  - Categories and interaction patterns: must match the canonical vocabulary defined in `GLOSSARY.md` and `data/taxonomy.js`.

### 4. Test assertions and automated verification

- **WCAG 2.2 Mathematical Verification**:
  - **SC 1.4.3 (Contrast Minimum - Level AA)**: Text color pairs must achieve a contrast ratio of $\ge 4.5:1$ against their backgrounds (`--ink`, `--muted`, `--link` against `--bg` and `--surface`).
  - **SC 1.4.11 (Non-text Contrast - Level AA)**: Visual UI boundaries and focus indicators must achieve a contrast ratio of $\ge 3.0:1$ against their backgrounds (`--line` against `--bg` and `--surface`).
  - Both contrast standards are mathematically enforced by `npm run check:contrast` across both Light and Dark themes.
- **Responsive reflow boundary (WCAG 1.4.10)**:
  - Layout and card containers must reflow down to 320px viewport width without horizontal scroll (`minmax(min(100%, 320px), 1fr)`).
  - `scrollbar-gutter: stable` must remain on `html` to prevent layout reflow when scrollbars toggle.
- **Reduced-motion invariant (WCAG 2.2)**:
  - All transitions and animations must be disabled under `@media (prefers-reduced-motion: reduce)` in `styles/base.css`.
  - Do not falsely document that instant transforms or visual states are removed by reduced-motion rules when only animations/transitions are disabled.
- **Corpus integrity invariants**:
  - 100% of prompts referenced in taxonomy; 0 orphan records; 0 dangling taxonomy IDs.
  - Stored `words` count must exactly equal whitespace-derived word count of `text`.
  - Prompt IDs must be unique, non-empty, and contiguous within their category.
- **Headless browser smoke verification**:
  - Must serve the built `_site/` directory over HTTP (native ES modules require HTTP, not `file://`).
  - Headless Chrome verifies full DOM rendering ("Showing 237 of 237", interactive tree, zero console errors).

---

## Command Reference

| Command                  | Purpose                                                                      | When to run                   |
| ------------------------ | ---------------------------------------------------------------------------- | ----------------------------- |
| `npm run check:data`     | Validates prompt data integrity, taxonomy mapping, and word counts           | After editing `data/`         |
| `npm run check:tokens`   | Validates CSS variable existence and light/dark theme symmetry               | After editing CSS or tokens   |
| `npm run check:contrast` | Computes WCAG 2.2 SC 1.4.3 and SC 1.4.11 contrast ratios for both themes     | After changing color tokens   |
| `npm run check:arch`     | Verifies zero raw hexes in component CSS, pure renderers, and link integrity | After modifying components    |
| `npm run format:check`   | Verifies Prettier code style across all files                                | Before committing             |
| `npm run format`         | Automatically formats all files with Prettier                                | On code style issues          |
| `npm run lint`           | Runs ESLint across JS and MJS modules                                        | Before committing             |
| `npm run check`          | Runs all 4 check scripts + format check + lint                               | Required gate on every PR     |
| `npm run smoke`          | Builds `_site/` and runs Headless Chrome smoke test on live DOM              | Before PR merge               |
| `npm test`               | Complete gate: runs `check` followed by `smoke`                              | Before finishing any task     |
| `npm run build`          | Stages site files into `_site/`                                              | Before preview or deploy      |
| `npm run dev`            | Serves the root over local HTTP via `serve`                                  | For local browser exploration |
