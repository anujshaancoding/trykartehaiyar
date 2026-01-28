import { getBlogBySlug, getAllBlogs } from '@/data/blogs'
import BlogDetailClient from '@/components/BlogDetailClient'
import { notFound } from 'next/navigation'

// Generate static params for all blog slugs
export async function generateStaticParams() {
  const blogs = getAllBlogs()
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

// Dynamic metadata generation - THIS FIXES WHATSAPP/SOCIAL SHARING
export async function generateMetadata({ params }) {
  const { slug } = await params
  const blog = getBlogBySlug(slug)

  if (!blog) {
    return {
      title: 'Blog Not Found | TKHY',
    }
  }

  // Use English content for Open Graph (crawlers don't execute JS)
  const content = blog.en
  const baseUrl = 'https://trykartehain.com'

  return {
    title: `${content.title} | TKHY`,
    description: content.excerpt,
    openGraph: {
      title: content.title,
      description: content.excerpt,
      url: `${baseUrl}/blog/${slug}`,
      siteName: 'Try Karte Hai Yar',
      images: [
        {
          url: blog.coverImage,
          width: 1200,
          height: 630,
          alt: content.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: blog.publishedDate,
      authors: [blog.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.excerpt,
      images: [blog.coverImage],
    },
  }
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params
  const blog = getBlogBySlug(slug)

  if (!blog) {
    notFound()
  }

  // Pass blog data to client component
  return <BlogDetailClient blog={blog} slug={slug} />
}
