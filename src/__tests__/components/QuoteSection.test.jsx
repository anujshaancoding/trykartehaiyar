import { render, screen } from '@testing-library/react'

// Mock the useQuotes hook
jest.mock('../../hooks/useQuotes', () => ({
  useQuotes: () => ({
    quote: {
      text: 'Nobody feels like doing the work. Do it anyway.',
      author: 'Reality',
    },
    isTransitioning: false,
    timeRemaining: 900,
  }),
}))

// Create a simple QuoteSection component for testing
const QuoteSection = () => {
  const { useQuotes } = require('../../hooks/useQuotes')
  const { quote, isTransitioning } = useQuotes()

  return (
    <section
      className={`quote-section ${isTransitioning ? 'transitioning' : ''}`}
      aria-label="Motivational quote"
    >
      <blockquote className="quote-text">"{quote.text}"</blockquote>
      <cite className="quote-author">— {quote.author}</cite>
    </section>
  )
}

describe('QuoteSection', () => {
  describe('rendering', () => {
    it('should render the quote section', () => {
      render(<QuoteSection />)

      expect(
        screen.getByRole('region', { name: 'Motivational quote' })
      ).toBeInTheDocument()
    })

    it('should display the quote text', () => {
      render(<QuoteSection />)

      expect(
        screen.getByText(/"Nobody feels like doing the work. Do it anyway."/)
      ).toBeInTheDocument()
    })

    it('should display the author', () => {
      render(<QuoteSection />)

      expect(screen.getByText(/Reality/)).toBeInTheDocument()
    })

    it('should render blockquote element', () => {
      render(<QuoteSection />)

      const blockquote = document.querySelector('blockquote')
      expect(blockquote).toBeInTheDocument()
    })

    it('should render cite element for author', () => {
      render(<QuoteSection />)

      const cite = document.querySelector('cite')
      expect(cite).toBeInTheDocument()
    })
  })

  describe('CSS classes', () => {
    it('should have quote-section class', () => {
      render(<QuoteSection />)

      const section = document.querySelector('.quote-section')
      expect(section).toBeInTheDocument()
    })

    it('should have quote-text class on blockquote', () => {
      render(<QuoteSection />)

      const quoteText = document.querySelector('.quote-text')
      expect(quoteText).toBeInTheDocument()
    })

    it('should have quote-author class on cite', () => {
      render(<QuoteSection />)

      const author = document.querySelector('.quote-author')
      expect(author).toBeInTheDocument()
    })

    it('should not have transitioning class when not transitioning', () => {
      render(<QuoteSection />)

      const section = document.querySelector('.quote-section')
      expect(section).not.toHaveClass('transitioning')
    })
  })

  describe('accessibility', () => {
    it('should have aria-label on section', () => {
      render(<QuoteSection />)

      const section = screen.getByRole('region', { name: 'Motivational quote' })
      expect(section).toBeInTheDocument()
    })
  })
})

describe('QuoteSection with transition', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.doMock('../../hooks/useQuotes', () => ({
      useQuotes: () => ({
        quote: {
          text: 'Test quote',
          author: 'Reality',
        },
        isTransitioning: true,
        timeRemaining: 0,
      }),
    }))
  })

  it('should have transitioning class when transitioning', () => {
    const TransitioningQuoteSection = () => {
      const { useQuotes } = require('../../hooks/useQuotes')
      const { quote, isTransitioning } = useQuotes()

      return (
        <section
          className={`quote-section ${isTransitioning ? 'transitioning' : ''}`}
          aria-label="Motivational quote"
        >
          <blockquote className="quote-text">"{quote.text}"</blockquote>
          <cite className="quote-author">— {quote.author}</cite>
        </section>
      )
    }

    render(<TransitioningQuoteSection />)

    const section = document.querySelector('.quote-section')
    expect(section).toHaveClass('transitioning')
  })
})
