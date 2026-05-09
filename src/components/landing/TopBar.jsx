"use client"

export default function TopBar({ vibe, onVibeChange }) {
  const vibes = [
    { id: 'refined', label: 'Refined' },
    { id: 'awakening', label: 'Awakening' },
    { id: 'brutalist', label: 'Brutalist' },
  ]
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 0 28px',
        gap: 16,
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="tk2-live-dot" />
        <span
          className="tk2-mono"
          style={{
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--tk2-fg-2)',
          }}
        >
          live · 142 awake
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
        <span
          className="tk2-mono"
          style={{
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--tk2-fg-2)',
          }}
        >
          tkhy <span style={{ color: 'var(--tk2-fg-3)' }}>· try karte hai yaar</span>
        </span>

        <div className="tk2-vibe-switch" role="group" aria-label="Theme vibe">
          {vibes.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={vibe === v.id}
              onClick={() => onVibeChange(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>

        <button className="tk2-btn" type="button">Feedback</button>
      </div>
    </div>
  )
}
