"use client"

import { useEffect, useState } from 'react'

const QUOTES = [
  { text: "You don't need motivation. You need standards.", author: 'Anon' },
  { text: 'Discipline equals freedom.', author: 'Jocko Willink' },
  {
    text: 'What you do every day matters more than what you do once in a while.',
    author: 'Gretchen Rubin',
  },
  {
    text: "We don't rise to the level of our goals. We fall to the level of our systems.",
    author: 'James Clear',
  },
]

export default function Quote() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const reduce =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const id = setInterval(() => setI((x) => (x + 1) % QUOTES.length), 8000)
    return () => clearInterval(id)
  }, [])

  const q = QUOTES[i]

  return (
    <div
      className="tk2-card"
      style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '52px 32px' }}
    >
      <div
        style={{
          color: 'var(--tk2-fg-3)',
          fontSize: 32,
          fontFamily: 'var(--tk2-font-serif)',
          lineHeight: 0.5,
        }}
      >
        “ ”
      </div>
      <div
        style={{
          fontFamily: 'var(--tk2-font-serif)',
          fontSize: 'clamp(22px, 3.4vw, 38px)',
          fontWeight: 400,
          fontStyle: 'italic',
          letterSpacing: '-0.01em',
          maxWidth: 820,
          margin: '14px auto 0',
          lineHeight: 1.25,
        }}
      >
        {q.text}
      </div>
      <div
        className="tk2-mono"
        style={{
          marginTop: 18,
          fontSize: 12,
          color: 'var(--tk2-fg-2)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
        }}
      >
        — {q.author}
      </div>
      <div
        role="tablist"
        aria-label="Quote selector"
        style={{
          marginTop: 22,
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        {QUOTES.map((_, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={idx === i}
            aria-label={`Quote ${idx + 1}`}
            type="button"
            onClick={() => setI(idx)}
            style={{
              width: idx === i ? 22 : 6,
              height: 4,
              borderRadius: 4,
              background: idx === i ? 'var(--tk2-fg-1)' : 'var(--tk2-line)',
              border: 0,
              padding: 0,
              cursor: 'pointer',
              transition: 'width 0.3s, background 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  )
}
