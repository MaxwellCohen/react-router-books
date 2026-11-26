import { execFile } from 'node:child_process'
import { test } from '@playwright/test'

export const ROOT = new URL('..', import.meta.url).pathname

/** Record a one-line evidence string; run.mjs copies it into results.json. */
export function evidence(text: string) {
  test.info().annotations.push({ type: 'evidence', description: text })
}

/** Wait until React Router has hydrated the page. */
export async function waitForHydration(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => Boolean((window as any).__reactRouterRouteModules) && document.readyState === 'complete')
}

/** Run a command in the repo, retrying (React Router's prerender has a fixed 10s request timeout,
 * which a heavily loaded machine can exceed on server cold start). */
export async function run(cmd: string, args: string[], env: Record<string, string> = {}, cwd = ROOT, attempts = 3) {
  let last = ''
  for (let i = 0; i < attempts; i++) {
    const result = await new Promise<{ code: number; out: string }>((resolve) => {
      execFile(cmd, args, { cwd, env: { ...process.env, ...env }, maxBuffer: 64 * 1024 * 1024 }, (err, stdout, stderr) =>
        resolve({ code: err ? ((err as any).code ?? 1) : 0, out: `${stdout}\n${stderr}` }),
      )
    })
    if (result.code === 0) return result.out
    last = result.out
  }
  throw new Error(`${cmd} ${args.join(' ')} failed:\n${last.slice(-3000)}`)
}
