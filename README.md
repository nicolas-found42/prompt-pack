# Universal Agent Prompt Deck

A static, dependency-free deck of **107 agent prompts** — one card per prompt, searchable and sortable in the browser.

Live site: <https://nicolas-found42.github.io/prompt-pack/>

## Contents

- **107 prompts** across 5 categories: Coding, Writing, Research, General, Meta
- **7 interaction patterns**: Execute, Audit, Visualize, Interactive, Parallel agents, Triage, Codify
- Each prompt carries a title, a one-line purpose, and the full prompt text

## Using the deck

| Control          | Behaviour                                                         |
| ---------------- | ----------------------------------------------------------------- |
| Search box       | Matches titles, purposes, and prompt text; highlights hits        |
| Category         | Filter by one of the 5 categories                                 |
| Pattern          | Filter by one of the 7 interaction patterns                       |
| Sort             | Deck order, title A–Z / Z–A, category, pattern, shortest, longest |
| Hide prompt text | Collapse the prompt bodies to scan titles and purposes only       |
| Copy             | Copies one prompt's text to the clipboard                         |

Filters and search combine; the counter shows how many of the 107 prompts match.

## Development

```bash
npm install      # install dev tooling
npm run dev      # serve the deck locally
npm run check    # prettier --check + eslint
npm run format   # prettier --write
npm run lint     # eslint
npm run build    # stage the publishable site into _site/
```

## Deployment

`.github/workflows/pages.yml` publishes the deck to GitHub Pages on every push to `main`:

1. `npm ci` installs the dev tooling.
2. `npm run check` runs Prettier and ESLint — the deploy is blocked if either fails.
3. `npm run build` stages only the site assets (`index.html`, `styles.css`, `app.js`) into `_site/`, so `node_modules` and tooling never reach the artifact.
4. `actions/upload-pages-artifact` and `actions/deploy-pages` publish the result.

Manual redeploy: **Actions → Deploy Pages → Run workflow**. To preview locally, run `npm run build` and serve `_site/`.

## Layout

| Path                          | Purpose                                                           |
| ----------------------------- | ----------------------------------------------------------------- |
| `index.html`                  | Page shell and control markup                                     |
| `styles.css`                  | All styling, including the collapsed-prompt state                 |
| `app.js`                      | The `ROWS` prompt dataset plus filtering, sorting, and copy logic |
| `scripts/build-pages.mjs`     | Stages the publishable site into `_site/`                         |
| `.github/workflows/pages.yml` | Checks-gated GitHub Pages deployment                              |
| `.vscode/`                    | Editor and task wiring for format, lint, and Live Server          |

The deck is plain HTML/CSS/JS — the browser loads it with no build step and no runtime dependencies. `npm run build` exists only to stage the Pages artifact. `devDependencies` cover formatting and linting only.

## License

MIT — see [LICENSE](LICENSE).
