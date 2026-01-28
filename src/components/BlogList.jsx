import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllBlogs } from '../data/blogs'

function BlogList() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('blogLanguage') || 'en'
  })
  const [shareToast, setShareToast] = useState(null)
  const blogs = getAllBlogs()

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

  const handleQuickShare = async (e, blog) => {
    e.preventDefault()
    e.stopPropagation()

    const content = blog[language]
    const blogUrl = `${window.location.origin}/blog/${blog.slug}`
    const shareText = `${content.title}\n\n${content.excerpt}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.excerpt,
          url: blogUrl
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          fallbackShare(blogUrl)
        }
      }
    } else {
      fallbackShare(blogUrl)
    }
  }

  const fallbackShare = async (url) => {
    try {
      await navigator.clipboard.writeText(url)
      setShareToast(language === 'hi' ? 'लिंक कॉपी हो गया!' : 'Link copied!')
      setTimeout(() => setShareToast(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="blog-page">
      <div className="blog-header">
        <Link to="/" className="blog-back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
        </Link>

        <div className="blog-title-section">
          <h1 className="blog-page-title">
            {language === 'hi' ? 'मेरी यात्रा' : 'My Journey'}
          </h1>
          <p className="blog-page-subtitle">
            {language === 'hi'
              ? 'विचार, सीख और जीवन से प्रेरणाएं'
              : 'Thoughts, learnings, and inspirations from life'
            }
          </p>
        </div>

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

      <div className="blog-list">
        {blogs.map((blog) => {
          const content = blog[language]
          return (
            <Link
              to={`/blog/${blog.slug}`}
              key={blog.id}
              className="blog-card"
            >
              <div className="blog-card-image">
                <img src={blog.coverImage} alt={content.title} loading="lazy" />
                <div className="blog-card-category">{blog.category}</div>
                {blog.author && (
                  <div className="blog-card-author">{blog.author}</div>
                )}
                <button
                  className="blog-card-share"
                  onClick={(e) => handleQuickShare(e, blog)}
                  aria-label={language === 'hi' ? 'शेयर करें' : 'Share'}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                </button>
              </div>
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span className="blog-card-date">{formatDate(blog.publishedDate)}</span>
                  <span className="blog-card-dot"></span>
                  <span className="blog-card-time">
                    {blog.readTime} {language === 'hi' ? 'मिनट पढ़ें' : 'min read'}
                  </span>
                </div>
                <h2 className="blog-card-title">{content.title}</h2>
                <p className="blog-card-excerpt">{content.excerpt}</p>
                <div className="blog-card-read-more">
                  {language === 'hi' ? 'पढ़ना जारी रखें' : 'Continue Reading'}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {shareToast && (
        <div className="share-toast">{shareToast}</div>
      )}
    </div>
  )
}

export default BlogList
