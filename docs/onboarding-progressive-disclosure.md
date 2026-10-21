# Onboarding and progressive disclosure for a growing prompt deck

> Location note: this file lives in `docs/`, alongside `docs/css-organization.md`
> (splitting the stylesheet) and `docs/visual-structure-scaling.md` (tokens,
> theming, responsive layout). Read on 2026-10-20 against the current tree:
> `index.html` (103 lines), `app/main.js` (382), `app/tree.js`, `app/facets.js`,
> `app/results.js` (41), `app/search.js` (44), `app/state.js` (45),
> `app/url.js`, `data/taxonomy.js` (8 categories / 41 subcategories / 88 groups,
> 137 nodes, 8 of them without a `summary`), and `data/prompts.js` (157 records).
> Every "current" claim below is a reading of those files; every rule about
> people is cited to a primary or canonical-practitioner source.

## Recommendation

The deck does not have an onboarding problem. It has a **defaults, wording and
focus-management** problem. The evidence below says a first-run tour is the
weakest available intervention and that the effort is better spent on the
screen a first-time visitor already sees. Concretely, in priority order:

1. **Do not add a guided tour, coach marks, or a deck-of-cards intro.** In a
   controlled test of 70 users across 4 apps, tutorials produced no significant
   gain in task success (91% vs 94%, p=0.443) or speed, and users who read them
   rated the tasks as _harder_ (SEQ 4.92 vs 5.49, p=0.047). [33] NN/g's guidance
   is to skip onboarding whenever possible and spend the effort on usability.
   [31] What works instead is help at the moment of need ("pull revelation").
   [32]
2. **Make the no-hash first view a curated "Start here" set** (3-4 plain-language
   buckets, roughly a dozen prompts [UNVERIFIED: group size is a design choice,
   not a sourced number]), with "Browse all 157" as one click and the URL hash
   always winning over any stored or default view. People stay on defaults, and
   the top position absorbs a large share of choices (42% top-hit in the
   unswapped condition, 34% after a swap). [42] The default view is therefore
   the most-read documentation the site will ever have.
3. **Render the taxonomy `summary` text that already exists.** 129 of the 137
   nodes carry a `summary` (all 41 subcategories and 88 groups; the 8 top-level
   categories do not), `app/catalog.js:25,47,64` copies it onto every node, and
   no renderer ever reads it. Show it under the breadcrumb when a branch is
   selected, and as the one-line description of a category. Summary text that
   conveys the gist adds cues beyond the label, and both are part of what the
   user sees, the half of information scent a designer controls. [40]
4. **One persistent "How to use this deck" `<details>` near the masthead**, three
   short lines (browse on the left, search covers everything, copy a prompt).
   Native `<details>`/`<summary>` gives the disclosure semantics for free [17][18];
   GOV.UK uses exactly this component for "information only some users need". [45]
5. **Move sort and "Expand all" into a "View options" disclosure.** The split that
   progressive disclosure requires is: everything frequently needed stays up
   front, rarely needed options go behind one clearly labelled control. [29]
   Search, tree, breadcrumb and pattern chips are frequently needed; sort order
   and global expand are not.
6. **Tell the truth about scope.** A query currently searches the whole deck while
   the breadcrumb still shows the selected branch (`app/main.js:115-116`:
   `// A query searches the whole deck; the tree selection only scopes an empty search.`).
   That is the exact condition NN/g warns about: users assume search covers
   everything, miss the scope, and conclude the content is absent. [38] Print a
   scope line above the results (`Searching all 157 prompts, not only Coding`)
   with a one-click way to narrow.
7. **Forgive typing without adding a dependency**: NFC-normalize and strip
   diacritics on both sides [26], split the query into tokens and require all of
   them in any order, and offer a "did you mean" built from edit distance over the
   existing pattern/title vocabulary. The current matcher is a raw
   `String.includes` over a lowercased haystack (`app/search.js:8-16`). NN/g's
   no-results guidance is explicit: restate the query, keep it in the box, suggest
   similar queries, correct spelling, and advise using different or fewer
   words. [36]
8. **Treat the accessibility defects below as the real simplification work.**
   They are the places where a keyboard or screen-reader user gets _more_ work
   than a mouse user: focus destroyed on chip activation, a `/` shortcut with no
   off switch, an off-screen drawer that still takes focus, unannounced status
   text, and faded tree rows at 2.76:1.
9. **Write the UI in plain language.** Use the words users use, keep sentences
   short, prefer the active voice, and explain a term the first time it appears;
   GOV.UK makes plain English mandatory because a large share of adults read
   below the level most interfaces assume. [46][47] Digital.gov's rule set is
   shorter words, short sections, active voice, present tense, no hidden
   verbs. [48] The concrete rewrites are in Q5.
10. **Do not add a "Simple view" mode switch.** Visual-design customisation is a
    poor onboarding ask, and most people never leave the default anyway. [31][42]
    Make the default simple instead.

The rest of this note gives the evidence per question, then the risks.

---

## Q1 - Progressive disclosure: where it helps and where it hurts

Progressive disclosure means showing the few most important options first and
offering the larger specialised set on request. Its usability benefit is
learnability: novices are not asked to contemplate features they do not need,
and experts are not forced to scan past them. [29] Two things must be right: the
split between initial and secondary content, and an obvious, well-labelled way
to reach the second level. Beyond two disclosure levels usability typically
drops, and the guidance is to simplify rather than add a third level. [29]

