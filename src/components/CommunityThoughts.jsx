"use client"

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useLeaderboard } from '../hooks/useLeaderboard'

// Default community messages with Indian names (shown alongside database messages)
const DEFAULT_MESSAGES = [
  { id: 'default-1', name: 'Aarav Sharma', message: 'Just completed my morning meditation! Feeling refreshed and ready for the day.', flagged: false, blurred: false, created_at: '2026-01-26T06:30:00Z' },
  { id: 'default-2', name: 'Priya Patel', message: 'Grateful for this community. Small steps lead to big changes!', flagged: false, blurred: false, created_at: '2026-01-26T07:15:00Z' },
  { id: 'default-3', name: 'Rohan Verma', message: 'Day 15 of my fitness journey. Consistency is key!', flagged: false, blurred: false, created_at: '2026-01-26T08:00:00Z' },
  { id: 'default-4', name: 'Ananya Gupta', message: 'Finished reading 20 pages today. Books are magical!', flagged: false, blurred: false, created_at: '2026-01-26T09:45:00Z' },
  { id: 'default-5', name: 'Vikram Singh', message: 'Woke up early for the first time in months. Baby steps!', flagged: false, blurred: false, created_at: '2026-01-26T10:30:00Z' },
  { id: 'default-6', name: 'Neha Reddy', message: 'Cooked a healthy meal today instead of ordering out. Proud of myself!', flagged: false, blurred: false, created_at: '2026-01-26T12:00:00Z' },
  { id: 'default-7', name: 'Arjun Nair', message: 'Completed my daily coding practice. Learning React is fun!', flagged: false, blurred: false, created_at: '2026-01-26T14:20:00Z' },
  { id: 'default-8', name: 'Kavya Iyer', message: 'Went for an evening walk. Nature is so peaceful.', flagged: false, blurred: false, created_at: '2026-01-26T17:45:00Z' },
  { id: 'default-9', name: 'Aditya Kumar', message: 'Practiced guitar for 30 minutes. Getting better every day!', flagged: false, blurred: false, created_at: '2026-01-26T19:00:00Z' },
  { id: 'default-10', name: 'Ishita Mehta', message: 'Journaling before bed has changed my life. Highly recommend!', flagged: false, blurred: false, created_at: '2026-01-26T21:30:00Z' },
  { id: 'default-11', name: 'Karthik Rao', message: 'Started my day with yoga. Namaste everyone!', flagged: false, blurred: false, created_at: '2026-01-27T05:45:00Z' },
  { id: 'default-12', name: 'Divya Menon', message: 'Drank 8 glasses of water today. Staying hydrated!', flagged: false, blurred: false, created_at: '2026-01-27T08:15:00Z' },
  { id: 'default-13', name: 'Rahul Joshi', message: 'Finally organized my workspace. Clean desk, clear mind!', flagged: false, blurred: false, created_at: '2026-01-27T10:00:00Z' },
  { id: 'default-14', name: 'Sneha Agarwal', message: 'Meditated for 15 minutes. Inner peace is priceless.', flagged: false, blurred: false, created_at: '2026-01-27T11:30:00Z' },
  { id: 'default-15', name: 'Manish Tiwari', message: 'Took a break from social media today. Feeling lighter!', flagged: false, blurred: false, created_at: '2026-01-27T13:00:00Z' },
  { id: 'default-16', name: 'Pooja Desai', message: 'Helped a stranger today. Kindness costs nothing!', flagged: false, blurred: false, created_at: '2026-01-27T15:20:00Z' },
  { id: 'default-17', name: 'Sanjay Pillai', message: 'Learned a new recipe. Cooking is therapeutic!', flagged: false, blurred: false, created_at: '2026-01-27T17:00:00Z' },
  { id: 'default-18', name: 'Meera Krishnan', message: 'Spent quality time with family. Blessed!', flagged: false, blurred: false, created_at: '2026-01-27T19:30:00Z' }
]

// Rate limiting configuration
const MESSAGE_RATE_LIMIT = 5 // Max messages allowed
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds
const MESSAGE_TIMESTAMPS_KEY = 'messageTimestamps'

