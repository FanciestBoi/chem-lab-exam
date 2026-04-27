/**
 * Real assertion-based tests for `unicodeToLatex`, importing the function
 * from the live canvas-shim source instead of the previous duplicate.
 *
 * Run with: npm test  (which calls `node --import tsx scripts/test-latex.mjs`).
 */

import assert from "node:assert/strict";
import { unicodeToLatex } from "../src/latex.ts";

let passed = 0;
let failed = 0;

function check(label, actual, expected) {
  try {
    if (typeof expected === "function") {
      expected(actual);
    } else {
      assert.equal(actual, expected);
    }
    passed++;
  } catch (e) {
    failed++;
    console.error(`✗ ${label}`);
    console.error(`  actual:   ${JSON.stringify(actual)}`);
    if (typeof expected !== "function") {
      console.error(`  expected: ${JSON.stringify(expected)}`);
    }
    console.error(`  ${e.message}`);
  }
}

function contains(...needles) {
  return (actual) => {
    for (const n of needles) {
      assert.ok(
        actual.includes(n),
        `expected to find ${JSON.stringify(n)} in ${JSON.stringify(actual)}`
      );
    }
  };
}

// ---------------------------------------------------------------------------
// Sanity / no-op cases
// ---------------------------------------------------------------------------
check("empty input", unicodeToLatex(""), "");
check("plain ASCII numbers pass through", unicodeToLatex("42"), "42");

// ---------------------------------------------------------------------------
// Subscripts and superscripts
// ---------------------------------------------------------------------------
check(
  "subscript single digit",
  unicodeToLatex("H₂"),
  contains("_2")
);
check(
  "subscript multi-digit run merges to braces",
  unicodeToLatex("x₁₀"),
  contains("_{10}")
);
check(
  "superscript single digit",
  unicodeToLatex("E²"),
  contains("^2")
);
check(
  "superscript run merges and signs are preserved",
  unicodeToLatex("Ca²⁺"),
  contains("^{2+}")
);
check(
  "negative ion superscript",
  unicodeToLatex("OH⁻"),
  contains("^-")
);
check(
  "multi-char superscript with sign uses braces",
  unicodeToLatex("SO₄²⁻"),
  contains("^{2-}")
);

// ---------------------------------------------------------------------------
// Greek letters
// ---------------------------------------------------------------------------
check(
  "uppercase delta becomes \\Delta",
  unicodeToLatex("ΔG"),
  contains("\\Delta")
);
check(
  "lambda becomes \\lambda",
  unicodeToLatex("λ_max"),
  contains("\\lambda")
);

// ---------------------------------------------------------------------------
// Operators
// ---------------------------------------------------------------------------
check(
  "rightleftharpoons for equilibrium arrow",
  unicodeToLatex("A ⇌ B"),
  contains("\\rightleftharpoons")
);
check(
  "ASCII unicode minus is normalized to ascii hyphen",
  unicodeToLatex("ΔG = −RT"),
  contains("=", "-")
);
check(
  "degree symbol becomes \\circ",
  unicodeToLatex("ΔG°"),
  contains("^{\\circ}")
);

// ---------------------------------------------------------------------------
// Chemistry styling
// ---------------------------------------------------------------------------
check(
  "concentration brackets get \\mathrm",
  unicodeToLatex("[Fe³⁺]"),
  contains("[\\mathrm{Fe^{3+}}]")
);
check(
  "Ksp gets subscript styling",
  unicodeToLatex("Ksp = [Ca²⁺][OH⁻]²"),
  contains("K_{\\mathrm{sp}}")
);
check(
  "bare chemistry formula wraps in \\mathrm",
  unicodeToLatex("CaCO3"),
  contains("\\mathrm{CaCO3}")
);

// ---------------------------------------------------------------------------
// Math functions
// ---------------------------------------------------------------------------
check(
  "ln gets a backslash",
  unicodeToLatex("ln K"),
  contains("\\ln")
);

// ---------------------------------------------------------------------------
// Multi-letter subscript wrap
// ---------------------------------------------------------------------------
check(
  "multi-letter underscore subscript wraps in \\mathrm",
  unicodeToLatex("V_eq"),
  contains("V_{\\mathrm{eq}}")
);

// ---------------------------------------------------------------------------
// Realistic full equations
// ---------------------------------------------------------------------------
check(
  "ΔG° equation roundtrip contains expected pieces",
  unicodeToLatex("ΔG° = −RT ln K"),
  contains("\\Delta", "^{\\circ}", "\\ln", "RT")
);

if (failed > 0) {
  console.error(`\n${failed} test(s) failed, ${passed} passed.`);
  process.exit(1);
}
console.log(`\nAll ${passed} unicodeToLatex tests passed.`);
