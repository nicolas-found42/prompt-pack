# Scaling the data layer of a no-build static deck

> Location note: `docs/` already holds `css-organization.md`, which set the
> convention this file follows (location note, recommendation, per-question
> sections, risks table, numbered sources). Read and measured on 2026-10-20
> against the repo state at the time: the prompt corpus (`data/prompts/`) = 157
> records / 117,899 bytes and `data/taxonomy.js` = 24,677 bytes.

## Recommendation

Keep the no-build, no-runtime-dependency contract, and change the **shape of the
data**, not the toolchain. Concretely:

1. **Split the prompt corpus into one ES module per category**
   (`data/prompts/coding.js` … `data/prompts/writing.js`), each exporting a
   flat array, plus a hand-written `data/prompts/index.js` that statically
   imports the thirteen and concatenates. Add `<link rel="modulepreload">` for the
   data modules in `index.html`. Splitting is for **edit isolation and
   discoverability**; it costs bytes, and that cost must be acknowledged, not
   waved away (measured: **+18.4% gzipped bytes** at the measured 157-record size
   — see Q1).
2. **Split each category module into `meta` and `text` exports** only when the
   eager payload crosses a stated budget. Today the entire deck is 35 KB gzipped;
   metadata alone is 12 KB and prompt bodies 25 KB (37 KB separately — two files
   compress ~5% worse than one). At 157 records, shipping everything eagerly is
   correct. Budget the cutover at **~100 KB gzipped of full records**, which this
   dataset reaches at roughly **450–500 records** at its measured ~215 bytes
   gzipped per record (Q4).
3. **Do not add a bundler, and do not add a runtime search library.** The
   substring matcher is not the scaling limit — it costs 0.05 ms/query at 157
   records and 2 ms/query at 100,000 (measured). The limits are **rendered DOM**
   and **transfer size** (Q3, Q4).
4. **Add a validation-only script** (`scripts/check-data.mjs`) and run it in
   `npm run check`: unique ids, one taxonomy reference per record, no orphan
   records, no dangling references, required fields present, stored `words`
   equal to the derived count. Today all six checks pass, so the script is cheap
   to adopt and it is the thing that actually breaks when contributors grow (Q5).
   Do **not** add a codegen step that emits the content itself: at this size it
   buys nothing and creates generated files that must be committed, prettier-
   ignored, and kept in sync with `npm run dev` (Q2).
5. **Bound what is rendered, not what is matched.** Render a page of ~60 cards
   behind a "Show more" control, and add `content-visibility: auto` +
   `contain-intrinsic-size: auto 270px` to `.card` (270 px is the _content-box_
   height; padding and border add 34 px, giving a 304 px card - see Q4).
   Measured medians: forced layout at 3,000 matching records 138.3 ms → 12.4 ms
   (**11.2×**); at 10,000 467.5 ms → 50.4 ms (**9.3×**). Capping the rendered count at 100 additionally
   took a 10,000-record keystroke from 273.6 ms to 8.8 ms (Q4).
6. **Make records addressable by a stable slug, not by deck position.** Record
   ids like `1.1` encode a position that a contributor must renumber to insert a
   record. Ids are not in any URL today (`app/url.js` encodes only taxonomy path,
   `q`, `pat`, `sort`), so the change is free now and expensive later — the same
   argument W3C makes for URIs generally [34].

The rest of this note gives the primary-source evidence and the local
measurements behind each point.

---

## Q1 — One data module vs one module per category

### What the primary sources say

- **Native modules are the intended mechanism for splitting JS** [1]. MDN notes
  browsers "can optimize loading of modules" and that modules do not obsolete
  bundlers, which still contribute "partitioning code into reasonably sized
  chunks … minification, dead code elimination, and tree-shaking" [1].
- **Module scripts are deferred by default**; the `defer` attribute has no effect
  on them, and they execute after parsing [2][3]. So a module-based data layer
  never blocks the HTML parser — it does delay first paint of the grid, because
  `app/main.js` cannot render before its data dependencies resolve.
- **HTTP/2 makes request count a weak constraint.** HTTP/2 exists to allow
  "multiple request and response messages to be in flight at the same time" on
  one connection [4], and the HTTP/2 FAQ states that concatenation, spriting and
  domain sharding are workarounds for HTTP/1.1 limits [5]. MDN's HTTP/2 entry
  gives the same summary: the protocol's goals are "to reduce latency and
  head-of-line blocking, by enabling full request and response multiplexing" [36].
  RFC 9113 recommends `SETTINGS_MAX_CONCURRENT_STREAMS` be "no smaller than 100,
  so as to not unnecessarily limit parallelism" [4].
- **Module graphs are still a waterfall.** web.dev is explicit: "When module
  trees are unbundled, each module represents a separate HTTP request" and
  recommends `<link rel="modulepreload">` to flatten discovery [7][6]. Later
  waves are late-discovered by definition: the browser's preload scanner cannot
  see modules pulled in by another module's `import` [35]. MDN
  describes `modulepreload` as fetching, parsing and compiling into the module
  map so the module is ready to execute, and warns you "can't just preload
  everything" [6].
