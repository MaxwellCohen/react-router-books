// 1st-party: <Link prefetch="intent"> adds <link rel=prefetch> for the target route's
// module + data on hover/focus.
import { Link } from 'react-router'
import { FeaturePage } from './shared'

export default function RoutePrefetching() {
  return (
    <FeaturePage title="Route prefetching" label="1st-party">
      <div style={{ height: '40px' }} />
      <Link data-testid="intent-link" prefetch="intent" to="/feature-tests/route-prefetching/target">
        Hover me (prefetch=&quot;intent&quot;)
      </Link>
    </FeaturePage>
  )
}
