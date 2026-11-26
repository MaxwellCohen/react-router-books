import { defineConfig } from '@playwright/test'

export const PORT = Number(process.env.PORT || 4121)

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  workers: 1,
  timeout: 600_000,
  reporter: [['list'], ['json', { outputFile: 'report.json' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    launchOptions: { executablePath: '/home/maxc/.local/bin/google-chrome' },
  },
})
