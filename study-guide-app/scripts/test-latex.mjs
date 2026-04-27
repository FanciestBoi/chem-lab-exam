// Self-contained test: ports unicodeToLatex from canvas-shim.tsx as plain JS
// so it can be `node`-run without TS tooling.
// Run with: node scripts/test-latex.mjs

const SUBSCRIPT_MAP = {
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4",
  "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9",
  "₊": "+", "₋": "-", "₌": "=", "₍": "(", "₎": ")",
  "ₐ": "a", "ₑ": "e", "ₕ": "h", "ᵢ": "i", "ⱼ": "j",
  "ₖ": "k", "ₗ": "l", "ₘ": "m", "ₙ": "n", "ₒ": "o",
  "ₚ": "p", "ᵣ": "r", "ₛ": "s", "ₜ": "t", "ᵤ": "u",
  "ᵥ": "v", "ₓ": "x",
};
const SUPERSCRIPT_MAP = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
  "⁺": "+", "⁻": "-", "⁼": "=", "⁽": "(", "⁾": ")",
  "ⁿ": "n", "ⁱ": "i",
};
const GREEK_MAP = {
  "α": "\\alpha ", "β": "\\beta ", "γ": "\\gamma ", "δ": "\\delta ",
  "ε": "\\varepsilon ", "θ": "\\theta ", "λ": "\\lambda ", "μ": "\\mu ",
  "π": "\\pi ", "ρ": "\\rho ", "σ": "\\sigma ", "τ": "\\tau ",
  "Δ": "\\Delta ", "Σ": "\\Sigma ", "Π": "\\Pi ", "Λ": "\\Lambda ",
  "Φ": "\\Phi ", "Ω": "\\Omega ",
};
const OPERATOR_MAP = {
  "→": "\\to ", "⇌": "\\rightleftharpoons ", "≈": "\\approx ",
  "≤": "\\leq ", "≥": "\\geq ", "±": "\\pm ", "×": "\\times ",
  "·": "\\cdot ", "°": "^{\\circ}", "−": "-", "⁻": "-",
};
function mergeRunsToLatex(s) {
  let out = ""; let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (SUBSCRIPT_MAP[ch]) {
      let run = "";
      while (i < s.length && SUBSCRIPT_MAP[s[i]]) { run += SUBSCRIPT_MAP[s[i]]; i++; }
      out += run.length === 1 ? `_${run}` : `_{${run}}`;
      continue;
    }
    if (SUPERSCRIPT_MAP[ch]) {
      let run = "";
      while (i < s.length && SUPERSCRIPT_MAP[s[i]]) { run += SUPERSCRIPT_MAP[s[i]]; i++; }
      out += run.length === 1 ? `^${run}` : `^{${run}}`;
      continue;
    }
    out += ch; i++;
  }
  return out;
}
function styleChemBrackets(s) {
  return s.replace(/\[([^\]\[]*)\]/g, (_, inner) =>
    /[\\=<>~]/.test(inner) ? `[${inner}]` : `[\\mathrm{${inner}}]`
  );
}
function replaceMap(s, map) {
  let out = "";
  for (const ch of s) out += map[ch] ?? ch;
  return out;
}
function styleKVariants(s) {
  return s.replace(/\bK(sp|eq|a|b|w|c|p|f)\b/g, (_, sub) => `K_{\\mathrm{${sub}}}`);
}
function wrapMultiLetterSubscripts(s) {
  return s.replace(
    /_([a-zA-Z][a-zA-Z0-9]+(?:_[a-zA-Z][a-zA-Z0-9]+)*)/g,
    (_, w) => `_{\\mathrm{${w.replace(/_/g, ",\\,")}}}`
  );
}
function wrapBareChemistry(s) {
  const stash = [];
  s = s.replace(/\{[^{}]*\}/g, (m) => { const i = stash.length; stash.push(m); return `\u0001${i}\u0002`; });
  s = s.replace(/(?<![\\a-zA-Z])(?:[A-Z][a-z]?\d*){2,}(?![a-z])/g, (m) => `\\mathrm{${m}}`);
  s = s.replace(/\u0001(\d+)\u0002/g, (_, i) => stash[+i]);
  return s;
}
function wrapMultiLetterSuperscripts(s) {
  return s.replace(/\^([a-zA-Z]{2,})\b/g, (_, w) => `^{\\mathrm{${w}}}`);
}
const MATH_FUNCS = ["ln","log","exp","sin","cos","tan","sec","csc","cot","sinh","cosh","tanh","arcsin","arccos","arctan","lim","min","max","sup","inf","det"];
function wrapMathFunctions(s) {
  for (const fn of MATH_FUNCS) {
    const re = new RegExp(`(?<![\\\\a-zA-Z0-9])${fn}(?![a-zA-Z0-9])`, "g");
    s = s.replace(re, `\\${fn}`);
  }
  return s;
}
function wrapEnglishWords(s) {
  const stash = [];
  s = s.replace(/\{[^{}]*\}/g, (m) => { const i = stash.length; stash.push(m); return `\u0001${i}\u0002`; });
  const wordTok = `[A-Za-z][a-z]+(?:'[a-z]+)?`;
  const lowerStartTok = `[a-z]{3,}(?:'[a-z]+)?`;
  const multiWord = `(?:[a-z]{2,}(?:'[a-z]+)?|[A-Z][a-z]{2,}(?:'[a-z]+)?)(?:[ \\t]+${wordTok})+`;
  const singleWord = `(?:${lowerStartTok}|[A-Z][a-z]{3,}(?:'[a-z]+)?)`;
  const combined = `(?:${multiWord}|${singleWord})`;
  const re = new RegExp(`(?<![\\\\a-zA-Z])${combined}`, "g");
  s = s.replace(re, (m) => `\\text{${m}}`);
  s = s.replace(/\u0001(\d+)\u0002/g, (_, i) => stash[+i]);
  return s;
}
function unicodeToLatex(input) {
  if (!input) return "";
  let s = input;
  s = mergeRunsToLatex(s);
  s = replaceMap(s, GREEK_MAP);
  s = replaceMap(s, OPERATOR_MAP);
  s = wrapMultiLetterSubscripts(s);
  s = wrapMultiLetterSuperscripts(s);
  s = wrapMathFunctions(s);
  s = wrapBareChemistry(s);
  s = wrapEnglishWords(s);
  s = styleChemBrackets(s);
  s = styleKVariants(s);
  return s;
}

const cases = [
  "ΔG° = −RT ln K",
  "ΔG° = ΔH° − T ΔS°",
  "ln K = −ΔH°/(R·T) + ΔS°/R   (van't Hoff)",
  "moles acid = (M_NaOH)(V_eq) for monoprotic",
  "moles HOAc = (M_NaOH)(V_eq); [HOAc]₀ = moles / V_acid_initial",
  "rate₂ / rate₁ = ([H₂O₂]₂ / [H₂O₂]₁)^m   (with [I⁻] fixed)",
  "rate₃ / rate₁ = ([I⁻]₃ / [I⁻]₁)^n     (with [H₂O₂] fixed)",
  "Ksp = [Ca²⁺][OH⁻]²",
  "K = k_f / k_r",
  "Q = e^(-Ea/RT)",
];
for (const c of cases) {
  console.log("IN :", c);
  console.log("OUT:", unicodeToLatex(c));
  console.log("");
}
