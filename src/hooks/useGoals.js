import { useState, useEffect, useCallback, useMemo } from 'react'

const MONTHLY_GOALS_KEY = 'monthlyGoals'
const YEARLY_GOALS_KEY = 'yearlyGoals'

function getCurrentMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}`
}

function getCurrentYear() {
  return new Date().getFullYear().toString()
}

function loadGoals(key, periodGetter) {
  try {
    const saved = localStorage.getItem(key)
    if (saved) {
      const data = JSON.parse(saved)
      if (data.period === periodGetter()) {
        return data.goals
      }
    }
  } catch (e) {
    console.error(`Error loading goals from ${key}:`, e)
  }
  return []
}

function saveGoals(key, goals, period) {
  try {
    localStorage.setItem(key, JSON.stringify({ period, goals }))
  } catch (e) {
    console.error(`Error saving goals to ${key}:`, e)
  }
}

function getTimeRemaining(type) {
  const now = new Date()
  const year = now.getFullYear()

  if (type === 'monthly') {
    const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate()
    const daysLeft = daysInMonth - now.getDate()
    return { daysLeft, label: daysLeft === 1 ? 'day left' : 'days left' }
  } else {
    const startOfYear = new Date(year, 0, 1)
    const endOfYear = new Date(year, 11, 31)
    const totalDaysInYear = Math.ceil((endOfYear - startOfYear) / (1000 * 60 * 60 * 24)) + 1
    const dayOfYear = Math.ceil((now - startOfYear) / (1000 * 60 * 60 * 24)) + 1
    const daysLeft = totalDaysInYear - dayOfYear
    return { daysLeft, label: daysLeft === 1 ? 'day left' : 'days left' }
  }
}

export function useGoals() {
  const [monthlyGoals, setMonthlyGoals] = useState(() =>
    loadGoals(MONTHLY_GOALS_KEY, getCurrentMonth)
  )
  const [yearlyGoals, setYearlyGoals] = useState(() =>
    loadGoals(YEARLY_GOALS_KEY, getCurrentYear)
  )

  // Check for period change (month/year rollover)
  useEffect(() => {
    const checkPeriodChange = () => {
      const currentMonth = getCurrentMonth()
      const currentYear = getCurrentYear()

      try {
        const savedMonthly = localStorage.getItem(MONTHLY_GOALS_KEY)
        if (savedMonthly) {
          const data = JSON.parse(savedMonthly)
          if (data.period !== currentMonth) {
            setMonthlyGoals([])
            localStorage.removeItem(MONTHLY_GOALS_KEY)
          }
        }

        const savedYearly = localStorage.getItem(YEARLY_GOALS_KEY)
        if (savedYearly) {
          const data = JSON.parse(savedYearly)
          if (data.period !== currentYear) {
            setYearlyGoals([])
            localStorage.removeItem(YEARLY_GOALS_KEY)
          }
        }
      } catch (e) {
        console.error('Error checking period change:', e)
      }
    }

    // Check every minute
    const interval = setInterval(checkPeriodChange, 60000)
    return () => clearInterval(interval)
  }, [])

  const addMonthlyGoal = useCallback((text) => {
    if (!text.trim()) return

    setMonthlyGoals(prev => {
      const maxId = prev.reduce((max, g) => Math.max(max, g.id), 0)
      const newGoal = { id: maxId + 1, text: text.trim(), completed: false }
      const updated = [...prev, newGoal]
      saveGoals(MONTHLY_GOALS_KEY, updated, getCurrentMonth())
      return updated
    })
  }, [])

  const addYearlyGoal = useCallback((text) => {
    if (!text.trim()) return

    setYearlyGoals(prev => {
      const maxId = prev.reduce((max, g) => Math.max(max, g.id), 0)
      const newGoal = { id: maxId + 1, text: text.trim(), completed: false }
      const updated = [...prev, newGoal]
      saveGoals(YEARLY_GOALS_KEY, updated, getCurrentYear())
      return updated
    })
  }, [])

  const toggleMonthlyGoal = useCallback((id) => {
    setMonthlyGoals(prev => {
      const updated = prev.map(g =>
        g.id === id ? { ...g, completed: !g.completed } : g
      )
      saveGoals(MONTHLY_GOALS_KEY, updated, getCurrentMonth())
      return updated
    })
  }, [])

  const toggleYearlyGoal = useCallback((id) => {
    setYearlyGoals(prev => {
      const updated = prev.map(g =>
        g.id === id ? { ...g, completed: !g.completed } : g
      )
      saveGoals(YEARLY_GOALS_KEY, updated, getCurrentYear())
      return updated
    })
  }, [])

  const deleteMonthlyGoal = useCallback((id) => {
    setMonthlyGoals(prev => {
      const updated = prev.filter(g => g.id !== id)
      saveGoals(MONTHLY_GOALS_KEY, updated, getCurrentMonth())
      return updated
    })
  }, [])

  const deleteYearlyGoal = useCallback((id) => {
    setYearlyGoals(prev => {
      const updated = prev.filter(g => g.id !== id)
      saveGoals(YEARLY_GOALS_KEY, updated, getCurrentYear())
      return updated
    })
  }, [])

  const monthlyTimeRemaining = useMemo(() => getTimeRemaining('monthly'), [])
  const yearlyTimeRemaining = useMemo(() => getTimeRemaining('yearly'), [])

  const monthlyStats = useMemo(() => {
    const completed = monthlyGoals.filter(g => g.completed).length
    const total = monthlyGoals.length
    return { completed, total }
  }, [monthlyGoals])

  const yearlyStats = useMemo(() => {
    const completed = yearlyGoals.filter(g => g.completed).length
    const total = yearlyGoals.length
    return { completed, total }
  }, [yearlyGoals])

  return {
    monthlyGoals,
    yearlyGoals,
    addMonthlyGoal,
    addYearlyGoal,
    toggleMonthlyGoal,
    toggleYearlyGoal,
    deleteMonthlyGoal,
    deleteYearlyGoal,
    monthlyTimeRemaining,
    yearlyTimeRemaining,
    monthlyStats,
    yearlyStats
  }
}
