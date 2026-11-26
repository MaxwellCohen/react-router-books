import type { Config } from '@react-router/dev/config'
import { vercelPreset } from '@vercel/react-router/vite'

const isVercel = !!process.env.VERCEL && !process.env.NETLIFY && !process.env.CLOUDFLARE

export default {
  appDirectory: 'app',
  // FT_BUILD_DIR lets feature tests build alternate targets without clobbering the served build.
  buildDirectory: process.env.FT_BUILD_DIR || 'build',
  ssr: true,
  // Feature test (render-modes): only this path is prerendered; everything else is SSR.
  prerender: ['/feature-tests/render-modes/static'],
  presets: isVercel ? [vercelPreset()] : [],
} satisfies Config
