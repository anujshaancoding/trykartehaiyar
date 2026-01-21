import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'habitsDashboard'
const HABITS_KEY = 'userHabits'

// Default habits for first-time users
const DEFAULT_HABITS = [
  { id: 1, icon: '💪', text: 'Workout / Movement' },
  { id: 2, icon: '🎯', text: 'Deep Work Session' },
  { id: 3, icon: '📚', text: 'Skill Learning' },
  { id: 4, icon: '📖', text: 'Read 30+ minutes' },
  { id: 5, icon: '😴', text: 'Sleep on time' },
]

function loadHabits() {
  try {
    const saved = localStorage.getItem(HABITS_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Error loading habits:', e)
  }
  return DEFAULT_HABITS
}

function saveHabits(habits) {
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
  } catch (e) {
    console.error('Error saving habits:', e)
  }
}

function loadCompletedFromStorage() {
  try {
    const today = new Date().toDateString()
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      const data = JSON.parse(saved)
      if (data.date === today) {
        return new Set(data.completed)
      }
    }
  } catch (e) {
    console.error('Error loading completed habits:', e)
  }
  return new Set()
}

function saveCompletedToStorage(completedHabits) {
  try {
    const today = new Date().toDateString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: today,
      completed: Array.from(completedHabits)
    }))
  } catch (e) {
    console.error('Error saving completed habits:', e)
  }
}

export function useHabits() {
  const [habits, setHabits] = useState(() => loadHabits())
  const [completedHabits, setCompletedHabits] = useState(() => loadCompletedFromStorage())

  // Check for day change
  useEffect(() => {
    const checkDayChange = () => {
      const today = new Date().toDateString()
      const saved = localStorage.getItem(STORAGE_KEY)

      if (saved) {
        const data = JSON.parse(saved)
        if (data.date !== today) {
          // New day, reset completed habits
          setCompletedHabits(new Set())
          localStorage.removeItem(STORAGE_KEY)
        }
      }
    }

    // Check every minute for day change
    const interval = setInterval(checkDayChange, 60000)
    return () => clearInterval(interval)
  }, [])

  const toggleHabit = useCallback((id) => {
    setCompletedHabits(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      saveCompletedToStorage(next)
      return next
    })
  }, [])

  const addHabit = useCallback((text, icon = '📌') => {
    if (!text.trim()) return

    setHabits(prev => {
      const maxId = prev.reduce((max, h) => Math.max(max, h.id), 0)
      const newHabit = { id: maxId + 1, icon, text: text.trim() }
      const updated = [...prev, newHabit]
      saveHabits(updated)
      return updated
    })
  }, [])

  const deleteHabit = useCallback((id) => {
    setHabits(prev => {
      const updated = prev.filter(h => h.id !== id)
      saveHabits(updated)
      return updated
    })
    // Also remove from completed if it was completed
    setCompletedHabits(prev => {
      const next = new Set(prev)
      next.delete(id)
      saveCompletedToStorage(next)
      return next
    })
  }, [])

  const completedCount = habits.filter(h => completedHabits.has(h.id)).length
  const totalCount = habits.length

  // Streak message
  let streakMessage
  if (totalCount === 0) {
    streakMessage = 'Add a focus'
  } else if (completedCount === 0) {
    streakMessage = 'Start now'
  } else if (completedCount < totalCount / 2) {
    streakMessage = 'Keep going'
  } else if (completedCount < totalCount) {
    streakMessage = 'Almost there!'
  } else {
    streakMessage = 'Perfect day!'
  }

  return {
    habits,
    completedHabits,
    toggleHabit,
    addHabit,
    deleteHabit,
    completedCount,
    totalCount,
    streakMessage
  }
}
