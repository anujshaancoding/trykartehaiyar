import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function Leaderboard() {
  const [leaders, setLeaders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('points', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error fetching leaderboard:', error)
      } else {
        setLeaders(data || [])
      }
      setIsLoading(false)
    }

    fetchLeaderboard()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('leaderboard_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leaderboard' },
        () => {
          fetchLeaderboard()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const getRankEmoji = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return `#${index + 1}`
  }

  const getRankClass = (index) => {
    if (index === 0) return 'rank-gold'
    if (index === 1) return 'rank-silver'
    if (index === 2) return 'rank-bronze'
    return ''
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h3 className="leaderboard-title">Leaderboard</h3>
        <div className="leaderboard-info-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <div className="leaderboard-tooltip">
            <p className="leaderboard-tooltip-title">How to earn points:</p>
            <ul className="leaderboard-tooltip-list">
              <li><span className="points-high">+20</span> Complete a task</li>
              <li><span className="points-medium">+1</span> Per minute on site</li>
              <li><span className="points-low">+5</span> Post a message</li>
            </ul>
          </div>
        </div>
      </div>
      <p className="leaderboard-subtitle">Top contributors</p>

      <div className="leaderboard-list">
        {isLoading ? (
          <p className="leaderboard-loading">Loading...</p>
        ) : leaders.length === 0 ? (
          <p className="leaderboard-empty">No leaders yet. Start earning points!</p>
        ) : (
          leaders.map((leader, index) => (
            <div key={leader.id} className={`leaderboard-item ${getRankClass(index)}`}>
              <span className="leaderboard-rank">{getRankEmoji(index)}</span>
              <span className="leaderboard-name">{leader.name}</span>
              <span className="leaderboard-points">{leader.points} pts</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Leaderboard
