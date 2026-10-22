// scripts/build-cards.mjs
// Formats the 50 batch rows into human-readable cards grouped by category,
// matching the prompt deck's presentation format.
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(".");
const OUT_DIR = resolve(ROOT, "batches/run-20261022-01-batch50");
const rows = JSON.parse(readFileSync(resolve(OUT_DIR, "batch-rows.json"), "utf8"));

const CATEGORY_MAP = {
  1: "Coding",
  2: "Writing",
  3: "Research",
  4: "General",
  5: "Meta",
};

let md = "# Human-Readable Cards: Batch run-20261022-01-batch50\n\n";

for (const [catNum, catName] of Object.entries(CATEGORY_MAP)) {
  const catRows = rows.filter((r) => r.id.startsWith(catNum + "."));
  md += `## Category: ${catName} (${catRows.length} prompts)\n\n`;

  for (const r of catRows) {
    const sessionLabel = r.session === "fresh" ? "Fresh session" : "In-progress";
    md += `### [${r.id}] ${r.title}\n\n`;
    md += `- **ID**: ${r.id}\n`;
    md += `- **Order**: ${r.order}\n`;
    md += `- **Category**: ${catName}\n`;
    md += `- **Pattern**: ${r.pattern}\n`;
    md += `- **Session**: ${sessionLabel}\n`;
    md += `- **Word count**: ${r.words} words\n`;
    md += `- **Purpose**: ${r.purpose}\n\n`;
    md += `**Prompt text**:\n\n> ${r.text}\n\n---\n\n`;
  }
}

writeFileSync(resolve(OUT_DIR, "batch-cards.md"), md);
console.log(`Generated ${resolve(OUT_DIR, "batch-cards.md")} successfully.`);
