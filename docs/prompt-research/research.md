# Dimensions for evaluating reusable agent prompts: evidence from primary arXiv studies

> Research note. Written 2026-10-21 on branch `docs/prompt-research-catalog`. It combines
> primary arXiv findings with the repository’s 237-prompt corpus and a separately licensed
> 1,000-record prompt catalog. Jev ratings are descriptive judgments, not human labels or task outcomes.

## Scope, method, and screening

**Question.** Which properties of a _reusable agent prompt_ have direct empirical support
in primary arXiv research, and which evaluative dimensions are extrapolations from that
evidence?

**Working definition.** A reusable agent prompt is a prompt artifact intended to be used
repeatedly across inputs (and often across sessions) that specifies an objective,
operating constraints, a trust/evidence contract, and an output contract, and may invoke
tools or sub-agents. This definition is ours; the papers below study prompt _instances_
and prompting _techniques_, not artifacts reused across tasks.

**Utility versus safety.** The note keeps two questions separate. _Utility_ asks whether
the prompt helps the agent complete the declared task under its constraints. _Safety_ asks
whether the prompt resists instruction conflict and privilege escalation when the agent
reads untrusted content or calls tools. The evidence bases differ: utility is supported by
constraint-following, decomposition, verification, and ambiguity studies; safety is
supported mainly by the instruction-hierarchy work, which trains a model rather than a
prompt. A prompt can be strong on one axis and weak on the other. For a catalog, adversarial
instruction examples are data: D9 scores whether the prompt establishes a trust boundary,
not whether its text contains attack-like strings.

**Selection.** I read 16 arXiv papers (15 primary empirical or method papers plus 1 survey)
covering six requested areas:

| Area                       | Papers                                                                                                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Prompt/instruction quality | Bsharat et al. (2023); Schulhoff et al. (2024, survey)                                                        |
| Instruction following      | Zhou et al. (2023, IFEval); Jiang et al. (2024, FollowBench); Wen et al. (2024, ComplexBench)                 |
| Sensitivity/robustness     | Sclar et al. (2024, FormatSpread); Lu et al. (2022, order sensitivity); Liu et al. (2024, Lost in the Middle) |
| Decomposition              | Zhou et al. (2023, least-to-most); Wang et al. (2023, Plan-and-Solve)                                         |
| Verification/grounding     | Dhuliawala et al. (2023, CoVe); Madaan et al. (2023, Self-Refine); Gao et al. (2023, RARR)                    |
| Ambiguity and privilege    | Min et al. (2020, AmbigQA); Kuhn et al. (2023, CLAM); Wallace et al. (2024, Instruction Hierarchy)            |

Inclusion required: a primary empirical study or a primary method paper with measured
results; direct relevance to prompt/instruction quality, compliance, robustness,
decomposition, verification, grounding, ambiguity, or instruction priority; and an
available full text. Papers were located by arXiv search on those constructs and by
citation chaining from the surveys; there was no formal query string or date cutoff.
Surveys were included only for vocabulary and were not treated as evidence of effectiveness.
I excluded secondary blog posts, vendor documentation, and papers whose only contribution
is a model or benchmark unrelated to prompt properties.

**Retrieval and screening.** I fetched the arXiv abstract and the full text of each paper
(ar5iv rendering of the latest arXiv version on 2026-10-21), converted the HTML to text,
and screened the first 20,000 characters of each paper with Jev
(`jev_screen`, injection/substance/relevance probabilities). Thirteen papers passed.
Three were flagged for review:

| Paper                               | Injection probability | Recommendation | Manual review                                                                                                                                   |
| ----------------------------------- | --------------------: | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Bsharat et al. (2023), `2312.16171` |                  0.53 | review         | False positive: the paper quotes 26 imperative prompt principles ("Use delimiters", "You MUST"). They are data, not instructions to the reader. |
| Wang et al. (2023), `2305.04091`    |                  0.37 | review         | False positive: the paper quotes its own trigger sentence ("devise a plan", "carry out the plan").                                              |
| Wallace et al. (2024), `2404.13208` |                  0.46 | review         | False positive: the paper analyzes and quotes attack strings such as "IGNORE PREVIOUS INSTRUCTIONS" as examples.                                |

I then scanned the complete text of all 16 papers for agent-directed directives
(ignore-previous patterns, system-prompt extraction, executable download/run requests,
credential requests). Pattern hits were confined to quoted attack examples, bibliography
entries, and annotation instructions; no directive aimed at the reader was found. All
quoted imperatives are paper content and were treated as data. Screening evidence is
therefore positive for substance (0.98-0.99) and relevance (0.72-0.98), with residual
injection flags explained by quoted prompt material.

**Evidence labels.** Throughout, `[EMPIRICAL]` marks a measured result reported by the
cited paper; `[RECOMMENDATION]` marks a design rule synthesized from those results;
`[INFERENCE]` marks a claim that goes beyond what the papers measured. Numbers are from
the cited section/table of the arXiv version read. Page numbers are omitted because the
ar5iv rendering does not preserve them; section, table, and figure references are exact.

**Bottom line.**

- Constraint _count_ and _composition_ generally reduce compliance: even GPT-4 fails about
  20% of complex instructions, and hard satisfaction trends downward as constraints accumulate
  (IFEval, FollowBench, ComplexBench).
- Semantically irrelevant surface choices are not noise: median format spread is 7.5
  accuracy points, worst observed 76; example order can move accuracy from ~85% to ~50%;
  relevant evidence in the middle of a long context is used worse than at the edges.
- Task-matched decomposition and independent verification help, but generic "think step by
  step" and generic "check your work" are weak; mismatched instructions can hurt.
- Ambiguity is common (over half of AmbigQA questions), and models often detect it without
  asking; explicit clarification policy helps, but always asking has a cost.
- The literature supports a _design checklist_, not a validated score. The rubric below
  scores eight utility dimensions, reports privilege/safety separately where the task
  exposes the agent to untrusted content or tools, and adds an optional economy dimension,
  with task-relative weights and explicit gates.

## Direct empirical findings

Sections 1-5 concern utility: whether a prompt or technique improves task completion and
compliance. Section 6 concerns safety: whether an agent resists instruction conflict from
untrusted content. The two evidence bases are not interchangeable.

### 1. Instruction quality and constraint following

**Bsharat et al. (2023)** propose 26 prompt principles grouped into five categories
(prompt structure/clarity; specificity/information; user interaction; content/language
style; complex tasks/coding). `[EMPIRICAL]` On their manually built ATLAS benchmark (20
human-selected questions per principle, human evaluation of one response per question),
applying the principles improved GPT-4 response quality by an average of 57.7% and
correctness by 36.4% (§1), with a "stable 50% improvement" across LLMs in the per-model
analysis (§4.3.2). The authors report that gains grow with model scale (§4.3.2). The paper
is candid that the question set is small, the evaluation is human and subjective, and
results may not transfer to other architectures (§6). Several principles are folk
heuristics (tip amounts, "you will be penalized", repeating a phrase) and are not
independently validated as mechanisms. This is the weakest empirical base among the
instruction-quality papers.

