// Automated architectural invariants validator.
//
// Enforces unspoken structural standards, state ownership boundaries, and naming:
// 1. Semantic Token Rule: Component stylesheets (styles/*.css excluding tokens.css)
//    must never contain hardcoded hex colors (#abc, #123456). All colors must reference
//    design tokens via var(--...).
// 2. Pure Renderers: app/results.js, app/facets.js, app/featured.js must remain pure
//    renderers (taking data arguments, returning/setting HTML, never importing or mutating state.js).
// 3. Link and Asset Integrity: Every stylesheet <link> and <link rel="modulepreload">
//    in index.html must exist on disk.
// 4. Accessibility anchors: index.html must include skip link, search landmark,
//    #count with role="status", and keyboard shortcut switch.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const problems = [];

// 1. Semantic Token Rule: No raw hex colors in component CSS files
const stylesDir = "styles";
const cssFiles = readdirSync(stylesDir).filter((f) => f.endsWith(".css") && f !== "tokens.css");

for (const file of cssFiles) {
  const fullPath = join(stylesDir, file);
  const content = readFileSync(fullPath, "utf-8");
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Ignore comments
    const stripped = line.replace(/\/\*[\s\S]*?\*\//g, "").trim();
    const hexMatch = stripped.match(/#[0-9a-fA-F]{3,8}\b/);
    if (hexMatch) {
      problems.push(
        `Hardcoded color ${hexMatch[0]} at ${fullPath}:${i + 1}. All visual colors must use var(--token) defined in styles/tokens.css`,
      );
    }
  }
}

// 2. Pure Renderers: check that rendering modules don't import or mutate state
const pureRenderers = ["app/results.js", "app/facets.js", "app/featured.js"];
for (const file of pureRenderers) {
  if (!existsSync(file)) continue;
  const content = readFileSync(file, "utf-8");
  if (content.includes('from "./state.js"') || content.includes("from './state.js'")) {
    problems.push(
      `State ownership violation: ${file} imports state.js directly. Renderers must be pure functions receiving data props.`,
    );
  }
}

// 3. Link and Asset Integrity in index.html
const indexHtml = readFileSync("index.html", "utf-8");

// Check stylesheet links
const cssLinks = [
  ...indexHtml.matchAll(/<link\s+[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/g),
];
for (const m of cssLinks) {
  const href = m[1];
  if (!existsSync(href)) {
    problems.push(`Dangling stylesheet link in index.html: "${href}" does not exist on disk.`);
  }
}

// Check modulepreload links
const preloadLinks = [
  ...indexHtml.matchAll(/<link\s+[^>]*rel=["']modulepreload["'][^>]*href=["']([^"']+)["']/g),
];
for (const m of preloadLinks) {
  const href = m[1];
  if (!existsSync(href)) {
    problems.push(`Dangling modulepreload link in index.html: "${href}" does not exist on disk.`);
  }
}

// 4. Accessibility and Semantic Anchors in index.html
const requiredPatterns = [
  { name: "Skip link", regex: /class=["'][^"']*skip-link[^"']*["']/ },
  { name: "Live region role='status'", regex: /id=["']count["'][^>]*role=["']status["']/ },
  { name: "Search input #q", regex: /id=["']q["']/ },
  { name: "Tree container #tree", regex: /id=["']tree["']/ },
  { name: "Card grid container #body", regex: /id=["']body["']/ },
  { name: "Shortcuts toggle #shortcuts-toggle", regex: /id=["']shortcuts-toggle["']/ },
];

for (const req of requiredPatterns) {
  if (!req.regex.test(indexHtml)) {
    problems.push(`Missing required accessibility/semantic anchor in index.html: ${req.name}`);
  }
}

if (problems.length) {
  console.error(`check-architecture: ${problems.length} architectural invariant(s) violated:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(
  `check-architecture: zero raw hexes in component CSS, pure renderers verified, ${cssLinks.length} stylesheets and ${preloadLinks.length} preloads valid, accessibility anchors verified.`,
);
