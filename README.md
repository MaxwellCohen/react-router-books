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
