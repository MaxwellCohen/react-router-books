import { createRequestHandler } from 'react-router'
import { bindCatalogCache } from '../app/lib/server/catalog-cache'

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

export default {
  async fetch(request: Request, env: { CATALOG_CACHE?: Parameters<typeof bindCatalogCache>[0] }) {
    bindCatalogCache(env.CATALOG_CACHE)
    return requestHandler(request)
  },
}
