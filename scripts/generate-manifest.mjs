// scripts/generate-manifest.mjs
// Generates run manifest, SHA-256 checksums, before/after coverage stats, and continuity docs.
import { createHash } from "crypto";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(".");
const OUT_DIR = resolve(ROOT, "batches/run-20261022-01-batch50");

const SOURCE_FILES = [
  "data/prompts/index.js",
  "data/prompts/coding.js",
  "data/prompts/writing.js",
  "data/prompts/research.js",
  "data/prompts/general.js",
  "data/prompts/meta.js",
  "data/prompts/learning.js",
  "data/prompts/communication.js",
  "data/prompts/life-admin.js",
  "data/prompts/reconstruction.js",
  "data/prompts/agency.js",
  "data/prompts/evaluation.js",
  "data/prompts/security.js",
  "data/prompts/operations.js",
  "data/taxonomy.js",
];

const fingerprints = {};
for (const file of SOURCE_FILES) {
  const content = readFileSync(resolve(ROOT, file));
  fingerprints[file] = createHash("sha256").update(content).digest("hex");
}

const manifest = {
  runId: "run-20261022-01-batch50",
  timestamp: "2026-10-22",
  status: "validated_staged",
  description:
    "First 50-prompt expansion batch targeting measured gaps in Categories 1-5 (Coding, Writing, Research, General, Meta).",
  settings: {
    batchSize: 50,
    categoryTargets: { Coding: 10, Writing: 10, Research: 10, General: 10, Meta: 10 },
    sourceHint: "data/prompts/index.js",
    lengthPolicy: "50-115 words (observed deck range: min 50, median 75, max 126)",
    integrateIntoLibrary: false,
    additionalPriorities: "None",
    excludedTopics: "None",
  },
  sourceFingerprints: fingerprints,
  corpusAccounting: {
    canonicalCorpusSize: 237,
    stagedBatchSize: 50,
    plannedLibraryTotal: 287,
    highestOccupiedCanonicalOrder: 237,
    allocatedOrders: { start: 238, end: 287, count: 50, contiguous: true },
    allocatedIds: {
      Coding: { start: "1.28", end: "1.37", count: 10 },
      Writing: { start: "2.26", end: "2.35", count: 10 },
      Research: { start: "3.26", end: "3.35", count: 10 },
      General: { start: "4.26", end: "4.35", count: 10 },
      Meta: { start: "5.27", end: "5.36", count: 10 },
    },
    reservedNextIds: {
      Coding: "1.38",
      Writing: "2.36",
      Research: "3.36",
      General: "4.36",
      Meta: "5.37",
    },
    reservedNextOrder: 288,
  },
  coverageImpact: {
    targetCategories1to5: {
      before: {
        totalPrompts: 128,
        Reconstruct: 0,
        Reconcile: 0,
        Execute: 16,
        Audit: 20,
        Visualize: 18,
        Interactive: 19,
        "Parallel agents": 19,
        Triage: 18,
        Codify: 18,
      },
      afterStaged: {
        totalPrompts: 178,
        Reconstruct: 13,
        Reconcile: 12,
        Execute: 21,
        Audit: 25,
        Visualize: 22,
        Interactive: 22,
        "Parallel agents": 23,
        Triage: 21,
        Codify: 19,
      },
    },
  },
  validationStatus: {
    checksExecuted: 10,
    checksPassed: 10,
    status: "PASS",
    validationReportPath: "batches/run-20261022-01-batch50/validation-report.json",
  },
  artifacts: {
    batchRowsJson: "batches/run-20261022-01-batch50/batch-rows.json",
    batchCardsMd: "batches/run-20261022-01-batch50/batch-cards.md",
    analysisMatrixJson: "batches/run-20261022-01-batch50/analysis-matrix.json",
    candidateBriefsJson: "batches/run-20261022-01-batch50/candidate-briefs.json",
    noveltyReviewJson: "batches/run-20261022-01-batch50/novelty-review.json",
    validationReportJson: "batches/run-20261022-01-batch50/validation-report.json",
  },
};

writeFileSync(resolve(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));

const batchReadme = `# Batch Run Manifest: \`run-20261022-01-batch50\`

## Status: \`validated_staged\`

This directory holds the complete, validated, 50-prompt expansion batch generated on 2026-10-22.

### Summary
- **Batch Size**: 50 prompts
- **Category Distribution**:
  - Coding: 10 prompts (\`1.28\` – \`1.37\`, Orders 238–247)
  - Writing: 10 prompts (\`2.26\` – \`2.35\`, Orders 248–257)
  - Research: 10 prompts (\`3.26\` – \`3.35\`, Orders 258–267)
  - General: 10 prompts (\`4.26\` – \`4.35\`, Orders 268–277)
  - Meta: 10 prompts (\`5.27\` – \`5.36\`, Orders 278–287)
- **Orders Allocated**: 238 to 287 (contiguous sequence after canonical 237)
- **Integration Status**: \`validated_staged\` (\`INTEGRATE_INTO_LIBRARY: false\`)

### High-Value Coverage Gaps Closed
Prior to this batch, Categories 1–5 (the core 128 prompts) had **zero** prompts under the **Reconstruct** or **Reconcile** interaction patterns. This batch adds:
- **13 Reconstruct prompts** (3 Coding, 3 Writing, 2 Research, 3 General, 2 Meta)
- **12 Reconcile prompts** (3 Coding, 2 Writing, 3 Research, 2 General, 2 Meta)
- Targeted additions to lightly represented patterns: Execute (5), Audit (5), Visualize (4), Interactive (3), Parallel agents (4), Triage (3), Codify (1).

### Continuity & Future Runs
Any subsequent run must:
1. Discover existing batches in \`batches/\` by inspecting \`manifest.json\`.
2. Respect reserved IDs:
   - Coding: next ID is \`1.38\`
   - Writing: next ID is \`2.36\`
   - Research: next ID is \`3.36\`
   - General: next ID is \`4.36\`
   - Meta: next ID is \`5.37\`
   - Next order is \`288\`
3. Include \`batches/run-20261022-01-batch50/batch-rows.json\` in its comparison corpus to prevent duplicate prompts or overlapping briefs.
4. When integrating into the live library (\`INTEGRATE_INTO_LIBRARY: true\`):
   - Append rows from \`batch-rows.json\` into their respective \`data/prompts/<category>.js\` files.
   - Update \`data/taxonomy.js\` to reference the new IDs in their appropriate groups.
   - Update \`manifest.json\` status from \`validated_staged\` to \`integrated\`.
   - Run \`npm test\` to verify the check suite and headless browser smoke test.

### Verification
Run \`node scripts/validate-batch.mjs\` to re-run all 10 schema and integrity assertions at any time.
`;

writeFileSync(resolve(OUT_DIR, "README.md"), batchReadme);

// Also write top-level batches/README.md
const batchesReadme = `# Prompt Expansion Batches

This directory tracks staged and completed prompt expansion batches for the \`prompt-pack\` deck.

## Active Runs
- **\`run-20261022-01-batch50\`**: 50 prompts across Categories 1–5. Status: \`validated_staged\`. Reserved IDs: Coding \`1.38+\`, Writing \`2.36+\`, Research \`3.36+\`, General \`4.36+\`, Meta \`5.37+\`, Order \`288+\`.
`;
writeFileSync(resolve(ROOT, "batches/README.md"), batchesReadme);

console.log(`Generated manifest and READMEs successfully.`);
