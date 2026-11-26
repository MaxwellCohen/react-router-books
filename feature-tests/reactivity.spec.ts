import { expect, test } from '@playwright/test'
import { evidence, waitForHydration } from './helpers'

test('reactivity: @preact/signals-react updates text without re-rendering the component', async ({ page }) => {
  await page.goto('/feature-tests/reactivity')
  await waitForHydration(page)
  await expect.poll(() => page.evaluate(() => (window as any).__ftReactivityRenders)).toBe(1)
  for (let i = 0; i < 3; i++) await page.getByTestId('increment').click()
  await expect(page.getByTestId('count')).toHaveText('3')
  const renders = await page.evaluate(() => (window as any).__ftReactivityRenders)
  expect(renders).toBe(1)
  await expect(page.getByTestId('renders')).toHaveText('1')
  evidence(`3 clicks -> bound text 3; component render count stayed ${renders}`)
})