- **V8's guidance on size**: if a bundle "exceeds ~50–100 kB, split it up into
  separate smaller bundles," and notes that "with HTTP/2 multiplexing, multiple
  request and response messages can be in flight at the same time, reducing the
  overhead of additional requests" [8].

### What this repo actually costs today

The page is already an unbundled module graph: `app/main.js` statically imports
seven app modules, and `app/catalog.js` statically imports both data modules
(13 static `import` statements total). Measured in Chromium 156 against a local
server, the request graph is three waves:

| Wave                                                                           | Requests | Starts at | Ends at |
| ------------------------------------------------------------------------------ | -------- | --------- | ------- |
| CSS (6 files) + `app/main.js`                                                  | 7        | 4 ms      | 8 ms    |
| app modules (`catalog`, `state`, `url`, `tree`, `search`, `results`, `facets`) | 7        | 14 ms     | 17 ms   |
| Prompt + taxonomy modules (2 files then)                                       | 2        | 19 ms     | 20 ms   |

`DOMContentLoaded` 20–21 ms, `load` 31–32 ms. Adding `<link rel="modulepreload">`
for the app and data modules collapses waves 2–3 into wave 1 (data now starts at
4 ms instead of 19 ms) but produced **no measurable end-to-end change locally**
(load 31–32 ms either way) because localhost latency is ~0. The benefit is
one saved round trip per collapsed wave on a real network — each wave is a full
RTT before the next discovery — which is what web.dev's modulepreload article
describes [6]. [UNVERIFIED locally: no throttled-network measurement was run.]

### The split's real cost is compression, and it is measurable

gzip works on redundancy across the whole file, so 8 files compress worse than
one. Measured with `zlib.gzipSync` at default level on the current 157 records,
with the record array serialized the same way in both layouts (`JSON.stringify`,
file comments and formatting excluded):

| Layout                                 | Raw bytes | Gzipped             |
| -------------------------------------- | --------- | ------------------- |
| All 157 records as one module payload  | 111,051   | **35,415**          |
| 8 per-category module payloads, summed | 111,181   | **41,922** (+18.4%) |

So a straight per-category split costs ~6.5 KB gzipped on a cold load — about
7–13% of the 50–100 kB threshold at which V8 says to split a bundle [8], and
about 5× the largest current CSS file (1.1 KB gzipped). It buys two things that
matter more as the deck grows:

- **Edit isolation.** Two contributors adding prompts to Coding and Writing touch
  different files. Measured with real `git merge`: edits to records far apart in
  one file merge cleanly, but two edits to the _same_ record always conflict, and
  two appends at the same `];` anchor always conflict (Q5).
- **Discoverability.** "Which file holds the Writing prompts?" has a one-word
  answer. In a 1,576-line file, `grep` is the only answer.

Per-category modules also let the _text_ half be deferred per category later
without touching the record shape, either with dynamic `import()`, which loads a
module only when needed [10], or by resolving the module URL against the barrel's
own location with `import.meta.url` [11] (Q2/Q4).

### Verdict

