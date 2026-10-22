# Deterministic Rust prompt generator: research evidence and precedents

> Research note. Written 2026-10-22. Research only; no code, tests, builds, or LLM/JeV calls.
> Companion to `docs/prompt-research/research.md` (prompt-evaluation dimensions) and
> `docs/coding-prompt-gap-analysis.md`. This note focuses on _generators/templates/builders_
> that affect a deterministic, code-only prompt generator with a simple browser UI and no
> LLM/JeV at runtime.

## Scope, method, and screening

**Question.** What evidence and precedents exist for a _deterministic_ prompt generator
(no model at runtime) — specifically instruction-following constraints, output/format
robustness, ambiguity/clarification, task-matched decomposition, verification, and
instruction hierarchy — and which first-party repos/awesome lists are _actual generators_
rather than prompt collections?

**Working definition.** A deterministic prompt generator is a program that assembles a
prompt string from structured inputs (task, constraints, examples, output schema, etc.)
without any LLM call at runtime. It is code-only: templates + variables + validation.

**Selection.** I inspected 8 primary arXiv papers, 4 first-party GitHub repositories,
and 2 awesome lists. Web content is treated as data; no instructions in sources were
followed. Evidence labels: `[EMPIRICAL]` measured result; `[RECOMMENDATION]` design rule
synthesized; `[INFERENCE]` beyond what was measured.

**Empirical basis caveat.** All cited papers evaluate LLM behavior with prompts, not
deterministic generators. Their findings are existence proofs / design guidance for
_what prompts should contain_, not validation that a generator produces better outcomes.
See "What the evidence does not establish."

## Primary arXiv evidence

### 1. Instruction following and constraint composition

**IFEval (Zhou et al., 2023)** arXiv:2311.07911 — https://arxiv.org/abs/2311.07911
25 verifiable instruction types, 541 prompts. `[EMPIRICAL]` GPT-4 strict prompt-level
accuracy 76.89% (instruction-level 83.57%); PaLM 2 S 43.07% (55.76%) (Table 3). The
prompt/instruction gap is the signature of multi-constraint failure. Verifiable
instructions are a narrow subset; loose metric trades FN for FP (§1, §2.2, §4).

**FollowBench (Jiang et al., 2024)** arXiv:2310.20410 — https://arxiv.org/abs/2310.20410
5 constraint types × 5 cumulative levels, 820 instructions, 13 LLMs. `[EMPIRICAL]`
GPT-4 hard satisfaction 84.7% (L1) → 61.9% (L5) (avg 73.4%; consistent level 3.3);
GPT-3.5 80.3% → 53.2% (§4.2). LLM-judge dependence is a limitation (§6).

**ComplexBench (Wen et al., 2024)** arXiv:2407.03978 — https://arxiv.org/abs/2407.03978
4 types, 19 dimensions, 4 composition types (Single/And/Chain/Selection), 1,150
instructions. `[EMPIRICAL]` GPT-4 fails ~20% of complex instructions; overall 0.800;
Selection 0.675; Chain avg 0.766; Chain/Selection harder than And (§5.2.2, Table 5).

**Implication for a generator.** Constraint count and composition reduce compliance.
A deterministic generator should enumerate constraints, give numeric limits, and
expose must/should/may priority. It should not pile on constraints; keep the output
schema minimal and machine-checkable. `[RECOMMENDATION]`

### 2. Output/format robustness

**FormatSpread (Sclar et al., 2024)** arXiv:2310.11324 — https://arxiv.org/abs/2310.11324
Grammar of descriptors/separators/casing/itemization over 53 Super-NI tasks.
`[EMPIRICAL]` Median spread 7.5 accuracy points across 10 formats; 20% of tasks ≥15 pts
spread (≥9 Falcon); worst case 76 pts (LLaMA-2-13B); model comparisons can reverse
(prob 0.141 for 13B/70B) (§4.2, §4.3). Atomic single-constant changes move accuracy
≥5 pts in 24% of cases (§4.3). Report ranges; a single format can be a valid
engineering choice for a deployed system (§6).

**Lost in the Middle (Liu et al., 2024)** arXiv:2307.03172 — https://arxiv.org/abs/2307.03172
`[EMPIRICAL]` U-shaped position curve: relevant info at start/end used better than
middle; GPT-3.5-Turbo can drop >20%; worst position can fall below closed-book 56.1%
(§2.3, Figure 5). Beyond 20 retrieved docs gains saturate (~1.5% GPT-3.5) (§5).

**Implication.** A generator should emit stable delimiters, stable section order, and
restated key instructions at boundaries; avoid burying constraints mid-context.
For deterministic code, this means a fixed template skeleton with deterministic
ordering, not model-dependent formatting. `[RECOMMENDATION]`

### 3. Structured output / constrained decoding (runtime-side, for consumers)

