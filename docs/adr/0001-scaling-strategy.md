# Scaling strategy: per-category data modules, no build step, bounded DOM

The deck grows in two directions at once: more prompts and more contributors.
We decided how the site absorbs both without adding a build step or a runtime
dependency.

## Decisions

1. **Split the prompt corpus into one ES module per category**
   (`data/prompts/<category>.js` plus a hand-written `index.js` barrel),
   preloaded with
   `<link rel="modulepreload">`. Measured cost: +18.4% gzipped at 157 records.
   The trade is bytes for edit isolation — two contributors adding prompts in
   different categories never touch the same file, and appends at the end of one
   big file always conflict in git.
2. **Keep authored JS modules, not JSON and not codegen.** JSON fetched at
   runtime adds a loading state; codegen would commit generated files that
   break `npm run dev` (which serves the repo root) and drift from source.
   Authored modules need zero build-script changes because `data/` is already
   copied recursively.
3. **Keep the dependency-free substring matcher.** Measured: 0.05 ms per query
   at 157 records, 2 ms at 100,000. Search libraries (lunr, Pagefind) cost more
   bytes than the whole page and add a build step or WASM engine. The real
   scaling limit is the rendered DOM, not matching.
4. **Bound the DOM, not the match.** `.card` gets `content-visibility: auto` +
   `contain-intrinsic-size` (11.2× less forced layout at 3,000 cards, measured).
   Pagination at ~100 rendered cards is the decided trigger when the deck
   approaches 300+ prompts — not built yet.
5. **Validate, don't generate.** `scripts/check-data.mjs` (part of
   `npm run check`) fails on duplicate ids, dangling taxonomy references,
   orphan records, and word counts that drift from the text. It is the
   contributor-safety net; it writes nothing.
6. **Keep positional ids (`1.1`) for now.** Ids appear in no URL, so they could
   become stable slugs for free — but the taxonomy and every Start here bucket
   reference them, and renumbering is a content decision, not a code one.
   Revisit when ids would start appearing in shareable links.

## Considered options

- **One data file**: rejected — append conflicts between contributors.
- **JSON + build-time codegen**: rejected — committed generated files, breaks
  `npm run dev`, prettier churn.
- **lunr.js / Pagefind index**: rejected — index bigger than the page, plus a
  runtime engine or build step; matching is not the bottleneck.
- **Bundler (Vite/esbuild)**: rejected — the repo's contract is no build step,
  and the site is ~35 KB gzipped total.

## Consequences

- New categories require a new module plus one import line in
  `data/prompts/index.js` and one `modulepreload` link in `index.html`.
- `npm run check` now fails on bad data, so CI blocks broken deploys before
  Pages publishes.
- The +18.4% gzip cost is accepted and measured; revisit if the deck grows
  past ~500 records (the `meta`/`text` payload split becomes worth it around
  there, per `docs/scaling-content-architecture.md`).

Evidence and measurements: `docs/scaling-content-architecture.md`.
