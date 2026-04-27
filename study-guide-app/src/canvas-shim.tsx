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
import {
  unicodeToLatex,
  parseMixedMath,
  type MixedTextSegment,
} from "./latex";

export { unicodeToLatex, parseMixedMath };
export type { MixedTextSegment };

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
    if (typeof window === "undefined") return;
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

// Subscription list of setOpen callbacks; on `beforeprint` we force every
// collapsible card open so the printable PDF shows all content. After print
// (or on Esc) the original state is restored.
const printForceOpenListeners = new Set<() => void>();
let printListenerInstalled = false;
function ensurePrintListener() {
  if (printListenerInstalled || typeof window === "undefined") return;
  printListenerInstalled = true;
  window.addEventListener("beforeprint", () => {
    printForceOpenListeners.forEach((fn) => fn());
  });
}

export function Card({ children, collapsible, defaultOpen = true, style }: CardProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  useEffect(() => {
    if (!collapsible) return;
    ensurePrintListener();
    const force = () => setOpen(true);
    printForceOpenListeners.add(force);
    return () => {
      printForceOpenListeners.delete(force);
    };
  }, [collapsible]);
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
  title?: string;
  ariaLabel?: string;
};
export function Button({
  children,
  variant = "primary",
  onClick,
  style,
  disabled,
  title,
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`cs-button variant-${variant}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      title={title}
      aria-label={ariaLabel ?? title}
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
// Unicode→LaTeX preprocessing lives in ./latex (see that file for details);
// this section just wires KaTeX onto React components.


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

const katexHtmlCache = new Map<string, string>();

function renderKatexCached(latex: string, display: boolean): string {
  const key = (display ? "B|" : "I|") + latex;
  let html = katexHtmlCache.get(key);
  if (html == null) {
    html = renderKatex(latex, display);
    katexHtmlCache.set(key, html);
  }
  return html;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function Math({ children, display, style }: MathProps) {
  const latex = useMemo(() => unicodeToLatex(children), [children]);
  const html = useMemo(() => renderKatexCached(latex, !!display), [latex, display]);
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
  const html = useMemo(() => renderKatexCached(latex, true), [latex]);
  return (
    <div
      className="cs-math-block-wrap"
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// `parseMixedMath` is re-exported above from ./latex; the React wrapper
// component lives here so it can use `useMemo` and reference `<Math>`.
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
