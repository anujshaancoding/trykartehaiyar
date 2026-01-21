function ProgressBar({ progress, variant = 'default' }) {
  return (
    <div className="progress-bar-container">
      <div
        className={`progress-bar ${variant}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default ProgressBar
