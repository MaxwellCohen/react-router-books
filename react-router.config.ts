import type { Config } from '@react-router/dev/config'
import { vercelPreset } from '@vercel/react-router/vite'

const isVercel = !!process.env.VERCEL && !process.env.NETLIFY && !process.env.CLOUDFLARE

export default {
  appDirectory: 'app',
  ssr: true,
  presets: isVercel ? [vercelPreset()] : [],
} satisfies Config
