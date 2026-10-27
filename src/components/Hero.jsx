import React from 'react';
import { Globe, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-section">
      {/* Top Navbar */}
      <header className="hero-header">
        <div className="hero-brand">
          <span className="brand-primary">WEB DESIGNER &amp; DIGITAL MARKETER</span>
          <span className="brand-secondary">DIGITAL CREATOR</span>
        </div>
        <div className="hero-status">
          <span className="status-text">AVAILABLE FOR FREELANCE</span>
          <span className="status-sparkle">✦</span>
        </div>
      </header>

      {/* Giant Background PORTFOLIO typography */}
      <div className="hero-backdrop-title" aria-hidden="true">
        PORTFOLIO
      </div>

      {/* Hero Foreground Content Overlay */}
      <div className="hero-content-grid">
        {/* Left Column: Bio & Intro */}
        <div className="hero-left">
          <div className="hero-greeting">Hello, I'm</div>
          <h1 className="hero-name">
            SUSANTA<br />KUMAR BADATYA
          </h1>
          <h2 className="hero-role">
            WEB DESIGNER &amp; DIGITAL MARKETING
          </h2>
          <p className="hero-bio">
            I design and build stylish, user-focused web experiences and high-converting
            digital marketing strategies that combine creativity with data-driven results.
          </p>
          <div className="hero-badge">
            <Globe size={14} className="badge-icon" />
            <span>AVAILABLE WORLDWIDE</span>
          </div>
        </div>

        {/* Right Column: Tagline & Stats */}
        <div className="hero-right">
          <div className="tagline-box">
            <Sparkles size={16} className="tagline-sparkle" />
            <p className="tagline-text">
              Turning ideas into powerful digital experiences.
            </p>
          </div>

          <div className="stats-stack">
            <div className="stat-item">
              <span className="stat-number">1</span>
              <span className="stat-label">
                YEAR EXP. IN<br />DIGITAL MARKETING
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">
                PROJECTS<br />COMPLETED
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">
                HAPPY<br />CLIENTS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
