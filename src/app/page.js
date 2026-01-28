import DashboardClient from '@/components/DashboardClient'

// Disable static generation - page uses Supabase data
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return <DashboardClient />
}
