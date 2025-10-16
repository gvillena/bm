import { spawnSync } from "node:child_process";
import { readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import Module from "node:module";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const packageRoot = path.resolve(__dirname, "..");
const outDir = path.join(packageRoot, "build", "tests");
const supportDir = path.join(packageRoot, "test-support");

const tscPath = path.resolve(packageRoot, "../../node_modules/typescript/bin/tsc");
const tsconfig = path.join(packageRoot, "tsconfig.tests.json");

const compile = spawnSync("node", [tscPath, "-p", tsconfig], { stdio: "inherit" });
if (compile.status !== 0) {
  process.exit(compile.status ?? 1);
}

writeFileSync(path.join(outDir, "package.json"), JSON.stringify({ type: "commonjs" }));

process.env.NODE_PATH = `${supportDir}${path.delimiter}${process.env.NODE_PATH ?? ""}`;
Module._initPaths();

const require = Module.createRequire(import.meta.url);
const vitest = require(path.join(supportDir, "vitest", "index.js"));

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
};

await run();
