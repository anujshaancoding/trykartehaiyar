import { useState, useEffect } from 'react'

function ReadingControls({ language }) {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showFontControls, setShowFontControls] = useState(false)
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('blogFontSize') || 'medium'
  })

  // Font size options
  const fontSizes = {
    small: { label: 'A', size: '0.95rem', lineHeight: '1.7' },
    medium: { label: 'A', size: '1.05rem', lineHeight: '1.8' },
    large: { label: 'A', size: '1.2rem', lineHeight: '1.85' },
    'extra-large': { label: 'A', size: '1.35rem', lineHeight: '1.9' }
  }

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Apply font size to blog content
    document.documentElement.setAttribute('data-blog-font', fontSize)
    localStorage.setItem('blogFontSize', fontSize)
  }, [fontSize])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleFontSizeChange = (size) => {
    setFontSize(size)
    setShowFontControls(false)
  }

  return (
    <>
      {/* Reading Controls FAB */}
      <div className="reading-controls">
        {/* Font Size Button */}
        <div className="font-size-wrapper">
          <button
            className={`reading-control-btn font-size-btn ${showFontControls ? 'active' : ''}`}
            onClick={() => setShowFontControls(!showFontControls)}
            aria-label={language === 'hi' ? 'फ़ॉन्ट साइज़ बदलें' : 'Change font size'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 7V4h16v3" />
              <path d="M9 20h6" />
              <path d="M12 4v16" />
            </svg>
          </button>

          {/* Font Size Dropdown */}
          {showFontControls && (
            <div className="font-size-dropdown">
              <div className="font-size-header">
                {language === 'hi' ? 'फ़ॉन्ट साइज़' : 'Font Size'}
              </div>
              <div className="font-size-options">
                <button
                  className={`font-option font-small ${fontSize === 'small' ? 'active' : ''}`}
                  onClick={() => handleFontSizeChange('small')}
                  aria-label="Small"
                >
                  <span className="font-preview-small">A</span>
                  <span className="font-label">{language === 'hi' ? 'छोटा' : 'Small'}</span>
                </button>
                <button
                  className={`font-option font-medium ${fontSize === 'medium' ? 'active' : ''}`}
                  onClick={() => handleFontSizeChange('medium')}
                  aria-label="Medium"
                >
                  <span className="font-preview-medium">A</span>
                  <span className="font-label">{language === 'hi' ? 'मध्यम' : 'Medium'}</span>
                </button>
                <button
                  className={`font-option font-large ${fontSize === 'large' ? 'active' : ''}`}
                  onClick={() => handleFontSizeChange('large')}
                  aria-label="Large"
                >
                  <span className="font-preview-large">A</span>
                  <span className="font-label">{language === 'hi' ? 'बड़ा' : 'Large'}</span>
                </button>
                <button
                  className={`font-option font-xl ${fontSize === 'extra-large' ? 'active' : ''}`}
                  onClick={() => handleFontSizeChange('extra-large')}
                  aria-label="Extra Large"
                >
                  <span className="font-preview-xl">A</span>
                  <span className="font-label">{language === 'hi' ? 'बहुत बड़ा' : 'XL'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scroll to Top Button */}
        <button
          className={`reading-control-btn scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
          onClick={scrollToTop}
          aria-label={language === 'hi' ? 'ऊपर जाएं' : 'Scroll to top'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* Overlay to close font controls */}
      {showFontControls && (
        <div
          className="reading-controls-overlay"
          onClick={() => setShowFontControls(false)}
        />
      )}
    </>
  )
}

export default ReadingControls
