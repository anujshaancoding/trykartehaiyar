import { useState, useEffect, useMemo } from 'react'

// Harsh month messages based on how much time is left
const getMonthHarshMessage = (daysLeft, daysInMonth) => {
  const percentLeft = (daysLeft / daysInMonth) * 100
  if (percentLeft <= 10) {
    return `Only ${daysLeft} days. This month is almost over.`
  } else if (percentLeft <= 30) {
    return `Only ${daysLeft} days left to change this month.`
  } else if (percentLeft <= 50) {
    return `Most people waste these last ${daysLeft} days.`
  } else {
    return `${daysLeft} days. What will you do with them?`
  }
}

// Harsh year messages based on how much time is left
const getYearHarshMessage = (daysLeft, totalDays) => {
  const percentLeft = (daysLeft / totalDays) * 100
  if (percentLeft <= 10) {
    return `Only ${daysLeft} days left. The year is almost decided.`
  } else if (percentLeft <= 25) {
    return `${daysLeft} days. Most people give up here.`
  } else if (percentLeft <= 50) {
    return `${daysLeft} days left. Still time — barely.`
  } else {
    return `${daysLeft} days remain. Use them or lose them.`
  }
}

export function useProgress() {
  const [now, setNow] = useState(null)

  useEffect(() => {
    // Set initial time after hydration to avoid mismatch
    setNow(new Date())

    const interval = setInterval(() => {
      setNow(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const calculations = useMemo(() => {
    // Return placeholder values before hydration
    if (!now) {
      return {
        daysLeftMonth: 0,
        daysLeftYear: 0,
        monthProgress: 0,
        yearProgress: 0,
        monthSubtext: '',
        monthHarshText: '',
        yearSubtext: '',
        yearHarshText: '',
        currentYear: new Date().getFullYear(),
        yearMessage: '',
        daysInMonth: 30
      }
    }

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

    // Month subtext with stats and harsh message
    const monthStatText = `${currentDay} of ${daysInMonth} days used · ${Math.round(monthProgress)}% gone`
    const monthHarshText = getMonthHarshMessage(daysLeftMonth, daysInMonth)

    // Year subtext with stats and harsh message
    const yearStatText = `Day ${dayOfYear} of ${totalDaysInYear} · The clock is running`
    const yearHarshText = getYearHarshMessage(daysLeftYear, totalDaysInYear)

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
      monthSubtext: monthStatText,
      monthHarshText,
      yearSubtext: yearStatText,
      yearHarshText,
      currentYear: year,
      yearMessage,
      daysInMonth
    }
  }, [now])

  return calculations
}
