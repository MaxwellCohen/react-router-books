import { data, isRouteErrorResponse } from 'react-router'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/ui/error-state'
import { getBookById } from '@/features/book/book-queries.server'
import { BackToBooksLink } from '@/features/book/components/back-to-books-link'
import { BookDetail } from '@/features/book/components/book-detail'
import { BookNotFound } from '@/features/book/components/book-not-found'
import { waitForApiDelay } from '@/lib/api-delay'
import { getApiDelayMs, parseSearchParams } from '@/lib/url-state'
import type { Route } from './+types/book'

// The book is awaited (not streamed) so unknown ids can return a real HTTP 404.
export async function loader({ params, request }: Route.LoaderArgs) {
  const search = parseSearchParams(Object.fromEntries(new URL(request.url).searchParams))
  await waitForApiDelay(getApiDelayMs(search))
  const book = await getBookById(params.id)
  if (!book) throw data(null, { status: 404 })
  return { book }
}

export function meta({ loaderData }: Route.MetaArgs) {
  return [{ title: loaderData?.book ? `${loaderData.book.title} · React Router Books` : 'Book · React Router Books' }]
}

export default function BookPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-1 flex-col px-4 py-5 sm:px-6">
      <BackToBooksLink className="mb-6" />
      <BookDetail book={loaderData.book} />
    </div>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="flex flex-1 flex-col px-4 py-5 sm:px-6">
      <BackToBooksLink className="mb-6" />
      {isRouteErrorResponse(error) && error.status === 404 ? (
        <BookNotFound />
      ) : (
        <ErrorState
          body={error instanceof Error ? error.message : undefined}
          title="Can't load this book"
        >
          <Button className="mt-1" onClick={() => window.location.reload()} size="sm" variant="secondary">
            Try again
          </Button>
        </ErrorState>
      )}
    </div>
  )
}
