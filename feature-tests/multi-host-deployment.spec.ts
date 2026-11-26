import { existsSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { evidence, ROOT, run } from './helpers'

const TARGETS: { name: string; env: Record<string, string>; expect: string[] }[] = [
  { name: 'node', env: {}, expect: ['server/index.js', 'client/assets'] },
  { name: 'cloudflare', env: { CLOUDFLARE: '1' }, expect: ['server/index.js', 'server/wrangler.json', 'client/assets'] },
  { name: 'netlify', env: { NETLIFY: '1' }, expect: ['server/index.js', 'client/assets', '../../.netlify/v1/functions/react-router-server.mjs'] },
  { name: 'vercel', env: { VERCEL: '1' }, expect: ['client/assets', '../../.vercel/react-router-build-result.json'] },
]

test('multi-host-deployment: builds for node, cloudflare, netlify, vercel', async () => {
  const seen: string[] = []
  for (const t of TARGETS) {
    const dir = `.ft-builds/${t.name}`
    rmSync(join(ROOT, dir), { recursive: true, force: true })
    await run('node', ['node_modules/@react-router/dev/bin.cjs', 'build'], { ...t.env, FT_BUILD_DIR: dir })
    for (const p of t.expect) expect(existsSync(join(ROOT, dir, p)), `${t.name}: ${p}`).toBe(true)
    if (t.name === 'vercel') {
      const bundles = readdirSync(join(ROOT, dir, 'server')).filter((d) => d.startsWith('nodejs_'))
      expect(bundles.length).toBeGreaterThan(0)
    }
    seen.push(t.name)
  }
  evidence(`built ${seen.join(', ')} into .ft-builds/<target>; node server/index.js, cloudflare server/wrangler.json, .netlify/v1/functions/react-router-server.mjs, vercel server/nodejs_* + .vercel/react-router-build-result.json`)
})
