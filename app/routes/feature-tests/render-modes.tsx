import { Link } from 'react-router'
import { FeaturePage } from './shared'

export default function RenderModes() {
  return (
    <FeaturePage title="Render modes" label="1st-party">
      <ul>
        <li><Link to="/feature-tests/render-modes/static">Prerendered (prerender config)</Link></li>
        <li><Link to="/feature-tests/render-modes/dynamic">Server-rendered per request (ssr: true)</Link></li>
        <li><Link to="/feature-tests/render-modes/client">Client data only (clientLoader)</Link></li>
      </ul>
    </FeaturePage>
  )
}
