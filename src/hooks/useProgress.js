import { useState, useEffect, useMemo } from 'react'

export function useProgress() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const calculations = useMemo(() => {
    const year = now.getFullYear()
    const month = now.getMonth()

    // Days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const currentDay = now.getDate()
    const daysLeftMonth = daysInMonth - currentDay
    const monthProgress = (currentDay / daysInMonth) * 100

    // Days in year
    const startOfYear = new Date(year, 0, 1)
    const endOfYear = new Date(year, 11, 31)
    const totalDaysInYear = Math.ceil((endOfYear - startOfYear) / (1000 * 60 * 60 * 24)) + 1
    const dayOfYear = Math.ceil((now - startOfYear) / (1000 * 60 * 60 * 24)) + 1
    const daysLeftYear = totalDaysInYear - dayOfYear
    const yearProgress = (dayOfYear / totalDaysInYear) * 100

    // Month subtext
    const monthSubtext = `${currentDay} of ${daysInMonth} days completed (${Math.round(monthProgress)}%)`

    // Year subtext
    const yearSubtext = `Day ${dayOfYear} of ${totalDaysInYear} (${Math.round(yearProgress)}% complete)`

    // Dynamic year message
    let yearMessage
    if (yearProgress < 25) {
      yearMessage = "The year is young. Set the tone now—your future self will thank you."
    } else if (yearProgress < 50) {
      yearMessage = "Nearly half the year gone. Are you where you wanted to be? There's still time."
    } else if (yearProgress < 75) {
      yearMessage = "More than half the year is behind you. Make the remaining months extraordinary."
    } else {
      yearMessage = "The year is closing. What you do now defines how you'll remember it."
    }

    return {
      daysLeftMonth,
      daysLeftYear,
      monthProgress,
      yearProgress,
      monthSubtext,
      yearSubtext,
      currentYear: year,
      yearMessage
    }
  }, [now])

  return calculations
}
