import { spawn, type ChildProcess } from 'node:child_process'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { evidence, ROOT, run } from './helpers'

const SUB = join(ROOT, 'feature-tests/rsc-islands')
const RSC_PORT = 4122
let server: ChildProcess | undefined

test.beforeAll(async () => {
  await run('node', [join(ROOT, 'node_modules/vite/bin/vite.js'), 'build'], {}, SUB)
  server = spawn('node', [join(ROOT, 'node_modules/@react-router/serve/bin.cjs'), './build/server/index.js'], {
    cwd: SUB,
    env: { ...process.env, PORT: String(RSC_PORT) },
    stdio: 'ignore',
  })
  for (let i = 0; i < 240; i++) {
    try {
      if ((await fetch(`http://localhost:${RSC_PORT}/`)).ok) return
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('RSC sub-app did not start')
})
test.afterAll(() => server?.kill())

test('islands: experimental RSC — server component code not shipped, client island hydrates', async ({ page }) => {
  const js: { url: string; body: string }[] = []
  page.on('response', async (r) => {
    if (r.request().resourceType() === 'script' || r.url().endsWith('.js')) js.push({ url: r.url(), body: await r.text().catch(() => '') })
  })
  await page.goto(`http://localhost:${RSC_PORT}/`)
  await expect(page.getByTestId('static')).toContainText('RSC_STATIC_MARKER')
  const island = page.getByTestId('island')
  await expect(async () => {
    await island.click()
    await expect(island).not.toHaveText('Island clicks: 0', { timeout: 500 })
  }).toPass({ timeout: 30_000 })
  await page.waitForLoadState('networkidle')

  expect(js.length).toBeGreaterThan(0)
  const leaking = js.filter((j) => j.body.includes('RSC_STATIC_MARKER'))
  const islandChunk = js.filter((j) => j.body.includes('CLIENT_ISLAND_MARKER'))
  expect(leaking.map((j) => j.url)).toEqual([])
  expect(islandChunk.length).toBeGreaterThan(0)
  evidence(`unstable_reactRouterRSC + @vitejs/plugin-rsc@0.5.26 sub-app: island clicked to "${await island.textContent()}"; ${js.length} JS files, none contain server marker; island code in ${new URL(islandChunk[0].url).pathname}`)
})
