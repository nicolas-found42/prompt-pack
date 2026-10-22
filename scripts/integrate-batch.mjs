// scripts/integrate-batch.mjs
// Integrates the 50 staged prompts from run-20261022-01-batch50 into data/prompts/
// and updates data/taxonomy.js with the mapped groups.
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(".");
const BATCH_DIR = resolve(ROOT, "batches/run-20261022-01-batch50");
const batchRows = JSON.parse(readFileSync(resolve(BATCH_DIR, "batch-rows.json"), "utf8"));

// 1. Helper to format a prompt record as clean JS code matching data/prompts/*.js style
function formatPromptBlock(p) {
  const jsonText = JSON.stringify(p.text);
  const jsonTitle = JSON.stringify(p.title);
  const jsonPurpose = JSON.stringify(p.purpose);
  return `  {
    order: ${p.order},
    id: "${p.id}",
    title: ${jsonTitle},
    purpose: ${jsonPurpose},
    text: ${jsonText},
    words: ${p.words},
    pattern: "${p.pattern}",
    session: "${p.session}",
    tags: ${JSON.stringify(p.tags)},
  },`;
}

// 2. Append to each category file
const categoryFiles = {
  1: "data/prompts/coding.js",
  2: "data/prompts/writing.js",
  3: "data/prompts/research.js",
  4: "data/prompts/general.js",
  5: "data/prompts/meta.js",
};

for (const [catNum, filePath] of Object.entries(categoryFiles)) {
  const catRows = batchRows.filter((r) => r.id.startsWith(catNum + "."));
  const fullPath = resolve(ROOT, filePath);
  let content = readFileSync(fullPath, "utf8");

  // Find the closing array bracket `];`
  const lastBracketIndex = content.lastIndexOf("];");
  if (lastBracketIndex === -1) throw new Error(`Could not find closing bracket in ${filePath}`);

  const formattedBlocks = catRows.map(formatPromptBlock).join("\n");
  const updatedContent =
    content.slice(0, lastBracketIndex) + formattedBlocks + "\n" + content.slice(lastBracketIndex);

  writeFileSync(fullPath, updatedContent);
  console.log(`Appended ${catRows.length} prompts to ${filePath}`);
}

