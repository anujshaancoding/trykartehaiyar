import { useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'

// Points configuration
const POINTS = {
  TIME_PER_MINUTE: 1,      // Medium impact
  MESSAGE_SENT: 5,          // Low impact
  TASK_COMPLETED: 20        // High impact
}

// Daily limits to prevent exploitation
const DAILY_LIMITS = {
  TIME_POINTS: 120,        // Max 120 points from time (2 hours worth)
  MESSAGE_POINTS: 25,      // Max 25 points from messages (5 messages)
  TASK_POINTS: 200         // Max 200 points from tasks (10 tasks)
}

const DAILY_POINTS_KEY = 'dailyPointsTracker'

// Track daily points awarded by category
function getDailyPointsTracker() {
  try {
    const today = new Date().toDateString()
    const saved = localStorage.getItem(DAILY_POINTS_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      if (data.date === today) {
        return data
      }
    }
  } catch (e) {
    console.error('Error loading daily points tracker:', e)
  }
  return { date: new Date().toDateString(), time: 0, messages: 0, tasks: 0 }
}

function saveDailyPointsTracker(tracker) {
  try {
    localStorage.setItem(DAILY_POINTS_KEY, JSON.stringify(tracker))
  } catch (e) {
    console.error('Error saving daily points tracker:', e)
  }
}

// Check if points can be awarded for a specific reason
function canAwardPoints(reason, pointsToAdd) {
  const tracker = getDailyPointsTracker()

  switch (reason) {
    case 'time':
      return (tracker.time + pointsToAdd) <= DAILY_LIMITS.TIME_POINTS
    case 'messages':
      return (tracker.messages + pointsToAdd) <= DAILY_LIMITS.MESSAGE_POINTS
    case 'tasks':
      return (tracker.tasks + pointsToAdd) <= DAILY_LIMITS.TASK_POINTS
    default:
      return true
  }
}

// Record points awarded
function recordPointsAwarded(reason, pointsToAdd) {
  const tracker = getDailyPointsTracker()
  tracker[reason] = (tracker[reason] || 0) + pointsToAdd
  saveDailyPointsTracker(tracker)
}

// Get or create user name from localStorage
function getUserName() {
  return localStorage.getItem('leaderboardUserName') || null
}

function setUserName(name) {
  localStorage.setItem('leaderboardUserName', name)
}

export function useLeaderboard() {
  const timeTrackerRef = useRef(null)
  const lastSyncRef = useRef(Date.now())

  // Add points to a user
  const addPoints = useCallback(async (name, pointsToAdd, reason) => {
    if (!name) return

    // Anti-exploit: Check daily limit before awarding points
    if (!canAwardPoints(reason, pointsToAdd)) {
      console.log(`Daily limit reached for ${reason} points`)
      return
    }

    // Save the name for future use
    setUserName(name)

    try {
      // First, try to get existing user
      const { data: existing } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('name', name)
        .single()

      if (existing) {
        // Update existing user
        await supabase
          .from('leaderboard')
          .update({
            points: existing.points + pointsToAdd,
            [`${reason}_count`]: (existing[`${reason}_count`] || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('name', name)
      } else {
        // Create new user
        await supabase
          .from('leaderboard')
          .insert([{
            name,
            points: pointsToAdd,
            [`${reason}_count`]: 1
          }])
      }

      // Record points awarded for daily tracking
      recordPointsAwarded(reason, pointsToAdd)
    } catch (error) {
      console.error('Error adding points:', error)
    }
  }, [])

  // Add points for sending a message
  const addMessagePoints = useCallback((name) => {
    addPoints(name, POINTS.MESSAGE_SENT, 'messages')
  }, [addPoints])

  // Add points for completing a task
  const addTaskPoints = useCallback((name) => {
    const userName = name || getUserName()
    if (userName) {
      addPoints(userName, POINTS.TASK_COMPLETED, 'tasks')
    }
  }, [addPoints])

  // Track time spent on site
  const startTimeTracking = useCallback((name) => {
    if (!name) return

    setUserName(name)

    // Clear existing tracker
    if (timeTrackerRef.current) {
      clearInterval(timeTrackerRef.current)
    }

    // Add 1 point every minute
    timeTrackerRef.current = setInterval(() => {
      const userName = getUserName()
      if (userName) {
        addPoints(userName, POINTS.TIME_PER_MINUTE, 'time')
      }
    }, 60000) // Every minute
  }, [addPoints])

  const stopTimeTracking = useCallback(() => {
    if (timeTrackerRef.current) {
      clearInterval(timeTrackerRef.current)
      timeTrackerRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimeTracking()
    }
  }, [stopTimeTracking])

  return {
    addMessagePoints,
    addTaskPoints,
    startTimeTracking,
    stopTimeTracking,
    getUserName,
    setUserName,
    POINTS
  }
}