**Efficient Guided Generation (Willard & Louf, 2023)** arXiv:2307.09702 —
https://arxiv.org/abs/2307.09702 — FSM over vocab index; enforces regex/CFG at decode
time; "guaranteeing the structure of the generated text"; implementation in Outlines
(Python). `[EMPIRICAL]` Adds little overhead and outperforms existing solutions (abstract).

**JSONSchemaBench (Geng et al., 2025)** arXiv:2501.10868 — https://arxiv.org/abs/2501.10868
10K real-world JSON schemas; 6 constrained-decoding frameworks. `[EMPIRICAL]` Covers
declared/empirical coverage and compliance; real-world schemas remain a challenge; naive
grammar-constrained decoding can distort toward syntactically valid but semantically
degraded outputs (Park et al. 2024, cited); structured format constraints can degrade
reasoning (Tam et al. 2024, cited).

**Implication for a code-only generator.** Constrained decoding solves _structural_
validity at runtime; it does not solve semantic correctness. A deterministic
generator should therefore (a) emit a schema the consumer can enforce, and (b) keep
semantic acceptance checks explicit and separate from syntax. Do not conflate "valid
JSON" with "correct answer." `[RECOMMENDATION + INFERENCE]`

### 4. Prompt-as-program / deterministic compilation (precedents)

**LMQL (Beurer-Kellner et al., 2023)** arXiv:2212.06094 — https://arxiv.org/abs/2212.06094
Language Model Programming: text prompting + scripting + constraints over output;
minimizes expensive LLM calls (26-85% cost savings). `[EMPIRICAL]` Captures
state-of-the-art prompting methods including interactive flows (abstract, §).

**DSPy (Khattab et al., 2023)** arXiv:2310.03714 — https://arxiv.org/abs/2310.03714
Abstraction of LM pipelines as text-transformation graphs; compiler optimizes
declarative modules. `[EMPIRICAL]` Succinct programs self-bootstrap pipelines
outperforming standard few-shot by 25-65% (GPT-3.5/llama2-13b) (abstract).

**Implication.** Both systems separate _prompt structure_ from _model execution_ and
compile deterministically. A Rust generator can adopt the same separation: a
deterministic template compiler (Rust) + optional runtime consumer. The "no LLM at
runtime" constraint is consistent with LMQL/DSPy's compile-time structure, minus the
optimization loop (which requires a model). `[INFERENCE]`

### 5. Ambiguity and clarification

**AmbigQA (Min et al., 2020)** arXiv:2004.10645 — https://arxiv.org/abs/2004.10645
`[EMPIRICAL]` >50% of dev/test questions have multiple plausible QA pairs; ambiguity
sources include entity/event/property/answer-type references (§4.2). Ambiguity often
invisible until research (§4.2).

**CLAM (Kuhn et al., 2023)** arXiv:2212.07769 — https://arxiv.org/abs/2212.07769
`[EMPIRICAL]` +~20 pts adjusted accuracy on 200 TriviaQA pairs; correct clarifying
question in 84-99% of cases; models _detect_ ambiguity but rarely ask unless prompted;
always-asking penalizes unambiguous questions; generic "ask if unclear" yields only
moderate improvement (§5.1.1, §5.1.2).

**Implication.** A generator should support an explicit ambiguity/clarification
section with triggers, a question budget, and a fallback (assume/abort) for when no
user is available. Default to "state assumptions and proceed" for non-interactive
runs. `[RECOMMENDATION]`

### 6. Verification and recovery

**CoVe (Dhuliawala et al., 2023)** arXiv:2309.11495 — https://arxiv.org/abs/2309.11495
`[EMPIRICAL]` Precision 0.17→0.36 (Wikidata lists); F1 0.39→0.48 (MultiSpanQA);
FactScore 55.9→71.4 (bios). Factored verification (no draft in context) beats joint
(63.7 vs 60.8); cross-check step →71.4 (§4.3). Standard CoT and instruction tuning
did not reduce hallucination (§4.3).

**Self-Refine (Madaan et al., 2023)** arXiv:2303.17651 — https://arxiv.org/abs/2303.17651
`[EMPIRICAL]` ~20% absolute improvement avg over 7 tasks/3 models; GPT-4 code opt
27.3%→36.0%; dialogue 25.4%→74.6% (§3.3, Table 1). Actionable feedback 43.2 vs
generic 31.2 vs none 0 (§4, Table 2). Math: ~0 gain (64.1→64.1 etc.) (§3.3, §6).

**RARR (Gao et al., 2023)** arXiv:2210.08726 — https://arxiv.org/abs/2210.08726
`[EMPIRICAL]` Attribution +13% absolute while changing 10-20% of text; only method
preserving intent >90% (baselines 6-40%); human oracle 93.6 AIS at 88% preservation (§5.3, §6.1).

