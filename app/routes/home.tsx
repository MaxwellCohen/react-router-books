import { Suspense, use } from 'react'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/ui/error-state'
import { toBookFilters, toBookQuery } from '@/features/book/book-utils'
import { getBooksCount, getBooksPage } from '@/features/book/book-queries.server'
import { BookGrid, BookGridSkeleton } from '@/features/book/components/book-grid'
import {
  BookPagination,
  BookPaginationSkeleton,
} from '@/features/book/components/book-pagination'
import { waitForApiDelay } from '@/lib/api-delay'
import { searchParamsFromUrl } from '@/lib/search-schema'
import { getApiDelayMs, type SearchParams } from '@/lib/url-state'
import type { Route } from './+types/home'

async function withDelay<T>(searchParams: SearchParams, work: () => Promise<T>): Promise<T> {
  await waitForApiDelay(getApiDelayMs(searchParams))
  return work()
}

export function loader({ request }: Route.LoaderArgs) {
  const searchParams = searchParamsFromUrl(new URL(request.url))
  return {
    books: withDelay(searchParams, () => getBooksPage(toBookQuery(searchParams))),
    searchParams,
    totalResults: withDelay(searchParams, () =>
      getBooksCount(toBookFilters(toBookQuery(searchParams))),
    ),
  }
}

export function meta() {
  return [{ title: 'Books · React Router Books' }]
}

function HomeBooks({ loaderData }: { loaderData: Route.ComponentProps['loaderData'] }) {
  return <BookGrid books={use(loaderData.books)} searchParams={loaderData.searchParams} />
}

function HomePagination({ loaderData }: { loaderData: Route.ComponentProps['loaderData'] }) {
  return (
    <BookPagination
      searchParams={loaderData.searchParams}
      totalResults={use(loaderData.totalResults)}
    />
  )
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 px-4 py-5 transition-opacity duration-200 ease-out group-has-[[data-filtering]]:opacity-60 sm:px-6">
        <Suspense fallback={<BookGridSkeleton />}>
          <HomeBooks loaderData={loaderData} />
        </Suspense>
      </div>
      <footer className="border-divider dark:border-divider-dark mt-auto border-t px-4 py-3 sm:px-6">
        <Suspense fallback={<BookPaginationSkeleton />}>
          <HomePagination loaderData={loaderData} />
        </Suspense>
      </footer>
    </div>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <ErrorState body={error instanceof Error ? error.message : undefined} title="Can't load books">
      <Button className="mt-1" onClick={() => window.location.reload()} size="sm" variant="secondary">
        Try again
      </Button>
    </ErrorState>
  )
}
