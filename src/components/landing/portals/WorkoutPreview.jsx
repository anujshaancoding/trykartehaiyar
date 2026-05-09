"use client"

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const HEIGHTS = [70, 90, 45, 100, 80, 30, 95]

export default function WorkoutPreview({ active, color }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 10,
        height: '100%',
        padding: '0 8px',
      }}
    >
      {DAYS.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            height: '100%',
          }}
        >
          <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end' }}>
            <div
              style={{
                width: '100%',
                height: active ? `${HEIGHTS[i]}%` : `${HEIGHTS[i] * 0.5}%`,
                background: i === 3 ? color : 'var(--tk2-bg-2)',
                border: `1px solid ${i === 3 ? color : 'var(--tk2-line-soft)'}`,
                borderRadius: 4,
                transition: `height ${0.3 + i * 0.05}s ease`,
              }}
            />
          </div>
          <div className="tk2-mono" style={{ fontSize: 10, color: 'var(--tk2-fg-3)' }}>
            {d}
          </div>
        </div>
      ))}
    </div>
  )
}
