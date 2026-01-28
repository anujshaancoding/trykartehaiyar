import { useState, useEffect, useMemo } from 'react'

// Harsh hourly rotating messages - one per hour for maximum impact
const HOURLY_MESSAGES = [
  "You are spending your life in seconds.",        // 12 AM / 12 PM
  "Another hour you won't get back.",              // 1 AM / 1 PM
  "Time doesn't wait for motivation.",             // 2 AM / 2 PM
  "This hour decides the next.",                   // 3 AM / 3 PM
  "Most people are wasting this moment too.",      // 4 AM / 4 PM
  "Another non-repeatable hour.",                  // 5 AM / 5 PM
  "Today will quietly judge you.",                 // 6 AM / 6 PM
  "What you do next matters.",                     // 7 AM / 7 PM
  "Time is neutral. Results aren't.",              // 8 AM / 8 PM
  "The day is already deciding who you are.",      // 9 AM / 9 PM
  "This moment decides everything.",               // 10 AM / 10 PM
  "No one is coming to save you."                  // 11 AM / 11 PM
]

export function useTime() {
  const [time, setTime] = useState(null)

  useEffect(() => {
    // Set initial time after hydration to avoid mismatch
    setTime(new Date())

    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Return placeholder values before hydration
  if (!time) {
    return {
      time: null,
      hours: '--',
      minutes: '--',
      seconds: '--',
      period: '',
      dateString: '',
      hourlyMessage: '',
      isNightTime: false,
      hour24: 0
    }
  }

  // 12-hour format
  const hour24 = time.getHours()
  const hour12 = hour24 % 12 || 12
  const hours = String(hour12).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const seconds = String(time.getSeconds()).padStart(2, '0')
  const period = hour24 >= 12 ? 'PM' : 'AM'

  // Format: "Wednesday · January 21, 2026"
  const weekday = time.toLocaleDateString('en-US', { weekday: 'long' })
  const month = time.toLocaleDateString('en-US', { month: 'long' })
  const day = time.getDate()
  const year = time.getFullYear()
  const dateString = `${weekday} · ${month} ${day}, ${year}`

  // Hourly rotating message - one harsh truth per hour
  const hourlyMessageIndex = hour12 % HOURLY_MESSAGES.length
  const hourlyMessage = HOURLY_MESSAGES[hourlyMessageIndex]

  // Night time detection (after 9 PM)
  const isNightTime = hour24 >= 21

  return {
    time,
    hours,
    minutes,
    seconds,
    period,
    dateString,
    hourlyMessage,
    isNightTime,
    hour24
  }
}