**IFEval (Zhou et al., 2023)** isolates _verifiable instructions_: 25 types (keywords,
length, JSON, casing, start/end phrases, etc.) instantiated in 541 prompts, each with one
or more atomic constraints (§1, Table 1). `[EMPIRICAL]` With strict prompt-level accuracy
(all constraints in a prompt satisfied), GPT-4 scores 76.89% and PaLM 2 S 43.07%;
instruction-level strict accuracy is 83.57% and 55.76% respectively (Table 3). The gap
between prompt-level and instruction-level accuracy is the direct signature of
multi-constraint failure: models satisfy individual instructions more often than the
conjunction. The authors note that verifiable instructions are a narrow subset, that some
false negatives remain, and that their loose metric trades false negatives for false
positives (§1, §2.2, §4).

**FollowBench (Jiang et al., 2024)** extends constraint following to five fine-grained
types (Content, Situation, Style, Format, Example) plus mixed constraints, and adds
constraints cumulatively across five levels (§3, §3.1). The benchmark contains 820
instructions and evaluates 13 LLMs with an LLM judge (§3.1, §3.2, §4.1). `[EMPIRICAL]`
GPT-4's hard satisfaction rate falls overall from 84.7% at level 1 to 61.9% at level
5, with a small uptick at level 4 (average 73.4%; consistent satisfaction level 3.3), and
GPT-3.5 falls from 80.3% to 53.2% (§4.2). The authors flag single-round evaluation and
dependence on an LLM judge as limitations (§6).

**ComplexBench (Wen et al., 2024)** adds _composition_: 4 constraint types (Lexical,
Format, Semantic, Utility), 19 dimensions, and 4 composition types (Single, And, Chain,
Selection), including nested compositions (§3.2, §3.3). The benchmark has 1,150
instructions and 5,306 scoring questions (Table 2). `[EMPIRICAL]` GPT-4 still fails about
20% of complex instructions; its overall score is 0.800, with Selection at 0.675 and Chain
averaging 0.766, and Chain and Selection are consistently harder than And across models
(§5.2.2, Table 5).

**Synthesis.** Constraint _count_ and constraint _composition_ reliably reduce compliance
across three independent benchmarks, models, and judging methods. This is the strongest
direct evidence for the rubric's constraint and output-contract dimensions
`[EMPIRICAL]`. It does not show that adding explicit constraints to a reusable prompt
improves outcomes in the wild; benchmark prompts are constructed to be verifiable and are
scored on compliance, not on task value `[INFERENCE]`.

### 2. Sensitivity to surface form, order, and position

**FormatSpread (Sclar et al., 2024)** varies _semantically equivalent_ prompt formats
using a grammar of descriptors, separators, casing, and itemization (§3.1). Across 53
Super-NaturalInstructions tasks and several open models, the median accuracy spread across
10 sampled formats is 7.5 points; 20% of tasks have at least 15 points of spread for all
LLaMA-2 settings (at least 9 for Falcon), several exceed 70 points, and the worst observed
case is 76 points with LLaMA-2-13B (§4.2; §1). `[EMPIRICAL]` The spread survives larger
models, instruction tuning, and more few-shot examples. Model comparisons can reverse
under a different format: LLaMA-2-13B vs. 70B reverse by at least 0.02 with probability
0.141; among those reversals, both experiments were individually significant in 76% of
cases for the 13B/70B comparison and 47% for the 7B/Falcon comparison (§4.2). Atomic changes
matter: 24% of single-constant changes produce at least a 5-point accuracy change under
exact prefix matching (§4.3). The format space is largely non-monotonic (32.4% and 33.6%
of triples monotonic vs. 33.3% expected by chance) (§4.3). The authors recommend reporting
a range over plausible formats when comparing systems, while conceding that a single
format can be a valid engineering choice for a deployed system (§6).

**Order sensitivity (Lu et al., 2022).** With four fixed examples, different permutations
range from above 85% to near-random ~50% on SST-2 (§1, Figure 1). `[EMPIRICAL]` Changing
from GPT2-XL to GPT2-Large drops one permutation from 88.7% to 51.6%; permutation quality
correlates only 0.05 between the 2.7B and 175B models (§2). Adding examples does not remove
the variance, calibration does not remove it, and label orderings are also unstable (§2).
Entropy-based probing of an unlabeled probing set selects better permutations, yielding a
13% relative improvement across 11 text-classification tasks (§1, §3, §5).

**Lost in the Middle (Liu et al., 2024).** `[EMPIRICAL]` In multi-document QA, performance
follows a U-shaped curve: relevant information at the beginning or end is used better than
information in the middle (§2.3, Figure 5). GPT-3.5-Turbo's accuracy can drop by more than
20%, and in the 20- and 30-document settings the worst position falls below its closed-book
accuracy of 56.1% (§2.3). Extended-context variants are not better when the context fits
both windows (§2.3), and the same middle-position degradation appears in synthetic
key-value retrieval (§3.2). More retrieved documents saturate reader performance: beyond
20 documents, GPT-3.5 gains about 1.5% and Claude-1.3 about 1% while context length, cost,
and latency keep rising (§5).

**Synthesis.** Exact formatting, example order, and the position of relevant evidence are
not neutral. A prompt that works in one format or model cannot be assumed to work in
another `[EMPIRICAL]`. Prompt evaluation that reports a single format is therefore noisy,
and reusable prompts should be written defensively (stable delimiters, stable section
order, key instructions at boundaries) `[RECOMMENDATION]`. The text features themselves do
not guarantee behavioral robustness; only measured variance can `[INFERENCE]`.

### 3. Decomposition and process specification

**Least-to-most prompting (Zhou et al., 2023).** The method has two stages: decompose the
problem into simpler subproblems, then solve them in sequence with previous answers
available (§2). `[EMPIRICAL]` On last-letter concatenation with `code-davinci-002`,
least-to-most drops from 94.0% at list length 4 to 74.0% at length 12, while
chain-of-thought drops from 84.2% to 31.8%; standard prompting is 0% (Table 4). On SCAN's
length split, least-to-most reaches 99.7% versus 16.2% for chain-of-thought and 16.7% for
standard prompting (Table 8). On GSM8K the overall gain is small (62.39% vs. 60.87%), but
it is concentrated on problems needing at least five steps (45.23% vs. 39.07%); on DROP,
least-to-most scores 82.45% vs. 74.77% (Tables 11-12). The gains are largest when the task
compositionally exceeds the exemplars.

