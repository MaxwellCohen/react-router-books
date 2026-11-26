import { FeaturePage } from './shared'

export default function BundleAnalysis() {
  return (
    <FeaturePage title="Bundle analysis" label="Third-party">
      <p>
        Build-time only: <code>ANALYZE=1 react-router build</code> adds <code>rollup-plugin-visualizer</code> to
        the Vite config and writes <code>&lt;buildDirectory&gt;/stats.html</code> and <code>stats.json</code>.
      </p>
    </FeaturePage>
  )
}
