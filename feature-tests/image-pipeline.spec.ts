import { expect, test } from '@playwright/test'
import { evidence } from './helpers'

test('image-pipeline: @unpic/react srcset, dimensions, lazy, modern format', async ({ page, request }) => {
  // Block the CDN for the layout check so the reserved box comes from markup, not the loaded image.
  await page.route('https://wsrv.nl/**', (route) => route.abort())
  await page.goto('/feature-tests/image-pipeline')
  const hero = page.getByTestId('hero-img')
  const off = page.getByTestId('offscreen-img')
  const srcset = (await hero.getAttribute('srcset')) ?? ''
  const widths = [...srcset.matchAll(/\s(\d+)w/g)].map((m) => Number(m[1]))
  expect(widths.length).toBeGreaterThanOrEqual(2)
  // @unpic/core never emits width/height attributes; it reserves space with inline style
  // (max-width/max-height + aspect-ratio). Accept either, but require the box to be 320x480
  // while the image itself failed to load.
  const attrW = await hero.getAttribute('width')
  const attrH = await hero.getAttribute('height')
  const style = (await hero.getAttribute('style')) ?? ''
  const hasAttrs = attrW === '320' && attrH === '480'
  const hasStyleDims = /max-width:320px/.test(style) && /aspect-ratio:0\.666/.test(style)
  expect(hasAttrs || hasStyleDims).toBe(true)
  const box = (await hero.boundingBox())!
  expect(Math.round(box.width)).toBe(320)
  expect(Math.round(box.height)).toBe(480)
  expect(await off.getAttribute('loading')).toBe('lazy')
  expect(await hero.getAttribute('loading')).not.toBe('lazy')

  await page.unroute('https://wsrv.nl/**')
  const firstUrl = srcset.split(',')[0].trim().split(/\s+/)[0]
  const res = await request.get(firstUrl, { headers: { accept: 'image/avif,image/webp,*/*' } })
  const type = res.headers()['content-type']
  expect(type).toMatch(/image\/(avif|webp)/)
  evidence(`srcset widths [${widths.join(',')}]; ${hasAttrs ? 'width/height attrs 320x480' : 'NO width/height attrs; inline style max-width:320px + aspect-ratio reserves a 320x480 box (measured with CDN blocked)'}; offscreen loading=lazy; ${new URL(firstUrl).host} returned ${type}`)
})
