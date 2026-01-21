import { useActiveUsers } from '../hooks/useActiveUsers'

function ActiveUsers() {
  const activeUsers = useActiveUsers()

  return (
    <div className="active-users">
      <span className="active-users-dot"></span>
      <span className="active-users-count">{activeUsers}</span>
      <span className="active-users-label">viewing</span>
    </div>
  )
}

export default ActiveUsers
