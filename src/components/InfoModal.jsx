"use client"

import { useRef, useEffect } from 'react'

function InfoModal({ isOpen, onClose }) {
  const modalRef = useRef(null)

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

  if (!isOpen) return null

  const features = [
    {
      emoji: '⏰',
      title: 'Beautiful Clock Display',
      description: 'Stay focused with our elegant real-time clock featuring AM/PM format'
    },
    {
      emoji: '📊',
      title: 'Progress Tracking',
      description: 'Visualize your month and year progress with stunning animated bars'
    },
    {
      emoji: '✅',
      title: 'Daily Habits',
      description: 'Create, track, and complete your daily habits with satisfying checkmarks'
    },
    {
      emoji: '🎯',
      title: 'Monthly & Yearly Goals',
      description: 'Set ambitious goals and watch yourself achieve them over time'
    },
    {
      emoji: '💬',
      title: 'Community Thoughts',
      description: 'Share your thoughts and connect with like-minded individuals'
    },
    {
      emoji: '💡',
      title: 'Inspirational Quotes',
      description: 'Get motivated with auto-rotating quotes from great minds'
    },
    {
      emoji: '🎨',
      title: 'Multiple Themes',
      description: 'Choose from 5 beautiful themes: Dark, Light, Midnight, Forest & Sunset'
    },
    {
      emoji: '📱',
      title: 'Fully Responsive',
      description: 'Perfect experience on desktop, tablet, and mobile devices'
    },
    {
      emoji: '🔒',
      title: 'Local Storage',
      description: 'Your habits and goals are saved securely in your browser'
    },
    {
      emoji: '⛶',
      title: 'Fullscreen Mode',
      description: 'Press F for distraction-free fullscreen experience'
    }
  ]

  return (
    <div className="info-overlay">
      <div className="info-modal" ref={modalRef}>
        <button className="info-close-btn" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="info-header">
          <div className="info-logo">🚀</div>
          <h2 className="info-title">Welcome to TryKarteHaiYar!</h2>
          <p className="info-subtitle">Your personal productivity & habit tracking dashboard</p>
        </div>

        <div className="info-features">
          {features.map((feature, index) => (
            <div className="info-feature-item" key={index}>
              <span className="info-feature-emoji">{feature.emoji}</span>
              <div className="info-feature-content">
                <h3 className="info-feature-title">{feature.title}</h3>
                <p className="info-feature-desc">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="info-footer">
          <p>✨ Start building better habits today! ✨</p>
          <button className="info-got-it-btn" onClick={onClose}>
            Got it! Let's Go 🎉
          </button>
        </div>
      </div>
    </div>
  )
}

export default InfoModal