Accordions are the common implementation, and the canonical practitioner source
is blunt about the trade: they reduce clutter and scrolling, but they reduce
visibility, add interaction cost for every section, and hide content from people
who would have benefited from seeing it. Use them when users need only a few of
the sections, when sections are independent, and when the page is long or the
window is small. Avoid them when users need most of the content, when the page
is short, when the hierarchy is deep, or when headings cannot summarise the
content honestly. [30] The APG contract for the pattern is that each header
title sits in a `button` wrapped in a `heading` at the appropriate level, with
`aria-expanded` and `aria-controls`, and that every focusable element inside
participates in the normal Tab sequence. [2] GOV.UK adds the operational rules:
never use an accordion for content all users need, never nest accordions, and
prefer simplifying the content first. [44] Its lighter sibling, `<details>`, is
for one section of content that only some users need. [45]

How that maps onto this deck:

| Pattern                             | Where it already is                                                                                                                  | Verdict                                                                                                                                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prompt body behind a disclosure     | `<details class="prompt">` per card, with a "Show prompt / Hide prompt" summary (`app/results.js:32-35`, `styles/cards.css:164-174`) | **Correct and load-bearing.** The `words` field runs 50-126 (mean 71), so 157 unexpanded bodies would be roughly 11,000 words of default-visible text; collapsing them is what makes the grid scannable. Keep.                  |
| Whole-card summary                  | Title, purpose, taxonomy path and word count always visible (`app/results.js:23-31`)                                                 | **Correct.** The collapsed state still carries enough information to decide.                                                                                                                                                    |
| Global "Expand all"                 | `#toggle` button (`index.html:68`)                                                                                                   | **Keep, but demote** into "View options". It is a power control, not a first-run need.                                                                                                                                          |
| Sort control                        | `#sort` with six options (`index.html:59-66`)                                                                                        | **Demote.** "Tree order" is jargon and the default is right for browsing.                                                                                                                                                       |
| Taxonomy tree                       | Three levels, collapsed by default beyond the roots (`app/tree.js`)                                                                  | **Correct shape, but do not add a fourth level.** Deep hierarchies plus disclosure is the documented failure mode. [30] If categories grow past roughly a dozen, add a category landing view rather than another nesting level. |
| Per-section "show more" on the grid | Not present; all matching cards render (`app/results.js:19-39`)                                                                      | **Add only when the grid gets slow.** Pagination and lazy rendering are Topic A's remit; from a disclosure standpoint a counted "Show 30 more" is better than an unlabelled spinner because it tells the user what is left.     |

Two rules that follow directly from the sources and are easy to get wrong:

- **Multiple sections must be openable at once.** Auto-collapsing accordions
  prevent comparing content from two sections. [30] The deck already allows
  this; do not introduce a `name`-grouped `<details>` set on cards.
- **Printing must not silently drop content.** NN/g calls out accordions as
  unoptimised for print and recommends an expand-all control or expanding at
  print time. [30] There is currently no `@media print` block in any of the six
  stylesheets, so every collapsed prompt body prints as its summary line, which
  looks like a truncated record rather than a collapsed one. Prefer the
  documented `open` attribute over CSS tricks — MDN notes that `open` is a
  Boolean attribute whose _presence_ opens the widget, and that it can be set
  and removed programmatically [17] — so listen for the print media query (or
  `beforeprint`) and add `open` to every `details.prompt`, restoring the
  previous set afterwards. A `@media print` rule can then hide the now-redundant
  "Hide prompt" label.

---

## Q2 - Onboarding for first-run users

### 2.1 What the research actually measured

NN/g ran a between-subjects remote unmoderated test with 70 participants
(35 per condition) across four iOS apps, all of which used deck-of-cards
tutorials that could be skipped. [33]

| Measure                    | Read tutorial | Skipped tutorial | Result                                     |
| -------------------------- | ------------- | ---------------- | ------------------------------------------ |
| Task success               | 91% (n=35)    | 94% (n=35)       | Not significant, p=0.443                   |
| Single-ease (1-7)          | 4.92          | 5.49             | Significant, p=0.047, favouring _skipping_ |
| Task time (geometric mean) | 93.49 s       | 85.17 s          | Not significant, p>0.1                     |

The authors' conclusion is that tutorials cost design and development effort
that would be better spent making the interface easy, and that participants who
read them perceived the tasks as _more_ difficult, possibly because a tutorial
signals that the interface is complicated. [33] The onboarding guidance built on
that work says to skip onboarding whenever possible, because it adds interaction
cost (even skipping costs a click), leans on memory that users do not have, and
may not improve performance at all. [31]

The exceptions where onboarding _is_ warranted are narrow: you need information
from the user to start, the experience is heavily personalised, or a workflow is
genuinely novel and unlike other interfaces. [31] A browsable list of prompts
fails all three.

### 2.2 Push versus pull

The useful distinction is between **push revelations** (shown when the system
decides, usually at launch: tours, "what's new" modals, coach-mark chains) and
**pull revelations** (shown when the user's own action signals they need it:
tooltips, inline hints, empty-state help). Push revelations interrupt, are not
remembered, and do not improve performance; pull revelations work because the
hint is in context and can be applied immediately. [32][35] Coach marks are
"often nice-to-have and not need-to-have", and long chains of them make an
interface look harder than it is while users dismiss them faster. [34]

For this deck, the honest pull-revelation surface is the empty state and the
zero-result state, both of which already exist and are already well-formed:

