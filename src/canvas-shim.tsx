/**
 * canvas-shim.tsx
 *
 * Re-implements the subset of the `cursor/canvas` API that the study-guide
 * canvas uses, so we can render the same 2900-line component as a normal
 * web app outside Cursor.
 *
 * The shape (component names + props) matches what the original
 * study-guide.canvas.tsx imports from "cursor/canvas".
 */

import {
  CSSProperties,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  Children,
  isValidElement,
  cloneElement,
  Dispatch,
  SetStateAction,
} from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

// ============================================================================
// Theme — mimics useHostTheme()
// ============================================================================

export type HostTheme = {
  text: { primary: string; secondary: string; tertiary: string };
  fill: { primary: string; secondary: string; tertiary: string };
  stroke: { primary: string; secondary: string; tertiary: string };
  accent: { primary: string };
  bg: { primary: string; elevated: string };
};

// We resolve CSS variables to actual color strings on first call so the
// values returned by useHostTheme() are usable in inline `style` props.
function resolveCssVars(): HostTheme {
  if (typeof window === "undefined") {
    return {
      text: { primary: "#e6ebf5", secondary: "#a5b0c5", tertiary: "#6c7891" },
      fill: { primary: "#1f2638", secondary: "#181d2b", tertiary: "#11151d" },
      stroke: { primary: "#2a3148", secondary: "#232a3d", tertiary: "#1c2233" },
      accent: { primary: "#6aa8ff" },
      bg: { primary: "#0b0e14", elevated: "#11151d" },
    };
  }
  const cs = getComputedStyle(document.documentElement);
  const v = (name: string) => cs.getPropertyValue(name).trim();
  return {
    text: {
      primary: v("--text-primary"),
      secondary: v("--text-secondary"),
      tertiary: v("--text-tertiary"),
    },
    fill: {
      primary: v("--fill-primary"),
      secondary: v("--fill-secondary"),
      tertiary: v("--fill-tertiary"),
    },
    stroke: {
      primary: v("--stroke-primary"),
      secondary: v("--stroke-secondary"),
      tertiary: v("--stroke-tertiary"),
    },
    accent: { primary: v("--accent-primary") },
    bg: { primary: v("--bg"), elevated: v("--bg-elevated") },
  };
}

export function useHostTheme(): HostTheme {
  const [theme, setTheme] = useState<HostTheme>(() => resolveCssVars());
  useEffect(() => {
    setTheme(resolveCssVars());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(resolveCssVars());
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return theme;
}

// ============================================================================
// useCanvasState — useState that persists to localStorage by key
// ============================================================================

const STORAGE_PREFIX = "chem105b.studyguide.";

export function useCanvasState<T>(
  key: string,
  initial: T
): [T, Dispatch<SetStateAction<T>>] {
  const fullKey = STORAGE_PREFIX + key;
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(fullKey);
      if (raw == null) return initial;
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(fullKey, JSON.stringify(value));
    } catch {
      // quota exceeded or disabled — non-fatal
    }
  }, [fullKey, value]);

  return [value, setValue];
}

// ============================================================================
// Typography
// ============================================================================

