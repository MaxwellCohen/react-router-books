'use client'
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  return (
    <button data-island="CLIENT_ISLAND_MARKER" data-testid="island" onClick={() => setCount(c => c + 1)} type="button">
      Island clicks: {count}
    </button>
  )
}
