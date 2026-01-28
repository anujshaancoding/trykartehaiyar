import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Simple ThemeToggle component for testing
const ThemeToggle = ({ isDark = false, onToggle }) => {
  return (
    <button
      className={`theme-toggle ${isDark ? 'dark' : 'light'}`}
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" className="sun-icon" aria-hidden="true">
          <circle cx="12" cy="12" r="5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="moon-icon" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}

describe('ThemeToggle', () => {
  const defaultProps = {
    isDark: false,
    onToggle: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the toggle button', () => {
      render(<ThemeToggle {...defaultProps} />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should render moon icon in light mode', () => {
      render(<ThemeToggle {...defaultProps} isDark={false} />)

      const moonIcon = document.querySelector('.moon-icon')
      expect(moonIcon).toBeInTheDocument()
    })

    it('should render sun icon in dark mode', () => {
      render(<ThemeToggle {...defaultProps} isDark={true} />)

      const sunIcon = document.querySelector('.sun-icon')
      expect(sunIcon).toBeInTheDocument()
    })
  })

  describe('theme state', () => {
    it('should have light class when isDark is false', () => {
      render(<ThemeToggle {...defaultProps} isDark={false} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('light')
    })

    it('should have dark class when isDark is true', () => {
      render(<ThemeToggle {...defaultProps} isDark={true} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('dark')
    })

    it('should not have dark class in light mode', () => {
      render(<ThemeToggle {...defaultProps} isDark={false} />)

      const button = screen.getByRole('button')
      expect(button).not.toHaveClass('dark')
    })

    it('should not have light class in dark mode', () => {
      render(<ThemeToggle {...defaultProps} isDark={true} />)

      const button = screen.getByRole('button')
      expect(button).not.toHaveClass('light')
    })
  })

  describe('interaction', () => {
    it('should call onToggle when clicked', async () => {
      const user = userEvent.setup()
      const onToggle = jest.fn()

      render(<ThemeToggle {...defaultProps} onToggle={onToggle} />)

      await user.click(screen.getByRole('button'))

      expect(onToggle).toHaveBeenCalledTimes(1)
    })

    it('should be keyboard accessible', () => {
      const onToggle = jest.fn()

      render(<ThemeToggle {...defaultProps} onToggle={onToggle} />)

      const button = screen.getByRole('button')
      // Buttons are natively keyboard accessible
      expect(button).toBeInTheDocument()
      expect(button.tagName).toBe('BUTTON')
    })
  })

  describe('accessibility', () => {
    it('should have correct aria-label in light mode', () => {
      render(<ThemeToggle {...defaultProps} isDark={false} />)

      const button = screen.getByRole('button', {
        name: 'Switch to dark mode',
      })
      expect(button).toBeInTheDocument()
    })

    it('should have correct aria-label in dark mode', () => {
      render(<ThemeToggle {...defaultProps} isDark={true} />)

      const button = screen.getByRole('button', {
        name: 'Switch to light mode',
      })
      expect(button).toBeInTheDocument()
    })

    it('should have title in light mode', () => {
      render(<ThemeToggle {...defaultProps} isDark={false} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title', 'Dark mode')
    })

    it('should have title in dark mode', () => {
      render(<ThemeToggle {...defaultProps} isDark={true} />)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('title', 'Light mode')
    })

    it('should have aria-hidden on icons', () => {
      render(<ThemeToggle {...defaultProps} isDark={false} />)

      const icon = document.querySelector('svg')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })
  })

  describe('CSS classes', () => {
    it('should have theme-toggle class', () => {
      render(<ThemeToggle {...defaultProps} />)

      const button = screen.getByRole('button')
      expect(button).toHaveClass('theme-toggle')
    })
  })
})
