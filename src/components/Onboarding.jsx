import { useState, useEffect } from 'react'

const ONBOARDING_VARIANTS = [
  {
    primary: "This page shows you time.",
    secondary: "What you do with it is on you.",
    subtext: "No accounts. No tracking. Just awareness.",
    button: "Begin"
  },
  {
    primary: "You are already spending this day.",
    secondary: "The question is whether it counts.",
    subtext: null,
    button: "Show me"
  },
  {
    primary: "Nothing here will motivate you.",
    secondary: "That part is your job.",
    subtext: null,
    button: "Begin"
  },
  {
    primary: "You don't need more tools.",
    secondary: "You need fewer excuses.",
    subtext: null,
    button: "Begin"
  },
  {
    primary: "This is a reminder, not a planner.",
    secondary: null,
    subtext: null,
    button: "Begin"
  }
]

function Onboarding() {
  const [isVisible, setIsVisible] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [variant, setVariant] = useState(null)

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited')

    if (!hasVisited) {
      // Select random variant
      const randomIndex = Math.floor(Math.random() * ONBOARDING_VARIANTS.length)
      setVariant(ONBOARDING_VARIANTS[randomIndex])
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsFadingOut(true)
    setTimeout(() => {
      setIsVisible(false)
      localStorage.setItem('hasVisited', 'true')
    }, 400)
  }

  if (!isVisible || !variant) return null

  return (
    <div className={`onboarding-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="onboarding-content">
        <p className="onboarding-primary">{variant.primary}</p>
        {variant.secondary && (
          <p className="onboarding-secondary">{variant.secondary}</p>
        )}
        {variant.subtext && (
          <p className="onboarding-subtext">{variant.subtext}</p>
        )}
        <button className="onboarding-button" onClick={handleDismiss}>
          {variant.button}
        </button>
      </div>
    </div>
  )
}

export default Onboarding