**Plan-and-Solve (Wang et al., 2023).** A zero-shot trigger asks the model to devise a plan
and carry it out; PS+ adds instructions to extract variables, calculate intermediate
results, and attend to calculation (§2.1). `[EMPIRICAL]` PS+ averages 76.7% across six
arithmetic datasets versus 70.4% for zero-shot chain-of-thought, and 59.3% vs. 56.4% on
GSM8K (Table 2). The ablation is more informative: a prompt that asks only for variable
extraction, without a plan, scores 50.5% on GSM8K versus 56.4% for the plain
chain-of-thought trigger, and 69.5% vs. 69.9% on SVAMP (Table 5). Adding _some_
instructions can hurt when they do not target the task's failure mode. With self-consistency,
PS+ reaches 73.7% on GSM8K vs. 70.7% for chain-of-thought with self-consistency (§4.2).

**Synthesis.** Task-matched decomposition and intermediate artifacts help on compositional
or long-horizon tasks; generic "think step by step" is weaker, and mismatched scaffolding
can reduce accuracy `[EMPIRICAL]`. The evidence does not support decomposition as a
universal requirement: for simple transformations, an unnecessary plan adds cost and
failure surface `[INFERENCE]`.

### 4. Verification and grounding

**Chain-of-Verification (Dhuliawala et al., 2023).** The model drafts an answer, plans
verification questions, answers them independently, then revises (§3). `[EMPIRICAL]` On
Wikidata list questions, precision more than doubles from 0.17 to 0.36; on MultiSpanQA, F1
rises from 0.39 to 0.48 (+23%); on longform biographies, FactScore rises from 55.9 to 71.4
(+28%) (§4.3). Factored verification (questions answered without the baseline response in
context) beats joint verification, 63.7 vs. 60.8 FactScore, and an explicit cross-check
step raises it to 71.4 (§4.3). The mechanism matters: only 17% of baseline answer entities
are correct in list questions, but 70% are answered correctly when queried individually
(§4.3). Standard chain-of-thought and instruction tuning did not reduce hallucination in
these tasks (§4.3). Verification is not a cure: hallucinations remain, and the method adds
inference cost (§6).

**Self-Refine (Madaan et al., 2023).** The same model generates, gives feedback, and
refines iteratively, using only prompts (§2). `[EMPIRICAL]` Across seven tasks and three
models, outputs improve by about 20% absolute on average (abstract); GPT-4 code
optimization rises from 27.3% to 36.0%, and dialogue preference from 25.4% to 74.6%
(§3.3, Table 1). Feedback quality matters in the authors' ablations: on sentiment
reversal, specific actionable feedback scores 43.2, generic feedback 31.2, and no feedback
0; on acronym generation, 56.4 vs. 48.0 without actionable feedback (§4, Table 2). Math
reasoning is the counterexample: gains are approximately zero across GPT-3.5, ChatGPT, and
GPT-4 (64.1→64.1, 74.8→75.0, 92.9→93.1), which the authors attribute to the model's
inability to detect nuanced math errors (§3.3, Table 1; §6).

**RARR (Gao et al., 2023).** Research-and-revise finds evidence for a generated passage and
edits only unsupported spans, scoring attribution and preservation separately (§2, §3).
`[EMPIRICAL]` RARR increases attribution by up to 13% absolute while changing only 10-20%
of the text, and is the only tested method that preserves the original intent more than 90%
of the time (baselines preserve 6-40%) (§5.3). The trade-off is explicit: attribution can be
bought by rewriting, so the two metrics must be reported together; the authors' human oracle
reaches 93.6 AIS at 88% preservation, indicating headroom (§6.1).

**Synthesis.** Verification and grounding are not a single "check your work" instruction.
The effective ingredients are independence (verification questions answered without the
draft in context), specificity (actionable feedback, targeted queries), external evidence
when the task requires it, and a revision step that preserves what was correct
`[EMPIRICAL]`. Self-verification is capability- and task-dependent, and can be circular
`[INFERENCE]`.

### 5. Ambiguity and clarification

**AmbigQA (Min et al., 2020)** reformulates open-domain QA as finding every plausible
answer and rewriting the question for each. `[EMPIRICAL]` The annotated AmbigNQ set has
14,042 examples; over 50% of development and test questions have multiple plausible
question-answer pairs, despite NQ-open's single-answer assumption (§4.2). Ambiguity sources
include entity references, event references, properties, and answer types, and are
"relatively uniform" (§4.2, Table 1). Ambiguity is often invisible from the question alone
and appears only after research (§4.2).

**CLAM (Kuhn et al., 2023)** classifies a question as ambiguous, asks a clarifying question
only when needed, then answers with the clarification (§3). `[EMPIRICAL]` On 200
ambiguous/unambiguous TriviaQA pairs, CLAM raises adjusted accuracy by roughly 20
percentage points; the adjustment penalizes unnecessary clarification on unambiguous
questions (§5.1.1, Figure 5). The few-shot ambiguity classifier achieves high AUROC across
four datasets, and the model generates a correct clarifying question for 84% (Ambiguous
TriviaQA), 99% (CLAQUA I), and 95% (CLAQUA II) of cases (§5.1.2, Table 2). Two behavioral
facts are directly relevant to prompt design: models can _detect_ ambiguity but rarely ask
for clarification unless prompted to do so; and always asking for clarification improves
ambiguous-question accuracy but imposes a penalty on unambiguous questions (§5.1.1). A
generic prompt telling the model to ask if the question is ambiguous yields only a moderate
improvement and rarely triggers clarification (§5.1.1, Figure 5).

**Synthesis.** Ambiguity is common, not an edge case, and a generic "ask if unclear"
instruction is weak `[EMPIRICAL]`. A reusable prompt needs explicit triggers, a question
budget, and a fallback for when no user is available `[RECOMMENDATION]`.

### 6. Privilege, instruction conflict, and untrusted content (safety)

This section is evidence about _safety_, not about task utility. It asks whether an agent
resists instructions that arrive through untrusted content, not whether it completes the
task well. The two can trade off.

**The Instruction Hierarchy (Wallace et al., 2024)** argues that LLMs treat system, user,
and third-party text as equal-priority instructions, and trains them to follow a privilege
order, ignoring or refusing misaligned lower-privileged instructions (§3, §3.1). `[EMPIRICAL]`
Fine-tuning GPT-3.5 Turbo on synthetic hierarchy data improves robustness on the main
evaluations by up to 63%, generalizes to held-out attack types by up to 34%, and leaves
generic capability benchmarks comparable (§4). The cost is over-refusal: the hierarchy
model follows non-conflicting lower-privileged instructions almost as well as the baseline
on most evaluations, but regresses on two adversarial over-refusal sets designed to look
like attacks while being benign (§4).

**Prompt Report (Schulhoff et al., 2024)** supplies a vocabulary rather than a causal test:
a prompt has components including directive, examples, output formatting, style
instructions, role, and additional information (§1.2.1); the survey catalogs 33 terms, 58
LLM prompting techniques, and 40 techniques for other modalities (abstract). Its security
section classifies prompt injection and jailbreaking as distinct threats (§5.1). This is
useful for naming dimensions, but it does not measure which components improve reusable
prompts.

