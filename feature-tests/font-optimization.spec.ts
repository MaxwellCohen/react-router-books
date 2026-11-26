import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('font-optimization: self-hosted Fontsource font, font-display, preload', async ({ page, request, baseURL }) => {
  const external: string[] = []
  const fontRequests: string[] = []
  page.on('request', (r) => {
    const url = r.url()
    if (/fonts\.(googleapis|gstatic)\.com/.test(url)) external.push(url)
    if (r.resourceType() === 'font' || url.endsWith('.woff2')) fontRequests.push(url)
  })
  await page.goto('/feature-tests/font-optimization')
  await page.evaluate(() => document.fonts.ready)

  const html = await (await request.get('/feature-tests/font-optimization')).text()
  const preload = html.match(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/)?.[0]
  expect(preload, 'preload link for font').toBeTruthy()
  const preloadHref = preload!.match(/href="([^"]+)"/)![1]

  const cssHrefs = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1])
  let fontFaces: string[] = []
  for (const href of cssHrefs) {
    const css = await (await request.get(href)).text()
    fontFaces = fontFaces.concat(css.match(/@font-face\{[^}]*\}/g) ?? [])
  }
  const monoFace = fontFaces.find((f) => f.includes('Geist Mono Variable') && f.includes(preloadHref.split('/').pop()!))
  expect(monoFace, '@font-face for preloaded file').toBeTruthy()
  expect(monoFace).toMatch(/font-display:\s*swap/)

  expect(external).toEqual([])
  expect(fontRequests.length).toBeGreaterThan(0)
  expect(fontRequests.every((u) => u.startsWith(baseURL!))).toBe(true)
  const loaded = await page.evaluate(() => document.fonts.check('16px "Geist Mono Variable"'))
  expect(loaded).toBe(true)
  evidence(`preload ${preloadHref}; @font-face has font-display:swap; ${fontRequests.length} font request(s) all same-origin; 0 Google Fonts requests`)
})
