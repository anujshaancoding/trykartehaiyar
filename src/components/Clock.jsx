"use client"

import { useTime } from '../hooks/useTime'

function Clock() {
  const { hours, minutes, seconds, period, dateString, hourlyMessage } = useTime()

  return (
    <section className="time-section" aria-label="Current time and date">
      <div className="clock" aria-live="polite">
        <span className="clock-digit">{hours}</span>
        <span className="clock-separator">:</span>
        <span className="clock-digit">{minutes}</span>
        <span className="clock-separator">:</span>
        <span className="clock-digit">{seconds}</span>
        <span className="clock-period">{period}</span>
      </div>
      <div className="date-display">{dateString}</div>
      <p className="hourly-truth">{hourlyMessage}</p>
    </section>
  )
}

export default Clock