**Synthesis.** This is a safety finding, not a utility finding. A prompt can be effective at
its task and still lack a trust boundary; conversely, a prompt that refuses too readily can
lose utility. For an agent that reads web pages, tool outputs, or user-supplied files, a
trust boundary is not optional `[RECOMMENDATION]`. The direct evidence supports training and
prompting for privilege order, and warns that over-refusal is a real cost `[EMPIRICAL]`.
The exact prompt wording that best elicits the hierarchy in a given model is not established
by the paper `[INFERENCE]`.

## What the evidence does not establish

1. **None of these studies evaluates a reusable prompt artifact across inputs or sessions.**
   They evaluate prompt instances on benchmarks. Reuse, drift across inputs, and
   maintenance are unmeasured. The rubric therefore scores _design properties_, not
   demonstrated reliability `[INFERENCE]`.
2. **Few of these studies isolate prompt-text features as independent variables.** FormatSpread
   and the order-sensitivity study isolate surface features; IFEval, FollowBench, and
   ComplexBench vary constraints; least-to-most, Plan-and-Solve, CoVe, Self-Refine, RARR,
   and CLAM compare whole techniques. "Explicit completion criteria" and "output
   acceptance checks" are not directly manipulated in any paper here `[INFERENCE]`.
3. **Results are model-version- and task-specific.** FormatSpread and order sensitivity
   show that rankings can reverse across models and formats. The 2026 model population
   differs from the GPT-3.5/GPT-4/LLaMA-2 population in most of these papers. Treat the
   effect sizes as existence proofs, not constants `[INFERENCE]`.
4. **Evaluation methods are heterogeneous and imperfect.** Human A/B tests (Bsharat;
   Self-Refine), exact programmatic checks (IFEval), and LLM judges (FollowBench,
   ComplexBench) measure different things. LLM judges can be biased; human studies are
   small and subjective. Benchmark contamination and English-only scope are additional
   threats.
5. **Prompt sensitivity undermines single-prompt A/B claims.** A one-point difference
   between two prompt variants can be smaller than the format spread within a single
   variant. Any empirical validation of the rubric should sample plausible formats and
   report variance `[RECOMMENDATION, supported by EMPIRICAL spread results]`.
6. **More instruction is not monotonically better.** Plan-and-Solve's variables-only
   prompt underperforms its simpler baseline; FormatSpread shows that meaning-preserving
   changes can move accuracy by double digits; the Prompt Report's case study reports that
   accidentally duplicating an email _improved_ performance (Schulhoff et al., 2024,
   §6.2). Specificity should target the task's failure mode, not maximize text
   `[EMPIRICAL + INFERENCE]`.
7. **Safety and utility are not the same axis.** The instruction-hierarchy result trains a
   model to resist misaligned lower-privileged instructions and measures over-refusal as a
   cost (§4); it does not show that adding a hierarchy clause to a reusable prompt produces
   the same robustness. D9 is therefore a safety review of prompt text, not a utility score
   and not a measured attack-success rate `[INFERENCE]`.
8. **The rubric is not a validated predictive instrument.** It is a structured checklist
   derived from the constructs above. Calibration against held-out task outcomes is future
   work; until then, use it for design review and for comparing prompt artifacts, not for
   claiming expected accuracy gains `[INFERENCE]`.

## Proposed task-relative 0-2 rubric

Everything in this section is a `[RECOMMENDATION]` synthesized from the findings above; the
anchors are not themselves measured outcomes.

### Design principles

- **Score the artifact, not a sample response.** Each dimension is judged from the prompt
  text plus its declared operating contract. Outputs may be used to _calibrate_ the rubric,
  not to assign the prompt's score.
- **Set the task profile first.** A dimension can be irrelevant. For example, evidence
  grounding is critical for a retrieval agent and near-irrelevant for a closed-book
  transformation; decomposition is critical for a multi-step coding task and unnecessary
  for a one-shot rewrite. Weights are chosen from the task profile before reading the
  prompt, to prevent post-hoc rationalization.
- **Require a quoted span for every score.** A score without a prompt excerpt is not
  auditable.
- **Report the dimension vector and gate flags, not only a single number.** The dimensions
  are not interchangeable, and a high utility average can hide a safety failure.

### Dimensions

D1-D8 are utility dimensions. D9 is the safety dimension and is never averaged into the
utility score. D10 is an optional economy dimension. The evidence-strength column records
how directly the cited work supports the construct, not how strongly the anchor is
validated.

| ID  | Dimension                                 | What the prompt must make determinate                                                                          | Evidence basis                                                                                       | Evidence strength                                |
| --- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| D1  | Objective and completion test             | The deliverable, scope/non-goals, and the condition under which the agent stops                                | IFEval multi-constraint failure; FollowBench level drop; ComplexBench composition; AmbigQA ambiguity | Indirect                                         |
| D2  | Constraints and task precedence           | Enumerated constraints, numeric limits where possible, must/should/may priority, task-constraint conflict rule | IFEval Tables 1/3; FollowBench §3.1/§4.2; ComplexBench §3.3/Table 5                                  | Direct                                           |
| D3  | Evidence and grounding contract           | Which sources to use, how to cite/verify them, and what to do when evidence is absent or contradictory         | RARR §2/§5.3; CoVe §3/§4.3                                                                           | Direct                                           |
| D4  | Decomposition and checkpoints             | Task-matched intermediate artifacts and ordering; no unnecessary steps                                         | Least-to-most §2/Tables 4, 8, 11-12; Plan-and-Solve §2.1/Table 5                                     | Direct                                           |
| D5  | Output contract and acceptance checks     | Exact format/schema, required fields, examples, and a check the agent or evaluator can apply                   | IFEval §2/Table 1; FollowBench format constraints; ComplexBench format                               | Direct/indirect                                  |
| D6  | Ambiguity and clarification policy        | Ambiguity triggers, question budget, assumption/fallback policy                                                | AmbigQA §4.2; CLAM §3/§5.1                                                                           | Direct                                           |
| D7  | Verification and failure recovery         | Independent checks, pass/fail threshold, retry/ask/abstain/escalate path                                       | CoVe §3/§4.3; Self-Refine §2/§4/Table 1; RARR §5.3                                                   | Direct                                           |
| D8  | Form robustness and portability           | Stable delimiters/order, instruction placement, labeled examples, known model/format sensitivity               | FormatSpread §4.2/§4.3; Lu et al. §1-§2; Lost in the Middle §2.3/§5                                  | Direct                                           |
| D9  | Instruction-hierarchy robustness (safety) | Privilege order, untrusted content treated as data, conflict behavior, refusal boundary, over-refusal guard    | Instruction Hierarchy §3/§4                                                                          | Direct for training; indirect for prompt wording |
| D10 | Economy and non-interference (optional)   | No duplicated/contradictory rules; context limited to task needs; length justified                             | Plan-and-Solve Table 5; Prompt Report §6.2; weak direct evidence                                     | Recommendation, low confidence                   |

