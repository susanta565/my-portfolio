import React from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const projects = [
  {
    id: '01',
    title: 'VELOCE BIKES',
    category: 'E-COMMERCE WEBSITE',
    image: '/assets/project-veloce.jpg',
    link: '#',
  },
  {
    id: '02',
    title: 'WOODCRAFT',
    category: 'FURNITURE WEBSITE',
    image: '/assets/project-woodcraft.jpg',
    link: '#',
  },
  {
    id: '03',
    title: 'URBANIC',
    category: 'FASHION MAGAZINE',
    image: '/assets/project-urbanic.jpg',
    link: '#',
  },
];

export default function SelectedProjects() {
  return (
    <section className="projects-section">
      {/* Section Header */}
      <div className="section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <h2 className="section-title">SELECTED PROJECTS</h2>
          <span className="section-badge">20+ PROJECTS</span>
        </div>
        <div className="section-line" />
        <a href="#all-projects" className="section-link">
          <span>VIEW ALL 20+ PROJECTS</span>
          <ArrowRight size={15} />
        </a>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-image-wrapper">
              <img
                src={project.image}
                alt={project.title}
                className="project-image"
                loading="lazy"
              />
              <div className="project-overlay">
                <span className="project-view-btn">
                  Explore <ArrowUpRight size={14} />
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
          </div>
        ))}
      </div>
    </section>
  );
}
