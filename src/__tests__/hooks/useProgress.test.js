import { renderHook, waitFor } from '@testing-library/react'
import { useProgress } from '../../hooks/useProgress'

describe('useProgress', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('initialization', () => {
    it('should return placeholder values before hydration', () => {
      const { result } = renderHook(() => useProgress())

      // Initial render before useEffect
      expect(result.current.daysLeftMonth).toBeDefined()
      expect(result.current.daysLeftYear).toBeDefined()
      expect(result.current.monthProgress).toBeDefined()
      expect(result.current.yearProgress).toBeDefined()
    })

    it('should calculate progress after hydration', async () => {
      const { result } = renderHook(() => useProgress())

      // Wait for useEffect to run
      await waitFor(() => {
        expect(result.current.monthProgress).toBeGreaterThan(0)
      })
    })
  })

  describe('month calculations', () => {
    it('should return valid daysLeftMonth', async () => {
      const { result } = renderHook(() => useProgress())

      await waitFor(() => {
        expect(result.current.daysLeftMonth).toBeGreaterThanOrEqual(0)
        expect(result.current.daysLeftMonth).toBeLessThanOrEqual(31)
      })
    })

    it('should return valid monthProgress percentage', async () => {
      const { result } = renderHook(() => useProgress())

      await waitFor(() => {
        expect(result.current.monthProgress).toBeGreaterThanOrEqual(0)
        expect(result.current.monthProgress).toBeLessThanOrEqual(100)
      })
    })

    it('should have valid daysInMonth', async () => {
      const { result } = renderHook(() => useProgress())

      await waitFor(() => {
        expect(result.current.daysInMonth).toBeGreaterThanOrEqual(28)
        expect(result.current.daysInMonth).toBeLessThanOrEqual(31)
      })
    })

    it('should return monthSubtext with stats', async () => {
      const { result } = renderHook(() => useProgress())

      await waitFor(() => {
        expect(result.current.monthSubtext).toContain('of')
        expect(result.current.monthSubtext).toContain('days used')
      })
    })

    it('should return monthHarshText based on days left', async () => {
      const { result } = renderHook(() => useProgress())

      await waitFor(() => {
        expect(result.current.monthHarshText.length).toBeGreaterThan(0)
      })
    })
  })

  describe('year calculations', () => {
    it('should return valid daysLeftYear', async () => {
      const { result } = renderHook(() => useProgress())

      await waitFor(() => {
        expect(result.current.daysLeftYear).toBeGreaterThanOrEqual(0)
        expect(result.current.daysLeftYear).toBeLessThanOrEqual(366)
      })
    })

    it('should return valid yearProgress percentage', async () => {
      const { result } = renderHook(() => useProgress())

      await waitFor(() => {
        expect(result.current.yearProgress).toBeGreaterThanOrEqual(0)
        expect(result.current.yearProgress).toBeLessThanOrEqual(100)
      })
    })

    it('should return current year', async () => {
      const { result } = renderHook(() => useProgress())
      const expectedYear = new Date().getFullYear()

      await waitFor(() => {
        expect(result.current.currentYear).toBe(expectedYear)
      })
    })

    it('should return yearSubtext with stats', async () => {
      const { result } = renderHook(() => useProgress())

      await waitFor(() => {
        expect(result.current.yearSubtext).toContain('Day')
        expect(result.current.yearSubtext).toContain('of')
      })
    })

    it('should return yearHarshText based on days left', async () => {
      const { result } = renderHook(() => useProgress())

      await waitFor(() => {
        expect(result.current.yearHarshText.length).toBeGreaterThan(0)
      })
    })
  })

  describe('yearMessage', () => {
    it('should return a motivational year message', async () => {
      const { result } = renderHook(() => useProgress())

      await waitFor(() => {
        expect(result.current.yearMessage.length).toBeGreaterThan(0)
      })
    })

    it('should return message based on year progress', async () => {
      const { result } = renderHook(() => useProgress())

      await waitFor(() => {
        const progress = result.current.yearProgress
        const message = result.current.yearMessage

        if (progress < 25) {
          expect(message).toContain('young')
        } else if (progress < 50) {
          expect(message).toContain('half')
        } else if (progress < 75) {
          expect(message).toContain('More than half')
        } else {
          expect(message).toContain('closing')
        }
      })
    })
  })

  describe('harsh messages', () => {
    it('should return harsh month message based on percentage left', async () => {
      const { result } = renderHook(() => useProgress())

      await waitFor(() => {
        const message = result.current.monthHarshText
        expect(typeof message).toBe('string')
        expect(message.length).toBeGreaterThan(0)
      })
    })

    it('should return harsh year message based on percentage left', async () => {
      const { result } = renderHook(() => useProgress())

      await waitFor(() => {
        const message = result.current.yearHarshText
        expect(typeof message).toBe('string')
        expect(message.length).toBeGreaterThan(0)
      })
    })
  })
})
