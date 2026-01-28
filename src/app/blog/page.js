import BlogListClient from '@/components/BlogListClient'

export const metadata = {
  title: 'Blog | Try Karte Hai Yar',
  description: 'Thoughts, learnings, and inspirations from life. Read our bilingual blogs in English and Hindi.',
  openGraph: {
    title: 'Blog | Try Karte Hai Yar',
    description: 'Thoughts, learnings, and inspirations from life. Read our bilingual blogs in English and Hindi.',
    url: 'https://trykartehain.com/blog',
    siteName: 'Try Karte Hai Yar',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Try Karte Hai Yar',
    description: 'Thoughts, learnings, and inspirations from life.',
  },
}

export default function BlogPage() {
  return <BlogListClient />
}
