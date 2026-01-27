import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Default feedback count offset (added to database count)
const DEFAULT_FEEDBACK_COUNT = 23

export function useFeedbackCount() {
  const [count, setCount] = useState(DEFAULT_FEEDBACK_COUNT)

  useEffect(() => {
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Error fetching feedback count:', error)
      } else if (count !== null) {
        setCount(DEFAULT_FEEDBACK_COUNT + count)
      }
    }

    fetchCount()
  }, [])

  return count
}
