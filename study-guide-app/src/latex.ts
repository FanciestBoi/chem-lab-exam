/**
 * latex.ts
 *
 * Pure (no DOM, no CSS imports) helpers that turn the Unicode-stylized
 * chemistry strings used throughout the study guide into valid LaTeX.
 * Living in its own module so the test runner can `import` it under Node
 * without dragging in `katex/dist/katex.min.css`.
 *
 * The conversion is intentionally conservative — anything we don't recognize
 * passes through untouched.
 */

const SUBSCRIPT_MAP: Record<string, string> = {
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4",
  "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9",
  "₊": "+", "₋": "-", "₌": "=", "₍": "(", "₎": ")",
  "ₐ": "a", "ₑ": "e", "ₕ": "h", "ᵢ": "i", "ⱼ": "j",
  "ₖ": "k", "ₗ": "l", "ₘ": "m", "ₙ": "n", "ₒ": "o",
  "ₚ": "p", "ᵣ": "r", "ₛ": "s", "ₜ": "t", "ᵤ": "u",
  "ᵥ": "v", "ₓ": "x",
};

const SUPERSCRIPT_MAP: Record<string, string> = {
  "⁰": "0", "¹": "1", "²": "2", "³": "3", "⁴": "4",
  "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
  "⁺": "+", "⁻": "-", "⁼": "=", "⁽": "(", "⁾": ")",
  "ⁿ": "n", "ⁱ": "i", "ᵃ": "a", "ᵇ": "b", "ᶜ": "c",
  "ᵈ": "d", "ᵉ": "e", "ᶠ": "f", "ᵍ": "g", "ʰ": "h",
  "ʲ": "j", "ᵏ": "k", "ˡ": "l", "ᵐ": "m", "ᵒ": "o",
  "ᵖ": "p", "ʳ": "r", "ˢ": "s", "ᵗ": "t", "ᵘ": "u",
  "ᵛ": "v", "ʷ": "w", "ˣ": "x", "ʸ": "y", "ᶻ": "z",
};

// All multi-letter LaTeX commands have a trailing space so adjacent letters
// don't merge into the command name (e.g. \Delta G, not \DeltaG which KaTeX
// would render in red as an unknown command).
const GREEK_MAP: Record<string, string> = {
  "α": "\\alpha ", "β": "\\beta ", "γ": "\\gamma ", "δ": "\\delta ",
  "ε": "\\varepsilon ", "ζ": "\\zeta ", "η": "\\eta ", "θ": "\\theta ",
  "ι": "\\iota ", "κ": "\\kappa ", "λ": "\\lambda ", "μ": "\\mu ",
  "ν": "\\nu ", "ξ": "\\xi ", "π": "\\pi ", "ρ": "\\rho ",
  "σ": "\\sigma ", "τ": "\\tau ", "υ": "\\upsilon ", "φ": "\\varphi ",
  "χ": "\\chi ", "ψ": "\\psi ", "ω": "\\omega ",
  "Α": "A", "Β": "B", "Γ": "\\Gamma ", "Δ": "\\Delta ",
  "Ε": "E", "Ζ": "Z", "Η": "H", "Θ": "\\Theta ",
  "Ι": "I", "Κ": "K", "Λ": "\\Lambda ", "Μ": "M",
  "Ν": "N", "Ξ": "\\Xi ", "Π": "\\Pi ", "Ρ": "P",
  "Σ": "\\Sigma ", "Τ": "T", "Υ": "\\Upsilon ", "Φ": "\\Phi ",
  "Χ": "X", "Ψ": "\\Psi ", "Ω": "\\Omega ",
};

