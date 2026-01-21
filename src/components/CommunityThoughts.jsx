import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useLeaderboard } from '../hooks/useLeaderboard'

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
  const [thoughtName, setThoughtName] = useState(() => {
    return localStorage.getItem('leaderboardUserName') || ''
  })
  const [thoughtMessage, setThoughtMessage] = useState('')
  const [thoughtError, setThoughtError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [remainingMsgs, setRemainingMsgs] = useState(() => getRemainingMessages())
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
      const { data, error } = await supabase
        .from('community_thoughts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching thoughts:', error)
      } else {
        setThoughts(data || [])
      }
      setIsLoading(false)
    }

    fetchThoughts()

    // Subscribe to real-time updates
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
