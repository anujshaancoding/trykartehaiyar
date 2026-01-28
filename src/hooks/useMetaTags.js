import { useEffect } from 'react'

export function useMetaTags({ title, description, image, url, type = 'article' }) {
  useEffect(() => {
    // Update document title
    const originalTitle = document.title
    if (title) {
      document.title = `${title} | TKHY`
    }

    // Helper to update or create meta tag
    const updateMetaTag = (property, content, isName = false) => {
      const attribute = isName ? 'name' : 'property'
      let meta = document.querySelector(`meta[${attribute}="${property}"]`)

      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, property)
        document.head.appendChild(meta)
      }

      meta.setAttribute('content', content)
    }

    // Open Graph tags
    if (title) {
      updateMetaTag('og:title', title)
      updateMetaTag('twitter:title', title)
    }

    if (description) {
      updateMetaTag('og:description', description)
      updateMetaTag('twitter:description', description)
      updateMetaTag('description', description, true)
    }

    if (image) {
      updateMetaTag('og:image', image)
      updateMetaTag('twitter:image', image)
    }

    if (url) {
      updateMetaTag('og:url', url)
    }

    if (type) {
      updateMetaTag('og:type', type)
    }

    updateMetaTag('twitter:card', 'summary_large_image')

    // Cleanup function to restore original title
    return () => {
      document.title = originalTitle
    }
  }, [title, description, image, url, type])
}
