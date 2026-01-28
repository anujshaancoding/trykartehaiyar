"use client"

import { useState, useEffect } from 'react'
import Clock from './Clock'
import ProgressSection from './ProgressSection'
import HabitsSection from './HabitsSection'
import GoalsSection from './GoalsSection'
import QuoteSection from './QuoteSection'
import CommunitySection from './CommunitySection'
import BottomBar from './BottomBar'
import ActiveUsers from './ActiveUsers'
import CookieConsent from './CookieConsent'
import FeedbackButton from './FeedbackButton'
import TopMenu from './TopMenu'
import InfoModal from './InfoModal'
import Onboarding from './Onboarding'

export default function DashboardClient() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  // Read localStorage after hydration to avoid mismatch
  useEffect(() => {
    const bannerClosed = localStorage.getItem('bannerClosed') === 'true'
    setShowBanner(!bannerClosed)
  }, [])

  const closeBanner = () => {
    setShowBanner(false)
    localStorage.setItem('bannerClosed', 'true')
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when user is typing in an input field
      const activeElement = document.activeElement
      const isTyping = activeElement.tagName === 'INPUT' ||
                       activeElement.tagName === 'TEXTAREA' ||
                       activeElement.isContentEditable

      if (isTyping) return

      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen()
      }
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Toggle body class for banner visibility
  useEffect(() => {
    if (showBanner && !isFullscreen) {
      document.body.classList.remove('banner-hidden')
    } else {
      document.body.classList.add('banner-hidden')
    }
  }, [showBanner, isFullscreen])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error)
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <>
      <Onboarding />
      {showBanner && !isFullscreen && (
        <div className="demo-banner">
          <div className="demo-banner-content">
            <span>This is the Demo of what's coming as mobile App</span>
            <span>This is the Demo of what's coming as mobile App</span>
            <span>This is the Demo of what's coming as mobile App</span>
            <span>This is the Demo of what's coming as mobile App</span>
          </div>
          <button
            className="demo-banner-close"
            onClick={closeBanner}
            aria-label="Close banner"
          >
            ✕
          </button>
        </div>
      )}
      <ActiveUsers />
      <TopMenu onFeedbackClick={() => setFeedbackOpen(true)} onInfoClick={() => setInfoOpen(true)} />
      <FeedbackButton externalOpen={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <InfoModal isOpen={infoOpen} onClose={() => setInfoOpen(false)} />
      <main className="dashboard anti-burn-in">
        <Clock />
        <ProgressSection />
        <HabitsSection />
        <GoalsSection />
        <QuoteSection />
        <CommunitySection />
      </main>
      <CookieConsent />

      <BottomBar isFullscreen={isFullscreen} onToggle={toggleFullscreen} />

      <footer className="app-footer">
        <p className="footer-micro-copy">This is not a clock. It's a mirror.</p>
        <p className="dedication">Dedicated to Ashish Ranjan</p>
        <p className="license">&copy; 2026 TKHY</p>
      </footer>
    </>
  )
}