export function H1({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <h1 className="cs-h1" style={style}>{children}</h1>;
}
export function H2({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <h2 className="cs-h2" style={style}>{children}</h2>;
}

type TextProps = {
  children: ReactNode;
  tone?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium";
  weight?: "regular" | "semibold";
  italic?: boolean;
  style?: CSSProperties;
};
export function Text({ children, tone, size, weight, italic, style }: TextProps) {
  const cls = [
    "cs-text",
    tone === "secondary" && "cs-text-secondary",
    tone === "tertiary" && "cs-text-tertiary",
    size === "small" && "cs-text-small",
    weight === "semibold" && "cs-text-semibold",
    italic && "cs-text-italic",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={cls} style={style}>
      {children}
    </span>
  );
}

export function Code({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <code className="cs-code" style={style}>{children}</code>;
}

// ============================================================================
// Layout primitives
// ============================================================================

type StackProps = {
  children: ReactNode;
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
  style?: CSSProperties;
};
export function Stack({ children, gap = 0, align, style }: StackProps) {
  const alignItems =
    align === "start"
      ? "flex-start"
      : align === "end"
      ? "flex-end"
      : align === "center"
      ? "center"
      : align === "stretch"
      ? "stretch"
      : undefined;
  return (
    <div className="cs-stack" style={{ gap, alignItems, ...style }}>
      {children}
    </div>
  );
}

type RowProps = {
  children: ReactNode;
  gap?: number;
  align?: "start" | "center" | "end" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around";
  wrap?: boolean;
  style?: CSSProperties;
};
export function Row({ children, gap = 0, align, justify, wrap, style }: RowProps) {
  const alignItems =
    align === "start"
      ? "flex-start"
      : align === "end"
      ? "flex-end"
      : align === "center"
      ? "center"
      : align === "baseline"
      ? "baseline"
      : undefined;
  const justifyContent =
    justify === "start"
      ? "flex-start"
      : justify === "end"
      ? "flex-end"
      : justify === "center"
      ? "center"
      : justify === "between"
      ? "space-between"
      : justify === "around"
      ? "space-around"
      : undefined;
  return (
    <div
      className={`cs-row ${wrap ? "cs-row-wrap" : ""}`}
      style={{ gap, alignItems, justifyContent, ...style }}
    >
      {children}
    </div>
  );
}

type GridProps = {
  children: ReactNode;
  columns?: number | string;
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
  style?: CSSProperties;
};
export function Grid({ children, columns = 1, gap = 0, align, style }: GridProps) {
  const gridTemplateColumns =
    typeof columns === "number"
      ? `repeat(${columns}, minmax(0, 1fr))`
      : columns;
  const alignItems =
    align === "start"
      ? "start"
      : align === "end"
      ? "end"
      : align === "center"
      ? "center"
      : align === "stretch"
      ? "stretch"
      : undefined;
  // Add a marker class so mobile CSS can collapse sidebar grids.
  const isSidebar = typeof columns === "string" && columns.includes("240px");
  return (
    <div
      className={`cs-grid ${isSidebar ? "cs-grid-sidebar" : ""}`}
      style={{ gridTemplateColumns, gap, alignItems, ...style }}
    >
      {children}
    </div>
  );
}

export function Divider() {
  return <hr className="cs-divider" />;
}

// ============================================================================
// Card (collapsible)
// ============================================================================

type CardProps = {
  children: ReactNode;
  collapsible?: boolean;
  defaultOpen?: boolean;
  style?: CSSProperties;
};
type CardHeaderProps = {
  children: ReactNode;
  trailing?: ReactNode;
};
type CardBodyProps = {
  children: ReactNode;
};

// We use React Context to coordinate Card / CardHeader / CardBody so the
// header can drive an open/closed state stored on Card.
import { createContext, useContext } from "react";

type CardCtx = {
  collapsible: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
};
const CardContext = createContext<CardCtx | null>(null);

export function Card({ children, collapsible, defaultOpen = true, style }: CardProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  const ctx: CardCtx = {
    collapsible: !!collapsible,
    open: collapsible ? open : true,
    setOpen,
  };
  return (
    <CardContext.Provider value={ctx}>
      <section className="cs-card" style={style}>
        {children}
      </section>
    </CardContext.Provider>
  );
}

export function CardHeader({ children, trailing }: CardHeaderProps) {
  const ctx = useContext(CardContext);
  const clickable = ctx?.collapsible ?? false;
  return (
    <header
      className={`cs-card-header ${clickable ? "cs-card-clickable" : ""}`}
      onClick={clickable ? () => ctx?.setOpen(!ctx.open) : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                ctx?.setOpen(!ctx.open);
              }
            }
          : undefined
      }
    >
      <span className="cs-card-header-title">{children}</span>
      <span className="cs-card-header-trailing">
        {trailing}
        {clickable && (
          <span className={`cs-card-chevron ${ctx?.open ? "open" : ""}`}>
            ▶
          </span>
        )}
      </span>
    </header>
  );
}

export function CardBody({ children }: CardBodyProps) {
  const ctx = useContext(CardContext);
  if (ctx?.collapsible && !ctx.open) return null;
  return <div className="cs-card-body">{children}</div>;
}

// ============================================================================
// Pill
// ============================================================================

type PillProps = {
  children: ReactNode;
  tone?: "info" | "success" | "warning" | "neutral";
  active?: boolean;
  size?: "sm" | "md";
  onClick?: () => void;
  style?: CSSProperties;
};
export function Pill({ children, tone, active, size = "md", onClick, style }: PillProps) {
  const toneCls = tone ? `cs-pill-${tone}` : "";
  const cls = [
    "cs-pill",
    toneCls,
    size === "sm" && "cs-pill-sm",
    onClick && "cs-pill-clickable",
    active && "cs-pill-active",
  ]
    .filter(Boolean)
    .join(" ");

  if (onClick) {
    return (
      <button
        type="button"
        className={cls}
        onClick={onClick}
        style={{ background: undefined, ...style } as CSSProperties}
      >
        {children}
      </button>
    );
  }
  return (
    <span className={cls} style={style}>
      {children}
    </span>
  );
}

// ============================================================================
// Button
// ============================================================================

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
};
export function Button({
  children,
  variant = "primary",
  onClick,
  style,
  disabled,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`cs-button variant-${variant}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}

// ============================================================================
// Callout
// ============================================================================

type CalloutProps = {
  children: ReactNode;
  tone?: "info" | "success" | "warning" | "danger";
  title?: ReactNode;
};
export function Callout({ children, tone = "info", title }: CalloutProps) {
  return (
    <div className={`cs-callout cs-callout-${tone}`}>
      {title && <div className="cs-callout-title">{title}</div>}
      <div>{children}</div>
    </div>
  );
}

// ============================================================================
// Stat
// ============================================================================

type StatProps = {
  value: ReactNode;
  label: ReactNode;
  tone?: "info" | "success" | "warning";
};
export function Stat({ value, label, tone }: StatProps) {
  return (
    <div className={`cs-stat ${tone ? `tone-${tone}` : ""}`}>
      <div className="cs-stat-value">{value}</div>
      <div className="cs-stat-label">{label}</div>
    </div>
  );
}

// ============================================================================
// Table
// ============================================================================

type Tone = "info" | "success" | "warning" | undefined;
type TableProps = {
  headers: ReactNode[];
  rows: ReactNode[][];
  columnAlign?: ("left" | "center" | "right")[];
  rowTone?: Tone[];
};
export function Table({ headers, rows, columnAlign, rowTone }: TableProps) {
  return (
    <div className="cs-table-wrap">
      <table className="cs-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{ textAlign: columnAlign?.[i] ?? "left" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={rowTone?.[i] ? `row-${rowTone[i]}` : ""}>
              {r.map((cell, j) => (
                <td
                  key={j}
                  style={{ textAlign: columnAlign?.[j] ?? "left" }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// Re-exports kept for parity (imported but unused-tolerant)
// ============================================================================

// (Children/cloneElement/isValidElement/useRef/useCallback are re-exported from
// React already; keeping them imported above so this shim file is self-contained
// if someone later wants to extend it.)
export const __reactUtils = { Children, cloneElement, isValidElement, useRef, useCallback };

// ============================================================================
// Math rendering (KaTeX)
// ============================================================================

// Convert the Unicode-stylized chemistry strings used throughout the study
// guide ("rate = k [H₂O₂]^m [I⁻]^n") into valid LaTeX. The study guide was
// originally authored with pretty Unicode subscripts/superscripts/greek; this
// preprocessor turns those back into proper LaTeX so KaTeX can render real,
// typeset math instead of monospace text.
//
// The conversion is intentionally conservative — anything we don't recognize
// passes through untouched.

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
};

function mergeRunsToLatex(s: string): string {
  // Convert runs of Unicode subscripts/superscripts into _{...} / ^{...}.
  // Order: handle subscripts then superscripts then everything else.
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

// Wrap chemistry-style brackets [H2O2] in \mathrm{} so they render upright,
// not as italic math variables. Also escape spaces inside brackets safely.
function styleChemBrackets(s: string): string {
  // Replace [..] and {..} contents with \mathrm only if they look like a
  // chemical species (letters, digits, +, -, parens, no math operators).
  return s.replace(/\[([^\]\[]*)\]/g, (_, inner: string) => {
    // Skip if inner contains LaTeX commands or arithmetic operators.
    if (/[\\=<>~]/.test(inner)) return `[${inner}]`;
    // Render as upright bracketed concentration.
    return `[\\mathrm{${inner}}]`;
  });
}

// Replace remaining Unicode chars (greek + operators) with LaTeX.
function replaceMap(s: string, map: Record<string, string>): string {
  let out = "";
  for (const ch of s) {
    out += map[ch] ?? ch;
  }
  return out;
}

// Common chemistry shortcuts: Ka, Kb, Ksp, Keq, etc. → \mathrm{K_a} etc.
// We only do this for short word-after-K patterns to avoid overreach.
function styleKVariants(s: string): string {
  return s.replace(/\bK(sp|eq|a|b|w|c|p|f)\b/g, (_, sub: string) => `K_{\\mathrm{${sub}}}`);
}

// Multi-letter ASCII subscripts after `_` get wrapped in \mathrm{} so they
// render upright like real chemistry subscripts (V_eq, M_NaOH, V_initial).
// Single chars (V_2, V_a) are left alone — KaTeX handles those fine.
// Chained underscores like V_acid_initial collapse into a single subscript:
// V_{\mathrm{acid,\,initial}}, so KaTeX doesn't see invalid double-subscripts.
function wrapMultiLetterSubscripts(s: string): string {
  return s.replace(
    /_([a-zA-Z][a-zA-Z0-9]+(?:_[a-zA-Z][a-zA-Z0-9]+)*)/g,
    (_, w: string) => {
      const inner = w.replace(/_/g, ",\\,");
      return `_{\\mathrm{${inner}}}`;
    }
  );
}

// Same for `^` superscripts when followed by 2+ letters (rare but possible).
function wrapMultiLetterSuperscripts(s: string): string {
  return s.replace(/\^([a-zA-Z]{2,})\b/g, (_, w: string) => `^{\\mathrm{${w}}}`);
}

// Convert ^( ... ) and _( ... ) into ^{ ... } and _{ ... } so KaTeX treats
// the parenthetical expression as a single super/subscript argument. Authors
// in the source sometimes wrote e^(-Ea/RT) instead of e^{-Ea/RT}.
function fixParenExpScripts(s: string): string {
  return s
    .replace(/\^\(([^()]*)\)/g, (_, e: string) => `^{(${e})}`)
    .replace(/(?<![A-Za-z\d}])_\(([^()]*)\)/g, (_, e: string) => `_{(${e})}`);
}

// Bare chemistry formulas outside [] brackets — like HOAc, NaOH, HCl, MgSO4 —
// should render upright with \mathrm{}. Heuristic: any token of 2+
// "capital + optional lowercase + optional digits" sub-tokens (so HOAc, Na,
// HCl, MgSO4 match; English proper nouns like Hoff/Beer/Newton don't because
// they have only one capital).
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

// Common math functions: ln, log, exp, sin, cos, tan, etc. should render
// upright with proper spacing. KaTeX has \ln, \log, etc. for this.
const MATH_FUNCS = [
  "ln", "log", "exp", "sin", "cos", "tan", "sec", "csc", "cot",
  "sinh", "cosh", "tanh", "arcsin", "arccos", "arctan",
  "lim", "min", "max", "sup", "inf", "det",
];
function wrapMathFunctions(s: string): string {
  for (const fn of MATH_FUNCS) {
    // Whole-word match, not preceded by a backslash (already a command),
    // letter, or digit, and not followed by a letter/digit.
    const re = new RegExp(`(?<![\\\\a-zA-Z0-9])${fn}(?![a-zA-Z0-9])`, "g");
    s = s.replace(re, `\\${fn}`);
  }
  return s;
}

// Wrap runs of plain English words inside math strings as \text{...} so they
// render upright with proper inter-word spacing. We protect already-grouped
// regions ({...}) so we don't double-wrap content already inside \mathrm or
// \text. Heuristic for what counts as English:
//   - 2+ word phrase, where each word is a Capital + 2+ lowercase OR 2+ lowercase
//   - OR a single word of 3+ lowercase letters (or Capital + 2+ lowercase)
// Apostrophe-continuations like "van't" are allowed.
function wrapEnglishWords(s: string): string {
  // Save existing {...} groups so the regex can't peer inside them.
  const stash: string[] = [];
  s = s.replace(/\{[^{}]*\}/g, (m) => {
    const i = stash.length;
    stash.push(m);
    return `\u0001${i}\u0002`;
  });

  const wordTok = `[A-Za-z][a-z]+(?:'[a-z]+)?`;
  const lowerStartTok = `[a-z]{3,}(?:'[a-z]+)?`;
  // 2+ words separated by single spaces: requires the leader to be a
  // valid word-start (3+ lowercase OR Cap+2+lowercase).
  const multiWord =
    `(?:[a-z]{2,}(?:'[a-z]+)?|[A-Z][a-z]{2,}(?:'[a-z]+)?)` +
    `(?:[ \\t]+${wordTok})+`;
  // Single word: stricter to avoid grabbing variables.
  const singleWord = `(?:${lowerStartTok}|[A-Z][a-z]{3,}(?:'[a-z]+)?)`;
  const combined = `(?:${multiWord}|${singleWord})`;
  const re = new RegExp(`(?<![\\\\a-zA-Z])${combined}`, "g");

  s = s.replace(re, (m) => `\\text{${m}}`);

  // Restore stash.
  s = s.replace(/\u0001(\d+)\u0002/g, (_, i) => stash[+i]);
  return s;
}

export function unicodeToLatex(input: string): string {
  if (!input) return "";
  let s = input;
  // Order matters here:
  // 1. Convert Unicode subscript/superscript runs into _{...}/^{...}.
  s = mergeRunsToLatex(s);
  // 2. Convert Unicode special chars (Greek + math operators + fractions).
  s = replaceMap(s, FRACTION_MAP);
  s = replaceMap(s, GREEK_MAP);
  s = replaceMap(s, OPERATOR_MAP);
  // 3. Wrap multi-letter ASCII subscripts in \mathrm{} so they render
  //    upright (V_eq → V_{\mathrm{eq}}). Run BEFORE English-word wrapping
  //    so the wrapped text is hidden inside { }.
  s = wrapMultiLetterSubscripts(s);
  s = wrapMultiLetterSuperscripts(s);
  // 3b. Convert ^(expr) and _(expr) into ^{(expr)} and _{(expr)}.
  s = fixParenExpScripts(s);
  // 4. Recognize standalone math functions (ln, log, sin, cos…) so they're
  //    upright. Run BEFORE English-word wrapping so we don't mistake them
  //    for plain English.
  s = wrapMathFunctions(s);
  // 5. Recognize bare chemistry formulas (HOAc, NaOH, HCl, MgSO4) and wrap
  //    them in \mathrm{}. Run BEFORE English-word wrapping for proper nouns.
  s = wrapBareChemistry(s);
  // 6. Wrap remaining English words in \text{} so they render uprightly
  //    with normal inter-letter spacing instead of as italic variables.
  s = wrapEnglishWords(s);
  // 7. Style chemistry-style brackets [X] → [\mathrm{X}].
  s = styleChemBrackets(s);
  // 8. Pretty up Ka, Kb, Ksp, Keq, etc.
  s = styleKVariants(s);
  return s;
}

type MathProps = {
  children: string;
  display?: boolean;
  style?: CSSProperties;
};

function renderKatex(latex: string, display: boolean): string {
  try {
    return katex.renderToString(latex, {
      displayMode: display,
      throwOnError: false,
      strict: "ignore",
      output: "html",
      trust: false,
    });
  } catch {
    return `<span class="cs-math-fallback">${escapeHtml(latex)}</span>`;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function Math({ children, display, style }: MathProps) {
  const latex = useMemo(() => unicodeToLatex(children), [children]);
  const html = useMemo(() => renderKatex(latex, !!display), [latex, display]);
  return (
    <span
      className={display ? "cs-math-block" : "cs-math-inline"}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function MathBlock({ children, style }: { children: string; style?: CSSProperties }) {
  const latex = useMemo(() => unicodeToLatex(children), [children]);
  const html = useMemo(() => renderKatex(latex, true), [latex]);
  return (
    <div
      className="cs-math-block-wrap"
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Render a paragraph with optional inline math delimited by $...$ or \(...\)
// or display math via $$...$$ / \[...\]. Anything outside the delimiters is
// rendered as plain text.
type MixedTextSegment =
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

export function MixedText({ text, style }: { text: string; style?: CSSProperties }) {
  const segments = useMemo(() => parseMixedMath(text), [text]);
  if (segments.length === 1 && segments[0].type === "text") {
    return <span style={style}>{segments[0].value}</span>;
  }
  return (
    <span style={style}>
      {segments.map((seg, i) =>
        seg.type === "text" ? (
          <span key={i}>{seg.value}</span>
        ) : (
          <Math key={i} display={seg.display}>{seg.value}</Math>
        )
      )}
    </span>
  );
}
