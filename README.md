# Universal Agent Prompt Deck

A static prompt deck of **287 agent prompts** plus a deterministic, local Rust/WebAssembly workshop for creating and refining prompts. The site has no AI service or runtime package dependencies.

Live site: <https://nicolas-found42.github.io/prompt-pack/>

## Contents

- **287 prompts** across 13 categories: Coding, Writing, Research, General, Meta, Learning, Communication, Life Admin, Reconstruction, Agency, Evaluation, Security, Operations
- **64 subcategories** and **136 groups** underneath them, so every prompt sits at
  `Category › Subcategory › Group`
- **9 interaction patterns**: Execute, Audit, Visualize, Interactive, Parallel agents, Triage, Codify, Reconstruct, Reconcile
- **Session tags**: Fresh session prompts (cold-start ready) vs In-progress prompts (assumes ongoing workspace/conversation state)
- Each prompt carries a title, a one-line purpose, and the full prompt text

## Using the deck

The deck is two panes: a taxonomy tree on the left and the matching prompts on the right.

| Control          | Behaviour                                                                    |
| ---------------- | ---------------------------------------------------------------------------- |
| Tree (left pane) | Browse Category → Subcategory → Group; each node shows a live count badge    |
| Search box       | Searches all 287 prompts; hits are highlighted and the tree expands to them  |
| Pattern chips    | Toggle one or more interaction patterns; combines with the tree selection    |
| Sort             | Tree order, title A–Z / Z–A, pattern, shortest, longest                      |
| Breadcrumb       | Shows the current path; click a crumb to jump back up, or Copy link to share |
| Expand all       | Opens every prompt body at once; each card also opens on its own             |
| Start here       | Curated first-view buckets; any navigation or a shared link hides it         |
| How to use       | A collapsible three-line intro above the search bar                          |
| View options     | Sort, Expand all and the keyboard-shortcut switch live behind one disclosure |

Keyboard shortcuts (can be switched off in View options):

| Key               | Action                                                                              |
| ----------------- | ----------------------------------------------------------------------------------- |
| `/` or `Ctrl/⌘+K` | Focus the search box (and select its text)                                          |
| `Esc`             | Clear the search; press again to jump back to All prompts; closes the mobile drawer |
| `↑` / `↓`         | Move between tree nodes (when the tree has focus)                                   |
| `→` / `←`         | Expand / collapse a tree node, or move to its first child / parent                  |
| `Enter` / `Space` | Select the focused tree node                                                        |

The search/sort bar stays pinned while you scroll, and a skip link jumps
straight to the prompt grid for keyboard and screen-reader users.

A search always covers the whole deck — the tree selection only scopes the results
when the search box is empty, and the scope line offers a one-click narrow. The
counter shows how many of the 287 prompts match. Matching ignores accents and
letter case, and a multi-word query needs every word somewhere in the prompt.
With no results, a clear panel offers a one-click reset of the search, pattern chips
and tree selection, plus a "did you mean" suggestion when the query is close to a
word the deck uses.

## Prompt Workshop

Open [Prompt Workshop](workshop.html) from the deck header to create a prompt from a request or refine an existing prompt. Choose a task profile and context, review the literal cue analysis, select optional sections, then build and copy the output. The source text stays verbatim and in the browser tab; the Rust engine makes no LLM or Jev calls.

The analyzer uses transparent phrase matching, not semantic judgment. Recommendations are advisory and user-editable. See [operation, limits, and research sources](docs/prompt-workshop.md).

## Development

Prerequisites: Node.js 24 or newer, Rust stable, and the `wasm32-unknown-unknown` target.

```bash
npm install      # install dev tooling
npm run dev      # compile Wasm, stage the site, and serve _site locally
npm run check    # data, tokens, contrast, architecture, formatting, lint, and Rust checks
npm run smoke    # build and run Headless Chrome smoke test against live DOM
npm test         # complete verification gate: check + smoke
npm run format   # prettier --write
npm run lint     # eslint
npm run build    # compile the Rust engine and stage the publishable site in _site/
```

The site uses native ES modules and loads the workshop WebAssembly file from the same origin, so serve the built site over HTTP. `npm run dev` builds and serves `_site/`; do not open either HTML page from `file://`.

## Deployment

`.github/workflows/pages.yml` publishes the deck to GitHub Pages on every push to `main`:

