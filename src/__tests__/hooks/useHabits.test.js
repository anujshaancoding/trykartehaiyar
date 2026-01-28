import { renderHook, act } from '@testing-library/react'
import { useHabits } from '../../hooks/useHabits'

// Mock the supabase module
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: jest.fn(() => Promise.resolve({ data: null, error: null })),
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
  },
}))

describe('useHabits', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.getItem.mockReturnValue(null)
  })

  describe('initialization', () => {
    it('should return default habits when no saved data exists', () => {
      const { result } = renderHook(() => useHabits())

      expect(result.current.habits).toHaveLength(5)
      expect(result.current.habits[0]).toEqual({
        id: 1,
        icon: '💪',
        text: 'Workout / Movement',
      })
    })

    it('should initialize with empty completed habits', () => {
      const { result } = renderHook(() => useHabits())

      expect(result.current.completedHabits.size).toBe(0)
      expect(result.current.completedCount).toBe(0)
    })

    it('should have correct total count', () => {
      const { result } = renderHook(() => useHabits())

      expect(result.current.totalCount).toBe(5)
    })

    it('should load saved habits from localStorage', () => {
      const savedHabits = [
        { id: 1, icon: '🎯', text: 'Custom Habit 1' },
        { id: 2, icon: '📚', text: 'Custom Habit 2' },
      ]
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'userHabits') {
          return JSON.stringify(savedHabits)
        }
        return null
      })

      const { result } = renderHook(() => useHabits())

      // After useEffect runs
      expect(result.current.habits).toEqual(savedHabits)
    })

    it('should load completed habits for today from localStorage', () => {
      const today = new Date().toDateString()
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'habitsDashboard') {
          return JSON.stringify({ date: today, completed: [1, 2] })
        }
        return null
      })

      const { result } = renderHook(() => useHabits())

      expect(result.current.completedHabits.has(1)).toBe(true)
      expect(result.current.completedHabits.has(2)).toBe(true)
    })

    it('should reset completed habits if date is different', () => {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'habitsDashboard') {
          return JSON.stringify({ date: yesterday, completed: [1, 2] })
        }
        return null
      })

      const { result } = renderHook(() => useHabits())

      expect(result.current.completedHabits.size).toBe(0)
    })
  })

  describe('toggleHabit', () => {
    it('should toggle a habit to completed', () => {
      const { result } = renderHook(() => useHabits())

      act(() => {
        result.current.toggleHabit(1)
      })

      expect(result.current.completedHabits.has(1)).toBe(true)
      expect(result.current.completedCount).toBe(1)
    })

    it('should toggle a completed habit back to incomplete', () => {
      const { result } = renderHook(() => useHabits())

      act(() => {
        result.current.toggleHabit(1)
      })
      act(() => {
        result.current.toggleHabit(1)
      })

      expect(result.current.completedHabits.has(1)).toBe(false)
    })

    it('should save completed habits to localStorage', () => {
      const { result } = renderHook(() => useHabits())

      act(() => {
        result.current.toggleHabit(1)
      })

      expect(localStorage.setItem).toHaveBeenCalled()
    })
  })

  describe('addHabit', () => {
    it('should add a new habit', () => {
      const { result } = renderHook(() => useHabits())
      const initialCount = result.current.habits.length

      act(() => {
        result.current.addHabit('New Test Habit')
      })

      expect(result.current.habits.length).toBe(initialCount + 1)
      expect(result.current.habits[result.current.habits.length - 1].text).toBe(
        'New Test Habit'
      )
    })

    it('should use default icon if not provided', () => {
      const { result } = renderHook(() => useHabits())

      act(() => {
        result.current.addHabit('New Habit')
      })

      const newHabit = result.current.habits[result.current.habits.length - 1]
      expect(newHabit.icon).toBe('📌')
    })

    it('should use custom icon when provided', () => {
      const { result } = renderHook(() => useHabits())

      act(() => {
        result.current.addHabit('Custom Icon Habit', '🚀')
      })

      const newHabit = result.current.habits[result.current.habits.length - 1]
      expect(newHabit.icon).toBe('🚀')
    })

    it('should not add empty habit', () => {
      const { result } = renderHook(() => useHabits())
      const initialCount = result.current.habits.length

      act(() => {
        result.current.addHabit('')
      })

      expect(result.current.habits.length).toBe(initialCount)
    })

    it('should not add whitespace-only habit', () => {
      const { result } = renderHook(() => useHabits())
      const initialCount = result.current.habits.length

      act(() => {
        result.current.addHabit('   ')
      })

      expect(result.current.habits.length).toBe(initialCount)
    })

    it('should trim habit text', () => {
      const { result } = renderHook(() => useHabits())

      act(() => {
        result.current.addHabit('  Trimmed Habit  ')
      })

      const newHabit = result.current.habits[result.current.habits.length - 1]
      expect(newHabit.text).toBe('Trimmed Habit')
    })

    it('should assign unique IDs to new habits', () => {
      const { result } = renderHook(() => useHabits())

      act(() => {
        result.current.addHabit('Habit 1')
      })
      act(() => {
        result.current.addHabit('Habit 2')
      })

      const habits = result.current.habits
      const lastTwo = habits.slice(-2)
      expect(lastTwo[0].id).not.toBe(lastTwo[1].id)
    })
  })

  describe('deleteHabit', () => {
    it('should delete a habit', () => {
      const { result } = renderHook(() => useHabits())
      const initialCount = result.current.habits.length

      act(() => {
        result.current.deleteHabit(1)
      })

      expect(result.current.habits.length).toBe(initialCount - 1)
      expect(result.current.habits.find((h) => h.id === 1)).toBeUndefined()
    })

    it('should remove deleted habit from completed habits', () => {
      const { result } = renderHook(() => useHabits())

      act(() => {
        result.current.toggleHabit(1)
      })
      expect(result.current.completedHabits.has(1)).toBe(true)

      act(() => {
        result.current.deleteHabit(1)
      })

      expect(result.current.completedHabits.has(1)).toBe(false)
    })

    it('should update totalCount after deletion', () => {
      const { result } = renderHook(() => useHabits())
      const initialTotal = result.current.totalCount

      act(() => {
        result.current.deleteHabit(1)
      })

      expect(result.current.totalCount).toBe(initialTotal - 1)
    })
  })

  describe('streakMessage', () => {
    it('should show "Add a focus" when no habits exist', () => {
      const { result } = renderHook(() => useHabits())

      // Delete all habits
      act(() => {
        result.current.habits.forEach((h) => result.current.deleteHabit(h.id))
      })

      expect(result.current.streakMessage).toBe('Add a focus')
    })

    it('should show "Start now" when no habits are completed', () => {
      const { result } = renderHook(() => useHabits())

      expect(result.current.streakMessage).toBe('Start now')
    })

    it('should show "Keep going" when less than half completed', () => {
      const { result } = renderHook(() => useHabits())

      act(() => {
        result.current.toggleHabit(1) // 1 of 5 completed
      })

      expect(result.current.streakMessage).toBe('Keep going')
    })

    it('should show "Almost there!" when more than half but not all completed', () => {
      const { result } = renderHook(() => useHabits())

      act(() => {
        result.current.toggleHabit(1)
        result.current.toggleHabit(2)
        result.current.toggleHabit(3)
        result.current.toggleHabit(4) // 4 of 5 completed
      })

      expect(result.current.streakMessage).toBe('Almost there!')
    })

    it('should show "Perfect day!" when all habits completed', () => {
      const { result } = renderHook(() => useHabits())

      act(() => {
        result.current.habits.forEach((h) => result.current.toggleHabit(h.id))
      })

      expect(result.current.streakMessage).toBe('Perfect day!')
    })
  })
})
