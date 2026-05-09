"use client"

import { useEffect, useState } from 'react'

const SEED = [
  { id: 1, label: 'Workout / Movement', icon: '🔥' },
  { id: 2, label: 'Deep Work Session', icon: '🎯' },
  { id: 3, label: 'Skill Learning', icon: '🧩' },
  { id: 4, label: 'Read 30+ minutes', icon: '📖' },
  { id: 5, label: 'Sleep on time', icon: '🌙' },
]

export default function NonNegotiables() {
  const [items, setItems] = useState(() => SEED.map((it) => ({ ...it, done: false })))
  const [hrsLeft, setHrsLeft] = useState(12)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const eod = new Date(now)
      eod.setHours(24, 0, 0, 0)
      setHrsLeft(Math.max(0, Math.floor((eod - now) / 3_600_000)))
    }
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])

  const completed = items.filter((i) => i.done).length
  const pct = Math.round((completed / items.length) * 100)

  const toggle = (id) =>
    setItems((arr) => arr.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))

  return (
    <div className="tk2-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div className="tk2-eyebrow">Today&apos;s non-negotiables</div>
        <button type="button" className="tk2-btn" style={{ padding: '4px 10px', fontSize: 12 }}>
          + Add
        </button>
      </div>
      <div style={{ fontSize: 13, color: 'var(--tk2-fg-2)' }}>5 things that move the needle.</div>

      <div
        className="tk2-mono"
        style={{
          background: 'var(--tk2-bg-2)',
          border: '1px solid var(--tk2-line-soft)',
          borderRadius: 'var(--tk2-radius-sm)',
          padding: '10px 14px',
          fontSize: 13,
          color: 'var(--tk2-accent-orange)',
        }}
      >
        ⏱ {hrsLeft} hours left today. Every task counts.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((it) => (
          <label
            key={it.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 14px',
              background: it.done ? 'var(--tk2-bg-2)' : 'transparent',
              borderRadius: 'var(--tk2-radius-sm)',
              cursor: 'pointer',
              border: '1px solid ' + (it.done ? 'var(--tk2-line-soft)' : 'transparent'),
              transition: 'background 0.15s ease, border-color 0.15s ease',
            }}
          >
            <input
              type="checkbox"
              className="tk2-check"
              checked={it.done}
              onChange={() => toggle(it.id)}
            />
            <span style={{ fontSize: 15 }}>{it.icon}</span>
            <span
              style={{
                fontSize: 14,
                flex: 1,
                textDecoration: it.done ? 'line-through' : 'none',
                color: it.done ? 'var(--tk2-fg-2)' : 'var(--tk2-fg-0)',
              }}
            >
              {it.label}
            </span>
          </label>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 16px',
          background: 'var(--tk2-bg-2)',
          borderRadius: 'var(--tk2-radius-sm)',
          marginTop: 4,
          gap: 12,
        }}
      >
        <div style={{ fontSize: 13, color: 'var(--tk2-fg-1)' }}>
          <span
            className="tk2-mono tk2-tnum"
            style={{ fontWeight: 600, color: 'var(--tk2-fg-0)' }}
          >
            {completed}/{items.length}
          </span>{' '}
          completed · {pct}%
        </div>
        <button type="button" className="tk2-btn tk2-btn-primary">
          Start now →
        </button>
      </div>
    </div>
  )
}
