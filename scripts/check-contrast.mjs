// Automated WCAG 2.2 contrast validator.
//
// Computes exact relative luminance and contrast ratios for all core color pairs
// in styles/tokens.css across both Light and Dark themes:
// - WCAG 2.2 SC 1.4.3 (Level AA): Text contrast >= 4.5:1 (--ink, --muted, --link on --bg / --surface)
// - WCAG 2.2 SC 1.4.11 (Level AA): Non-text UI boundaries >= 3.0:1 (--line on --bg / --surface)
//
// Fails with exit code 1 if any token pair regresses below compliance.

import { readFileSync } from "node:fs";

const TOKENS_FILE = "styles/tokens.css";
const content = readFileSync(TOKENS_FILE, "utf-8");

function parseHex(hexStr) {
  const hex = hexStr.trim().replace(/^#/, "");
  if (hex.length === 3) {
    return [
      parseInt(hex[0] + hex[0], 16) / 255,
      parseInt(hex[1] + hex[1], 16) / 255,
      parseInt(hex[2] + hex[2], 16) / 255,
    ];
  }
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
}

function linearize(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(rgb) {
  const [r, g, b] = rgb.map(linearize);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(parseHex(hex1));
  const l2 = relativeLuminance(parseHex(hex2));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Extract color maps for light and dark
function extractHexColors(block) {
  const colors = {};
  const matches = block.matchAll(/(--[a-zA-Z0-9_-]+)\s*:\s*(#[0-9a-fA-F]{3,8})/g);
  for (const m of matches) {
    colors[m[1].replace(/^--/, "")] = m[2];
  }
  return colors;
}

const darkMediaMatch = content.match(
  /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)\s*\{([\s\S]*?)\n\}/,
);
const darkSection = darkMediaMatch ? darkMediaMatch[1] : "";
const nonDarkContent = darkMediaMatch ? content.replace(darkMediaMatch[0], "") : content;

const lightColors = extractHexColors(nonDarkContent);
const darkColors = extractHexColors(darkSection);

const REQUIRED_KEYS = ["bg", "surface", "ink", "muted", "line", "link"];
const problems = [];
const results = [];

for (const [themeName, colors] of [
  ["Light", lightColors],
  ["Dark", darkColors],
]) {
  for (const req of REQUIRED_KEYS) {
    if (!colors[req]) {
      problems.push(`${themeName} theme is missing hex color token "--${req}"`);
    }
  }
  if (problems.length) continue;

  const bgs = ["bg", "surface"];
  const texts = ["ink", "muted", "link"];

  // SC 1.4.3 Text >= 4.5:1
  for (const bg of bgs) {
    for (const fg of texts) {
      const ratio = contrastRatio(colors[fg], colors[bg]);
      const pass = ratio >= 4.5;
      results.push({
        theme: themeName,
        pair: `--${fg} (${colors[fg]}) on --${bg} (${colors[bg]})`,
        sc: "SC 1.4.3",
        ratio: ratio.toFixed(2) + ":1",
        target: ">= 4.5:1",
        status: pass ? "PASS" : "FAIL",
      });
      if (!pass) {
        problems.push(
          `${themeName} theme contrast failure: --${fg} on --${bg} has ratio ${ratio.toFixed(2)}:1 (required >= 4.5:1 for WCAG SC 1.4.3)`,
        );
      }
    }

    // SC 1.4.11 Non-text UI boundaries >= 3.0:1
    const lineRatio = contrastRatio(colors.line, colors[bg]);
    const linePass = lineRatio >= 3.0;
    results.push({
      theme: themeName,
      pair: `--line (${colors.line}) on --${bg} (${colors[bg]})`,
      sc: "SC 1.4.11",
      ratio: lineRatio.toFixed(2) + ":1",
      target: ">= 3.0:1",
      status: linePass ? "PASS" : "FAIL",
    });
    if (!linePass) {
      problems.push(
        `${themeName} theme boundary contrast failure: --line on --${bg} has ratio ${lineRatio.toFixed(2)}:1 (required >= 3.0:1 for WCAG SC 1.4.11)`,
      );
    }
  }
}

if (problems.length) {
  console.error(`check-contrast: ${problems.length} WCAG violation(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

console.log(`check-contrast: 16/16 contrast pairs verified (WCAG 2.2 SC 1.4.3 & SC 1.4.11):`);
for (const r of results) {
  console.log(
    `  [${r.theme}] ${r.sc} ${r.pair.padEnd(46)} ${r.ratio.padStart(8)} (${r.target}) ${r.status}`,
  );
}
