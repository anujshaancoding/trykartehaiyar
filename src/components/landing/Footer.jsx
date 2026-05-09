"use client"

export default function Footer() {
  return (
    <div
      style={{
        marginTop: 60,
        paddingTop: 24,
        borderTop: '1px solid var(--tk2-line-soft)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
        fontSize: 12,
        color: 'var(--tk2-fg-3)',
        flexWrap: 'wrap',
      }}
    >
      <span className="tk2-mono">tkhy · trykartehaiyar.com</span>
      <span style={{ textAlign: 'center' }}>Built for the ones still trying.</span>
      <span className="tk2-mono">v2.0 · 2026</span>
    </div>
  )
}
