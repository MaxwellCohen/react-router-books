// Third-party: @preact/signals-react. Passing the signal itself as a JSX child binds it as
// text, so updates patch that text without re-running this component.
import { useSignal } from '@preact/signals-react'
import { useRef } from 'react'
import { FeaturePage } from './shared'

declare global {
  interface Window {
    __ftReactivityRenders?: number
  }
}

export default function Reactivity() {
  const count = useSignal(0)
  const renders = useRef(0)
  renders.current += 1
  if (typeof window !== 'undefined') window.__ftReactivityRenders = renders.current

  return (
    <FeaturePage title="Reactivity" label="Third-party">
      <p>
        Count: <span data-testid="count">{count}</span>
      </p>
      <p>
        Component renders: <span data-testid="renders">{renders.current}</span>
      </p>
      <button className="rounded border px-3 py-1" data-testid="increment" onClick={() => count.value++} type="button">
        Increment
      </button>
    </FeaturePage>
  )
}
