"use client"

import { useEffect, useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')

export default function HeroClock({ vibe }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  let h = now.getHours()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  const m = pad(now.getMinutes())
  const s = pad(now.getSeconds())
  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const isAwakening = vibe === 'awakening'

  return (
    <div style={{ textAlign: 'center', padding: '40px 0 56px' }}>
      <div
        className="tk2-mono"
        role="timer"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Current time ${pad(h)}:${m} ${ampm}`}
        style={{
          fontSize: 'clamp(72px, 14vw, 188px)',
          fontWeight: 500,
          letterSpacing: '-0.04em',
          lineHeight: 0.92,
          color: 'var(--tk2-fg-0)',
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: 'clamp(6px, 1vw, 14px)',
          fontFeatureSettings: '"tnum" 1',
        }}
      >
        <span>{pad(h)}</span>
        <span aria-hidden="true" style={{ color: 'var(--tk2-fg-3)', transform: 'translateY(-0.08em)' }}>:</span>
        <span>{m}</span>
        <span aria-hidden="true" style={{ color: 'var(--tk2-fg-3)', transform: 'translateY(-0.08em)' }}>:</span>
        <span aria-hidden="true">{s}</span>
        <span style={{ fontSize: '0.28em', color: 'var(--tk2-fg-2)', marginLeft: 14, fontWeight: 400 }}>
          {ampm}
        </span>
      </div>

      <div className="tk2-eyebrow" style={{ marginTop: 18, letterSpacing: '0.32em' }}>
        {date.toUpperCase()}
      </div>

      <div
        style={{
          marginTop: 14,
          color: 'var(--tk2-fg-1)',
          fontFamily: isAwakening ? 'var(--tk2-font-serif)' : 'var(--tk2-font-display)',
          fontStyle: isAwakening ? 'italic' : 'normal',
          fontSize: isAwakening ? 22 : 17,
        }}
      >
        This hour decides the next.
      </div>
    </div>
  )
}
