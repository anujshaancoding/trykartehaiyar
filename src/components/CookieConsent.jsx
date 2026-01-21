import { useState, useEffect } from 'react'

function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      // Small delay for smooth appearance
      const timer = setTimeout(() => setIsVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="cookie-consent">
      <div className="cookie-consent-content">
        <div className="cookie-consent-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="8" cy="9" r="1" fill="currentColor"/>
            <circle cx="15" cy="8" r="1" fill="currentColor"/>
            <circle cx="10" cy="14" r="1" fill="currentColor"/>
            <circle cx="16" cy="13" r="1" fill="currentColor"/>
            <circle cx="12" cy="17" r="1" fill="currentColor"/>
          </svg>
        </div>
        <div className="cookie-consent-text">
          <p className="cookie-consent-title">Accept all cookies to work seamlessly</p>
          <p className="cookie-consent-description">We will save and collect data of your record</p>
        </div>
        <button className="cookie-consent-btn" onClick={handleAccept}>
          Accept All
        </button>
      </div>
    </div>
  )
}

export default CookieConsent
