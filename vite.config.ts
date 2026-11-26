import { reactRouter } from '@react-router/dev/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import netlifyReactRouter from '@netlify/vite-plugin-react-router'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, type PluginOption } from 'vite'

const env = process.env
const isCloudflare = !!(env.CLOUDFLARE || env.WORKERS_CI || env.CF_PAGES)
const isNetlify = !!env.NETLIFY && !isCloudflare

const hostPlugins: PluginOption[] = isCloudflare
  ? [cloudflare({ viteEnvironment: { name: 'ssr' } })]
  : isNetlify
    ? [netlifyReactRouter()]
    : []

// Feature test (bundle-analysis): ANALYZE=1 adds the third-party visualizer to the client build.
const clientOnly = (plugin: PluginOption): PluginOption => ({
  ...(plugin as object),
  applyToEnvironment: (environment: { name: string }) => environment.name === 'client',
}) as unknown as PluginOption
const analyzePlugins: PluginOption[] = env.ANALYZE
  ? [
      clientOnly(visualizer({ filename: `${env.FT_BUILD_DIR || 'build'}/stats.html`, template: 'treemap' })),
      clientOnly(visualizer({ filename: `${env.FT_BUILD_DIR || 'build'}/stats.json`, template: 'raw-data' })),
    ]
  : []

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), ...hostPlugins, reactRouter(), ...analyzePlugins],
})
