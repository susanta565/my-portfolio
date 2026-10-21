import React from 'react';
import BackgroundCanvas from './components/BackgroundCanvas';
import Hero from './components/Hero';
import SelectedProjects from './components/SelectedProjects';
import SkillsAndProcess from './components/SkillsAndProcess';
import ContactFooter from './components/ContactFooter';

export default function App() {
  return (
    <div className="portfolio-app">
      {/* 1. Fixed Background Scroll-Based Frame Animation */}
      <BackgroundCanvas />

      {/* 2. Interactive Foreground Portfolio Sections */}
      <div className="portfolio-content">
        <Hero />
        <SelectedProjects />
        <SkillsAndProcess />
        <ContactFooter />
      </div>
    </div>
  );
}
