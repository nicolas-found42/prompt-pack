// Prompts for one category of the deck. One record per block, one id per
// line, so two contributors adding prompts never edit the same lines.
// order is the position each prompt had in the original deck; category
// membership lives in data/taxonomy.js, the single source of truth for
// where a prompt sits in the navigation tree.
export const PROMPTS = [
  {
    order: 158,
    id: "9.1",
    title: "Grounded Function Oracle",
    purpose:
      "Call routines in the shipped implementation directly and record their exact results, so the replacement is tested against the original rather than against its own assumptions.",
    text: "I do not want any part of this replacement validated by reading the original and nodding along. Build a driver that calls one routine in the shipped implementation at a time: set up its arguments and the globals it reads, invoke it with the ABI it expects, and capture the return value, numeric state, and any memory it mutated. The shipped binary is the source of truth—never derive expected values from the replacement's own behavior and call that a pass. Record vectors for normal, boundary, and malformed inputs, starting with routines already claimed as ported, and report which ones cannot be called until an initialization sequence is reproduced.",
    words: 108,
    pattern: "Reconstruct",
    session: "in-progress",
    tags: ["in-progress"],
  },
  {
    order: 159,
    id: "9.2",
    title: "Headless Seam Extraction",
    purpose:
      "Run the original with window, audio, clock, and input replaced by recorders, so its logic executes headlessly and every external call becomes an observation.",
    text: "I cannot see why the original behaves as it does while it insists on opening a window, mixing audio, and reading the wall clock. Extract a headless seam: replace each external dependency with a recorder that captures the call and returns a defensible value, leave the original logic untouched, and drive it from a scripted entry point until it reaches the state I care about. Report exactly which dependencies had to be faked, what each recorder returned, and where a faked value changed the control flow. Then reproduce the same state in a real run and show me the two records side by side.",
    words: 104,
    pattern: "Reconstruct",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 160,
    id: "9.3",
    title: "Numeric Contract & Precision Trust Table",
    purpose:
      "Produce one numeric trust table for the original's arithmetic—precision, rounding, operation order, edge cases—before any math is ported.",
    text: "Before a single line of arithmetic is ported, I want the original's numeric behavior written down as a table, not discovered one failing comparison at a time. For each operation the replacement will need, establish what the original does at its real control settings: evaluation precision, rounding mode, operation order, and behavior on denormals, signed zero, and register overflow. Mark each row exact, approximated with a measured bound, or unverified, and link every exact row to the probe that showed it. Then make the port refuse to use any operation whose row is not exact.",
    words: 95,
    pattern: "Audit",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 161,
    id: "9.4",
    title: "Byte-Accounting Format Falsification",
    purpose:
      "Recover an undocumented format by accounting for every byte, falsifying each field hypothesis against hostile files, then building the reader from survivors.",
    text: "We have an undocumented binary format and a pile of real files, and I do not want a parser that merely fails to crash. Account for every byte of a representative sample—header, tables, padding, alignment, trailing data—with no unexplained gap. State the field hypothesis as claims precise enough to fail: offset, width, endianness, sentinel, reference target. Then search the corpus for the files most likely to break each claim and report which survived, which died and on which file, and which bytes remain unexplained. Build the reader from the survivors, carrying every unknown explicitly.",
    words: 94,
    pattern: "Reconstruct",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 162,
    id: "9.5",
    title: "Writer Reconstruction & Interop Proof",
    purpose:
      "Rebuild the format writer and prove two-way exchange with the original, comparing bytes rather than whether loading succeeded.",
    text: "Reading the format is half the job. The replacement is not interoperable until it writes files the original accepts. Reconstruct the writer from the original's output byte by byte: field order, padding, checksums, and every value the reader silently tolerates. Then run the proof in both directions—artifacts written by the replacement loaded by the original, and artifacts written by the original loaded by the replacement—comparing the resulting bytes rather than whether loading merely succeeded. A file that opens but differs is a finding, so report each differing offset and explain it before calling the writer done.",
    words: 96,
    pattern: "Reconcile",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 163,
    id: "9.6",
    title: "Minimal Reproducer Reduction",
    purpose:
      "Shrink a failing input to the smallest artifact that still reproduces the behavior, and keep it as the regression fixture.",
    text: "A failure that needs an enormous input to reproduce will never be fixed quickly. Take the case we are chasing and reduce it mechanically: remove bytes, drop records, shorten runs, and simplify values one change at a time, keeping only the reductions that still reproduce the same behavior. Stop when no single further change preserves it, and record what each surviving part is needed for. Leave the minimal artifact and the exact command that reproduces the failure as the regression fixture, and state how many reductions were attempted before the input stopped shrinking.",
    words: 93,
    pattern: "Execute",
    session: "in-progress",
    tags: ["in-progress"],
  },
  {
    order: 164,
    id: "9.7",
    title: "First-Divergence Trace Bisection",
    purpose:
      "Align two runs record by record, report the exact first divergence rather than the first visible symptom, and fix its cause.",
    text: "The replacement runs but produces a different result, and reading the code will not tell us where it first differs. Capture the same scenario from both implementations as an ordered trace of calls, arguments, and results, align the two streams record by record, and report the exact index of the first divergence—not the first visible symptom. Classify that record as a missing call, a wrong argument, an ordering difference, or a value mismatch, and trace it back to the code path that emitted it. Fix the cause, rerun the scenario, and either report the new first divergence or prove the traces agree to the end.",
    words: 105,
    pattern: "Reconcile",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 165,
    id: "9.8",
    title: "Deterministic Replay Contract",
    purpose:
      "Make one scenario reproducible from a fixed seed, timestep, scripted input, and recorded clock before any comparison is trusted.",
    text: "Nothing we compare is trustworthy until the same run can happen twice. Build one deterministic replay: a fixed seed, a fixed timestep with a stated catch-up rule, scripted input injected at exact frames, and a recorded clock instead of the wall clock. Run it twice in the replacement and diff every observable output—any difference is nondeterminism we introduced, and it has to go before a comparison against the original means anything. Then run the identical replay against the original and report the inputs, environment, and exact commands that reproduce both sides.",
    words: 91,
    pattern: "Reconcile",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 166,
    id: "9.9",
    title: "Frame-Stream Equivalence",
    purpose:
      "Compare per-frame draw, state, buffer, and input streams against the original, then review frames where the numbers cannot decide.",
    text: "The numbers can match while the picture is still wrong. Compare the replacement and the original frame by frame using their emitted streams—draw calls, state changes, buffer writes, input events—and report the first frame whose stream differs, with the record that differs and the state that led to it. Where a stream comparison cannot decide whether the result is correct, capture the same frame from both and review them side by side. Do not call rendering equivalent because the call counts agree, and do not call it broken because one frame looks darker.",
    words: 93,
    pattern: "Reconcile",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 167,
    id: "9.10",
    title: "Whole-Corpus Conformance Accounting",
    purpose:
      "Run the replacement over the whole real corpus, make silent skips fail, and compare per-file byte accounting against the original's counts.",
    text: "Point the replacement at the whole corpus, not the happy-path samples, and make the run tell the truth about what it did. For every file record whether it parsed, how many bytes were consumed, what was skipped, and which code path decided that. A silent skip and a swallowed error are both failures, because both hide work. Aggregate the results into counts that would visibly change if one file regressed, compare those counts against what the original produces over the same inputs, and show the unparsed remainder grouped by cause with its smallest reproducing file.",
    words: 95,
    pattern: "Reconcile",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 168,
    id: "9.11",
    title: "Frozen Comparison Boundary",
    purpose:
      "Freeze the accepted portion of a comparison into a committed expectation, fail on backwards movement, and widen it only by inspected evidence.",
    text: "Our comparisons pass up to a point and then diverge, and every refactor quietly moves that point backwards while the summary reports a new percentage as if it were progress. Freeze the accepted portion of the run into a committed expectation—same records, same order, same values—and fail the comparison at any record earlier than the boundary. When you extend it, write the new records from a run you already inspected and attach the evidence that justified them. Show me the boundary before and after, every record that moved backwards, and whether the file was edited by hand.",
    words: 97,
    pattern: "Codify",
    session: "in-progress",
    tags: ["in-progress"],
  },
  {
    order: 169,
    id: "9.12",
    title: "Generated Evidence Registry",
    purpose:
      "Replace a hand-written status document with a regenerated registry joining each ported symbol to the test that exercised it, plus a drift check.",
    text: "The status document and the code disagree the moment someone gets optimistic. Replace the hand-written status with a generator: it reads each ported symbol's original address annotation from the source, finds the test that actually exercised that symbol, and emits one row naming the evidence, the oracle identity, and the capture date. A symbol without a passing differential test is emitted as unproven, however confident the prose around it was. Run the generator, diff its output against the committed copy, and fail the check when they differ, so the document cannot drift silently.",
    words: 93,
    pattern: "Codify",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 170,
    id: "9.13",
    title: "Clean-Room Provenance Boundary",
    purpose:
      "Keep reference inputs and derived artifacts out of the shipped tree, enforce the boundary with a failing check, and prove a fresh clone rebuilds what it may contain.",
    text: "The replacement has to be distributable without shipping anything derived from the original. Audit the repository for reference inputs, captured traces, oracle outputs, extracted assets, and generated files that have crept into version control, and separate what must stay local from what a contributor legitimately needs. Enforce the boundary with ignore rules and a check that fails on a violation, then prove it the only way that counts: clone into an empty directory, follow the documented setup, and show every step that fails because a required artifact was correctly absent, along with how a contributor is supposed to obtain it.",
    words: 100,
    pattern: "Codify",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 171,
    id: "9.14",
    title: "Interrupted Worktree Recovery",
    purpose:
      "Recover one interrupted worktree's intent from its own diff and failing tests, then integrate it thread by thread without discarding its evidence.",
    text: "This repository has one dirty worktree left by an interrupted session, and I do not want it reset, stashed into oblivion, or squashed into a commit that erases what was learned. Work only from this tree: read the uncommitted diff and untracked files, run the failing tests, and infer what each half-finished change was for. Write that inference down as a short state-of-work note, one thread per change group, with the test that showed each thread unfinished. Then finish one thread at a time, keeping its failure visible until the cause is fixed, and commit each completed thread separately with its evidence.",
    words: 102,
    pattern: "Reconstruct",
    session: "fresh",
    tags: ["fresh-session"],
  },
  {
    order: 172,
    id: "9.15",
    title: "Structural Impossibility Test",
    purpose:
      "Run the experiment that could prove the current approach can never pass acceptance, before investing further in polishing it.",
    text: "Before we invest another week in this approach, run the experiment that could prove it can never meet the acceptance test. Write the acceptance test as an executable check against the original, then identify the one property our approach must have for it to pass—exact arithmetic, observable data, a dependency we can drive—and build the smallest case that isolates that property. If it fails structurally rather than because of a bug, stop the approach, record the measurement that killed it, and propose the replacement with its own kill experiment.",
    words: 89,
    pattern: "Execute",
    session: "in-progress",
    tags: ["in-progress"],
  },
];
