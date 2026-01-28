import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Clock from './components/Clock'
import ProgressSection from './components/ProgressSection'
import HabitsSection from './components/HabitsSection'
import GoalsSection from './components/GoalsSection'
import QuoteSection from './components/QuoteSection'
import CommunitySection from './components/CommunitySection'
import FullscreenButton from './components/FullscreenButton'
import ThemeToggle from './components/ThemeToggle'
import ActiveUsers from './components/ActiveUsers'
import CookieConsent from './components/CookieConsent'
import FeedbackButton from './components/FeedbackButton'
import TopMenu from './components/TopMenu'
import InfoModal from './components/InfoModal'
import Onboarding from './components/Onboarding'
import BlogList from './components/BlogList'
import BlogDetail from './components/BlogDetail'
import { useTime } from './hooks/useTime'

const NIGHT_MESSAGES = [
  "Tomorrow is watching.",
  "You already know what to do.",
  "Don't trade long-term peace for short-term comfort."
]

const IDLE_MESSAGE = "Still time. Still your move."

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(() => {
    return localStorage.getItem('bannerClosed') !== 'true'
  })
  const [isIdle, setIsIdle] = useState(false)
  const { isNightTime, hour24 } = useTime()

  // Night time message based on hour
  const nightMessageIndex = hour24 >= 21 ? (hour24 - 21) % NIGHT_MESSAGES.length : 0
  const nightMessage = NIGHT_MESSAGES[nightMessageIndex]

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

  // Idle detection - show message when user hasn't interacted for 2 minutes
  useEffect(() => {
    let idleTimer

    const resetIdleTimer = () => {
      setIsIdle(false)
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => setIsIdle(true), 120000) // 2 minutes
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => document.addEventListener(event, resetIdleTimer))

    resetIdleTimer() // Initialize timer

    return () => {
      events.forEach(event => document.removeEventListener(event, resetIdleTimer))
      clearTimeout(idleTimer)
    }
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error)
    } else {
      document.exitFullscreen()
    }
  }

  const HomePage = () => (
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

      {/* Bottom bar with theme, message, and fullscreen aligned horizontally */}
      <div className="bottom-bar">
        <ThemeToggle />
        <div className="bottom-bar-center">
          {isIdle && !isNightTime && (
            <div className="idle-message">{IDLE_MESSAGE}</div>
          )}
          {isNightTime && (
            <div className="night-message">{nightMessage}</div>
          )}
        </div>
        <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
      </div>

      <footer className="app-footer">
        <p className="footer-micro-copy">This is not a clock. It's a mirror.</p>
        <p className="dedication">Dedicated to Ashish Ranjan</p>
        <p className="license">© 2026 TKHY</p>
      </footer>
    </>
  )

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog" element={<BlogList />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
    </Routes>
  )
}

export default App
