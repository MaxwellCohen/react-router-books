import { reactRouter } from '@react-router/dev/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import netlifyReactRouter from '@netlify/vite-plugin-react-router'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type PluginOption } from 'vite'

const env = process.env
const isCloudflare = !!(env.CLOUDFLARE || env.WORKERS_CI || env.CF_PAGES)
const isNetlify = !!env.NETLIFY && !isCloudflare

const hostPlugins: PluginOption[] = isCloudflare
  ? [cloudflare({ viteEnvironment: { name: 'ssr' } })]
  : isNetlify
    ? [netlifyReactRouter()]
    : []

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), ...hostPlugins, reactRouter()],
})
