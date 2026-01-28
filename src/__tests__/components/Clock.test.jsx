import { render, screen } from '@testing-library/react'
import Clock from '../../components/Clock'

// Mock the useTime hook
jest.mock('../../hooks/useTime', () => ({
  useTime: () => ({
    hours: '10',
    minutes: '30',
    seconds: '45',
    period: 'AM',
    dateString: 'Monday · January 15, 2024',
    hourlyMessage: 'Time is neutral. Results aren\'t.',
    isNightTime: false,
    hour24: 10,
  }),
}))

describe('Clock', () => {
  describe('rendering', () => {
    it('should render the clock section', () => {
      render(<Clock />)

      const section = screen.getByLabelText('Current time and date')
      expect(section).toBeInTheDocument()
    })

    it('should display hours', () => {
      render(<Clock />)

      expect(screen.getByText('10')).toBeInTheDocument()
    })

    it('should display minutes', () => {
      render(<Clock />)

      expect(screen.getByText('30')).toBeInTheDocument()
    })

    it('should display seconds', () => {
      render(<Clock />)

      expect(screen.getByText('45')).toBeInTheDocument()
    })

    it('should display AM/PM period', () => {
      render(<Clock />)

      expect(screen.getByText('AM')).toBeInTheDocument()
    })

    it('should display separators', () => {
      render(<Clock />)

      const separators = screen.getAllByText(':')
      expect(separators).toHaveLength(2)
    })
  })

  describe('date display', () => {
    it('should display the date string', () => {
      render(<Clock />)

      expect(
        screen.getByText('Monday · January 15, 2024')
      ).toBeInTheDocument()
    })
  })

  describe('hourly message', () => {
    it('should display the hourly truth message', () => {
      render(<Clock />)

      expect(
        screen.getByText('Time is neutral. Results aren\'t.')
      ).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have aria-label on section', () => {
      render(<Clock />)

      expect(
        screen.getByRole('region', { name: 'Current time and date' })
      ).toBeInTheDocument()
    })

    it('should have aria-live for clock updates', () => {
      render(<Clock />)

      const clock = document.querySelector('.clock')
      expect(clock).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('CSS classes', () => {
    it('should have time-section class', () => {
      render(<Clock />)

      const section = screen.getByLabelText('Current time and date')
      expect(section).toHaveClass('time-section')
    })

    it('should have clock class on clock container', () => {
      render(<Clock />)

      const clock = document.querySelector('.clock')
      expect(clock).toBeInTheDocument()
    })

    it('should have clock-digit class on time digits', () => {
      render(<Clock />)

      const digits = document.querySelectorAll('.clock-digit')
      expect(digits).toHaveLength(3) // hours, minutes, seconds
    })

    it('should have clock-separator class on separators', () => {
      render(<Clock />)

      const separators = document.querySelectorAll('.clock-separator')
      expect(separators).toHaveLength(2)
    })

    it('should have clock-period class on AM/PM', () => {
      render(<Clock />)

      const period = document.querySelector('.clock-period')
      expect(period).toBeInTheDocument()
      expect(period).toHaveTextContent('AM')
    })

    it('should have date-display class', () => {
      render(<Clock />)

      const dateDisplay = document.querySelector('.date-display')
      expect(dateDisplay).toBeInTheDocument()
    })

    it('should have hourly-truth class on message', () => {
      render(<Clock />)

      const message = document.querySelector('.hourly-truth')
      expect(message).toBeInTheDocument()
    })
  })
})

describe('Clock with PM time', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  it('should display PM when in afternoon', () => {
    jest.doMock('../../hooks/useTime', () => ({
      useTime: () => ({
        hours: '02',
        minutes: '30',
        seconds: '00',
        period: 'PM',
        dateString: 'Monday · January 15, 2024',
        hourlyMessage: 'Another hour you won\'t get back.',
        isNightTime: false,
        hour24: 14,
      }),
    }))

    // Re-import Clock after mocking
    const { default: ClockPM } = require('../../components/Clock')
    render(<ClockPM />)

    expect(screen.getByText('PM')).toBeInTheDocument()
  })
})
