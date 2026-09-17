import assert from "node:assert/strict";
import test from "node:test";
import colors from "dictionary-of-colour-combinations" with { type: "json" };
import {
  buildCombinations,
  contrastRatio,
  readableForeground
} from "../src/lib/wada.mjs";

test("the source dataset resolves to all 348 Wada combinations", () => {
  const combinations = buildCombinations(colors);
  assert.equal(colors.length, 159);
  assert.equal(combinations.length, 348);
  assert.deepEqual(
    [...new Set(combinations.map((combination) => combination.size))],
    [2, 3, 4]
  );
});

test("combination 139 includes Deep Indigo, Salvia Blue, and Neutral Gray", () => {
  const combination = buildCombinations(colors).find(({ id }) => id === 139);
  assert.deepEqual(
    combination.colors.map(({ name }) => name),
    ["Salvia Blue", "Deep Indigo", "Neutral Gray"]
  );
});

test("contrast calculation keeps the known Deep Indigo relationship", () => {
  assert.equal(contrastRatio("#b6bfc1", "#051230").toFixed(2), "9.87");
});

test("swatch foreground chooses the more readable neutral", () => {
  assert.equal(readableForeground("#051230"), "#fffdf6");
  assert.equal(readableForeground("#f9c1ce"), "#101318");
});
