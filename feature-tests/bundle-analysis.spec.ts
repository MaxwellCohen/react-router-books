import { existsSync, readFileSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { evidence, ROOT, run } from './helpers'

test('bundle-analysis: ANALYZE=1 build with rollup-plugin-visualizer writes a report', async () => {
  const dir = '.ft-builds/analyze'
  rmSync(join(ROOT, dir), { recursive: true, force: true })
  await run('node', ['node_modules/@react-router/dev/bin.cjs', 'build'], { ANALYZE: '1', FT_BUILD_DIR: dir })
  const html = join(ROOT, dir, 'stats.html')
  const json = join(ROOT, dir, 'stats.json')
  expect(existsSync(html)).toBe(true)
  expect(existsSync(json)).toBe(true)
  const data = JSON.parse(readFileSync(json, 'utf8'))
  const modules = Object.keys(data.nodeMetas ?? {}).length
  expect(modules).toBeGreaterThan(10)
  evidence(`${dir}/stats.html (${statSync(html).size} B) + stats.json with ${modules} modules`)
})