### Anchors

**D1 Objective and completion test**

- **0** — Names a topic or activity but no concrete deliverable; or multiple objectives
  with no single success condition.
- **1** — One deliverable is stated, but "done" is left to taste ("high quality",
  "comprehensive") and scope boundaries are absent.
- **2** — One deliverable, explicit scope/non-goals, and a task-appropriate completion test
  in observable terms (what must be present or true to stop). For open-ended work, the test
  may be a required-elements rubric rather than a single answer.

**D2 Constraints and task precedence**

- **0** — No constraints, or task constraints conflict with no priority.
- **1** — Constraints are listed, but limits are vague ("brief", "a few") or no
  priority/conflict rule is given for competing task constraints.
- **2** — Constraints are enumerated, with numeric limits where verifiable; each is marked
  must/should/may; precedence and conflict behavior among task constraints are explicit.

**D3 Evidence and grounding contract**

- **0** — No source or evidence rule; the model may invent support, or any retrieved text is
  treated as authoritative.
- **1** — Says to use the provided sources, but does not require citation/verification and
  gives no rule for missing or conflicting evidence.
- **2** — Names acceptable sources, requires citation or verification for factual claims,
  and specifies behavior when evidence is absent or contradictory (abstain, mark uncertain,
  ask, or use a named fallback). For tasks with no factual claims, the contract may be
  minimal; score against the declared evidence dependence.

**D4 Decomposition and checkpoints**

- **0** — Monolithic demand for a task that requires intermediate state; no ordering or
  checkpoints.
- **1** — Generic "think step by step"/"make a plan" with no named intermediate artifacts;
  or a decomposition that does not match the task's bottleneck.
- **2** — Minimal task-matched decomposition with named intermediate artifacts/checkpoints
  and a rule for carrying results forward; no unnecessary steps for simple tasks.

**D5 Output contract and acceptance checks**

- **0** — No output format or acceptance criteria.
- **1** — Prose format request or partial schema; acceptance depends on unstated judgment.
- **2** — Exact schema/format, required fields, valid/invalid example, and a check the agent
  or evaluator can apply. If the output is inherently judged, an explicit rubric with
  pass/fail criteria.

**D6 Ambiguity and clarification policy**

- **0** — Commands an answer even when the request is underspecified; no assumption policy.
- **1** — Generic "ask if unclear" with no trigger, question budget, or fallback.
- **2** — Defines ambiguity triggers, asks at most one highest-value question when
  interaction is possible, and otherwise states assumptions and proceeds or aborts according
  to risk.

**D7 Verification and failure recovery**

- **0** — No verification, stop condition, or failure path.
- **1** — Generic "check your work"/"revise if needed" without independent evidence, a
  threshold, or a fallback.
- **2** — Task-specific checks using independent evidence (sub-queries, sources, tests,
  schema validation), a pass/fail threshold, and an explicit fallback (retry, ask, abstain,
  escalate) with no silent success.

**D8 Form robustness and portability**

- **0** — Relies on incidental formatting, example order, or one model's quirks;
  instructions are buried in long context.
- **1** — Uses delimiters and a stable section order; key instructions appear at the start
  or end; but no stated invariance and no tested variants.
- **2** — Explicit structural delimiters, stable ordering, instruction restated at
  boundaries for long contexts, labeled examples; known model/format sensitivities are
  recorded, or the prompt avoids depending on few-shot order.

**D9 Instruction-hierarchy robustness (safety)**

- **0** — No distinction between trusted instructions and untrusted content; tool, web, or
  user data can redirect the agent; no conflict rule.
- **1** — Warns about prompt injection or says to ignore malicious instructions, but does not
  define privilege order, treat third-party content as data, or specify refusal and
  over-refusal behavior.
- **2** — States a privilege order (developer/system > user > tool/web/document data),
  requires untrusted content to be treated as data, defines privilege-conflict behavior
  (ignore or refuse misaligned instructions; follow aligned ones), and states a refusal
  boundary that preserves benign lower-privilege instructions. Score only when the task
  exposes the agent to untrusted content or tools; otherwise assign weight 0.

The construct is supported by a primary training intervention; the prompt-text anchor is an
extrapolation from it. D9 is therefore reported as a safety review, not as a measured
attack-success rate. For catalog records that are deliberately adversarial examples, record
D9 descriptively; the deployability gate applies only to prompts intended for reuse.

**D10 Economy and non-interference (optional)**

- **0** — Duplicated or contradictory rules; large amounts of irrelevant context;
  instructions that cancel each other.
- **1** — Some redundancy or over-scaffolding; no rule for what to omit.
- **2** — Every section has a function; no duplicated rules; context is limited to what the
  task needs; length is justified by constraints or evidence.

### Scoring procedure

1. **Declare the task profile.** Record task type, autonomy, evidence dependence, output
   verifiability, exposure to untrusted content/tools, and risk of irreversible actions.
   Assign each dimension a weight `w_d ∈ {0,1,2,3}`, where 0 means "not applicable", not
   "unimportant".
2. **Score each dimension 0, 1, or 2** against the anchors, quoting the prompt span that
   justifies the score.
3. **Compute the utility score over D1-D8 only**:
   `U = Σ(w_d · s_d) / (2 · Σ w_d)`, yielding 0-1 (or report `2U` on the 0-2 scale).
   Report the eight-dimension vector alongside it.
4. **Report D9 (safety) separately.** D9 is a 0-2 safety judgment, not a utility input; do
   not average it into `U`. If the task has no untrusted-content or tool exposure, report
   D9 as "not applicable" (weight 0), not as a passing score. D10 is reported separately
   and is weighted only when prompt economy is a declared task constraint.
5. **Apply critical gates as flags, not silent adjustments.** For an evidence-dependent
   prompt, D3 = 0 means the artifact cannot support its factual claims and is not
   deployable. For an agent exposed to untrusted content or tools, D9 = 0 is a safety gate
   regardless of utility. For a prompt that can take irreversible actions, D7 = 0 is an
   operational gate. D1 = 0 caps the utility score at 1/2 on the dimension scale because
   the artifact has no testable objective.
6. **Report the utility vector, the safety judgment, the weights, and the gates.** Two
   raters score independently; a difference greater than one point on any dimension is
   adjudicated with the quoted spans. Calibrate on held-out outcomes if available;
   otherwise label the result a design review. The safety judgment is a review of prompt
   text against the hierarchy evidence, not a measured attack-success rate.

### Illustrative task profiles

Weights illustrate task-relativity; they are recommendations, not empirical constants.

