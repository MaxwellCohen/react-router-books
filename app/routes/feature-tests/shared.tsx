import type { ReactNode } from 'react'
import { Link } from 'react-router'

export const FEATURES = [
  ['css-inlining', 'Manual', 'Vite ?inline import rendered into a <style> tag'],
  ['font-optimization', 'Third-party', 'Fontsource self-hosted font + preload link'],
  ['image-pipeline', 'Third-party', '@unpic/react <Image> over an image CDN'],
  ['caching', '1st-party', 'Route headers export (Cache-Control)'],
  ['route-prefetching', '1st-party', '<Link prefetch="intent">'],
  ['islands', 'Experimental', 'RSC framework mode (unstable_reactRouterRSC) sub-app'],
  ['render-modes', '1st-party', 'prerender config + SSR + clientLoader'],
  ['reactivity', 'Third-party', '@preact/signals-react'],
  ['bundle-analysis', 'Third-party', 'rollup-plugin-visualizer (ANALYZE=1)'],
  ['third-party-scripts', 'Manual', 'Inject <script async> in useEffect after hydration'],
  ['multi-host-deployment', 'Third-party', 'Node serve + Cloudflare/Netlify/Vercel host plugins'],
] as const

export function FeaturePage({ title, label, children }: { title: string; label: string; children?: ReactNode }) {
  return (
    <div className="px-4 py-5 sm:px-6">
      <p className="mb-2 text-sm">
        <Link to="/feature-tests">← Feature tests</Link>
      </p>
      <h1>{title}</h1>
      <p className="text-muted mb-4 text-sm">Claimed label: {label}</p>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  )
}
