# React Router Books

Goodreads catalog demo built with React Router framework mode (SSR, streaming loaders), Tailwind CSS v4, and Drizzle on Neon Postgres. Port of the shared "Books" app.

## Environment

Copy `.env.example` to `.env`.

- `POSTGRES_URL` — Postgres connection string. Leave empty to serve the built-in preview catalog.
- `API_DELAY_MS` — optional artificial server latency in milliseconds.

## Commands

- `pnpm dev` — dev server on port 3000
- `pnpm build` — production build
- `pnpm start` — serve the build (`PORT` env, default 3000)
- `pnpm typecheck` — typegen + `tsc`

## Deployment

| Host | URL | Build flag |
| --- | --- | --- |
| Vercel | https://react-router-books-tau.vercel.app | `VERCEL=1` (set by Vercel) |
| Netlify | https://react-router-books.netlify.app | `NETLIFY=1` |
| Cloudflare Workers | https://react-router-books.to-email-max.workers.dev | `CLOUDFLARE=1` (or `WORKERS_CI`, set by Workers Builds) |

### `optimized` branch

| Host | URL |
| --- | --- |
| Vercel | https://react-router-books-optimized.vercel.app |
| Netlify | https://react-router-books-max-optimized.netlify.app |
| Cloudflare Workers | https://react-router-books-optimized.to-email-max.workers.dev |

- Self-hosted Geist fonts (`@fontsource-variable/geist`, `@fontsource-variable/geist-mono`) bundled and served from the app origin instead of Google Fonts.
- Caching: catalog queries are cached for 1 hour with in-flight de-dup (in-memory plus Vercel `getCache`, Netlify Blobs, or Workers KV `CATALOG_CACHE`); hashed assets are served `immutable` on every host.

- Vercel and Netlify are connected to this repo: a push to `main` builds and deploys to both. Cloudflare is deployed with `pnpm deploy:cloudflare`.
- The build picks the host adapter from the flag above; with no flag it targets Node.
- `POSTGRES_URL` is set on every host (Vercel and Netlify environment variable, Cloudflare secret). Without it the app serves the preview catalog.
- Manual deploys: `pnpm deploy:vercel`, `pnpm deploy:netlify`, `pnpm deploy:cloudflare`.
