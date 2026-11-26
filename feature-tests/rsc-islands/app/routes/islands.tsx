// Server component route: everything here renders on the server only. Only the
// "use client" <Counter /> island is shipped to and hydrated in the browser.
import { Counter } from '../counter'

function StaticSummary() {
  const words = ['RSC_STATIC_MARKER', 'server', 'only']
  return (
    <section data-testid="static">
      <h2>Static server component</h2>
      <p>{words.join(' ')} — rendered at {new Date().toISOString()}</p>
    </section>
  )
}

export function ServerComponent() {
  return (
    <main>
      <title>RSC islands</title>
      <h1>Islands via experimental RSC</h1>
      <StaticSummary />
      <Counter />
    </main>
  )
}
