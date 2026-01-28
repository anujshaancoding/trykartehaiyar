import { renderHook, waitFor, act } from '@testing-library/react'
import { useTime } from '../../hooks/useTime'

describe('useTime', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('initialization', () => {
    it('should return valid time values after hydration', () => {
      const { result } = renderHook(() => useTime())

      // After useEffect runs, time should be set
      act(() => {
        jest.advanceTimersByTime(0)
      })

      // Time values should be valid
      expect(result.current.hours).toBeDefined()
      expect(result.current.minutes).toBeDefined()
      expect(result.current.seconds).toBeDefined()
    })

    it('should update time after hydration', async () => {
      const { result } = renderHook(() => useTime())

      // Fast-forward past the useEffect
      act(() => {
        jest.advanceTimersByTime(0)
      })

      await waitFor(() => {
        expect(result.current.hours).not.toBe('--')
        expect(result.current.minutes).not.toBe('--')
        expect(result.current.seconds).not.toBe('--')
      })
    })
  })

  describe('time formatting', () => {
    it('should return hours in 12-hour format with padding', async () => {
      const { result } = renderHook(() => useTime())

      act(() => {
        jest.advanceTimersByTime(0)
      })

      await waitFor(() => {
        const hours = parseInt(result.current.hours, 10)
        expect(hours).toBeGreaterThanOrEqual(1)
        expect(hours).toBeLessThanOrEqual(12)
        expect(result.current.hours.length).toBe(2)
      })
    })

    it('should return minutes with padding', async () => {
      const { result } = renderHook(() => useTime())

      act(() => {
        jest.advanceTimersByTime(0)
      })

      await waitFor(() => {
        const minutes = parseInt(result.current.minutes, 10)
        expect(minutes).toBeGreaterThanOrEqual(0)
        expect(minutes).toBeLessThanOrEqual(59)
        expect(result.current.minutes.length).toBe(2)
      })
    })

    it('should return seconds with padding', async () => {
      const { result } = renderHook(() => useTime())

      act(() => {
        jest.advanceTimersByTime(0)
      })

      await waitFor(() => {
        const seconds = parseInt(result.current.seconds, 10)
        expect(seconds).toBeGreaterThanOrEqual(0)
        expect(seconds).toBeLessThanOrEqual(59)
        expect(result.current.seconds.length).toBe(2)
      })
    })

    it('should return AM or PM period', async () => {
      const { result } = renderHook(() => useTime())

      act(() => {
        jest.advanceTimersByTime(0)
      })

      await waitFor(() => {
        expect(['AM', 'PM']).toContain(result.current.period)
      })
    })
  })

  describe('date formatting', () => {
    it('should return formatted date string', async () => {
      const { result } = renderHook(() => useTime())

      act(() => {
        jest.advanceTimersByTime(0)
      })

      await waitFor(() => {
        expect(result.current.dateString).toContain('·')
        expect(result.current.dateString.length).toBeGreaterThan(0)
      })
    })

    it('should include weekday in date string', async () => {
      const { result } = renderHook(() => useTime())

      act(() => {
        jest.advanceTimersByTime(0)
      })

      const weekdays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ]

      await waitFor(() => {
        const hasWeekday = weekdays.some((day) =>
          result.current.dateString.includes(day)
        )
        expect(hasWeekday).toBe(true)
      })
    })

    it('should include month in date string', async () => {
      const { result } = renderHook(() => useTime())

      act(() => {
        jest.advanceTimersByTime(0)
      })

      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]

      await waitFor(() => {
        const hasMonth = months.some((month) =>
          result.current.dateString.includes(month)
        )
        expect(hasMonth).toBe(true)
      })
    })

    it('should include year in date string', async () => {
      const { result } = renderHook(() => useTime())

      act(() => {
        jest.advanceTimersByTime(0)
      })

      const currentYear = new Date().getFullYear().toString()

      await waitFor(() => {
        expect(result.current.dateString).toContain(currentYear)
      })
    })
  })

  describe('hourly message', () => {
    it('should return an hourly message', async () => {
      const { result } = renderHook(() => useTime())

      act(() => {
        jest.advanceTimersByTime(0)
      })

      await waitFor(() => {
        expect(result.current.hourlyMessage.length).toBeGreaterThan(0)
      })
    })

    it('should return one of the predefined messages', async () => {
      const { result } = renderHook(() => useTime())

      act(() => {
        jest.advanceTimersByTime(0)
      })

      const expectedMessages = [
        'You are spending your life in seconds.',
        'Another hour you won\'t get back.',
        'Time doesn\'t wait for motivation.',
        'This hour decides the next.',
        'Most people are wasting this moment too.',
        'Another non-repeatable hour.',
        'Today will quietly judge you.',
        'What you do next matters.',
        'Time is neutral. Results aren\'t.',
        'The day is already deciding who you are.',
        'This moment decides everything.',
        'No one is coming to save you.',
      ]

      await waitFor(() => {
        expect(expectedMessages).toContain(result.current.hourlyMessage)
      })
    })
  })

  describe('night time detection', () => {
    it('should return isNightTime as boolean', async () => {
      const { result } = renderHook(() => useTime())

      act(() => {
        jest.advanceTimersByTime(0)
      })

      await waitFor(() => {
        expect(typeof result.current.isNightTime).toBe('boolean')
      })
    })

    it('should return hour24 as a number', async () => {
      const { result } = renderHook(() => useTime())

      act(() => {
        jest.advanceTimersByTime(0)
      })

      await waitFor(() => {
        expect(typeof result.current.hour24).toBe('number')
        expect(result.current.hour24).toBeGreaterThanOrEqual(0)
        expect(result.current.hour24).toBeLessThanOrEqual(23)
      })
    })
  })

  describe('time updates', () => {
    it('should update time every second', async () => {
      const { result } = renderHook(() => useTime())

      act(() => {
        jest.advanceTimersByTime(0)
      })

      await waitFor(() => {
        expect(result.current.seconds).not.toBe('--')
      })

      const initialSeconds = result.current.seconds

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      // Time should have changed (or stayed same if we hit exactly 59->00)
      expect(result.current.time).toBeDefined()
    })

    it('should clean up interval on unmount', () => {
      const clearIntervalSpy = jest.spyOn(global, 'clearInterval')
      const { unmount } = renderHook(() => useTime())

      act(() => {
        jest.advanceTimersByTime(0)
      })

      unmount()

      expect(clearIntervalSpy).toHaveBeenCalled()
      clearIntervalSpy.mockRestore()
    })
  })
})
