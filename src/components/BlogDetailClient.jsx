"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAllBlogs } from '@/data/blogs'
import ShareButtons from './ShareButtons'
import ReadingControls from './ReadingControls'

export default function BlogDetailClient({ blog, slug }) {
  const [language, setLanguage] = useState('en')

  // Read localStorage after hydration to avoid mismatch
  useEffect(() => {
    const savedLang = localStorage.getItem('blogLanguage')
    if (savedLang) setLanguage(savedLang)
  }, [])

  const allBlogs = getAllBlogs()
  const currentIndex = allBlogs.findIndex(b => b.slug === slug)
  const prevBlog = currentIndex > 0 ? allBlogs[currentIndex - 1] : null
  const nextBlog = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : null

  // Get the current URL for sharing
  const [currentUrl, setCurrentUrl] = useState('')

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    localStorage.setItem('blogLanguage', lang)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const content = blog[language]

  const renderMarkdown = (text) => {
    if (!text) return null

    const lines = text.trim().split('\n')
    const elements = []
    let currentList = []
    let listType = null
    let inBlockquote = false
    let blockquoteContent = []

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="blog-list-items">
            {currentList.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
            ))}
          </ul>
        )
        currentList = []
        listType = null
      }
    }

    const flushBlockquote = () => {
      if (blockquoteContent.length > 0) {
        elements.push(
          <blockquote key={`bq-${elements.length}`} className="blog-blockquote">
            {blockquoteContent.join(' ')}
          </blockquote>
        )
        blockquoteContent = []
        inBlockquote = false
      }
    }

    const parseInline = (text) => {
      return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
    }

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      if (trimmedLine === '') {
        flushList()
        flushBlockquote()
        return
      }

      if (trimmedLine.startsWith('## ')) {
        flushList()
        flushBlockquote()
        elements.push(
          <h2 key={index} className="blog-h2" dangerouslySetInnerHTML={{ __html: parseInline(trimmedLine.slice(3)) }} />
        )
      } else if (trimmedLine.startsWith('### ')) {
        flushList()
        flushBlockquote()
        elements.push(
          <h3 key={index} className="blog-h3" dangerouslySetInnerHTML={{ __html: parseInline(trimmedLine.slice(4)) }} />
        )
      } else if (trimmedLine.startsWith('> ')) {
        flushList()
        blockquoteContent.push(trimmedLine.slice(2))
        inBlockquote = true
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        flushBlockquote()
        currentList.push(trimmedLine.slice(2))
        listType = 'ul'
      } else if (/^\d+\. /.test(trimmedLine)) {
        flushBlockquote()
        currentList.push(trimmedLine.replace(/^\d+\. /, ''))
        listType = 'ol'
      } else if (trimmedLine === '---') {
        flushList()
        flushBlockquote()
        elements.push(<hr key={index} className="blog-divider" />)
      } else {
        flushList()
        flushBlockquote()
        elements.push(
          <p key={index} className="blog-paragraph" dangerouslySetInnerHTML={{ __html: parseInline(trimmedLine) }} />
        )
      }
    })

    flushList()
    flushBlockquote()

    return elements
  }

  return (
    <div className="blog-page blog-detail-page">
      <div className="blog-detail-header">
        <Link href="/blog" className="blog-back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>{language === 'hi' ? 'सभी ब्लॉग' : 'All Blogs'}</span>
        </Link>

        <div className="blog-language-toggle">
          <button
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('en')}
          >
            EN
          </button>
          <button
            className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('hi')}
          >
            हि
          </button>
        </div>
      </div>

      <article className="blog-article">
        <div className="blog-article-hero">
          <img src={blog.coverImage} alt={content.title} className="blog-hero-image" />
          <div className="blog-hero-overlay"></div>
          <div className="blog-hero-content">
            <span className="blog-category-tag">{blog.category}</span>
            <h1 className="blog-article-title">{content.title}</h1>
            <p className="blog-article-subtitle">{content.subtitle}</p>
            <div className="blog-article-meta">
              <span>{formatDate(blog.publishedDate)}</span>
              <span className="meta-dot"></span>
              <span>{blog.readTime} {language === 'hi' ? 'मिनट पढ़ें' : 'min read'}</span>
            </div>
          </div>
        </div>

        <div className="blog-article-body">
          {renderMarkdown(content.content)}
        </div>

        <ShareButtons
          title={content.title}
          excerpt={content.excerpt}
          url={currentUrl}
          coverImage={blog.coverImage}
          language={language}
        />
      </article>

      <nav className="blog-navigation">
        {prevBlog && (
          <Link href={`/blog/${prevBlog.slug}`} className="blog-nav-link blog-nav-prev">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <div className="blog-nav-text">
              <span className="blog-nav-label">{language === 'hi' ? 'पिछला' : 'Previous'}</span>
              <span className="blog-nav-title">{prevBlog[language].title}</span>
            </div>
          </Link>
        )}
        {nextBlog && (
          <Link href={`/blog/${nextBlog.slug}`} className="blog-nav-link blog-nav-next">
            <div className="blog-nav-text">
              <span className="blog-nav-label">{language === 'hi' ? 'अगला' : 'Next'}</span>
              <span className="blog-nav-title">{nextBlog[language].title}</span>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </nav>

      <ReadingControls language={language} />
    </div>
  )
}
