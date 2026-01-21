import { useQuotes } from '../hooks/useQuotes'

function QuoteSection() {
  const { quote, isTransitioning, timeRemaining } = useQuotes()

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
  }

  return (
    <section className="quote-section" aria-label="Motivational quote">
      <div className="quote-container">
        <p className={`quote-text ${isTransitioning ? 'fade-out' : ''}`}>
          {quote.text}
        </p>
        <p className={`quote-author ${isTransitioning ? 'fade-out' : ''}`}>
          {quote.author ? `— ${quote.author}` : ''}
        </p>
      </div>
      <span className="quote-timer">Next quote in {formatTime(timeRemaining)}</span>
    </section>
  )
}

export default QuoteSection
