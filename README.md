# Universal Agent Prompt Deck

A static, dependency-free deck of **107 agent prompts** — one card per prompt, organised as a browsable hierarchy and searchable in the browser.

Live site: <https://nicolas-found42.github.io/prompt-pack/>

## Contents

- **107 prompts** across 5 categories: Coding, Writing, Research, General, Meta
- **26 subcategories** and **58 groups** underneath them, so every prompt sits at
  `Category › Subcategory › Group`
- **7 interaction patterns**: Execute, Audit, Visualize, Interactive, Parallel agents, Triage, Codify
- Each prompt carries a title, a one-line purpose, and the full prompt text

## Using the deck

The deck is two panes: a taxonomy tree on the left and the matching prompts on the right.

| Control          | Behaviour                                                                    |
| ---------------- | ---------------------------------------------------------------------------- |
| Tree (left pane) | Browse Category → Subcategory → Group; each node shows a live count badge    |
| Search box       | Searches all 107 prompts; hits are highlighted and the tree expands to them  |
| Pattern chips    | Toggle one or more interaction patterns; combines with the tree selection    |
| Sort             | Tree order, title A–Z / Z–A, pattern, shortest, longest                      |
| Breadcrumb       | Shows the current path; click a crumb to jump back up, or Copy link to share |
| Expand all       | Opens every prompt body at once; each card also opens on its own             |

A search always covers the whole deck — the tree selection only scopes the results
when the search box is empty. The counter shows how many of the 107 prompts match.

## Development

```bash
npm install      # install dev tooling
npm run dev      # serve the deck locally
npm run check    # prettier --check + eslint
npm run format   # prettier --write
npm run lint     # eslint
npm run build    # stage the publishable site into _site/
```

The deck uses native ES modules, so it must be served over HTTP — `npm run dev`
(or any static server) rather than opening `index.html` from the filesystem.

## Deployment

`.github/workflows/pages.yml` publishes the deck to GitHub Pages on every push to `main`:

1. `npm ci` installs the dev tooling.
2. `npm run check` runs Prettier and ESLint — the deploy is blocked if either fails.
3. `npm run build` stages only the site assets (`index.html`, `styles/`, `app/`, `data/`) into `_site/`, so `node_modules` and tooling never reach the artifact.
4. `actions/upload-pages-artifact` and `actions/deploy-pages` publish the result.

Manual redeploy: **Actions → Deploy Pages → Run workflow**. To preview locally, run `npm run build` and serve `_site/`.

The workflow runs on the `ubuntu-26.04` runner image with Node 26. Node 24 or newer is required locally, since ESLint 10 declares `node >=24`.

## Layout

| Path                          | Purpose                                                           |
| ----------------------------- | ----------------------------------------------------------------- |
| `index.html`                  | Page shell: tree pane, controls, breadcrumb, result grid          |
| `styles/tokens.css`           | Design tokens: colors, used site-wide; edit this to re-theme      |
| `styles/base.css`             | Universal box model, document and form-control resets             |
| `styles/layout.css`           | Two-pane shell, sidebar, masthead, mobile drawer                  |
| `styles/tree.css`             | Taxonomy sidebar tree                                             |
| `styles/controls.css`         | Search, sort, buttons, pattern chips, breadcrumb                  |
| `styles/cards.css`            | Result grid, prompt cards, search highlighting                    |
| `app/main.js`                 | Bootstrap: wires the tree, facets, search, grid and URL together  |
| `app/state.js`                | The single mutable view state                                     |
| `app/catalog.js`              | Joins prompts and taxonomy into the lookup structures the UI uses |
| `app/tree.js`                 | ARIA tree rendering and keyboard navigation                       |
| `app/results.js`              | Card grid rendering                                               |
| `app/facets.js`               | Interaction-pattern chips                                         |
| `app/search.js`               | Query matching and hit highlighting                               |
| `app/url.js`                  | View state ⇄ URL hash, so any view can be linked                  |
| `data/prompts.js`             | The 107 prompt records                                            |
| `data/taxonomy.js`            | The Category → Subcategory → Group hierarchy                      |
| `scripts/build-pages.mjs`     | Stages the publishable site into `_site/`                         |
| `.github/workflows/pages.yml` | Checks-gated GitHub Pages deployment                              |
| `.vscode/`                    | Editor and task wiring for format, lint, and Live Server          |

The deck is plain HTML/CSS/JS — the browser loads it with no build step and no runtime dependencies. `npm run build` exists only to stage the Pages artifact. `devDependencies` cover formatting and linting only.

## License

MIT — see [LICENSE](LICENSE).
