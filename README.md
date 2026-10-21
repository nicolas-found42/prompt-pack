# Universal Agent Prompt Deck

A static, dependency-free deck of **187 agent prompts** — one card per prompt, organised as a browsable hierarchy and searchable in the browser.

Live site: <https://nicolas-found42.github.io/prompt-pack/>

## Contents

- **187 prompts** across 10 categories: Coding, Writing, Research, General, Meta, Learning, Communication, Life Admin, Reconstruction, Agency
- **51 subcategories** and **114 groups** underneath them, so every prompt sits at
  `Category › Subcategory › Group`
- **9 interaction patterns**: Execute, Audit, Visualize, Interactive, Parallel agents, Triage, Codify, Reconstruct, Reconcile
- Each prompt carries a title, a one-line purpose, and the full prompt text

## Using the deck

The deck is two panes: a taxonomy tree on the left and the matching prompts on the right.

| Control          | Behaviour                                                                    |
| ---------------- | ---------------------------------------------------------------------------- |
| Tree (left pane) | Browse Category → Subcategory → Group; each node shows a live count badge    |
| Search box       | Searches all 187 prompts; hits are highlighted and the tree expands to them  |
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
counter shows how many of the 187 prompts match. Matching ignores accents and
letter case, and a multi-word query needs every word somewhere in the prompt.
With no results, a clear panel offers a one-click reset of the search, pattern chips
and tree selection, plus a "did you mean" suggestion when the query is close to a
word the deck uses.

## Development

```bash
npm install      # install dev tooling
npm run dev      # serve the deck locally
npm run check    # data validation + prettier --check + eslint
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

| Path                          | Purpose                                                            |
| ----------------------------- | ------------------------------------------------------------------ |
| `index.html`                  | Page shell: tree pane, controls, breadcrumb, result grid           |
| `styles/tokens.css`           | Design tokens: colors, used site-wide; edit this to re-theme       |
| `styles/base.css`             | Universal box model, document and form-control resets              |
| `styles/layout.css`           | Two-pane shell, sidebar, masthead, mobile drawer                   |
| `styles/tree.css`             | Taxonomy sidebar tree                                              |
| `styles/controls.css`         | Search, sort, buttons, pattern chips, breadcrumb                   |
| `styles/cards.css`            | Result grid, prompt cards, search highlighting                     |
| `app/main.js`                 | Bootstrap: wires the tree, facets, search, grid and URL together   |
| `app/state.js`                | The single mutable view state                                      |
| `app/catalog.js`              | Joins prompts and taxonomy into the lookup structures the UI uses  |
| `app/tree.js`                 | ARIA tree rendering and keyboard navigation                        |
| `app/results.js`              | Card grid rendering, including the "did you mean" empty state      |
| `app/facets.js`               | Interaction-pattern chips                                          |
| `app/featured.js`             | The Start here bucket grid for the default view                    |
| `app/search.js`               | Forgiving query matching (accents, multi-token) and highlighting   |
| `app/url.js`                  | View state ⇄ URL hash, so any view can be linked                   |
| `data/prompts/`               | One module per category plus `index.js` joining them (187 records) |
| `data/taxonomy.js`            | The Category → Subcategory → Group hierarchy                       |
| `data/featured.js`            | The Start here bucket definitions                                  |
| `scripts/check-data.mjs`      | Validates ids, taxonomy references, word counts; part of `check`   |
| `scripts/build-pages.mjs`     | Stages the publishable site into `_site/`                          |
| `.github/workflows/pages.yml` | Checks-gated GitHub Pages deployment                               |
| `.vscode/`                    | Editor and task wiring for format, lint, and Live Server           |

The deck is plain HTML/CSS/JS — the browser loads it with no build step and no runtime dependencies. `npm run build` exists only to stage the Pages artifact. `devDependencies` cover formatting and linting only.

## License

MIT — see [LICENSE](LICENSE).
