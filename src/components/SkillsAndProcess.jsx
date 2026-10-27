import React from 'react';
import { Search, Lightbulb, PenLine, Code2, Send } from 'lucide-react';

const skills = [
  'DIGITAL MARKETING',
  'WEBSITE DESIGN',
  'PORTFOLIO DESIGN',
  'WEB APPS DESIGN',
  'LOGO DESIGN',
  'GOOGLE ADS',
  'META ADS',
  'SOCIAL MEDIA MARKETING',
  'SEO BASICS',
  'GRAPHIC DESIGNING',
  'CANVA',
  'WEBFLOW',
];

const processSteps = [
  {
    num: '01',
    icon: Search,
    title: 'DISCOVER',
    desc: 'Understanding goals, audience, and project requirements.',
  },
  {
    num: '02',
    icon: Lightbulb,
    title: 'IDEATE',
    desc: 'Planning, wireframing, and creating the right concept.',
  },
  {
    num: '03',
    icon: PenLine,
    title: 'DESIGN',
    desc: 'Crafting visual design with a focus on user experience.',
  },
  {
    num: '04',
    icon: Code2,
    title: 'DEVELOP',
    desc: 'Building fast, responsive, and high-performing websites.',
  },
  {
    num: '05',
    icon: Send,
    title: 'DELIVER',
    desc: 'Testing, optimizing, and launching with perfection.',
  },
];

export default function SkillsAndProcess() {
  return (
    <section className="skills-process-section">
      <div className="skills-process-grid">
        {/* Column 1: Education & Skills */}
        <div className="sp-card education-skills-col">
          <h2 className="col-heading">EDUCATION &amp; SKILLS</h2>

          {/* Education Block */}
          <div className="edu-block">
            <h3 className="sub-heading">EDUCATION</h3>
            
            <div className="edu-item">
              <div className="edu-main">
                <h4 className="edu-degree">B.Tech in Electronics &amp; Communication Engineering</h4>
                <p className="edu-school">Centurion University</p>
              </div>
            </div>
          </div>

          {/* Skills Block */}
          <div className="skills-block">
            <h3 className="sub-heading">SKILLS</h3>
            <div className="skills-tags-wrap">
              {skills.map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Work Process Timeline */}
        <div className="sp-card process-col">
          <h2 className="col-heading">WORK PROCESS</h2>
          
          <div className="timeline-track">
            {processSteps.map((step, idx) => {
              const IconComponent = step.icon;
              return (
                <div key={step.num} className="timeline-step">
                  <span className="step-num">{step.num}</span>
                  <div className="step-node-col">
                    <div className="step-icon-circle">
                      <IconComponent size={14} />
                    </div>
                    {idx < processSteps.length - 1 && <div className="step-connector" />}
                  </div>
                  <div className="step-content">
                    <h4 className="step-title">{step.title}</h4>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Crimson Quote Card */}
        <div className="quote-card-col">
          <div className="quote-card-inner">
            <div className="quote-mark" aria-hidden="true">“</div>
            <p className="quote-text">
              Good design<br />
              is not just how<br />
              it looks, but how<br />
              it works.
            </p>
            <div className="quote-signature">Susanta</div>
            <div className="quote-footer">
              <p className="quote-footer-text">
                LET'S CREATE SOMETHING GREAT TOGETHER.
              </p>
              <span className="quote-sparkle">✦</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
