"use client"

import { useState } from 'react'
import Link from 'next/link'
import { getAllProjects } from '@/data/projects'

export default function ProjectsListClient() {
  const [filter, setFilter] = useState('All')
  const projects = getAllProjects()

  const categories = ['All', ...new Set(projects.map((p) => p.category))]
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div className="projects-page">
      <div className="projects-header">
        <Link href="/" className="blog-back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </Link>

        <div className="projects-title-section">
          <h1 className="projects-page-title">Projects</h1>
          <p className="projects-page-subtitle">
            Real-world source code you can learn from and build upon
          </p>
        </div>
      </div>

      <div className="projects-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`projects-filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filtered.map((project) => (
          <Link
            href={`/projects/${project.slug}`}
            key={project.id}
            className="project-card"
          >
            <div className="project-card-image">
              <img src={project.screenshots[0]} alt={project.title} loading="lazy" />
              <div className="project-card-price">
                <span className="project-card-rupee">&#8377;</span>
                {project.priceInr}
              </div>
              <div className="project-card-difficulty" data-level={project.difficulty.toLowerCase()}>
                {project.difficulty}
              </div>
            </div>
            <div className="project-card-body">
              <div className="project-card-category">{project.category}</div>
              <h2 className="project-card-title">{project.title}</h2>
              <p className="project-card-subtitle">{project.subtitle}</p>
              <div className="project-card-tech">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span key={tech} className="project-tech-tag">{tech}</span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="project-tech-tag project-tech-more">
                    +{project.techStack.length - 3}
                  </span>
                )}
              </div>
              <div className="project-card-cta">
                View Details
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
