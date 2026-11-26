// Third-party: Fontsource (@fontsource-variable/geist-mono) self-hosts the font files and
// ships @font-face with font-display: swap. React Router has no font primitive, so the
// preload is added by hand via the route `links` export with a Vite `?url` import.
import monoLatin from '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url'
import type { Route } from './+types/font-optimization'
import { FeaturePage } from './shared'

export const links: Route.LinksFunction = () => [
  { rel: 'preload', href: monoLatin, as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
]

export default function FontOptimization() {
  return (
    <FeaturePage title="Font optimization" label="Third-party">
      <p data-testid="mono-text" style={{ fontFamily: "'Geist Mono Variable', monospace" }}>
        Self-hosted Geist Mono via Fontsource.
      </p>
    </FeaturePage>
  )
}
