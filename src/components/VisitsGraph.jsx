import { useState } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useDailyVisits } from '../hooks/useDailyVisits'

function VisitsGraph({ onClose }) {
  const { visitsData, loading, filter, setFilter } = useDailyVisits()

  const totalVisits = visitsData.reduce((sum, item) => sum + item.visits, 0)
  const avgVisits = visitsData.length > 0
    ? Math.round(totalVisits / visitsData.length)
    : 0

  const filterLabels = {
    month: 'This Month',
    year: 'This Year',
    all: 'All Time'
  }

  return (
    <div className="visits-graph-overlay" onClick={onClose}>
      <div className="visits-graph-modal" onClick={e => e.stopPropagation()}>
        <button className="visits-graph-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="visits-graph-header">
          <h2 className="visits-graph-title">Visitor Analytics</h2>
          <p className="visits-graph-subtitle">Track daily visitor trends</p>
        </div>

        <div className="visits-graph-filters">
          {['month', 'year', 'all'].map(f => (
            <button
              key={f}
              className={`visits-graph-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>

        <div className="visits-graph-stats">
          <div className="visits-graph-stat">
            <span className="visits-graph-stat-value">{totalVisits}</span>
            <span className="visits-graph-stat-label">Total Visits</span>
          </div>
          <div className="visits-graph-stat">
            <span className="visits-graph-stat-value">{avgVisits}</span>
            <span className="visits-graph-stat-label">Avg/Day</span>
          </div>
          <div className="visits-graph-stat">
            <span className="visits-graph-stat-value">{visitsData.length}</span>
            <span className="visits-graph-stat-label">Days Tracked</span>
          </div>
        </div>

        <div className="visits-graph-chart">
          {loading ? (
            <div className="visits-graph-loading">Loading data...</div>
          ) : visitsData.length === 0 ? (
            <div className="visits-graph-empty">
              No visit data available yet.
              <br />
              <span>Data will appear after your first visitors.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={visitsData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                  vertical={false}
                />
                <XAxis
                  dataKey="displayDate"
                  stroke="#606065"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#606065"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="visits"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fill="url(#visitGradient)"
                  dot={{ fill: '#a855f7', strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: '#a855f7' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) {
    return null
  }

  const data = payload[0].payload

  return (
    <div className="visits-graph-tooltip">
      <p className="visits-graph-tooltip-date">{data.date}</p>
      <p className="visits-graph-tooltip-value">
        <span>{data.visits}</span> visits
      </p>
    </div>
  )
}

export default VisitsGraph