**Implication.** Verification must be _independent_ (sub-queries without the draft),
_specific_ (actionable checks), with an explicit pass/fail threshold and a
retry/ask/abstain/escalate path. Generic "check your work" is weak. A deterministic
generator should emit a verification section with named checks and a fallback path.
`[RECOMMENDATION]`

### 7. Decomposition

**Least-to-most (Zhou et al., 2023)** arXiv:2205.10625 — https://arxiv.org/abs/2205.10625
`[EMPIRICAL]` Last-letter concat: 94.0% (len 4) →74.0% (len 12) vs CoT 84.2%→31.8%;
SCAN length split 99.7% vs 16.2%; GSM8K gain concentrated on ≥5-step problems
(45.23% vs 39.07%) (Tables 4, 8, 11-12).

**Plan-and-Solve (Wang et al., 2023)** arXiv:2305.04091 — https://arxiv.org/abs/2305.04091
`[EMPIRICAL]` PS+ avg 76.7% vs zero-shot CoT 70.4% (6 datasets); variables-only
prompt 50.5% vs 56.4% CoT on GSM8K (Table 5) — mismatched scaffolding can hurt.

**Implication.** Decomposition should be task-matched with named intermediate
artifacts; generic "think step by step" is weaker and may hurt. For simple tasks,
omit decomposition (proportionality). `[RECOMMENDATION]`

### 8. Instruction hierarchy (safety)

**Instruction Hierarchy (Wallace et al., 2024)** arXiv:2404.13208 —
https://arxiv.org/abs/2404.13208 — trains privilege order (system > user > tool/web data).
`[EMPIRICAL]` Up to 63% robustness improvement, 34% generalization to held-out attacks,
comparable capability; cost is over-refusal on benign attack-like inputs (§4).

**Implication.** A generator targeting agents that read untrusted content should emit
a trust-boundary section (privilege order, treat third-party content as data, conflict
behavior, refusal boundary). This is a safety review of prompt text, not a measured
attack-success rate. `[RECOMMENDATION]`

## What the evidence does not establish

1. No study evaluates a _reusable prompt artifact_ or _generator_ across inputs/sessions;
   all evaluate prompt instances. `[INFERENCE]`
2. Structured decoding (Outlines/JSONSchemaBench) guarantees _syntax_, not semantics.
   `[EMPIRICAL]`
3. LMQL/DSPy require a model for optimization; a no-LLM-at-runtime generator keeps only
   the deterministic compilation part. `[INFERENCE]`
4. Format sensitivity (FormatSpread) means a single template cannot be assumed portable
   across models; record known sensitivities. `[EMPIRICAL]`

## GitHub projects and collections (implementation precedents)

