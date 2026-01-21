import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useFeedbackCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from('feedback')
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Error fetching feedback count:', error)
      } else if (count !== null) {
        setCount(count)
      }
    }

    fetchCount()
  }, [])

  return count
}
