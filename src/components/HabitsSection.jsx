import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import HabitItem from './HabitItem'

function HabitsSection() {
  const { habits, completedHabits, toggleHabit, addHabit, deleteHabit, completedCount, totalCount, streakMessage } = useHabits()
  const [newHabitText, setNewHabitText] = useState('')
  const [isAdding, setIsAdding] = useState(false)

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
