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
