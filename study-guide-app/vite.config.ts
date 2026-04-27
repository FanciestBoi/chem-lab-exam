import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// `base` is the URL prefix the app expects to be served from.
//   - For local dev / `vite preview` / opening dist/index.html via file:// → "./"
//   - For GitHub Pages at <user>.github.io/<repo>/ → "/<repo>/"
// The GitHub Actions deploy workflow sets VITE_BASE so production builds use
// the absolute repo path; everything else falls back to "./".
const base = process.env.VITE_BASE ?? "./";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [],
      manifest: {
        name: "CHEM 105B Lab Final Study Guide",
        short_name: "CHEM 105B",
        description:
          "USC CHEM 105B General Chemistry II Lab Final review — experiments, formulas, errors, practice.",
        start_url: ".",
        scope: ".",
        display: "standalone",
        background_color: "#0b0e14",
        theme_color: "#0b0e14",
        icons: [
          {
            // Inline SVG with the lab-tube emoji, sized to typical icon sizes.
            src:
              "data:image/svg+xml;utf8," +
              encodeURIComponent(
                "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 192 192'><rect width='192' height='192' rx='32' fill='%230b0e14'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' font-size='128'>🧪</text></svg>"
              ),
            sizes: "192x192",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src:
              "data:image/svg+xml;utf8," +
              encodeURIComponent(
                "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><rect width='512' height='512' rx='80' fill='%230b0e14'/><text x='50%' y='52%' dominant-baseline='middle' text-anchor='middle' font-size='340'>🧪</text></svg>"
              ),
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,woff,woff2,ttf}"],
        runtimeCaching: [
          {
            urlPattern: ({ url }: { url: URL }) =>
              url.origin === "https://fonts.gstatic.com",
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts",
              expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  base,
  server: {
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          katex: ["katex"],
          "react-vendor": ["react", "react-dom"],
        },
      },
    },
  },
});
