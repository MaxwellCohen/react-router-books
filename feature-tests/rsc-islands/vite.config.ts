// Experimental: React Router RSC framework mode. It is a whole-app build mode, so it lives
// in this sub-app instead of the main books app.
import { unstable_reactRouterRSC as reactRouterRSC } from '@react-router/dev/vite'
import rsc from '@vitejs/plugin-rsc'
import { defineConfig } from 'vite'

export default defineConfig({
  root: import.meta.dirname,
  plugins: [reactRouterRSC(), rsc()],
})