Split by category, keep the aggregate as a hand-written 8-line `index.js`, and
add `modulepreload` links. Do not split by group (88 files at today's taxonomy):
per-file gzip overhead and request fan-out stop paying for themselves, and the
group structure already lives in `taxonomy.js`, so group-level files would put
prompt text in 88 places without isolating any edit that per-category files
don't already isolate.

---

## Q2 — JS module exports vs runtime JSON vs JSON + build-time codegen

| Approach                                                           | Primary-source position                                                                                                                                                                                                                         | Fit for this repo                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **JS module exports** (today)                                      | Native modules are the standard mechanism [1]; module scripts are deferred [2][3].                                                                                                                                                              | **Recommended.** Zero build, MIME type already correct on GitHub Pages (`application/javascript`), and the data is editable by a non-expert (it is the same object syntax everywhere).                                                                                                                           |
| **Runtime-fetched JSON** (`fetch("data/prompts.json")`)            | `fetch()` is promise-based and returns a `Response` whose `json()` parses the body [33].                                                                                                                                                        | Viable, but strictly worse here: it adds an async state machine to every consumer, moves a JSON syntax error from "file does not parse at all" to "empty grid at runtime", and gains nothing over an import that is already deferred.                                                                            |
| **JSON module** (`import x from "./p.json" with { type: "json" }`) | Import attributes validate the served MIME type and fail the import if it is not `application/json` [9]. MDN marks it **Baseline 2025: newly available**, i.e. supported by the latest version of each engine but not yet widely available [9]. | Works on GitHub Pages (`pages.github.com/versions.json` is served `application/json; charset=utf-8`, measured). Rejected for now only because it adds a second syntax (JSON has no comments and no trailing commas) for contributors, and because a typo becomes a module-load failure rather than a lint error. |
| **JSON source + codegen to JS**                                    | V8 recommends `JSON.parse('…')` over a large object literal for data ≥10 kB, citing 1.7× faster parse/compile/execute [8].                                                                                                                      | **Not recommended as a content pipeline.** See below.                                                                                                                                                                                                                                                            |

### What a codegen step would actually cost

The current build script copies only:

```js
const SITE_FILES = ["index.html"];
const SITE_DIRS = ["app", "data", "styles", "assets", "images", "fonts"];
```

`data/` is copied recursively, so **a data split needs no build-script change at
all**. That is a genuine finding, not an assumption: any new file under `data/`
reaches `_site/` automatically. A _top-level_ new directory (say `search-index/`)
would be silently dropped, which is the only build-script trap.

Adding codegen would require, concretely:

1. A new `scripts/build-data.mjs` invoked **before** `cpSync` in
   `scripts/build-pages.mjs`.
2. Deciding whether generated output is committed. It must be, or
   `npm run dev` (`npx --yes serve .`, which serves the repo root) serves a site
   with no data. Committed generated files then need a "do not edit" header, a
   `.prettierignore` entry, and an ESLint ignore, or they fight CI.
3. Measured: `JSON.stringify` output **fails** `prettier --check` on this repo's
   config, and reformatting inflates a 111,203-byte module to **117,642 bytes
   (+5.8%)**. So either the generator runs prettier (build-time cost) or the file
   is excluded from the format gate (inconsistency).
4. Measured: the V8 JSON-vs-literal advantage **does not reproduce** in Node 24
   at this size — cold import of a 3,000-record module took 9.31 ms as a literal
   vs 8.82 ms as `JSON.parse`, and 0.80 ms vs 0.64 ms at 157 records. The 10 kB
   rule of thumb [8] is a browser cold-start effect and is not visible in this
   workload. [UNVERIFIED in-browser: no isolated parse benchmark was run in
   Chromium.]

**Verdict:** keep authored JS modules. The transform that _is_ worth having is
**validation**, not generation (Q5). A validator has no output artifact, so it
adds no stale-file risk and no dev/build divergence. If a derived artifact is
ever needed (a search index, a manifest of counts), generate _that_ into a
gitignored directory and add the directory to `SITE_DIRS` — derived, not
authored, content is the right thing to generate.

---

## Q3 — When in-memory search stops being fine

### Current implementation

`app/search.js` builds one lowercase haystack per record at module load
(`title + purpose + text + taxonomy path`) and answers `matchesQuery` with
`String.prototype.includes`. There is no debounce: every `input` event runs
match + render synchronously (`app/main.js`).

### Measured: matching is not the bottleneck

Chromium 156, synthetic scaling by repeating the 157 real records (each copy
gets a unique id), lowercase haystack built once, one query over all records:

| Records | Chromium: match per query (8-query average) | Node 24: match per query |
| ------- | ------------------------------------------- | ------------------------ |
| 157     | 0.05 ms                                     | 0.03 ms                  |
| 1,000   | 0.24 ms                                     | 0.17 ms                  |
| 3,000   | 0.58 ms                                     | 0.42 ms                  |
| 10,000  | 1.46 ms                                     | 1.41 ms                  |
| 50,000  | —                                           | 1.30 ms                  |
| 100,000 | —                                           | 2.08 ms                  |

Both runtimes agree on the shape: substring scanning costs microseconds per
thousand records. A full scan of 100,000 records is ~2 ms. For comparison, a
web.dev "long task" is anything over **50 ms** [17], and a good INP is **≤200 ms**
at p75 [18]. Matching has more than an order of magnitude of headroom left at any
dataset size this deck could plausibly reach; it will not be the thing that
breaks.

### Measured: **render** is the bottleneck, immediately

Match + render for one keystroke, no debounce, in the real grid:

| Records | Query `"a"` (all match)          | Query `"audit"` | Query `"au"`, capped at 100 rendered |
| ------- | -------------------------------- | --------------- | ------------------------------------ |
| 157     | 29.6 ms                          | 2.7 ms          | —                                    |
| 1,000   | 121.3 ms                         | 15.8 ms         | 14.4 ms                              |
| 3,000   | 379.0 ms                         | 40.9 ms         | 7.3 ms                               |
| 10,000  | 273.6 ms (`"au"`, 4,269 matches) | 123.6 ms        | **8.8 ms** (`"au"`)                  |

Two conclusions follow. First, at **157 records the current site is fine** —
worst case 30 ms, inside the 50 ms long-task budget [17]. Second, the failure is
triggered by **result count**, not dataset size: a one-character query at 1,000
records takes 121 ms because it renders 1,000 cards, and one at 3,000 takes 379 ms.
Capping rendered results at 100 at 10,000 records takes the same interaction from
273.6 ms to **8.8 ms**. That is a 31× improvement from bounding the DOM, with no
index at all.

(These are single-run lab figures on the bench harness, not medians; the render
table above uses 5-run medians. Treat them as order-of-magnitude, which is all
that is needed to see the scaling shape.)

### What the alternative index libraries cost (measured, not estimated)

**lunr 2.3.9** (single-file build, 29,510 bytes raw / 8,422 bytes gzipped),
`title`+`purpose`+`text` fields, default pipeline:

| Records | Index build | Serialized index | Gzipped      | Query   |
| ------- | ----------- | ---------------- | ------------ | ------- |
| 157     | 21 ms       | 315 KB           | **70 KB**    | 0.05 ms |
| 1,000   | 90 ms       | 1,554 KB         | **394 KB**   | 0.30 ms |
| 3,000   | 269 ms      | 4,631 KB         | **1,257 KB** | 0.65 ms |
| 10,000  | 830 ms      | 15,384 KB        | **4,320 KB** | 2.45 ms |

Lunr's own docs recommend pre-building and shipping a serialized index precisely
because in-browser building "can lead a browser to block" [25]. At 157 records
that index is **about 1.6× the entire current page payload** (70 KB vs 36 KB of
data + 8 KB of app JS, both gzipped), to replace a 0.05 ms scan. It only starts to make sense if ranked
relevance or stemming is a product requirement.

**Pagefind** (WASM, indexes built HTML after a build) is the other credible
option. Its chunking design is genuinely good: "searching for the word
'CloudCannon' doesn't need to load the region of the index containing the word
'Jamstack'" [23], and the API loads result data lazily per result [22]. Measured
on a 1,000-record synthetic corpus built with `addCustomRecord`:

| Component                                                                                       | Size                                                                               |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Engine JS actually used (`pagefind-component-ui.js`, `pagefind.js`, worker, highlight, modular) | 321 KB raw / **77 KB gzipped**                                                     |
| WASM (`wasm.en.pagefind` + `wasm.unknown.pagefind`)                                             | 138 KB on disk, already gzip-compressed (Pagefind handles compression itself [21]) |
| Meta index (`.pf_meta`)                                                                         | 6 KB gzipped at 1,000 records                                                      |
| Index chunks (13 `.pf_index` files)                                                             | 74 KB gzipped in total; one query loads a subset                                   |
| Per-result fragments                                                                            | ~493 bytes gzipped per record                                                      |

(Excluded from the JS figure is the legacy `pagefind-ui.js` at 117 KB raw, which
Pagefind's docs now describe as superseded by the component UI [21].)

So the realistic query-time payload at 1,000 records is ~80 KB gzipped of index
plus the engine, versus 218 KB gzipped for the whole dataset shipped eagerly, and
0.24 ms of matching. GitHub Pages' 100 GB/month soft bandwidth limit [27] is not
the constraint here either; the constraint is what a low-end device must parse
before it can show a card. Pagefind is the right answer for a **10,000-page HTML site**;
this is a 157–3,000-record JSON deck with an existing interactive filter. Adopting
it would also add a build step, a WASM dependency, a `worker-src` CSP requirement,
and a `/pagefind/` directory that must be added to `SITE_DIRS` [21][22][23].

### Verdict

Keep the dependency-free matcher. Spend the effort on (a) rendering fewer cards,
(b) keeping the searchable payload bounded, and (c) if "did you mean" tolerance is
wanted, add it to the matcher — e.g. token-prefix matching so `observ` matches
`observability`. A hand-rolled token postings index measured **26 KB gzipped at
157 records and 137 KB at 1,000** with 79 ms build time for 10,000 records — that
is the honest middle path if ranking is ever required, and it is still smaller
than lunr at every size measured.

---

## Q4 — Rendering a long result list without a framework

### The DOM budget is already exceeded at 157 records

Lighthouse warns above **~800** body nodes and fails above **~1,400** [15].
Measured on the live page (headless Chromium dump of the real app): **2,985 body
elements** — 735 in the tree (137 `treeitem`s) and 2,199 in the grid (157 cards ×
14 elements). The card markup is the dominant term, and it scales linearly:

| Cards rendered | Grid elements | Forced layout | With `content-visibility` | Layout reduction |
| -------------- | ------------- | ------------- | ------------------------- | ---------------- |
| 157            | 2,198         | 7.1 ms        | 0.6 ms                    | 11.8×            |
| 1,000          | 14,000        | 45.8 ms       | 3.7 ms                    | 12.4×            |
| 3,000          | 42,000        | 138.3 ms      | 12.4 ms                   | **11.2×**        |
| 10,000         | 140,000       | 467.5 ms      | 50.4 ms                   | **9.3×**         |

(Medians of 5 runs; `.card { content-visibility: auto; contain-intrinsic-size:
auto 270px }`. `contain-intrinsic-size` supplies a **content-box** size, so the
estimate excludes padding and border: measured `auto 320px` produced cards of
354 px against a natural 305 px, a +16% total-height error, while `auto 270px`
produced 304 px against 305 px (-0.3%; 319,984 px vs 321,408 px total at 3,000
cards). `box-sizing: border-box` on `.card` [37] does not change that. The `auto`
keyword lets the browser replace the estimate with the real size after first
render [12][13][14], so the initial estimate only has to be close.)

The DOM cost is not cosmetic: web.dev documents that large DOMs make style
recalculation and layout expensive per interaction, which is exactly what an
input handler triggers [16][15].

### Options, with primary-source positions

| Technique                              | Primary-source position                                                                                                                                                                                                                   | Fit                                                                                                                                                                                                                  |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`content-visibility: auto`**         | Skips rendering work for off-screen content; off-screen content stays in the DOM **and in the accessibility tree**, so find-in-page and tab order still work [12][13][14]. Requires `contain-intrinsic-size` or scrollbars jump [12][13]. | **Recommended first step.** One CSS rule, no JS, 9–12× measured layout reduction, no change to the counter or to `Ctrl+F`.                                                                                           |
| **Pagination / "Show more"**           | Bounds the number of nodes created, which is the only thing that reduces _node count_; `content-visibility` does not [15][16].                                                                                                            | **Recommended second step.** Cap at ~60–100 cards; measured 31× latency win at 10,000 records. Caveat: paginated-away results are invisible to find-in-page, unlike `content-visibility`.                            |
| **`IntersectionObserver` lazy append** | Designed for "lazy-loading … and implementing 'infinite scrolling'", callback runs on the main thread and should be short [19].                                                                                                           | Works, but adds a scroll listener and unbounded DOM growth. web.dev notes infinite loading "still ends up populating the DOM with thousands of row entries" and recommends windowing instead [20].                   |
| **True windowing (virtual list)**      | Only render the visible slice, recycling nodes as the window moves [20].                                                                                                                                                                  | Correct at 100k rows, disproportionate here: it needs fixed/measured item heights, and this grid is responsive (`repeat(auto-fill, minmax(320px, 1fr))`), so column count changes item geometry at every breakpoint. |
| **Web Worker for matching**            | Workers run off the main thread and can message results back [31]; `requestIdleCallback()` exists for low-priority main-thread work [32].                                                                                                 | Unnecessary: matching is ≤2 ms at 100k records. Moving 2 ms off-thread while leaving a 300 ms render on-thread solves nothing.                                                                                       |

### The payload budget

Measured gzipped size of the dataset as records grow (repeating real records, so
these are optimistic — real new prompts are more diverse and compress worse):

| Records | Full records | Metadata only | Bodies only | Meta + bodies       |
| ------- | ------------ | ------------- | ----------- | ------------------- |
| 157     | 35.4 KB      | 12.0 KB       | 25.1 KB     | **37.0 KB** (+4.6%) |
| 1,000   | 218 KB       | 68 KB         | —           | —                   |
| 3,000   | 653 KB       | 202 KB        | —           | —                   |

Growth is linear at ~215 bytes gzipped per record. A **100 KB gzipped eager budget**
is crossed at roughly **450–500 records**. That, not a record count chosen for
aesthetics, is the trigger for splitting metadata from bodies: ship metadata
(12 KB at 157, 68 KB at 1,000) eagerly, and load a category's bodies on first
expansion of a card. [UNVERIFIED: the 100 KB figure is a chosen policy, not a
published standard; it is ~3× today's payload and well under the 218 KB that
1,000 eager records would cost.]

Note the ordering trap this creates: search today covers prompt **bodies**. If
bodies become lazy, a query can no longer match unloaded text. Keep the full text
in the search haystack (it is the cheapest part to keep: the searchable haystack
is 95 KB raw / 31 KB gzipped at 157 records — _smaller_ than the records
themselves, because it drops keys and titles-as-strings) or precompute a token
postings index keyed by id.

### Verdict

1. `content-visibility: auto` + `contain-intrinsic-size: auto 270px` on `.card`
   (content box; the rendered card is 304 px).
2. Render at most 60–100 cards per page with an explicit "Show more (N remaining)"
   control; keep the header counter reporting **total matches**, so it never lies.
3. Defer bodies per category only when the eager payload passes the budget.

---

## Q5 — Git conflicts with many contributors

### Measured conflict behavior

Real `git merge` runs on copies of this repo's data files (Git 2.5x, `ort`
strategy):

| Change A                                       | Change B                                          | Result                     |
| ---------------------------------------------- | ------------------------------------------------- | -------------------------- |
| Title of record #1                             | Title of record #157 (same file)                  | **Auto-merged**            |
| Insert field in record `1.1`                   | Insert field in record `1.2` (same record block)  | **CONFLICT**               |
| Insert record at `];` anchor                   | Insert a different record at the same `];` anchor | **CONFLICT**               |
| Add id to group A's `ids: [...]`               | Add id to group B's `ids: [...]` (same file)      | **Auto-merged**            |
| Add id to the _same_ group's `ids: [...]` line | Add a different id to that same line              | **CONFLICT**               |
| Edit `data/coding.js`                          | Edit `data/writing.js` (split layout)             | **Auto-merged**, trivially |

This matches GitHub's description of when conflicts occur: "when people make
different changes to the same line of the same file" [28]. Git's line-based
three-way merge is doing exactly what it promises; the problem is file layout,
not Git.

Two consequences:

- **The append-at-the-end pattern is the worst case.** Every "add a prompt"
  contribution edits the last line of `prompts.js`. Two such PRs opened the same
  day always conflict, regardless of how unrelated the prompts are.
- **The `ids: [...]` arrays in `taxonomy.js` are the second-worst case**, because
  ids for one group are one line. Splitting the _file_ by category does not help
  here — the taxonomy stays single-file by design (it is the source of truth for
  navigation). The mitigation is formatting: one id per line makes most additions
  merge cleanly, at the cost of ~157 extra lines. That is a fair trade at 157
  records and a clearly good one at 1,000.

### Mitigations, and the one to avoid

| Mitigation                                | Evidence                                                                                                                                                                                                                                                                      | Verdict                                                                                                                                                       |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Per-category data files**               | Measured above: different files never conflict on content.                                                                                                                                                                                                                    | **Adopt.** Also gives reviewers a scoped diff.                                                                                                                |
| **One record per block, one id per line** | Same-line edits conflict [28]; different-line edits do not.                                                                                                                                                                                                                   | **Adopt.** Cheap, reversible, no tooling.                                                                                                                     |
| **`CODEOWNERS` per data directory**       | GitHub auto-requests review from owners of changed paths, and "Require review from Code Owners" can gate merges [30].                                                                                                                                                         | **Adopt** once there is more than one maintainer; it routes data PRs to whoever knows the taxonomy.                                                           |
| **CI validation of the merged result**    | A clean textual merge can still be semantically wrong (duplicate id, orphan record, stale `words`).                                                                                                                                                                           | **Adopt.** This is the only mitigation that catches _semantic_ conflicts, which Git cannot see.                                                               |
| **`.gitattributes` `merge=union`**        | Git's own docs: union takes "lines from both versions, instead of leaving conflict markers. This tends to leave the added lines in the resulting file in random order and the user should verify the result. Do not use this if you do not understand the implications" [29]. | **Reject.** On a JS array, union can produce duplicate ids, a missing comma, or a trailing-comma syntax error — silently, in a file that then fails to parse. |
| **JSON instead of JS**                    | JSON cannot have comments or trailing commas, so a bad union merge fails loudly rather than subtly.                                                                                                                                                                           | Neutral: the loud failure is good, the contributor ergonomics are worse (Q2). Validation achieves the same loudness without the format change.                |

### What the validator should assert

All six checks pass on the current data (measured), so this is a regression guard,
not a cleanup:

1. every prompt id is unique (157/157 unique today);
2. every taxonomy reference resolves to a record (157 refs, 0 dangling);
3. every record is referenced exactly once (0 orphans);
4. no duplicate id inside a group (0 today);
5. required fields present and correctly typed (`order`, `id`, `title`,
   `purpose`, `text`, `words`, `pattern`; 0 violations today);
6. stored `words` equals the derived word count of `text` (0 mismatches today).

It should also fail the build if a new top-level site directory is added without
being listed in `SITE_DIRS`, because that failure is otherwise silent (the
directory simply never reaches `_site/`).

---

## Q6 — Recommended change order

Each step is independently useful and independently revertible.

1. **Validator first** (`scripts/check-data.mjs`, no output files; wire into
   `npm run check`). Cheapest step, catches the failures growth introduces.
2. **Stable record ids** (`outcome-over-feature` rather than `1.1`) and derive
   the masthead count (`index.html` hard-codes "157 prompts"; `README.md` repeats
   it five times). Replace both with a rendered count so the data is the only
   source of truth.
3. **`content-visibility: auto` + `contain-intrinsic-size: auto 270px` on
   `.card`** and a rendered-card cap with "Show more". Measured 11× layout
   reduction at 3,000 cards and 31× interaction-latency reduction at 10,000.
4. **Split the prompt corpus into `data/prompts/<category>.js`** with a
   hand-written barrel; add `modulepreload` links. Re-run the validator; the
   per-category record counts must still sum to the deck count.
5. **Split `meta`/`text` per category** only when the eager payload passes the
   budget (~450–500 records at current growth). Keep text in the search haystack
   or precompute a postings index.
6. **`CODEOWNERS`** for `data/**` when a second maintainer appears.

Do **not**, at any point in this list: add a bundler, add lunr/Pagefind, add a
content codegen step, or add `merge=union`.

---

## Risks and how to avoid them

| Risk                                      | Why it happens                                                                                                                                                                                        | Avoidance                                                                                                                                                                                                                                                                                    |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Split costs bytes**                     | gzip cannot exploit redundancy across files; measured +18.4% gzipped for 8 category files at 157 records [8][5].                                                                                      | Accept it as the price of edit isolation; do not also split by group. Re-measure after the split and record the new baseline.                                                                                                                                                                |
| **Module waterfall**                      | Static `import` discovery is sequential; data is only requested after `app/catalog.js` loads [6][7]. Measured: data starts at 19 ms vs 4 ms without `modulepreload`.                                  | Add `<link rel="modulepreload">` for the app and data modules, as web.dev recommends [6]. Don't preload everything — MDN warns it can starve other fetches [6].                                                                                                                              |
| **Silent build omission**                 | `SITE_DIRS` is a hard-coded allowlist; a new top-level directory never reaches `_site/`.                                                                                                              | Have the validator fail if a tracked top-level directory is absent from `SITE_DIRS`.                                                                                                                                                                                                         |
| **Generated-file drift**                  | If content codegen is added, generated files must be committed for `npm run dev` (which serves the repo root), then go stale and fight `prettier --check` (measured failure, +5.8% after formatting). | Don't generate content. Generate only derived artifacts, into a gitignored directory listed in `SITE_DIRS`.                                                                                                                                                                                  |
| **Pagination lies to the user**           | A counter reading "Showing 157 of 157" while 60 cards render is wrong; find-in-page cannot reach paginated-away cards.                                                                                | Keep the counter at _total matches_ and label the control "Show more (N remaining)". Prefer `content-visibility` — it keeps skipped content findable and in the a11y tree [12][13].                                                                                                          |
| **`content-visibility` a11y surprise**    | Off-screen content remains in the a11y tree, so anything hidden inside with `display:none`/`visibility:hidden` also leaks into it [12][13].                                                           | Add `aria-hidden="true"` to intentionally hidden descendants; the current empty-state panel is outside `.card`, so it is unaffected.                                                                                                                                                         |
| **Scroll jump from `content-visibility`** | Without `contain-intrinsic-size`, skipped content has zero height and the scrollbar resizes as you scroll [12].                                                                                       | Always pair with `contain-intrinsic-size: auto <measured content-box height>`. Measured: the value is a content-box size, so `auto 320px` over-reserved 320 px of content and produced a 354 px card (natural 305 px), inflating a 3,000-card page by 15%; `auto 270px` matched within 0.3%. |
| **Lazy bodies break search**              | Search currently matches `row.text`; if bodies are not loaded, queries miss them.                                                                                                                     | Either keep the full-text haystack eager (31 KB gzipped at 157, cheaper than the records) or precompute a token index keyed by id. State which, in the code.                                                                                                                                 |
| **Same-line conflicts persist**           | Per-category files do not isolate edits inside one category, and `ids: [...]` lines are per-group. Measured: same-record and same-`ids`-line edits always conflict [28].                              | One record per block, one id per line; validation in CI; CODEOWNERS review.                                                                                                                                                                                                                  |
| **`merge=union` looks attractive**        | It removes conflict markers, so a PR "merges".                                                                                                                                                        | Git's own docs warn it can reorder lines and requires verification [29]; on a JS array it can yield invalid syntax. Never use it here.                                                                                                                                                       |
| **Positional ids**                        | `id: "1.1"` encodes order; inserting a prompt mid-deck forces renumbering across `prompts.js` and `taxonomy.js`.                                                                                      | Move to stable slugs now, while ids appear in no URL (`app/url.js` encodes path/`q`/`pat`/`sort` only). This is the "cool URIs" argument applied to records [34].                                                                                                                            |
| **Search library adopted too early**      | lunr at 157 records is 70 KB gzipped _plus_ 8 KB of library to replace a 0.05 ms scan [24][25]; Pagefind's engine alone is 321 KB of JS (77 KB gzipped) plus 138 KB of compressed WASM [21].          | Keep the matcher; revisit only if ranked relevance or stemming becomes a requirement, and prefer a ~26 KB hand-rolled token index first.                                                                                                                                                     |
| **Scaling the tree, not the grid**        | The tree is 735 elements for 137 nodes (5.4 per node) and is built once, eagerly, for every node in `buildItem`, including collapsed subtrees [15][16].                                               | Build child `<ul>`s on first expand, so the initial DOM is proportional to what is visible.                                                                                                                                                                                                  |
| **Stale hard-coded counts**               | `index.html` says "157 prompts"; `README.md` says it five times.                                                                                                                                      | Render the count from data; remove the literals from README or generate them.                                                                                                                                                                                                                |

---

## Measurements and method

All local numbers in this note were produced on 2026-10-20 on macOS arm64 with:

- **Chromium 156.0.8078.4** (`chrome-headless-shell`, `--headless --no-sandbox
--disable-gpu`), serving a copy of the repo from a local `python3 -m http.server`
  over HTTP/1.1 loopback. "Layout" means a forced synchronous layout via
  `element.offsetHeight` after `innerHTML` assignment — a lab proxy for style +
  layout, **not** a paint measurement.
- **Node v24.22.0** for gzip sizes (`zlib.gzipSync`, default level), gzip-based
  payload projections, cold module-import timing, lunr 2.3.9 index builds, and
  Pagefind 1.x index builds (`addCustomRecord` + `getFiles`/`writeFiles`).
- Scaling above 157 records was produced by **repeating the 157 real records**
  with unique ids. This preserves per-record text length and makes the byte
  figures an **optimistic lower bound**: genuinely new content compresses worse
  because it repeats less.
- Live-site figures were taken with `curl --http2` against
  `https://nicolas-found42.github.io/prompt-pack/`. The deployed build contains
  **107** prompts (a single 77,224-byte prompt module, 24,260 bytes gzipped transfer),
  while the working tree contains 157, so live byte figures understate the
  repo's current size; the 157-record figures elsewhere in this note come from
  the working tree.
- Live headers observed: `content-encoding: gzip` (no brotli),
  `cache-control: max-age=600`, weak `ETag`, `vary: Accept-Encoding`, and
  `304 Not Modified` on `If-None-Match` revalidation — so repeat visits cost a
  conditional request, not a re-download [26].
- Current data integrity was checked directly: 157 unique ids, 157 taxonomy
  references, 0 duplicates, 0 orphans, 0 dangling references, 0 missing fields,
  0 `words` mismatches.

---

## Sources

All read on 2026-10-20. Primary sources are MDN, WHATWG/W3C/IETF specifications,
web.dev, V8, and first-party tool/GitHub documentation.

1. MDN — JavaScript modules (splitting programs, bundler trade-offs, `.mjs` vs `.js`): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
2. MDN — `<script type>` (`module` is deferred; `charset`/`defer` have no effect): https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type
3. WHATWG HTML Standard — Scripting (§4.12, script element, `async`/`defer`/module semantics): https://html.spec.whatwg.org/multipage/scripting.html#the-script-element
4. IETF — RFC 9113, HTTP/2 (multiplexing; `SETTINGS_MAX_CONCURRENT_STREAMS` recommended ≥ 100): https://httpwg.org/specs/rfc9113.html
5. HTTP/2 FAQ (http2.github.io) — multiplexing and why concatenation/spriting were HTTP/1.1 workarounds: https://http2.github.io/faq/
6. web.dev — Preload modules (`rel="modulepreload"`, flat preload lists, credentials defaults): https://web.dev/articles/modulepreload
7. web.dev — Code-split JavaScript (unbundled module trees are one request per module; bundler guidance): https://web.dev/learn/performance/code-split-javascript
8. V8 — The cost of JavaScript in 2019 (~50–100 kB bundle guidance; HTTP/2 reduces request overhead; `JSON.parse` vs object literal, 10 kB rule): https://v8.dev/blog/cost-of-javascript-2019
9. MDN — Import attributes (`with { type: "json" }`, MIME-type validation, syntax/errors): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with
10. MDN — `import()` dynamic import (loaded only when needed; module namespace caching): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import
11. MDN — `import.meta` (module URL, resolving relative paths): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta
12. web.dev — `content-visibility`: the new CSS property that boosts your rendering performance (skip off-screen rendering, `contain-intrinsic-size`, a11y caveats): https://web.dev/articles/content-visibility
13. MDN — `content-visibility` (values, "relevant to the user", a11y tree behavior): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/content-visibility
14. MDN — Using CSS containment (`contain`, `contain-intrinsic-size`, containment types): https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Using
15. Chrome for Developers — Lighthouse "Avoid an excessive DOM size" (warn > ~800 nodes, fail > ~1,400): https://developer.chrome.com/docs/lighthouse/performance/dom-size
16. web.dev — How large DOM sizes affect interactivity (style recalc/layout cost per interaction, `content-visibility` as mitigation): https://web.dev/articles/dom-size-and-interactivity
17. web.dev — Optimize long tasks (a task over 50 ms is a long task; blocking period): https://web.dev/articles/optimize-long-tasks
18. web.dev — Interaction to Next Paint (good ≤ 200 ms at p75, poor > 500 ms): https://web.dev/articles/inp
19. MDN — Intersection Observer API (lazy loading, infinite scroll, callback runs on main thread): https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
20. web.dev — Virtualize large lists with react-window (windowing; why infinite loading still grows the DOM): https://web.dev/articles/virtualize-long-lists-react-window
21. Pagefind — Getting started (post-build static index bundle, no server component): https://pagefind.app/docs/
22. Pagefind — Search API (`search`, per-result lazy `data()`, `preload`, chunked indexes): https://pagefind.app/docs/api/
23. Pagefind / CloudCannon — Introducing Pagefind (index chunking rationale, "full-text search on … MDN in under 300 KB total"): https://cloudcannon.com/blog/introducing-pagefind/
24. Lunr — Getting started (single-file browser build, index construction): https://lunrjs.com/guides/getting_started.html
25. Lunr — Pre-building indexes (in-browser building can block; ship a serialized index): https://lunrjs.com/guides/index_prebuilding.html
26. MDN — HTTP caching (`ETag`/`If-None-Match`, `304 Not Modified`, `Cache-Control`, `Vary`): https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching
27. GitHub Docs — GitHub Pages limits (1 GB site, 100 GB/month soft bandwidth, 10 builds/hour; Actions exempt): https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
28. GitHub Docs — Merge conflicts (conflicts arise from different changes to the same line of the same file): https://docs.github.com/en/pull-requests/reference/merge-conflicts
29. Git — `gitattributes` (merge attribute; built-in drivers; `union` warning): https://git-scm.com/docs/gitattributes#_performing_a_three_way_merge
30. GitHub Docs — About code owners (`CODEOWNERS`, auto review requests, required code-owner review): https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners
31. MDN — Using Web Workers (background thread, `postMessage`, no DOM access): https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
32. MDN — `requestIdleCallback()` (background/low-priority work without affecting latency-critical events): https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback
33. MDN — Using the Fetch API (`fetch()`, `Response.json()`, error handling): https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
34. W3C — "Cool URIs don't change" (stable identifiers; don't encode transient structure in names): https://www.w3.org/Provider/Style/URI
35. web.dev — Optimize resource loading (preload scanner, late-discovered `import()` and client-rendered markup, `type=module` is deferred): https://web.dev/learn/performance/optimize-resource-loading
36. MDN — HTTP/2 glossary (multiplexing, header compression, server push removal): https://developer.mozilla.org/en-US/docs/Glossary/HTTP_2
37. MDN — `box-sizing` (`content-box` is the default: `width`/`height` apply to the content box, padding and border are added): https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing

Repo files measured: `data/prompts/`, `data/taxonomy.js`, `app/catalog.js`,
`app/search.js`, `app/results.js`, `app/main.js`, `app/tree.js`, `app/state.js`,
`app/url.js`, `index.html`, `scripts/build-pages.mjs`, `.github/workflows/pages.yml`,
`eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`.
