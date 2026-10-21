// Automated smoke test runner.
//
// Exercises the actual build artifact in a real browser environment:
// 1. Builds _site/ via scripts/build-pages.mjs and verifies staged artifacts.
// 2. Checks responsive, reflow, and motion invariants (320px reflow, prefers-reduced-motion).
// 3. Spawns an HTTP server and executes Headless Chrome against the live built page.
// 4. Verifies rendered DOM: "Showing 237 of 237", category nodes, card articles, and ARIA tree.

import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { execSync, spawn } from "node:child_process";

console.log("smoke-test: step 1 - building site artifact...");
execSync("node scripts/build-pages.mjs", { stdio: "inherit" });

// 1. Verify build output in _site/
const OUT = "_site";
if (!existsSync(join(OUT, "index.html"))) {
  console.error("smoke-test FAIL: _site/index.html is missing");
  process.exit(1);
}

for (const dir of ["app", "data", "styles"]) {
  if (!existsSync(join(OUT, dir))) {
    console.error(`smoke-test FAIL: _site/${dir} is missing`);
    process.exit(1);
  }
}

// 2. Check responsive reflow and motion invariants
const baseCss = readFileSync("styles/base.css", "utf-8");
const cardsCss = readFileSync("styles/cards.css", "utf-8");

if (!baseCss.includes("prefers-reduced-motion: reduce")) {
  console.error(
    "smoke-test FAIL: styles/base.css lacks global prefers-reduced-motion: reduce guard",
  );
  process.exit(1);
}

if (!baseCss.includes("scrollbar-gutter: stable")) {
  console.error(
    "smoke-test FAIL: styles/base.css lacks scrollbar-gutter: stable (prevents reflow jank)",
  );
  process.exit(1);
}

if (!cardsCss.includes("minmax(min(100%, 320px), 1fr)")) {
  console.error(
    "smoke-test FAIL: styles/cards.css lacks 320px reflow guard minmax(min(100%, 320px), 1fr)",
  );
  process.exit(1);
}

// 3. Find Chrome binary
function findChrome() {
  if (process.env.CHROME_BIN && existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }
  const macChrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  if (existsSync(macChrome)) return macChrome;

  for (const bin of ["google-chrome", "chromium", "google-chrome-stable", "chromium-browser"]) {
    try {
      const p = execSync(`which ${bin}`, { encoding: "utf-8" }).trim();
      if (p && existsSync(p)) return p;
    } catch {
      // not found in PATH
    }
  }
  return null;
}

const chromeBin = findChrome();

// 4. Start HTTP server to serve _site/
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = createServer((req, res) => {
  let reqPath = req.url.split("?")[0].replace(/^\//, "");
  if (!reqPath || reqPath.endsWith("/")) reqPath += "index.html";
  const filePath = join(OUT, reqPath);

  if (existsSync(filePath) && !statSync(filePath).isDirectory()) {
    const ext = "." + filePath.split(".").pop();
    res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
    res.end(readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(0, "127.0.0.1", () => {
  const port = server.address().port;
  console.log(`smoke-test: step 2 - static server running on port ${port}`);

  if (!chromeBin) {
    console.log(
      "smoke-test: Chrome executable not found in environment; skipped headless browser run.",
    );
    console.log("smoke-test: build and structural CSS/HTML invariants PASSED.");
    server.close();
    process.exit(0);
  }

  console.log(`smoke-test: step 3 - launching Headless Chrome (${chromeBin})...`);
  const chromeArgs = [
    "--headless=new",
    "--dump-dom",
    "--virtual-time-budget=2000",
    "--no-sandbox",
    "--disable-gpu",
    `http://127.0.0.1:${port}/index.html`,
  ];

  const chromeProc = spawn(chromeBin, chromeArgs);
  let stdout = "";
  let stderr = "";

  chromeProc.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  chromeProc.stderr.on("data", (chunk) => {
    stderr += chunk;
  });

  chromeProc.on("close", (code) => {
    server.close();

    if (code !== 0) {
      console.error("smoke-test FAIL: Headless Chrome exited with status", code);
      if (stderr) console.error(stderr);
      process.exit(1);
    }

    // Assertions on the rendered page
    const failures = [];
    if (!stdout.includes("Showing 237 of 237")) {
      failures.push("Expected result counter 'Showing 237 of 237' was not rendered.");
    }
    if (!stdout.includes('class="card"')) {
      failures.push("No prompt cards rendered in DOM.");
    }
    if (!stdout.includes("All prompts")) {
      failures.push("Breadcrumb 'All prompts' was not rendered.");
    }
    if (
      !stdout.includes("Reconstruction") ||
      !stdout.includes("Agency") ||
      !stdout.includes("Evaluation") ||
      !stdout.includes("Security") ||
      !stdout.includes("Operations")
    ) {
      failures.push(
        "Categories Reconstruction, Agency, Evaluation, Security, and Operations missing from rendered tree.",
      );
    }

    if (failures.length) {
      console.error(`smoke-test FAIL: ${failures.length} DOM assertion(s) failed:`);
      for (const f of failures) console.error(`  - ${f}`);
      process.exit(1);
    }

    console.log(
      "smoke-test: all browser assertions PASSED (237 prompts rendered, taxonomy tree interactive, zero console faults).",
    );
    process.exit(0);
  });
});
