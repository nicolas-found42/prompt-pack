# Prompting techniques in “Your prompts kinda suck” (Theo, t3.gg): what the deck already covers and the two records it does not

> Location note: this file lives in `docs/`, alongside
> `docs/visual-appeal-browsing.md`, `docs/visual-structure-scaling.md` and
> `docs/css-organization.md`. It is a READ-ONLY research note: it specifies
> candidate prompt records and a taxonomy change, but implements none of them.
> Written 2026-10-21. Read for this note: the deduplicated transcript
> (`/tmp/prompts-suck/transcript_timed.txt`, 57 chunks; 6,810 transcript words) and the
> raw WebVTT (`/tmp/prompts-suck/m-B3jIMMmUE.en.vtt`) for quote verification;
> in the repo, `data/prompts/coding.js` (27 records, `1.1`–`1.27`),
> `data/prompts/index.js`, `data/prompts/meta.js` (26 records, `5.1`–`5.26`),
> `data/prompts/general.js`, `data/prompts/evaluation.js`,
> `data/prompts/operations.js`, `data/prompts/agency.js`, and the Coding, Meta,
> Agency, Evaluation and Operations sections of `data/taxonomy.js`.

## Question and verdict

**Question:** Does the video contain at least one coding-prompt technique that is
(a) explicitly stated in the transcript, (b) verifiably absent or materially
under-specified in the existing deck (all categories), and (c) specific enough to
state as a distinct prompt record with use conditions and failure modes?

**Verdict: yes — 2 of 15 candidates pass: one explicitly stated (`1.28`), one
labeled extrapolation (`1.29`).**

