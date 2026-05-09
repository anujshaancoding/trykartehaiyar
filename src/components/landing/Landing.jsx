"use client"

import { useEffect, useState } from 'react'
import '@/styles/tkhy-landing.css'

import TopBar from './TopBar'
import HeroClock from './HeroClock'
import PortalPicker from './PortalPicker'
import TimeYouDontGetBack from './TimeYouDontGetBack'
import NonNegotiables from './NonNegotiables'
import FocusGoals from './FocusGoals'
import Quote from './Quote'
import Community from './Community'
import Leaderboard from './Leaderboard'
import Footer from './Footer'

const VALID_VIBES = ['refined', 'awakening', 'brutalist']
const DEFAULT_VIBE = 'refined'

export default function Landing() {
  const [vibe, setVibe] = useState(DEFAULT_VIBE)

  // After mount: pick the persisted/URL vibe, mark body so legacy globals.css
  // stops applying its banner padding + overlay gradient.
  useEffect(() => {
    document.body.classList.add('tkhy-landing-active')
    let initial = DEFAULT_VIBE
    try {
      const url = new URL(window.location.href)
      const fromUrl = url.searchParams.get('vibe')
      const fromStorage = window.localStorage.getItem('tkhy-vibe')
      if (fromUrl && VALID_VIBES.includes(fromUrl)) initial = fromUrl
      else if (fromStorage && VALID_VIBES.includes(fromStorage)) initial = fromStorage
    } catch {
      /* noop */
    }
    setVibe(initial)
    return () => {
      document.body.classList.remove('tkhy-landing-active')
    }
  }, [])

  const handleVibeChange = (next) => {
    if (!VALID_VIBES.includes(next)) return
    setVibe(next)
    try {
      window.localStorage.setItem('tkhy-vibe', next)
      const url = new URL(window.location.href)
      url.searchParams.set('vibe', next)
      window.history.replaceState({}, '', url.toString())
    } catch {
      /* noop */
    }
  }

  return (
    <div className="tk2-root" data-vibe={vibe} suppressHydrationWarning>
      <div className="tk2-shell">
        <TopBar vibe={vibe} onVibeChange={handleVibeChange} />
        <HeroClock vibe={vibe} />

        <PortalPicker />

        <div className="tk2-grid-2">
          <TimeYouDontGetBack />
          <NonNegotiables />
          <FocusGoals />
          <Quote />
        </div>

        <CommunityRow />

        <Footer />
      </div>
    </div>
  )
}

/* ===== Community + Leaderboard row (tabs on mobile) ===== */
function CommunityRow() {
  const [isMobile, setIsMobile] = useState(false)
  const [tab, setTab] = useState('community')

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (isMobile) {
    return (
      <div style={{ marginTop: 16 }}>
        <div
          role="tablist"
          aria-label="Community sections"
          style={{
            display: 'inline-flex',
            gap: 4,
            padding: 3,
            background: 'var(--tk2-bg-2)',
            border: '1px solid var(--tk2-line-soft)',
            borderRadius: 999,
            marginBottom: 12,
          }}
        >
          {[
            { id: 'community', label: 'Community' },
            { id: 'leaderboard', label: 'Leaderboard' },
          ].map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              type="button"
              onClick={() => setTab(t.id)}
              style={{
                appearance: 'none',
                background: tab === t.id ? 'var(--tk2-bg-0)' : 'transparent',
                color: tab === t.id ? 'var(--tk2-fg-0)' : 'var(--tk2-fg-2)',
                border: 0,
                fontFamily: 'var(--tk2-font-mono)',
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '6px 14px',
                borderRadius: 999,
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'community' ? <Community /> : <Leaderboard />}
      </div>
    )
  }

  return (
    <div className="tk2-grid-community">
      <Community />
      <Leaderboard />
    </div>
  )
}
