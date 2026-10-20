import { cpSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";

const OUT = "_site";
const SITE_FILES = ["index.html", "styles.css", "app.js"];
const SITE_DIRS = ["assets", "images", "fonts"];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const file of SITE_FILES) {
  if (!existsSync(file)) throw new Error(`missing site file: ${file}`);
  cpSync(file, `${OUT}/${file}`);
}

for (const entry of SITE_DIRS) {
  if (existsSync(entry) && statSync(entry).isDirectory()) {
    cpSync(entry, `${OUT}/${entry}`, { recursive: true });
  }
}

console.log(`built ${OUT}/`);
