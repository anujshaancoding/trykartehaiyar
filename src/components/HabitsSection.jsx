import { useState, useEffect } from 'react'
import { useHabits } from '../hooks/useHabits'
import HabitItem from './HabitItem'

const motivationalMessages = [
  "You can still make it!",
  "You can still seize the day!",
  "You can still conquer today!",
  "There's still time to shine!",
  "Make every moment count!",
  "You've got this!",
  "Keep pushing forward!",
  "Finish strong today!",
  "Your goals are within reach!",
  "Don't stop now!",
]

function getTimeRemaining() {
  const now = new Date()
  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)
  const diffMs = endOfDay - now
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffHours >= 1) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`
  }
  return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`
}

function HabitsSection() {
  const { habits, completedHabits, toggleHabit, addHabit, deleteHabit, completedCount, totalCount, streakMessage } = useHabits()
  const [newHabitText, setNewHabitText] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [motivationalMessage, setMotivationalMessage] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('')

  useEffect(() => {
    // Pick a random message on mount
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length)
    setMotivationalMessage(motivationalMessages[randomIndex])
    setTimeRemaining(getTimeRemaining())

    // Update time remaining every minute
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const handleAddHabit = (e) => {
    e.preventDefault()
    if (newHabitText.trim()) {
      addHabit(newHabitText)
      setNewHabitText('')
      setIsAdding(false)
    }
  }

  return (
    <section className="habits-section" aria-label="Daily habits tracker">
      <div className="habits-header">
        <h2 className="section-title">Daily Focus</h2>
        {!isAdding && (
          <button
            className="add-habit-btn"
            onClick={() => setIsAdding(true)}
            aria-label="Add new focus"
          >
            +
          </button>
        )}
      </div>

      {totalCount > 0 && completedCount < totalCount && (
        <p className="motivation-message">
          {timeRemaining} left today. {motivationalMessage}
        </p>
      )}

      {isAdding && (
        <form className="add-habit-form" onSubmit={handleAddHabit}>
          <input
            type="text"
            value={newHabitText}
            onChange={(e) => setNewHabitText(e.target.value)}
            placeholder="Enter new focus..."
            className="add-habit-input"
            autoFocus
          />
          <div className="add-habit-actions">
            <button type="submit" className="add-habit-submit">Add</button>
            <button
              type="button"
              className="add-habit-cancel"
              onClick={() => { setIsAdding(false); setNewHabitText('') }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ul className="habits-list">
        {habits.map(habit => (
          <HabitItem
            key={habit.id}
            habit={habit}
            isCompleted={completedHabits.has(habit.id)}
            onToggle={() => toggleHabit(habit.id)}
            onDelete={() => deleteHabit(habit.id)}
          />
        ))}
      </ul>

      {habits.length === 0 && (
        <p className="no-habits-message">No focus items yet. Add one to get started!</p>
      )}

      <div className="habits-footer">
        <span className="habits-progress-text">
          <span>{completedCount}</span>/{totalCount} completed
        </span>
        <span className="streak-badge">{streakMessage}</span>
      </div>
    </section>
  )
}

export default HabitsSection
