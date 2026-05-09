"use client"

import { useState } from 'react'

const SEED = [
  {
    id: 1,
    name: 'Meera Krishnan',
    text: 'Spent quality time with family. Blessed.',
    time: '11:32',
    accent: 'var(--tk2-accent-purple)',
  },
  {
    id: 2,
    name: 'Sanjay Nitin',
    text: 'Learned a new recipe. Cooking is therapeutic.',
    time: '10:18',
    accent: 'var(--tk2-accent-rose)',
  },
  {
    id: 3,
    name: 'Pooja Desai',
    text: 'Helped a stranger today. Kindness costs nothing.',
    time: '09:45',
    accent: 'var(--tk2-accent-amber)',
  },
  {
    id: 4,
    name: 'Manish Tiwari',
    text: 'Took a break from social media today. Feeling lighter.',
    time: '08:12',
    accent: 'var(--tk2-accent-green)',
  },
  {
    id: 5,
    name: 'Sneha Agarwal',
    text: 'Meditated for 15 minutes. Inner peace is priceless.',
    time: '07:30',
    accent: 'var(--tk2-accent-orange)',
  },
  {
    id: 6,
    name: 'Rahul Joshi',
    text: 'Finished my morning run. Endorphins hit different.',
    time: '06:55',
    accent: 'var(--tk2-accent-purple)',
  },
]

export default function Community() {
  const [thoughts, setThoughts] = useState(SEED)
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')

  const post = () => {
    if (!name.trim() || !msg.trim()) return
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    setThoughts([
      {
        id: Date.now(),
        name: name.trim(),
        text: msg.trim(),
        time,
        accent: 'var(--tk2-accent-orange)',
      },
      ...thoughts,
    ])
    setMsg('')
  }

  return (
    <div className="tk2-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="tk2-eyebrow" style={{ marginBottom: 4 }}>
        Community thoughts{' '}
        <span style={{ color: 'var(--tk2-fg-3)', textTransform: 'none', letterSpacing: 0 }}>
          — share something positive about your day
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 16 }}>
        {thoughts.map((t) => (
          <div
            key={t.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '3px 1fr auto',
              gap: 14,
              padding: '12px 4px 12px 12px',
              borderBottom: '1px solid var(--tk2-line-soft)',
              alignItems: 'start',
            }}
          >
            <div
              style={{ width: 3, alignSelf: 'stretch', background: t.accent, borderRadius: 2 }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
              <div style={{ fontSize: 13, color: 'var(--tk2-fg-1)', marginTop: 4 }}>{t.text}</div>
            </div>
            <div className="tk2-mono tk2-tnum" style={{ fontSize: 11, color: 'var(--tk2-fg-3)' }}>
              {t.time}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(120px, 160px) 1fr auto',
          gap: 8,
          marginTop: 16,
          alignItems: 'center',
        }}
      >
        <input
          className="tk2-input"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="tk2-input"
          placeholder="Share a positive thought..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && post()}
        />
        <button
          type="button"
          className="tk2-btn tk2-btn-primary"
          onClick={post}
          style={{ padding: '10px 18px' }}
        >
          Post
        </button>
      </div>
    </div>
  )
}
