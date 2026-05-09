import Landing from '@/components/landing/Landing'

// Renders client-side state (clock, vibe, community feed). Skip static caching
// so the live numbers don't get frozen at build time.
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return <Landing />
}