1. `actions/checkout` and `dtolnay/rust-toolchain` provide stable Rust, `rustfmt`, and `wasm32-unknown-unknown`.
2. `actions/setup-node` selects Node 26; `npm ci` installs the Node tooling.
3. `npm run check` runs the repository checks, including Rust formatting and unit tests.
4. `npm run build` compiles the Rust engine and stages `index.html`, `workshop.html`, `app/`, `data/`, `styles/`, the workshop guide, and the Wasm asset in `_site/`.
5. `actions/upload-pages-artifact` and `actions/deploy-pages` publish the result.

Manual redeploy: **Actions → Deploy Pages → Run workflow**. To preview locally, run `npm run build` and serve `_site/`.

The workflow runs on the `ubuntu-26.04` runner image with Node 26 and stable Rust. Node 24 or newer is required locally, since ESLint 10 declares `node >=24`.

## Layout

| Path                             | Purpose                                                               |
| -------------------------------- | --------------------------------------------------------------------- |
| `index.html`                     | Page shell: tree pane, controls, breadcrumb, result grid              |
| `workshop.html`                  | Local prompt create/refine interface                                  |
| `app/workshop.js`                | WebAssembly loading, analysis controls, and safe output/copy handling |
| `styles/workshop.css`            | Token-driven Prompt Workshop layout                                   |
| `generator/src/lib.rs`           | Deterministic Rust analysis, prompt composition, and Wasm ABI         |
| `docs/prompt-workshop.md`        | Operation, limits, build steps, and research basis                    |
| `styles/tokens.css`              | Design tokens: colors, used site-wide; edit this to re-theme          |
| `styles/base.css`                | Universal box model, document and form-control resets                 |
| `styles/layout.css`              | Two-pane shell, sidebar, masthead, mobile drawer                      |
| `styles/tree.css`                | Taxonomy sidebar tree                                                 |
| `styles/controls.css`            | Search, sort, buttons, pattern chips, breadcrumb                      |
| `styles/cards.css`               | Result grid, prompt cards, search highlighting                        |
| `app/main.js`                    | Bootstrap: wires the tree, facets, search, grid and URL together      |
| `app/state.js`                   | The single mutable view state                                         |
| `app/catalog.js`                 | Joins prompts and taxonomy into the lookup structures the UI uses     |
| `app/tree.js`                    | ARIA tree rendering and keyboard navigation                           |
| `app/results.js`                 | Card grid rendering, including the "did you mean" empty state         |
| `app/facets.js`                  | Interaction-pattern chips                                             |
| `app/featured.js`                | The Start here bucket grid for the default view                       |
| `app/search.js`                  | Forgiving query matching (accents, multi-token) and highlighting      |
| `app/url.js`                     | View state ⇄ URL hash, so any view can be linked                      |
| `data/prompts/`                  | One module per category plus `index.js` joining them (287 records)    |
| `data/taxonomy.js`               | The Category → Subcategory → Group hierarchy                          |
| `data/featured.js`               | The Start here bucket definitions                                     |
| `AGENTS.md`                      | Permanent repository instructions and engineering standards           |
| `scripts/check-data.mjs`         | Validates ids, taxonomy references, word counts; part of `check`      |
| `scripts/check-tokens.mjs`       | Validates CSS variable existence and theme symmetry                   |
| `scripts/check-contrast.mjs`     | Computes WCAG 2.2 SC 1.4.3 & SC 1.4.11 contrast for both themes       |
| `scripts/check-architecture.mjs` | Verifies zero raw hexes in CSS, pure renderers, link integrity        |
| `scripts/smoke-test.mjs`         | Headless browser smoke suite exercising built artifact on live DOM    |
| `scripts/build-pages.mjs`        | Stages the publishable site into `_site/`                             |
| `.github/workflows/pages.yml`    | Checks-gated GitHub Pages deployment                                  |
| `.vscode/`                       | Editor and task wiring for format, lint, and Live Server              |

The deck is plain HTML/CSS/JS. The Workshop uses a dependency-free Rust crate compiled to same-origin WebAssembly at build time; it makes no model calls at runtime. `npm run build` compiles the engine and stages the Pages artifact; Node devDependencies cover formatting and linting only.

## License

MIT — see [LICENSE](LICENSE).
