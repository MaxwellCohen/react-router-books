import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('third-party-scripts: vendor script injected async after hydration, not render-blocking', async ({ page, request }) => {
  const html = await (await request.get('/feature-tests/third-party-scripts')).text()
  expect(html).not.toContain('fake-third-party.js')
  const head = html.split('</head>')[0]
  expect(head).not.toContain('fake-third-party.js')

  let requestedAt = 0
  page.on('request', (r) => {
    if (r.url().endsWith('/ft/fake-third-party.js')) requestedAt = Date.now()
  })
  await page.goto('/feature-tests/third-party-scripts')
  await expect.poll(() => page.evaluate(() => Boolean((window as any).__fakeThirdParty))).toBe(true)
  const info = await page.evaluate(() => {
    const s = document.querySelector<HTMLScriptElement>('script[data-ft="third-party"]')!
    return { async: s.async, inHead: s.parentElement === document.head, hydratedAt: (window as any).__ftHydratedAt, ranAt: (window as any).__fakeThirdParty.ranAt }
  })
  expect(info.async).toBe(true)
  expect(info.inHead).toBe(false)
  expect(info.ranAt).toBeGreaterThan(info.hydratedAt)
  expect(requestedAt).toBeGreaterThan(0)
  evidence(`not in SSR HTML; injected async into <body> after hydration (hydrated ${info.hydratedAt.toFixed(0)}ms, ran ${info.ranAt.toFixed(0)}ms); global set`)
})
