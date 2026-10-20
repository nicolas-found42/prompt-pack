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
```

## Layout

| Path         | Purpose                                                           |
| ------------ | ----------------------------------------------------------------- |
| `index.html` | Page shell and control markup                                     |
| `styles.css` | All styling, including the collapsed-prompt state                 |
| `app.js`     | The `ROWS` prompt dataset plus filtering, sorting, and copy logic |
| `.vscode/`   | Editor and task wiring for format, lint, and Live Server          |

The deck is plain HTML/CSS/JS — no build step and no runtime dependencies. `devDependencies` cover formatting and linting only.

## License

MIT — see [LICENSE](LICENSE).
