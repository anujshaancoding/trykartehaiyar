"use client"

import { useEffect, useState } from 'react'
import WorkoutPreview from './portals/WorkoutPreview'
import StudentsPreview from './portals/StudentsPreview'
import DeveloperPreview from './portals/DeveloperPreview'

const PORTALS = [
  {
    key: 'workout',
    idx: 1,
    label: 'Workout',
    tag: 'workout.trykartehaiyar.com',
    headline: 'Train the body.\nNo excuses.',
    desc: 'Daily workout splits, progress tracking, accountability. PRs only beat themselves.',
    stat: { v: '12,847', l: 'workouts logged this month' },
    color: 'var(--tk2-accent-orange)',
    glow: 'oklch(0.72 0.17 45 / 0.4)',
    Preview: WorkoutPreview,
  },
  {
    key: 'students',
    idx: 2,
    label: 'Students',
    tag: 'students.trykartehaiyar.com',
    headline: 'NEET. Govt. Exams.\nGrind in silence.',
    desc: 'Pomodoro sessions, syllabus tracker, mock test scores. Build the habit before the result.',
    stat: { v: '8,491', l: 'study hours this week' },
    color: 'var(--tk2-accent-purple)',
    glow: 'oklch(0.65 0.18 305 / 0.4)',
    Preview: StudentsPreview,
  },
  {
    key: 'developer',
    idx: 3,
    label: 'Developers',
    tag: 'developer.trykartehaiyar.com',
    headline: 'Ship code.\nEvery damn day.',
    desc: 'Commit streaks, problem of the day, project showcase. CS is built one bug at a time.',
    stat: { v: '4,203', l: 'commits this week' },
    color: 'var(--tk2-accent-green)',
    glow: 'oklch(0.74 0.14 155 / 0.4)',
    Preview: DeveloperPreview,
  },
]

export default function PortalPicker() {
  const [active, setActive] = useState(null) // null | 0 | 1 | 2
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const gridTemplateColumns = isMobile
    ? '1fr'
    : PORTALS.map((_, i) =>
        active === null ? '1fr' : active === i ? '4fr' : '78px',
      ).join(' ')

  const height = isMobile ? 'auto' : 460

  return (
    <div style={{ gridColumn: '1 / -1', marginTop: 8 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 22,
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div className="tk2-eyebrow">What can you do here</div>
          <div
            style={{
              fontSize: 'clamp(28px, 3.2vw, 40px)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              marginTop: 6,
              lineHeight: 1.1,
            }}
          >
            Pick your world. Get to work.
          </div>
        </div>
        <div
          className="tk2-mono"
          style={{
            fontSize: 12,
            color: 'var(--tk2-fg-2)',
            maxWidth: 280,
            textAlign: 'right',
          }}
        >
          Three sub-domains. One mission: stop saying you'll start tomorrow.
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns,
          gap: 14,
          height,
          transition: 'grid-template-columns 0.55s cubic-bezier(.6,.05,.1,1)',
          willChange: 'grid-template-columns',
        }}
        onMouseLeave={() => !isMobile && setActive(null)}
      >
        {PORTALS.map((p, i) => (
          <PortalCard
            key={p.key}
            portal={p}
            isActive={!isMobile && active === i}
            isInactive={!isMobile && active !== null && active !== i}
            isMobile={isMobile}
            onHover={() => setActive(i)}
          />
        ))}
      </div>
    </div>
  )
}

function PortalCard({ portal, isActive, isInactive, isMobile, onHover }) {
  const { Preview } = portal

  return (
    <a
      href={`https://${portal.tag}`}
      onMouseEnter={onHover}
      onFocus={onHover}
      className="tk2-card"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 0,
        display: 'block',
        cursor: 'pointer',
        transition:
          'background 0.5s cubic-bezier(.6,.05,.1,1), border-color 0.5s, transform 0.5s, opacity 0.5s',
        background: isActive
          ? `radial-gradient(circle at 30% 20%, ${portal.glow}, transparent 60%), var(--tk2-bg-1)`
          : 'var(--tk2-bg-1)',
        borderColor: isActive ? portal.color : 'var(--tk2-line-soft)',
        transform: isActive ? 'translateY(-2px)' : 'none',
        opacity: isInactive ? 0.7 : 1,
        height: isMobile ? 420 : '100%',
        minWidth: 0,
      }}
    >
      {/* ===== Spine layer (visible when shrunk) ===== */}
      <div
        aria-hidden={!isInactive}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 0,
          opacity: isInactive ? 1 : 0,
          transition: 'opacity 0.35s ease',
          transitionDelay: isInactive ? '0.15s' : '0s',
          pointerEvents: isInactive ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            marginTop: 22,
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: `1px solid ${portal.color}`,
            color: portal.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--tk2-font-mono)',
            fontSize: 11,
          }}
        >
          0{portal.idx}
        </div>

        <div
          className="tk2-mono"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: 14,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'var(--tk2-fg-1)',
            fontWeight: 600,
            padding: '20px 0',
            whiteSpace: 'nowrap',
          }}
        >
          {portal.label}
        </div>

        <div style={{ marginBottom: 22, color: 'var(--tk2-fg-3)', fontSize: 18 }}>↑</div>
      </div>

      {/* ===== Expanded layer (visible when default or active) ===== */}
      <div
        aria-hidden={isInactive}
        style={{
          position: 'absolute',
          inset: 0,
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          opacity: isInactive ? 0 : 1,
          transform: isInactive ? 'scale(0.96)' : 'scale(1)',
          transformOrigin: 'left center',
          transition: 'opacity 0.3s ease, transform 0.5s cubic-bezier(.6,.05,.1,1)',
          transitionDelay: isInactive ? '0s' : '0.18s',
          pointerEvents: isInactive ? 'none' : 'auto',
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              className="tk2-mono"
              style={{
                fontSize: 11,
                color: portal.color,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              0{portal.idx} · {portal.label}
            </div>
            <div
              className="tk2-mono"
              style={{
                fontSize: 11,
                color: 'var(--tk2-fg-3)',
                marginTop: 4,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {portal.tag}
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: `1px solid ${isActive ? portal.color : 'var(--tk2-line)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isActive ? portal.color : 'var(--tk2-fg-2)',
              transition: 'border-color 0.3s, color 0.3s, transform 0.3s',
              transform: isActive ? 'rotate(-45deg)' : 'rotate(0deg)',
              flexShrink: 0,
            }}
          >
            →
          </div>
        </div>

        <div style={{ flex: 1, margin: '24px 0', position: 'relative', minHeight: 0 }}>
          <Preview active={isActive || isMobile} color={portal.color} />
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 'clamp(20px, 2vw, 28px)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              whiteSpace: 'pre-line',
            }}
          >
            {portal.headline}
          </div>
          <div
            style={{
              fontSize: 13,
              color: 'var(--tk2-fg-2)',
              marginTop: 12,
              lineHeight: 1.5,
              maxWidth: 380,
            }}
          >
            {portal.desc}
          </div>
          <div
            style={{
              marginTop: 18,
              paddingTop: 16,
              borderTop: '1px solid var(--tk2-line-soft)',
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
            }}
          >
            <span
              className="tk2-mono tk2-tnum"
              style={{ fontSize: 22, fontWeight: 600, color: portal.color }}
            >
              {portal.stat.v}
            </span>
            <span
              style={{
                fontSize: 12,
                color: 'var(--tk2-fg-2)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {portal.stat.l}
            </span>
          </div>
        </div>
      </div>
    </a>
  )
}
