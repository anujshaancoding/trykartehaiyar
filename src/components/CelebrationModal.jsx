"use client"

import { useRef, useEffect, useState } from 'react'
import html2canvas from 'html2canvas'

const USER_NAME_KEY = 'leaderboardUserName'

const congratsMessages = [
  "You did it! Every task crushed.",
  "Today was a win. You showed up.",
  "All done. This is what discipline looks like.",
  "Perfect execution. Day complete.",
  "Champion moves only. All tasks done.",
]

const tomorrowMessages = [
  "Tomorrow is another chance to be unstoppable.",
  "Rest well. Tomorrow needs you at your best.",
  "The momentum you built today carries forward.",
  "Sleep knowing you gave today everything.",
  "One day closer to the person you're becoming.",
]

const thankYouMessages = [
  "Thank you for showing up for yourself today.",
  "Your future self thanks you for today's effort.",
  "Today's work is tomorrow's foundation.",
  "You chose progress over comfort. That matters.",
  "Every completed task is a promise kept to yourself.",
]

function CelebrationModal({ isOpen, onClose, completedHabits, habits, openToShare = false }) {
  const modalRef = useRef(null)
  const cardRef = useRef(null)
  const [showCard, setShowCard] = useState(false)
  const [showNameInput, setShowNameInput] = useState(false)
  const [userName, setUserName] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [messages, setMessages] = useState({
    congrats: '',
    tomorrow: '',
    thankYou: ''
  })

  useEffect(() => {
    if (isOpen) {
      // Pick random messages when modal opens
      setMessages({
        congrats: congratsMessages[Math.floor(Math.random() * congratsMessages.length)],
        tomorrow: tomorrowMessages[Math.floor(Math.random() * tomorrowMessages.length)],
        thankYou: thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)]
      })

      // Load saved username
      const savedName = localStorage.getItem(USER_NAME_KEY)
      setUserName(savedName || '')
      setNameInput('')

      // If openToShare is true, skip to share flow
      if (openToShare) {
        if (savedName) {
          setShowCard(true)
          setShowNameInput(false)
        } else {
          setShowNameInput(true)
          setShowCard(false)
        }
      } else {
        setShowCard(false)
        setShowNameInput(false)
      }
    }
  }, [isOpen, openToShare])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const handleShareClick = () => {
    const savedName = localStorage.getItem(USER_NAME_KEY)
    if (savedName) {
      setUserName(savedName)
      setShowCard(true)
    } else {
      setShowNameInput(true)
    }
  }

  const handleNameSubmit = (e) => {
    e.preventDefault()
    if (nameInput.trim()) {
      const trimmedName = nameInput.trim()
      localStorage.setItem(USER_NAME_KEY, trimmedName)
      setUserName(trimmedName)
      setShowNameInput(false)
      setShowCard(true)
    }
  }

  const handleDownload = async () => {
    if (!cardRef.current || isGenerating) return

    setIsGenerating(true)

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3, // High quality
        backgroundColor: null,
        useCORS: true,
        logging: false,
      })

      const link = document.createElement('a')
      link.download = `achievement-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      link.click()
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBackToMessage = () => {
    setShowCard(false)
    setShowNameInput(false)
  }

  if (!isOpen) return null

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })

  const completedHabitsList = habits.filter(h => completedHabits.has(h.id))

  return (
    <div className="celebration-overlay">
      <div className="celebration-modal" ref={modalRef}>
        <button className="celebration-close-btn" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {!showCard && !showNameInput ? (
          // Congratulations Message View
          <div className="celebration-content">
            <div className="celebration-confetti">
              <span>🎉</span>
              <span>✨</span>
              <span>🏆</span>
              <span>⭐</span>
              <span>🎊</span>
            </div>

            <h2 className="celebration-title">Congratulations!</h2>
            <p className="celebration-congrats">{messages.congrats}</p>

            <div className="celebration-divider"></div>

            <p className="celebration-tomorrow">
              <span className="celebration-label">For Tomorrow</span>
              {messages.tomorrow}
            </p>

            <p className="celebration-thankyou">
              <span className="celebration-label">Today's Reflection</span>
              {messages.thankYou}
            </p>

            <button className="celebration-share-btn" onClick={handleShareClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share This Achievement
            </button>
          </div>
        ) : showNameInput ? (
          // Name Input View
          <div className="celebration-content">
            <div className="celebration-name-icon">👤</div>
            <h2 className="celebration-title">What's Your Name?</h2>
            <p className="celebration-name-subtitle">
              Your name will appear on the achievement card
            </p>

            <form className="celebration-name-form" onSubmit={handleNameSubmit}>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name..."
                className="celebration-name-input"
                autoFocus
                maxLength={30}
              />
              <div className="celebration-name-actions">
                <button type="submit" className="celebration-name-submit" disabled={!nameInput.trim()}>
                  Continue
                </button>
                <button type="button" className="celebration-name-cancel" onClick={handleBackToMessage}>
                  Back
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Achievement Card View
          <div className="celebration-card-view">
            <button className="celebration-back-btn" onClick={handleBackToMessage}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </button>

            <div className="achievement-card-wrapper">
              <div className="achievement-card" ref={cardRef}>
                <div className="achievement-card-body">
                  <div className="achievement-card-left">
                    <div className="achievement-card-header">
                      <div className="achievement-card-logo">🏆</div>
                      <h3 className="achievement-card-title">Day Complete!</h3>
                      <p className="achievement-card-subtitle">All tasks accomplished</p>
                    </div>

                    <div className="achievement-card-user">
                      <span className="achievement-user-label">Achieved by</span>
                      <span className="achievement-user-name">{userName}</span>
                    </div>

                    <div className="achievement-card-date">
                      <span className="achievement-date">{dateStr}</span>
                      <span className="achievement-time">{timeStr}</span>
                    </div>
                  </div>

                  <div className="achievement-card-right">
                    <div className="achievement-card-tasks">
                      <p className="achievement-tasks-label">Completed Tasks</p>
                      <ul className="achievement-tasks-list">
                        {completedHabitsList.map(habit => (
                          <li key={habit.id} className="achievement-task-item">
                            <span className="achievement-task-check">✓</span>
                            <span className="achievement-task-icon">{habit.icon}</span>
                            <span className="achievement-task-text">{habit.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="achievement-card-footer">
                  <div className="achievement-card-branding">
                    <span className="achievement-brand-text">TryKarteHaiYar</span>
                    <span className="achievement-brand-tagline">Build better days</span>
                  </div>
                </div>

                <div className="achievement-card-decoration">
                  <div className="achievement-glow"></div>
                </div>
              </div>
            </div>

            <button
              className="celebration-download-btn"
              onClick={handleDownload}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="download-spinner"></span>
                  Generating...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Card
                </>
              )}
            </button>
            <p className="celebration-download-hint">High-quality PNG ready for sharing anywhere</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CelebrationModal
