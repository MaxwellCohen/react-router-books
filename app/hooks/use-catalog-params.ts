import { useNavigate, useNavigation, useSearchParams } from 'react-router'
import { buildHref, type SearchParams } from '@/lib/url-state'
import { cleanSearch, searchParamsFromUrl } from '@/lib/search-schema'

export function useCatalogParams() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const navigation = useNavigation()
  const current = searchParamsFromUrl(searchParams)
  const pending = navigation.state !== 'idle' && navigation.location?.pathname === '/'

  function replace(next: SearchParams): Promise<void> {
    return Promise.resolve(
      navigate(buildHref(cleanSearch(next)), { replace: true, preventScrollReset: true }),
    )
  }

  return { current, pending, replace }
}
