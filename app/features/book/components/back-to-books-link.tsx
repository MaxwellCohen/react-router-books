import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useCatalogParams } from '@/hooks/use-catalog-params'
import { buildHref } from '@/lib/url-state'
import { cn } from '@/lib/utils'

const linkClass =
  'text-muted hover:bg-card dark:hover:bg-card-dark -ml-1.5 inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors hover:text-black dark:hover:text-white'

export function BackToBooksLink({ className }: { className?: string }) {
  const navigate = useNavigate()
  const { current } = useCatalogParams()

  return (
    <button
      className={cn(linkClass, className)}
      onClick={() => {
        const idx = (window.history.state as { idx?: number } | null)?.idx
        if (typeof idx === 'number' && idx > 0) {
          void navigate(-1)
        } else {
          void navigate(buildHref(current))
        }
      }}
      type="button"
    >
      <ArrowLeft aria-hidden className="size-4" />
      Back to books
    </button>
  )
}
