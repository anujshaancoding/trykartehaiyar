import { useState, useEffect } from 'react'
import Clock from './components/Clock'
import ProgressSection from './components/ProgressSection'
import HabitsSection from './components/HabitsSection'
import GoalsSection from './components/GoalsSection'
import QuoteSection from './components/QuoteSection'
import FullscreenButton from './components/FullscreenButton'
import ThemeToggle from './components/ThemeToggle'
import ActiveUsers from './components/ActiveUsers'
import CookieConsent from './components/CookieConsent'
import FeedbackButton from './components/FeedbackButton'

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showBanner, setShowBanner] = useState(() => {
    return localStorage.getItem('bannerClosed') !== 'true'
  })

  const closeBanner = () => {
    setShowBanner(false)
    localStorage.setItem('bannerClosed', 'true')
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    const handleKeyDown = (e) => {
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
      <FeedbackButton />
      <main className="dashboard anti-burn-in">
        <Clock />
        <ProgressSection />
        <HabitsSection />
        <GoalsSection />
        <QuoteSection />
      </main>
      <ThemeToggle />
      <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
      <CookieConsent />
      <footer className="dedication">❤ Dedicated to Ashish Ranjan ❤</footer>
    </>
  )
}

export default App
