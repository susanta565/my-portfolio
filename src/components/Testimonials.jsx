import React, { useState } from 'react';
import { Star, Quote, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Rakesh Mohapatra',
    role: 'Founder & Managing Director',
    company: 'Pahadi Dhaba & Catering Services',
    siteUrl: 'https://pahadidhaba.com/',
    tag: 'RESTAURANT & CATERING',
    rating: 5,
    initials: 'RM',
    accentColor: '#e51c23',
    feedback:
      'Susanta completely transformed our restaurant and catering brand online. Our table reservations and catering event bookings skyrocketed within the first month. Fast, responsive, and truly stylish design!',
  },
  {
    id: 2,
    name: 'Dr. Ananya Patnaik',
    role: 'Lead Director, Child Development',
    company: 'Briio Kids Special School',
    siteUrl: 'https://brio-kids.com',
    tag: 'EDUCATION & CARE',
    rating: 5,
    initials: 'AP',
    accentColor: '#3fae71',
    feedback:
      'The empathy, patience, and visual cleanliness Susanta brought to the Briio Kids website was extraordinary. Parents find the navigation seamless, and our admissions inquiries doubled in the first quarter.',
  },
  {
    id: 3,
    name: 'Chandan Kumar Sahoo',
    role: 'Managing Director',
    company: 'City Chandan Jewellers',
    siteUrl: 'https://citychandanjewellers.com/',
    tag: 'LUXURY JEWELLERY',
    rating: 5,
    initials: 'CS',
    accentColor: '#d4af37',
    feedback:
      'A luxury jewellery brand needs a luxury digital presence. Susanta delivered a world-class storefront that highlights our gold and bridal collections with prestige. Client feedback has been phenomenal.',
  },
  {
    id: 4,
    name: 'Priyanka Sen',
    role: 'Growth Marketing Head',
    company: 'Apex Digital Scale',
    siteUrl: null,
    tag: 'DIGITAL MARKETING & ADS',
    rating: 5,
    initials: 'PS',
    accentColor: '#ff5258',
    feedback:
      "Susanta's 1-year digital marketing expertise combined with sharp creative web design gives him a rare edge. His Google & Meta ad funnels delivered a 380% surge in qualified leads with a strong ROAS.",
  },
  {
    id: 5,
    name: 'Arun Verma',
    role: 'Co-Founder & Product Lead',
    company: 'Creative Tech Studio',
    siteUrl: 'https://susanta565-susanta-portfolio.vercel.app/',
    tag: '3D WEB & INTERACTIVE',
    rating: 5,
    initials: 'AV',
    accentColor: '#60a5fa',
    feedback:
      'The smooth 3D animations, cinematic flow, and mobile optimization on our interactive platform blew our team away. Susanta is one of the most reliable and forward-thinking creators we have partnered with.',
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="testimonials-section" id="testimonials">
      {/* Section Header */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <h2 className="section-title">CLIENT TESTIMONIALS</h2>
          <span className="section-badge">5 HAPPY CLIENTS</span>
        </div>
        <div className="section-line" />
        <div className="testimonials-controls">
          <button
            onClick={handlePrev}
            className="testimonial-nav-btn"
            aria-label="Previous testimonial"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            className="testimonial-nav-btn"
            aria-label="Next testimonial"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Featured Client Banner Quote */}
      <div className="featured-testimonial-card">
        <div className="featured-quote-icon">
          <Quote size={28} />
        </div>
        
        <div className="featured-body">
          <div className="stars-row">
            {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
              <Star key={i} size={15} fill="#e51c23" color="#e51c23" />
            ))}
            <span className="verified-pill">
              <CheckCircle size={11} />
              VERIFIED CLIENT
            </span>
          </div>

          <p className="featured-feedback-text">
            "{testimonials[activeIndex].feedback}"
          </p>

          <div className="featured-author-row">
            <div
              className="author-avatar"
              style={{ borderColor: testimonials[activeIndex].accentColor }}
            >
              {testimonials[activeIndex].initials}
            </div>
            <div className="author-details">
              <h4 className="author-name">{testimonials[activeIndex].name}</h4>
              <p className="author-company">
                {testimonials[activeIndex].role} •{' '}
                {testimonials[activeIndex].siteUrl ? (
                  <a
                    href={testimonials[activeIndex].siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="company-link"
                  >
                    {testimonials[activeIndex].company} ↗
                  </a>
                ) : (
                  <span>{testimonials[activeIndex].company}</span>
                )}
              </p>
            </div>
            <span className="testimonial-tag-badge">
              {testimonials[activeIndex].tag}
            </span>
          </div>
        </div>
      </div>

      {/* Testimonials Bento Grid */}
      <div className="testimonials-grid">
        {testimonials.map((t, idx) => (
          <div
            key={t.id}
            onClick={() => setActiveIndex(idx)}
            className={`testimonial-card ${idx === activeIndex ? 'active' : ''}`}
          >
            <div className="card-top">
              <div className="stars-mini">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={12} fill="#e51c23" color="#e51c23" />
                ))}
              </div>
              <span className="card-tag">{t.tag}</span>
            </div>

            <p className="card-quote">"{t.feedback}"</p>

            <div className="card-client">
              <div
                className="client-initials"
                style={{ borderColor: t.accentColor }}
              >
                {t.initials}
              </div>
              <div className="client-meta">
                <span className="client-name">{t.name}</span>
                <span className="client-role">{t.company}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
