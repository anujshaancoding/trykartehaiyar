import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// Default visits data to show baseline activity (added to database counts)
const DEFAULT_VISITS = [
  { date: '2026-01-26', visit_count: 22 },
  { date: '2026-01-27', visit_count: 31 }
]

export function useDailyVisits() {
  const [visitsData, setVisitsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('month') // 'month', 'year', 'all'

  // Track a visit when component mounts
  useEffect(() => {
    const trackVisit = async () => {
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
      const sessionKey = `visited_${today}`

      // Only track once per session per day
      if (sessionStorage.getItem(sessionKey)) {
        return
      }

      try {
        // First, try to get today's record
        const { data: existing } = await supabase
          .from('daily_visits')
          .select('id, visit_count')
          .eq('date', today)
          .single()

        if (existing) {
          // Update existing record
          await supabase
            .from('daily_visits')
            .update({ visit_count: existing.visit_count + 1 })
            .eq('id', existing.id)
        } else {
          // Insert new record
          await supabase
            .from('daily_visits')
            .insert({ date: today, visit_count: 1 })
        }

        sessionStorage.setItem(sessionKey, 'true')
      } catch (error) {
        // Silently fail - don't break the app if tracking fails
        console.error('Failed to track visit:', error)
      }
    }

    trackVisit()
  }, [])

  // Fetch visits data based on filter
  const fetchVisits = useCallback(async () => {
    setLoading(true)

    try {
      let startDate
      const now = new Date()

      if (filter === 'month') {
        // First day of current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      } else if (filter === 'year') {
        // First day of current year
        startDate = new Date(now.getFullYear(), 0, 1)
      }
      // 'all' - no start date filter

      let query = supabase
        .from('daily_visits')
        .select('date, visit_count')
        .order('date', { ascending: true })

      if (startDate) {
        query = query.gte('date', startDate.toISOString().split('T')[0])
      }

      const { data, error } = await query

      if (error) {
        console.error('Failed to fetch visits:', error)
        setVisitsData([])
      } else {
        // Merge database data with default visits
        const dbData = data || []
        const mergedDataMap = new Map()

        // First add default visits
        DEFAULT_VISITS.forEach(item => {
          mergedDataMap.set(item.date, item.visit_count)
        })

        // Then add/merge database visits (database values add to defaults)
        dbData.forEach(item => {
          const existing = mergedDataMap.get(item.date) || 0
          mergedDataMap.set(item.date, existing + item.visit_count)
        })

        // Convert map to array and sort by date
        const mergedData = Array.from(mergedDataMap.entries())
          .map(([date, visit_count]) => ({ date, visit_count }))
          .sort((a, b) => new Date(a.date) - new Date(b.date))

        // Filter by start date if applicable
        const filteredData = startDate
          ? mergedData.filter(item => item.date >= startDate.toISOString().split('T')[0])
          : mergedData

        // Format data for the chart
        const formattedData = filteredData.map(item => ({
          date: item.date,
          visits: item.visit_count,
          // Format date for display
          displayDate: formatDate(item.date, filter)
        }))
        setVisitsData(formattedData)
      }
    } catch (error) {
      console.error('Failed to fetch visits:', error)
      setVisitsData([])
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchVisits()
  }, [fetchVisits])

  return {
    visitsData,
    loading,
    filter,
    setFilter,
    refetch: fetchVisits
  }
}

function formatDate(dateStr, filter) {
  const date = new Date(dateStr)

  if (filter === 'month') {
    // Show day number (e.g., "1", "15", "31")
    return date.getDate().toString()
  } else if (filter === 'year') {
    // Show month abbreviation (e.g., "Jan", "Feb")
    return date.toLocaleDateString('en-US', { month: 'short' })
  } else {
    // Show month/year (e.g., "Jan '24")
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }
}
