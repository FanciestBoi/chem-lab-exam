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

## Auto-deploy

Pushes to `main` build `study-guide-app/` and publish to GitHub Pages via the workflow at `.github/workflows/deploy.yml`. Vite's `base` is set from `VITE_BASE` so the deployed URL is `https://fanciestboi.github.io/chem-lab-exam/` while local dev still works at `/`.
