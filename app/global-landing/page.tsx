'use client'

import dynamic from 'next/dynamic'
import './styles.css'

const InteractiveGlobe = dynamic(() => import('./components/GlobeWithFallback'), {
  ssr: false
})

export default function GlobalLandingPage() {
  return (
    <main className="global-landing-page">
      {/* Animated Background */}
      <div className="cosmic-background">
        <div className="star-field"></div>
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <h1 className="main-title">
            <span className="title-line">Global Legal</span>
            <span className="title-line title-highlight">Network</span>
          </h1>
          <p className="subtitle">
            Connecting legal professionals across <span className="stat-highlight">150+ countries</span>
          </p>
        </div>
      </header>

      {/* Globe Container */}
      <div className="globe-container">
        <InteractiveGlobe />
      </div>

      {/* Instructions */}
      <div className="interaction-hints">
        <div className="hint">
          <div className="hint-icon">↻</div>
          <span>Drag to rotate</span>
        </div>
        <div className="hint">
          <div className="hint-icon">⊕</div>
          <span>Scroll to zoom</span>
        </div>
        <div className="hint">
          <div className="hint-icon">☝</div>
          <span>Hover for details</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-value">47,892</div>
          <div className="stat-label">Legal Professionals</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-value">153</div>
          <div className="stat-label">Countries</div>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-item">
          <div className="stat-value">89%</div>
          <div className="stat-label">Active Network</div>
        </div>
      </div>
    </main>
  )
}
