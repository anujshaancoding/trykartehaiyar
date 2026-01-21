import { useProgress } from '../hooks/useProgress'
import ProgressBar from './ProgressBar'
import CircularProgress from './CircularProgress'

function ProgressSection() {
  const {
    daysLeftMonth,
    daysLeftYear,
    monthProgress,
    yearProgress,
    monthSubtext,
    yearSubtext,
    currentYear,
    yearMessage
  } = useProgress()

  return (
    <section className="progress-section" aria-label="Time progress tracking">
      <h2 className="section-title">Time Remaining</h2>

      {/* Month Progress */}
      <div className="progress-item">
        <div className="progress-header">
          <span className="progress-label">
            <span className="icon">🔥</span>
            Days left this month
          </span>
          <span className="progress-value month">{daysLeftMonth}</span>
        </div>
        <ProgressBar progress={monthProgress} variant="month" />
        <p className="progress-subtext">{monthSubtext}</p>
      </div>

      {/* Year Progress */}
      <div className="progress-item">
        <div className="progress-header">
          <span className="progress-label">
            <span className="icon">🚀</span>
            Days left this year
          </span>
          <span className="progress-value year">{daysLeftYear}</span>
        </div>
        <ProgressBar progress={yearProgress} variant="year" />
        <p className="progress-subtext">{yearSubtext}</p>
      </div>

      {/* Circular Year Progress */}
      <div className="circular-progress-container">
        <CircularProgress progress={yearProgress} />
        <div className="year-info">
          <h3>Year {currentYear}</h3>
          <p>{yearMessage}</p>
        </div>
      </div>
    </section>
  )
}

export default ProgressSection
