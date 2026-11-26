import type { Route } from './+types/render-modes-dynamic'
import { FeaturePage } from './shared'

export function loader() {
  return { renderedAt: new Date().toISOString() }
}

export default function Dynamic({ loaderData }: Route.ComponentProps) {
  return (
    <FeaturePage title="Server-rendered" label="1st-party">
      <p>Rendered at <span data-testid="rendered-at">{loaderData.renderedAt}</span></p>
    </FeaturePage>
  )
}
