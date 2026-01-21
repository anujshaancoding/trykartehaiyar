import { useState, useEffect } from 'react'
import Clock from './components/Clock'
import ProgressSection from './components/ProgressSection'
import HabitsSection from './components/HabitsSection'
import GoalsSection from './components/GoalsSection'
import QuoteSection from './components/QuoteSection'
import FullscreenButton from './components/FullscreenButton'
import ThemeToggle from './components/ThemeToggle'
import ActiveUsers from './components/ActiveUsers'

function App() {
  const [isFullscreen, setIsFullscreen] = useState(false)

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error)
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <>
      <ActiveUsers />
      <main className="dashboard anti-burn-in">
        <Clock />
        <ProgressSection />
        <HabitsSection />
        <GoalsSection />
        <QuoteSection />
      </main>
      <ThemeToggle />
      <FullscreenButton isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
      <footer className="dedication">❤ Dedicated to Ashish Ranjan ❤</footer>
    </>
  )
}

export default App
