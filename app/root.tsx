import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import { MobileBookSidebar, MobileBookSidebarTrigger } from '@/components/mobile-book-sidebar'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Button } from '@/components/ui/button'
import { ErrorState } from '@/components/ui/error-state'
import { BookSearch } from '@/features/book/components/book-search'
import { BookSidebar } from '@/features/book/components/book-sidebar'
import type { Route } from './+types/root'
import appCss from './styles/global.css?url'

const description =
  'Browse two million Goodreads books with React Router, streaming search, and URL-driven filters.'

const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||((t==="system"||!t)&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`

export const meta: Route.MetaFunction = () => [
  { title: 'React Router Books' },
  { name: 'description', content: description },
  { name: 'theme-color', content: '#fafafa', media: '(prefers-color-scheme: light)' },
  { name: 'theme-color', content: '#121212', media: '(prefers-color-scheme: dark)' },
  { property: 'og:description', content: description },
  { property: 'og:site_name', content: 'React Router Books' },
  { property: 'og:title', content: 'React Router Books' },
  { property: 'og:type', content: 'website' },
]

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
  { rel: 'stylesheet', href: appCss },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="bg-surface text-black antialiased dark:bg-surface-dark dark:text-white"
        suppressHydrationWarning
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <MobileBookSidebar sidebar={<BookSidebar idPrefix="mobile" mobile />}>
        <div className="group flex min-h-dvh">
          <aside
            className="border-divider bg-surface dark:border-divider-dark dark:bg-surface-dark sticky top-0 hidden h-dvh w-72 shrink-0 flex-col border-r px-5 py-5 md:flex"
            style={{ viewTransitionName: 'sidebar' }}
          >
            <BookSidebar idPrefix="desktop" />
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header
              className="border-divider bg-surface/80 dark:border-divider-dark dark:bg-surface-dark/80 sticky top-0 z-20 flex items-center gap-2 border-b px-4 py-3 backdrop-blur-md backdrop-saturate-150 sm:gap-3 sm:px-6"
              style={{ viewTransitionName: 'site-header' }}
            >
              <MobileBookSidebarTrigger />
              <BookSearch />
            </header>

            <main className="flex min-w-0 flex-1 flex-col">
              <Outlet />
            </main>
          </div>
        </div>
      </MobileBookSidebar>
    </ThemeProvider>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404
  return (
    <ErrorState
      body={notFound ? "That page doesn't exist." : error instanceof Error ? error.message : undefined}
      title={notFound ? 'Page not found' : 'Something went wrong'}
    >
      <Button className="mt-1" onClick={() => window.location.assign('/')} size="sm" variant="secondary">
        Back to the shelf
      </Button>
    </ErrorState>
  )
}
