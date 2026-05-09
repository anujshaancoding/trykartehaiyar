"use client"

import { useEffect, useState } from 'react'

const DAY_MS = 86_400_000

export default function FocusGoals() {
  const [monthly, setMonthly] = useState('')
  const [yearly, setYearly] = useState('')
  const [tags, setTags] = useState({ month: '30 days', year: '249 days left' })

  useEffect(() => {
    const now = new Date()
    const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const endYear = new Date(now.getFullYear() + 1, 0, 1)
    const daysLeftMonth = Math.ceil((endMonth - now) / DAY_MS)
    const daysLeftYear = Math.ceil((endYear - now) / DAY_MS)
    setTags({
      month: `${daysLeftMonth} days left`,
      year: `${daysLeftYear} days left`,
    })
  }, [])

  return (
    <div className="tk2-card" style={{ gridColumn: '1 / -1' }}>
      <div className="tk2-eyebrow" style={{ marginBottom: 18 }}>
        Focus mode
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 18,
        }}
      >
        <GoalSlot title="Monthly Goal" tag={tags.month} value={monthly} setValue={setMonthly} />
        <GoalSlot title="Yearly Goal" tag={tags.year} value={yearly} setValue={setYearly} />
      </div>
    </div>
  )
}

function GoalSlot({ title, tag, value, setValue }) {
  return (
    <div
      style={{
        background: 'var(--tk2-bg-2)',
        border: '1px solid var(--tk2-line-soft)',
        borderRadius: 'var(--tk2-radius-sm)',
        padding: '18px 20px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          gap: 8,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 15 }}>{title}</div>
        <div
          className="tk2-mono"
          style={{
            fontSize: 11,
            color: 'var(--tk2-fg-2)',
            padding: '4px 8px',
            border: '1px solid var(--tk2-line-soft)',
            borderRadius: 'var(--tk2-radius-sm)',
            whiteSpace: 'nowrap',
          }}
        >
          {tag}
        </div>
      </div>
      <input
        className="tk2-input"
        placeholder="+ Add Goal"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {!value && (
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: 'var(--tk2-fg-3)',
            textAlign: 'center',
          }}
        >
          No goals set yet
        </div>
      )}
    </div>
  )
}
