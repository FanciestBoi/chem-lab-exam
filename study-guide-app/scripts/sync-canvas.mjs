#!/usr/bin/env node
/**
 * sync-canvas.mjs
 *
 * Derives study-guide-app/src/StudyGuide.tsx from
 * canvases/study-guide.canvas.tsx by applying a known set of transformations
 * that turn the Cursor-canvas-flavored source into something the standalone
 * Vite app can consume.
 *
 * Transformations:
 *   1. The `import { ... } from "cursor/canvas";` block becomes
 *      `import { ..., Math, MathBlock, MixedText } from "./canvas-shim";`.
 *   2. The placeholder `MathLine` is replaced with a `<MathBlock>`-backed
 *      version that actually renders KaTeX.
 *   3. `<Text key={i}>{line}</Text>` inside `Para` is wrapped in `<MixedText>`
 *      so inline `$...$` math renders.
 *   4. `<Code>{it.eq}</Code>` in the formulas table cell becomes
 *      `<Math>{it.eq}</Math>`.
 *
 * Modes:
 *   default            — write study-guide-app/src/StudyGuide.tsx from canvas.
 *   --check            — exit non-zero if the derived output differs from the
 *                        committed StudyGuide.tsx (used in CI).
 *   --reverse          — copy StudyGuide.tsx to the canvas, undoing the
 *                        transformations (handy when the deployed file is the
 *                        easier place to iterate).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const CANVAS_PATH = path.join(REPO_ROOT, "canvases", "study-guide.canvas.tsx");
const TSX_PATH = path.join(
  REPO_ROOT,
  "study-guide-app",
  "src",
  "StudyGuide.tsx"
);

const MATH_LINE_CANVAS = `function MathLine({ text }: { text: string }) {
  const theme = useHostTheme();
  return (
    <div
      style={{
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        fontSize: "0.9em",
        color: theme.text.primary,
        background: theme.fill.tertiary,
        border: \`1px solid \${theme.stroke.tertiary}\`,
        borderRadius: 6,
        padding: "6px 10px",
        whiteSpace: "pre-wrap",
      }}
    >
      {text}
    </div>
  );
}`;

const MATH_LINE_TSX = `function MathLine({ text }: { text: string }) {
  return <MathBlock>{text}</MathBlock>;
}`;

const PARA_LINE_CANVAS = `<Text key={i}>{line}</Text>`;
const PARA_LINE_TSX = `<Text key={i}>
          <MixedText text={line} />
        </Text>`;

const FORMULA_EQ_CANVAS = `<Code>{it.eq}</Code>`;
const FORMULA_EQ_TSX = `<Math>{it.eq}</Math>`;

const FORMULA_EQ_ARRAY_CANVAS = `<Code key={k}>{e}</Code>`;
const FORMULA_EQ_ARRAY_TSX = `<Math key={k}>{e}</Math>`;

function rewriteImportBlock(source, { toShim }) {
  // Match the literal canvas import block (`from "cursor/canvas"`) or the
  // shim variant (`from "./canvas-shim"`) and rewrite it.
  const re = /import\s*\{([\s\S]*?)\}\s*from\s*"(cursor\/canvas|\.\/canvas-shim)";\s*\n/;
  const match = source.match(re);
  if (!match) {
    throw new Error(
      `Could not find import block in source (looking for cursor/canvas or ./canvas-shim).`
    );
  }
  const names = match[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const ensure = (name) => {
    if (!names.includes(name)) names.push(name);
  };
  const drop = (name) => {
    const i = names.indexOf(name);
    if (i >= 0) names.splice(i, 1);
  };

  if (toShim) {
    ensure("Math");
    ensure("MathBlock");
    ensure("MixedText");
    const block = `import {\n  ${names.join(",\n  ")},\n} from "./canvas-shim";\n`;
    return source.replace(re, block);
  } else {
    drop("Math");
    drop("MathBlock");
    drop("MixedText");
    const block = `import {\n  ${names.join(",\n  ")},\n} from "cursor/canvas";\n`;
    return source.replace(re, block);
  }
}

function deriveTsxFromCanvas(canvasSource) {
  let out = rewriteImportBlock(canvasSource, { toShim: true });
  if (!out.includes(MATH_LINE_CANVAS)) {
    throw new Error(
      "Canvas MathLine implementation didn't match the expected snippet."
    );
  }
  out = out.replace(MATH_LINE_CANVAS, MATH_LINE_TSX);
  if (!out.includes(PARA_LINE_CANVAS)) {
    throw new Error("Para text-line snippet missing from canvas.");
  }
  out = out.replace(PARA_LINE_CANVAS, PARA_LINE_TSX);
  if (!out.includes(FORMULA_EQ_CANVAS)) {
    throw new Error("Formulas <Code>{it.eq}</Code> snippet missing from canvas.");
  }
  out = out.replace(FORMULA_EQ_CANVAS, FORMULA_EQ_TSX);
  if (out.includes(FORMULA_EQ_ARRAY_CANVAS)) {
    out = out.replace(FORMULA_EQ_ARRAY_CANVAS, FORMULA_EQ_ARRAY_TSX);
  }
  return out;
}

function deriveCanvasFromTsx(tsxSource) {
  let out = rewriteImportBlock(tsxSource, { toShim: false });
  if (!out.includes(MATH_LINE_TSX)) {
    throw new Error(
      "TSX MathLine implementation didn't match the expected shim snippet."
    );
  }
  out = out.replace(MATH_LINE_TSX, MATH_LINE_CANVAS);
  if (!out.includes(PARA_LINE_TSX)) {
    throw new Error("TSX Para MixedText snippet not found.");
  }
  out = out.replace(PARA_LINE_TSX, PARA_LINE_CANVAS);
  if (!out.includes(FORMULA_EQ_TSX)) {
    throw new Error("TSX <Math>{it.eq}</Math> snippet not found.");
  }
  out = out.replace(FORMULA_EQ_TSX, FORMULA_EQ_CANVAS);
  if (out.includes(FORMULA_EQ_ARRAY_TSX)) {
    out = out.replace(FORMULA_EQ_ARRAY_TSX, FORMULA_EQ_ARRAY_CANVAS);
  }
  return out;
}

function main() {
  const args = process.argv.slice(2);
  const check = args.includes("--check");
  const reverse = args.includes("--reverse");

  if (reverse) {
    const tsx = fs.readFileSync(TSX_PATH, "utf8");
    const derived = deriveCanvasFromTsx(tsx);
    fs.writeFileSync(CANVAS_PATH, derived);
    console.log(
      "sync-canvas: wrote canvases/study-guide.canvas.tsx from study-guide-app/src/StudyGuide.tsx"
    );
    return;
  }

  const canvas = fs.readFileSync(CANVAS_PATH, "utf8");
  const derived = deriveTsxFromCanvas(canvas);

  if (check) {
    const existing = fs.readFileSync(TSX_PATH, "utf8");
    if (existing !== derived) {
      console.error(
        "sync-canvas: study-guide-app/src/StudyGuide.tsx is out of sync with canvases/study-guide.canvas.tsx."
      );
      console.error(
        "Run `npm run prebuild` (or `node scripts/sync-canvas.mjs`) and commit the result."
      );
      process.exit(1);
    }
    console.log("sync-canvas: in sync.");
    return;
  }

  fs.writeFileSync(TSX_PATH, derived);
  console.log(
    "sync-canvas: regenerated study-guide-app/src/StudyGuide.tsx from canvas."
  );
}

main();
