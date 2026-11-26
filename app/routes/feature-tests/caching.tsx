// 1st-party: the route `headers` export sets Cache-Control on document and .data responses.
import type { Route } from './+types/caching'
import { FeaturePage } from './shared'

export const CACHE_TTL_SECONDS = 3
let counter = 0

export function loader() {
  counter += 1
  return { counter, generatedAt: new Date().toISOString() }
}

export const headers: Route.HeadersFunction = () => ({
  'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}, s-maxage=${CACHE_TTL_SECONDS}`,
})

export default function Caching({ loaderData }: Route.ComponentProps) {
  return (
    <FeaturePage title="Caching" label="1st-party">
      <p>
        Loader call #<span data-testid="counter">{loaderData.counter}</span> at{' '}
        <span data-testid="generated-at">{loaderData.generatedAt}</span>
      </p>
    </FeaturePage>
  )
}
