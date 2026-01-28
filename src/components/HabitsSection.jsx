"use client"

import { useState, useEffect, useRef } from 'react'
import { useHabits } from '../hooks/useHabits'
import HabitItem from './HabitItem'
import CelebrationModal from './CelebrationModal'

const motivationalMessages = [
  "Still time. Still your move.",
  "The day isn't over yet.",
  "Keep going. Show up.",
  "Focus on what's left.",
  "Every task counts.",
]

const completionMessages = [
  "Good. Show up again tomorrow.",
  "Consistency beats intensity.",
  "This is how days stop slipping.",
  "Quiet discipline compounds.",
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

const CELEBRATION_SHOWN_KEY = 'celebrationShownToday'

function getCelebrationShownToday() {
  try {
    const saved = localStorage.getItem(CELEBRATION_SHOWN_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      return data.date === new Date().toDateString()
    }
  } catch (e) {
    console.error('Error checking celebration shown:', e)
  }
  return false
}

function setCelebrationShownToday() {
  try {
    localStorage.setItem(CELEBRATION_SHOWN_KEY, JSON.stringify({
      date: new Date().toDateString()
    }))
  } catch (e) {
    console.error('Error saving celebration shown:', e)
  }
}

function HabitsSection() {
  const { habits, completedHabits, toggleHabit, addHabit, deleteHabit, completedCount, totalCount, streakMessage } = useHabits()
  const [newHabitText, setNewHabitText] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [motivationalMessage, setMotivationalMessage] = useState('')
  const [completionMessage, setCompletionMessage] = useState('')
  const [timeRemaining, setTimeRemaining] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)
  const [openToShare, setOpenToShare] = useState(false)
  const prevAllCompletedRef = useRef(false)

  useEffect(() => {
    // Pick a random message on mount
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length)
    setMotivationalMessage(motivationalMessages[randomIndex])
    const completionIndex = Math.floor(Math.random() * completionMessages.length)
    setCompletionMessage(completionMessages[completionIndex])
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

  const allCompleted = totalCount > 0 && completedCount === totalCount

  // Show celebration when all tasks are completed for the first time today
  useEffect(() => {
    if (allCompleted && !prevAllCompletedRef.current && !getCelebrationShownToday()) {
      setShowCelebration(true)
      setCelebrationShownToday()
    }
    prevAllCompletedRef.current = allCompleted
  }, [allCompleted])

  const handleCloseCelebration = () => {
    setShowCelebration(false)
    setOpenToShare(false)
  }

  const handleOpenShareCard = () => {
    setOpenToShare(true)
    setShowCelebration(true)
  }

  return (
    <section className="habits-section" aria-label="Daily habits tracker">
      <div className="habits-header">
        <h2 className="section-title">Today's Non-Negotiables</h2>
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
      <p className="habits-sublabel">If these are done, today counts.</p>

      {totalCount > 0 && completedCount < totalCount && (
        <p className="motivation-message">
          {timeRemaining} left today. {motivationalMessage}
        </p>
      )}

      {allCompleted && (
        <p className="completion-message">{completionMessage}</p>
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
        <div className="habits-footer-right">
          <span className="streak-badge">{streakMessage}</span>
          {allCompleted && (
            <button
              className="share-achievement-btn"
              onClick={handleOpenShareCard}
              aria-label="Share achievement"
              title="Share your achievement"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <CelebrationModal
        isOpen={showCelebration}
        onClose={handleCloseCelebration}
        completedHabits={completedHabits}
        habits={habits}
        openToShare={openToShare}
      />
    </section>
  )
}

export default HabitsSection