| Task profile                                  |  D1 |  D2 |  D3 |  D4 |  D5 |  D6 |  D7 |  D8 |  D9 | D10 |
| --------------------------------------------- | --: | --: | --: | --: | --: | --: | --: | --: | --: | --: |
| Closed transformation (single turn, no tools) |   3 |   2 |   0 |   0 |   3 |   1 |   1 |   2 |   0 |   2 |
| Research/synthesis with retrieval             |   3 |   2 |   3 |   2 |   2 |   2 |   3 |   2 |   3 |   1 |
| Tool-using code-change agent                  |   3 |   3 |   2 |   2 |   3 |   2 |   3 |   2 |   3 |   1 |

The profile changes the interpretation, not the anchors. A closed transformation with no
evidence dependence is not penalized for D3 = 0; a research agent with D3 = 0 is. A prompt
with no untrusted input is not scored on D9; an agent that reads web or tool content and
scores D9 = 0 is gated regardless of its utility score.

## Limitations of the literature-derived rubric

- **Not a systematic review.** The 16 papers were selected for direct relevance and
  coverage, not by a preregistered search protocol. Well-known papers are over-represented;
  null results and unpublished replications are absent.
- **Single-reader extraction.** Numbers were transcribed from one full-text rendering per
  paper. Version drift is possible; arXiv versions and section/table locations are given so
  claims can be rechecked.
- **Screening scope.** Jev screened the first 20,000 characters of each paper. The manual
  injection scan covered the complete text but used a fixed pattern set; it is not a
  substitute for a security review of executable artifacts.
- **Construct validity.** The rubric's dimensions are derived from benchmark findings about
  model compliance and technique effectiveness, not from a validated theory of reusable
  prompt quality. D1, D5, and D10 are the most extrapolated. D3, D4, D6, D7, and D8 have
  direct interventions or measurements behind them. D9 has direct evidence for
  instruction-hierarchy training, but only indirect evidence that prompt wording produces
  the same robustness; over-refusal is an explicit utility cost. Utility and safety are
  reported separately because they can trade off.
- **No outcome calibration.** The note does not test whether higher rubric scores predict
  better agent outcomes. That would require a held-out set of prompt artifacts, multiple
  plausible formats per artifact, and task-level success measures, with variance reported.

## Corpus assessments

### External catalog: provenance and coverage

