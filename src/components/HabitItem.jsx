"use client"

function HabitItem({ habit, isCompleted, onToggle, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation()
    onDelete()
  }

  return (
    <li
      className={`habit-item ${isCompleted ? 'completed' : ''}`}
      onClick={onToggle}
      role="checkbox"
      aria-checked={isCompleted}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle()
        }
      }}
    >
      <div className="habit-checkbox">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <span className="habit-icon">{habit.icon}</span>
      <span className="habit-text">{habit.text}</span>
      <button
        className="habit-delete-btn"
        onClick={handleDelete}
        aria-label={`Delete ${habit.text}`}
        title="Delete"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </li>
  )
}

export default HabitItem