One technique is stated outright and has no counterpart anywhere in the deck:
having the agent resolve the _current_ version of its own playbook from a canonical
location before executing, instead of following the snapshot embedded in the
prompt ([16:46](https://youtu.be/m-B3jIMMmUE?t=1006)). A second — granting an
explicit long-horizon effort budget so the agent stops trading depth for
latency — passes but only as a labeled **Extrapolation**: the speaker states the
human-side posture (“run the thing in the background … it doesn’t matter that much
how long things take”, [10:25](https://youtu.be/m-B3jIMMmUE?t=625)) and never
phrases it as an instruction to the agent. Everything else in the video is
already in the deck, often near-verbatim: the transcript’s own sequence
(tool-call audit, context-window visualizer, capability introspection,
cross-harness cloning, post-mortem interrogation, prompt critique) maps
one-to-one onto Meta `5.1`–`5.8`, and the playbook and blindness segments map
onto Coding `1.1`–`1.5`. This is the honest headline: the video is largely a
restatement of the deck, and only two edges of it are unwritten.

## Method and evidence quality

- **Source.** Auto-generated English captions (`.en.vtt`), 7,472 lines of rolling
  three-line cues. The timed transcript collapses the overlapping cues into 57
  contiguous chunks of ~120 words keyed to the chunk-start second; it covers
  00:00–31:34 with no gaps. 6,810 transcript words total (the timed file adds
  57 timestamp tokens, for 6,867 whitespace tokens).
- **Dedupe.** WebVTT repeats each line up to three times as the caption scrolls;
  the timed file was compared against the raw cues for every quote used here, so
  no claim rests on a duplicated or half-truncated line.
- **Quote policy.** Only short fragments are quoted, checked against the VTT with
  caption tags (`<00:00:00.000><c>`) stripped. Links point at the second the
  claimed words begin, not at the chunk start; section-level claims (sponsor,
  thesis, career commentary) are linked at the chunk start because no single
  sentence carries them.
- **What could not be verified.** (1) On-screen prompt text: the speaker shows a
  triage prompt and a `.macroscope` file, but the transcript only paraphrases
  what they say — no exact wording can be recovered. (2) Product behavior: every
  demonstration is inside T3 code / T3 CLI / Macroscope, so claims like “this
  feature … could be five lines of code and then 30 lines of markdown”
  ([17:38](https://youtu.be/m-B3jIMMmUE?t=1058)) are assertions, not evidence.
  (3) ASR noise: “Quad Coder Codex” (17:38 segment), “61 Soul” (12:15), “dot”
  (23:08+), “Lakebed” (02:06) are not reliably decodable; model names
  (“Opus 5.5”, “Grok 4.7”, “GPT-6 Astra”) may be ASR artifacts or simply a
  near-future frame. None of the accepted specs depends on them.
- **Bias.** Single creator promoting his own product, with a paid segment at
  [01:40](https://youtu.be/m-B3jIMMmUE?t=100) – [03:29](https://youtu.be/m-B3jIMMmUE?t=209).

## Technique inventory

| #   | Timestamp                                                                                   | Technique (paraphrase)                                                                                                                                   | Short quote                                      | Type          |
| --- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------- |
| T1  | [05:45](https://youtu.be/m-B3jIMMmUE?t=345)                                                 | Audit historical tool calls for environment-specific failure clusters (Bash syntax failing under Zsh), then fix the environment rather than re-prompting | “compatible with Zsh”                            | Direct        |
| T2  | [05:56](https://youtu.be/m-B3jIMMmUE?t=356)                                                 | Ask for a per-tool-call duration breakdown, scoped to one machine                                                                                        | “break down how long my tool calls take”         | Direct        |
| T3  | [09:36](https://youtu.be/m-B3jIMMmUE?t=576)                                                 | Ask for a context-window breakdown rendered as a visualizer                                                                                              | “Break down my current context window”           | Direct        |
| T4  | [07:43](https://youtu.be/m-B3jIMMmUE?t=463)                                                 | Ask for the information directly instead of building a feature that surfaces it                                                                          | “They’re information.”                           | Direct        |
| T5  | [16:30](https://youtu.be/m-B3jIMMmUE?t=990)                                                 | Put a whole branching multi-stage flow into one prose playbook and let the model hold the state                                                          | “a single giant prompt”                          | Direct        |
| T6  | [17:53](https://youtu.be/m-B3jIMMmUE?t=1073)                                                | Move an expensive UI affordance (image paste, routing) into the agent’s own question                                                                     | “ask you to paste the image instead”             | Direct        |
| T7  | [19:14](https://youtu.be/m-B3jIMMmUE?t=1154)                                                | Ask what diagnostic data the agent lacks and how it would expose it                                                                                      | “how would you recommend we introduce that data” | Direct        |
| T8  | [20:09](https://youtu.be/m-B3jIMMmUE?t=1209) / [20:30](https://youtu.be/m-B3jIMMmUE?t=1230) | Have the agent inventory its own capabilities, then clone the gaps from a stronger harness                                                               | “Clone as much of this as you can.”              | Direct        |
| T9  | [21:20](https://youtu.be/m-B3jIMMmUE?t=1280)                                                | After a miss, interrogate why and ask which tool would have prevented it                                                                                 | “What tool would be helpful”                     | Direct        |
| T10 | [21:34](https://youtu.be/m-B3jIMMmUE?t=1294)                                                | Prompt about prompts, programs, systems and questions                                                                                                    | “You can prompt about your prompts”              | Direct        |
| T11 | [13:14](https://youtu.be/m-B3jIMMmUE?t=794)                                                 | Convert instructions you keep repeating into skills / `CLAUDE.md` rules                                                                                  | “saying the same thing over and over”            | Direct        |
| T12 | [16:46](https://youtu.be/m-B3jIMMmUE?t=1006)                                                | Make the agent fetch the current playbook from a canonical link before following it                                                                      | “check for a newer playbook”                     | Direct        |
| T13 | [10:25](https://youtu.be/m-B3jIMMmUE?t=625)                                                 | Grant a long-horizon effort budget and stop expecting a fast return                                                                                      | “run the thing in the background”                | Extrapolation |
| T14 | [12:05](https://youtu.be/m-B3jIMMmUE?t=725)                                                 | Name the model per delegate role in prose instead of building a selector                                                                                 | “what’s choosing what sub agent to use”          | Direct        |
| T15 | [17:16](https://youtu.be/m-B3jIMMmUE?t=1036)                                                | Extraction policy for support flows: solid repro steps, scrub secrets, prefer duplicates                                                                 | “prefer duplicates over new issues”              | Direct        |

T13’s inference chain: the speaker states only a human posture (background run,
no need for an immediate answer) and a finding from the audit (“one home
directory search lasted 41.7 minutes”, [09:13](https://youtu.be/m-B3jIMMmUE?t=553)).
The inference is that a default agent truncates investigation to return quickly,
so the budget has to be granted in the prompt rather than assumed from the
harness. No sentence in the video says “tell the agent it may take an hour”.

## Coverage analysis

“Covered” means an existing record already instructs the same behavior, even when
worded differently.

| #   | Technique                                          | Existing record(s)                                                                                                                                                                                                                                                       | Verdict                |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| T1  | Environment-specific tool-call failure audit       | `5.1` Environment & Tool-Call Latency Audit — text explicitly asks for “syntax mismatches with our local shell or OS environment”                                                                                                                                        | Covered                |
| T2  | Tool-call duration breakdown                       | `5.1` Environment & Tool-Call Latency Audit                                                                                                                                                                                                                              | Covered                |
| T3  | Context-window visualizer                          | `5.2` Context Window & Payload Visualizer                                                                                                                                                                                                                                | Covered                |
| T4  | Information instead of a feature                   | `1.1` Outcome Over Feature Implementation; `1.5` Primitive & Agent-Surface Architecture Audit; `4.1` Direct Outcome Execution                                                                                                                                            | Covered                |
| T5  | One playbook replaces a branching flow             | `1.4` Interactive Triage Playbook Conversion                                                                                                                                                                                                                             | Covered                |
| T6  | Delegate the UI affordance to the agent’s question | `1.4` (“asks them to paste screenshots or logs directly if helpful”)                                                                                                                                                                                                     | Covered                |
| T7  | Ask what data is missing and how to expose it      | `1.2` Observability & Blind-Spot Audit — same question, nearly verbatim                                                                                                                                                                                                  | Covered                |
| T8  | Capability inventory + clone from another harness  | `5.3` Full Capability & Harness Introspection; `5.4` Cross-Environment Capability Diff & Cloning                                                                                                                                                                         | Covered                |
| T9  | Post-miss “why, and what tool would help”          | `5.5` Post-Mortem Failure & Omission Interrogation                                                                                                                                                                                                                       | Covered                |
| T10 | Prompt about prompts                               | `5.8` Prompt & Mindset Elevation Critique                                                                                                                                                                                                                                | Covered                |
| T11 | Repetition → skill                                 | `5.7` Recurring Instruction to Skill & Memory Codification; `1.11` Review Feedback & Convention Codification                                                                                                                                                             | Covered                |
| T12 | Resolve the current playbook before executing      | none — `1.4` only _creates_ a playbook; `5.9`/`5.19` prune instruction files; `5.24` tests whether a skill changes outcomes                                                                                                                                              | **Gap**                |
| T13 | Explicit long-horizon effort budget                | none — `1.8` demands live verification but says nothing about duration; `5.23` audits cost but grants no budget                                                                                                                                                          | **Gap** (extrapolated) |
| T14 | Name the model per role in prose                   | `1.6` supplies the delegation; `1.5` already says to strip static controls in favour of primitives, and `1.1` says to ask for the outcome. What remains is a model-name parameter, not a behavior, and encoding model names would rot faster than the delegation pattern | Partial                |
| T15 | Repro / secrets / duplicate-issue policy           | `1.4` (repro steps, duplicate issue); `4.6` Pre-Share Privacy & Secret Scrubbing                                                                                                                                                                                         | Covered                |

Note on `1.4`: its full text already ends “drafts a clean report on an existing
issue rather than creating a duplicate”, so T15 contributes nothing new.

## Accepted prompt specs

Two records. `order` is a dense, unique `1..237` sequence in the current deck
(verified: no gaps or duplicates), so new records append at `238` and `239`; ids
continue at `1.28`.
Both `pattern` values stay inside the deck’s existing nine-value vocabulary.

### 1.28 — Live Playbook Refresh Before Execution

```yaml
order: 238
id: "1.28"
title: "Live Playbook Refresh Before Execution"
purpose: "Make the agent resolve the current version of its own playbook from the canonical source before following it, so a prompt or skill snapshot cannot silently freeze stale procedure."
text: "Before you follow the playbook embedded in this prompt, fetch the current version from its canonical location and treat that copy as authoritative. Report the version or commit you loaded, and name any step that differs from what this prompt describes. If the source is unreachable, say so and continue with the embedded copy rather than improvising. Then execute the refreshed playbook end to end, and tell me which version of the instructions produced the result."
words: 76
pattern: "Execute"
session: "fresh"
tags: ["fresh-session"]
```

**Why it is new.** The deck can create a playbook (`1.4`), co-design one
(`5.14`), prune and merge instruction files (`5.9`, `5.19`), and test whether a
skill changes outcomes (`5.24`). No record tells the agent that the copy in front
of it may be stale, or that authority should transfer to a fetched version. The
closest sentence in the deck — `1.4`’s “checks the source code and upstream issue
tracker” — is about the _bug_ being fixed upstream, not about the instructions.

**Use when.** The playbook lives in a repository or docs site that ships faster
than the prompt using it: nightly/canary builds, a shared team runbook, an
open-source triage flow whose steps change with releases. Also when the same
skill is invoked from several harnesses and only one copy is current.

**Failure mode.** The fetch can fail, or return content that was never reviewed —
an instruction channel an attacker can write to. Version reporting decays into
ceremony the agent skips under context pressure. In a sandbox without network,
the “canonical” source is unreachable by design. Mitigations baked into the text:
name a specific location rather than a search, fall back explicitly to the
embedded copy, and report the version so drift is visible. Do not apply this to a
playbook that is _supposed_ to be pinned to a release.

**Provenance.** [16:46](https://youtu.be/m-B3jIMMmUE?t=1006) — “check for a newer
playbook”; [16:50](https://youtu.be/m-B3jIMMmUE?t=1010) — “I have the playbook
linked in case it updates so that it gets new info if you’re on nightly or
whatever”; [15:47](https://youtu.be/m-B3jIMMmUE?t=947) — “I tell the model to
follow the playbook below”.

### 1.29 — Long-Horizon Effort Mandate

```yaml
order: 239
id: "1.29"
title: "Long-Horizon Effort Mandate"
purpose: "State in the prompt that a slow, exhaustive answer is acceptable and a fast partial one is not, so the agent stops sizing its investigation to an imagined latency budget."
text: "You are not being timed, and a slow answer is better than a shallow one. Treat this as a long-horizon task: run the exhaustive search, the full trace, or the complete sweep instead of sampling a few paths and returning early. Do not stop to ask whether you should continue, and do not hand back a partial result just to look responsive. If a step will take a long time, start it, keep working on what you can in parallel, and report once with the finished result and its evidence."
words: 90
pattern: "Execute"
session: "fresh"
tags: ["fresh-session"]
```

**Why it is new.** Every record in the deck that touches effort pushes the other
way: `1.8` wants live verification _now_, `5.23` wants a cheaper operating mode,
`5.20` wants a fast verification loop. None grants duration. The absence matters
because the agent’s default is to return something plausible before the turn gets
expensive, which is exactly the failure the video reports fixing by asking for an
audit and then not waiting on it.

**Use when.** Audits and sweeps where a missed path is worse than a slow answer
(bill attribution, dead-code sweeps, cross-session failure mining); background
runs you will not watch; one-off investigations whose output is a report rather
than a patch.

**Failure mode.** Unbounded runtime and token burn — this record is the natural
opponent of `5.23`. “Not timed” can be read as license to loop, and a long run can
outlive the session or the sandbox. Pair it with a stopping condition or a hard
cap, and keep the mandate scoped to the investigation rather than to the
verification loop that follows.

**Provenance.** [10:25](https://youtu.be/m-B3jIMMmUE?t=625) — “run the thing in
the background and then let it pop up when it’s ready”; [10:30](https://youtu.be/m-B3jIMMmUE?t=630) —
“it doesn’t matter that much how long things take as long as you don’t expect it
or need it immediately”; [09:13](https://youtu.be/m-B3jIMMmUE?t=553) — “one home
directory search lasted 41.7 minutes”. **Label: Extrapolation** (see T13’s
inference chain). This spec should be reviewed before acceptance; `1.28` stands
on its own.

## Proposed taxonomy placement

A new subcategory is justified, appended last in Coding so existing ids and order
are untouched:

```yaml
name: "Execution Posture"
summary: "Set the conditions of a run: which instructions are current, and how much time the work deserves"
groups:
  - name: "Instruction Freshness"
    summary: "Resolve the current playbook before executing an older copy"
    ids: ["1.28"]
  - name: "Effort Budgets"
    summary: "Grant depth and duration explicitly instead of accepting the default fast answer"
    ids: ["1.29"]
```

Why not an existing subcategory. Every Coding subcategory partitions _task
content_: what to build, how to explore architecture, what to prune, how to
review. Neither record carries task content; both are preconditions on any task.
The two closest homes fail on inspection. `Workspace Hygiene → Lasting
Conventions` is summarized as “Distill review corrections and shell one-offs into
lasting repo rules” — that is production of rules, and `1.28` is about resolving
them at execution time. `Outcome Framing → Prebuild Checks` questions what is
being built, not how long the run may take, so `1.29` has no home there or
anywhere else. A single group would also mislead: freshness and effort budgets
are independent knobs, and the second would inherit a summary that does not
describe it.

## Rejected or already-covered candidates

| Candidate                                                                                                         | Timestamp                                                                                                                                | Reason rejected                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Path-scoped markdown review agent (`.macroscope` file: model, tools, include/exclude globs, skip test-only diffs) | [02:58](https://youtu.be/m-B3jIMMmUE?t=178)                                                                                              | Sponsor segment. A real technique, but it is presented only as product usage, and `1.11` already codifies repeated review corrections into repo rules; the path-glob scoping is a configuration detail of that behavior, not a new prompt. For a deck record it would need non-sponsor provenance. |
| Replace an internal dashboard’s button surface with a conversational meta-thread                                  | [08:47](https://youtu.be/m-B3jIMMmUE?t=527)                                                                                              | Covered in substance by `1.1` (outcome over feature) and `1.5` (strip static control surfaces, build primitives). The conversational form is an interface detail, not a new prompting behavior.                                                                                                    |
| Name the model per delegate role in prose                                                                         | [12:05](https://youtu.be/m-B3jIMMmUE?t=725)                                                                                              | `1.6` already spawns delegates, and `1.5` already says to strip static controls in favour of primitives. What remains is a model-name parameter, not a behavior, and encoding model names would rot faster than the delegation pattern.                                                            |
| Connect the agent to an inbox; standing watch rules (“look out for emails from …”)                                | [23:08](https://youtu.be/m-B3jIMMmUE?t=1388)                                                                                             | Not a coding technique, and the watch behavior depends on a specific consumer product. Adjacent coverage exists in `4.3` (inbox triage) and `5.13` (harness onboarding).                                                                                                                           |
| “Get out of your terminals” / terminal ergonomics                                                                 | [19:24](https://youtu.be/m-B3jIMMmUE?t=1164)                                                                                             | Opinion, not a repeatable prompting behavior.                                                                                                                                                                                                                                                      |
| Prompt engineering is “all crap”; engineers over-engineer prompts                                                 | [00:00](https://youtu.be/m-B3jIMMmUE?t=0)                                                                                                | Thesis about the field, not a technique. It motivates the deck’s existing outcome-first records rather than adding one.                                                                                                                                                                            |
| Engineering is getting more fun / “brain rot” rebuttal / career trough                                            | [24:54](https://youtu.be/m-B3jIMMmUE?t=1494), [28:25](https://youtu.be/m-B3jIMMmUE?t=1705), [30:18](https://youtu.be/m-B3jIMMmUE?t=1818) | Industry and career commentary; explicitly out of scope for a prompt record.                                                                                                                                                                                                                       |
| “Managing your context yourself doesn’t matter” (70k-token injection unnoticed)                                   | [10:03](https://youtu.be/m-B3jIMMmUE?t=603)                                                                                              | An anti-technique that contradicts `5.2`/`5.23` as a general rule. The underlying observation (hidden injections are invisible in the prompt) is already the reason `5.2` exists.                                                                                                                  |
| Build an inline visualizer as a product primitive                                                                 | [27:18](https://youtu.be/m-B3jIMMmUE?t=1638)                                                                                             | Covered: `1.5` already names “inline rendering capabilities” among the primitives worth building.                                                                                                                                                                                                  |

## Risks

- **ASR error.** Captions are machine-generated; “Ripgrep”, “Quad Coder Codex”,
  “61 Soul”, “dot” and the model names are visibly unreliable. Every quote here
  was checked against the VTT, but a checked quote can still be a mis-transcribed
  sentence. `1.28` rests on one short clause; if the clause is garbled beyond
  “check for a newer playbook”, the gap weakens.
- **Single-creator bias.** All evidence comes from one person demoing one
  product. The techniques are cheap to state and expensive to verify, and the
  video never shows a controlled comparison. The strongest-sounding claim (“five
  lines of code and then 30 lines of markdown … works way better”) is an
  assertion.
- **Staleness of the source deck.** Meta `5.1`–`5.8` and Coding `1.1`–`1.4`
  appear to have been written from this same talk. That is why the gap is narrow,
  and it also means a future deck revision could close `1.28` by amending `1.4`
  instead of adding a record — a legitimate alternative this note does not take,
  because `1.4` is about authoring a playbook and the refresh behaviour applies to
  playbooks that already exist.
- **Overlap and marginality.** `1.29` is the weak one. A strict reader can call it
  a long-winded restatement of `1.8` (run the thing and verify) or of `1.7` (go
  deep). The distinction it claims is a _budget_, not a behavior, and that is
  exactly the kind of distinction that decays into boilerplate. If only one record
  is accepted, accept `1.28`.
- **Copyright and originality.** Only short fragments are quoted, each tied to a
  timestamp; no passage is reproduced at length. The proposed `text` fields are
  original repo voice, not transcript text. The techniques themselves are ideas
  and are not protectable, but the note should not be read as a transcript
  substitute — it deliberately does not reproduce the demonstrations.
- **Claims the transcript does not support.** That the agent “will” build a
  visualizer unprompted; that a 41.7-minute search was productive rather than
  wasteful; that a five-line entrypoint plus a markdown file outperforms a coded
  workflow. All are anecdotes. No accepted spec depends on them.

## Sources

- Video: <https://www.youtube.com/watch?v=m-B3jIMMmUE> — “Your prompts kinda
  suck”, Theo (t3.gg), ~31:34.
- Transcript artifacts: `/tmp/prompts-suck/transcript_timed.txt` (57 chunks;
  6,810 transcript words), `/tmp/prompts-suck/m-B3jIMMmUE.en.vtt` (7,472 lines,
  auto captions). Quote timestamps re-derived from the VTT with caption tags
  stripped.
- Repo files read: `data/prompts/coding.js`, `data/prompts/index.js`,
  `data/prompts/meta.js`, `data/prompts/general.js`,
  `data/prompts/evaluation.js`, `data/prompts/operations.js`,
  `data/prompts/agency.js`, `data/taxonomy.js` (Coding, Meta, Agency,
  Evaluation, Operations), `docs/visual-appeal-browsing.md` (header
  convention).
