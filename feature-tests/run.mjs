// Build the app, serve the production build on PORT, run all feature specs, write results.json.
import { execFileSync, spawn, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = process.env.PORT || '4121'
const FEATURES = {
  'css-inlining': ['manual', "Vite '?inline' import rendered into a <style> in the route component"],
  'font-optimization': ['third-party', 'Fontsource (@fontsource-variable/geist-mono) + hand-added <link rel=preload as=font> via route links()'],
  'image-pipeline': ['third-party', '@unpic/react <Image> over the wsrv.nl image CDN'],
  caching: ['first-party', 'route `headers` export (Cache-Control public, max-age=3, s-maxage=3)'],
  'route-prefetching': ['first-party', '<Link prefetch="intent">'],
  islands: ['experimental', 'separate RSC framework-mode sub-app (unstable_reactRouterRSC + @vitejs/plugin-rsc) with one "use client" island'],
  'render-modes': ['first-party', 'react-router.config prerender list + ssr:true + clientLoader route'],
  reactivity: ['third-party', '@preact/signals-react signal passed directly as JSX text child'],
  'bundle-analysis': ['third-party', 'rollup-plugin-visualizer added to client build when ANALYZE=1'],
  'third-party-scripts': ['manual', 'useEffect injects <script async> after hydration (stand-in /ft/fake-third-party.js)'],
  'multi-host-deployment': ['third-party', 'node (@react-router/serve), CLOUDFLARE=1 (@cloudflare/vite-plugin), NETLIFY=1 (@netlify/vite-plugin-react-router), VERCEL=1 (@vercel/react-router preset)'],
}

function build() {
  for (let i = 1; i <= 3; i++) {
    const r = spawnSync('node', ['node_modules/@react-router/dev/bin.cjs', 'build'], { cwd: ROOT, stdio: 'inherit' })
    if (r.status === 0) return
    console.warn(`build attempt ${i} failed (prerender has a fixed 10s timeout; retrying)`)
  }
  throw new Error('build failed')
}

async function waitFor(url, ms = 120_000) {
  const end = Date.now() + ms
  while (Date.now() < end) {
    try {
      if ((await fetch(url)).status < 500) return
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`server not ready: ${url}`)
}

build()
const server = spawn('node', ['node_modules/@react-router/serve/bin.cjs', './build/server/index.js'], {
  cwd: ROOT,
  env: { ...process.env, PORT },
  stdio: 'inherit',
})
let exitCode = 1
try {
  await waitFor(`http://localhost:${PORT}/icon.svg`)
  const pw = spawnSync('node', ['node_modules/@playwright/test/cli.js', 'test', '-c', 'feature-tests/playwright.config.ts'], {
    cwd: ROOT,
    env: { ...process.env, PORT },
    stdio: 'inherit',
  })
  exitCode = pw.status ?? 1
} finally {
  server.kill()
}

const reportPath = join(ROOT, 'feature-tests/report.json')
const report = existsSync(reportPath) ? JSON.parse(readFileSync(reportPath, 'utf8')) : { suites: [] }
const byFile = {}
const walk = (suite) => {
  for (const spec of suite.specs ?? []) byFile[spec.file] = spec
  for (const s of suite.suites ?? []) walk(s)
}
report.suites.forEach(walk)

const results = {}
for (const [id, [claimedLabel, method]] of Object.entries(FEATURES)) {
  const file = `${id}.spec.ts`
  const spec = byFile[file]
  const t = spec?.tests?.[0]
  const r = t?.results?.at(-1)
  const ev = t?.annotations?.find((a) => a.type === 'evidence')?.description ?? r?.annotations?.find((a) => a.type === 'evidence')?.description
  const err = r?.error?.message?.split('\n').find((l) => l.trim())?.replace(/\x1b\[[0-9;]*m/g, '')
  results[id] = {
    claimedLabel,
    status: r?.status === 'passed' ? 'pass' : spec ? 'fail' : 'blocked',
    method,
    evidence: ev ?? err ?? 'spec did not run',
    test: `feature-tests/${file}`,
  }
}

const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT }).toString().trim()
const out = { framework: 'react-router', repo: 'react-router-books', commit, ranAt: new Date().toISOString(), results }
writeFileSync(join(ROOT, 'feature-tests/results.json'), `${JSON.stringify(out, null, 2)}\n`)
console.log(Object.entries(results).map(([k, v]) => `${k}: ${v.status}`).join('\n'))
process.exit(exitCode)