| Repo                                                             | Type                                                                                                                                                                                                                                                                                                        | License                                    | Notes                                                                                                                                                                             |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `microsoft/PromptKit` (https://github.com/microsoft/PromptKit)   | **Composable prompt component catalog plus interactive launcher.** The CLI lists/searches manifest components; interactive assembly launches an external LLM CLI (see [CLI source](https://github.com/microsoft/PromptKit/blob/main/cli/bin/cli.js)).                                                       | MIT                                        | Useful precedent for reusable sections and input/output contracts, but not a standalone no-LLM generator.                                                                         |
| `guidance-ai/guidance` (https://github.com/guidance-ai/guidance) | **Runtime LLM-steering library** — Python DSL for constrained decoding (regex/CFG/JSON schema), control flow, and tool use; not a prompt-text builder.                                                                                                                                                      | MIT                                        | Useful consumer-side example for constrained output; requires an LLM backend.                                                                                                     |
| `stanfordnlp/dspy` (https://github.com/stanfordnlp/dspy)         | **LM-program compiler/optimizer** — declarative pipelines; prompt optimization uses a model.                                                                                                                                                                                                                | MIT                                        | Useful precedent for separating structure from execution; not no-LLM at optimization time.                                                                                        |
| `f/prompts.chat` (https://github.com/f/prompts.chat)             | **Collection plus deterministic prompt builder.** The MIT `prompts.chat` package exposes fluent role/context/task/constraints/output/variables/examples builders whose `build()` assembles text locally ([source](https://github.com/f/prompts.chat/blob/main/packages/prompts.chat/src/builder/index.ts)). | Package MIT; prompt CSV CC0; site code MIT | Strong precedent for explicit fields and deterministic assembly; unlike this tool, it does not analyze arbitrary prose into task-relative gaps and its package/CLI is Node-based. |

PromptKit is a component catalog whose interactive assembly requires an LLM CLI; Guidance steers runtime LLM generation; DSPy compiles and optimizes LM programs; prompts.chat combines a collection with a deterministic structured builder. These precedents support modular fields and explicit composition, but not semantic inference from arbitrary prose.

## Awesome lists

- `promptslab/Awesome-Prompt-Engineering` (https://github.com/promptslab/awesome-prompt-engineering) — Apache-2.0; hand-curated papers/tools/resources; includes a "prompt-generator" topic tag; 6.4k stars. Mix of collections and tools; not a generator itself.
- `ai-boost/awesome-prompts` (https://github.com/ai-boost/awesome-prompts) — GPL-3.0; it curates copy-paste prompts, frameworks, and papers. Its entries are content assets, not a deterministic composition runtime; use it as a discovery taxonomy and do not copy entries without respecting the license.

## Implementation implications for a deterministic Rust prompt generator + browser UI

1. **Fixed template skeleton with deterministic ordering** (D8/form robustness) — stable delimiters, stable section order, key instructions at boundaries. `[RECOMMENDATION]`
2. **Enumerated constraints with numeric limits and must/should/may** (D2) — avoid piling constraints; keep output schema minimal. `[RECOMMENDATION]`
3. **Explicit output schema + acceptance check** (D5) — emit a machine-checkable schema (JSON Schema) and a human-readable acceptance rubric; separate from semantic correctness. `[RECOMMENDATION]`
4. **Ambiguity section** with triggers, question budget, fallback (assume/abort) for non-interactive runs (D6). `[RECOMMENDATION]`
5. **Verification section** with independent checks, pass/fail threshold, retry/ask/abstain/escalate path (D7). `[RECOMMENDATION]`
6. **Task-matched decomposition** with named intermediate artifacts; proportionality (omit for simple tasks) (D4). `[RECOMMENDATION]`
7. **Trust boundary section** only when the target agent reads untrusted content/tools (D9). `[RECOMMENDATION]`
8. **No LLM at runtime** — deterministic string assembly; optional offline preview in browser; no optimization loop. `[INFERENCE]`
9. **Economy** — no duplicated/contradictory rules; length justified (D10). `[RECOMMENDATION]`

## Limitations

- All arXiv evidence is about LLM prompt instances, not generators; effect sizes are existence proofs. `[INFERENCE]`
- Single-reader extraction; arXiv versions as noted.
- GitHub repo metadata from public pages; license claims from repo README; verify before redistribution.
- No outcome calibration for any generator design. `[INFERENCE]`

## References

1. Zhou, J. et al. (2023). IFEval. arXiv:2311.07911. https://arxiv.org/abs/2311.07911
2. Jiang, Y. et al. (2024). FollowBench. arXiv:2310.20410. https://arxiv.org/abs/2310.20410
3. Wen, B. et al. (2024). ComplexBench. arXiv:2407.03978. https://arxiv.org/abs/2407.03978
4. Sclar, M. et al. (2024). FormatSpread. arXiv:2310.11324. https://arxiv.org/abs/2310.11324
5. Liu, N. F. et al. (2024). Lost in the Middle. arXiv:2307.03172. https://arxiv.org/abs/2307.03172
6. Willard, B. T. & Louf, R. (2023). Efficient Guided Generation. arXiv:2307.09702. https://arxiv.org/abs/2307.09702
7. Geng, S. et al. (2025). JSONSchemaBench. arXiv:2501.10868. https://arxiv.org/abs/2501.10868
8. Beurer-Kellner, L. et al. (2023). LMQL. arXiv:2212.06094. https://arxiv.org/abs/2212.06094
9. Khattab, O. et al. (2023). DSPy. arXiv:2310.03714. https://arxiv.org/abs/2310.03714
10. Min, S. et al. (2020). AmbigQA. arXiv:2004.10645. https://arxiv.org/abs/2004.10645
11. Kuhn, L. et al. (2023). CLAM. arXiv:2212.07769. https://arxiv.org/abs/2212.07769
12. Dhuliawala, S. et al. (2023). CoVe. arXiv:2309.11495. https://arxiv.org/abs/2309.11495
13. Madaan, A. et al. (2023). Self-Refine. arXiv:2303.17651. https://arxiv.org/abs/2303.17651
14. Gao, L. et al. (2023). RARR. arXiv:2210.08726. https://arxiv.org/abs/2210.08726
15. Zhou, D. et al. (2023). Least-to-most. arXiv:2205.10625. https://arxiv.org/abs/2205.10625
16. Wang, L. et al. (2023). Plan-and-Solve. arXiv:2305.04091. https://arxiv.org/abs/2305.04091
17. Wallace, E. et al. (2024). Instruction Hierarchy. arXiv:2404.13208. https://arxiv.org/abs/2404.13208
18. Microsoft PromptKit. https://github.com/microsoft/PromptKit
19. Guidance. https://github.com/guidance-ai/guidance
20. DSPy. https://github.com/stanfordnlp/dspy
21. prompts.chat. https://github.com/f/prompts.chat
22. Awesome Prompt Engineering. https://github.com/promptslab/awesome-prompt-engineering
