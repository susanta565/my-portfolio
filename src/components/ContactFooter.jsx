import React from 'react';
import { Mail, Globe, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function ContactFooter() {
  return (
    <footer className="contact-section">
      <div className="contact-grid">
        {/* Left Column: CTA & Info */}
        <div className="contact-left">
          <div className="contact-heading-wrap">
            <h2 className="contact-heading">
              LET'S WORK<br />TOGETHER
            </h2>
            <span className="contact-sparkle">✦</span>
          </div>

          <p className="contact-subtext">
            I'm currently open for new projects and collaborations. Let's create
            something amazing that drives results.
          </p>

          <a href="mailto:susantabadatya440@gmail.com" className="contact-cta-btn">
            <ArrowRight size={15} className="cta-arrow" />
            <span>AVAILABLE FOR FREELANCE</span>
          </a>
        </div>

        {/* Middle Column: Contact Details */}
        <div className="contact-details-col">
          <a href="mailto:susantabadatya440@gmail.com" className="contact-row">
            <div className="contact-icon-circle">
              <Mail size={16} />
            </div>
            <span className="contact-value">susantabadatya440@gmail.com</span>
          </a>

          <a
            href="https://www.susantabadatya.com"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-row"
          >
            <div className="contact-icon-circle">
              <Globe size={16} />
            </div>
            <span className="contact-value">www.susantabadatya.com</span>
          </a>

          <a href="tel:+918144557789" className="contact-row">
            <div className="contact-icon-circle">
              <Phone size={16} />
            </div>
            <span className="contact-value">+91 8144557789</span>
          </a>

          <div className="contact-row">
            <div className="contact-icon-circle">
              <MapPin size={16} />
            </div>
            <span className="contact-value">Bhubaneswar, India</span>
          </div>
        </div>

        {/* Right Column: Workstation Mockup */}
        <div className="contact-mockup-col">
          <div className="mockup-frame">
            <img
              src="/assets/contact-laptop.jpg"
              alt="Digital Experiences Laptop Mockup"
              className="mockup-img"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Highlighted Portfolio Creator Section */}
      <div className="portfolio-creator-banner">
        <div className="creator-badge-inner">
          <span className="creator-sparkle">✦</span>
          <span className="creator-label">PORTFOLIO CREATED BY</span>
          <span className="creator-highlight-name">SUSANTA KUMAR BADATYA</span>
          <span className="creator-sparkle">✦</span>
        </div>
      </div>

      {/* Bottom Subfooter */}
      <div className="subfooter">
        <p className="subfooter-copy">
          © {new Date().getFullYear()} Susanta Kumar Badatya. All Rights Reserved.
        </p>
        <p className="subfooter-credit">
          Designed &amp; Developed by <strong style={{ color: '#e51c23' }}>Susanta Kumar Badatya</strong>
        </p>
      </div>
    </footer>
  );
}