const FRACTION_MAP: Record<string, string> = {
  "½": "\\tfrac{1}{2}",
  "¼": "\\tfrac{1}{4}",
  "¾": "\\tfrac{3}{4}",
  "⅓": "\\tfrac{1}{3}",
  "⅔": "\\tfrac{2}{3}",
  "⅕": "\\tfrac{1}{5}",
  "⅖": "\\tfrac{2}{5}",
  "⅗": "\\tfrac{3}{5}",
  "⅘": "\\tfrac{4}{5}",
  "⅙": "\\tfrac{1}{6}",
  "⅚": "\\tfrac{5}{6}",
  "⅛": "\\tfrac{1}{8}",
  "⅜": "\\tfrac{3}{8}",
  "⅝": "\\tfrac{5}{8}",
  "⅞": "\\tfrac{7}{8}",
};

const OPERATOR_MAP: Record<string, string> = {
  "→": "\\to ",
  "←": "\\leftarrow ",
  "↔": "\\leftrightarrow ",
  "⇌": "\\rightleftharpoons ",
  "⇋": "\\leftrightharpoons ",
  "≈": "\\approx ",
  "≅": "\\cong ",
  "≠": "\\neq ",
  "≤": "\\leq ",
  "≥": "\\geq ",
  "±": "\\pm ",
  "∓": "\\mp ",
  "×": "\\times ",
  "·": "\\cdot ",
  "÷": "\\div ",
  "∝": "\\propto ",
  "∞": "\\infty ",
  "∫": "\\int ",
  "∑": "\\sum ",
  "∏": "\\prod ",
  "√": "\\sqrt ",
  "∂": "\\partial ",
  "∇": "\\nabla ",
  "°": "^{\\circ}",
  "Å": "\\text{\\AA}",
  "ℏ": "\\hbar ",
  "−": "-",
};

