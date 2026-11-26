import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('css-inlining: route CSS is inlined in <style>, not a render-blocking link', async ({ page, request }) => {
  const res = await request.get('/feature-tests/css-inlining')
  const html = await res.text()
  const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1])
  const inline = styles.find((s) => s.includes('.ft-inline-marker'))
  expect(inline, 'inline <style> with route CSS').toBeTruthy()

  const hrefs = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1])
  for (const href of hrefs) {
    const css = await (await request.get(href)).text()
    expect(css.includes('ft-inline-marker'), `${href} must not carry the route CSS`).toBe(false)
  }

  await page.goto('/feature-tests/css-inlining')
  const color = await page.getByTestId('inline-box').evaluate((el) => getComputedStyle(el).borderTopColor)
  expect(color).toBe('rgb(255, 0, 128)')
  evidence(`SSR HTML has <style> containing .ft-inline-marker (${inline!.length} bytes); none of ${hrefs.length} stylesheet link(s) contain it; style applied (${color})`)
})
