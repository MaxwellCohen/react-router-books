import { FeaturePage } from './shared'

export default function Islands() {
  return (
    <FeaturePage title="Islands" label="Experimental">
      <p>
        React Router has no islands primitive. The closest equivalent is experimental RSC framework mode
        (<code>unstable_reactRouterRSC</code> + <code>@vitejs/plugin-rsc</code>), which is a whole-app build mode and
        cannot be enabled for a single route. It lives in a separate sub-app at
        <code> feature-tests/rsc-islands/</code>: a server component (code never shipped) plus one
        <code> &quot;use client&quot;</code> island.
      </p>
    </FeaturePage>
  )
}
