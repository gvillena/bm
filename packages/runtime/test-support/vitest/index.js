const assert = require("node:assert/strict");

const suites = [];
let currentSuite = null;

const describe = (name, fn) => {
  const suite = { name, tests: [] };
  const previous = currentSuite;
  currentSuite = suite;
  suites.push(suite);
  fn();
  currentSuite = previous;
};

const it = (name, fn) => {
  if (!currentSuite) {
    throw new Error("`it` must be called within a describe block");
  }
  currentSuite.tests.push({ name, fn });
};

const expect = (actual) => ({
  toBe: (expected) => assert.strictEqual(actual, expected),
  toEqual: (expected) => assert.deepStrictEqual(actual, expected),
  toContain: (expected) => {
    if (!actual || typeof actual.includes !== "function") {
      throw new assert.AssertionError({ message: "Value does not support includes" });
    }
    assert.ok(actual.includes(expected));
  },
  toBeInstanceOf: (ctor) => assert.ok(actual instanceof ctor),
  toHaveBeenCalledTimes: (expected) => {
    assert.ok(actual?.mock?.calls);
    assert.strictEqual(actual.mock.calls.length, expected);
  },
  toBeTruthy: () => assert.ok(actual),
  toBeDefined: () => assert.ok(actual !== undefined),
});

const vi = {
  fn: (implementation = () => undefined) => {
    const spy = (...args) => {
      spy.mock.calls.push(args);
      return implementation(...args);
    };
    spy.mock = { calls: [] };
    spy.mockImplementation = (impl) => {
      implementation = impl;
    };
    return spy;
  },
};

module.exports = {
  describe,
  it,
  expect,
  vi,
  __getSuites: () => suites,
};
