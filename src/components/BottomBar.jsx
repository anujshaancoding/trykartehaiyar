"use client"

import { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import FullscreenButton from './FullscreenButton'
import { useTime } from '../hooks/useTime'

const NIGHT_MESSAGES = [
  "Tomorrow is watching.",
  "You already know what to do.",
  "Don't trade long-term peace for short-term comfort."
]

const IDLE_MESSAGE = "Still time. Still your move."

function BottomBar({ isFullscreen, onToggle }) {
  const [isIdle, setIsIdle] = useState(false)
  const { isNightTime, hour24 } = useTime()

  // Night time message based on hour
  const nightMessageIndex = hour24 >= 21 ? (hour24 - 21) % NIGHT_MESSAGES.length : 0
  const nightMessage = NIGHT_MESSAGES[nightMessageIndex]

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

  return (
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
      <FullscreenButton isFullscreen={isFullscreen} onToggle={onToggle} />
    </div>
  )
}

export default BottomBar