// Get message timestamps from localStorage
function getMessageTimestamps() {
  try {
    const saved = localStorage.getItem(MESSAGE_TIMESTAMPS_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Error loading message timestamps:', e)
  }
  return []
}

// Save message timestamps to localStorage
function saveMessageTimestamp(timestamp) {
  try {
    const timestamps = getMessageTimestamps()
    timestamps.push(timestamp)
    localStorage.setItem(MESSAGE_TIMESTAMPS_KEY, JSON.stringify(timestamps))
  } catch (e) {
    console.error('Error saving message timestamp:', e)
  }
}

// Check if user can post (within rate limit)
function canPostMessage() {
  const now = Date.now()
  const timestamps = getMessageTimestamps()

  // Filter timestamps within the rate limit window
  const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW)

  // Clean up old timestamps
  if (recentTimestamps.length !== timestamps.length) {
    localStorage.setItem(MESSAGE_TIMESTAMPS_KEY, JSON.stringify(recentTimestamps))
  }

  return recentTimestamps.length < MESSAGE_RATE_LIMIT
}

// Get remaining time until next message slot opens
function getTimeUntilNextSlot() {
  const now = Date.now()
  const timestamps = getMessageTimestamps()
  const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW)

  if (recentTimestamps.length < MESSAGE_RATE_LIMIT) {
    return 0
  }

  // Find the oldest timestamp and calculate when it expires
  const oldestTimestamp = Math.min(...recentTimestamps)
  const timeRemaining = (oldestTimestamp + RATE_LIMIT_WINDOW) - now
  return Math.ceil(timeRemaining / 60000) // Return minutes remaining
}

// Get remaining messages count
function getRemainingMessages() {
  const now = Date.now()
  const timestamps = getMessageTimestamps()
  const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW)
  return MESSAGE_RATE_LIMIT - recentTimestamps.length
}

// List of negative words - for flagging (orange flag)
const flaggedWords = [
  'hate', 'stupid', 'idiot', 'dumb', 'ugly', 'kill', 'die', 'suck',
  'loser', 'pathetic', 'worthless', 'trash', 'garbage', 'useless',
  'terrible', 'awful', 'horrible', 'disgusting', 'nasty', 'evil',
  'damn', 'hell', 'crap', 'jerk', 'fool', 'moron', 'failure',
  'worst', 'angry', 'depressed', 'hopeless'
]

// List of abusive/NSFW words - for blurring (more severe)
const blurredWords = [
  'fuck', 'shit', 'ass', 'bitch', 'bastard', 'dick', 'cock', 'pussy',
  'whore', 'slut', 'fag', 'nigger', 'nigga', 'retard', 'cunt',
  'porn', 'sex', 'nude', 'naked', 'xxx', 'penis', 'vagina',
  'motherfucker', 'asshole', 'bullshit', 'piss', 'dildo'
]

// Check for whole word matches using regex (prevents "hello" matching "hell")
function containsWord(text, wordList) {
  const lowerText = text.toLowerCase()
  return wordList.some(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'i')
    return regex.test(lowerText)
  })
}

function containsFlaggedWords(text) {
  return containsWord(text, flaggedWords)
}

