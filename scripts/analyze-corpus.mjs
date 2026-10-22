// Comprehensive corpus analysis script for prompt-pack.
// Extracts all canonical prompts, measures mechanical/voice traits,
// analyzes coverage parameters, and computes gap scores for batch selection.
import { writeFileSync } from "fs";
import { resolve } from "path";
import { PROMPTS } from "../data/prompts/index.js";

const ROOT = resolve(".");

console.log(`Analyzing canonical corpus: ${PROMPTS.length} prompts across 13 categories...`);

// 1. Mechanical & voice profile measurements
const wordCounts = PROMPTS.map((p) => p.words);
wordCounts.sort((a, b) => a - b);

const sum = (arr) => arr.reduce((acc, x) => acc + x, 0);
const mean = sum(wordCounts) / wordCounts.length;
const median = wordCounts[Math.floor(wordCounts.length / 2)];
const minWords = wordCounts[0];
const maxWords = wordCounts[wordCounts.length - 1];
const p25 = wordCounts[Math.floor(wordCounts.length * 0.25)];
const p75 = wordCounts[Math.floor(wordCounts.length * 0.75)];

// Sentence counts and punctuation
let totalSentences = 0;
let totalChars = 0;
let withCodeFences = 0;
let withQuestions = 0;
let withColons = 0;
let withHyphensOrBullets = 0;

for (const p of PROMPTS) {
  totalChars += p.text.length;
  const sents = p.text.split(/[.!?]+(?:\s+|$)/).filter((s) => s.trim().length > 0);
  totalSentences += sents.length;
  if (/```/.test(p.text)) withCodeFences++;
  if (/\?/.test(p.text)) withQuestions++;
  if (/:/.test(p.text)) withColons++;
  if (/(?:^|\n)\s*[-*•]|\s+-\s+/.test(p.text)) withHyphensOrBullets++;
}

const avgSentencesPerPrompt = (totalSentences / PROMPTS.length).toFixed(1);
const avgWordsPerSentence = (sum(wordCounts) / totalSentences).toFixed(1);
const avgCharsPerWord = (totalChars / sum(wordCounts)).toFixed(1);

// Category breakdown
const categoryCounts = {};
for (const p of PROMPTS) {
  const catId = p.id.split(".")[0];
  categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
}

// Pattern distribution
const patternCounts = {};
for (const p of PROMPTS) {
  patternCounts[p.pattern] = (patternCounts[p.pattern] || 0) + 1;
}

// Session distribution
const sessionCounts = { fresh: 0, "in-progress": 0 };
for (const p of PROMPTS) {
  sessionCounts[p.session] = (sessionCounts[p.session] || 0) + 1;
}

// Pattern distribution per category for Cats 1-5
const targetCats = [
  { id: "1", name: "Coding" },
  { id: "2", name: "Writing" },
  { id: "3", name: "Research" },
  { id: "4", name: "General" },
  { id: "5", name: "Meta" },
];

const patternsList = [
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

const matrix = {};
for (const cat of targetCats) {
  matrix[cat.name] = {};
  for (const pat of patternsList) {
    matrix[cat.name][pat] = 0;
  }
}

for (const p of PROMPTS) {
  const catId = p.id.split(".")[0];
  const target = targetCats.find((t) => t.id === catId);
  if (target) {
    matrix[target.name][p.pattern] = (matrix[target.name][p.pattern] || 0) + 1;
  }
}

console.log("\n=== Patterns in Target Categories (Existing N=128 across Cats 1-5) ===");
console.table(matrix);

console.log("\n=== Global Word Count Stats ===");
console.log({ minWords, p25, median, mean: Math.round(mean), p75, maxWords });
console.log({
  avgSentencesPerPrompt,
  avgWordsPerSentence,
  avgCharsPerWord,
  withQuestions,
  withColons,
  withHyphensOrBullets,
  withCodeFences,
});

// Output comprehensive summary JSON for continuity and review
const analysisResult = {
  timestamp: "2026-10-22",
  corpusSize: PROMPTS.length,
  canonicalPrompts: PROMPTS.length,
  stagedPrompts: 0,
  categoryCounts,
  patternCounts,
  sessionCounts,
  wordCountDistribution: { minWords, p25, median, mean: Math.round(mean), p75, maxWords },
  targetCategoryPatterns: matrix,
  styleStats: {
    avgSentencesPerPrompt: Number(avgSentencesPerPrompt),
    avgWordsPerSentence: Number(avgWordsPerSentence),
    avgCharsPerWord: Number(avgCharsPerWord),
    withQuestions,
    withColons,
    withHyphensOrBullets,
    withCodeFences,
  },
};

writeFileSync(resolve(ROOT, "corpus-analysis.json"), JSON.stringify(analysisResult, null, 2));
console.log("\nWrote corpus-analysis.json successfully.");
