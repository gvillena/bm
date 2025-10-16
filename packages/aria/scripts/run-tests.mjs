import { spawnSync } from "node:child_process";
import {
  readdirSync,
  statSync,
  writeFileSync,
  rmSync,
  existsSync,
  readFileSync
} from "node:fs";
import path from "node:path";
import Module from "node:module";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const packageRoot = path.resolve(__dirname, "..");
const outDir = path.join(packageRoot, "build", "tests");
const supportDir = path.join(packageRoot, "test-support");
const coverageDir = path.join(packageRoot, "build", "coverage");

if (existsSync(outDir)) {
  rmSync(outDir, { recursive: true, force: true });
}
if (existsSync(coverageDir)) {
  rmSync(coverageDir, { recursive: true, force: true });
}
process.env.NODE_V8_COVERAGE = coverageDir;

const tscPath = path.resolve(packageRoot, "../../node_modules/typescript/bin/tsc");
const tsconfig = path.join(packageRoot, "tsconfig.tests.json");

const compile = spawnSync("node", [tscPath, "-p", tsconfig], { stdio: "inherit" });
if (compile.status !== 0) {
  process.exit(compile.status ?? 1);
}

writeFileSync(path.join(outDir, "package.json"), JSON.stringify({ type: "commonjs" }));

const modulePaths = [supportDir, path.join(supportDir, "node_modules")].join(path.delimiter);
process.env.NODE_PATH = `${modulePaths}${path.delimiter}${process.env.NODE_PATH ?? ""}`;
Module._initPaths();

const require = Module.createRequire(import.meta.url);
const vitest = require(path.join(supportDir, "node_modules", "vitest", "index.cjs"));
globalThis.describe = vitest.describe;
globalThis.it = vitest.it;
globalThis.expect = vitest.expect;
globalThis.vi = vitest.vi;

const loadTests = (dir) => {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      loadTests(full);
    } else if (entry.endsWith(".js")) {
      require(full);
    }
  }
};

loadTests(path.join(outDir, "tests"));
const suites = vitest.__getSuites();
let failures = 0;
let total = 0;

const runTest = async (suiteName, test) => {
  try {
    await test.fn();
    console.log(`✓ ${suiteName} › ${test.name}`);
  } catch (error) {
    failures += 1;
    console.error(`✗ ${suiteName} › ${test.name}`);
    console.error(error);
  }
  total += 1;
};

const run = async () => {
  for (const suite of suites) {
    for (const test of suite.tests) {
      await runTest(suite.name, test);
    }
  }

  console.log(`\nRan ${total} tests: ${total - failures} passed, ${failures} failed.`);
  if (failures > 0) {
    process.exit(1);
  }

  const coverageStats = computeCoverageFromFiles(coverageDir, packageRoot);
  console.log(`Coverage (bytes): ${(coverageStats.coveredRatio * 100).toFixed(2)}%`);
  if (coverageStats.coveredRatio < 0.9) {
    console.error("Coverage below threshold (90%).");
    process.exit(1);
  }
};

const computeCoverageFromFiles = (dir, root) => {
  if (!existsSync(dir)) {
    return { coveredBytes: 0, totalBytes: 0, coveredRatio: 0 };
  }
  const files = readdirSync(dir).filter((file) => file.endsWith(".json"));
  let totalBytes = 0;
  let coveredBytes = 0;
  for (const file of files) {
    const report = JSON.parse(readFileSync(path.join(dir, file), "utf-8"));
    const { result } = report;
    for (const script of result) {
      if (!script.url || !script.url.startsWith(root)) {
        continue;
      }
      if (!script.url.includes(path.join("packages", "aria", "src"))) {
        continue;
      }
      for (const fn of script.functions) {
        for (const range of fn.ranges) {
          const length = range.endOffset - range.startOffset;
          if (length <= 0) {
            continue;
          }
          totalBytes += length;
          if (range.count > 0) {
            coveredBytes += length;
          }
        }
      }
    }
  }
  const coveredRatio = totalBytes === 0 ? 1 : coveredBytes / totalBytes;
  return { coveredBytes, totalBytes, coveredRatio };
};

await run();