// 3. Update data/taxonomy.js
// We load TAXONOMY, insert the new nodes/ids into TAXONOMY, and serialize it back cleanly.
import("../data/taxonomy.js").then(({ TAXONOMY }) => {
  // --- Category 1: Coding ---
  const coding = TAXONOMY.categories.find((c) => c.category === "Coding");
  // Existing group additions
  coding.subcategories
    .find((s) => s.name === "Guided Refinement")
    .groups.find((g) => g.name === "Rival Solutions")
    .ids.push("1.34");

  coding.subcategories
    .find((s) => s.name === "Interface & API Quality")
    .groups.find((g) => g.name === "Contribution Review")
    .ids.push("1.35");

  coding.subcategories
    .find((s) => s.name === "Resource Efficiency")
    .groups.find((g) => g.name === "Cost Visibility")
    .ids.push("1.33");

  coding.subcategories
    .find((s) => s.name === "Systemic Hardening")
    .groups.find((g) => g.name === "Blanket Sweeps")
    .ids.push("1.32");

  // New subcategories in Coding
  coding.subcategories.push({
    name: "Artifact & Contract Recovery",
    summary: "Reverse-engineer legacy wire protocols, AST grammars, and untyped payloads",
    groups: [
      {
        name: "Protocol & Format Recovery",
        summary: "Decode binary frames, serialized bytecode, and untyped schemas",
        ids: ["1.28", "1.29", "1.37"],
      },
    ],
  });

  coding.subcategories.push({
    name: "Implementation Parity",
    summary: "Reconcile dual engines, query builders, and database migration rollbacks",
    groups: [
      {
        name: "Behavior Reconciliation",
        summary: "Prove zero semantic divergence across parsers, queries, and schema rollbacks",
        ids: ["1.30", "1.31", "1.36"],
      },
    ],
  });

  // --- Category 2: Writing ---
  const writing = TAXONOMY.categories.find((c) => c.category === "Writing");
  writing.subcategories
    .find((s) => s.name === "Draft Origination")
    .groups.find((g) => g.name === "Raw Material Synthesis")
    .ids.push("2.27", "2.32");

  writing.subcategories
    .find((s) => s.name === "Editorial Momentum")
    .groups.find((g) => g.name === "Author Questioning")
    .ids.push("2.33");

  writing.subcategories
    .find((s) => s.name === "Structural Diagnostics")
    .groups.find((g) => g.name === "Pacing Calibration")
    .ids.push("2.30");

  writing.subcategories
    .find((s) => s.name === "Signature Voice")
    .groups.find((g) => g.name === "Voice Distillation")
    .ids.push("2.26", "2.34");

  writing.subcategories
    .find((s) => s.name === "Critical Scrutiny")
    .groups.find((g) => g.name === "Gap Detection")
    .ids.push("2.31");

  writing.subcategories.push({
    name: "Editorial Reconciliation & Archaeology",
    summary: "Reconcile revisions against original meaning and recover lost draft iterations",
    groups: [
      {
        name: "Truth & Drift Reconciliation",
        summary: "Verify prose revisions preserve technical facts and documentation matches code",
        ids: ["2.28", "2.29"],
      },
      {
        name: "Revision Archaeology",
        summary: "Reconstruct discarded arguments and thesis evolution from commit histories",
        ids: ["2.35"],
      },
    ],
  });

  // --- Category 3: Research ---
  const research = TAXONOMY.categories.find((c) => c.category === "Research");
  research.subcategories
    .find((s) => s.name === "Inquiry Groundwork")
    .groups.find((g) => g.name === "Inquiry Framing")
    .ids.push("3.33");

  research.subcategories
    .find((s) => s.name === "Research Integrity")
    .groups.find((g) => g.name === "Statement Verification")
    .ids.push("3.30", "3.35");

  research.subcategories
    .find((s) => s.name === "Source Standards")
    .groups.find((g) => g.name === "Source Prioritization")
    .ids.push("3.31");

  research.subcategories
    .find((s) => s.name === "Hypothesis Refinement")
    .groups.find((g) => g.name === "Delegated Validation")
    .ids.push("3.32");

  research.subcategories
    .find((s) => s.name === "Evidence Models")
    .groups.find((g) => g.name === "Assumption Simulators")
    .ids.push("3.34");

  research.subcategories
    .find((s) => s.name === "Decision & Competitive Evidence")
    .groups.find((g) => g.name === "Competitive & Context Intel")
    .ids.push("3.29");

  research.subcategories.push({
    name: "Empirical Reconstruction & Reconciliation",
    summary: "Reconstruct undocumented study pipelines and reconcile contradictory findings",
    groups: [
      {
        name: "Protocol Reconstruction",
        summary: "Reverse-engineer data pipelines and evaluation benchmark harnesses",
        ids: ["3.26", "3.27"],
      },
      {
        name: "Empirical Reconciliation",
        summary: "Isolate confounders behind conflicting study findings",
        ids: ["3.28"],
      },
    ],
  });

  // --- Category 4: General ---
  const general = TAXONOMY.categories.find((c) => c.category === "General");
  general.subcategories
    .find((s) => s.name === "Personal Operations")
    .groups.find((g) => g.name === "Safe Handoffs")
    .ids.push("4.32");

  general.subcategories
    .find((s) => s.name === "Forward Reconnaissance")
    .groups.find((g) => g.name === "Hidden Structure")
    .ids.push("4.33");

  general.subcategories
    .find((s) => s.name === "Operational Hardening")
    .groups.find((g) => g.name === "Failure Mapping")
    .ids.push("4.31", "4.34");

  general.subcategories
    .find((s) => s.name === "Money & Major Decisions")
    .groups.find((g) => g.name === "Spend & Purchase Triage")
    .ids.push("4.28", "4.29");

  general.subcategories
    .find((s) => s.name === "Money & Major Decisions")
    .groups.find((g) => g.name === "Contract & Career Moves")
    .ids.push("4.30", "4.35");

  general.subcategories.push({
    name: "Process & Policy Reconstruction",
    summary: "Reconstruct undocumented team workflows and the historical context of policies",
    groups: [
      {
        name: "Workflow & Policy Archaeology",
        summary: "Reverse-engineer operational SOPs and legacy policy decisions",
        ids: ["4.26", "4.27"],
      },
    ],
  });

  // --- Category 5: Meta ---
  const meta = TAXONOMY.categories.find((c) => c.category === "Meta");
  meta.subcategories
    .find((s) => s.name === "Harness Introspection")
    .groups.find((g) => g.name === "Failure Diagnostics")
    .ids.push("5.34");

  meta.subcategories
    .find((s) => s.name === "Practice Review")
    .groups.find((g) => g.name === "Prompting Habits")
    .ids.push("5.33");

  meta.subcategories
    .find((s) => s.name === "Execution Refinement")
    .groups.find((g) => g.name === "Contender Comparison")
    .ids.push("5.29", "5.35");

  meta.subcategories
    .find((s) => s.name === "Self Oversight")
    .groups.find((g) => g.name === "Rule Maintenance")
    .ids.push("5.31", "5.36");

  meta.subcategories
    .find((s) => s.name === "Self Oversight")
    .groups.find((g) => g.name === "Outcome Assurance")
    .ids.push("5.30");

  meta.subcategories
    .find((s) => s.name === "Cost & Effectiveness")
    .groups.find((g) => g.name === "Spend & Session Health")
    .ids.push("5.32");

  meta.subcategories.push({
    name: "Agent State & Prompt Reverse-Engineering",
    summary:
      "Reconstruct hidden system prompts, refusal boundaries, and truncated conversation context",
    groups: [
      {
        name: "Prompt & State Reconstruction",
        summary: "Recover system directives and truncated session checkpoints",
        ids: ["5.27", "5.28"],
      },
    ],
  });

  // Write updated taxonomy
  const taxHeader = `// The navigation hierarchy: Category -> Subcategory -> Group -> prompt.
// Ids reference entries in data/prompts/index.js. Every prompt id belongs to exactly one group.

export const TAXONOMY = `;
  writeFileSync(
    resolve(ROOT, "data/taxonomy.js"),
    taxHeader + JSON.stringify(TAXONOMY, null, 2) + ";\n",
  );
  console.log("Updated data/taxonomy.js successfully.");

  // 4. Update manifest status
  const manifestPath = resolve(BATCH_DIR, "manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  manifest.status = "integrated";
  manifest.integratedAt = "2026-10-22";
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`Updated ${manifestPath} status to "integrated".`);
});