- `app/results.js:9-15` returns "No prompts match", a hint ("Try a shorter
  query, fewer pattern chips, or another branch of the tree"), and a
  "Clear search and filters" button.
- `app/results.js:15` returns "No prompts in this branch yet." for an empty
  branch with no filters.

That is close to the published guidance: do not leave an empty state blank,
state the system status, add a learning cue, and give a direct path forward. [35]
The zero-result page specifically should restate the query, keep it in the box,
suggest similar queries, correct spelling, and advise different or fewer
words. [36] Three of those five are missing: the query is not restated, there
is no suggestion or spelling correction, and "no prompts in this branch yet"
does not tell the reader whether the branch is empty in the data or merely
filtered.

### 2.3 The empty state is not the first-run state

There is no zero-record state here: on load, `applyFromUrl()` reads the hash,
`render()` runs, and all 157 cards appear in tree order (`app/main.js:377-380`).
So the first-run question is not "what do I show before there is data" but
"which of 157 things do I put first". That is a defaulting question, and the
evidence is that defaults are sticky: in a Cornell study of search click-through,
42% of users chose the top result, and after the top two results were secretly
swapped the top slot still won 34%. Users also rarely use customisation
features, which is why the default experience should be optimised rather than
made configurable. [42]

A curated first view is therefore the highest-leverage onboarding move
available, provided it obeys the scoping rule in Q3: the curated set must be
visibly a subset, with the full set one click away, or it becomes the "scoped by
default" trap. [38]

### 2.4 Recommended first-run surface

Keep it to one screen, no overlay, no interruption:

1. A one-line deck description under the `h1` (the current subtitle is
   "157 prompts · Category › Subcategory › Group", which describes the data
   model, not the value).
2. A `<details>` "How to use this deck" with three sentences: the left panel
   filters, search covers every prompt, and each card has a copy button.
3. A "Start here" default only when the URL has no path, with a visible
   "Browse all 157 prompts" link and a visible count.
4. The improved zero-result copy from 2.2.

No modal, no tour, no tooltips on first load, no stored "seen onboarding" flag.

---

## Q3 - Wayfinding as the deck grows

### 3.1 Breadcrumbs: present, but two rules are broken

Breadcrumbs support wayfinding by showing the current location in the
hierarchy, and they matter most for users who arrive deep from an external link
rather than by walking down from the home page. [39] The guidelines that this
implementation misses:

- **The current item should not be a link.** "You should never have a link that
  does nothing." [39] The current crumb is still a `<button>` with
  `data-path` (`app/main.js:98-100`) and only differs visually
  (`styles/controls.css:216-221`); activating it re-selects the same path.
- **The current item needs a programmatic state.** When one item in a set is
  styled differently because it is current, `aria-current` carries that to
  assistive technology; `aria-current="page"` is the breadcrumb value. [22]
  There is no `aria-current` anywhere in `index.html`, `app/main.js` or
  `app/tree.js`.
- **Do not let the trail wrap on mobile.** A multi-line breadcrumb does not
  show the chain well and eats the fold. [39] `.crumbs` sets
  `flex-wrap: wrap` (`styles/controls.css:190-196`), so a deep path wraps.
  NN/g's mobile allowance is to shorten to the last level or two. [39]
- **Do not make the targets too small or too crowded.** The crumbs are 13.6px
  text with 3px/8px padding, about 27px tall, which clears the 24px minimum
  height, but the trail should still be treated as a touch target and not
  squeezed. [39][13]

### 3.2 Facets: the right control, with one missing piece

Pattern chips are a genuine facet: they describe one independent dimension of
the content and combine with the tree, and faceted navigation gives users a
structure for understanding the content space as well as a way to narrow it.
The cost is metadata discipline and interaction cost. [43] The deck pays the
metadata cost already (`row.pattern`, with live counts recomputed per render at
`app/main.js:130-133`).

What is missing is the **scope statement**. Two specific hazards:

- **Silent search scope.** As noted in the recommendation, a query ignores the
  selected branch (`app/main.js:115-116`) while the breadcrumb continues to
  display it. Users expect search to cover everything, overlook scope widgets,
  and forget a scope they set themselves; the result is users concluding the
  site does not contain what they want. [38] The mitigation NN/g prescribes is
  a scope label next to the box _and_ at the top of the results, plus one-click
  expansion — never a scope the user did not choose. [38]
- **Chip counts without a stated basis.** The chip count is computed over the
  query result (`app/main.js:130`), not over the whole deck, which is the more
  useful basis but is never stated. NN/g's facet guidance is that facets should
  match the dimensions users care about; a count whose denominator changes
  silently undermines that. [43]

### 3.3 Counts and status

"Showing X of 157" (`app/main.js:158`) is good visibility of system status, and
it is derived from `ROWS.length`, so it survives growth. The masthead subtitle
hard-codes the number (`index.html:41`: `157 prompts · ...`), and the README
repeats it in five places; those will drift on the first content addition.
Render the masthead count from data instead.

For a screen-reader user the count is invisible: there is no live region, so
neither the result count nor the copy confirmation reaches assistive
technology. WCAG 4.1.3 requires status messages to be programmatically
determinable through role or properties without receiving focus, and explicitly
names "18 results returned" and "No results returned" as the kind of brief text
that qualifies. [14] ARIA22 (`role="status"`) is the sufficient technique. [14]

Caution from the same source: over-announcing makes an application "chatty", and
user testing is the recommended way to set the level. [14] Announcing on every
keystroke would be exactly that. Debounce the announcement (roughly 300-500ms
after typing stops) and announce the count once per settled query; the exact
delay is an engineering choice, not a sourced number [UNVERIFIED].

### 3.4 "Did you mean" and tolerance to typing

The matcher is a strict substring test over `title + purpose + text + path`,
lowercased once at module load (`app/search.js:8-16`, `app/main.js:106`). That
means: no stemming, no diacritic folding, no token reordering, no typo
tolerance, and no "did you mean".

The primary-source-backed minimum, in ascending order of cost:

| Change                                                                          | What it buys                                                                                                                                          | Source                                                                                      |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `.normalize("NFC")` on both haystack and query, then lowercase                  | Composed and decomposed forms of the same character compare equal; the same string can otherwise be two different code-point sequences and fail `===` | [26]                                                                                        |
| Strip diacritics before comparing                                               | "resume" finds "résumé"; compatibility decomposition is explicitly noted as appropriate for search but not for display                                | [26]                                                                                        |
| Split the query on whitespace; require every token, in any order                | Turns one literal phrase match into a word-set match, which is how people actually type                                                               | engineering choice; NN/g's advice is to let users "use different words or fewer words" [36] |
| Edit distance over the pattern vocabulary and titles, offering "did you mean X" | Recovers the misspelling case; search suggestions also convert query generation from recall into recognition                                          | [36][41]                                                                                    |

Two boundaries: search suggestions must never point at a query that returns
nothing ("Suggested terms that return zero results ... are worse than
unhelpful"), and suggested text must be visually distinguished from the typed
text. [37] A dropdown is not needed for a 157-record deck; an inline
"Did you mean _hardening_?" line next to the count is enough and avoids the
combobox keyboard contract.

### 3.5 Category descriptions and recents

The data already contains 129 short descriptions (137 nodes minus the 8
top-level categories, which have no `summary` field at all). `app/catalog.js`
copies `summary` onto every node, and no renderer reads it. This is free
information scent: the link label is the most important cue, and summary text
that accompanies it should convey the gist and add detail beyond the label;
both sit in the half of scent a designer controls (what the user sees), as
opposed to what the user already knows. [40] It is also the cheapest way to satisfy the
"supplemental content" intent of WCAG 3.1.5 for complex material. [16]

Recents are the other cheap recognition aid: showing recently visited content
lets users resume without recalling a name, and recognition is easier than
recall because it supplies more cues. [41] If added, store it in
`localStorage` — but `localStorage` throws `SecurityError` when the origin is
invalid or the user has blocked persistence, so every access needs a
`try/catch`, and the hash must remain authoritative so a shared link is never
overridden by a personal recent. [27]

---

## Q4 - Accessibility as the simplicity mechanism

The premise is worth stating plainly: for a keyboard or screen-reader user,
every defect below converts a one-step task into several, which is the opposite
of "simple". These are not compliance chores bolted onto a simple design; they
are the design.

### 4.1 What is already right

| Present                                                                                                                                                                      | Why it counts                                                                                                                                                        | Source      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Skip link to the prompt grid (`index.html:17`), target is `#body` with `tabindex="-1"` (`index.html:85`)                                                                     | Bypass blocks is the mechanism that lets keyboard users skip repeated navigation; a focusable target also makes the jump land visibly                                | [5]         |
| `role="tree"` with `aria-label`, `treeitem` with `aria-level`, `role="group"` for children, roving `tabindex`, arrow/Home/End/Enter handling (`app/tree.js:15,39,55,80-136`) | The APG tree view contracts for roles, states and the arrow-key model are implemented                                                                                | [3]         |
| Native `<details>`/`<summary>` for prompt bodies (`app/results.js:32`)                                                                                                       | Disclosure semantics, keyboard operation and state come from the platform; the APG disclosure pattern reduces to "button, `aria-expanded`, optional `aria-controls`" | [1][17][18] |
| `aria-pressed` on pattern chips (`app/facets.js:7`)                                                                                                                          | Toggle-button state is exposed; the pressed style is driven off the attribute (`styles/controls.css:154`), so visual and programmatic state cannot diverge           | [21]        |
| Focus indicator on tree rows, search and select (`styles/tree.css:113-120`, `styles/controls.css:23-27`)                                                                     | A focus indicator must exist in some mode of operation; these components supply an author-drawn one                                                                  | [7]         |
| Drawer opener carries `aria-expanded` and `aria-controls` (`index.html:34-35`, `app/main.js:187`)                                                                            | Correct disclosure wiring for the mobile panel                                                                                                                       | [20]        |

### 4.2 What is broken, with the exact evidence

**1. A global focus ring that never applies.** `styles/base.css:90` reads
`::focus-visible` (two colons). That is a pseudo-_element_ selector, so the rule
is invalid and dropped; the intended global `outline: 2px solid var(--link)` is
dead. Focus is still visible, but only because of four separate local rules:
`.skip-link:focus-visible` (`styles/base.css:29`), `#body:focus-visible`
(`styles/base.css:34`), tree rows (`styles/tree.css:113-120`), and the search
box and select, which remove the outline and substitute a 3px box-shadow
(`styles/controls.css:23-27`). Everything else — the copy button, the
expand-all button, crumb buttons, chip buttons, card summaries — relies on the
user-agent outline. That is an accepted way to meet 2.4.7 (G149/G165) [7], so
this is not automatically a failure; the problem is that the stylesheet states
an intent the browser never honours, so a future contributor who "reuses the
global ring" gets nothing. Fix the selector to `:focus-visible` and decide
deliberately whether components may opt out. [28]

**2. The `/` shortcut has no off switch.** The document-level handler focuses
search on `/` whenever the target is not an input, select, textarea or
contenteditable (`app/main.js:334-348`), and the input advertises it:
`aria-keyshortcuts="Control+k Meta+k /"` (`index.html:53`). A shortcut using
only a printable character must satisfy one of three exceptions: a mechanism to
turn it off, a mechanism to remap it to include a non-printable key, or active
only on focus. None holds. [11] MDN's guidance is stronger still: avoid
single-letter shortcuts and avoid overriding assistive-technology or browser
key handling, and make any shortcut you keep discoverable. [23] APG's
key-assignment guidance adds the structural reasons: shortcuts must never
substitute for ordinary navigation, conflicts with OS/browser/AT keys can trap
a user, and the shortcut should be revealed on the element itself rather than in
documentation. [4] Removing `/` from the handler and the attribute costs
nothing; `Ctrl/Cmd+K` is unaffected.

**3. The expand-all button changes its label while claiming to be a toggle.**
`updateToggleLabel()` swaps the text between "Expand all" and "Collapse all"
and sets `aria-pressed` (`app/main.js:211-213`). MDN is explicit: do not change
the contents of the label on a toggle when the state changes, because the
pressed state is already announced; if the label must change, do not use
`aria-pressed`. [21] Pick one: a stable "Show all prompt text" toggle with
`aria-pressed`, which is the better fit for a setting that persists across
renders.

**4. Activating a chip destroys focus.** `renderFacets` assigns
`root.innerHTML` on every render (`app/facets.js:13`), and the chip handler
calls `render()` immediately after toggling (`app/main.js:251-258`). The
activated button is removed from the DOM, so focus falls to `<body>`. APG names
this exact failure: if the active element is removed and focus is not managed,
browsers move focus to the body, "effectively causing a loss of focus within the
user interface"; the active element should stay visible and focus should move
logically. [4] WCAG 2.4.3 requires focus order to preserve meaning and
operability. [6] The fix is structural: keep the chips in the DOM and update
`aria-pressed` and the count text in place, exactly as `updateTree` already does
for the tree (`app/tree.js:139-152`), or restore focus to the chip with the same
`data-pat` after re-render.

**5. The closed drawer stays in the tab order and keeps focus.** On narrow
screens the sidebar is an off-canvas panel moved with `transform:
translateX(-100%)` (`styles/layout.css:96-107`); `setDrawer` only toggles a class
and `aria-expanded` (`app/main.js:185-188`). A transformed element is still
rendered, still focusable and still in the accessibility tree, so a keyboard
user can tab into an invisible panel. Worse, `selectNode` closes the drawer on
small screens (`app/main.js:171`) while focus remains on the selected tree item
inside it, so focus is left on an off-screen control. The drawer is
author-created content that can entirely hide the focused component, which
2.4.11 forbids. [8] Make the closed sidebar `inert` — inert elements and their
descendants are removed from the tab order and the accessibility tree, cannot
be focused or clicked, and are hidden from assistive technology [52] — and
remove `inert` when open, move focus into the panel on open, return it to the
opener on close, and use `100dvh` for the height.

**6. Status text is never announced.** The result count
(`app/main.js:158`) and the copy confirmation (`app/main.js:323-326`,
`"Copied"` then back to `"Copy"` after 1.4s) are status messages with no role or
live region. [14] Add one empty `role="status"` element and write the settled
count and the copy result into it. Do not also mark the visible count as a live
region (that is the chatty failure mode).

**7. Faded tree rows fall below the text contrast floor.** Rows with a zero
count get `opacity: 0.45` (`styles/tree.css:109-111`). The tree sits on
`.sidebar`, whose background is `var(--surface)` (`styles/layout.css:17`;
`#ffffff` light, `#1a1e25` dark, per `styles/tokens.css`). Computed with the
WCAG relative-luminance formula, compositing the faded text over that surface:

| Theme | Row label after 45% opacity | Ratio on sidebar | Requirement             |
| ----- | --------------------------- | ---------------- | ----------------------- |
| Light | `#989ca0` on `#ffffff`      | 2.76:1           | 4.5:1 for body text [9] |
| Dark  | `#767a7f` on `#1a1e25`      | 3.87:1           | 4.5:1 for body text [9] |

The count badge inside those rows fades further, to roughly 2.03:1 light and
2.47:1 dark (muted text on the soft pill, both also faded). These rows are
still interactive — clicking one selects an empty branch — so they are not
"inactive user interface components" and the contrast exception does not
apply. [9] Dim the badge, not the label, or express emptiness with a "0" and a
non-text cue.

**8. The sticky controls bar can cover a focused target.** `.controls-bar` is
`position: sticky; top: 0; z-index: 5` (`styles/layout.css:66-70`) while
`html { scroll-padding-top: env(safe-area-inset-top, 0px) }`
(`styles/base.css:10`) accounts only for the safe area. Scroll-into-view then
lands behind the bar, which is the sticky-header case 2.4.11 was written for;
the sufficient technique is `scroll-padding-top` sized to the bar. [8]

**9. Reduced motion is only half-covered.** `prefers-reduced-motion` appears in
one place (`styles/cards.css:31-37`, card hover), while 11 `transition`
declarations are spread across five stylesheets (plus the single
`transition: none` inside that one media block), including the drawer
transform and scrim opacity (`styles/layout.css:102,122`) and the skip-link
slide (`styles/base.css:26`). Non-essential motion triggered by interaction must
be disableable, and the sufficient techniques are the CSS media query and its
script equivalent. [15][25] One global rule in `base.css` is the maintainable
form.

**10. The search box has no visible label, and its placeholder is not its
name.** The input carries `aria-label="Search prompts"` and a long placeholder
(`index.html:48-54`). MDN's rule is that a placeholder must not stand in for a
label: it disappears on typing, is rendered at lower contrast, and is not
announced by default. [24] WCAG 2.5.3 requires the accessible name to contain
the visible label text where a label exists; the understanding document treats
placeholder text as a candidate label when nothing else is adjacent. "Search
prompts" does not contain "Search titles, purposes and prompt text". [12] Add a
visible `<label>` that says "Search", keep the longer hint as a description or
as placeholder text, and wrap the whole thing in `<search>` — the element
supplies the search landmark without `role="search"`. [19]

**11. Two smaller items.** The sidebar heading `<h2>Categories</h2>`
(`index.html:21`) precedes the page `<h1>` (`index.html:40`) in DOM order, so a
heading list starts at level 2 and the first heading a screen-reader user hears
is a subheading of nothing. Structure conveyed by presentation must be
programmatically determinable, and headings are identified with `h1`-`h6`
(H42) and organised into a coherent outline (G141). [53] Descriptive labels are
separately required by 2.4.6: if a label or heading is present it must describe
its topic or purpose. [54] Fix by promoting the sidebar label to a non-heading
(simplest, since the sidebar already has `aria-label`) or by moving the page
`h1` first. And the tree has no type-ahead: APG recommends it for all trees,
"especially for trees with more than 7 root nodes" — there are 8 categories
here. [3]

### 4.3 Text scaling and target size

Body text is `15px/1.55` (`styles/base.css:51-52`) with `--type-small: 0.85rem`
and `--type-h1: 1.45rem` (`styles/tokens.css:79-80`). Full-page zoom satisfies
1.4.4 up to 200% (G142), and rem-based component text scales with the user's
default size. [10] The 15px base is below the USWDS guidance of 16px effective
for body copy [51]; moving to `1rem` (or `font-size: 100%` on `body` plus rem
elsewhere) costs nothing and removes a class of text-only-resize complaints.

Target size: the tree twisty is 12×12px (`styles/tree.css:40-48`) and is a
separate target from the row, which selects on click (`app/tree.js:87-97`). An
undersized target passes only if a 24px-diameter circle centred on it does not
intersect another target — here the circle necessarily overlaps the row it
sits in, and the "equivalent control" exception refers to another _control_
meeting the criterion, not to arrow keys. [13] Give the twisty a 24×24 padding
box (negative margins keep the visual size) or make the whole row toggle
expansion and move selection to an explicit control.

---

## Q5 - Plain-language UI

GOV.UK makes plain English mandatory on the grounds that a large minority of
adults read well below the level most interfaces assume (1 in 6 adults in
England have very poor literacy; 1 in 4 in Scotland; 1 in 8 in Wales; 1 in 5 in
Northern Ireland), and that even specialist readers prefer plain English. [46]
The rules that matter for interface copy: use the words users use, keep
sentences short, use the active voice, address the reader as "you", explain a
term the first time it appears, and avoid jargon and buzzwords. [46][47]
Digital.gov's equivalent list is shorter words, short sections, active voice,
present tense, and no hidden verbs. [48][49] USWDS frames the same aim as
"start with real user needs" and "earn trust": content should be clear,
easy-to-follow plain language. [50]

WCAG 3.1.5 is the measurable version: when text needs reading ability beyond
lower secondary education (about nine years of school), a simpler version or
supplemental content must be available. [16] It is AAA, and the deck's prompt
bodies are deliberately specialist text, so the realistic target is the
**interface chrome**, not the prompts.

Proposed rewrites, all of them in files that already exist:

| Current                                                                                                                  | Proposed                                                                                                     | Why                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `157 prompts · Category › Subcategory › Group` (`index.html:41`)                                                         | `Browse 157 prompts by topic. Copy any prompt in one click.` and render the count from data                  | Describes the data model, not the benefit; the number is hard-coded and will drift                                                             |
| `Search titles, purposes and prompt text` (`index.html:51`)                                                              | Visible label `Search`, hint `Search all 157 prompts`                                                        | Placeholder as label fails 2.5.3 and disappears on typing [12][24]                                                                             |
| `Sort` / `Tree order` (`index.html:58,60`)                                                                               | `Order` / `Deck order` (or `Topics first`)                                                                   | "Tree" is an implementation word                                                                                                               |
| `Expand all` (`index.html:68`)                                                                                           | `Show all prompt text` (stable label, `aria-pressed`)                                                        | Toggle labels must not change [21]; "expand" is abstract                                                                                       |
| `Filter by interaction pattern` / `Pattern` (`index.html:77`, `app/facets.js:13`)                                        | `Filter by type of work` / `Type of work`                                                                    | "Interaction pattern" is a term of art; the values (Execute, Audit, Visualize, Interactive, Parallel agents, Triage, Codify) are already plain |
| `Showing 12 of 157` (`app/main.js:158`)                                                                                  | `12 of 157 prompts match`                                                                                    | Sentence form reads better in a live region [14]                                                                                               |
| `No prompts match` / `Try a shorter query, fewer pattern chips, or another branch of the tree.` (`app/results.js:11-12`) | `No prompts match "hardenng".` / `Try fewer words, a different spelling, or clear the type-of-work filters.` | Restate the query and offer concrete recoveries [36]                                                                                           |
| `No prompts in this branch yet.` (`app/results.js:15`)                                                                   | `Nothing in this branch yet. Pick another topic, or search all 157 prompts.`                                 | Distinguishes empty data from filtered-out data and offers a path [35]                                                                         |
| `Copy link` → `Link copied` (`index.html:82`, `app/main.js:273`)                                                         | Keep, and announce the result via `role="status"`                                                            | The text change is a status message [14]                                                                                                       |

Two vocabulary cautions. First, do not rename the seven patterns without
checking the prompt data: the labels appear on every card, and the card tag is
the reader's only summary of what kind of help to expect. Second, "prompt" is
the one piece of jargon the deck cannot avoid; explain it once in the "How to
use" disclosure ("a prompt is the instruction you paste into an AI assistant")
rather than replacing it everywhere.

---

## Risks and how to avoid them

| Risk                                             | Why it happens                                                                                                                            | Avoidance                                                                                                                                                                               |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Onboarding creeps back in**                    | A new contributor sees a confusing screen and adds a tour, because tours feel like the fix. [31][33]                                      | Make the default view and the empty states the designated teaching surface; state in the README that tours are out of scope, with the study numbers. [33]                               |
| **"Start here" becomes a scope trap**            | A curated default is a scope the user did not choose, which is the failure NN/g calls the worst offender in scoped search. [38]           | Show the subset explicitly ("12 of 157, chosen for a first look"), keep "Browse all 157" adjacent, never apply the curated set when a hash is present.                                  |
| **Two sources of truth for the same number**     | `157` is written into `index.html:41` and the README while the app derives it from `ROWS.length`.                                         | Render every count from data; delete literal totals from markup and docs, or generate them.                                                                                             |
| **Focus lost on every chip click**               | `renderFacets` replaces its subtree on each render (`app/facets.js:13`). [4][6]                                                           | Update chips in place, or restore focus by `data-pat` after render. Verify by tabbing to a chip and pressing Space.                                                                     |
| **Closed drawer is keyboard-reachable**          | `transform` moves paint, not focus or the accessibility tree (`styles/layout.css:96-107`). [8]                                            | `inert` the closed sidebar; focus the panel on open and the opener on close; `100dvh`.                                                                                                  |
| **Shortcut conflicts with assistive technology** | `/` is a printable-character shortcut with no off switch (`app/main.js:340-342`). [11][23]                                                | Drop `/`; keep `Ctrl/Cmd+K`; document it next to the box.                                                                                                                               |
| **Status announcements become noise**            | Adding `aria-live` to the visible count announces on every keystroke. [14]                                                                | One debounced `role="status"` element; announce settled counts only.                                                                                                                    |
| **Faded rows look disabled but still act**       | `opacity: 0.45` on an interactive row (`styles/tree.css:109-111`) reads as unavailable and measures 2.76:1 (light) and 3.87:1 (dark). [9] | Dim only the count badge; keep the label at body contrast.                                                                                                                              |
| **A fourth taxonomy level**                      | Growth is usually absorbed by nesting rather than by better grouping; deep hierarchies plus disclosure lose users. [30]                   | Cap at three levels; if categories exceed roughly a dozen, add a category landing view with its `summary` text. [40]                                                                    |
| **Summaries stay dead data**                     | `summary` is copied onto nodes and never rendered, so nothing forces it to stay accurate. [40]                                            | Render it; add a lint or review step requiring a `summary` on every category, subcategory and group — all 41 subcategories and 88 groups have one today, while the 8 categories do not. |
| **Print silently drops prompt bodies**           | No print stylesheet; closed `<details>` print as their summary line. [30]                                                                 | Add `open` to every prompt `<details>` on `beforeprint` (the `open` attribute is Boolean and settable from script [17]), restore afterwards.                                            |
| **Plain-language pass rewrites the data**        | "Improve the copy" gets applied to `data/prompts.js`, where the titles are product content. [16]                                          | Scope the rewrite to `index.html`, `app/results.js`, `app/facets.js` and the empty states; prompt text stays specialist.                                                                |
| **Personalisation overrides a shared link**      | Recents or a remembered view applied on load can silently replace the state encoded in the URL. [27][41]                                  | Hash wins; storage is read only when the hash is empty, and every `localStorage` access is wrapped in `try/catch`.                                                                      |

## Sources

All read on 2026-10-20.

1. W3C WAI - ARIA Authoring Practices Guide, Disclosure (Show/Hide) Pattern (button role, `aria-expanded`, `aria-controls`, Enter/Space): https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
2. W3C WAI - APG, Accordion Pattern (header button inside a heading, `aria-expanded`, `aria-controls`, region guidance, ~6-panel limit): https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
3. W3C WAI - APG, Tree View Pattern (roles, `aria-expanded`, `aria-selected`, roving focus, type-ahead recommended especially above 7 root nodes): https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
4. W3C WAI - APG, Developing a Keyboard Interface (focus persistence, focus vs selection, `tabindex`, no initial focus, shortcut caution): https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/
5. W3C WAI - Understanding SC 2.4.1 Bypass Blocks (skip links, G1/G123/G124, landmarks): https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html
6. W3C WAI - Understanding SC 2.4.3 Focus Order (sequential navigation, dynamic content, inert content behind modals): https://www.w3.org/WAI/WCAG22/Understanding/focus-order.html
7. W3C WAI - Understanding SC 2.4.7 Focus Visible (mode of operation, G149/G165/G195, C45): https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html
8. W3C WAI - Understanding SC 2.4.11 Focus Not Obscured (Minimum) (sticky headers/footers, scroll padding, C43, F110): https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
9. W3C WAI - Understanding SC 1.4.3 Contrast (Minimum) (4.5:1 body, 3:1 large, inactive-component exception, placeholder text included): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
10. W3C WAI - Understanding SC 1.4.4 Resize Text (200%, G142 zoom, relative units C12/C13/C14/C28, F94): https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
11. W3C WAI - Understanding SC 2.1.4 Character Key Shortcuts (turn off / remap / active only on focus): https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html
12. W3C WAI - Understanding SC 2.5.3 Label in Name (visible label inside accessible name, placeholder as candidate label, F96/F111): https://www.w3.org/WAI/WCAG22/Understanding/label-in-name.html
13. W3C WAI - Understanding SC 2.5.8 Target Size (Minimum) (24x24 CSS px, spacing circle, equivalent/inline/UA/essential exceptions, C42): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
14. W3C WAI - Understanding SC 4.1.3 Status Messages ("18 results returned", ARIA22 `role=status`, "chatty" caution, F103): https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html
15. W3C WAI - Understanding SC 2.3.3 Animation from Interactions (prefers-reduced-motion, C39/SCR40, vestibular harm): https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
16. W3C WAI - Understanding SC 3.1.5 Reading Level (lower secondary education, supplemental content, G86/G153): https://www.w3.org/WAI/WCAG22/Understanding/reading-level.html
17. MDN - `<details>`: the disclosure element (`open`, `name` grouping, `toggle` event, `::details-content`): https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
18. MDN - `<summary>`: disclosure summary (default label, `display: list-item`, cross-browser role inconsistency warning): https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/summary
19. MDN - `<search>`: the search landmark element (no form required for JS search, results belong in main content): https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/search
20. MDN - `aria-expanded` (buttons set `aria-controls` plus state; treeitems omit it on end nodes): https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-expanded
21. MDN - `aria-pressed` (toggle buttons; "do not change the contents of the label on a toggle when the state changes"): https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-pressed
22. MDN - `aria-current` (`page` in breadcrumbs, only one current item, non-`false` values): https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-current
23. MDN - `aria-keyshortcuts` (space-separated key combos, avoid single-character shortcuts, don't override AT/browser keys, make shortcuts discoverable): https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-keyshortcuts
24. MDN - `placeholder` attribute (never a replacement for `<label>`; lower contrast; disappears on input): https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/placeholder
25. MDN - `prefers-reduced-motion` (detects the OS setting; `reduce` semantics): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
26. MDN - `String.prototype.normalize()` (NFC vs NFD, compatibility forms appropriate for search but not display): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
27. MDN - `Window.localStorage` (`SecurityError` when the origin is invalid or persistence is blocked; `file:` behaviour undefined): https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
28. MDN - `:focus-visible` (single-colon pseudo-class; UA heuristics; keyboard-only rings): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible
29. NN/g - Progressive Disclosure (initial vs secondary split, obvious progression, two-level limit, learnability): https://www.nngroup.com/articles/progressive-disclosure/
30. NN/g - Accordions on Desktop: When and How to Use (benefits, fragmented access, discoverability, accessibility, printing, when to avoid, multi-open, expand-all): https://www.nngroup.com/articles/accordions-on-desktop/
31. NN/g - Mobile-App Onboarding: An Analysis of Components and Techniques ("skip onboarding whenever possible", interaction cost, three valid exceptions, visual customisation does not belong in onboarding): https://www.nngroup.com/articles/mobile-app-onboarding/
32. NN/g - Onboarding Tutorials vs. Contextual Help (push vs pull revelations, five guidelines for pull revelations): https://www.nngroup.com/articles/onboarding-tutorials/
33. NN/g - Mobile Tutorials: Wasted Effort or Efficiency Boost? (70 users, 4 apps, 91% vs 94% success p=0.443, SEQ 4.92 vs 5.49 p=0.047, 93.49s vs 85.17s): https://www.nngroup.com/articles/mobile-tutorials/
34. NN/g - Instructional Overlays and Coach Marks for Mobile Apps (short focused tips, avoid chains, distinct styling, scannable and sparse): https://www.nngroup.com/articles/mobile-instructional-overlay/
35. NN/g - Designing Empty States in Complex Applications: 3 Guidelines (state status, learning cues, direct pathways, in-context beats forced tutorials): https://www.nngroup.com/articles/empty-state-interface-design/
36. NN/g - 3 Guidelines for Search Engine "No Results" Pages (say it clearly, offer a path forward, don't mock; restate query, spelling, fewer words): https://www.nngroup.com/articles/search-no-results-serp/
37. NN/g - Site Search Suggestions (never suggest zero-result queries, distinguish typed vs suggested text, scope in suggestions): https://www.nngroup.com/articles/site-search-suggestions/
38. NN/g - Scoped Search: Dangerous, but Sometimes Useful (users expect whole-site search; default scope to all; state scope at the box and at the top of results; one-click expand): https://www.nngroup.com/articles/scoped-search/
39. NN/g - Breadcrumbs: 11 Design Guidelines for Desktop and Mobile (current page not a link, no empty links, no wrapping on mobile, target size, shorten on mobile): https://www.nngroup.com/articles/breadcrumbs/
40. NN/g - Information Scent: How Users Decide Where to Go Next (label, accompanying summary text, context, prior knowledge; jargon lowers scent): https://www.nngroup.com/articles/information-scent/
41. NN/g - Memory Recognition and Recall in User Interfaces (recognition beats recall; history and recents as recognition aids): https://www.nngroup.com/articles/recognition-and-recall/
42. NN/g - The Power of Defaults (42% top-hit, 34% after swap; users rarely customise, so optimise the default): https://www.nngroup.com/articles/the-power-of-defaults/
43. NN/g - Filters vs. Facets: Definitions (facets = multiple filters across dimensions; more power, more metadata cost and interaction cost): https://www.nngroup.com/articles/filters-vs-facets/
44. GOV.UK Design System - Accordion (when to use and not use, never for content all users need, no nesting, decide against tabs/details): https://design-system.service.gov.uk/components/accordion/
45. GOV.UK Design System - Details (for content only some users need; single section; less prominent than accordion or tabs): https://design-system.service.gov.uk/components/details/
46. GOV.UK content and publishing guidance - Use clear language (plain English mandatory; adult literacy figures; active voice; explain specialist terms at first use; short paragraphs and sentences): https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/
47. GOV.UK content and publishing guidance - A to Z style guide ("addressing the user", abbreviations explained at first use, active voice, words to avoid): https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide/
48. Digital.gov - Writing for understanding (shorter words, short sections, active voice, present tense, avoid hidden verbs): https://digital.gov/guides/plain-language/writing
49. Digital.gov - Plain language guide series (principles, writing, design, testing; Plain Writing Act of 2010): https://digital.gov/guides/plain-language
50. USWDS - Design principles (start with real user needs, earn trust, embrace accessibility, promote continuity, listen): https://designsystem.digital.gov/design-principles/
51. USWDS - Typography (16px effective body size, 45-90 character measure, line height at least 1.5 for long text, token-based typesetting): https://designsystem.digital.gov/components/typography/
52. MDN - `inert` global attribute (removes element and descendants from tab order and accessibility tree; cannot be focused or clicked; hidden from assistive technology): https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert
53. W3C WAI - Understanding SC 1.3.1 Info and Relationships (structure conveyed by presentation must be programmatically determinable; H42 headings, G141 organising with headings, ARIA26 `aria-current`): https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html
54. W3C WAI - Understanding SC 2.4.6 Headings and Labels (headings and labels must describe topic or purpose when provided): https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels.html

Repo files consulted: `index.html`, `app/main.js`, `app/tree.js`, `app/facets.js`,
`app/results.js`, `app/search.js`, `app/state.js`, `app/url.js`, `app/catalog.js`,
`data/taxonomy.js`, `styles/tokens.css`, `styles/base.css`, `styles/layout.css`,
`styles/tree.css`, `styles/controls.css`, `styles/cards.css`, `README.md`.