function containsBlurredWords(text) {
  return containsWord(text, blurredWords)
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

function CommunityThoughts() {
  const [thoughts, setThoughts] = useState([])
  const [thoughtName, setThoughtName] = useState('')
  const [thoughtMessage, setThoughtMessage] = useState('')
  const [thoughtError, setThoughtError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [remainingMsgs, setRemainingMsgs] = useState(MESSAGE_RATE_LIMIT)

  // Load from localStorage after hydration
  useEffect(() => {
    const savedName = localStorage.getItem('leaderboardUserName') || ''
    setThoughtName(savedName)
    setRemainingMsgs(getRemainingMessages())
  }, [])
  const { addMessagePoints, startTimeTracking } = useLeaderboard()

  // Update remaining messages count periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMsgs(getRemainingMessages())
    }, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  // Fetch thoughts from Supabase
  useEffect(() => {
    const fetchThoughts = async () => {
      if (!supabase) {
        setThoughts([...DEFAULT_MESSAGES].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
        setIsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('community_thoughts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching thoughts:', error)
        // Show default messages even if database fails
        setThoughts([...DEFAULT_MESSAGES].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
      } else {
        // Merge database messages with default messages
        const dbMessages = data || []
        const allMessages = [...dbMessages, ...DEFAULT_MESSAGES]
        // Sort by created_at descending and take top 50
        const sortedMessages = allMessages
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 50)
        setThoughts(sortedMessages)
      }
      setIsLoading(false)
    }

    fetchThoughts()

    // Subscribe to real-time updates
    if (!supabase) return

    const channel = supabase
      .channel('community_thoughts_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'community_thoughts' },
        (payload) => {
          setThoughts(prev => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const handleAddThought = async (e) => {
    e.preventDefault()
    setThoughtError('')

    if (!thoughtName.trim()) {
      setThoughtError('Please enter your name')
      return
    }
    if (!thoughtMessage.trim()) {
      setThoughtError('Please enter a message')
      return
    }

    // Check rate limit before allowing post
    if (!canPostMessage()) {
      const minutesRemaining = getTimeUntilNextSlot()
      setThoughtError(`Rate limit reached. You can post ${MESSAGE_RATE_LIMIT} messages per hour. Try again in ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}.`)
      return
    }

    setIsSubmitting(true)

    if (!supabase) {
      setThoughtError('Service temporarily unavailable')
      setIsSubmitting(false)
      return
    }

    // Check if message contains flagged or blurred words
    const isFlagged = containsFlaggedWords(thoughtName) || containsFlaggedWords(thoughtMessage)
    const isBlurred = containsBlurredWords(thoughtName) || containsBlurredWords(thoughtMessage)

    const { error } = await supabase
      .from('community_thoughts')
      .insert([{
        name: thoughtName.trim(),
        message: thoughtMessage.trim(),
        flagged: isFlagged || isBlurred,
        blurred: isBlurred
      }])

    if (error) {
      console.error('Error posting thought:', error)
      setThoughtError('Failed to post. Please try again.')
    } else {
      // Record message timestamp for rate limiting
      saveMessageTimestamp(Date.now())
      // Update remaining messages count
      setRemainingMsgs(getRemainingMessages())
      // Add points for posting a message
      addMessagePoints(thoughtName.trim())
      // Start time tracking for this user
      startTimeTracking(thoughtName.trim())
      // Keep the name but clear the message
      setThoughtMessage('')
    }

    setIsSubmitting(false)
  }

  return (
    <section className="community-thoughts-section">
      <h2 className="section-title">Community Thoughts <span className="community-thoughts-subtitle">(Share something positive about your day)</span></h2>

      {/* Messages list first */}
      <div className="thoughts-list">
        {isLoading ? (
          <p className="no-thoughts-message">Loading thoughts...</p>
        ) : thoughts.length === 0 ? (
          <p className="no-thoughts-message">No thoughts shared yet. Be the first!</p>
        ) : (
          thoughts.map(thought => (
            <div key={thought.id} className={`thought-item ${thought.flagged ? 'thought-flagged' : ''} ${thought.blurred ? 'thought-blurred' : ''}`}>
              <div className="thought-header">
                <span className="thought-author">
                  {thought.blurred ? <span className="blurred-text">{thought.name}</span> : thought.name}
                  {thought.blurred ? (
                    <span className="thought-blur-icon" title="This message contains inappropriate content">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    </span>
                  ) : thought.flagged && (
                    <span className="thought-flag-icon" title="This message may contain negative content">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                        <line x1="4" y1="22" x2="4" y2="15"></line>
                      </svg>
                    </span>
                  )}
                </span>
                <span className="thought-time">{formatTime(thought.created_at)}</span>
              </div>
              <p className={`thought-content ${thought.blurred ? 'blurred-text' : ''}`}>{thought.message}</p>
            </div>
          ))
        )}
      </div>

      {/* Form at bottom */}
      {thoughtError && <p className="thought-error">{thoughtError}</p>}
      <form className="thought-form-inline" onSubmit={handleAddThought}>
        {remainingMsgs < MESSAGE_RATE_LIMIT && (
          <span className="rate-limit-indicator">
            {remainingMsgs > 0
              ? `${remainingMsgs}/${MESSAGE_RATE_LIMIT} messages left this hour`
              : 'Rate limit reached'}
          </span>
        )}
        <div className="thought-form-field">
          <label className="thought-label">Name:</label>
          <input
            type="text"
            value={thoughtName}
            onChange={(e) => setThoughtName(e.target.value)}
            placeholder="Your name"
            className="thought-input-inline"
            maxLength={30}
            disabled={isSubmitting}
          />
        </div>
        <div className="thought-form-field thought-message-field">
          <label className="thought-label">Message:</label>
          <input
            type="text"
            value={thoughtMessage}
            onChange={(e) => setThoughtMessage(e.target.value)}
            placeholder="Share a positive thought..."
            className="thought-input-inline"
            maxLength={200}
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" className="thought-post-btn" disabled={isSubmitting}>
          {isSubmitting ? '...' : 'Post'}
        </button>
      </form>
    </section>
  )
}

export default CommunityThoughts
