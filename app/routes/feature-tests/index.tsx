import { Link } from 'react-router'
import { FEATURES } from './shared'

export function meta() {
  return [{ title: 'Feature tests · React Router Books' }]
}

export default function FeatureTestsIndex() {
  return (
    <div className="px-4 py-5 sm:px-6">
      <h1>Feature tests</h1>
      <ul className="mt-4 flex flex-col gap-2">
        {FEATURES.map(([id, label, method]) => (
          <li key={id}>
            <Link to={`/feature-tests/${id}`}>{id}</Link> — {label}: {method}
          </li>
        ))}
      </ul>
    </div>
  )
}
