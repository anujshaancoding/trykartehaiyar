import ProjectsListClient from '@/components/ProjectsListClient'

export const metadata = {
  title: 'Projects | Try Karte Hai Yar',
  description: 'Download real-world project source code. Learn by building — weather apps, expense trackers, portfolios, and more.',
  openGraph: {
    title: 'Projects | Try Karte Hai Yar',
    description: 'Download real-world project source code. Learn by building.',
    url: 'https://trykartehain.com/projects',
    siteName: 'Try Karte Hai Yar',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Try Karte Hai Yar',
    description: 'Download real-world project source code. Learn by building.',
  },
}

export default function ProjectsPage() {
  return <ProjectsListClient />
}
