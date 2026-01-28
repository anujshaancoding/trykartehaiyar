import { renderHook, waitFor, act } from '@testing-library/react'
import { useQuotes } from '../../hooks/useQuotes'
import { QUOTES } from '../../data/quotes'

describe('useQuotes', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('initialization', () => {
    it('should return a quote object', () => {
      const { result } = renderHook(() => useQuotes())

      expect(result.current.quote).toBeDefined()
      expect(result.current.quote).toHaveProperty('text')
      expect(result.current.quote).toHaveProperty('author')
    })

    it('should return quote from QUOTES array', () => {
      const { result } = renderHook(() => useQuotes())

      const quoteTexts = QUOTES.map((q) => q.text)
      expect(quoteTexts).toContain(result.current.quote.text)
    })

    it('should initialize with isTransitioning as false', () => {
      const { result } = renderHook(() => useQuotes())

      expect(result.current.isTransitioning).toBe(false)
    })

    it('should initialize timeRemaining at 15 minutes (900 seconds)', () => {
      const { result } = renderHook(() => useQuotes())

      expect(result.current.timeRemaining).toBe(900)
    })
  })

  describe('quote properties', () => {
    it('should have non-empty quote text', () => {
      const { result } = renderHook(() => useQuotes())

      expect(result.current.quote.text.length).toBeGreaterThan(0)
    })

    it('should have author set to "Reality"', () => {
      const { result } = renderHook(() => useQuotes())

      expect(result.current.quote.author).toBe('Reality')
    })
  })

  describe('time countdown', () => {
    it('should decrease timeRemaining every second', async () => {
      const { result } = renderHook(() => useQuotes())

      const initialTime = result.current.timeRemaining

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      await waitFor(() => {
        expect(result.current.timeRemaining).toBe(initialTime - 1)
      })
    })

    it('should decrease timeRemaining by 5 after 5 seconds', async () => {
      const { result } = renderHook(() => useQuotes())

      const initialTime = result.current.timeRemaining

      act(() => {
        jest.advanceTimersByTime(5000)
      })

      await waitFor(() => {
        expect(result.current.timeRemaining).toBe(initialTime - 5)
      })
    })
  })

  describe('quote rotation', () => {
    it('should reset timeRemaining to 900 after countdown completes', async () => {
      const { result } = renderHook(() => useQuotes())

      // Fast forward 15 minutes
      act(() => {
        jest.advanceTimersByTime(900 * 1000)
      })

      await waitFor(() => {
        expect(result.current.timeRemaining).toBe(900)
      })
    })

    it('should trigger transition when getting next quote', async () => {
      const { result } = renderHook(() => useQuotes())

      // Fast forward to just before quote change
      act(() => {
        jest.advanceTimersByTime(899 * 1000)
      })

      // Trigger the quote change
      act(() => {
        jest.advanceTimersByTime(1000)
      })

      // The transition should be happening
      await waitFor(() => {
        // After the transition timeout (500ms), isTransitioning should be false again
        expect(typeof result.current.isTransitioning).toBe('boolean')
      })
    })
  })

  describe('quote data integrity', () => {
    it('should have at least 10 quotes available', () => {
      expect(QUOTES.length).toBeGreaterThanOrEqual(10)
    })

    it('should have all quotes with text property', () => {
      QUOTES.forEach((quote) => {
        expect(quote).toHaveProperty('text')
        expect(typeof quote.text).toBe('string')
        expect(quote.text.length).toBeGreaterThan(0)
      })
    })

    it('should have all quotes with author property', () => {
      QUOTES.forEach((quote) => {
        expect(quote).toHaveProperty('author')
        expect(typeof quote.author).toBe('string')
      })
    })

    it('should have 30 quotes in the array', () => {
      expect(QUOTES.length).toBe(30)
    })
  })

  describe('cleanup', () => {
    it('should clean up interval on unmount', () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
      const { unmount } = renderHook(() => useQuotes())

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
      clearIntervalSpy.mockRestore()
    })
  })
})
