// scripts/generate-matrix.mjs
// Extracts corpus, measures voice and mechanical profile, analyzes coverage dimensions,
// computes baseline frequencies and marginal gain scores using gain(n) = sqrt(n + 1) - sqrt(n).
import { writeFileSync } from "fs";
import { resolve } from "path";
import { PROMPTS } from "../data/prompts/index.js";

const ROOT = resolve(".");
const OUT_DIR = resolve(ROOT, "batches/run-20261022-01-batch50");

// 1. Mechanical measurements
const wordCounts = PROMPTS.map((p) => p.words).sort((a, b) => a - b);
const totalWords = wordCounts.reduce((a, b) => a + b, 0);
const meanWords = totalWords / wordCounts.length;
const medianWords = wordCounts[Math.floor(wordCounts.length / 2)];
const minWords = wordCounts[0];
const maxWords = wordCounts[wordCounts.length - 1];
const p25Words = wordCounts[Math.floor(wordCounts.length * 0.25)];
const p75Words = wordCounts[Math.floor(wordCounts.length * 0.75)];

// Sentence & punctuation stats
let totalSentences = 0;
let withColons = 0;
let withQuestions = 0;
let withCodeFences = 0;
let withHyphensOrBullets = 0;

for (const p of PROMPTS) {
  const sents = p.text.split(/[.!?]+(?:\s+|$)/).filter((s) => s.trim().length > 0);
  totalSentences += sents.length;
  if (/:/.test(p.text)) withColons++;
  if (/\?/.test(p.text)) withQuestions++;
  if (/```/.test(p.text)) withCodeFences++;
  if (/(?:^|\n)\s*[-*•]|\s+-\s+/.test(p.text)) withHyphensOrBullets++;
}

// Category breakdown
const categoryCounts = {};
for (const p of PROMPTS) {
  const cat = p.id.split(".")[0];
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
}

// Pattern counts across deck & within target categories (1-5)
const targetCats = [
  { id: "1", name: "Coding" },
  { id: "2", name: "Writing" },
  { id: "3", name: "Research" },
  { id: "4", name: "General" },
  { id: "5", name: "Meta" },
];

const patterns = [
  "Execute",
  "Audit",
  "Visualize",
  "Interactive",
  "Parallel agents",
  "Triage",
  "Codify",
  "Reconstruct",
  "Reconcile",
];

const globalPatterns = {};
for (const pat of patterns) globalPatterns[pat] = 0;
for (const p of PROMPTS) globalPatterns[p.pattern] = (globalPatterns[p.pattern] || 0) + 1;

const targetMatrix = {};
for (const c of targetCats) {
  targetMatrix[c.name] = {};
  for (const pat of patterns) targetMatrix[c.name][pat] = 0;
}

for (const p of PROMPTS) {
  const catId = p.id.split(".")[0];
  const tc = targetCats.find((t) => t.id === catId);
  if (tc) {
    targetMatrix[tc.name][p.pattern] = (targetMatrix[tc.name][p.pattern] || 0) + 1;
  }
}

// Session counts
const sessionCounts = { fresh: 0, "in-progress": 0 };
for (const p of PROMPTS) sessionCounts[p.session] = (sessionCounts[p.session] || 0) + 1;

// Marginal gain function
function gain(n) {
  return Math.sqrt(n + 1) - Math.sqrt(n);
}

const patternGainsGlobal = {};
for (const pat of patterns) {
  patternGainsGlobal[pat] = Number(gain(globalPatterns[pat]).toFixed(4));
}

const patternGainsTarget = {};
for (const c of targetCats) {
  patternGainsTarget[c.name] = {};
  for (const pat of patterns) {
    patternGainsTarget[c.name][pat] = Number(gain(targetMatrix[c.name][pat]).toFixed(4));
  }
}

// Identified priority gaps in target categories
const priorityGaps = {
  Coding: [
    {
      pattern: "Reconstruct",
      currentCount: targetMatrix.Coding.Reconstruct,
      gain: patternGainsTarget.Coding.Reconstruct,
      focus:
        "Reverse-engineering undocumented data formats, bytecode/AST structures, and legacy wire protocols from artifacts",
    },
    {
      pattern: "Reconcile",
      currentCount: targetMatrix.Coding.Reconcile,
      gain: patternGainsTarget.Coding.Reconcile,
      focus:
        "Proving zero behavioral divergence between rewrites/migrations (e.g. JS vs Rust/Wasm, ORM vs SQL, or dual parsers)",
    },
    {
      pattern: "Execute",
      currentCount: targetMatrix.Coding.Execute,
      gain: patternGainsTarget.Coding.Execute,
      focus:
        "Direct outcome execution of complex engineering tasks (fuzz harness setup, hermetic build sandboxing, migration scripts)",
    },
    {
      pattern: "Audit",
      currentCount: targetMatrix.Coding.Audit,
      gain: patternGainsTarget.Coding.Audit,
      focus:
        "Deep invariant verification: API idempotency, concurrency races, and memory leak diagnosis",
    },
  ],
  Writing: [
    {
      pattern: "Reconstruct",
      currentCount: targetMatrix.Writing.Reconstruct,
      gain: patternGainsTarget.Writing.Reconstruct,
      focus:
        "Reverse-engineering unstated editorial guidelines, voice signatures, and narrative frameworks from exemplar corpora",
    },
    {
      pattern: "Reconcile",
      currentCount: targetMatrix.Writing.Reconcile,
      gain: patternGainsTarget.Writing.Reconcile,
      focus:
        "Reconciling divergent editorial drafts or verifying that technical revisions preserve semantic truth against copyedits",
    },
    {
      pattern: "Audit",
      currentCount: targetMatrix.Writing.Audit,
      gain: patternGainsTarget.Writing.Audit,
      focus:
        "Auditing jargon density, unstated syllogisms, and documentation drift against actual code APIs",
    },
    {
      pattern: "Interactive",
      currentCount: targetMatrix.Writing.Interactive,
      gain: patternGainsTarget.Writing.Interactive,
      focus: "Socratic interview workflows to elicit counter-arguments and steelman thesis claims",
    },
  ],
  Research: [
    {
      pattern: "Reconstruct",
      currentCount: targetMatrix.Research.Reconstruct,
      gain: patternGainsTarget.Research.Reconstruct,
      focus:
        "Reconstructing undocumented experimental pipelines and methodology steps from published tables and charts",
    },
    {
      pattern: "Reconcile",
      currentCount: targetMatrix.Research.Reconcile,
      gain: patternGainsTarget.Research.Reconcile,
      focus:
        "Reconciling conflicting empirical findings across disparate papers and identifying differing confounding variables",
    },
    {
      pattern: "Audit",
      currentCount: targetMatrix.Research.Audit,
      gain: patternGainsTarget.Research.Audit,
      focus:
        "Auditing statistical methodology for p-hacking, missing baseline controls, and selection bias",
    },
    {
      pattern: "Triage",
      currentCount: targetMatrix.Research.Triage,
      gain: patternGainsTarget.Research.Triage,
      focus:
        "Triaging dense research preprints by evidentiary rigor and statistical reproducibility",
    },
  ],
  General: [
    {
      pattern: "Reconstruct",
      currentCount: targetMatrix.General.Reconstruct,
      gain: patternGainsTarget.General.Reconstruct,
      focus:
        "Reconstructing undocumented organizational processes and handoffs from meeting minutes and email threads",
    },
    {
      pattern: "Reconcile",
      currentCount: targetMatrix.General.Reconcile,
      gain: patternGainsTarget.General.Reconcile,
      focus:
        "Reconciling discrepancies between invoices, purchase orders, statements, and contract fee tables",
    },
    {
      pattern: "Audit",
      currentCount: targetMatrix.General.Audit,
      gain: patternGainsTarget.General.Audit,
      focus:
        "Auditing terms-of-service and vendor privacy policy revisions for unexpected data-sharing obligations",
    },
    {
      pattern: "Visualize",
      currentCount: targetMatrix.General.Visualize,
      gain: patternGainsTarget.General.Visualize,
      focus:
        "Generating self-contained interactive bottleneck maps for multi-stakeholder operational workflows",
    },
  ],
  Meta: [
    {
      pattern: "Reconstruct",
      currentCount: targetMatrix.Meta.Reconstruct,
      gain: patternGainsTarget.Meta.Reconstruct,
      focus:
        "Reverse-engineering implicit prompt guidelines and refusal boundaries from observed black-box model completions",
    },
    {
      pattern: "Reconcile",
      currentCount: targetMatrix.Meta.Reconcile,
      gain: patternGainsTarget.Meta.Reconcile,
      focus:
        "Reconciling behavioral differences between model upgrades or prompt variants under regression test suites",
    },
    {
      pattern: "Execute",
      currentCount: targetMatrix.Meta.Execute,
      gain: patternGainsTarget.Meta.Execute,
      focus:
        "Executing autonomous harness benchmarks and sub-agent stress harnesses with hard verification gates",
    },
    {
      pattern: "Visualize",
      currentCount: targetMatrix.Meta.Visualize,
      gain: patternGainsTarget.Meta.Visualize,
      focus:
        "Interactive token burn rate, cache utilization, and context decay maps for long agent threads",
    },
  ],
};

const matrixData = {
  version: "1.0.0",
  corpusTotal: PROMPTS.length,
  canonicalTotal: PROMPTS.length,
  stagedTotal: 0,
  voiceProfile: {
    lengthPolicy: {
      min: minWords,
      p25: p25Words,
      median: medianWords,
      mean: Math.round(meanWords),
      p75: p75Words,
      max: maxWords,
      targetBand: "50-115 words",
    },
    syntax: {
      avgSentences: Number((totalSentences / PROMPTS.length).toFixed(1)),
      avgWordsPerSentence: Number((totalWords / totalSentences).toFixed(1)),
      withColons,
      withQuestions,
      withCodeFences,
      withHyphensOrBullets,
      rule: "Imperative prose without markdown bullet lists or code fences in prompt text",
    },
    placeholders: {
      count: 0,
      convention:
        "Zero template slots. Direct context references to workspace artifacts, repositories, drafts, and traces.",
    },
  },
  taxonomyBreakdown: {
    categoryCounts,
    globalPatterns,
    targetMatrix,
    sessionCounts,
  },
  gainAnalysis: {
    globalPatternGains: patternGainsGlobal,
    targetCategoryGains: patternGainsTarget,
    priorityGaps,
  },
};

writeFileSync(resolve(OUT_DIR, "analysis-matrix.json"), JSON.stringify(matrixData, null, 2));
console.log(`Generated ${resolve(OUT_DIR, "analysis-matrix.json")} successfully.`);
