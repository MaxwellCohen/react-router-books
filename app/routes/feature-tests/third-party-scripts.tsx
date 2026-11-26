// Manual: <Scripts /> only renders the app runtime, so the third-party tag is injected
// by hand after hydration.
import { useEffect } from 'react'
import { FeaturePage } from './shared'

export default function ThirdPartyScripts() {
  useEffect(() => {
    ;(window as Window & { __ftHydratedAt?: number }).__ftHydratedAt = performance.now()
    const script = document.createElement('script')
    script.src = '/ft/fake-third-party.js'
    script.async = true
    script.dataset.ft = 'third-party'
    document.body.append(script)
    return () => script.remove()
  }, [])

  return (
    <FeaturePage title="Third-party scripts" label="Manual">
      <p data-testid="ready">Stand-in vendor script is injected after hydration.</p>
    </FeaturePage>
  )
}
