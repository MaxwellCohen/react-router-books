// clientLoader with no server loader: the data is produced in the browser only.
import type { Route } from './+types/render-modes-client'
import { FeaturePage } from './shared'

export async function clientLoader() {
  return { renderedAt: new Date().toISOString(), where: 'client' }
}

export function HydrateFallback() {
  return <p data-testid="fallback">Loading on the client…</p>
}

export default function ClientOnly({ loaderData }: Route.ComponentProps) {
  return (
    <FeaturePage title="Client data" label="1st-party">
      <p>
        Rendered at <span data-testid="rendered-at">{loaderData.renderedAt}</span> on the{' '}
        <span data-testid="where">{loaderData.where}</span>
      </p>
    </FeaturePage>
  )
}
