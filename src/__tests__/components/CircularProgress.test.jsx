import { render, screen } from '@testing-library/react'
import CircularProgress from '../../components/CircularProgress'

describe('CircularProgress', () => {
  describe('rendering', () => {
    it('should render the circular progress component', () => {
      render(<CircularProgress progress={50} />)

      expect(screen.getByText('50%')).toBeInTheDocument()
    })

    it('should display "Year Gone" label', () => {
      render(<CircularProgress progress={50} />)

      expect(screen.getByText('Year Gone')).toBeInTheDocument()
    })

    it('should render SVG element', () => {
      render(<CircularProgress progress={50} />)

      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('should render two circle elements', () => {
      render(<CircularProgress progress={50} />)

      const circles = document.querySelectorAll('circle')
      expect(circles).toHaveLength(2)
    })
  })

  describe('progress values', () => {
    it('should display 0% progress', () => {
      render(<CircularProgress progress={0} />)

      expect(screen.getByText('0%')).toBeInTheDocument()
    })

    it('should display 100% progress', () => {
      render(<CircularProgress progress={100} />)

      expect(screen.getByText('100%')).toBeInTheDocument()
    })

    it('should round decimal progress values', () => {
      render(<CircularProgress progress={33.333} />)

      expect(screen.getByText('33%')).toBeInTheDocument()
    })

    it('should round up when needed', () => {
      render(<CircularProgress progress={33.7} />)

      expect(screen.getByText('34%')).toBeInTheDocument()
    })

    it('should display 25% progress', () => {
      render(<CircularProgress progress={25} />)

      expect(screen.getByText('25%')).toBeInTheDocument()
    })

    it('should display 75% progress', () => {
      render(<CircularProgress progress={75} />)

      expect(screen.getByText('75%')).toBeInTheDocument()
    })
  })

  describe('sizing', () => {
    it('should use default size of 120', () => {
      render(<CircularProgress progress={50} />)

      const container = document.querySelector('.circular-progress')
      expect(container).toHaveStyle({ width: '120px', height: '120px' })
    })

    it('should use custom size when provided', () => {
      render(<CircularProgress progress={50} size={200} />)

      const container = document.querySelector('.circular-progress')
      expect(container).toHaveStyle({ width: '200px', height: '200px' })
    })

    it('should use small size', () => {
      render(<CircularProgress progress={50} size={80} />)

      const container = document.querySelector('.circular-progress')
      expect(container).toHaveStyle({ width: '80px', height: '80px' })
    })

    it('should have correct viewBox based on size', () => {
      render(<CircularProgress progress={50} size={150} />)

      const svg = document.querySelector('svg')
      expect(svg).toHaveAttribute('viewBox', '0 0 150 150')
    })
  })

  describe('stroke width', () => {
    it('should use default strokeWidth of 8', () => {
      render(<CircularProgress progress={50} />)

      const circles = document.querySelectorAll('circle')
      circles.forEach((circle) => {
        expect(circle).toHaveAttribute('stroke-width', '8')
      })
    })

    it('should use custom strokeWidth when provided', () => {
      render(<CircularProgress progress={50} strokeWidth={12} />)

      const circles = document.querySelectorAll('circle')
      circles.forEach((circle) => {
        expect(circle).toHaveAttribute('stroke-width', '12')
      })
    })
  })

  describe('SVG calculations', () => {
    it('should have circles centered in SVG', () => {
      render(<CircularProgress progress={50} size={120} />)

      const circles = document.querySelectorAll('circle')
      circles.forEach((circle) => {
        expect(circle).toHaveAttribute('cx', '60') // size / 2
        expect(circle).toHaveAttribute('cy', '60') // size / 2
      })
    })

    it('should calculate radius correctly', () => {
      const size = 120
      const strokeWidth = 8
      const expectedRadius = (size - strokeWidth) / 2 // (120 - 8) / 2 = 56

      render(<CircularProgress progress={50} size={size} strokeWidth={strokeWidth} />)

      const circles = document.querySelectorAll('circle')
      circles.forEach((circle) => {
        expect(circle).toHaveAttribute('r', expectedRadius.toString())
      })
    })

    it('should have background circle class', () => {
      render(<CircularProgress progress={50} />)

      const bgCircle = document.querySelector('circle.bg')
      expect(bgCircle).toBeInTheDocument()
    })

    it('should have progress circle class', () => {
      render(<CircularProgress progress={50} />)

      const progressCircle = document.querySelector('circle.progress')
      expect(progressCircle).toBeInTheDocument()
    })

    it('should have strokeDasharray style on progress circle', () => {
      render(<CircularProgress progress={50} />)

      const progressCircle = document.querySelector('circle.progress')
      expect(progressCircle.style.strokeDasharray).toBeTruthy()
    })

    it('should have strokeDashoffset style on progress circle', () => {
      render(<CircularProgress progress={50} />)

      const progressCircle = document.querySelector('circle.progress')
      expect(progressCircle.style.strokeDashoffset).toBeDefined()
    })
  })

  describe('CSS classes', () => {
    it('should have circular-progress class on container', () => {
      render(<CircularProgress progress={50} />)

      const container = document.querySelector('.circular-progress')
      expect(container).toBeInTheDocument()
    })

    it('should have circular-progress-text class', () => {
      render(<CircularProgress progress={50} />)

      const textContainer = document.querySelector('.circular-progress-text')
      expect(textContainer).toBeInTheDocument()
    })

    it('should have circular-progress-value class', () => {
      render(<CircularProgress progress={50} />)

      const value = document.querySelector('.circular-progress-value')
      expect(value).toBeInTheDocument()
      expect(value).toHaveTextContent('50%')
    })

    it('should have circular-progress-label class', () => {
      render(<CircularProgress progress={50} />)

      const label = document.querySelector('.circular-progress-label')
      expect(label).toBeInTheDocument()
      expect(label).toHaveTextContent('Year Gone')
    })
  })

  describe('progress arc calculation', () => {
    it('should have full offset at 0% progress', () => {
      render(<CircularProgress progress={0} size={120} strokeWidth={8} />)

      const progressCircle = document.querySelector('circle.progress')
      const radius = (120 - 8) / 2
      const circumference = 2 * Math.PI * radius

      // At 0%, offset should equal circumference (full offset = no visible arc)
      expect(progressCircle.style.strokeDashoffset).toBe(`${circumference}`)
    })

    it('should have zero offset at 100% progress', () => {
      render(<CircularProgress progress={100} size={120} strokeWidth={8} />)

      const progressCircle = document.querySelector('circle.progress')

      // At 100%, offset should be 0 (full arc visible)
      expect(progressCircle.style.strokeDashoffset).toBe('0')
    })

    it('should have half offset at 50% progress', () => {
      render(<CircularProgress progress={50} size={120} strokeWidth={8} />)

      const progressCircle = document.querySelector('circle.progress')
      const radius = (120 - 8) / 2
      const circumference = 2 * Math.PI * radius
      const expectedOffset = circumference - (50 / 100) * circumference

      expect(progressCircle.style.strokeDashoffset).toBe(`${expectedOffset}`)
    })
  })
})
