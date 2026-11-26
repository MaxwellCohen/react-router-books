import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('caching: route headers export sets Cache-Control and the browser reuses the response', async ({ page, request }) => {
  const direct = await request.get('/feature-tests/caching')
  const cc = direct.headers()['cache-control']
  expect(cc).toBe('public, max-age=3, s-maxage=3')

  await page.goto('/feature-tests/caching')
  const read = () =>
    page.evaluate(async () => {
      const html = await (await fetch('/feature-tests/caching')).text()
      return Number(html.match(/data-testid="counter">(\d+)</)![1])
    })
  const first = await read()
  const second = await read()
  expect(second).toBe(first)
  await page.waitForTimeout(3500)
  const third = await read()
  expect(third).toBeGreaterThan(first)

  const dataCc = (await request.get('/feature-tests/caching.data')).headers()['cache-control']
  expect(dataCc).toBe(cc)
  evidence(`Cache-Control "${cc}" on document and .data; browser fetch within TTL reused counter ${first}=${second}; after TTL got fresh ${third}`)
})
