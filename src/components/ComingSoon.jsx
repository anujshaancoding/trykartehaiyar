"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import '@/styles/tkhy-landing.css'

const PORTAL_INFO = {
  workout: {
    idx: '01',
    label: 'Workout',
    tag: 'workout.trykartehaiyar.com',
    headline: 'Train the body.\nNo excuses.',
    desc: 'Daily splits, progress tracking, accountability. Currently being built.',
    color: 'var(--tk2-accent-orange)',
    glow: 'oklch(0.72 0.17 45 / 0.4)',
  },
  students: {
    idx: '02',
    label: 'Students',
    tag: 'students.trykartehaiyar.com',
    headline: 'NEET. Govt. Exams.\nGrind in silence.',
    desc: 'Pomodoro sessions, syllabus tracker, mock test scores. Currently being built.',
    color: 'var(--tk2-accent-purple)',
    glow: 'oklch(0.65 0.18 305 / 0.4)',
  },
}

const DEFAULT_PORTAL = {
  idx: '··',
  label: 'Portal',
  tag: 'trykartehaiyar.com',
  headline: 'Something is\nbeing built.',
  desc: 'This portal is not live yet. We\'re working on it.',
  color: 'var(--tk2-accent-amber)',
  glow: 'oklch(0.78 0.15 75 / 0.35)',
}

export default function ComingSoon() {
  const searchParams = useSearchParams()
  const portalKey = searchParams.get('portal')
  const portal = PORTAL_INFO[portalKey] || DEFAULT_PORTAL

  useEffect(() => {
    document.body.classList.add('tkhy-landing-active')
    return () => {
      document.body.classList.remove('tkhy-landing-active')
    }
  }, [])

  return (
    <div className="tk2-root" suppressHydrationWarning>
      <div
        className="tk2-shell"
        style={{
          minHeight: '100vh',
          maxWidth: 720,
          margin: '0 auto',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 64,
          }}
        >
          <Link
            href="/"
            className="tk2-mono"
            style={{
              fontSize: 12,
              color: 'var(--tk2-fg-2)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 16 }}>←</span> Back
          </Link>
          <span
            className="tk2-mono"
            style={{
              fontSize: 11,
              color: 'var(--tk2-fg-3)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            tkhy
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            background: `radial-gradient(circle at 20% 0%, ${portal.glow}, transparent 55%)`,
            borderRadius: 'var(--tk2-radius-lg)',
            padding: '48px 32px',
            border: '1px solid var(--tk2-line-soft)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: `1px solid ${portal.color}`,
                color: portal.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--tk2-font-mono)',
                fontSize: 12,
              }}
            >
              {portal.idx}
            </div>
            <div
              className="tk2-mono"
              style={{
                fontSize: 11,
                color: portal.color,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
              }}
            >
              {portal.label} · {portal.tag}
            </div>
          </div>

          <div
            className="tk2-mono"
            style={{
              fontSize: 11,
              color: 'var(--tk2-fg-2)',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Coming soon
          </div>

          <h1
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              whiteSpace: 'pre-line',
              margin: 0,
            }}
          >
            {portal.headline}
          </h1>

          <p
            style={{
              fontSize: 15,
              color: 'var(--tk2-fg-1)',
              marginTop: 20,
              lineHeight: 1.55,
              maxWidth: 480,
            }}
          >
            {portal.desc}
          </p>

          <div
            style={{
              marginTop: 40,
              paddingTop: 24,
              borderTop: '1px solid var(--tk2-line-soft)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <Link
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                background: portal.color,
                color: 'var(--tk2-bg-0)',
                fontFamily: 'var(--tk2-font-mono)',
                fontSize: 12,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: 999,
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Back to home
            </Link>
            <a
              href="https://developers.trykartehaiyar.in"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                background: 'transparent',
                color: 'var(--tk2-fg-1)',
                fontFamily: 'var(--tk2-font-mono)',
                fontSize: 12,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: 999,
                textDecoration: 'none',
                border: '1px solid var(--tk2-line)',
              }}
            >
              Try developers portal →
            </a>
          </div>
        </div>

        <div
          className="tk2-mono"
          style={{
            fontSize: 11,
            color: 'var(--tk2-fg-3)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginTop: 32,
            textAlign: 'center',
          }}
        >
          Built one bug at a time.
        </div>
      </div>
    </div>
  )
}
