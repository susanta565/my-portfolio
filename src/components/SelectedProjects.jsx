import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: '01',
    title: 'PAHADI DHABA',
    category: 'DHABA & CATERING SERVICES',
    image: '/assets/project-pahadi.jpg',
    link: 'https://pahadidhaba.com/',
  },
  {
    id: '02',
    title: 'BRIO KIDS',
    category: 'SPECIAL EDUCATION & CARE',
    image: '/assets/project-briokids.webp',
    link: 'https://brio-kids.com',
  },
  {
    id: '03',
    title: '3D INTERACTIVE PORTFOLIO',
    category: 'CREATIVE WEB DESIGN & 3D',
    image: '/assets/project-portfolio.jpg',
    link: 'https://susanta565-susanta-portfolio.vercel.app/',
  },
  {
    id: '04',
    title: 'CITY CHANDAN JEWELLERS',
    category: 'LUXURY JEWELLERY STORE',
    image: '/assets/project-citychandan.png',
    link: 'https://citychandanjewellers.com/',
  },
  {
    id: '05',
    title: 'DIGITAL MARKETING & GROWTH',
    category: 'META ADS • GOOGLE ADS • SEO STRATEGY',
    image: '/assets/project-marketing.svg',
    link: '#contact',
  },
];

export default function SelectedProjects() {
  return (
    <section className="projects-section" id="projects">
      {/* Section Header */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <h2 className="section-title">SELECTED PROJECTS</h2>
          <span className="section-badge">5 PROJECTS</span>
        </div>
        <div className="section-line" />
        <a href="#projects" className="section-link">
          <span>EXPLORE ALL 5 PROJECTS</span>
          <ArrowRight size={15} />
        </a>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.link}
            target={project.link.startsWith('http') ? '_blank' : '_self'}
            rel={project.link.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="project-card"
          >
            <div className="project-image-wrapper">
              <img
                src={project.image}
                alt={project.title}
                className="project-image"
                loading="lazy"
              />
              <div className="project-overlay">
                <span className="project-view-btn">
                  Visit Live Site <ArrowUpRight size={14} />
                </span>
              </div>
            </div>

            <div className="project-info">
              <span className="project-num">{project.id}</span>
              <div className="project-details">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-category">{project.category}</p>
              </div>
              <div className="project-arrow">
                <ArrowRight size={16} />
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
