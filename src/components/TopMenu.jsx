import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useFeedbackCount } from '../hooks/useFeedbackCount'

function TopMenu({ onFeedbackClick, onInfoClick }) {
  const [isOpen, setIsOpen] = useState(false)
  const feedbackCount = useFeedbackCount()
  const menuRef = useRef(null)

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

  return (
    <div className="top-menu" ref={menuRef}>
      {/* Desktop view */}
      <div className="top-menu-desktop">
        <Link to="/blog" className="top-menu-btn top-menu-journey-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span>My Journey</span>
          <div className="journey-pulse"></div>
        </Link>
        <button className="top-menu-btn top-menu-info-btn" onClick={onInfoClick} aria-label="About this app">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </button>
        <button className="top-menu-btn" onClick={onFeedbackClick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Feedback</span>
        </button>
        <div className="top-menu-count">
          <span className="top-menu-count-number">{feedbackCount}</span>
          <span className="top-menu-count-label">registered</span>
        </div>
      </div>

      {/* Mobile hamburger */}
      <button
        className="top-menu-hamburger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="top-menu-dropdown">
          <Link to="/blog" className="top-menu-dropdown-item top-menu-dropdown-journey" onClick={() => setIsOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>My Journey</span>
            <div className="journey-pulse-mobile"></div>
          </Link>
          <button className="top-menu-dropdown-item" onClick={() => { onInfoClick(); setIsOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>About</span>
          </button>
          <button className="top-menu-dropdown-item" onClick={() => { onFeedbackClick(); setIsOpen(false); }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Feedback</span>
          </button>
          <div className="top-menu-dropdown-item top-menu-dropdown-info">
            <span className="top-menu-count-number">{feedbackCount}</span>
            <span className="top-menu-count-label">feedback registered</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TopMenu
