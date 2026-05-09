"use client"

import { useState, useCallback } from 'react'
import Link from 'next/link'

export default function ProjectDetailClient({ project }) {
  const [currentImage, setCurrentImage] = useState(0)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [purchased, setPurchased] = useState(false)
  const [error, setError] = useState(null)

  const handlePurchase = useCallback(async () => {
    setPaymentLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          amount: project.priceInr,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: 'INR',
        name: 'Try Karte Hai Yar',
        description: `${project.title} - Source Code`,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                projectId: project.id,
              }),
            })

            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              setPurchased(true)
              window.open(verifyData.downloadUrl, '_blank')
            } else {
              setError('Payment verification failed. Contact support.')
            }
          } catch (err) {
            setError('Verification error. Contact support if amount was deducted.')
          }
        },
        prefill: {},
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false)
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err) {
      setError(err.message)
    } finally {
      setPaymentLoading(false)
    }
  }, [project])

  const handleDownload = useCallback(async () => {
    try {
      const res = await fetch(`/api/download/${project.id}`)
      const data = await res.json()
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank')
      }
    } catch (err) {
      setError('Download failed. Please try again.')
    }
  }, [project.id])

  return (
    <div className="project-detail-page">
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="project-detail-header">
        <Link href="/projects" className="blog-back-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back to Projects</span>
        </Link>
      </div>

      <div className="project-detail-layout">
        {/* Left: Screenshots Gallery */}
        <div className="project-gallery">
          <div className="project-gallery-main">
            <img
              src={project.screenshots[currentImage]}
              alt={`${project.title} screenshot ${currentImage + 1}`}
            />
          </div>
          <div className="project-gallery-thumbs">
            {project.screenshots.map((src, i) => (
              <button
                key={i}
                className={`project-thumb ${currentImage === i ? 'active' : ''}`}
                onClick={() => setCurrentImage(i)}
              >
                <img src={src} alt={`Thumbnail ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="project-detail-info">
          <div className="project-detail-category">{project.category}</div>
          <h1 className="project-detail-title">{project.title}</h1>
          <p className="project-detail-subtitle">{project.subtitle}</p>

          <div className="project-detail-meta">
            <span className="project-detail-difficulty" data-level={project.difficulty.toLowerCase()}>
              {project.difficulty}
            </span>
            <span className="project-detail-date">
              {new Date(project.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
              })}
            </span>
          </div>

          {/* Live Demo Button */}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="project-demo-btn"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              Live Demo
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="project-demo-external">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          )}

          <div className="project-detail-price-box">
            <div className="project-detail-price">
              <span className="project-price-rupee">&#8377;</span>
              <span className="project-price-amount">{project.priceInr}</span>
              <span className="project-price-label">one-time</span>
            </div>

            {error && <div className="project-error">{error}</div>}

            {purchased ? (
              <button className="project-buy-btn project-buy-btn--success" onClick={handleDownload}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Download Again
              </button>
            ) : (
              <button
                className="project-buy-btn"
                onClick={handlePurchase}
                disabled={paymentLoading}
              >
                {paymentLoading ? (
                  <span className="project-buy-loading">Processing...</span>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    Buy &amp; Download — &#8377;{project.priceInr}
                  </>
                )}
              </button>
            )}

            <p className="project-payment-note">
              Secure payment via Razorpay (UPI, Cards, NetBanking)
            </p>
          </div>

          <div className="project-detail-description">
            <h3>About this project</h3>
            <p>{project.description}</p>
          </div>

          <div className="project-detail-section">
            <h3>Tech Stack</h3>
            <div className="project-tech-list">
              {project.techStack.map((tech) => (
                <span key={tech} className="project-tech-tag">{tech}</span>
              ))}
            </div>
          </div>

          <div className="project-detail-section">
            <h3>Features</h3>
            <ul className="project-features-list">
              {project.features.map((feature, i) => (
                <li key={i}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="project-detail-section">
            <h3>What&apos;s Included</h3>
            <ul className="project-includes-list">
              {project.includes.map((item, i) => (
                <li key={i}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
