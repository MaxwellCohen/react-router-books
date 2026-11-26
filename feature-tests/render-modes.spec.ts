import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { expect, test } from '@playwright/test'
import { evidence, ROOT } from './helpers'

const stamp = (html: string) => html.match(/data-testid="rendered-at">([^<]+)</)?.[1]

test('render-modes: prerendered, per-request SSR, and clientLoader routes', async ({ page, request }) => {
  const file = join(ROOT, 'build/client/feature-tests/render-modes/static/index.html')
  expect(existsSync(file)).toBe(true)
  const built = stamp(readFileSync(file, 'utf8'))

  const s1 = stamp(await (await request.get('/feature-tests/render-modes/static')).text())
  await page.waitForTimeout(50)
  const s2 = stamp(await (await request.get('/feature-tests/render-modes/static')).text())
  expect(s1).toBe(built)
  expect(s2).toBe(built)

  const d1 = stamp(await (await request.get('/feature-tests/render-modes/dynamic')).text())
  await page.waitForTimeout(50)
  const d2 = stamp(await (await request.get('/feature-tests/render-modes/dynamic')).text())
  expect(d1).toBeTruthy()
  expect(d1).not.toBe(d2)

  const clientHtml = await (await request.get('/feature-tests/render-modes/client')).text()
  expect(clientHtml).toContain('data-testid="fallback"')
  expect(stamp(clientHtml)).toBeUndefined()
  await page.goto('/feature-tests/render-modes/client')
  await expect(page.getByTestId('where')).toHaveText('client')

  evidence(`prerendered build/client/.../static/index.html served with stable stamp ${built}; /dynamic stamps differ (${d1} vs ${d2}); /client SSR shows HydrateFallback, data from clientLoader`)
})
