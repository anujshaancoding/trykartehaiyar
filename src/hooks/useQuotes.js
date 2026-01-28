import { useState, useEffect, useCallback } from 'react'
import { QUOTES } from '../data/quotes'

const QUOTE_INTERVAL = 15 * 60 // 15 minutes in seconds

export function useQuotes() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(QUOTE_INTERVAL)

  // Pick random quote after hydration to avoid mismatch
  useEffect(() => {
    setCurrentIndex(Math.floor(Math.random() * QUOTES.length))
  }, [])

  const getNextQuote = useCallback(() => {
    setIsTransitioning(true)

    setTimeout(() => {
      setCurrentIndex(prev => {
        let next
        do {
          next = Math.floor(Math.random() * QUOTES.length)
        } while (next === prev && QUOTES.length > 1)
        return next
      })
      setIsTransitioning(false)
    }, 500) // Match CSS transition duration
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          getNextQuote()
          return QUOTE_INTERVAL
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [getNextQuote])

  return {
    quote: QUOTES[currentIndex],
    isTransitioning,
    timeRemaining
  }
}
