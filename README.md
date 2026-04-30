# Chem Lab Exam — CHEM 105B study materials

Personal study repo for the CHEM 105B (USC) lab final.

**Live study guide:** https://fanciestboi.github.io/chem-lab-exam/

## Repo layout

| Path | What's in it |
| --- | --- |
| `CHEM 105B Lab Manual_compressed.pdf` | Course lab manual (Skibo, USC) |
| `Quizzes/` | Pre-lab quizzes used as context |
| `canvases/study-guide.canvas.tsx` | Original Cursor Canvas source for the study guide |
| `study-guide-app/` | Standalone Vite + React + TypeScript port of the canvas, with KaTeX math rendering. Deployed to GitHub Pages via `.github/workflows/deploy.yml` |

## Running the standalone study guide locally

```bash
cd study-guide-app
npm install
npm run dev   # http://localhost:5173
```

See `study-guide-app/README.md` for build, deploy, and mobile-access instructions.

## Study tools (active learning, not just reference)

In addition to the per-experiment theory / errors / Q&A / practice problems, the app has a dedicated **STUDY TOOLS** sidebar group built on retrieval-practice + spaced-repetition research:

- **Flashcards (SR)** — Leitner deck (5 boxes; default 1/3/7/14/30-day intervals) auto-derived from every Q&A, error row, and formula. Each card shows the experiment number, short title, and a one-line summary so the prompt is never decontextualized. Order can be **shuffled** (with a re-shuffle button) or kept original. Setting an **exam date** activates **cram mode**: intervals are compressed proportionally to the time remaining (e.g. exam tomorrow ⇒ box-5 ≈ 24 h, box-1 ≈ 48 min) so the full deck loops before the test, and a one-click action marks all filtered cards due now. Hotkeys: `Space`/`Enter` to flip, `1`-`4` to self-grade *Again*/*Hard*/*Good*/*Easy*.
- **Quiz mode** — random interleaved sampler over the full problem bank with self-grade, streak, and per-experiment accuracy heatmap.
- **Mock exam (60 min)** — 12-13 problems sized to ~40 pts with a 60-minute countdown; solutions stay hidden until submit/expiry; score history is saved.
- **Skibo traps** — specific "gotchas" past quizzes punish (rate-definition coefficient, buffer base amount, log decimals, charge balancing in redox, blank vs zero, TD vs TC, etc.).
- **Past quizzes** — verbatim transcriptions of all 7 Skibo pre-lab quizzes with hide-able worked solutions.
- **Cross-cutting** — single page that surfaces concepts spanning multiple experiments (Beer's Law, Equilibrium, Thermo, Arrhenius, redox/n, log sig figs) with links into the relevant experiments.
- **Mnemonics** — spectrochemical series, OIL RIG, REDCAT, color-complement wheel, IR diagnostic pegs, plot-identifier cheat, sign-of-ΔG grid.

Each experiment page now also has a **TL;DR** card at the top, a **step-faded worked example** in the Analysis section (Setup → Equation → Plug-in → Answer), and a **Related** footer linking to other experiments on the same concept.

Press `⌘K` / `Ctrl+K` / `/` to open search across every page (experiments, study tools, references). Print (`⌘P`) exports the entire guide with all collapsibles expanded.

## Auto-deploy

Pushes to `main` build `study-guide-app/` and publish to GitHub Pages via the workflow at `.github/workflows/deploy.yml`. Vite's `base` is set from `VITE_BASE` so the deployed URL is `https://fanciestboi.github.io/chem-lab-exam/` while local dev still works at `/`.
