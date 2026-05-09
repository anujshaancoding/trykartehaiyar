import { getProjectBySlug, getAllProjects } from '@/data/projects'
import ProjectDetailClient from '@/components/ProjectDetailClient'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const projects = getAllProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    return { title: 'Project Not Found | TKHY' }
  }

  const baseUrl = 'https://trykartehain.com'

  return {
    title: `${project.title} | TKHY Projects`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `${baseUrl}/projects/${slug}`,
      siteName: 'Try Karte Hai Yar',
      images: [
        {
          url: project.screenshots[0],
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [project.screenshots[0]],
    },
  }
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return <ProjectDetailClient project={project} />
}