function mergeRunsToLatex(s: string): string {
  let out = "";
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (SUBSCRIPT_MAP[ch]) {
      let run = "";
      while (i < s.length && SUBSCRIPT_MAP[s[i]]) {
        run += SUBSCRIPT_MAP[s[i]];
        i++;
      }
      out += run.length === 1 ? `_${run}` : `_{${run}}`;
      continue;
    }
    if (SUPERSCRIPT_MAP[ch]) {
      let run = "";
      while (i < s.length && SUPERSCRIPT_MAP[s[i]]) {
        run += SUPERSCRIPT_MAP[s[i]];
        i++;
      }
      out += run.length === 1 ? `^${run}` : `^{${run}}`;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

function styleChemBrackets(s: string): string {
  return s.replace(/\[([^\]\[]*)\]/g, (_, inner: string) => {
    if (/[\\=<>~]/.test(inner)) return `[${inner}]`;
    return `[\\mathrm{${inner}}]`;
  });
}

function replaceMap(s: string, map: Record<string, string>): string {
  let out = "";
  for (const ch of s) {
    out += map[ch] ?? ch;
  }
  return out;
}

function styleKVariants(s: string): string {
  return s.replace(/\bK(sp|eq|a|b|w|c|p|f)\b/g, (_, sub: string) => `K_{\\mathrm{${sub}}}`);
}

function wrapMultiLetterSubscripts(s: string): string {
  return s.replace(
    /_([a-zA-Z][a-zA-Z0-9]+(?:_[a-zA-Z][a-zA-Z0-9]+)*)/g,
    (_, w: string) => {
      const inner = w.replace(/_/g, ",\\,");
      return `_{\\mathrm{${inner}}}`;
    }
  );
}

function wrapMultiLetterSuperscripts(s: string): string {
  return s.replace(/\^([a-zA-Z]{2,})\b/g, (_, w: string) => `^{\\mathrm{${w}}}`);
}

function fixParenExpScripts(s: string): string {
  return s
    .replace(/\^\(([^()]*)\)/g, (_, e: string) => `^{(${e})}`)
    .replace(/(?<![A-Za-z\d}])_\(([^()]*)\)/g, (_, e: string) => `_{(${e})}`);
}

// Tighten scientific notation. After the Unicode passes, "1.0×10⁻³" becomes
// "1.0\times 10^{-3}", but we want a thin space and a properly braced
// exponent: "1.0\,\times 10^{-3}". Also catches "1.0 \times 10^-3" → braces.
function formatScientific(s: string): string {
  s = s.replace(/\\times\s*10\^(-?\d+)\b/g, "\\times 10^{$1}");
  s = s.replace(/(\d)\s*\\times\s*10\^/g, "$1\\,\\times 10^");
  return s;
}

// Insert a thin space between a numeric value and a following unit token.
// "25 °C" → "25\,°C" (already converted to ^{\circ}C upstream, but this
// catches plain digit+space+unit forms). Conservative: only fires when the
// unit is one of the canonical SI/chemistry tokens.
const UNIT_TOKENS = [
  "M", "mol", "mmol", "kg", "mg", "g",
  "J", "kJ", "kcal", "cal",
  "min", "ms", "s",
  "K", "mL", "L",
  "nm", "pm", "cm", "mm", "km",
  "atm", "Pa", "kPa", "torr", "bar",
  "Hz", "kHz",
  "C", "F", "V", "A", "T",
];
function valueUnitSpace(s: string): string {
  const tokenAlt = UNIT_TOKENS.join("|");
  const re = new RegExp(`(\\d|\\})\\s+(${tokenAlt})\\b`, "g");
  return s.replace(re, (_m, lhs: string, unit: string) => `${lhs}\\,\\mathrm{${unit}}`);
}

// Compound units: a run of unit tokens connected by \cdot, /, or whitespace
// where at least one token has an explicit exponent (e.g. M^{-1}\cdot s^{-1},
// J/(mol\cdot K), L\cdot atm/(mol\cdot K)). Wrap the whole run in \mathrm{}
// and replace \cdot with a thin space for tighter typography. Skip content
// already inside \text{...} or \mathrm{...} groups so we don't double-wrap.
function wrapCompoundUnits(s: string): string {
  const stash: string[] = [];
  s = s.replace(/\\(?:text|mathrm)\{[^{}]*\}/g, (m) => {
    const i = stash.length;
    stash.push(m);
    return `\u0001${i}\u0002`;
  });
  const tokenAlt = UNIT_TOKENS.join("|");
  const expPart = `(?:\\^\\{[^{}]*\\}|\\^-?\\d)?`;
  const tokenPart = `(?:${tokenAlt})${expPart}`;
  const sep = `(?:\\\\cdot|\\\\,|/)`;
  const run = `${tokenPart}(?:\\s*${sep}\\s*${tokenPart}|\\s*${sep}\\s*\\(${tokenPart}(?:\\s*${sep}\\s*${tokenPart})*\\))+`;
  const re = new RegExp(`(?<![A-Za-z\\\\{])(${run})`, "g");
  s = s.replace(re, (m) => `\\mathrm{${m.replace(/\\cdot/g, "\\,")}}`);
  s = s.replace(/\u0001(\d+)\u0002/g, (_, i) => stash[+i]);
  return s;
}

// Escape stray % signs so KaTeX doesn't treat them as comment starts.
// Skip already-escaped ones.
function escapePercent(s: string): string {
  return s.replace(/(?<!\\)%/g, "\\%");
}

function wrapBareChemistry(s: string): string {
  const stash: string[] = [];
  s = s.replace(/\{[^{}]*\}/g, (m) => {
    const i = stash.length;
    stash.push(m);
    return `\u0001${i}\u0002`;
  });
  s = s.replace(
    /(?<![\\a-zA-Z])(?:[A-Z][a-z]?\d*){2,}(?![a-z])/g,
    (m) => `\\mathrm{${m}}`
  );
  s = s.replace(/\u0001(\d+)\u0002/g, (_, i) => stash[+i]);
  return s;
}

const MATH_FUNCS = [
  "ln", "log", "exp", "sin", "cos", "tan", "sec", "csc", "cot",
  "sinh", "cosh", "tanh", "arcsin", "arccos", "arctan",
  "lim", "min", "max", "sup", "inf", "det",
];
function wrapMathFunctions(s: string): string {
  for (const fn of MATH_FUNCS) {
    const re = new RegExp(`(?<![\\\\a-zA-Z0-9])${fn}(?![a-zA-Z0-9])`, "g");
    s = s.replace(re, `\\${fn}`);
  }
  return s;
}

function wrapEnglishWords(s: string): string {
  const stash: string[] = [];
  s = s.replace(/\{[^{}]*\}/g, (m) => {
    const i = stash.length;
    stash.push(m);
    return `\u0001${i}\u0002`;
  });

  const wordTok = `[A-Za-z][a-z]+(?:'[a-z]+)?`;
  const lowerStartTok = `[a-z]{3,}(?:'[a-z]+)?`;
  const multiWord =
    `(?:[a-z]{2,}(?:'[a-z]+)?|[A-Z][a-z]{2,}(?:'[a-z]+)?)` +
    `(?:[ \\t]+${wordTok})+`;
  const singleWord = `(?:${lowerStartTok}|[A-Z][a-z]{3,}(?:'[a-z]+)?)`;
  const combined = `(?:${multiWord}|${singleWord})`;
  const re = new RegExp(`(?<![\\\\a-zA-Z])${combined}`, "g");

  s = s.replace(re, (m) => `\\text{${m}}`);

  s = s.replace(/\u0001(\d+)\u0002/g, (_, i) => stash[+i]);
  return s;
}

export function unicodeToLatex(input: string): string {
  if (!input) return "";
  let s = input;
  s = mergeRunsToLatex(s);
  s = replaceMap(s, FRACTION_MAP);
  s = replaceMap(s, GREEK_MAP);
  s = replaceMap(s, OPERATOR_MAP);
  s = wrapMultiLetterSubscripts(s);
  s = wrapMultiLetterSuperscripts(s);
  s = fixParenExpScripts(s);
  s = wrapMathFunctions(s);
  // Tighten scientific notation: brace exponents and add thin space
  // between value and \times.
  s = formatScientific(s);
  s = wrapBareChemistry(s);
  // Wrap compound unit runs (M^{-1}\cdot s^{-1}, J/(mol\cdot K)) in
  // \mathrm{} so they render upright.
  s = wrapCompoundUnits(s);
  s = wrapEnglishWords(s);
  s = styleChemBrackets(s);
  s = styleKVariants(s);
  // Insert thin space between numeric value and a trailing unit token.
  s = valueUnitSpace(s);
  // Escape stray percent signs so KaTeX doesn't treat them as comments.
  s = escapePercent(s);
  return s;
}

// Render a paragraph with optional inline math delimited by $...$ or \(...\)
// or display math via $$...$$ / \[...\]. Anything outside the delimiters is
// rendered as plain text.
export type MixedTextSegment =
  | { type: "text"; value: string }
  | { type: "math"; value: string; display: boolean };

export function parseMixedMath(input: string): MixedTextSegment[] {
  const out: MixedTextSegment[] = [];
  const re = /(\$\$[^$]+\$\$|\\\[[\s\S]+?\\\]|\$[^$\n]+\$|\\\([\s\S]+?\\\))/g;
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input)) !== null) {
    if (m.index > lastIdx) {
      out.push({ type: "text", value: input.slice(lastIdx, m.index) });
    }
    const tok = m[0];
    let display = false;
    let inner = "";
    if (tok.startsWith("$$")) {
      display = true;
      inner = tok.slice(2, -2);
    } else if (tok.startsWith("\\[")) {
      display = true;
      inner = tok.slice(2, -2);
    } else if (tok.startsWith("\\(")) {
      inner = tok.slice(2, -2);
    } else {
      inner = tok.slice(1, -1);
    }
    out.push({ type: "math", value: inner, display });
    lastIdx = m.index + tok.length;
  }
  if (lastIdx < input.length) {
    out.push({ type: "text", value: input.slice(lastIdx) });
  }
  return out;
}
