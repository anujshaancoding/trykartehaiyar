"use client"

import { useMemo } from 'react'

// Deterministic pseudo-random so SSR + hydration match.
function seeded(n) {
  const x = Math.sin(n * 9301 + 49297) * 233280
  return x - Math.floor(x)
}

export default function DeveloperPreview({ active, color }) {
  const cells = useMemo(
    () => Array.from({ length: 7 * 12 }, (_, i) => seeded(i + 1)),
    [],
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <div className="tk2-mono" style={{ fontSize: 11, color: 'var(--tk2-fg-2)' }}>
        $ git log --pretty=oneline
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(7, 1fr)',
          gap: 3,
          height: 100,
        }}
      >
        {cells.map((v, i) => (
          <div
            key={i}
            style={{
              background:
                v > 0.7
                  ? color
                  : v > 0.4
                    ? 'var(--tk2-line)'
                    : v > 0.15
                      ? 'var(--tk2-line-soft)'
                      : 'var(--tk2-bg-2)',
              borderRadius: 2,
              opacity: active ? 1 : 0.7,
              transition: `opacity ${0.2 + (i % 7) * 0.04}s`,
            }}
          />
        ))}
      </div>
      <div
        className="tk2-mono"
        style={{
          fontSize: 10,
          color: 'var(--tk2-fg-3)',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>12 weeks ago</span>
        <span>today</span>
      </div>
    </div>
  )
}
