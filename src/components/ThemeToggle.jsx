"use client"

import { useState, useEffect, useRef } from 'react'

const themes = [
  { id: 'dark', name: 'Dark', icon: '🌙' },
  { id: 'light', name: 'Light', icon: '☀️' },
  { id: 'midnight', name: 'Midnight Blue', icon: '🌌' },
  { id: 'forest', name: 'Forest', icon: '🌲' },
  { id: 'sunset', name: 'Sunset', icon: '🌅' },
]

function ThemeToggle() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('dark')
  const [ambientMode, setAmbientMode] = useState(false)
  const [ultraLargeMode, setUltraLargeMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const menuRef = useRef(null)

  // Read localStorage after hydration to avoid mismatch
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    const savedAmbient = localStorage.getItem('ambientMode') === 'true'
    const savedUltraLarge = localStorage.getItem('ultraLargeMode') === 'true'

    setCurrentTheme(savedTheme)
    setAmbientMode(savedAmbient)
    setUltraLargeMode(savedUltraLarge)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('data-theme', currentTheme)
    localStorage.setItem('theme', currentTheme)
  }, [currentTheme, mounted])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('ambient-mode', ambientMode)
    localStorage.setItem('ambientMode', ambientMode)
  }, [ambientMode, mounted])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.classList.toggle('ultra-large-mode', ultraLargeMode)
    localStorage.setItem('ultraLargeMode', ultraLargeMode)
  }, [ultraLargeMode, mounted])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId)
    setIsOpen(false)
  }

  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0]

  return (
    <div className="theme-toggle-container" ref={menuRef}>
      <button
        className="theme-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Change theme"
        aria-expanded={isOpen}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <span>Theme</span>
      </button>

      {isOpen && (
        <div className="theme-menu">
          <div className="menu-section">
            <span className="menu-section-label">Theme</span>
            {themes.map((theme) => (
              <button
                key={theme.id}
                className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                onClick={() => handleThemeChange(theme.id)}
              >
                <span className="theme-icon">{theme.icon}</span>
                <span className="theme-name">{theme.name}</span>
                {currentTheme === theme.id && (
                  <svg className="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          <div className="menu-divider"></div>
          <div className="menu-section">
            <span className="menu-section-label">Display Mode</span>
            <button
              className={`theme-option toggle-option ${ambientMode ? 'active' : ''}`}
              onClick={() => setAmbientMode(!ambientMode)}
            >
              <span className="theme-icon">✨</span>
              <span className="theme-name">Ambient Mode</span>
              <span className="toggle-switch">
                <span className={`toggle-slider ${ambientMode ? 'on' : ''}`}></span>
              </span>
            </button>
            <button
              className={`theme-option toggle-option ${ultraLargeMode ? 'active' : ''}`}
              onClick={() => setUltraLargeMode(!ultraLargeMode)}
            >
              <span className="theme-icon">📺</span>
              <span className="theme-name">TV / Wall Mode</span>
              <span className="toggle-switch">
                <span className={`toggle-slider ${ultraLargeMode ? 'on' : ''}`}></span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ThemeToggle
