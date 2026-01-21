import { useState, useEffect } from 'react'

export function useTime() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // 12-hour format
  const hour24 = time.getHours()
  const hour12 = hour24 % 12 || 12
  const hours = String(hour12).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const seconds = String(time.getSeconds()).padStart(2, '0')
  const period = hour24 >= 12 ? 'PM' : 'AM'

  const dateString = time.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return {
    time,
    hours,
    minutes,
    seconds,
    period,
    dateString
  }
}
