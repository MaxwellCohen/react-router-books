import { index, prefix, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  ...prefix('feature-tests', [
    index('routes/feature-tests/index.tsx'),
    route('css-inlining', 'routes/feature-tests/css-inlining.tsx'),
    route('font-optimization', 'routes/feature-tests/font-optimization.tsx'),
    route('image-pipeline', 'routes/feature-tests/image-pipeline.tsx'),
    route('caching', 'routes/feature-tests/caching.tsx'),
    route('route-prefetching', 'routes/feature-tests/route-prefetching.tsx'),
    route('route-prefetching/target', 'routes/feature-tests/route-prefetching-target.tsx'),
    route('islands', 'routes/feature-tests/islands.tsx'),
    route('render-modes', 'routes/feature-tests/render-modes.tsx'),
    route('render-modes/static', 'routes/feature-tests/render-modes-static.tsx'),
    route('render-modes/dynamic', 'routes/feature-tests/render-modes-dynamic.tsx'),
    route('render-modes/client', 'routes/feature-tests/render-modes-client.tsx'),
    route('reactivity', 'routes/feature-tests/reactivity.tsx'),
    route('bundle-analysis', 'routes/feature-tests/bundle-analysis.tsx'),
    route('third-party-scripts', 'routes/feature-tests/third-party-scripts.tsx'),
    route('multi-host-deployment', 'routes/feature-tests/multi-host-deployment.tsx'),
  ]),
  route(':id', 'routes/book.tsx'),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig
