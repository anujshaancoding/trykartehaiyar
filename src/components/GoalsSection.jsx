"use client"

import { useState } from 'react'
import { useGoals } from '../hooks/useGoals'

function GoalItem({ goal, onToggle, onDelete }) {
  return (
    <li className={`goal-item ${goal.completed ? 'completed' : ''}`}>
      <button
        className="goal-checkbox"
        onClick={onToggle}
        role="checkbox"
        aria-checked={goal.completed}
        aria-label={`Mark "${goal.text}" as ${goal.completed ? 'incomplete' : 'complete'}`}
      >
        {goal.completed ? '✓' : ''}
      </button>
      <span className="goal-text">{goal.text}</span>
      <button
        className="goal-delete-btn"
        onClick={onDelete}
        aria-label={`Delete "${goal.text}"`}
      >
        ×
      </button>
    </li>
  )
}

function GoalPanel({ title, goals, timeRemaining, stats, onAdd, onToggle, onDelete }) {
  const [newGoalText, setNewGoalText] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const handleAdd = (e) => {
    e.preventDefault()
    if (newGoalText.trim()) {
      onAdd(newGoalText)
      setNewGoalText('')
      setIsAdding(false)
    }
  }

  return (
    <div className="goal-panel">
      <div className="goal-panel-header">
        <h3 className="goal-panel-title">{title}</h3>
        <span className="goal-time-remaining">
          <span className="time-number">{timeRemaining.daysLeft}</span> {timeRemaining.label}
        </span>
      </div>

      {isAdding ? (
        <form className="goal-add-form" onSubmit={handleAdd}>
          <input
            type="text"
            value={newGoalText}
            onChange={(e) => setNewGoalText(e.target.value)}
            placeholder="Enter your goal..."
            className="goal-input"
            autoFocus
          />
          <div className="goal-form-actions">
            <button type="submit" className="goal-submit-btn">Add</button>
            <button
              type="button"
              className="goal-cancel-btn"
              onClick={() => { setIsAdding(false); setNewGoalText('') }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          className="goal-add-btn"
          onClick={() => setIsAdding(true)}
          aria-label={`Add new ${title.toLowerCase()}`}
        >
          + Add Goal
        </button>
      )}

      <ul className="goal-list">
        {goals.map(goal => (
          <GoalItem
            key={goal.id}
            goal={goal}
            onToggle={() => onToggle(goal.id)}
            onDelete={() => onDelete(goal.id)}
          />
        ))}
      </ul>

      {goals.length === 0 && (
        <p className="goal-empty-message">No goals set yet</p>
      )}

      {goals.length > 0 && (
        <div className="goal-stats">
          {stats.completed}/{stats.total} completed
        </div>
      )}
    </div>
  )
}

function GoalsSection() {
  const {
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
  } = useGoals()

  return (
    <section className="goals-section" aria-label="Monthly and yearly goals">
      <h2 className="section-title">Focus Goals</h2>
      <div className="goals-container">
        <GoalPanel
          title="Monthly Goal"
          goals={monthlyGoals}
          timeRemaining={monthlyTimeRemaining}
          stats={monthlyStats}
          onAdd={addMonthlyGoal}
          onToggle={toggleMonthlyGoal}
          onDelete={deleteMonthlyGoal}
        />
        <GoalPanel
          title="Yearly Goal"
          goals={yearlyGoals}
          timeRemaining={yearlyTimeRemaining}
          stats={yearlyStats}
          onAdd={addYearlyGoal}
          onToggle={toggleYearlyGoal}
          onDelete={deleteYearlyGoal}
        />
      </div>
    </section>
  )
}

export default GoalsSection
