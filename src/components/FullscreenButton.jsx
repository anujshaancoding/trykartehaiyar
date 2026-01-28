"use client"

function FullscreenButton({ isFullscreen, onToggle }) {
  return (
    <button
      className="fullscreen-btn"
      onClick={onToggle}
      aria-label={isFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'}
    >
      {isFullscreen ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
          <span>Exit</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
          <span>Fullscreen</span>
        </>
      )}
    </button>
  )
}

export default FullscreenButton
