import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const modalRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleClose()
      }
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    setName('')
    setEmail('')
    setFeedback('')
    setIsSubmitted(false)
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (name.trim() && feedback.trim()) {
      setIsSubmitting(true)
      setError(null)

      try {
        // Save to Supabase
        const { error: supabaseError } = await supabase
          .from('feedback')
          .insert([
            {
              name: name.trim(),
              email: email.trim() || null,
              question: 'What you expect from habit tracking app?',
              answer: feedback.trim()
            }
          ])

        if (supabaseError) throw supabaseError

        setIsSubmitted(true)
        setTimeout(() => {
          handleClose()
        }, 2000)
      } catch (err) {
        console.error('Error submitting feedback:', err)
        setError('Failed to submit feedback. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <>
      <button
        className="feedback-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Give Feedback"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span>Feedback</span>
      </button>

      {isOpen && (
        <div className="feedback-overlay">
          <div className="feedback-modal" ref={modalRef}>
            <button className="feedback-close-btn" onClick={handleClose} aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {isSubmitted ? (
              <div className="feedback-success">
                <div className="feedback-success-emoji">🙏</div>
                <h3>Thank you for your special feedback!</h3>
                <p>We will try to address it as soon as possible.</p>
              </div>
            ) : (
              <>
                <h2 className="feedback-title">We'd love your feedback!</h2>
                <form onSubmit={handleSubmit}>
                  <div className="feedback-field">
                    <label className="feedback-label">Name</label>
                    <input
                      type="text"
                      className="feedback-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      autoFocus
                    />
                  </div>
                  <div className="feedback-field">
                    <label className="feedback-label">
                      Email <span className="feedback-optional">(optional)</span>
                    </label>
                    <input
                      type="email"
                      className="feedback-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <label className="feedback-question">
                    What you expect from habit tracking app?
                  </label>
                  <textarea
                    className="feedback-textarea"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts, ideas, or suggestions..."
                    rows={5}
                  />
                  {error && <p className="feedback-error">{error}</p>}
                  <button
                    type="submit"
                    className="feedback-submit-btn"
                    disabled={!name.trim() || !feedback.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default FeedbackButton
