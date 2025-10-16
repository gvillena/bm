import test from "node:test";
import assert from "node:assert/strict";
import { randomInt } from "crypto";
import { applyRedaction, composeReasons } from "../dist/index.js";

const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_";
const ALPHANUM = `${ALPHABET}0123456789`;

function randomKey(maxLength) {
  const length = randomInt(1, Math.max(2, maxLength));
  let value = ALPHABET[randomInt(0, ALPHABET.length)];
  for (let i = 1; i < length; i += 1) {
    value += ALPHANUM[randomInt(0, ALPHANUM.length)];
  }
  return value;
}

function randomValue() {
  const kind = randomInt(0, 3);
  if (kind === 0) return randomKey(8);
  if (kind === 1) return randomInt(0, 1000);
  return randomInt(0, 2) === 0;
}

test("aplicar redacción nunca expone campos fuera del whitelist", () => {
  for (let iteration = 0; iteration < 100; iteration += 1) {
    const resource = {};
    const keys = [];
    const keyCount = randomInt(1, 6);
    for (let i = 0; i < keyCount; i += 1) {
      let key = randomKey(12);
      while (keys.includes(key)) {
        key = randomKey(12);
      }
      keys.push(key);
      resource[key] = randomValue();
    }
    const allow = keys.filter(() => randomInt(0, 2) === 0);
    const dto = applyRedaction(resource, { allow });
    assert.deepEqual(Object.keys(dto), allow);
  }
});

test("composeReasons produce códigos únicos", () => {
  for (let iteration = 0; iteration < 100; iteration += 1) {
    const left = Array.from({ length: randomInt(1, 6) }, () => ({
      code: randomKey(10),
      detail: randomInt(0, 2) === 0 ? undefined : randomKey(10),
    }));
    const right = Array.from({ length: randomInt(1, 6) }, () => ({
      code: randomKey(10),
      detail: randomInt(0, 2) === 0 ? undefined : randomKey(10),
    }));
    const combined = composeReasons(left, right);
    const keys = new Set(combined.map((reason) => `${reason.code}:${reason.detail ?? ""}`));
    assert.equal(keys.size, combined.length);
  }
});
