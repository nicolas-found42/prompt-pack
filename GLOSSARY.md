# Universal Agent Prompt Deck

The shared vocabulary for the deck: its content model, its UI surfaces, and the
conventions contributors follow. Terms here are the ones this project uses;
implementation details live in code comments and `docs/`, not here.

## Content model

**Deck**:
The whole site — every prompt, the taxonomy that organizes them, and the UI that
browses them. The deck is static: no build step, no runtime dependencies.

**Prompt**:
One ready-to-use agent instruction. A prompt carries an `id`, a `title`, a
one-line `purpose`, the full prompt `text`, a `words` count, and a `pattern`.
_Avoid_: card (the UI element), entry, item.

**Id**:
A prompt's stable address, written as `category.position` (e.g. `1.1`). Ids
are unique across the deck and are referenced by the taxonomy and by Start here
buckets. Ids appear in no URL; views are addressed by taxonomy path instead.

**Category / Subcategory / Group**:
The three levels of the taxonomy, in that order. Every prompt sits in exactly
one group. The taxonomy (`data/taxonomy.js`) is the single source of truth for
where a prompt sits; prompt records never store their own category.
_Avoid_: section, folder, bucket (a Start here bucket is a different thing).

**Pattern**:
The interaction style a prompt is built around — Execute, Audit, Visualize,
Interactive, Parallel agents, Triage, Codify, Reconstruct, Reconcile. Patterns
are the facet chips that filter the grid. `Reconstruct` covers recovering
behavior, structure, or a format from an existing artifact; `Reconcile` covers
proving agreement between two implementations, where the verdict or the
enforced expectation is the deliverable.

**Start here**:
The curated default view: a small set of plain-language buckets shown only when
the view is completely default. A shared link (URL hash) always wins over it.
_Avoid_: featured, recommended, onboarding (there is no tour).

**Scope line**:
The sentence above the results that states whether a search covers the whole
deck or only the selected branch, with a one-click narrow/widen control.

## UI surfaces

**Tree**:
The left-pane taxonomy browser (ARIA tree pattern: roving tabindex, arrow keys).
Each node shows a live count badge.

**Card**:
One prompt in the result grid: id, taxonomy path, pattern, word count, title,
purpose, and the full prompt text behind a disclosure.

**Chip**:
A pattern facet toggle button. Chips combine with the tree selection.

**Crumb**:
One segment of the breadcrumb; clicking it jumps back up the taxonomy.

**View options**:
The disclosure holding rarely-used controls: sort, Expand all, and the
keyboard-shortcut switch.

## Contributor conventions

**Category module**:
One file in `data/prompts/` per category, plus `index.js` joining them. Add a
prompt in your category's file; never renumber another category's ids.

**Check**:
`npm run check` — validates the data (unique ids, taxonomy references resolve,
word counts match), then runs Prettier and ESLint. A prompt is not live until
the check passes.

**Token**:
A CSS custom property defined in `styles/tokens.css`. Components reference
tokens via `var(--…)` and never hard-code colors or spacing.
