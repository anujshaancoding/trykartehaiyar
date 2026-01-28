import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="blog-page blog-not-found" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h1>
      <p style={{ marginBottom: '2rem', opacity: 0.7 }}>The page you're looking for doesn't exist.</p>
      <Link href="/" className="blog-back-btn" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        background: 'var(--accent-orange)',
        borderRadius: '8px',
        textDecoration: 'none'
      }}>
        Go Home
      </Link>
    </div>
  )
}
