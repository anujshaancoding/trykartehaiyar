"use client"

import { useEffect, useState } from 'react'

const DAY_MS = 86_400_000

function computeStats(now) {
  const year = now.getFullYear()
  const endMonth = new Date(year, now.getMonth() + 1, 1)
  const endYear = new Date(year + 1, 0, 1)
  const startYear = new Date(year, 0, 1)

  const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate()
  const daysLeftMonth = Math.ceil((endMonth - now) / DAY_MS)
  const daysLeftYear = Math.ceil((endYear - now) / DAY_MS)
  const daysPassedMonth = daysInMonth - daysLeftMonth
  const monthPct = Math.round((daysPassedMonth / daysInMonth) * 100)

  const yearProgress = (now - startYear) / (endYear - startYear)
  const yearPct = Math.round(yearProgress * 100)

  return { year, daysLeftMonth, daysLeftYear, daysPassedMonth, monthPct, yearPct }
}

export default function TimeYouDontGetBack() {
  // Hydration-safe: render the same value on server + first client paint, then
  // refresh after mount so the numbers reflect the user's local clock.
  const [stats, setStats] = useState(() => computeStats(new Date(2026, 0, 1)))

  useEffect(() => {
    setStats(computeStats(new Date()))
    const id = setInterval(() => setStats(computeStats(new Date())), 60_000)
    return () => clearInterval(id)
  }, [])

  const { year, daysLeftMonth, daysLeftYear, daysPassedMonth, monthPct, yearPct } = stats

  return (
    <div className="tk2-card" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div className="tk2-eyebrow">Time you don&apos;t get back</div>

      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <span
            className="tk2-tnum"
            style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            {daysLeftMonth}
          </span>
          <span style={{ color: 'var(--tk2-fg-2)', fontSize: 14 }}>days left this month</span>
        </div>
        <div className="tk2-bar">
          <i style={{ width: `${monthPct}%` }} />
        </div>
        <div
          className="tk2-mono"
          style={{ marginTop: 8, fontSize: 12, color: 'var(--tk2-accent-orange)' }}
        >
          {daysLeftMonth <= 7
            ? `Only ${daysLeftMonth} days to change this month.`
            : `${daysPassedMonth} days already gone.`}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
          <span
            className="tk2-tnum"
            style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            {daysLeftYear}
          </span>
          <span style={{ color: 'var(--tk2-fg-2)', fontSize: 14 }}>days left this year</span>
        </div>
        <div className="tk2-bar">
          <i style={{ width: `${yearPct}%`, background: 'var(--tk2-accent-purple)' }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: 'var(--tk2-fg-2)' }}>
          Enough time to change everything — or nothing.
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 6 }}>
        <YearRing pct={yearPct} />
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Year {year}</div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--tk2-fg-2)',
              maxWidth: 220,
              marginTop: 4,
              lineHeight: 1.5,
            }}
          >
            {yearPct}% gone. The version of you that started this year is already history.
          </div>
        </div>
      </div>
    </div>
  )
}

function YearRing({ pct }) {
  const r = 32
  const c = 2 * Math.PI * r
  const off = c - (c * pct) / 100

  return (
    <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
      <svg width="80" height="80" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="40" cy="40" r={r} stroke="var(--tk2-line-soft)" strokeWidth="5" fill="none" />
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke="var(--tk2-accent-purple)"
          strokeWidth="5"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="tk2-mono" style={{ fontSize: 16, fontWeight: 600 }}>
          {pct}%
        </div>
        <div
          className="tk2-mono"
          style={{ fontSize: 9, color: 'var(--tk2-fg-2)', letterSpacing: '0.1em' }}
        >
          GONE
        </div>
      </div>
    </div>
  )
}
