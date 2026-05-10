import { Suspense } from 'react'
import ComingSoon from '@/components/ComingSoon'

export const metadata = {
  title: 'Coming Soon · trykartehaiyar',
  description: 'This portal is still under construction. Come back soon.',
}

export default function ComingSoonPage() {
  return (
    <Suspense fallback={null}>
      <ComingSoon />
    </Suspense>
  )
}
