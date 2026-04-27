import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `base` is the URL prefix the app expects to be served from.
//   - For local dev / `vite preview` / opening dist/index.html via file:// → "./"
//   - For GitHub Pages at <user>.github.io/<repo>/ → "/<repo>/"
// The GitHub Actions deploy workflow sets VITE_BASE so production builds use
// the absolute repo path; everything else falls back to "./".
const base = process.env.VITE_BASE ?? "./";

export default defineConfig({
  plugins: [react()],
  base,
  server: {
    port: 5173,
    open: true,
  },
});
