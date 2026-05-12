'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import dynamic from 'next/dynamic'
import './styles.css'

const HalfGlobe = dynamic(() => import('./components/HalfGlobe'), {
  ssr: false,
  loading: () => <div className="globe-loading">Loading globe...</div>
})

export default function Landing2() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
    // TODO: Implement search functionality
  }

  return (
    <div className="landing2-page">
      {/* Hero Section with Half Globe */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="hero-title">
              WINWINLAW.COM
            </h1>
            <div className="hero-divider">- - -</div>
            <h2 className="hero-subtitle">
              GLOBAL LITIGATIONS, MEDIATIONS & ARBITRATIONS
            </h2>

            {/* Search Box */}
            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-box">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search lawyers, legal issues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">
                  Search
                </button>
              </div>
            </form>

            <p className="hero-description">
              Connect with legal professionals worldwide for litigation, mediation, and arbitration services.
              Find expert lawyers specializing in international disputes and cross-border legal matters.
            </p>
          </div>

          <div className="hero-right">
            <HalfGlobe />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Our Global Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">⚖️</div>
              <h3 className="service-title">Global Litigation</h3>
              <p className="service-description">
                Expert representation in cross-border disputes and international court proceedings.
                Our network of litigation specialists ensures your interests are protected worldwide.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">🤝</div>
              <h3 className="service-title">Mediation Services</h3>
              <p className="service-description">
                Resolve disputes efficiently through professional mediation. Our experienced mediators
                facilitate agreements that work for all parties involved.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">⚡</div>
              <h3 className="service-title">International Arbitration</h3>
              <p className="service-description">
                Swift and binding resolution of international commercial disputes. Access to leading
                arbitrators with expertise in various legal systems and industries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-section">
        <div className="container">
          <h2 className="section-title">Why Choose WinWin Law</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-number">150+</div>
              <div className="feature-label">Countries Covered</div>
            </div>
            <div className="feature-item">
              <div className="feature-number">10,000+</div>
              <div className="feature-label">Legal Professionals</div>
            </div>
            <div className="feature-item">
              <div className="feature-number">24/7</div>
              <div className="feature-label">Global Support</div>
            </div>
            <div className="feature-item">
              <div className="feature-number">98%</div>
              <div className="feature-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-description">
            Find the right legal professional for your case today
          </p>
          <form className="cta-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search lawyers, legal issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cta-search-input"
            />
            <button type="submit" className="cta-search-button">
              Get Started
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <h3 className="footer-logo">WINWINLAW.COM</h3>
              <p className="footer-tagline">Global Legal Solutions</p>
            </div>
            <div className="footer-right">
              <p className="footer-copyright">
                © 2026 WinWin Law. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
