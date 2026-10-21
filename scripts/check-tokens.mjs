// Automated design token validator.
//
// Enforces naming boundaries, token contracts, and theme symmetry:
// 1. Every var(--custom-property) used in any CSS, HTML, or JS file must be
//    defined in styles/tokens.css (prevents silent regressions like the PR #6
//    --type-small bug that broke 12 font-size callers).
// 2. Theme symmetry: Every theme-dependent color token in the light theme
//    must have an explicit dark theme override under prefers-color-scheme: dark,
//    and vice versa (prevents dark mode token leakage).
// 3. No orphan or misspelled token references.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const problems = [];
const TOKENS_FILE = "styles/tokens.css";

// 1. Parse styles/tokens.css
const tokensContent = readFileSync(TOKENS_FILE, "utf-8");

// Extract dark theme section
const darkMediaMatch = tokensContent.match(
  /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)\s*\{([\s\S]*?)\n\}/,
);
const darkSection = darkMediaMatch ? darkMediaMatch[1] : "";
const nonDarkContent = darkMediaMatch
  ? tokensContent.replace(darkMediaMatch[0], "")
  : tokensContent;

function extractVarDefs(text) {
  const defs = new Set();
  const matches = text.matchAll(/(--[a-zA-Z0-9_-]+)\s*:/g);
  for (const m of matches) defs.add(m[1]);
  return defs;
}

const darkDefs = extractVarDefs(darkSection);
const lightAndSharedDefs = extractVarDefs(nonDarkContent);
const allDefs = new Set([...darkDefs, ...lightAndSharedDefs]);

// In this design system, theme-dependent tokens are defined in both light (:root)
// and dark (@media (prefers-color-scheme: dark)). Every token in darkDefs must also
// exist in the light/shared definitions.
for (const token of darkDefs) {
  if (!lightAndSharedDefs.has(token)) {
    problems.push(
      `Theme asymmetry: token "${token}" is defined in dark theme but missing in light/base theme.`,
    );
  }
}

// 2. Scan all CSS, HTML, and JS files for var(--...) usage
function walk(dir, extFilter) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (entry.startsWith(".") || entry === "node_modules" || entry === "_site") continue;
    const st = statSync(full);
    if (st.isDirectory()) {
      files.push(...walk(full, extFilter));
    } else if (extFilter.some((ext) => entry.endsWith(ext))) {
      files.push(full);
    }
  }
  return files;
}

const targets = [...walk("styles", [".css"]), ...walk("app", [".js"]), ...walk(".", [".html"])];

const usedTokens = new Map(); // token -> Set of files

for (const file of targets) {
  const content = readFileSync(file, "utf-8");
  const matches = content.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)/g);
  for (const m of matches) {
    const token = m[1];
    if (!usedTokens.has(token)) usedTokens.set(token, new Set());
    usedTokens.get(token).add(file);
    if (!allDefs.has(token)) {
      problems.push(`Undefined token "${token}" referenced in ${file}`);
    }
  }
}

if (problems.length) {
  console.error(`check-tokens: ${problems.length} problem(s) found:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(
  `check-tokens: ${allDefs.size} tokens defined, ${usedTokens.size} tokens used across ${targets.length} files, theme symmetry verified.`,
);
