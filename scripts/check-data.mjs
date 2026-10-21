// Validation-only data check, run by `npm run check`. Catches the mistakes
// that actually break when many contributors edit the deck: duplicate ids,
// taxonomy references that point nowhere, prompt records the taxonomy never
// references, missing fields, stored word counts that drift from the text,
// and "Start here" buckets referencing unknown records.
//
// Read-only: it never writes, and it fails the check with a non-zero exit.
import { PROMPTS } from "../data/prompts/index.js";
import { TAXONOMY } from "../data/taxonomy.js";
import { START_HERE } from "../data/featured.js";

const problems = [];

// Collect every id the taxonomy references, per node.
const referenced = [];
for (const cat of TAXONOMY.categories) {
  for (const sub of cat.subcategories) {
    for (const group of sub.groups) {
      for (const id of group.ids) {
        referenced.push({ id, where: `${cat.category}/${sub.name}/${group.name}` });
      }
    }
  }
}

// Unique ids.
const seen = new Map();
for (const row of PROMPTS) {
  if (seen.has(row.id)) {
    problems.push(`duplicate id "${row.id}" (also at order ${seen.get(row.id)})`);
  }
  seen.set(row.id, row.order);
}

// Every record has the required fields with the right shapes.
for (const row of PROMPTS) {
  for (const field of ["id", "title", "purpose", "text", "pattern"]) {
    if (typeof row[field] !== "string" || !row[field].trim()) {
      problems.push(`record "${row.id}": missing or empty "${field}"`);
    }
  }
  if (!Number.isInteger(row.order)) problems.push(`record "${row.id}": "order" is not an integer`);
  if (!Number.isInteger(row.words)) problems.push(`record "${row.id}": "words" is not an integer`);
  if (typeof row.words === "number" && typeof row.text === "string") {
    const derived = row.text.trim().split(/\s+/).length;
    if (derived !== row.words) {
      problems.push(`record "${row.id}": stored words ${row.words}, derived ${derived}`);
    }
  }
}

// Every taxonomy id resolves to exactly one record.
const referencedIds = new Set();
for (const { id, where } of referenced) {
  referencedIds.add(id);
  if (!seen.has(id)) problems.push(`taxonomy ${where} references unknown id "${id}"`);
}

// Every record is referenced by the taxonomy exactly once.
for (const row of PROMPTS) {
  if (!referencedIds.has(row.id)) {
    problems.push(`record "${row.id}" ("${row.title}") is not referenced by the taxonomy`);
  }
}
const refCounts = new Map();
for (const { id } of referenced) refCounts.set(id, (refCounts.get(id) ?? 0) + 1);
for (const [id, count] of refCounts) {
  if (count > 1) problems.push(`id "${id}" is referenced ${count} times by the taxonomy`);
}

// Every "Start here" bucket has a label and hint and references known records.
for (const bucket of START_HERE) {
  if (!bucket.label?.trim() || !bucket.hint?.trim()) {
    problems.push("Start here bucket: missing label or hint");
  }
  for (const id of bucket.ids) {
    if (!seen.has(id)) {
      problems.push(`Start here bucket "${bucket.label}" references unknown id "${id}"`);
    }
  }
}

if (problems.length) {
  console.error(`check-data: ${problems.length} problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log(
  `check-data: ${PROMPTS.length} prompts, ${referenced.length} taxonomy references, all checks pass`,
);
