import type { Route } from './+types/route-prefetching-target'
import { FeaturePage } from './shared'

export function loader() {
  return { message: 'PREFETCH_TARGET_DATA' }
}

export default function PrefetchTarget({ loaderData }: Route.ComponentProps) {
  return (
    <FeaturePage title="Prefetch target" label="1st-party">
      <p data-testid="target">{loaderData.message} (FT_PREFETCH_TARGET_MODULE)</p>
    </FeaturePage>
  )
}
