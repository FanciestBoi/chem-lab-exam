# CHEM 105B — Lab Final Study Guide (standalone web app)

**Live:** https://fanciestboi.github.io/chem-lab-exam/

This is the same study guide as the original Cursor canvas, but as a
self-contained web app you can open in any browser — no Cursor required. All
math/formulas render with [KaTeX](https://katex.org/) for proper typeset
equations. All progress (which experiments you've reviewed, which solutions
you've revealed) is saved in your browser's `localStorage`.

Pushing a commit to `main` automatically rebuilds and redeploys via the GitHub
Actions workflow at `.github/workflows/deploy.yml`.

## Three ways to use it

### 1. Run locally with hot reload (recommended while studying)

```bash
cd "/Users/henrydean/Downloads/Chem Lab Exam/study-guide-app"
npm run dev
```

Then open http://localhost:5173 in your browser.

### 2. Build a static copy you can open offline

```bash
npm run build
open dist/index.html
```

The `dist/` folder becomes a fully self-contained static site. You can:

- Double-click `dist/index.html` to open it directly in your browser (works
  offline, no server needed — `vite.config.ts` is set up with `base: "./"` so
  relative asset paths resolve correctly under `file://`).
- Or, `cd dist && python3 -m http.server 8000` if you prefer a real server.
- Or, drag the `dist/` folder onto Netlify Drop / Vercel / GitHub Pages to host
  it for free — useful if you want to study from your phone.

### 3. Mobile / iPad

Run `npm run dev -- --host` and open the printed `Network:` URL on a device on
the same Wi-Fi as your laptop. The layout collapses cleanly on narrow screens.

## Project layout

```
study-guide-app/
├── index.html
├── vite.config.ts
├── package.json
├── tsconfig.json
└── src/
    ├── main.tsx          # React entry
    ├── styles.css        # Theme + component styles (auto dark/light mode)
    ├── canvas-shim.tsx   # Re-implements the cursor/canvas API in plain HTML
    └── StudyGuide.tsx    # The study guide (ported from study-guide.canvas.tsx)
```

`StudyGuide.tsx` is the same file as
`/Users/henrydean/.cursor/projects/.../canvases/study-guide.canvas.tsx`,
with one line changed (its import points at `./canvas-shim` instead of
`cursor/canvas`). If you regenerate the canvas, just `cp` it over and re-do
that single import line.

## Study tools

The sidebar has a dedicated **STUDY TOOLS** group (above REFERENCE) for active-recall practice — all of these auto-derive their content from the experiments and the past quizzes, and persist their state to `localStorage`.

| Page | What it does |
| --- | --- |
| **Flashcards (SR)** | Leitner spaced-repetition deck (~160 cards) auto-generated from every Q&A, error row, and formula. Five boxes with 1 / 3 / 7 / 14 / 30-day intervals; "Due today" surfaces only what you actually need to review. |
| **Quiz mode** | Random interleaved sampler over the full practice + Q&A bank. Self-grade right/wrong, see a streak counter and a per-experiment accuracy heatmap so you know which experiment to drill next. |
| **Mock exam (60 min)** | Twelve to thirteen problems sized to ~40 points (mirrors the real lab final's mix). 60-minute countdown timer, solutions stay hidden until you submit (or the timer expires), score history is saved across attempts. |
| **Skibo traps** | The specific "gotchas" past quizzes punish (rate-definition coefficient, buffer base-amount logic, log-decimal sig figs, balancing redox for charge AND mass, blank vs zero, TD vs TC, etc.). Each has a "Bait" / "Catch" pair. |
| **Past quizzes** | Verbatim transcriptions of all seven Skibo pre-lab quizzes (Initial-rate kinetics, Pseudo-rate, LCP, BTB indicator, Buffers, Titrations, Ca(OH)₂ Ksp). Each question hides a worked solution behind a click. |
| **Cross-cutting** | Concept map for ideas that span multiple experiments (Beer's Law, Equilibrium, Thermo, Arrhenius, redox/n electrons, log/decimal sig figs). Each row links into the relevant experiments. |
| **Mnemonics** | Distilled hooks: spectrochemical series, OIL RIG, REDCAT, color-complement wheel, IR diagnostic pegs, plot-identifier table, sign-of-ΔG grid, and more. |

Inline upgrades on every experiment page:

- **TL;DR card** at the top — read just these for all 11 experiments to scrape a B+; read the rest to get the A.
- **Step-faded worked example** in the Analysis section — tap *Reveal next step* to progressively uncover Setup → Equation → Plug-in → Answer (try the next step yourself before peeking).
- **Related** footer at the bottom linking to other experiments touching the same concepts.

### Hotkeys

| Key | Action |
| --- | --- |
| `⌘K` / `Ctrl+K` / `/` | Open search overlay (indexes every section, including the new ones) |
| `[` / `]` | Previous / next experiment |
| `Esc` | Close search |
| `Space` / `Enter` | (on Flashcards) flip card between front and back |
| `1` / `2` / `3` / `4` | (on Flashcards, after flip) self-grade *Again* / *Hard* / *Good* / *Easy* — sets the next interval per Leitner |

### Print export

Hit your browser's print dialog (`⌘P` / `Ctrl+P`) to export the entire guide — every experiment, every flashcard, every mock-exam question + solution, every past quiz, and every reference pane. The print stylesheet auto-expands all collapsibles.

## Dark / light mode

The app follows your OS appearance setting via
`@media (prefers-color-scheme)`. Change your Mac's appearance to flip it.

## Resetting progress

Either click the **Reset progress** button in the sidebar, or in DevTools
console:

```js
Object.keys(localStorage)
  .filter(k => k.startsWith("chem105b.studyguide."))
  .forEach(k => localStorage.removeItem(k));
```
