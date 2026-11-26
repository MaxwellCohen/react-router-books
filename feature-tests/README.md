# Feature tests

Validates each [Framework Compare](https://framework-compare.vercel.app) label for React Router
against a production build of this app.

```sh
pnpm install
pnpm test:features   # = node feature-tests/run.mjs
```

`run.mjs` builds the app (`react-router build`), serves `build/` with `@react-router/serve` on
`PORT` (default 4121), runs every `feature-tests/*.spec.ts` with Playwright (system Chrome at
`/home/maxc/.local/bin/google-chrome`), and writes `feature-tests/results.json`.
Routes live under `/feature-tests/*` (`app/routes/feature-tests/`).

| Feature | Label | What the test checks |
| --- | --- | --- |
| css-inlining | Manual | SSR HTML has a `<style>` with the route CSS (Vite `?inline`), no stylesheet `<link>` contains it, style applies. |
| font-optimization | Third-party | Fontsource font: `<link rel=preload as=font>` (added via `links`), `@font-face` has `font-display: swap`, all font requests same-origin, zero Google Fonts requests. |
| image-pipeline | Third-party | `@unpic/react` `<Image>`: `srcset` ≥2 widths, `width`/`height`, offscreen `loading=lazy`, srcset URL (wsrv.nl CDN, needs network) returns webp/avif. |
| caching | 1st-party | Route `headers` export → `Cache-Control: public, max-age=3, s-maxage=3` on document and `.data`; browser `fetch` reuses the cached loader counter within TTL, gets a fresh one after. |
| route-prefetching | 1st-party | `<Link prefetch="intent">`: hover requests the target route chunk and `.data` before click. |
| islands | Experimental | Separate RSC framework-mode sub-app (`feature-tests/rsc-islands`, built with `unstable_reactRouterRSC` + `@vitejs/plugin-rsc@0.5.26`, served on 4122): the `"use client"` island works; no client JS contains the server component's marker. |
| render-modes | 1st-party | `prerender` writes `build/client/.../static/index.html`, served with a stable timestamp; `/dynamic` timestamp changes per request; `/client` SSRs `HydrateFallback`, data comes from `clientLoader`. |
| reactivity | Third-party | `@preact/signals-react`: 3 clicks update bound text to 3, component render count stays 1. |
| bundle-analysis | Third-party | `ANALYZE=1` build adds `rollup-plugin-visualizer` → `stats.html` + `stats.json`. |
| third-party-scripts | Manual | Stand-in `/ft/fake-third-party.js` absent from SSR HTML, injected `async` in `<body>` after hydration, sets its global. |
| multi-host-deployment | Third-party | Builds node, `CLOUDFLARE=1`, `NETLIFY=1`, `VERCEL=1` into `.ft-builds/<target>` and checks each host's output files. |

Notes
- `@vitejs/plugin-rsc` is pinned to 0.5.26: with 0.5.39 the RR 8.5.1 RSC build fails with
  "Vite RSC assets manifest not found" (plugin hook ordering changed).
- React Router's prerender step has a fixed 10s request timeout; on a heavily loaded machine the
  server cold start can exceed it, so builds are retried up to 3 times.
- `entry.server.tsx` now only sets its default `Cache-Control` when a route `headers` export hasn't.
