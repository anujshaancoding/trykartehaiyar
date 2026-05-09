"use client"

const SUBJECTS = [
  { name: 'Physics', pct: 78 },
  { name: 'Chemistry', pct: 62 },
  { name: 'Biology', pct: 91 },
]

export default function StudentsPreview({ active, color }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <div className="tk2-mono" style={{ fontSize: 11, color: 'var(--tk2-fg-2)', marginBottom: 4 }}>
        ⏱ Pomodoro · 14:23 left
      </div>
      {SUBJECTS.map((s) => (
        <div key={s.name}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12,
              marginBottom: 4,
            }}
          >
            <span style={{ color: 'var(--tk2-fg-1)' }}>{s.name}</span>
            <span className="tk2-mono" style={{ color: 'var(--tk2-fg-2)' }}>{s.pct}%</span>
          </div>
          <div className="tk2-bar">
            <i
              style={{
                width: active ? `${s.pct}%` : `${s.pct * 0.6}%`,
                background: color,
                transition: 'width 0.5s',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
