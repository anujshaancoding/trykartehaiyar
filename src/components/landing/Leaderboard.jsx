"use client"

const ROWS = [
  { rank: 1, name: 'Aarav Sharma', pts: 342, medal: '🥇' },
  { rank: 2, name: 'Priya Patel', pts: 298, medal: '🥈' },
  { rank: 3, name: 'Rohan Verma', pts: 274, medal: '🥉' },
  { rank: 4, name: 'Ananya Gupta', pts: 218 },
  { rank: 5, name: 'Vikram Singh', pts: 187 },
  { rank: 6, name: 'Neha Reddy', pts: 166 },
  { rank: 7, name: 'Arjun Nair', pts: 145 },
  { rank: 8, name: 'Kavya Iyer', pts: 122 },
  { rank: 9, name: 'Aditya Kumar', pts: 108 },
  { rank: 10, name: 'Ishita Mehta', pts: 94 },
]

const TOP3_BG = [
  'oklch(0.78 0.15 75 / 0.18)',
  'oklch(0.85 0.04 250 / 0.15)',
  'oklch(0.65 0.15 35 / 0.15)',
]
const TOP3_BORDER = ['var(--tk2-accent-amber)', 'oklch(0.85 0.04 250)', 'var(--tk2-accent-orange)']

function initials(name) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
}

export default function Leaderboard() {
  return (
    <div className="tk2-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div className="tk2-eyebrow">Leaderboard</div>
        <div className="tk2-mono" style={{ fontSize: 11, color: 'var(--tk2-fg-3)' }}>
          this week
        </div>
      </div>
      <div style={{ fontSize: 13, color: 'var(--tk2-fg-2)', marginTop: 8 }}>Top contributors</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 18 }}>
        {ROWS.map((r) => {
          const top3 = r.rank <= 3
          return (
            <div
              key={r.rank}
              style={{
                display: 'grid',
                gridTemplateColumns: '32px 22px 1fr auto',
                gap: 12,
                alignItems: 'center',
                padding: '10px 12px',
                background: top3 ? TOP3_BG[r.rank - 1] : 'transparent',
                borderLeft: top3
                  ? `2px solid ${TOP3_BORDER[r.rank - 1]}`
                  : '2px solid transparent',
                borderRadius: 'var(--tk2-radius-sm)',
              }}
            >
              <div
                className="tk2-mono"
                style={{
                  fontSize: 12,
                  color: top3 ? 'var(--tk2-fg-0)' : 'var(--tk2-fg-2)',
                  fontWeight: 600,
                }}
              >
                {top3 ? r.medal : `#${r.rank}`}
              </div>
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: 'var(--tk2-bg-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 600,
                  border: '1px solid var(--tk2-line-soft)',
                }}
              >
                {initials(r.name)}
              </div>
              <div style={{ fontSize: 13, fontWeight: top3 ? 600 : 400 }}>{r.name}</div>
              <div className="tk2-mono tk2-tnum" style={{ fontSize: 12, color: 'var(--tk2-fg-1)' }}>
                {r.pts} pts
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
