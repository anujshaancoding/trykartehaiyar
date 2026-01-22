import { useState } from 'react'
import { useActiveUsers } from '../hooks/useActiveUsers'
import VisitsGraph from './VisitsGraph'

function ActiveUsers() {
  const activeUsers = useActiveUsers()
  const [showGraph, setShowGraph] = useState(false)

  return (
    <>
      <div className="active-users">
        <span className="active-users-dot"></span>
        <span className="active-users-count">{activeUsers}</span>
        <span className="active-users-label">viewing</span>
        <button
          className="active-users-graph-btn"
          onClick={() => setShowGraph(true)}
          title="View visitor analytics"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18" />
            <path d="M18 9l-5 5-4-4-3 3" />
          </svg>
        </button>
      </div>

      {showGraph && <VisitsGraph onClose={() => setShowGraph(false)} />}
    </>
  )
}

export default ActiveUsers
