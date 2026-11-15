import { data } from 'react-router'
import { buttonClasses } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Link } from 'react-router'

export function loader() {
  throw data(null, { status: 404 })
}

export function meta() {
  return [{ title: 'Not found · React Router Books' }]
}

export default function NotFound() {
  return null
}

export function ErrorBoundary() {
  return (
    <EmptyState body="That page doesn't exist." title="Page not found">
      <Link className={buttonClasses({ className: 'mt-1', variant: 'secondary' })} to="/">
        Back to the shelf
      </Link>
    </EmptyState>
  )
}
