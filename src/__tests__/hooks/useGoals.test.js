import { renderHook, act } from '@testing-library/react'
import { useGoals } from '../../hooks/useGoals'

describe('useGoals', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.getItem.mockReturnValue(null)
  })

  describe('initialization', () => {
    it('should initialize with empty monthly goals', () => {
      const { result } = renderHook(() => useGoals())

      expect(result.current.monthlyGoals).toEqual([])
    })

    it('should initialize with empty yearly goals', () => {
      const { result } = renderHook(() => useGoals())

      expect(result.current.yearlyGoals).toEqual([])
    })

    it('should load saved monthly goals from localStorage', () => {
      const now = new Date()
      const currentMonth = `${now.getFullYear()}-${now.getMonth() + 1}`
      const savedGoals = [
        { id: 1, text: 'Monthly Goal 1', completed: false },
        { id: 2, text: 'Monthly Goal 2', completed: true },
      ]

      localStorage.getItem.mockImplementation((key) => {
        if (key === 'monthlyGoals') {
          return JSON.stringify({ period: currentMonth, goals: savedGoals })
        }
        return null
      })

      const { result } = renderHook(() => useGoals())

      expect(result.current.monthlyGoals).toEqual(savedGoals)
    })

    it('should load saved yearly goals from localStorage', () => {
      const currentYear = new Date().getFullYear().toString()
      const savedGoals = [
        { id: 1, text: 'Yearly Goal 1', completed: false },
        { id: 2, text: 'Yearly Goal 2', completed: true },
      ]

      localStorage.getItem.mockImplementation((key) => {
        if (key === 'yearlyGoals') {
          return JSON.stringify({ period: currentYear, goals: savedGoals })
        }
        return null
      })

      const { result } = renderHook(() => useGoals())

      expect(result.current.yearlyGoals).toEqual(savedGoals)
    })

    it('should reset monthly goals if month has changed', () => {
      const oldMonth = '2023-1' // Old month
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'monthlyGoals') {
          return JSON.stringify({
            period: oldMonth,
            goals: [{ id: 1, text: 'Old Goal', completed: false }],
          })
        }
        return null
      })

      const { result } = renderHook(() => useGoals())

      expect(result.current.monthlyGoals).toEqual([])
    })

    it('should reset yearly goals if year has changed', () => {
      localStorage.getItem.mockImplementation((key) => {
        if (key === 'yearlyGoals') {
          return JSON.stringify({
            period: '2020',
            goals: [{ id: 1, text: 'Old Yearly Goal', completed: false }],
          })
        }
        return null
      })

      const { result } = renderHook(() => useGoals())

      expect(result.current.yearlyGoals).toEqual([])
    })
  })

  describe('addMonthlyGoal', () => {
    it('should add a new monthly goal', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addMonthlyGoal('New Monthly Goal')
      })

      expect(result.current.monthlyGoals).toHaveLength(1)
      expect(result.current.monthlyGoals[0].text).toBe('New Monthly Goal')
      expect(result.current.monthlyGoals[0].completed).toBe(false)
    })

    it('should not add empty monthly goal', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addMonthlyGoal('')
      })

      expect(result.current.monthlyGoals).toHaveLength(0)
    })

    it('should not add whitespace-only monthly goal', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addMonthlyGoal('   ')
      })

      expect(result.current.monthlyGoals).toHaveLength(0)
    })

    it('should trim monthly goal text', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addMonthlyGoal('  Trimmed Goal  ')
      })

      expect(result.current.monthlyGoals[0].text).toBe('Trimmed Goal')
    })

    it('should assign unique IDs to monthly goals', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addMonthlyGoal('Goal 1')
      })
      act(() => {
        result.current.addMonthlyGoal('Goal 2')
      })

      expect(result.current.monthlyGoals[0].id).not.toBe(
        result.current.monthlyGoals[1].id
      )
    })

    it('should save monthly goals to localStorage', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addMonthlyGoal('New Goal')
      })

      expect(localStorage.setItem).toHaveBeenCalled()
    })
  })

  describe('addYearlyGoal', () => {
    it('should add a new yearly goal', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addYearlyGoal('New Yearly Goal')
      })

      expect(result.current.yearlyGoals).toHaveLength(1)
      expect(result.current.yearlyGoals[0].text).toBe('New Yearly Goal')
      expect(result.current.yearlyGoals[0].completed).toBe(false)
    })

    it('should not add empty yearly goal', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addYearlyGoal('')
      })

      expect(result.current.yearlyGoals).toHaveLength(0)
    })

    it('should trim yearly goal text', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addYearlyGoal('  Yearly Goal  ')
      })

      expect(result.current.yearlyGoals[0].text).toBe('Yearly Goal')
    })
  })

  describe('toggleMonthlyGoal', () => {
    it('should toggle monthly goal completion status', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addMonthlyGoal('Test Goal')
      })

      const goalId = result.current.monthlyGoals[0].id

      act(() => {
        result.current.toggleMonthlyGoal(goalId)
      })

      expect(result.current.monthlyGoals[0].completed).toBe(true)

      act(() => {
        result.current.toggleMonthlyGoal(goalId)
      })

      expect(result.current.monthlyGoals[0].completed).toBe(false)
    })
  })

  describe('toggleYearlyGoal', () => {
    it('should toggle yearly goal completion status', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addYearlyGoal('Test Yearly Goal')
      })

      const goalId = result.current.yearlyGoals[0].id

      act(() => {
        result.current.toggleYearlyGoal(goalId)
      })

      expect(result.current.yearlyGoals[0].completed).toBe(true)

      act(() => {
        result.current.toggleYearlyGoal(goalId)
      })

      expect(result.current.yearlyGoals[0].completed).toBe(false)
    })
  })

  describe('deleteMonthlyGoal', () => {
    it('should delete a monthly goal', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addMonthlyGoal('Goal to Delete')
      })

      const goalId = result.current.monthlyGoals[0].id

      act(() => {
        result.current.deleteMonthlyGoal(goalId)
      })

      expect(result.current.monthlyGoals).toHaveLength(0)
    })
  })

  describe('deleteYearlyGoal', () => {
    it('should delete a yearly goal', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addYearlyGoal('Yearly Goal to Delete')
      })

      const goalId = result.current.yearlyGoals[0].id

      act(() => {
        result.current.deleteYearlyGoal(goalId)
      })

      expect(result.current.yearlyGoals).toHaveLength(0)
    })
  })

  describe('monthlyTimeRemaining', () => {
    it('should return days left in the month', () => {
      const { result } = renderHook(() => useGoals())

      expect(result.current.monthlyTimeRemaining).toHaveProperty('daysLeft')
      expect(result.current.monthlyTimeRemaining).toHaveProperty('label')
      expect(typeof result.current.monthlyTimeRemaining.daysLeft).toBe('number')
    })

    it('should return correct label for singular day', () => {
      const { result } = renderHook(() => useGoals())

      if (result.current.monthlyTimeRemaining.daysLeft === 1) {
        expect(result.current.monthlyTimeRemaining.label).toBe('day left')
      } else {
        expect(result.current.monthlyTimeRemaining.label).toBe('days left')
      }
    })
  })

  describe('yearlyTimeRemaining', () => {
    it('should return days left in the year', () => {
      const { result } = renderHook(() => useGoals())

      expect(result.current.yearlyTimeRemaining).toHaveProperty('daysLeft')
      expect(result.current.yearlyTimeRemaining).toHaveProperty('label')
      expect(typeof result.current.yearlyTimeRemaining.daysLeft).toBe('number')
    })
  })

  describe('monthlyStats', () => {
    it('should return correct stats for monthly goals', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addMonthlyGoal('Goal 1')
        result.current.addMonthlyGoal('Goal 2')
        result.current.addMonthlyGoal('Goal 3')
      })

      expect(result.current.monthlyStats.total).toBe(3)
      expect(result.current.monthlyStats.completed).toBe(0)

      const goalId = result.current.monthlyGoals[0].id
      act(() => {
        result.current.toggleMonthlyGoal(goalId)
      })

      expect(result.current.monthlyStats.completed).toBe(1)
    })
  })

  describe('yearlyStats', () => {
    it('should return correct stats for yearly goals', () => {
      const { result } = renderHook(() => useGoals())

      act(() => {
        result.current.addYearlyGoal('Yearly Goal 1')
        result.current.addYearlyGoal('Yearly Goal 2')
      })

      expect(result.current.yearlyStats.total).toBe(2)
      expect(result.current.yearlyStats.completed).toBe(0)

      const goalId = result.current.yearlyGoals[0].id
      act(() => {
        result.current.toggleYearlyGoal(goalId)
      })

      expect(result.current.yearlyStats.completed).toBe(1)
    })
  })
})
