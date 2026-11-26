// Listed in react-router.config.ts `prerender`, so this HTML is generated at build time.
import type { Route } from './+types/render-modes-static'
import { FeaturePage } from './shared'

export function loader() {
  return { renderedAt: new Date().toISOString() }
}

export default function Static({ loaderData }: Route.ComponentProps) {
  return (
    <FeaturePage title="Prerendered" label="1st-party">
      <p>Rendered at <span data-testid="rendered-at">{loaderData.renderedAt}</span></p>
    </FeaturePage>
  )
}
