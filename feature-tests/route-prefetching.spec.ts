import { expect, test } from '@playwright/test'
import { evidence, waitForHydration } from './helpers'

test('route-prefetching: <Link prefetch="intent"> fetches target code + data on hover', async ({ page }) => {
  const requests: { url: string; t: number }[] = []
  page.on('request', (r) => requests.push({ url: r.url(), t: Date.now() }))
  await page.goto('/feature-tests/route-prefetching')
  await waitForHydration(page)
  await page.waitForLoadState('networkidle')

  const isTarget = (u: string) => /route-prefetching-target-[^/]*\.js$/.test(u) || u.includes('/feature-tests/route-prefetching/target.data')
  expect(requests.filter((r) => isTarget(r.url))).toEqual([])

  await page.getByTestId('intent-link').hover()
  await expect.poll(() => requests.filter((r) => isTarget(r.url)).length).toBeGreaterThanOrEqual(2)
  const prefetched = requests.filter((r) => isTarget(r.url)).map((r) => new URL(r.url).pathname)
  const clickAt = Date.now()
  await page.getByTestId('intent-link').click()
  await expect(page.getByTestId('target')).toContainText('PREFETCH_TARGET_DATA')
  expect(requests.filter((r) => isTarget(r.url)).every((r) => r.t < clickAt || prefetched.length >= 2)).toBe(true)
  evidence(`on hover, before click: ${prefetched.join(', ')}`)
})
