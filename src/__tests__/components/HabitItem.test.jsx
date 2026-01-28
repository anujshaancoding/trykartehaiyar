import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HabitItem from '../../components/HabitItem'

describe('HabitItem', () => {
  const mockHabit = {
    id: 1,
    icon: '💪',
    text: 'Workout',
  }

  const defaultProps = {
    habit: mockHabit,
    isCompleted: false,
    onToggle: jest.fn(),
    onDelete: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render the habit item', () => {
      render(<HabitItem {...defaultProps} />)

      expect(screen.getByText('Workout')).toBeInTheDocument()
    })

    it('should render the habit icon', () => {
      render(<HabitItem {...defaultProps} />)

      expect(screen.getByText('💪')).toBeInTheDocument()
    })

    it('should render as a list item', () => {
      render(<HabitItem {...defaultProps} />)

      expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('should have checkbox role', () => {
      render(<HabitItem {...defaultProps} />)

      const item = screen.getByRole('checkbox')
      expect(item).toBeInTheDocument()
    })

    it('should render delete button', () => {
      render(<HabitItem {...defaultProps} />)

      expect(
        screen.getByRole('button', { name: /delete workout/i })
      ).toBeInTheDocument()
    })
  })

  describe('completion state', () => {
    it('should have aria-checked false when not completed', () => {
      render(<HabitItem {...defaultProps} isCompleted={false} />)

      const item = screen.getByRole('checkbox')
      expect(item).toHaveAttribute('aria-checked', 'false')
    })

    it('should have aria-checked true when completed', () => {
      render(<HabitItem {...defaultProps} isCompleted={true} />)

      const item = screen.getByRole('checkbox')
      expect(item).toHaveAttribute('aria-checked', 'true')
    })

    it('should have completed class when completed', () => {
      render(<HabitItem {...defaultProps} isCompleted={true} />)

      const item = screen.getByRole('checkbox')
      expect(item).toHaveClass('completed')
    })

    it('should not have completed class when not completed', () => {
      render(<HabitItem {...defaultProps} isCompleted={false} />)

      const item = screen.getByRole('checkbox')
      expect(item).not.toHaveClass('completed')
    })
  })

  describe('toggle interaction', () => {
    it('should call onToggle when clicked', async () => {
      const user = userEvent.setup()
      const onToggle = jest.fn()

      render(<HabitItem {...defaultProps} onToggle={onToggle} />)

      await user.click(screen.getByRole('checkbox'))

      expect(onToggle).toHaveBeenCalledTimes(1)
    })

    it('should call onToggle when Enter key is pressed', () => {
      const onToggle = jest.fn()

      render(<HabitItem {...defaultProps} onToggle={onToggle} />)

      const item = screen.getByRole('checkbox')
      fireEvent.keyDown(item, { key: 'Enter' })

      expect(onToggle).toHaveBeenCalledTimes(1)
    })

    it('should call onToggle when Space key is pressed', () => {
      const onToggle = jest.fn()

      render(<HabitItem {...defaultProps} onToggle={onToggle} />)

      const item = screen.getByRole('checkbox')
      fireEvent.keyDown(item, { key: ' ' })

      expect(onToggle).toHaveBeenCalledTimes(1)
    })

    it('should not call onToggle for other keys', () => {
      const onToggle = jest.fn()

      render(<HabitItem {...defaultProps} onToggle={onToggle} />)

      const item = screen.getByRole('checkbox')
      fireEvent.keyDown(item, { key: 'a' })

      expect(onToggle).not.toHaveBeenCalled()
    })
  })

  describe('delete interaction', () => {
    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup()
      const onDelete = jest.fn()

      render(<HabitItem {...defaultProps} onDelete={onDelete} />)

      await user.click(screen.getByRole('button', { name: /delete workout/i }))

      expect(onDelete).toHaveBeenCalledTimes(1)
    })

    it('should not trigger onToggle when delete button is clicked', async () => {
      const user = userEvent.setup()
      const onToggle = jest.fn()
      const onDelete = jest.fn()

      render(
        <HabitItem {...defaultProps} onToggle={onToggle} onDelete={onDelete} />
      )

      await user.click(screen.getByRole('button', { name: /delete workout/i }))

      expect(onDelete).toHaveBeenCalledTimes(1)
      expect(onToggle).not.toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('should be focusable', () => {
      render(<HabitItem {...defaultProps} />)

      const item = screen.getByRole('checkbox')
      expect(item).toHaveAttribute('tabIndex', '0')
    })

    it('should have accessible name for delete button', () => {
      render(<HabitItem {...defaultProps} />)

      const deleteButton = screen.getByRole('button', {
        name: /delete workout/i,
      })
      expect(deleteButton).toHaveAttribute('aria-label', 'Delete Workout')
    })

    it('should have title on delete button', () => {
      render(<HabitItem {...defaultProps} />)

      const deleteButton = screen.getByRole('button', {
        name: /delete workout/i,
      })
      expect(deleteButton).toHaveAttribute('title', 'Delete')
    })
  })

  describe('CSS classes', () => {
    it('should have habit-item class', () => {
      render(<HabitItem {...defaultProps} />)

      const item = screen.getByRole('checkbox')
      expect(item).toHaveClass('habit-item')
    })

    it('should have habit-checkbox class on checkbox element', () => {
      render(<HabitItem {...defaultProps} />)

      const checkbox = document.querySelector('.habit-checkbox')
      expect(checkbox).toBeInTheDocument()
    })

    it('should have habit-icon class on icon element', () => {
      render(<HabitItem {...defaultProps} />)

      const icon = document.querySelector('.habit-icon')
      expect(icon).toBeInTheDocument()
    })

    it('should have habit-text class on text element', () => {
      render(<HabitItem {...defaultProps} />)

      const text = document.querySelector('.habit-text')
      expect(text).toBeInTheDocument()
    })

    it('should have habit-delete-btn class on delete button', () => {
      render(<HabitItem {...defaultProps} />)

      const deleteBtn = document.querySelector('.habit-delete-btn')
      expect(deleteBtn).toBeInTheDocument()
    })
  })

  describe('different habits', () => {
    it('should render different habit text', () => {
      const habit = { id: 2, icon: '📚', text: 'Read 30 minutes' }

      render(<HabitItem {...defaultProps} habit={habit} />)

      expect(screen.getByText('Read 30 minutes')).toBeInTheDocument()
    })

    it('should render different habit icon', () => {
      const habit = { id: 3, icon: '🎯', text: 'Deep Work' }

      render(<HabitItem {...defaultProps} habit={habit} />)

      expect(screen.getByText('🎯')).toBeInTheDocument()
    })
  })
})
