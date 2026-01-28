import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useActiveUsers() {
  const [activeUsers, setActiveUsers] = useState(0)

  useEffect(() => {
    if (!supabase) return

    const channel = supabase.channel('active-users', {
      config: {
        presence: {
          key: crypto.randomUUID(),
        },
      },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const count = Object.keys(state).length
        setActiveUsers(count)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() })
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return activeUsers
}