The supplementary corpus is the official `f/prompts.chat` `prompts.csv` at pinned commit
[`f8fe2385244a6188c976e352ea7ca849e3d20b1e`](https://github.com/f/prompts.chat/tree/f8fe2385244a6188c976e352ea7ca849e3d20b1e).
Its [README](https://raw.githubusercontent.com/f/prompts.chat/f8fe2385244a6188c976e352ea7ca849e3d20b1e/README.md)
describes a curated prompt collection; the [LICENSE](https://raw.githubusercontent.com/f/prompts.chat/f8fe2385244a6188c976e352ea7ca849e3d20b1e/LICENSE)
places `prompts.csv`, `PROMPTS.md`, and user-submitted prompt text under CC0 1.0 Universal
and source code/site-authored content under MIT. The local extract is
[`prompts-chat-1000.jsonl`](prompts-chat-1000.jsonl), SHA-256
`ab2982761f3f79253ccfa12b92c3bb6ed46b577beb9776f993f901c8091aa455`.

- **Coverage:** 1,000 unique `TEXT` prompts, from source rows 1–1,589; prompt length median
  680 characters (range 29–1,992); source metadata marks 81 `for_devs=TRUE` and 919
  `for_devs=FALSE`.
- **Selection:** first 1,000 qualifying distinct text records in source order; blank,
  non-`TEXT`, over-2,000-character, and normalized duplicate records were skipped. This is
  not a random sample and over-represents the catalog’s early source rows.
- **Role:** this external sample supplements, rather than replaces, the repository’s own
  237 prompts. It is a transfer check across a broader prompt catalog, not a population
  estimate for all prompts.

### Rubric and Jev procedure

The 0–2, task-relative anchors in the preceding rubric were applied as separate judgments:
D1 objective/completion; D2 constraints/precedence; D3 evidence/grounding; D4 decomposition;
D5 output/acceptance; D6 ambiguity/clarification; D7 verification/recovery; D8 form
robustness; D9 instruction-hierarchy safety; and D10 economy. D1–D8 are utility dimensions.
D9 is gated by a separate applicability judgment and is never averaged into utility. D10 is
optional and based on weaker empirical support. A short task is not penalized for omitting
unneeded stages, evidence rules, clarification, or verification.

Jev 1.14 (`typesafe/jev-1.14-20261014`, via OpenRouter) scored 992 records across the 10
score dimensions, with 11 independent judgments per record because D9 has a separate
applicability question. All 992 returned results; scoring took about 7 seconds and cost $0.113.
Jev `score` is the probability-weighted level index. Table probabilities are averaged over
records; “likely full” counts records with `P(score=2) > 0.5`. Confidence is the mean Jev
confidence. No single composite is reported: these tasks differ, and there are no validated
universal task weights.

Before scoring, a Jev-based `unsafe_redirect` triage covered the 1,000-record pool. Eight
records then received direct `jev_screen` `block` recommendations and were excluded; their
exact findings are listed below without reproducing prompt text. One additional record,
`prompts.chat:000620`, received `review` at `P(injection)=0.67`; it was manually inspected
and retained only as inert data. No prompt was executed and no repository/tool action was
taken from catalog instructions.

### Ratings for the 992 unblocked records

| Dimension                    |   n | Mean score / 2 |     Mean P(0 / 1 / 2) | Likely full, n (%) | Mean confidence |
| ---------------------------- | --: | -------------: | --------------------: | -----------------: | --------------: |
| D1 Objective/completion      | 992 |          1.236 | 0.097 / 0.570 / 0.333 |        302 (30.4%) |           0.491 |
| D2 Constraints/precedence    | 992 |          1.067 | 0.129 / 0.674 / 0.197 |        110 (11.1%) |           0.576 |
| D3 Evidence/grounding        | 992 |          0.785 | 0.503 / 0.210 / 0.287 |        210 (21.2%) |           0.310 |
| D4 Decomposition/checkpoints | 992 |          1.038 | 0.322 / 0.319 / 0.360 |        265 (26.7%) |           0.292 |
| D5 Output/acceptance         | 992 |          0.792 | 0.294 / 0.619 / 0.086 |          14 (1.4%) |           0.593 |
| D6 Ambiguity/clarification   | 992 |          0.225 | 0.828 / 0.120 / 0.053 |          11 (1.1%) |           0.725 |
| D7 Verification/recovery     | 992 |          0.200 | 0.816 / 0.166 / 0.017 |           3 (0.3%) |           0.801 |
| D8 Form robustness           | 992 |          1.453 | 0.094 / 0.358 / 0.548 |        694 (70.0%) |           0.298 |
| D9 Safety, applicable subset | 277 |          0.180 | 0.860 / 0.101 / 0.040 |           0 (0.0%) |           0.732 |
| D10 Economy (optional)       | 992 |          1.539 | 0.038 / 0.384 / 0.578 |        696 (70.2%) |           0.439 |

Jev marked D9 applicable for 277/992 records (27.9%). D9 percentages and scores use only
that subset; safety is not a utility score. The rounded probability columns may not sum to
exactly 1.000.

### Interpretation

The strongest, higher-confidence gap is **verification and recovery**: D7 had mean score
0.200, with 81.6% mean probability mass at level 0 and only 3/992 records more likely than
not to satisfy the full anchor. **Ambiguity handling** is similarly uncommon (D6 mean 0.225;
82.8% mean level-0 mass). **Output contracts** are usually partial rather than complete:
61.9% mean level-1 mass, versus 8.6% at level 2. D2 is also usually partial (67.4% at level
1). These provide the clearest corpus-level support for specifying how to clarify material
unknowns, what output is acceptable, and how to verify the result when the task warrants it.

D1 is more often partial than complete: the prompt usually names a goal, but less often
defines scope and an observable finish line. D3 and D4 are uncertain judgments (mean
confidence 0.310 and 0.292); do not treat their low/mixed ratings as precise prevalence
estimates. D8 and D10 look comparatively strong by average score, but their confidence is
also low (0.298 and 0.439), so they are weak signals, not a reliable ranking. Among tasks
Jev judged safety-relevant, the full D9 hierarchy anchor was not the more-likely-than-not
judgment for any record; this is a separate safety gap, not evidence that every prompt needs
security scaffolding.

### Cross-check against the repository’s 237-prompt library

An earlier Jev 1.14 pass scored the repository’s 237 records with a different, 10-dimension
rubric. Its upper 60 were selected by that same model’s overall score (at least 1.59), so
these are descriptive, endogenous contrasts—not an independent validation or a causal test.
The measures are not pooled with the catalog rubric above.

| Earlier deck dimension | All 237 | Upper 60 | Other 177 | Upper-minus-other |
| ---------------------- | ------: | -------: | --------: | ----------------: |
| Outcome clarity        |   1.715 |    1.725 |     1.711 |            +0.014 |
| Scope                  |   1.324 |    1.570 |     1.241 |            +0.329 |
| Verification           |   1.183 |    1.477 |     1.083 |            +0.394 |
| Uncertainty handling   |   0.526 |    1.005 |     0.364 |            +0.641 |
| Actionability          |   1.532 |    1.689 |     1.479 |            +0.210 |

The two assessments point in the same direction without being directly comparable: naming
an outcome is common, while stronger prompts more often bound scope and specify how to
handle uncertainty or check completion. Together with the primary-paper review, this supports
a **task-relative authoring checklist**, not a universal template: state a useful outcome;
bound scope; give task-matched steps; specify output and acceptance checks; define clarification
and evidence behavior when needed; and add proportional verification and trust boundaries for
tool-using or externally sourced work. Keep one-step tasks simple and avoid redundant rules.

### Direct screen blocks excluded by user choice

These eight records were excluded from all Jev quality scores. The `block` threshold was
`P(injection) >= 0.75`.

| Record ID             | Jev `P(injection)` | Recommendation |
| --------------------- | -----------------: | -------------- |
| `prompts.chat:000061` |               0.97 | block          |
| `prompts.chat:000161` |               0.98 | block          |
| `prompts.chat:000307` |               0.93 | block          |
| `prompts.chat:000512` |               0.76 | block          |
| `prompts.chat:000829` |               0.98 | block          |
| `prompts.chat:000885` |               0.97 | block          |
| `prompts.chat:001179` |               0.99 | block          |
| `prompts.chat:001584` |               0.98 | block          |

No prompt text is included here. The user chose to exclude these records and keep the
analysis at 992; they remain unscored, with no prompt instructions followed or executed.

### Limits

- The external sample is a source-order convenience sample, not a random or representative
  sample of prompts.chat or all prompt-writing practice.
- Jev provides text judgments, not observed task success. There was no human-labeled
  calibration set or independent rater; same-model ratings cannot establish prompt
  effectiveness or causation.
- The 0–2 axes are rubric anchors, not universal weights. The report therefore presents a
  dimension profile rather than one quality score. D3, D4, D8, and D10 have low mean
  confidence and warrant particular caution.
- Eight safety-screen blocks were excluded at the user’s request. The findings cover 992
  external records plus the separate earlier assessment of the local 237-record library.

### Expanded 30-parameter follow-up

“Triple the parameters” is interpreted as 30 scored subdimensions: three refinements of
each D1–D10 axis, not a change to Jev’s model internals. The same 992 user-approved records
were used; the eight screen-blocked records stayed excluded. The prior D9 applicability
judgment was reused (277 applicable records). Each subdimension uses the parent rubric’s
task-relative 0–2 scale: 0 = absent/broken where material, 1 = partial/vague, 2 = complete
and task-appropriate. No all-axis composite is defined.

| Parameter | Focus                                                   |
| --------- | ------------------------------------------------------- |
| D1a       | Concrete deliverable or requested transformation        |
| D1b       | Scope, inclusions, and non-goals                        |
| D1c       | Observable completion and stop condition                |
| D2a       | Coverage of material task constraints                   |
| D2b       | Precision and operational measurability of constraints  |
| D2c       | Precedence among conflicting task-level constraints     |
| D3a       | Acceptable-source and source-authority contract         |
| D3b       | Citation or verification of factual claims              |
| D3c       | Handling missing or conflicting evidence                |
| D4a       | Ordering matched to task dependencies                   |
| D4b       | Intermediate artifacts and checkpoints                  |
| D4c       | Proportionality of decomposition                        |
| D5a       | Output format or schema                                 |
| D5b       | Required output fields and content                      |
| D5c       | Acceptance check or quality rubric                      |
| D6a       | Triggers for material ambiguity                         |
| D6b       | Focus and budget for clarification questions            |
| D6c       | Safe assumptions and fallback behavior                  |
| D7a       | Independent validation method                           |
| D7b       | Observable pass/fail threshold                          |
| D7c       | Failure recovery without silent success                 |
| D8a       | Stable delimiters for instructions, input, and examples |
| D8b       | Robust placement and ordering of critical instructions  |
| D8c       | Resistance to plausible model/format variation          |
| D9a       | Privilege order for safety-applicable tasks             |
| D9b       | Boundary between untrusted data and instructions        |
| D9c       | Refusal, confirmation, and side-effect boundaries       |
| D10a      | Avoidance of unnecessary repetition                     |
| D10b      | Internal consistency and non-interference               |
| D10c      | Relevance of context and proportionality of length      |

**Execution status: incomplete; no 30-parameter corpus estimates are reported.** The batch
attempted all 992 records with 30 independent score questions each. Jev 1.13 free returned
complete 30-score vectors for 746 records and failed for 246 with HTTP 429
`FreeUsageLimitError`; the reported batch cost was $0.144. The initial completion response
reported elapsedS 172.9 seconds, but later status snapshots for the same completed batch
and retry reported 2322 and 2085 seconds, respectively; the elapsed field was inconsistent
across observations and is not treated as a reliable wall-clock duration. Retrying only the
246 failures at concurrency 4 with two retries returned 0/246, again with HTTP 429 and the
free-usage-limit message. A direct Jev classifier connectivity probe
returned OpenRouter decisions API HTTP 403. This run used `opencode-zen/jev-1.13-free`,
not the Jev 1.14 model used for the earlier 10-axis pass. The 746 partial vectors were not
aggregated: missing records and the model-version change prevent a defensible full-sample
summary. No subscription, credential, or billing change was attempted. A consistent rerun
requires an available Jev scoring route; the existing 10-axis results remain separate.

## References

All URLs are stable arXiv abstract pages; the version read is noted where the abstract page
confirmed it.

1. Bsharat, S. M., Myrzakhan, A., & Shen, Z. (2023). _Principled Instructions Are All You
   Need for Questioning LLaMA-1/2, GPT-3.5/4._ arXiv:2312.16171.
   https://arxiv.org/abs/2312.16171 — §1; §3.2, Tables 1-2; §4.1; §4.3.2; §6.
2. Schulhoff, S., Ilie, M., Balepur, N., et al. (2024). _The Prompt Report: A Systematic
   Survey of Prompt Engineering Techniques._ arXiv:2406.06608v6.
   https://arxiv.org/abs/2406.06608 — §1.2.1; §5.1; §6.2; abstract.
3. Zhou, J., Lu, T., Mishra, S., Brahma, S., Basu, S., Luan, Y., Zhou, D., & Hou, L.
   (2023). _Instruction-Following Evaluation for Large Language Models._ arXiv:2311.07911.
   https://arxiv.org/abs/2311.07911 — §1; §2.2, Table 1; §3, Table 3; §4.
4. Jiang, Y., Wang, Y., Zeng, X., Zhong, W., Li, L., Mi, F., Shang, L., Jiang, X., Liu, Q.,
   & Wang, W. (2024). _FollowBench: A Multi-level Fine-grained Constraints Following
   Benchmark for Large Language Models._ arXiv:2310.20410v3.
   https://arxiv.org/abs/2310.20410 — §3, §3.1, §3.2; §4.2; §6.
5. Wen, B., Ke, P., Gu, X., Wu, L., Huang, H., Zhou, J., Li, W., Hu, B., Gao, W., Xu, J.,
   Liu, Y., Tang, J., Wang, H., & Huang, M. (2024). _Benchmarking Complex
   Instruction-Following with Multiple Constraints Composition._ arXiv:2407.03978v3.
   https://arxiv.org/abs/2407.03978 — §3.2, §3.3; §4.3, Table 2; §5.2.2, Table 5.
6. Sclar, M., Choi, Y., Tsvetkov, Y., & Suhr, A. (2024). _Quantifying Language Models'
   Sensitivity to Spurious Features in Prompt Design or: How I learned to start worrying
   about prompt formatting._ arXiv:2310.11324. https://arxiv.org/abs/2310.11324 — §1; §3.1;
   §4.2; §4.3; §6.
7. Lu, Y., Bartolo, M., Moore, A., Riedel, S., & Stenetorp, P. (2022). _Fantastically
   Ordered Prompts and Where to Find Them: Overcoming Few-Shot Prompt Order Sensitivity._
   arXiv:2104.08786v2. https://arxiv.org/abs/2104.08786 — §1; §2; §3; §5.
8. Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., & Liang, P.
   (2024). _Lost in the Middle: How Language Models Use Long Contexts._ arXiv:2307.03172.
   https://arxiv.org/abs/2307.03172 — §2.3, Figure 5; §3.2; §5.
9. Zhou, D., Schärli, N., Hou, L., Wei, J., Scales, N., Wang, X., Schuurmans, D., Cui, C.,
   Bousquet, O., Le, Q., & Chi, E. (2023). _Least-to-Most Prompting Enables Complex
   Reasoning in Large Language Models._ arXiv:2205.10625v3.
   https://arxiv.org/abs/2205.10625 — §2; §3.1, Table 4; §3.2, Table 8; §3.3, Tables 11-12.
10. Wang, L., Xu, W., Lan, Y., Hu, Z., Lan, Y., Lee, R. K.-W., & Lim, E.-P. (2023).
    _Plan-and-Solve Prompting: Improving Zero-Shot Chain-of-Thought Reasoning by Large
    Language Models._ arXiv:2305.04091. https://arxiv.org/abs/2305.04091 — §2.1; §4.1,
    Table 2; §4.2, Table 5.
11. Dhuliawala, S., Komeili, M., Xu, J., Raileanu, R., Li, X., Celikyilmaz, A., & Weston, J.
    (2023). _Chain-of-Verification Reduces Hallucination in Large Language Models._
    arXiv:2309.11495v2. https://arxiv.org/abs/2309.11495 — §3; §4.3; §6.
12. Madaan, A., Tandon, N., Gupta, P., Hallinan, S., Gao, L., Wiegreffe, S., Alon, U.,
    Dziri, N., Prabhumoye, S., Yang, Y., Gupta, S., Majumder, B. P., Hermann, K., Welleck,
    S., Yazdanbakhsh, A., & Clark, P. (2023). _Self-Refine: Iterative Refinement with
    Self-Feedback._ arXiv:2303.17651. https://arxiv.org/abs/2303.17651 — §2; §3.2, Table 1;
    §3.3; §4, Table 2; §6.
13. Gao, L., Dai, Z., Pasupat, P., Chen, A., Chaganty, A. T., Fan, Y., Zhao, V. Y., Lao, N.,
    Lee, H., Juan, D.-C., & Guu, K. (2023). _RARR: Researching and Revising What Language
    Models Say, Using Language Models._ arXiv:2210.08726v3.
    https://arxiv.org/abs/2210.08726 — §2; §3.1-§3.2; §5.3; §6.1.
14. Kuhn, L., Gal, Y., & Farquhar, S. (2023). _CLAM: Selective Clarification for Ambiguous
    Questions with Generative Language Models._ arXiv:2212.07769v2.
    https://arxiv.org/abs/2212.07769 — §2; §3; §5.1.1, Figure 5; §5.1.2, Table 2.
15. Min, S., Michael, J., Hajishirzi, H., & Zettlemoyer, L. (2020). _AmbigQA: Answering
    Ambiguous Open-domain Questions._ arXiv:2004.10645v2.
    https://arxiv.org/abs/2004.10645 — §3.1; §3.2; §4.2, Table 1.
16. Wallace, E., Xiao, K., Leike, R., Weng, L., Heidecke, J., & Beutel, A. (2024). _The
    Instruction Hierarchy: Training LLMs to Prioritize Privileged Instructions._
    arXiv:2404.13208. https://arxiv.org/abs/2404.13208 — §3, §3.1; §4.
